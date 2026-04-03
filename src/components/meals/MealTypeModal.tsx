import { Modal, Text, TouchableOpacity, View, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Breakfast from '~/assets/icons/popup-add/breakfast'
import Lunch from '~/assets/icons/popup-add/lunch'
import Dinner from '~/assets/icons/popup-add/dinner'
import Snack from '~/assets/icons/popup-add/snack'
import Exercise from '~/assets/icons/popup-add/exercise'
import Sleep from '~/assets/icons/popup-add/sleep'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'exercise' | 'sleep'

type MealOption = {
  id: MealType
  icon: React.ComponentType<any>
  label: string
  color: string
  borderColor: string
}

type Props = {
  visible: boolean
  onClose: () => void
  onSelectMealType: (type: MealType) => void
}

const mealOptions: MealOption[] = [
  {
    id: 'breakfast',
    icon: Breakfast,
    label: 'Bữa sáng',
    color: '#FEE2E2',
    borderColor: '#FF5630',
  },
  {
    id: 'lunch',
    icon: Lunch,
    label: 'Bữa trưa',
    color: '#FEF3C7',
    borderColor: '#FFAB00',
  },
  {
    id: 'dinner',
    icon: Dinner,
    label: 'Bữa tối',
    color: '#DBEAFE',
    borderColor: '#00B8D9',
  },
  {
    id: 'snack',
    icon: Snack,
    label: 'Ăn vặt',
    color: '#E0E7FF',
    borderColor: '#477AFF',
  },
  {
    id: 'exercise',
    icon: Exercise,
    label: 'Tập luyện',
    color: '#FED7AA',
    borderColor: '#FFAB00',
  },
  {
    id: 'sleep',
    icon: Sleep,
    label: 'Giờ ngủ',
    color: '#D1FAE5',
    borderColor: '#22C55E',
  },
]

const MealTypeModal = ({ visible, onClose, onSelectMealType }: Props) => {
  const handleSelect = (type: MealType) => {
    onSelectMealType(type)
    onClose()
  }

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
          className="bg-white rounded-3xl p-6 mx-6 w-[90%] max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-lg font-semibold text-gray-400 mb-6 text-center">
            Thêm thông tin
          </Text>

          {/* Grid of options */}
          <View className="flex-row flex-wrap justify-between">
            {mealOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleSelect(option.id)}
                  className="w-[30%] mb-6 items-center"
                  activeOpacity={0.7}
                >
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: option.borderColor,
                    }}
                  >
                    <IconComponent width={32} height={32} />
                  </View>
                  <Text className="text-sm font-medium text-gray-900 text-center">
                    {option.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default MealTypeModal
