import { Text, View } from 'react-native'
import React from 'react'
import MealItem, { MealItemType } from './MealItem'

type Props = {
  title: string
  totalCalories: number
  meals: MealItemType[]
  onRemoveMeal: (id: string) => void
  onPressMeal: (meal: MealItemType) => void
}

const MealSection = ({ title, totalCalories, meals, onRemoveMeal, onPressMeal }: Props) => {
  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
        <Text className="text-base font-medium text-gray-600">
          {totalCalories} kcal
        </Text>
      </View>

      {meals.map((meal) => (
        <MealItem
          key={meal.id}
          meal={meal}
          onRemove={onRemoveMeal}
          onPress={onPressMeal}
        />
      ))}
    </View>
  )
}

export default MealSection
