import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface GenderCardProps {
    icon: string
    label: string
    selected: boolean
    onPress: () => void
    iconColor: string
}

const GenderCard: React.FC<GenderCardProps> = ({ icon, label, selected, onPress, iconColor }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-1 items-center justify-center py-8 rounded-2xl ${selected ? 'bg-gray-100 border-2 border-primary' : 'bg-gray-50'
                }`}
        >
            <Text className="text-5xl mb-3" style={{ color: iconColor }}>
                {icon}
            </Text>
            <Text className={`text-lg font-semibold ${selected ? 'text-primary' : 'text-gray-700'}`}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default GenderCard
