import React from 'react'
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { Home2, Profile, ArrangeHorizontalCircle } from 'iconsax-react-native'

const icons = {
  home: Home2,
  user: Profile,
  story: ArrangeHorizontalCircle,
}

type TabIconProps = {
  Icon: React.ElementType
  focused: boolean
}

const TabIcon = ({ Icon, focused }: TabIconProps) => {
  return (
    <View
      style={
        focused
          ? {
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 100,
              backgroundColor: '#2E7D32',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
              height: 56,
              marginTop: 25,
              width: 88,
            }
          : {
              paddingHorizontal: 12,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 25,
            }
      }
    >
      <Icon
        size={24}
        color={focused ? '#FFFFFF' : '#637381'}
        variant={focused ? 'Bold' :'Outline'}
      />
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 999,
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          paddingHorizontal: 15,
          marginHorizontal: 60,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          const Icon = icons[route.name as keyof typeof icons]
          return <TabIcon Icon={Icon} focused={focused} />
        },
      })}
    >
      <Tabs.Screen name="story" options={{ title: 'Story' }} />
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="user" options={{ title: 'User' }} />
    </Tabs>
  )
}
