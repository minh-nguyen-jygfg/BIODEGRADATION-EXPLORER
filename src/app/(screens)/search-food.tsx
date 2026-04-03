import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/context/auth-provider'
import { useDate } from '@/context/date-context'
import { MealsService } from '@/services/meals.service'
import { Database } from '@/types/database.types'

type Meal = Database['public']['Tables']['meals']['Row']

type FoodItem = {
  id: string
  name: string
  image: string
  calories: number
  weight: number
  protein?: number
  fat?: number
  carbs?: number
  category: string
  isRecent?: boolean
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

const SearchFoodScreen = () => {
  const { user } = useAuth()
  const { selectedDate, triggerRefresh } = useDate()
  const params = useLocalSearchParams()
  const mealType = (params.mealType as MealType) || 'breakfast'
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Meal[]>([])
  const [popularMeals, setPopularMeals] = useState<Meal[]>([])

  // Load popular meals on mount
  useEffect(() => {
    loadPopularMeals()
  }, [])

  // Search meals when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchMeals()
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const loadPopularMeals = async () => {
    try {
      const meals = await MealsService.getPopularMeals(10)
      setPopularMeals(meals)
    } catch (error) {
      console.error('Error loading popular meals:', error)
    }
  }

  const searchMeals = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const results = await MealsService.searchMeals(searchQuery, 20)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching meals:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'breakfast', name: 'Bữa sáng', count: 45 },
    { id: 'lunch', name: 'Bữa trưa', count: 32 },
    { id: 'dinner', name: 'Bữa tối', count: 28 },
    { id: 'morning_snack', name: 'Ăn vặt', count: 15 },
  ]

  // Display logic
  const displayedPopularMeals = searchQuery ? [] : popularMeals
  const displayedSearchResults = searchQuery ? searchResults : []

  const handleBack = () => {
    router.back()
  }

  const handleFoodPress = async (meal: Meal) => {
    if (!user?.id) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để thêm món ăn')
      return
    }

    try {
      setLoading(true)
      const success = await MealsService.addMealLog(
        user.id,
        meal.id,
        selectedDate,
        mealType
      )

      if (success) {
        // Trigger refresh for home and story screens
        triggerRefresh()
        
        Alert.alert('Thành công', 'Đã thêm món ăn vào nhật ký', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ])
      } else {
        Alert.alert('Lỗi', 'Không thể thêm món ăn')
      }
    } catch (error) {
      console.error('Error adding meal:', error)
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thêm món ăn')
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
            Tìm kiếm món ăn
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

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {loading && (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#A78BFA" />
            </View>
          )}

          {/* Popular Meals Section */}
          {!loading && displayedPopularMeals.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Món ăn phổ biến
              </Text>
              {displayedPopularMeals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  onPress={() => handleFoodPress(meal)}
                  className="flex-row items-center bg-white rounded-2xl p-3 mb-3"
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: meal.image_url || 'https://via.placeholder.com/64' }}
                    className="w-16 h-16 rounded-xl"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      {meal.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {meal.calories} kcal
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Search Results Section */}
          {!loading && displayedSearchResults.length > 0 && (
            <View>
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Kết quả tìm kiếm
              </Text>
              {displayedSearchResults.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  onPress={() => handleFoodPress(meal)}
                  className="flex-row items-center bg-white rounded-2xl p-3 mb-3"
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: meal.image_url || 'https://via.placeholder.com/64' }}
                    className="w-16 h-16 rounded-xl"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      {meal.name}
                    </Text>
                    <Text className="text-sm text-gray-500 mb-2">
                      {meal.calories} kcal
                    </Text>
                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-cyan-500 mr-1" />
                        <Text className="text-xs text-gray-600">{meal.protein_g || 0}g</Text>
                      </View>
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-red-500 mr-1" />
                        <Text className="text-xs text-gray-600">{meal.fats_g || 0}g</Text>
                      </View>
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                        <Text className="text-xs text-gray-600">{meal.carbs_g || 0}g</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Empty State */}
          {!loading && searchQuery && displayedSearchResults.length === 0 && (
            <View className="py-8 items-center">
              <Text className="text-base text-gray-500">
                Không tìm thấy món ăn phù hợp
              </Text>
            </View>
          )}
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
      </SafeAreaView>
    </View>
  )
}

export default SearchFoodScreen
