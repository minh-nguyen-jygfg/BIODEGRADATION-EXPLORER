/**
 * Test script for notification system
 * 
 * This script helps you test notifications by creating sample notifications
 * Run this in your app to test the notification system
 */

import { notificationService } from '../src/services/notifications.service'

export const testNotifications = {
  /**
   * Create a sample welcome notification
   */
  async createWelcome() {
    console.log('Creating welcome notification...')
    await notificationService.createNotification(
      'welcome',
      'Chào mừng',
      'Chào mừng bạn! Hãy cùng nhau thiết lập mục tiêu sức khỏe đầu tiên của bạn.',
      '🎉',
      '#FEF3C7'
    )
    console.log('✓ Welcome notification created')
  },

  /**
   * Create meal reminder notifications
   */
  async createMealReminders() {
    console.log('Creating meal reminders...')
    await notificationService.createMealReminder('breakfast')
    await notificationService.createMealReminder('lunch')
    await notificationService.createMealReminder('dinner')
    console.log('✓ Meal reminders created')
  },

  /**
   * Create water reminder
   */
  async createWaterReminder() {
    console.log('Creating water reminder...')
    await notificationService.createWaterReminder()
    console.log('✓ Water reminder created')
  },

  /**
   * Create exercise reminder
   */
  async createExerciseReminder() {
    console.log('Creating exercise reminder...')
    await notificationService.createExerciseReminder()
    console.log('✓ Exercise reminder created')
  },

  /**
   * Create sleep reminder
   */
  async createSleepReminder() {
    console.log('Creating sleep reminder...')
    await notificationService.createSleepReminder()
    console.log('✓ Sleep reminder created')
  },

  /**
   * Create goal completion notifications
   */
  async createGoalCompletions() {
    console.log('Creating goal completion notifications...')
    
    // Water goal
    await notificationService.createNotification(
      'goal_completed',
      'Hoàn thành mục tiêu',
      'Chúc mừng! Bạn đã uống đủ 2L nước hôm nay. Cơ thể đang cảm ơn bạn đấy!',
      '🏆',
      '#FEF3C7'
    )
    
    // Calorie goal
    await notificationService.createNotification(
      'goal_completed',
      'Đạt mục tiêu calo',
      'Tuyệt vời! Bạn đã đạt 1800/1800 calo hôm nay.',
      '🎯',
      '#FEF3C7'
    )
    
    // Exercise goal
    await notificationService.createNotification(
      'goal_completed',
      'Hoàn thành tập luyện',
      'Tuyệt vời! Bạn đã hoàn thành mục tiêu tập luyện hôm nay.',
      '💪',
      '#FEE2E2'
    )
    
    console.log('✓ Goal completion notifications created')
  },

  /**
   * Create streak notification
   */
  async createStreak() {
    console.log('Creating streak notification...')
    await notificationService.createNotification(
      'streak',
      'Chuỗi thói quen',
      'Tuyệt vời! Bạn đã duy trì ăn uống lành mạnh 5 ngày liên tiếp. Đừng bỏ cuộc nhé!',
      '🔥',
      '#FEE2E2'
    )
    console.log('✓ Streak notification created')
  },

  /**
   * Create health tips
   */
  async createHealthTips() {
    console.log('Creating health tips...')
    
    const tips = [
      'Hãy ăn rau xanh trước khi ăn cơm để kiểm soát đường huyết tốt hơn.',
      'Ăn chậm nhai kỹ giúp giảm đến 20% lượng calo nạp vào.',
      'Uống một cốc nước ấm vào buổi sáng giúp khởi động quá trình trao đổi chất.',
    ]
    
    for (const tip of tips) {
      await notificationService.createHealthTip(tip)
    }
    
    console.log('✓ Health tips created')
  },

  /**
   * Create weight update reminder
   */
  async createWeightReminder() {
    console.log('Creating weight update reminder...')
    await notificationService.createWeightUpdateReminder()
    console.log('✓ Weight update reminder created')
  },

  /**
   * Create all test notifications
   */
  async createAll() {
    console.log('========================================')
    console.log('Creating ALL test notifications...')
    console.log('========================================\n')
    
    try {
      await this.createWelcome()
      await this.createMealReminders()
      await this.createWaterReminder()
      await this.createExerciseReminder()
      await this.createSleepReminder()
      await this.createGoalCompletions()
      await this.createStreak()
      await this.createHealthTips()
      
      console.log('\n========================================')
      console.log('✓ ALL test notifications created successfully!')
      console.log('========================================')
    } catch (error) {
      console.error('❌ Error creating test notifications:', error)
    }
  },

  /**
   * Test notification settings
   */
  async testSettings() {
    console.log('Testing notification settings...')
    
    // Get current settings
    const settings = await notificationService.getSettings()
    console.log('Current settings:', settings)
    
    // Update settings
    await notificationService.updateSettings({
      breakfast_time: '08:00:00',
      water_interval_hours: 3,
    })
    console.log('✓ Settings updated')
    
    // Get updated settings
    const updatedSettings = await notificationService.getSettings()
    console.log('Updated settings:', updatedSettings)
  },

  /**
   * Test realtime subscription
   */
  testRealtime() {
    console.log('Testing realtime subscription...')
    console.log('Listening for new notifications...')
    
    const channel = notificationService.subscribeToNotifications((notification) => {
      console.log('🔔 New notification received:', notification)
    })
    
    console.log('✓ Realtime subscription active')
    console.log('Try creating a notification in another session to test')
    
    // Return unsubscribe function
    return () => {
      notificationService.unsubscribeFromNotifications()
      console.log('✓ Unsubscribed from notifications')
    }
  },

  /**
   * Get notification statistics
   */
  async getStats() {
    console.log('Getting notification statistics...')
    
    const notifications = await notificationService.getNotifications(100)
    const unreadCount = await notificationService.getUnreadCount()
    
    const typeCount: Record<string, number> = {}
    notifications.forEach(notif => {
      typeCount[notif.type] = (typeCount[notif.type] || 0) + 1
    })
    
    console.log('\n========================================')
    console.log('Notification Statistics')
    console.log('========================================')
    console.log(`Total notifications: ${notifications.length}`)
    console.log(`Unread count: ${unreadCount}`)
    console.log(`Read count: ${notifications.length - unreadCount}`)
    console.log('\nBy Type:')
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })
    console.log('========================================\n')
  },

  /**
   * Clear all notifications (mark as read)
   */
  async clearAll() {
    console.log('Marking all notifications as read...')
    await notificationService.markAllAsRead()
    console.log('✓ All notifications marked as read')
  }
}

// Example usage in your app:
// 
// import { testNotifications } from '@/scripts/test-notifications'
// 
// // Create all test notifications
// await testNotifications.createAll()
// 
// // Or individual tests:
// await testNotifications.createMealReminders()
// await testNotifications.getStats()
// 
// // Test realtime
// const unsubscribe = testNotifications.testRealtime()
// // Later: unsubscribe()
