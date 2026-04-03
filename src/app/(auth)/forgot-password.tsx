import { View, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AppInput from '@/components/form/AppInput'
import AppButton from '@/components/common/AppButton'
import { AuthService } from '@/services/auth.service'
import { ERouteTable } from '@/constants/route-table'

const ForgotPasswordScreen = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSendResetEmail = async () => {
    // Reset error
    setEmailError('')

    // Validate email
    if (!email.trim()) {
      setEmailError('Email không được để trống')
      return
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Email chưa chính xác. Vui lòng kiểm tra lại!')
      return
    }

    setLoading(true)

    try {
      await AuthService.sendPasswordResetOTP(email.trim())
      
      // Navigate to OTP verification screen
      router.push({
        pathname: ERouteTable.VERIFY_OTP_RESET,
        params: { email: email.trim() },
      })
    } catch (error: any) {
      console.error('Error sending reset OTP:', error)
      
      let errorMessage = 'Không thể gửi mã xác thực. Vui lòng thử lại sau.'
      
      if (error.message.includes('User not found')) {
        errorMessage = 'Email không tồn tại trong hệ thống'
      } else if (error.message.includes('Rate limit')) {
        errorMessage = 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.'
      }
      
      Alert.alert('Lỗi', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToSignIn = () => {
    router.back()
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-4 pt-4">
            <TouchableOpacity
              onPress={handleBackToSignIn}
              className="w-12 h-12 rounded-full bg-white items-center justify-center"
              disabled={loading}
            >
              <Ionicons name="chevron-back" size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 px-8 pt-16">
            {/* Title */}
            <Text className="text-3xl font-semibold text-primary text-center mb-4">
              Quên mật khẩu
            </Text>

            {/* Description */}
            <Text className="text-sm text-disabled text-center mb-8 leading-5">
              Vui lòng nhập địa chỉ email được liên kết với tài khoản của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
            </Text>

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-primary mb-2">Email</Text>
              <AppInput
                className="h-14 border border-[#919EAB52] px-4 rounded-xl bg-white"
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  if (emailError) setEmailError('')
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              {emailError ? (
                <Text className="text-sm text-error mt-1">{emailError}</Text>
              ) : null}
            </View>

            {/* Submit Button */}
            <AppButton
              title={loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
              onPress={handleSendResetEmail}
              disabled={loading}
            />

            {/* Back to Sign In */}
            <TouchableOpacity
              onPress={handleBackToSignIn}
              className="flex-row items-center justify-center mt-6"
              disabled={loading}
            >
              <Ionicons name="chevron-back" size={20} color="#637381" />
              <Text className="text-sm text-secondary ml-1">Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ForgotPasswordScreen
