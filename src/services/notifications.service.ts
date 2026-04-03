import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { RealtimeChannel } from '@supabase/supabase-js'

export type NotificationType = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']

export type NotificationSettings = Database['public']['Tables']['notification_settings']['Row']
export type NotificationSettingsUpdate = Database['public']['Tables']['notification_settings']['Update']

export interface NotificationDisplay {
  id: string
  icon: string
  iconBg: string
  title: string
  message: string
  time: string
  isRead: boolean
  category: 'today' | 'new'
  type: string
  relatedId?: string
  metadata?: any
  createdAt: string
}

class NotificationService {
  private realtimeChannel: RealtimeChannel | null = null

  /**
   * Get notifications for current user
   */
  async getNotifications(limit: number = 50): Promise<NotificationDisplay[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }

    return this.formatNotifications(data || [])
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)

    if (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }

    return count || 0
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)

    if (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('is_read', false)

    if (error) {
      console.error('Error marking all as read:', error)
      throw error
    }
  }

  /**
   * Create a notification
   */
  async createNotification(
    type: string,
    title: string,
    message: string,
    icon: string,
    iconBg: string,
    relatedId?: string,
    metadata?: any
  ): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type,
        title,
        message,
        icon,
        icon_bg: iconBg,
        related_id: relatedId,
        metadata
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      throw error
    }

    return data?.id || null
  }

  /**
   * Subscribe to realtime notifications
   */
  subscribeToNotifications(
    onNotification: (notification: NotificationDisplay) => void
  ): RealtimeChannel {
    if (this.realtimeChannel) {
      console.log('⚠️ Cleaning up existing subscription')
      this.unsubscribeFromNotifications()
    }

    console.log('📡 Setting up Supabase realtime subscription for notifications')

    // Get current user ID synchronously from auth state
    let currentUserId: string | undefined

    this.realtimeChannel = supabase
      .channel('notifications-channel', {
        config: {
          broadcast: { self: true }
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        async (payload) => {
          console.log('📨 Realtime event received:', payload)
          
          // Get user ID on first event if not set
          if (!currentUserId) {
            const { data: { user } } = await supabase.auth.getUser()
            currentUserId = user?.id
            console.log('👤 Current user ID:', currentUserId)
          }
          
          const notification = payload.new as NotificationType
          
          // Filter on client side for free plan compatibility
          if (currentUserId && notification.user_id !== currentUserId) {
            console.log('⏭️ Skipping notification for different user')
            return
          }
          
          const formatted = this.formatNotifications([notification])[0]
          if (formatted) {
            console.log('✅ Formatted notification:', formatted.title)
            onNotification(formatted)
          } else {
            console.log('⚠️ Could not format notification')
          }
        }
      )
      .subscribe((status) => {
        // console.log('📡 Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          // console.log('✅ Successfully subscribed to notifications!')
        } else if (status === 'CHANNEL_ERROR') {
          // console.error('❌ Error subscribing to notifications')
        } else if (status === 'TIMED_OUT') {
          // console.error('⏱️ Subscription timed out')
        }
      })

    return this.realtimeChannel
  }

  /**
   * Unsubscribe from notifications
   */
  unsubscribeFromNotifications(): void {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel)
      this.realtimeChannel = null
    }
  }

  /**
   * Get notification settings
   */
  async getSettings(): Promise<NotificationSettings | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      // Only log if it's not a "no rows" error
      if (error.code !== 'PGRST116') {
        console.error('Error fetching notification settings:', error)
      }
      return null
    }

    // If no settings exist, return null (caller should handle this)
    return data || null
  }

  /**
   * Update notification settings
   */
  async updateSettings(settings: NotificationSettingsUpdate): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('notification_settings')
      .upsert({
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error updating notification settings:', error)
      throw error
    }
  }

  /**
   * Format notifications for display
   */
  private formatNotifications(notifications: NotificationType[]): NotificationDisplay[] {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return notifications.map(notif => {
      const createdAt = new Date(notif.created_at)
      const diffMs = now.getTime() - createdAt.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      let timeDisplay = ''
      if (diffMins < 1) {
        timeDisplay = 'Vừa xong'
      } else if (diffMins < 60) {
        timeDisplay = `${diffMins} phút`
      } else if (diffHours < 24) {
        timeDisplay = `${diffHours} giờ`
      } else {
        timeDisplay = `${diffDays} ngày`
      }

      const isToday = createdAt >= todayStart
      const category = isToday && notif.is_read ? 'today' : 'new'

      return {
        id: notif.id,
        icon: notif.icon,
        iconBg: notif.icon_bg,
        title: notif.title,
        message: notif.message,
        time: timeDisplay,
        isRead: notif.is_read,
        category,
        type: notif.type,
        relatedId: notif.related_id || undefined,
        metadata: notif.metadata,
        createdAt: notif.created_at
      }
    })
  }

  /**
   * Create meal reminder notification
   */
  async createMealReminder(mealType: 'breakfast' | 'lunch' | 'dinner'): Promise<void> {
    const mealConfig = {
      breakfast: {
        title: 'Bữa sáng năng lượng',
        message: 'Đừng quên bắt đầu ngày mới với một bữa sáng giàu protein nhé.',
        icon: '☀️',
        iconBg: '#FED7AA'
      },
      lunch: {
        title: 'Check-in bữa trưa',
        message: 'Giờ nghỉ trưa đến rồi! Đừng quên check-in để theo dõi lượng calo hôm nay nhé.',
        icon: '🍔',
        iconBg: '#FEE2E2'
      },
      dinner: {
        title: 'Bữa tối lành mạnh',
        message: 'Đến giờ bữa tối rồi! Hãy chọn món ăn nhẹ để có giấc ngủ ngon nhé.',
        icon: '🍽️',
        iconBg: '#DBEAFE'
      }
    }

    const config = mealConfig[mealType]
    await this.createNotification(
      'meal_reminder',
      config.title,
      config.message,
      config.icon,
      config.iconBg
    )
  }

  /**
   * Create water reminder notification
   */
  async createWaterReminder(): Promise<void> {
    await this.createNotification(
      'water_reminder',
      'Uống nước',
      'Đã 2 tiếng rồi bạn chưa uống nước đấy. Một ly nước ngay lúc này sẽ giúp da đẹp và não tỉnh táo hơn!',
      '💧',
      '#DBEAFE'
    )
  }

  /**
   * Create exercise reminder notification
   */
  async createExerciseReminder(): Promise<void> {
    await this.createNotification(
      'exercise_reminder',
      'Đến giờ tập luyện',
      'Hãy dành 30 phút vận động để cơ thể khỏe mạnh và tinh thần sảng khoái nhé!',
      '🏃',
      '#FEE2E2'
    )
  }

  /**
   * Create sleep reminder notification
   */
  async createSleepReminder(): Promise<void> {
    await this.createNotification(
      'sleep_reminder',
      'Đến giờ đi ngủ',
      'Hãy chuẩn bị đi ngủ để có một giấc ngủ ngon và đầy đủ 8 tiếng nhé!',
      '🌙',
      '#E0E7FF'
    )
  }

  /**
   * Create weight update reminder
   */
  async createWeightUpdateReminder(): Promise<void> {
    const today = new Date().getDay()
    if (today === 0) { // Sunday
      await this.createNotification(
        'weight_update',
        'Cập nhật cân nặng',
        'Sáng Chủ Nhật rồi! Cập nhật cân nặng để xem sự thay đổi của tuần qua nhé.',
        '⚖️',
        '#D1FAE5'
      )
    }
  }

  /**
   * Create health tip notification
   */
  async createHealthTip(tip: string): Promise<void> {
    await this.createNotification(
      'tip',
      'Mẹo nhỏ',
      tip,
      '💡',
      '#E0E7FF'
    )
  }
}

export const notificationService = new NotificationService()
