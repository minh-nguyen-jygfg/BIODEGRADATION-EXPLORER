import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'

type Props = {
  notificationCount?: number
}

const MealHeader = ({ notificationCount = 0 }: Props) => {
  const handleNotificationPress = () => {
    router.push(ERouteTable.NOTIFICATIONS)
  }

  return (
    <View className="flex-row items-center justify-between mb-6">
      <Text className="text-2xl font-bold text-gray-900">Bữa ăn</Text>

      {/* Notification Bell */}
      <TouchableOpacity
        onPress={handleNotificationPress}
        className="relative bg-white rounded-full p-3 shadow-sm"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Ionicons name="notifications-outline" size={24} color="#000" />
        {notificationCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-cyan-500 rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-white text-xs font-bold">{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default MealHeader
