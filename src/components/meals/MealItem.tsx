import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export type MealItemType = {
  id: string
  name: string
  image: string
  calories: number
  weight: number
  protein: number
  fat: number
  carbs: number
}

type Props = {
  meal: MealItemType
  onRemove: (id: string) => void
  onPress: (meal: MealItemType) => void
}

const MealItem = ({ meal, onRemove, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(meal)}
      className="flex-row items-center bg-white rounded-2xl p-3 mb-3 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
      activeOpacity={0.7}
    >
      {/* Image */}
      <Image
        source={{ uri: meal.image }}
        className="w-20 h-20 rounded-xl"
        resizeMode="cover"
      />

      {/* Content */}
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-gray-900 mb-1">
          {meal.name}
        </Text>
        <Text className="text-sm text-gray-500 mb-2">
          {meal.calories} kcal  {meal.weight}gr
        </Text>

        {/* Macros */}
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-cyan-500 mr-1" />
            <Text className="text-xs text-gray-600">{meal.protein}g</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-red-500 mr-1" />
            <Text className="text-xs text-gray-600">{meal.fat}g</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
            <Text className="text-xs text-gray-600">{meal.carbs}g</Text>
          </View>
        </View>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        onPress={() => onRemove(meal.id)}
        className="p-2"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={24} color="#9CA3AF" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default MealItem
