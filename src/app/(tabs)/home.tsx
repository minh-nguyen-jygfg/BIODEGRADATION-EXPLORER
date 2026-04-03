import { ScrollView, View, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ERouteTable } from '@/constants/route-table'
import { useAuth } from '@/context/auth-provider'
import { ProfileService } from '@/services/profile.service'
import { BiodegradationService } from '@/services/biodegradation.service'
import BioExHeader from '@/components/biodegradation/BioExHeader'
import HeroBanner from '@/components/biodegradation/HeroBanner'
import ScienceLibrarySection from '@/components/biodegradation/ScienceLibrarySection'
import { getAvatarUrl } from '@/utils/avatar'

const Home = () => {
  // Auth chỉ dùng cho tính năng cá nhân (avatar, profile), không bắt buộc để xem nội dung
  const { user } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  // Fetch profile
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => user?.id ? ProfileService.getProfile(user.id) : null,
    enabled: !!user?.id,
  })

  // Refetch profile when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        refetchProfile()
      }
    }, [user?.id, refetchProfile])
  )

  // Fetch pollutants
  const { data: pollutants = [], isLoading: pollutantsLoading, refetch: refetchPollutants } = useQuery({
    queryKey: ['pollutants'],
    queryFn: () => BiodegradationService.getPollutants(),
    // Nội dung khoa học là public, luôn được phép fetch
    enabled: true,
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetchPollutants()
    if (user?.id) {
      await refetchProfile()
    }
    setRefreshing(false)
  }

  const handlePollutantPress = (pollutant: { id: string }) => {
    router.push({
      pathname: ERouteTable.POLLUTANT_DETAIL,
      params: { id: pollutant.id },
    })
  }

  const handleSeeMore = () => {
    router.push(ERouteTable.SCIENCE_LIBRARY)
  }

  const handleAvatarPress = () => {
    router.push('/user')
  }

  // Chỉ block khi đang tải dữ liệu nội dung chính
  if (pollutantsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#22C55E"
            colors={['#22C55E']}
          />
        }
      >
        {/* Header với padding */}
        <View className="px-5 pt-20">
          <BioExHeader
            avatar={profile?.avatar_url ? getAvatarUrl(profile.avatar_url, profile.full_name || 'User', profile.updated_at) : undefined}
            onAvatarPress={handleAvatarPress}
          />
        </View>

        {/* Hero Banner */}
        <View className="px-5">
          <HeroBanner />
        </View>

        {/* Science Library Section */}
        <View className="px-5">
          <ScienceLibrarySection
            pollutants={pollutants}
            onSeeMore={handleSeeMore}
            onPollutantPress={handlePollutantPress}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default Home
