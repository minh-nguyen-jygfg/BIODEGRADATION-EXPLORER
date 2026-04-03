import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { images } from '@/constants'
import { Add, Eye } from 'iconsax-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import BalanceMoney from '@/components/common/BalanceMoney'

const WalletHome = () => {
  const router = useRouter()
  const _onCreateWallet = () => {
    router.push(ERouteTable.WALLET)
  }
  return (
    <ImageBackground
      source={images.bgWallet}
      className="h-full max-h-[210px] relative"
      resizeMode="contain"
    >
      <View className="absolute top-20 px-6">
        <View className="flex-row justify-between items-center w-full">
          <Text className="border rounded-lg px-1 py-1.5 font-semibold text-primary text-sm">
            3 Tài khoản
          </Text>
          <TouchableOpacity onPress={_onCreateWallet}>
            <LinearGradient
              colors={['#C3B8FF', '#9075FF']} // Gradient màu viền
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 8, // Độ dày viền
                borderRadius: 999,
              }}
            >
              <Add size={32} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View className="gap-1">
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-primary">Tổng tài sản</Text>
            <Text className="text-sm font-semibold text-success-main ">+26,8%</Text>
          </View>
          <BalanceMoney balance={5000000} />
        </View>
      </View>
    </ImageBackground>
  )
}

export default WalletHome
