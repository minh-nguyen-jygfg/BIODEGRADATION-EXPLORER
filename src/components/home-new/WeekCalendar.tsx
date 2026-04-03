import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

type DayItem = {
  day: string // CN, T2, T3, T4, T5, T6, T7
  date: number
  fullDate: string // YYYY-MM-DD
}

type Props = {
  onDateSelect?: (date: string) => void
}

const WeekCalendar = ({ onDateSelect }: Props) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const todayRef = useRef<View>(null)
  
  // Helper function to check if a date is today
  const isToday = (fullDate: string) => {
    const today = new Date().toISOString().split('T')[0]
    return fullDate === today
  }
  
  // Generate dates for 30 days (15 days before and after today)
  const getAllDates = (): DayItem[] => {
    const today = new Date()
    const dates: DayItem[] = []
    
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    
    // Generate 15 days before today
    for (let i = 15; i >= 1; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      
      const dayOfWeek = date.getDay()
      
      dates.push({
        day: dayNames[dayOfWeek],
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
      })
    }
    
    // Add today
    dates.push({
      day: dayNames[today.getDay()],
      date: today.getDate(),
      fullDate: today.toISOString().split('T')[0],
    })
    
    // Generate 15 days after today
    for (let i = 1; i <= 15; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const dayOfWeek = date.getDay()
      
      dates.push({
        day: dayNames[dayOfWeek],
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
      })
    }
    
    return dates
  }

  const [allDates] = useState<DayItem[]>(getAllDates())
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  
  // Find today's index to scroll to it on mount
  const todayIndex = allDates.findIndex(item => isToday(item.fullDate))
  
  // Auto scroll to today on mount
  useEffect(() => {
    if (scrollViewRef.current && todayIndex >= 0) {
      // Delay scroll to ensure layout is ready
      setTimeout(() => {
        // Scroll to position that centers today (approximately)
        const itemWidth = 70 // approximate width of each item
        const scrollPosition = Math.max(0, (todayIndex * itemWidth) - 100)
        scrollViewRef.current?.scrollTo({
          x: scrollPosition,
          animated: true,
        })
      }, 100)
    }
  }, [])

  const handleDatePress = (date: string) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  return (
    <View className="mb-6">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        decelerationRate="fast"
      >
        {allDates.map((item, index) => {
          const selected = item.fullDate === selectedDate
          const today = isToday(item.fullDate)
          
          return (
            <TouchableOpacity
              key={index}
              ref={today ? todayRef : null}
              onPress={() => handleDatePress(item.fullDate)}
              className={`items-center px-4 py-3 rounded-2xl mr-3 ${
                selected ? 'bg-white' : 'bg-[#FFFFFF52]'
              }`}
              style={{
                minWidth: 64,
                ...(selected
                  ? {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }
                  : {}),
              }}
            >
              <Text className={`text-xs mb-1 ${selected ? 'text-gray-500' : 'text-gray-400'}`}>
                {item.day}
              </Text>
              <Text className={`text-2xl font-bold ${selected ? 'text-gray-900' : 'text-gray-600'}`}>
                {item.date}
              </Text>
              {/* Indicator cho ngày hôm nay */}
              {today && (
                <View className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary-main" />
              )}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default WeekCalendar
