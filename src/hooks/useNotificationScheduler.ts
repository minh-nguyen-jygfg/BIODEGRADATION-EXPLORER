import { useEffect, useRef } from 'react'
import { notificationService } from '@/services/notifications.service'
import { AppState, AppStateStatus } from 'react-native'

/**
 * Custom hook to schedule automatic notifications
 * This hook handles:
 * - Meal reminders (breakfast, lunch, dinner)
 * - Water reminders (every 2 hours)
 * - Exercise reminders
 * - Sleep reminders
 * - Weekly weight update reminders
 */
export const useNotificationScheduler = () => {
  const appState = useRef(AppState.currentState)
  const intervalIds = useRef<NodeJS.Timeout[]>([])
  const lastWaterReminder = useRef<Date>(new Date())
  const notifiedToday = useRef<Set<string>>(new Set())

  // Check if notification was already sent today
  const wasNotifiedToday = (key: string): boolean => {
    const today = new Date().toDateString()
    const fullKey = `${today}-${key}`
    return notifiedToday.current.has(fullKey)
  }

  // Mark notification as sent
  const markAsNotified = (key: string) => {
    const today = new Date().toDateString()
    const fullKey = `${today}-${key}`
    notifiedToday.current.add(fullKey)
  }

  // Clear daily notifications at midnight
  const clearDailyNotifications = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime()
    
    setTimeout(() => {
      notifiedToday.current.clear()
      clearDailyNotifications() // Schedule next day
    }, msUntilMidnight)
  }

  // Check and send meal reminders
  const checkMealReminders = async () => {
    try {
      const settings = await notificationService.getSettings()
      if (!settings) return

      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      // Breakfast reminder
      if (settings.breakfast_enabled && 
          settings.breakfast_time === currentTime + ':00' &&
          !wasNotifiedToday('breakfast')) {
        await notificationService.createMealReminder('breakfast')
        markAsNotified('breakfast')
      }

      // Lunch reminder
      if (settings.lunch_enabled && 
          settings.lunch_time === currentTime + ':00' &&
          !wasNotifiedToday('lunch')) {
        await notificationService.createMealReminder('lunch')
        markAsNotified('lunch')
      }

      // Dinner reminder
      if (settings.dinner_enabled && 
          settings.dinner_time === currentTime + ':00' &&
          !wasNotifiedToday('dinner')) {
        await notificationService.createMealReminder('dinner')
        markAsNotified('dinner')
      }
    } catch (error) {
      console.error('Error checking meal reminders:', error)
    }
  }

  // Check and send water reminder
  const checkWaterReminder = async () => {
    try {
      const settings = await notificationService.getSettings()
      if (!settings || !settings.water_enabled) return

      const now = new Date()
      const hoursSinceLastReminder = (now.getTime() - lastWaterReminder.current.getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastReminder >= settings.water_interval_hours) {
        await notificationService.createWaterReminder()
        lastWaterReminder.current = now
      }
    } catch (error) {
      console.error('Error checking water reminder:', error)
    }
  }

  // Check and send exercise reminder
  const checkExerciseReminder = async () => {
    try {
      const settings = await notificationService.getSettings()
      if (!settings || !settings.exercise_enabled) return

      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      if (settings.exercise_time === currentTime + ':00' && !wasNotifiedToday('exercise')) {
        await notificationService.createExerciseReminder()
        markAsNotified('exercise')
      }
    } catch (error) {
      console.error('Error checking exercise reminder:', error)
    }
  }

  // Check and send sleep reminder
  const checkSleepReminder = async () => {
    try {
      const settings = await notificationService.getSettings()
      if (!settings || !settings.sleep_enabled) return

      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      if (settings.sleep_time === currentTime + ':00' && !wasNotifiedToday('sleep')) {
        await notificationService.createSleepReminder()
        markAsNotified('sleep')
      }
    } catch (error) {
      console.error('Error checking sleep reminder:', error)
    }
  }

  // Check and send weekly weight update reminder
  const checkWeightUpdateReminder = async () => {
    try {
      const now = new Date()
      const today = now.getDay()
      const hour = now.getHours()

      // Send on Sunday morning at 8 AM
      if (today === 0 && hour === 8 && !wasNotifiedToday('weight')) {
        await notificationService.createWeightUpdateReminder()
        markAsNotified('weight')
      }
    } catch (error) {
      console.error('Error checking weight reminder:', error)
    }
  }

  // Send random health tips
  const sendHealthTip = async () => {
    const tips = [
      'Hãy ăn rau xanh trước khi ăn cơm để kiểm soát đường huyết tốt hơn.',
      'Ăn chậm nhai kỹ giúp giảm đến 20% lượng calo nạp vào.',
      'Uống một cốc nước ấm vào buổi sáng giúp khởi động quá trình trao đổi chất.',
      'Ngủ đủ 7-8 tiếng mỗi đêm giúp kiểm soát cân nặng hiệu quả hơn.',
      'Bổ sung protein vào mỗi bữa ăn giúp no lâu và duy trì cơ bắp.',
      'Vận động 30 phút mỗi ngày giúp giảm nguy cơ mắc bệnh tim mạch.',
      'Hãy đặt mục tiêu nhỏ và thực tế để duy trì động lực dài hạn.',
    ]

    try {
      const randomTip = tips[Math.floor(Math.random() * tips.length)]
      await notificationService.createHealthTip(randomTip)
    } catch (error) {
      console.error('Error sending health tip:', error)
    }
  }

  // Main scheduler function
  const startScheduler = () => {
    // Clear existing intervals
    intervalIds.current.forEach(clearInterval)
    intervalIds.current = []

    // Check every minute for time-based reminders
    const mainInterval = setInterval(() => {
      checkMealReminders()
      checkExerciseReminder()
      checkSleepReminder()
      checkWeightUpdateReminder()
    }, 60000) // Every minute

    // Check water reminder every 30 minutes
    const waterInterval = setInterval(() => {
      checkWaterReminder()
    }, 1800000) // Every 30 minutes

    // Send health tip twice a day (10 AM and 3 PM)
    const tipInterval = setInterval(() => {
      const now = new Date()
      const hour = now.getHours()
      
      if ((hour === 10 || hour === 15) && !wasNotifiedToday(`tip-${hour}`)) {
        sendHealthTip()
        markAsNotified(`tip-${hour}`)
      }
    }, 3600000) // Every hour

    intervalIds.current = [mainInterval, waterInterval, tipInterval]

    // Initial checks
    checkMealReminders()
    checkWaterReminder()
    checkExerciseReminder()
    checkSleepReminder()
    checkWeightUpdateReminder()
  }

  const stopScheduler = () => {
    intervalIds.current.forEach(clearInterval)
    intervalIds.current = []
  }

  useEffect(() => {
    // Start scheduler
    startScheduler()
    clearDailyNotifications()

    // Handle app state changes
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground - restart scheduler
        startScheduler()
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background - stop scheduler to save battery
        stopScheduler()
      }
      appState.current = nextAppState
    })

    // Cleanup
    return () => {
      stopScheduler()
      subscription.remove()
    }
  }, [])

  return {
    startScheduler,
    stopScheduler,
  }
}
