import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import ExerciseDurationModal from '@/components/exercise/ExerciseDurationModal'
import { useAuth } from '@/context/auth-provider'
import { useDate } from '@/context/date-context'
import { ExerciseService } from '@/services/exercise.service'
import { Database } from '@/types/database.types'

type ExerciseLog = Database['public']['Tables']['exercise_logs']['Row']

type ExerciseItem = {
  id: string
  name: string
  calories: number
  duration: number // minutes
}

const ExerciseScreen = () => {
  const { user } = useAuth()
  const { selectedDate, refreshTrigger, triggerRefresh } = useDate()
  const [exercises, setExercises] = useState<ExerciseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null)

  // Load exercises from database
  const loadExercises = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      const logs = await ExerciseService.getExerciseLogs(user.id, selectedDate)
      const exerciseItems: ExerciseItem[] = logs.map((log) => ({
        id: log.id,
        name: getExerciseName(log.exercise_type),
        calories: log.calories_burned || 0,
        duration: log.duration_minutes,
      }))
      setExercises(exerciseItems)
    } catch (error) {
      console.error('Error loading exercises:', error)
      Alert.alert('Lỗi', 'Không thể tải dữ liệu tập luyện')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Convert exercise type to Vietnamese name
  const getExerciseName = (type: string): string => {
    const names: Record<string, string> = {
      cardio: 'Cardio',
      strength: 'Tập sức mạnh',
      yoga: 'Yoga',
      sport: 'Thể thao',
      other: 'Khác',
    }
    return names[type] || type
  }

  // Load on mount and when date or refreshTrigger changes
  useEffect(() => {
    if (user?.id) {
      loadExercises()
    } else {
      setLoading(false)
    }
  }, [user, selectedDate, refreshTrigger])

  const totalCalories = exercises.reduce((sum, ex) => sum + ex.calories, 0)

  const handleBack = () => {
    router.back()
  }

  const handleRemoveExercise = async (id: string) => {
    try {
      const success = await ExerciseService.deleteExerciseLog(id)
      if (success) {
        setExercises((prev) => prev.filter((ex) => ex.id !== id))
        setModalVisible(false)
        // Trigger refresh for home screen so TDEE and exercise minutes update
        triggerRefresh()
      } else {
        Alert.alert('Lỗi', 'Không thể xóa bài tập')
      }
    } catch (error) {
      console.error('Error removing exercise:', error)
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa bài tập')
    }
  }

  const handleExercisePress = (exercise: ExerciseItem) => {
    setSelectedExercise(exercise)
    setModalVisible(true)
  }

  const handleUpdateDuration = (newDuration: number) => {
    if (selectedExercise) {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === selectedExercise.id
            ? { ...ex, duration: newDuration, calories: Math.round((ex.calories / ex.duration) * newDuration) }
            : ex
        )
      )
    }
  }

  const handleAddExercise = () => {
    router.push(ERouteTable.SEARCH_EXERCISE)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadExercises()
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ImageBackground source={images.bgSplash} className="flex-1 w-full">
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#A78BFA" />
          </View>
        </ImageBackground>
      </View>
    )
  }

  return (
    <View className="flex-1">
      <ImageBackground source={images.bgSplash} className="flex-1 pt-10">
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              style={{ marginRight: 16 }}
            >
              <View className="w-12 h-12 rounded-full bg-white items-center justify-center">
                <Ionicons name="chevron-back" size={24} color="#000" />
              </View>
            </TouchableOpacity>
            <Text className="flex-1 text-center text-xl font-bold text-gray-900">
              Tập luyện
            </Text>
            <View className="w-12 h-12" />
          </View>

          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#A78BFA"
                colors={['#A78BFA']}
              />
            }
          >
            {/* Journal Section */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold text-gray-900">
                  Nhật ký
                </Text>
                <Text className="text-base font-medium text-gray-600">
                  {totalCalories} kcal
                </Text>
              </View>

              {/* Exercise List */}
              {exercises.length === 0 ? (
                <View className="py-8 items-center">
                  <Text className="text-base text-gray-500">
                    Chưa có bài tập nào
                  </Text>
                </View>
              ) : (
                exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  onPress={() => handleExercisePress(exercise)}
                  className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 mb-1">
                        {exercise.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {exercise.calories} kcal  {exercise.duration} phút
                      </Text>
                    </View>

                    {/* Remove Button */}
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation()
                        handleRemoveExercise(exercise.id)
                      }}
                      className="p-2"
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="close" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>

          {/* Add Exercise Button - Fixed at bottom */}
          <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-white/80 backdrop-blur-lg">
            <TouchableOpacity
              onPress={handleAddExercise}
              className="bg-blue-600 rounded-2xl py-4 items-center"
              activeOpacity={0.8}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="text-white text-lg font-semibold">
                Thêm tập luyện
              </Text>
            </TouchableOpacity>
          </View>

          {/* Duration Modal */}
          <ExerciseDurationModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            exercise={selectedExercise}
            onUpdate={handleUpdateDuration}
            onCancel={() => selectedExercise && handleRemoveExercise(selectedExercise.id)}
          />
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

export default ExerciseScreen
