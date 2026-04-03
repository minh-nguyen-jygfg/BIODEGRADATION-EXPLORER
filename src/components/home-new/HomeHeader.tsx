import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  userName: string
  avatar: string
  notificationCount?: number
  onNotificationPress?: () => void
}

const HomeHeader = ({ userName, avatar, notificationCount = 0, onNotificationPress }: Props) => {
  return (
    <View className="flex-row items-center justify-between mb-6">
      {/* User Info */}
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: avatar }} className="w-12 h-12 rounded-full" />
        <View>
          <Text className="text-sm text-gray-500">Xin chào!</Text>
          <Text className="text-xl font-bold text-gray-900">
            {userName} 👋
          </Text>
        </View>
      </View>

      {/* Notification Bell */}
      <TouchableOpacity
        onPress={onNotificationPress}
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

export default HomeHeader
