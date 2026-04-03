import { View, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants'

const HeroBanner = () => {
  return (
    <View className="mb-6">
      <Image
        source={images.heroBanner}
        className="w-full h-[270px]"
      />
    </View>
  )
}

export default HeroBanner
