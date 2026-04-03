import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { BiodegradationService, Pollutant } from '@/services/biodegradation.service'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'

export default function ScienceLibraryScreen() {
  const router = useRouter()

  const { data: pollutants = [], isLoading } = useQuery({
    queryKey: ['pollutants'],
    queryFn: () => BiodegradationService.getPollutants(),
  })

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-2 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center"
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Thư viện khoa học</Text>
        <View className="h-11 w-11" />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 bg-white"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap gap-3 p-5">
            {pollutants.map((pollutant: Pollutant) => (
              <TouchableOpacity
                key={pollutant.id}
                className="w-[48%] bg-neutral p-2 overflow-hidden rounded-xl"
                activeOpacity={0.85}
                onPress={() => {
                  router.push({
                    pathname: ERouteTable.POLLUTANT_DETAIL,
                    params: { id: pollutant.id },
                  })
                }}
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
                <Text
                  className="px-2.5 pt-2.5 text-xl font-bold text-gray-900"
                  numberOfLines={1}
                >
                  Nhựa {pollutant.name}
                </Text>
                <Text
                  className="px-2.5 pb-3 pt-0.5 text-xs text-gray-500"
                  numberOfLines={2}
                >
                  {pollutant.scientific_name || '—'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
