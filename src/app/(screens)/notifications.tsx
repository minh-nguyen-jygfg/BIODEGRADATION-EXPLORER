import {
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl,
} from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { images } from '@/constants'
import { notificationService, NotificationDisplay } from '@/services/notifications.service'
import { useNotifications } from '@/context/notification-provider'

const NotificationsScreen = () => {
    const { decrementCount, resetCount } = useNotifications()
    const [notifications, setNotifications] = useState<NotificationDisplay[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // Load notifications from Supabase
    const loadNotifications = useCallback(async () => {
        try {
            const data = await notificationService.getNotifications()
            setNotifications(data)
        } catch (error) {
            console.error('Error loading notifications:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Refresh notifications
    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await loadNotifications()
        setRefreshing(false)
    }, [loadNotifications])

    // Setup realtime subscription
    useEffect(() => {
        loadNotifications()

        // Subscribe to new notifications
        const channel = notificationService.subscribeToNotifications((newNotification) => {
            setNotifications(prev => [newNotification, ...prev])
        })

        // Cleanup subscription
        return () => {
            notificationService.unsubscribeFromNotifications()
        }
    }, [])

    const handleBack = () => {
        router.back()
    }

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead()
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, isRead: true, category: 'today' as const }))
            )
            // Reset unread count in context
            resetCount()
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }

    const handleNotificationPress = async (id: string) => {
        try {
            await notificationService.markAsRead(id)
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === id ? { ...notif, isRead: true } : notif
                )
            )
            // Decrement unread count in context
            decrementCount()
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const newNotifications = notifications.filter((n) => !n.isRead)
    const todayNotifications = notifications.filter((n) => n.isRead)

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ImageBackground source={images.bgSplash} className="flex-1 w-full items-center justify-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                </ImageBackground>
            </View>
        )
    }

    return (
        <View className="flex-1">
            <ImageBackground source={images.bgSplash} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-4 mt-14">
                    <TouchableOpacity
                        onPress={handleBack}
                        className="w-14 h-14 rounded-full bg-white items-center justify-center"
                    >
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-center text-xl font-bold text-gray-900">
                        Thông báo
                    </Text>
                  <Text className="w-14 h-14 text-center text-xl font-bold text-gray-900"></Text>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#3B82F6"
                        />
                    }
                >
                    {notifications.length === 0 ? (
                        <View className="flex-1 items-center justify-center py-20">
                            <Text className="text-2xl mb-2">🔔</Text>
                            <Text className="text-base text-gray-600">
                                Chưa có thông báo nào
                            </Text>
                        </View>
                    ) : (
                        <>
                            {/* New Notifications Section */}
                            {newNotifications.length > 0 && (
                                <View className="mb-4">
                                    <View className="flex-row items-center justify-between px-4 mb-3">
                                        <Text className="text-lg font-semibold text-gray-900">
                                            Mới ({newNotifications.length})
                                        </Text>
                                        <TouchableOpacity onPress={handleMarkAllRead}>
                                            <Text className="text-sm font-medium text-blue-500">
                                                Tất cả đã đọc
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {newNotifications.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onPress={handleNotificationPress}
                                        />
                                    ))}
                                </View>
                            )}

                            {/* Today Notifications Section */}
                            {todayNotifications.length > 0 && (
                                <View>
                                    <View className="px-4 mb-3">
                                        <Text className="text-lg font-semibold text-gray-900">
                                            Đã đọc
                                        </Text>
                                    </View>

                                    {todayNotifications.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onPress={handleNotificationPress}
                                        />
                                    ))}
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            </ImageBackground>
        </View>
    )
}

type NotificationItemProps = {
    notification: NotificationDisplay
    onPress: (id: string) => void
}

const NotificationItem = ({ notification, onPress }: NotificationItemProps) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(notification.id)}
            className="flex-row px-4 py-4 bg-white mx-3 mb-2 rounded-2xl"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
            }}
        >
            {/* Icon */}
            <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: notification.iconBg }}
            >
                <Text className="text-2xl">{notification.icon}</Text>
            </View>

            {/* Content */}
            <View className="flex-1">
                <View className="flex-row items-center mb-1">
                    <Text className="text-base font-semibold text-gray-900 flex-1">
                        {notification.title}
                    </Text>
                    {!notification.isRead && (
                        <View className="w-2 h-2 rounded-full bg-blue-500 ml-2" />
                    )}
                </View>
                <Text className="text-sm text-gray-600 leading-5 mb-2">
                    {notification.message}
                </Text>
                <Text className="text-xs text-gray-400">{notification.time}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default NotificationsScreen
