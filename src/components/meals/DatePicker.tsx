import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  onDateChange?: (date: Date) => void
}

const DatePicker = ({ onDateChange }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const formatDate = (date: Date) => {
    const days = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7']
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = date.getMonth() + 1
    return `${dayName}, ${day} thg ${month}`
  }

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() - 1)
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + 1)
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  return (
    <View className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-3 mb-6 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <TouchableOpacity onPress={handlePrevDay} className="p-2">
        <Ionicons name="chevron-back" size={20} color="#6B7280" />
      </TouchableOpacity>

      <View className="flex-row items-center">
        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
        <Text className="text-base font-medium text-gray-900 ml-2">
          {formatDate(selectedDate)}
        </Text>
      </View>

      <TouchableOpacity onPress={handleNextDay} className="p-2">
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  )
}

export default DatePicker
