import { Modal, Text, TouchableOpacity, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  visible: boolean
  onClose: () => void
  exercise: {
    name: string
    calories: number
    duration: number
  } | null
  onUpdate: (duration: number) => void
  onCancel: () => void
}

const ExerciseDurationModal = ({ visible, onClose, exercise, onUpdate, onCancel }: Props) => {
  const [duration, setDuration] = useState(exercise?.duration || 30)

  React.useEffect(() => {
    if (exercise) {
      setDuration(exercise.duration)
    }
  }, [exercise])

  const handleIncrement = () => {
    setDuration((prev) => prev + 5)
  }

  const handleDecrement = () => {
    setDuration((prev) => Math.max(5, prev - 5))
  }

  const handleUpdate = () => {
    onUpdate(duration)
    onClose()
  }

  const handleCancel = () => {
    onCancel()
    onClose()
  }

  if (!exercise) return null

  const caloriesPerMinute = exercise.calories / exercise.duration
  const calculatedCalories = Math.round(caloriesPerMinute * duration)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-3xl p-6 mx-6 w-[85%]"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            {exercise.name}
          </Text>
          <Text className="text-sm text-gray-500 mb-8 text-center">
            {calculatedCalories} kcal  {duration} phút
          </Text>

          {/* Duration Control */}
          <View className="items-center mb-8">
            <View className="flex-row items-center gap-6">
              <TouchableOpacity
                onPress={handleDecrement}
                className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-3xl font-bold text-gray-700">−</Text>
              </TouchableOpacity>

              <View className="items-center min-w-[100px]">
                <Text className="text-6xl font-bold text-gray-900">{duration}</Text>
                <Text className="text-sm text-gray-500 mt-1">(phút)</Text>
              </View>

              <TouchableOpacity
                onPress={handleIncrement}
                className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-3xl font-bold text-gray-700">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-1 bg-white border border-gray-300 rounded-2xl py-4 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold text-gray-900">
                Hủy bỏ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleUpdate}
              className="flex-1 bg-green-500 rounded-2xl py-4 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold text-white">
                Cập nhật
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default ExerciseDurationModal
