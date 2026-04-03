import { Text, View } from 'react-native'
import React from 'react'

type Props = {
  calories: number
}

const CalorieCard = ({ calories }: Props) => {
  return (
    <View className="mb-4">
      <Text className="text-base text-gray-900 mb-2">Calo hôm nay</Text>
      <View className="flex-row items-baseline">
        <Text className="text-6xl font-bold text-gray-900">
          {calories.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).replace(',', '.')}
        </Text>
        <Text className="text-2xl font-medium text-gray-900 ml-2">Kcal</Text>
      </View>
    </View>
  )
}

export default CalorieCard
