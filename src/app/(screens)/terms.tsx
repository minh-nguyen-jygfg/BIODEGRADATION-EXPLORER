import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const TermsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-10">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-gray-50">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold text-gray-900 mr-6">
          Điều khoản & Điều kiện
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-base text-gray-700 leading-6 mb-6">
          Chào mừng bạn đến với hệ thống mô phỏng tương tác. Trước khi bắt đầu sử dụng, vui lòng đọc kỹ các điều khoản dưới đây. Việc bạn truy cập và sử dụng ứng dụng đồng nghĩa với việc bạn chấp thuận các điều khoản này.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-2">
          1. Chấp thuận Điều khoản
        </Text>
        <Text className="text-base text-gray-700 leading-6 mb-6">
          Bằng cách sử dụng ứng dụng này, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản và Điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng ứng dụng.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-2">
          2. Mục đích Sử dụng và Giới hạn
        </Text>
        <View className="mb-6">
          <Text className="text-base text-gray-700 leading-6 mb-2 text-justify">
            • <Text className="font-semibold">Mục đích Giáo dục:</Text> Ứng dụng này được thiết kế và cung cấp hoàn toàn cho mục đích giáo dục, nghiên cứu học thuật và truyền thông môi trường phi thương mại.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2 text-justify">
            • <Text className="font-semibold">Tính chất Mô phỏng:</Text> Các hình ảnh 3D, dữ liệu chuyển hóa và tốc độ phân hủy là kết quả dựa trên mô hình hóa toán học và dữ liệu hóa sinh thực nghiệm hiện hành. Chúng không đại diện cho kết quả chính xác 100% trong mọi điều kiện thực tế ngoài đời thực.
          </Text>
          <Text className="text-base text-gray-700 leading-6 text-justify">
            • <Text className="font-semibold">Không phải Tư vấn Kỹ thuật:</Text> Nội dung trong ứng dụng không được coi là hướng dẫn kỹ thuật cho các quy trình xử lý rác thải công nghiệp hoặc phòng thí nghiệm mà không có sự giám sát của chuyên gia.
          </Text>
        </View>

        <Text className="text-lg font-bold text-gray-900 mb-2">
          3. Quyền Sở hữu Trí tuệ
        </Text>
        <View className="mb-6">
          <Text className="text-base text-gray-700 leading-6 mb-2">
            • Bản quyền: Tất cả mã nguồn, thiết kế đồ họa, hình ảnh mô phỏng, tài liệu khoa học và cấu trúc 4 giai đoạn phân hủy đều thuộc quyền sở hữu trí tuệ của dự án.
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            • Giấy phép Sử dụng: Người dùng được cấp quyền truy cập để học tập và trình bày phi thương mại. Mọi hành vi sao chép, trích xuất dữ liệu hoặc tái bản hình ảnh cho mục đích thương mại mà không có sự cho phép bằng văn bản là vi phạm bản quyền.
          </Text>
        </View>

        <Text className="text-lg font-bold text-gray-900 mb-2">
          4. Trách nhiệm của Người dùng
        </Text>
        <View className="mb-6">
          <Text className="text-base text-gray-700 leading-6 mb-2">
            • Bạn cam kết sử dụng ứng dụng một cách văn minh, không cố tình tấn công hệ thống hoặc can thiệp vào mã nguồn.
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            • Bạn không được sử dụng các kết quả mô phỏng từ ứng dụng để đưa ra các tuyên bố sai lệch về khả năng phân hủy của nhựa nhằm mục đích quảng bá thương mại cho các sản phẩm polymer.
          </Text>
        </View>

        <Text className="text-lg font-bold text-gray-900 mb-2">
          5. Giới hạn Trách nhiệm
        </Text>
        <View className="mb-6">
          <Text className="text-base text-gray-700 leading-6 mb-2">
            • Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào (trực tiếp hoặc gián tiếp) phát sinh từ việc sử dụng thông tin trong ứng dụng này.
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            • Chúng tôi không đảm bảo ứng dụng sẽ luôn hoạt động liên tục mà không có lỗi kỹ thuật hoặc sự cố hệ thống.
          </Text>
        </View>

        <Text className="text-lg font-bold text-gray-900 mb-2">
          6. Bảo mật và Dữ liệu
        </Text>
        <View className="mb-6">
          <Text className="text-base text-gray-700 leading-6 mb-2 text-justify">
            • <Text className="font-semibold">Dữ liệu Ẩn danh:</Text> Ứng dụng có thể thu thập các thông số sử dụng nặc danh (loại nhựa được chọn, thời gian mô phỏng) để phục vụ mục đích thống kê và cải thiện thuật toán.
          </Text>
          <Text className="text-base text-gray-700 leading-6 text-justify">
            • <Text className="font-semibold">Không thu thập thông tin cá nhân:</Text> Chúng tôi cam kết không thu thập địa chỉ email, tên thật hoặc bất kỳ dữ liệu định danh cá nhân nào khác trừ khi bạn chủ động cung cấp qua mục liên hệ.
          </Text>
        </View>

        <Text className="text-lg font-bold text-gray-900 mb-2">
          7. Thay đổi Điều khoản
        </Text>
        <Text className="text-base text-gray-700 leading-6 mb-8">
          Chúng tôi có quyền cập nhật hoặc thay đổi các Điều khoản này bất kỳ lúc nào để phù hợp với sự phát triển của dự án. Mọi thay đổi sẽ có hiệu lực ngay khi được đăng tải trong ứng dụng.
        </Text>

        <Text className="text-base font-semibold text-gray-900 mb-12 text-center">
          Cảm ơn bạn đã cùng chúng tôi hành động vì một môi trường bền vững hơn.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TermsScreen
