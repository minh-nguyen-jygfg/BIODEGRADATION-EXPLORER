import { Image, ImageBackground, SafeAreaView, StatusBar, Text, View } from 'react-native'
import React, { useState } from 'react'
import { images } from '@/constants'
import AppButton from '@/components/common/AppButton'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'

type Props = {}

type OnboardSlide = {
  title: string
  subtitle: string
  buttonLabel: string
}

const SLIDES: OnboardSlide[] = [
  {
    title: 'KHÁM PHÁ',
    subtitle: 'Phân hủy sinh học',
    buttonLabel: 'Tiếp theo',
  },
  {
    title: 'Hành trình',
    subtitle: 'biến đổi của nhựa',
    buttonLabel: 'Tiếp theo',
  },
  {
    title: 'Nhựa phân hủy',
    subtitle: 'như thế nào?',
    buttonLabel: 'Bắt đầu ngay!',
  },
]

const OnboardScreen = ({}: Props) => {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    const isLast = currentIndex === SLIDES.length - 1
    if (isLast) {
      router.push(ERouteTable.HOME)
      return
    }
    setCurrentIndex((prev) => Math.min(prev + 1, SLIDES.length - 1))
  }

  const slide = SLIDES[currentIndex]

  return (
    <View className="flex-1">
      <ImageBackground source={images.bgOnBoarding} className="flex-1">
        <SafeAreaView className="flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
          <View className="flex-1 w-full px-8 pb-8 justify-end">
            {/* Text block */}
            <View className="mb-10">
              <Text className="text-3xl font-semibold text-white text-left">
                {slide.title}
              </Text>
              <Text className="text-3xl font-bold text-white text-left mt-1">
                {slide.subtitle}
              </Text>
            </View>

            {/* Pagination dots */}
            <View className="flex-row items-center space-x-2 mb-6">
              {SLIDES.map((_, index) => {
                const isActive = index === currentIndex
                return (
                  <View
                    key={index}
                    className={`h-1.5 w-4 ml-1 rounded-full ${
                      isActive ? 'bg-white' : 'bg-white/60'
                    }`}
                  />
                )
              })}
            </View>

            {/* Action button */}
            <AppButton
              title={slide.buttonLabel}
              onPress={handleNext}
              className="mt-2 h-14"
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

export default OnboardScreen
