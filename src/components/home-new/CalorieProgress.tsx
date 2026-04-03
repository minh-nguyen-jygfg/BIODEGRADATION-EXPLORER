import { Text, View } from 'react-native'
import React from 'react'

type Macros = {
  protein: { current: number; target: number }
  fat: { current: number; target: number }
  carbs: { current: number; target: number }
}

type Props = {
  currentCalories: number
  targetCalories: number
  macros: Macros
}

const CalorieProgress = ({ currentCalories, targetCalories, macros }: Props) => {
  const percentage = (currentCalories / targetCalories) * 100
  const remaining = targetCalories - currentCalories

  return (
    <View className="mb-6 bg-[#FFFFFF52] p-2 rounded-xl">
      {/* Calories Remaining */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-medium text-gray-900">Calo còn thiếu</Text>
        <View className="flex-row items-center">
          <Text className="text-xl font-bold text-gray-900 mr-1">🔥 {remaining}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mb-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </View>

      {/* Macros Breakdown */}
      <View className="flex-row justify-between">
        {/* Protein */}
        <View>
          <Text className="text-sm text-cyan-500 mb-1">Đạm</Text>
          <Text className="text-base text-gray-900">
            {macros.protein.current}/{macros.protein.target}
            <Text className="text-sm font-normal text-gray-500"> gr</Text>
          </Text>
        </View>

        {/* Fat */}
        <View>
          <Text className="text-sm text-red-500 mb-1">Béo</Text>
          <Text className="text-base text-gray-900">
            {macros.fat.current}/{macros.fat.target}
            <Text className="text-sm font-normal text-gray-500"> gr</Text>
          </Text>
        </View>

        {/* Carbs */}
        <View>
          <Text className="text-sm text-green-500 mb-1">Tinh bột</Text>
          <Text className="text-base text-gray-900">
            {macros.carbs.current}/{macros.carbs.target}
            <Text className="text-sm font-normal text-gray-500"> gr</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

export default CalorieProgress
