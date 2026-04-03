import { Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { Pollutant } from '@/services/biodegradation.service'
import { images } from '@/constants'

type Props = {
  pollutant: Pollutant
  onPress?: () => void
}

const PollutantCard = ({ pollutant, onPress }: Props) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="w-[48%] bg-neutral p-2 overflow-hidden rounded-xl"
    >
      <View className="h-48 w-full overflow-hidden rounded-xl">
        {pollutant.image_url ? (
          <Image
            source={{ uri: pollutant.image_url }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <Image
            source={images.bgMain}
            className="h-full w-full"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Content */}
      <View className="p-3">
        <Text className="text-xl font-bold text-gray-900 mb-1" numberOfLines={1}>
          Nhựa {pollutant.name}
        </Text>
        <Text className="text-sm text-gray-600" numberOfLines={1}>
          {pollutant.scientific_name || pollutant.description || 'Không có mô tả'}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default PollutantCard
