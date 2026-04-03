import { Text, View } from 'react-native'
import React from 'react'
import TrainIconHome from '~/assets/icons/home/train'
import SleepHomeIcon from '~/assets/icons/home/sleep_home'

type Props = {
  exerciseMinutes: number
  sleepHours: number
}

const ActivityTracker = ({ exerciseMinutes, sleepHours }: Props) => {
  return (
    <View className="flex-row gap-3 mb-6">
      {/* Exercise Card */}
      <View className="flex-1 bg-[#FFFFFF52] rounded-3xl p-5">
        <View className="flex-row items-center gap-1">
          <TrainIconHome />
          <Text className="text-base font-medium text-gray-900">Tập luyện</Text>
        </View>
        <Text className="text-4xl font-bold text-gray-900">
          {exerciseMinutes}
          <Text className="text-base font-normal text-gray-500"> phút</Text>
        </Text>
      </View>

      {/* Sleep Card */}
      <View className="flex-1 bg-[#FFFFFF52] rounded-3xl p-5">
        <View className="flex-row items-center gap-1">
          <SleepHomeIcon />
          <Text className="text-base font-medium text-gray-900">Ngủ</Text>
        </View>
        <Text className="text-4xl font-bold text-gray-900">
          {sleepHours}
          <Text className="text-base font-normal text-gray-500"> giờ</Text>
        </Text>
      </View>
    </View>
  )
}

export default ActivityTracker
