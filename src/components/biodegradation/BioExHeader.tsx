import { Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants'

type Props = {
  avatar?: string
  onAvatarPress?: () => void
}

const BioExHeader = ({ avatar, onAvatarPress }: Props) => {
  return (
    <View className="flex-row items-center justify-between mb-6">
      {/* Logo và tên app */}
      <Image
        source={images.logoHeader}
        className="w-[120px] h-[44px]"
      />
    </View>
  )
}

export default BioExHeader
