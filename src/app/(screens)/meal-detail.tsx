import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'

type Props = {}

const MealDetailScreen = (props: Props) => {
  const [mealType, setMealType] = useState('Bữa sáng')
  const [portion, setPortion] = useState('Phần ăn (50g)')
  const [quantity, setQuantity] = useState(2)

  // Mock data
  const mealData = {
    name: 'Trứng ốp la',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800',
    weight: 100,
    calories: 140,
    protein: 6.3,
    fat: 4.8,
    carbs: 0.4,
  }

  const handleBack = () => {
    router.back()
  }

  const handleSave = () => {
    Alert.alert('Thành công', 'Đã lưu vào nhật ký')
    router.back()
  }

  // Calculate percentages for the donut chart
  const total = mealData.protein + mealData.fat + mealData.carbs
  const proteinPercent = (mealData.protein / total) * 100
  const fatPercent = (mealData.fat / total) * 100
  const carbsPercent = (mealData.carbs / total) * 100

  return (
    <View className="flex-1 bg-gray-50">
      {/* Hero Image Section */}
      <ImageBackground
        source={{ uri: mealData.image }}
        className="h-80"
        resizeMode="cover"
      >
        <View className="flex-1 bg-black/30 justify-between">
          {/* Back Button */}
          <TouchableOpacity
            onPress={handleBack}
            className="w-14 h-14 rounded-full bg-white items-center justify-center mt-14 ml-4"
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Meal Name */}
          <View className="p-6">
            <Text className="text-3xl font-bold text-white">
              {mealData.name}
            </Text>
          </View>
        </View>
      </ImageBackground>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Dropdowns */}
          <View className="mb-6">
            {/* Meal Type Dropdown */}
            <TouchableOpacity
              className="bg-white rounded-2xl px-4 py-4 mb-3 flex-row items-center justify-between"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text className="text-base text-gray-900">{mealType}</Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Portion and Quantity Row */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-white rounded-2xl px-4 py-4 flex-row items-center justify-between"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Text className="text-base text-gray-900 flex-1">{portion}</Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <View
                className="bg-white rounded-2xl px-4 py-4 justify-center"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                  minWidth: 80,
                }}
              >
                <Text className="text-base text-gray-900">{quantity}</Text>
              </View>
            </View>

            {/* Weight */}
            <Text className="text-base text-gray-900 mt-4">
              Nặng: {mealData.weight}g
            </Text>
          </View>

          {/* Nutrition Info */}
          <View>
            <Text className="text-xl font-bold text-gray-900 mb-6">
              Thành phần dinh dưỡng
            </Text>

            <View className="items-center mb-6">
              {/* Donut Chart */}
              <View className="relative items-center justify-center mb-6">
                <View className="w-48 h-48 items-center justify-center">
                  {/* Simple colored arcs representation */}
                  <View className="absolute w-48 h-48 rounded-full border-[30px] border-cyan-500" 
                    style={{ 
                      borderTopColor: '#06B6D4',
                      borderRightColor: '#EF4444', 
                      borderBottomColor: '#10B981',
                      borderLeftColor: '#06B6D4',
                    }} 
                  />
                  <View className="absolute bg-white rounded-full w-32 h-32 items-center justify-center">
                    <Text className="text-4xl font-bold text-gray-900">
                      {mealData.calories}
                    </Text>
                    <Text className="text-sm text-gray-500">kcal</Text>
                  </View>
                </View>
              </View>

              {/* Macros List */}
              <View className="w-full">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 rounded-full bg-cyan-500 mr-2" />
                    <Text className="text-base text-gray-900">Đạm</Text>
                  </View>
                  <Text className="text-base font-semibold text-gray-900">
                    {mealData.protein} g
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 rounded-full bg-red-500 mr-2" />
                    <Text className="text-base text-gray-900">Béo</Text>
                  </View>
                  <Text className="text-base font-semibold text-gray-900">
                    {mealData.fat} g
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                    <Text className="text-base text-gray-900">Tinh bột</Text>
                  </View>
                  <Text className="text-base font-semibold text-gray-900">
                    {mealData.carbs} g
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="px-6 pb-8 pt-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-blue-600 rounded-2xl py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">
            Lưu vào nhật ký
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MealDetailScreen
