import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AppInput from '@/components/form/AppInput'
import AppButton from '@/components/common/AppButton'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { GalleryAdd } from 'iconsax-react-native'

type Props = {}

const UserInfoForm = ({}: Props) => {
  const router = useRouter()

  const _onHomeScreen = () => {
    router.push(ERouteTable.HOME)
  }

  const _onSkip = () => {
    router.push(ERouteTable.HOME)
  }

  const _pickImage = () => {}
  return (
    <View className="px-8">
      <Text className="text-3xl text-center text-primary mb-10">Hãy cho chúng tôi biết về bạn</Text>
      <View className="mt-10 flex-row gap-4 items-center justify-center">
        <TouchableOpacity onPress={_pickImage}>
          <View className="p-1 border border-input-outline border-dotted rounded-full">
            <View className="bg-neutral p-4 rounded-full">
              <GalleryAdd size={24} color="#919EAB" variant="Bold" />
            </View>
          </View>
        </TouchableOpacity>
        <View className="gap-1">
          <Text className="text-xs text-primary">Tối thiểu 300x300px</Text>
          <Text className="text-sm text-disabled">JPG hoặc PNG. Tối đa 2MB.</Text>
        </View>
      </View>
      <View className="flex-col gap-4">
        <View>
          <AppInput label="Tên của bạn" placeholder="Nhập tên của bạn" />
        </View>

        <AppButton title="Tiếp tục" onPress={_onHomeScreen} />
        <AppButton
          title="Bỏ qua"
          className="bg-transparent"
          textStyle="text-secondary"
          onPress={_onSkip}
        />
      </View>
    </View>
  )
}

export default UserInfoForm
