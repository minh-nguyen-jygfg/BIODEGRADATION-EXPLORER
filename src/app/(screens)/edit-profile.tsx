import {
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { images } from '@/constants'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/context/auth-provider'
import { getAvatarUrl } from '@/utils/avatar'

type Props = {}

const EditProfileScreen = (props: Props) => {
  const { user } = useAuth()
  const { profile, isLoading, updateProfile, updateAvatar, isUpdating, isUploadingAvatar, refetch } = useProfile()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')

  // Refetch profile when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch()
    }, [refetch])
  )

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || user?.user_metadata?.full_name || user?.email || '')
      setEmail(profile.email || user?.email || '')
      setAvatar(getAvatarUrl(profile.avatar_url, profile.full_name || 'User', profile.updated_at))
    } else if (user) {
      setEmail(user.email || '')
      setAvatar(getAvatarUrl(null, 'User'))
    }
  }, [profile, user])

  const handleBack = () => {
    router.back()
  }

  const handleChangeAvatar = async () => {
    if (!user?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng')
      return
    }

    try {
      const newAvatarUrl = await updateAvatar(user.id)
      if (newAvatarUrl) {
        // The profile will be refetched automatically, no need to manually update
        Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện')
      }
    } catch (error: any) {
      console.error('Error changing avatar:', error)
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật ảnh đại diện')
    }
  }

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng')
      return
    }

    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên')
      return
    }

    try {
      const result = await updateProfile({
        userId: user.id,
        updates: {
          full_name: name.trim(),
        },
      })
      
      // Update local state with new values
      if (result) {
        setName(result.full_name || name.trim())
      }
      
      Alert.alert('Thành công', 'Cập nhật hồ sơ thành công', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ])
    } catch (error: any) {
      console.error('Error saving profile:', error)
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật hồ sơ')
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4">
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={{ marginRight: 16 }}
                disabled={isUpdating || isUploadingAvatar}
              >
                <View className="w-12 h-12 rounded-full bg-white items-center justify-center">
                  <Ionicons name="chevron-back" size={24} color="#000" />
                </View>
              </TouchableOpacity>
              <Text className="text-center text-xl font-bold text-gray-900">
                Chỉnh sửa hồ sơ
              </Text>
              <Text className="w-12 h-12" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Content */}
              <View className="flex-1 px-6 pt-8">
                {/* Avatar Section */}
                <View className="items-center mb-8">
                  <View className="relative">
                    <Image
                      key={avatar}
                      source={{ uri: avatar }}
                      className="w-32 h-32 rounded-full"
                    />
                    <TouchableOpacity
                      onPress={handleChangeAvatar}
                      disabled={isUploadingAvatar}
                      className="absolute bottom-0 right-0 bg-white w-10 h-10 rounded-full items-center justify-center shadow-md"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      {isUploadingAvatar ? (
                        <ActivityIndicator size="small" color="#6B7280" />
                      ) : (
                        <Ionicons name="camera" size={20} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {isUploadingAvatar && (
                    <Text className="text-sm text-gray-500 mt-2">Đang tải lên...</Text>
                  )}
                </View>

                {/* Name Field */}
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    Tên
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Nhập tên của bạn"
                    editable={!isUpdating}
                    className="bg-white border border-secondary rounded-2xl px-4 py-4 text-base text-gray-900"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  />
                </View>

                {/* Email Field (Read-only) */}
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    Email
                  </Text>
                  <View
                    className="bg-gray-100 rounded-2xl px-4 py-4"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Text className="text-base text-gray-400">{email}</Text>
                  </View>
                </View>

                {/* Save Button */}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
      <TouchableOpacity
        onPress={handleSave}
        disabled={isUpdating || isUploadingAvatar}
        className="bg-primary-main rounded-2xl mx-6 py-4 items-center mb-8"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          opacity: (isUpdating || isUploadingAvatar) ? 0.6 : 1,
        }}
      >
        {isUpdating ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">
            Cập nhật
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default EditProfileScreen
