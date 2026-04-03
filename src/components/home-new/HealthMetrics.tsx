import { Text, View } from 'react-native'
import React from 'react'

type Props = {
  bmi: number
  tdee: number
}

const HealthMetrics = ({ bmi, tdee }: Props) => {
  return (
    <View className="flex-row gap-3 mb-6">
      {/* BMI Card */}
      <View className="flex-1 bg-[#FFFFFF52] rounded-3xl p-5">
        <Text className="text-sm font-medium text-gray-600 mb-1">BMI</Text>
        <Text className="text-4xl font-bold text-gray-900">{bmi}</Text>
      </View>

      {/* TDEE Card */}
      <View className="flex-1 bg-[#FFFFFF52] rounded-3xl p-5">
        <Text className="text-sm font-medium text-gray-600 mb-1">TDEE</Text>
        <Text className="text-4xl font-bold text-gray-900">
          {tdee}
          <Text className="text-sm font-normal text-gray-500"> Kcal/ngày</Text>
        </Text>
      </View>
    </View>
  )
}

export default HealthMetrics
