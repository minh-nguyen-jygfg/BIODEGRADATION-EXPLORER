import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

type Props = {}

const SupportScreen = (props: Props) => {
    return (
        <SafeAreaView className="flex-1 bg-gray-50 pt-10">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-gray-50">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-lg font-semibold text-gray-900 mr-6">
                    Liên hệ hỗ trợ
                </Text>
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1 px-6 pt-6"
                showsVerticalScrollIndicator={false}
            >
                <View
                    className="bg-white rounded-3xl px-5 pt-5 pb-8 mb-8"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                    }}
                >
                    <Text className="text-base text-gray-700 leading-6 mb-4">
                      Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn để hành trình làm nông trở nên dễ dàng và hiệu quả hơn.
                    </Text>

                    <View className="space-y-2 mb-4">
                        <Text className="text-base text-gray-700 leading-6">
                            • <Text className="font-semibold">Email hỗ trợ:</Text> support@example.com
                        </Text>
                        <Text className="text-base text-gray-700 leading-6">
                            • <Text className="font-semibold">Điện thoại (giờ hành chính):</Text> +84 9xx xxx xxx
                        </Text>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SupportScreen
