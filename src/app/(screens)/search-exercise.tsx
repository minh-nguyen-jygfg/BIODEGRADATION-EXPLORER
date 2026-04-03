import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth-provider'
import { useDate } from '@/context/date-context'
import { ExerciseService } from '@/services/exercise.service'

type ExerciseOption = {
  id: string
  name: string
  calories: number
  duration: number
  category: string
}

const SearchExerciseScreen = () => {
  const { user } = useAuth()
  const { selectedDate, triggerRefresh } = useDate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedExercise, setSelectedExercise] = useState<ExerciseOption | null>(null)
  const [showDurationModal, setShowDurationModal] = useState(false)
  const [duration, setDuration] = useState(30)
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: 'cardio', name: 'Vận động nhẹ (Cải thiện linh hoạt)', count: 29 },
    { id: 'strength', name: 'Cardio (Đốt cháy mỡ thừa)', count: 23 },
    { id: 'flexibility', name: 'Kháng lực (Tăng cơ & Sức mạnh)', count: 16 },
    { id: 'sports', name: 'Thể thao & Giải trí', count: 12 },
  ]

  const exercises: ExerciseOption[] = [
    { id: '1', name: 'Đi bộ thong thả', calories: 120, duration: 30, category: 'cardio' },
    { id: '2', name: 'Yoga cơ bản', calories: 100, duration: 30, category: 'flexibility' },
    { id: '3', name: 'Làm việc nhà', calories: 110, duration: 30, category: 'cardio' },
    { id: '4', name: 'Chạy bộ chậm', calories: 300, duration: 30, category: 'cardio' },
    { id: '5', name: 'Đạp xe', calories: 250, duration: 30, category: 'cardio' },
    { id: '6', name: 'Nhảy dây', calories: 200, duration: 15, category: 'cardio' },
    { id: '7', name: 'Bơi lội', calories: 260, duration: 30, category: 'cardio' },
    { id: '8', name: 'Squat & Lunge', calories: 150, duration: 20, category: 'strength' },
    { id: '9', name: 'Plank', calories: 300, duration: 10, category: 'strength' },
    { id: '10', name: 'Hit đất', calories: 120, duration: 15, category: 'strength' },
    { id: '11', name: 'Tập tạ nhẹ', calories: 180, duration: 30, category: 'strength' },
  ]

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(ex.category)
    return matchesSearch && matchesCategory
  })

  const handleBack = () => {
    router.back()
  }

  const handleExercisePress = (exercise: ExerciseOption) => {
    setSelectedExercise(exercise)
    setDuration(exercise.duration)
    setShowDurationModal(true)
  }

  const handleAddExercise = async () => {
    if (!user?.id) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập')
      return
    }

    if (!selectedExercise) return

    setLoading(true)
    try {
      // Map category to exercise type
      const exerciseTypeMap: Record<string, 'cardio' | 'strength' | 'yoga' | 'sport' | 'other'> = {
        cardio: 'cardio',
        strength: 'strength',
        flexibility: 'yoga',
        sports: 'sport',
      }
      const exerciseType = exerciseTypeMap[selectedExercise.category] || 'other'

      // Calculate calories for the actual duration
      const caloriesPerMinute = selectedExercise.calories / selectedExercise.duration
      const calories = Math.round(caloriesPerMinute * duration)

      const success = await ExerciseService.addExerciseLog(
        user.id,
        exerciseType,
        duration,
        calories,
        selectedExercise.name, // Use exercise name as notes
        selectedDate
      )

      if (success) {
        // Trigger refresh for home and exercise screens
        triggerRefresh()

        Alert.alert('Thành công', 'Đã thêm bài tập', [
          {
            text: 'OK',
            onPress: () => {
              setShowDurationModal(false)
              router.back()
            },
          },
        ])
      } else {
        Alert.alert('Lỗi', 'Không thể thêm bài tập')
      }
    } catch (error) {
      console.error('Error adding exercise:', error)
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thêm bài tập')
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1 pt-10">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 bg-white">
          <TouchableOpacity
            onPress={handleBack}
            className="mr-4"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="flex-1 text-xl font-bold text-gray-900">
            Tìm kiếm tập luyện
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-4 bg-white">
          <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2 text-base text-gray-900"
            />
            <TouchableOpacity onPress={() => setShowFilterModal(true)}>
              <Ionicons name="options-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Exercise List */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {filteredExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              onPress={() => handleExercisePress(exercise)}
              className="bg-white rounded-2xl p-4 mb-3"
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold text-gray-900 mb-1">
                {exercise.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {exercise.calories} kcal  {exercise.duration} phút
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter Modal */}
        <Modal
          visible={showFilterModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View className="flex-1 justify-end">
            <TouchableOpacity
              className="flex-1 bg-black/50"
              onPress={() => setShowFilterModal(false)}
              activeOpacity={1}
            />
            <View className="bg-white rounded-t-3xl p-6">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Lọc theo</Text>
                <TouchableOpacity onPress={() => setSelectedCategories([])}>
                  <Ionicons name="refresh" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Categories */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-4">
                  Danh mục
                </Text>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => toggleCategory(category.id)}
                    className="flex-row items-center justify-between py-4 border-b border-gray-100"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-5 h-5 rounded border-2 mr-3 items-center justify-center"
                        style={{
                          borderColor: selectedCategories.includes(category.id)
                            ? '#22C55E'
                            : '#D1D5DB',
                          backgroundColor: selectedCategories.includes(category.id)
                            ? '#22C55E'
                            : 'transparent',
                        }}
                      >
                        {selectedCategories.includes(category.id) && (
                          <Ionicons name="checkmark" size={14} color="#FFF" />
                        )}
                      </View>
                      <Text className="text-base text-gray-900 flex-1">
                        {category.name}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-400">{category.count}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Apply Button */}
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                className="bg-blue-600 rounded-2xl py-4 items-center"
                activeOpacity={0.8}
              >
                <Text className="text-white text-lg font-semibold">Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Duration Modal */}
        <Modal
          visible={showDurationModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDurationModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-3xl p-6 mx-6 w-[85%]">
              {selectedExercise && (
                <>
                  <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {selectedExercise.name}
                  </Text>
                  <Text className="text-sm text-gray-500 mb-8 text-center">
                    {Math.round((selectedExercise.calories / selectedExercise.duration) * duration)} kcal  {duration} phút
                  </Text>

                  {/* Duration Control */}
                  <View className="items-center mb-8">
                    <View className="flex-row items-center gap-6">
                      <TouchableOpacity
                        onPress={() => setDuration((prev) => Math.max(5, prev - 5))}
                        className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center"
                      >
                        <Text className="text-3xl font-bold text-gray-700">−</Text>
                      </TouchableOpacity>

                      <View className="items-center min-w-[100px]">
                        <Text className="text-6xl font-bold text-gray-900">{duration}</Text>
                        <Text className="text-sm text-gray-500 mt-1">(phút)</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => setDuration((prev) => prev + 5)}
                        className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center"
                      >
                        <Text className="text-3xl font-bold text-gray-700">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Buttons */}
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => setShowDurationModal(false)}
                      className="flex-1 bg-white border border-gray-300 rounded-2xl py-4 items-center"
                    >
                      <Text className="text-base font-semibold text-gray-900">Hủy bỏ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleAddExercise}
                      disabled={loading}
                      className="flex-1 bg-green-500 rounded-2xl py-4 items-center"
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFF" />
                      ) : (
                        <Text className="text-base font-semibold text-white">Thêm bài tập</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  )
}

export default SearchExerciseScreen
