import { Image, ImageBackground, StatusBar, Text, View } from 'react-native'
import { useEffect } from 'react'
import { router } from 'expo-router'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { useAuth } from '@/context/auth-provider'

export default function Root() {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    console.log('=== ROOT INDEX ===')
    console.log('Auth loading:', loading)
    console.log('Is authenticated:', isAuthenticated)
    
    // Wait for auth to finish loading
    if (loading) {
      console.log('Waiting for auth to load...')
      return
    }
    
    const timer = setTimeout(() => {
      console.log('Navigating based on auth status:', isAuthenticated)
      if (isAuthenticated) {
        router.replace(ERouteTable.HOME)
      } else {
        router.replace(ERouteTable.ONBOARD)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [isAuthenticated, loading])

  return (
    <View className="flex-1">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="dark-content" />
      <View className="flex-1 bg-[#DEFFE3]">
        {/* Logo */}
        <View className="justify-center items-center flex-1">
          <Image source={images.logoApp2} className="w-40 h-40" resizeMode="contain" />
        </View>
      </View>
    </View>
  )
}
