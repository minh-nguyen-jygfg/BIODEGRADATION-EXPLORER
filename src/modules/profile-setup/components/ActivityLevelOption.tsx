import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface ActivityLevelOptionProps {
    title: string
    description: string
    selected: boolean
    onPress: () => void
}

const ActivityLevelOption: React.FC<ActivityLevelOptionProps> = ({
    title,
    description,
    selected,
    onPress,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between py-4 px-5 bg-gray-50 rounded-xl mb-3"
        >
            <View className="flex-1 mr-4">
                <Text className={`text-base font-semibold mb-1 ${selected ? 'text-primary' : 'text-gray-900'}`}>
                    {title}
                </Text>
                <Text className="text-sm text-gray-500">{description}</Text>
            </View>
            <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selected ? 'border-primary' : 'border-gray-300'
                    }`}
            >
                {selected && <View className="w-3 h-3 rounded-full bg-primary" />}
            </View>
        </TouchableOpacity>
    )
}

export default ActivityLevelOption
