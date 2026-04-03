import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface NumericStepperProps {
    value: number
    onChange: (value: number) => void
    unit: string
    step?: number
    min?: number
    max?: number
    decimalPlaces?: number
}

const NumericStepper: React.FC<NumericStepperProps> = ({
    value,
    onChange,
    unit,
    step = 1,
    min = 0,
    max = 999,
    decimalPlaces = 0,
}) => {
    const handleIncrement = () => {
        const newValue = Math.min(value + step, max)
        onChange(Number(newValue.toFixed(decimalPlaces)))
    }

    const handleDecrement = () => {
        const newValue = Math.max(value - step, min)
        onChange(Number(newValue.toFixed(decimalPlaces)))
    }

    return (
        <View className="items-center justify-center py-12">
            <View className="flex-row items-center gap-8">
                {/* Decrement Button */}
                <TouchableOpacity
                    onPress={handleDecrement}
                    className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
                    disabled={value <= min}
                >
                    <Text className="text-2xl text-gray-600">−</Text>
                </TouchableOpacity>

                {/* Value Display */}
                <View className="items-center">
                    <Text className="text-6xl font-bold text-primary">
                        {decimalPlaces > 0 ? value.toFixed(decimalPlaces) : value}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-2">({unit})</Text>
                </View>

                {/* Increment Button */}
                <TouchableOpacity
                    onPress={handleIncrement}
                    className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
                    disabled={value >= max}
                >
                    <Text className="text-2xl text-gray-600">+</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default NumericStepper
