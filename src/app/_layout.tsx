// @@iconify-code-gen
import { Stack } from 'expo-router'
import '~/global.css' // Tailwind / NativeWind globals
import { QueryProvider } from '@/context/QueryProvider'
import { AuthProvider } from '@/context/auth-provider'
import { DateProvider } from '@/context/date-context'
import { NotificationProvider } from '@/context/notification-provider'
import { ToastManager } from '@/components/common/ToastManager'

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryProvider>
        <DateProvider>
          <NotificationProvider>
            <ToastManager>
              <Stack screenOptions={{ headerShown: false }} />
            </ToastManager>
          </NotificationProvider>
        </DateProvider>
      </QueryProvider>
    </AuthProvider>
  )
}
