import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import SettingsMenuItem from '@/modules/user-profile/components/SettingsMenuItem'
import { MenuItem } from '@/modules/user-profile/types/user-profile.types'
import { ERouteTable } from '@/constants/route-table'

const UserScreen = () => {

  const menuItems: MenuItem[] = [
    {
      icon: 'information-circle-outline',
      label: 'Giới thiệu',
      route: ERouteTable.ABOUT,
      onPress: () => router.push(ERouteTable.ABOUT),
    },
    {
      icon: 'headset-outline',
      label: 'Liên hệ hỗ trợ',
      route: ERouteTable.SUPPORT,
      onPress: () => router.push(ERouteTable.SUPPORT),
    },
    {
      icon: 'document-text-outline',
      label: 'Điều khoản & Điều kiện',
      route: ERouteTable.TERMS,
      onPress: () => router.push(ERouteTable.TERMS),
    },
  ]

  return (
    <View
      className="flex-1 bg-white"
    >
      <SafeAreaView className="flex-1 pt-10">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-4">
          <Text className="text-2xl font-semibold text-gray-900">Cá nhân</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Settings & Support Section */}
          <View className="bg-white rounded-3xl mx-4 mb-6 shadow-sm overflow-hidden">
            {/* Section Title */}
            <View className="pt-4 pb-2">
              <Text className="text-lg font-normal text-gray-900">
                Cài đặt & Hỗ trợ
              </Text>
            </View>

            {/* Menu Items */}
            <View>
              {menuItems.map((item, index) => (
                <View key={index}>
                  <SettingsMenuItem item={item} />
                  {index < menuItems.length - 1 && (
                    <View className="h-px bg-gray-100" />
                  )}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default UserScreen
