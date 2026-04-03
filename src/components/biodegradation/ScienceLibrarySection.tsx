import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Pollutant } from '@/services/biodegradation.service'
import PollutantCard from './PollutantCard'

type Props = {
  pollutants: Pollutant[]
  onSeeMore?: () => void
  onPollutantPress?: (pollutant: Pollutant) => void
}

const ScienceLibrarySection = ({ pollutants, onSeeMore, onPollutantPress }: Props) => {
  if (pollutants.length === 0) {
    return null
  }

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-gray-900">Thư viện khoa học</Text>
        {onSeeMore && (
          <TouchableOpacity onPress={onSeeMore}>
            <Text className="text-sm text-gray-500">Xem thêm</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Scrollable Cards */}

      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap gap-3">
          {pollutants.slice(0,4).map((pollutant) => (
            <PollutantCard
              key={pollutant.id}
              pollutant={pollutant}
              onPress={() => onPollutantPress?.(pollutant)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default ScienceLibrarySection
