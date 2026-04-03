import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import React from 'react'
import { clsx } from 'clsx'

type Props = {
  title: string
  textStyle?: string
} & TouchableOpacityProps

const AppButton = ({ title, textStyle = 'text-white', disabled, className, ...props }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={clsx(
        'bg-primary-main w-full rounded-2xl min-h-12 justify-center items-center',
        className,
      )}
      {...props}
    >
      {disabled ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text className={`font-semibold text-base ${textStyle}`}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

export default AppButton
