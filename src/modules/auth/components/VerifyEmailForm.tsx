import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AppButton from '@/components/common/AppButton'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import OtpInput from '@/components/form/OtpInput'
import { ArrowLeft2 } from 'iconsax-react-native'

type Props = {}

const VerifyEmailForm = ({}: Props) => {
  const router = useRouter()

  const _handleVerify = () => {
    router.push(ERouteTable.USER_INFO)
  }

  const _onResendCode = () => {
    router.push(ERouteTable.SIGIN_IN)
  }

  const _onSignIn = () => {
    router.push(ERouteTable.SIGIN_IN)
  }

  const _handleOtpChange = (otp: string) => {
    console.log('OTP entered:', otp)
  }
  return (
    <View className="px-8">
      <Text className="text-3xl text-center text-primary mb-10">Kiểm tra email</Text>
      <View className="p-6">
        <Text className="text-sm text-center text-disabled">
          Chúng tôi đã gửi cho bạn một mã xác nhận. {`\n`}
          Vui lòng kiểm tra hộp thư đến của bạn tại {`\n`}u************@e******.com.
        </Text>
      </View>
      <View className="flex-col gap-4">
        <View>
          <OtpInput length={6} onChange={_handleOtpChange} />
        </View>

        <AppButton title="Xác thực" onPress={_handleVerify} />
        <View className="items-center gap-4">
          <Text className="text-primary text-sm">Gửi lại mã. Vui lòng kiểm tra email của bạn.</Text>
          <TouchableOpacity onPress={_onResendCode}>
            <Text className=" text-secondary">Gửi lại mã</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_onSignIn} className="flex-row gap-1 items-center mt-8">
            <ArrowLeft2 size="20" color="#212B36" />
            <Text className="text-primary">Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default VerifyEmailForm
