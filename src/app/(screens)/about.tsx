import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const AboutScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-10">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-gray-50">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold text-gray-900 mr-6">
          Giới thiệu
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-base text-gray-700 leading-6 mb-6 text-justify">
          Hệ thống mô phỏng tương tác này được thiết kế để cung cấp cái nhìn trực quan và khoa học nhất về cách các loại nhựa phổ biến nhất trên thế giới tương tác với môi trường tự nhiên ở cấp độ phân tử.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-3">
          1. Tầm nhìn và Mục tiêu
        </Text>
        <Text className="text-base text-gray-700 leading-6 mb-6 text-justify">
          Trong bối cảnh khủng hoảng rác thải nhựa toàn cầu, việc hiểu rõ bản chất của quá trình phân hủy không chỉ là kiến thức học thuật mà còn là chìa khóa để thay đổi tư duy tiêu dùng. Ứng dụng này hướng tới việc xóa bỏ những hiểu lầm về thuật ngữ "phân hủy sinh học" bằng cách minh chứng sự khác biệt giữa việc khoáng hóa hoàn toàn và sự phân rã thành vi nhựa.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-3">
          2. Các tính năng cốt lõi
        </Text>
        <Text className="text-base text-gray-700 leading-6 mb-4">
          Mô phỏng đa giai đoạn (Multi-Phase Simulation). Mỗi loại polymer được phân tích qua một quy trình 4 bước chuẩn hóa:
        </Text>

        <View className="pl-2 mb-6">
          <Text className="text-base text-gray-700 mb-2">
            • <Text className="font-semibold">Giai đoạn Tiền xử lý:</Text> Tác động của các yếu tố phi sinh học như tia UV và nhiệt độ.
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            • <Text className="font-semibold">Giai đoạn Bám dính:</Text> Sự hình thành màng sinh học (Biofilm) của vi khuẩn trên bề mặt nhựa.
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            • <Text className="font-semibold">Giai đoạn Cắt mạch:</Text> Hoạt động của các enzyme đặc hiệu tấn công vào xương sống carbon.
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            • <Text className="font-semibold">Giai đoạn Kết quả:</Text> Minh họa thực tế về việc nhựa biến mất hoàn toàn hay để lại dư lượng độc hại.
          </Text>
        </View>

        <Text className="text-base font-bold text-gray-900 mb-2">Thư viện Polymer đa dạng</Text>
        <Text className="text-base text-gray-700 mb-4">Hệ thống cho phép so sánh trực quan giữa các nhóm nhựa khác nhau:</Text>

        <View className="pl-2 mb-6">
          <Text className="text-base text-gray-700 mb-2">
            • Nhựa có khả năng thủy phân: Điển hình là PET với khả năng chuyển hóa thành $CO_2$ và $H_2O$.
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            • Nhựa Polyolefins: Như HDPE và PP với những rào cản về cấu trúc methyl.
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            • Nhựa kỹ thuật bền vững: PVC và PS với những nguy cơ về độc tính và vòng aromatic khó bẻ gãy.
          </Text>
        </View>

        <Text className="text-base font-bold text-gray-900 mb-2">Phân tích môi trường thực chứng</Text>
        <Text className="text-base text-gray-700 leading-6 mb-8 text-justify">
          Người dùng có thể thay đổi các thông số môi trường (nhiệt độ, độ mặn, nồng độ oxy) để quan sát sự biến thiên của tốc độ phân hủy, từ đó hiểu rõ tại sao cùng một loại nhựa lại có số phận khác nhau khi ở trong nước ngọt hay đại dương.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-3">
          3. Giá trị Khoa học và Giáo dục
        </Text>
        <View className="pl-2 mb-8">
          <Text className="text-base text-gray-700 mb-3">
            • <Text className="font-semibold">Trực quan hóa cấp độ phân tử:</Text> Sử dụng đồ họa chất lượng cao để hiển thị các liên kết hóa học, sự tấn công của enzyme và quá trình hình thành vi nhựa.
          </Text>
          <Text className="text-base text-gray-700 mb-3">
            • <Text className="font-semibold">Cảnh báo thực tế:</Text> Tích hợp các chỉ số về độc tính và tồn dư môi trường, giúp người dùng nhận diện những loại nhựa "bướng bỉnh" nhất.
          </Text>
          <Text className="text-base text-gray-700 mb-3">
            • <Text className="font-semibold">Công cụ học tập hiện đại:</Text> Phù hợp cho việc giảng dạy, nghiên cứu và truyền cảm hứng cho thế hệ trẻ về bảo tồn môi trường thông qua công nghệ 3D và tương tác thực tế.
          </Text>
        </View>

        <Text className="text-base text-gray-700 leading-6 mb-12 text-center italic">
          Hệ thống được xây dựng trên nền tảng dữ liệu hóa sinh thực nghiệm, mang lại trải nghiệm học thuật chính xác và đầy cảm hứng.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AboutScreen
