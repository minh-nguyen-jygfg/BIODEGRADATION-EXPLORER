import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { images } from '@/constants'

type Props = {
  title?: string
}

const AppHeader = ({ title = '' }: Props) => {
  return (
    <View className="flex-row justify-between items-center max-h-16">
      <Image source={images.logoApp} className="w-10" resizeMode="contain" />
      <Text className="text-lg font-semibold text-primary">{title}</Text>
      {/* Avatar */}
      <TouchableOpacity>
        <Image
          source={{
            uri: 'https://sm.ign.com/t/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.600.jpg',
          }}
          className="w-12 h-12 aspect-square rounded-full"
        />
      </TouchableOpacity>
    </View>
  )
}

export default AppHeader
