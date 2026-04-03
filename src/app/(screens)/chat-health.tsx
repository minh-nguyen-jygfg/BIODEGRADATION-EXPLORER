import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import {
  sendHealthChatMessage,
  isHealthChatConfigured,
  type ChatMessage,
} from '@/services/health-chat.service'
import { FormattedChatMessage } from '@/components/chat/FormattedChatMessage'

const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text: 'Xin chào! Tôi là trợ lý tư vấn sức khỏe. Bạn có thể hỏi tôi về dinh dưỡng, tập luyện, giấc ngủ hoặc thói quen lành mạnh. Tôi sẽ trả lời bằng tiếng Việt.',
  createdAt: new Date(),
}

export default function ChatHealthScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_BOT_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  const handleBack = () => router.back()

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    if (!isHealthChatConfigured()) {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: trimmed,
        createdAt: new Date(),
      }
      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: 'Trợ lý chưa được cấu hình. Vui lòng thêm API key (Google AI Studio) để sử dụng tính năng này.',
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, userMsg, botMsg])
      setInput('')
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100)
      return
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'model')
        .map((m) => ({ role: m.role, text: m.text }))
      const reply = await sendHealthChatMessage(trimmed, history)

      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: reply,
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100)
    } catch (err: any) {
      console.error('Health chat error:', err)
      const errorBotMsg: ChatMessage = {
        id: `model-error-${Date.now()}`,
        role: 'model',
        text: 'Trợ lý đang quá tải hoặc tạm thời không phản hồi được. Bạn vui lòng thử lại sau vài giây nhé.',
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, errorBotMsg])
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100)
    } finally {
      setLoading(false)
    }
  }

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user'
    return (
      <View
        className={`mb-3 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <View
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isUser ? 'bg-primary-main' : 'bg-gray-200'
          }`}
        >
          <FormattedChatMessage
            text={item.text}
            isUser={isUser}
            baseClassName="leading-5"
          />
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 bg-white px-4 py-3 pt-16">
        <TouchableOpacity onPress={handleBack} className="mr-3 p-2" hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center">
          <View className="mr-2 h-9 w-9 items-center justify-center rounded-full bg-primary-main">
            <Ionicons name="medkit" size={18} color="#fff" />
          </View>
          <Text className="text-lg font-semibold text-gray-900">
            Health Chat
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 8 }}
        ListFooterComponent={
          loading ? (
            <View className="mb-3 flex-row justify-start">
              <View className="rounded-2xl bg-gray-200 px-4 py-3">
                <ActivityIndicator size="small" color="#477AFF" />
                <Text className="mt-1 text-xs text-gray-500">Đang trả lời...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        className="border-t border-gray-200 bg-white px-3 pb-6 pt-3 mb-10"
      >
        <View className="flex-row items-end gap-2">
          <TextInput
            className="flex-1 rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-base text-gray-900"
            placeholder="Nhập câu hỏi về sức khỏe..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={2000}
            editable={!loading}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || loading}
            className="h-12 w-12 items-center justify-center rounded-full bg-primary-main"
          >
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}
