import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Cup from '~/assets/icons/home/cup'
import CupActive from '~/assets/icons/home/cup_active'

type Props = {
  initialAmount?: number
  targetAmount?: number
  selectedDate?: string // Add selected date prop
  onAmountChange?: (delta: number) => void // Delta: +250 or -250
}

const WaterTracker = ({ initialAmount = 1200, targetAmount = 2000, selectedDate, onAmountChange }: Props) => {
  const [waterAmount, setWaterAmount] = useState(initialAmount)
  
  // Update water amount when initialAmount changes (e.g., date switch)
  useEffect(() => {
    setWaterAmount(initialAmount)
  }, [initialAmount])
  
  const glassSize = 250 // ml per glass
  const totalGlasses = 8
  const filledGlasses = Math.floor(waterAmount / glassSize)

  const handleIncrement = () => {
    if (waterAmount >= targetAmount) return
    
    const newAmount = Math.min(waterAmount + glassSize, targetAmount)
    setWaterAmount(newAmount) // Update UI immediately
    onAmountChange?.(glassSize) // Send delta (+250) to add to DB
  }

  const handleDecrement = () => {
    if (waterAmount === 0) return
    
    const newAmount = Math.max(waterAmount - glassSize, 0)
    setWaterAmount(newAmount) // Update UI immediately
    onAmountChange?.(-glassSize) // Send delta (-250) to subtract from DB
  }

  return (
    <View className="mb-6">
      <Text className="text-base font-semibold text-gray-900 mb-4">Theo dõi uống nước</Text>
      
      <View className="bg-[#FFFFFF52] rounded-3xl">
        {/* Amount Display */}
        <View className="flex-row items-baseline p-4 justify-between mb-4">
          <View className="flex-row items-baseline">
            <Text className="text-5xl font-bold text-gray-900">{waterAmount}ml</Text>
            <Text className="text-base text-gray-500 ml-2">/{targetAmount}ml</Text>
          </View>

          {/* Controls */}
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={handleDecrement}
              disabled={waterAmount === 0}
              className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
            >
              <Text className="text-2xl font-bold text-gray-700">−</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleIncrement}
              disabled={waterAmount >= targetAmount}
              className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
            >
              <Text className="text-2xl font-bold text-gray-700">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Water Glasses Visualization */}
        <View className="flex-row gap-2 bg-[#FFFFFF7A] p-4 rounded-3xl justify-between">
          {Array.from({ length: totalGlasses }).map((_, index) => {
            const isFilled = index < filledGlasses
            return (
              <View key={index} className="items-center justify-center">
                {isFilled ? (
                  <CupActive width={32} height={32} />
                ) : (
                  <Cup width={32} height={32} />
                )}
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default WaterTracker
