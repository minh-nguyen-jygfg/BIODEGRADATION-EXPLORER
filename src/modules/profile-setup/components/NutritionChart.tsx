import React from 'react'
import { Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

interface NutritionChartProps {
    protein_g: number
    fat_g: number
    carbs_g: number
}

const NutritionChart: React.FC<NutritionChartProps> = ({ protein_g, fat_g, carbs_g }) => {
    // Calculate calories from macros
    const proteinCal = protein_g * 4
    const fatCal = fat_g * 9
    const carbsCal = carbs_g * 4
    const totalCal = proteinCal + fatCal + carbsCal

    // Calculate percentages for the circle
    const proteinPercent = (proteinCal / totalCal) * 100
    const fatPercent = (fatCal / totalCal) * 100
    const carbsPercent = (carbsCal / totalCal) * 100

    // Circle properties
    const size = 140
    const strokeWidth = 20
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    // Calculate stroke dash offsets for each segment
    const proteinDash = (proteinPercent / 100) * circumference
    const fatDash = (fatPercent / 100) * circumference
    const carbsDash = (carbsPercent / 100) * circumference

    return (
        <View className="items-center py-6">
            {/* Circular Chart */}
            <View className="relative items-center justify-center mb-6">
                <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                    {/* Carbs (Green) - Bottom segment */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#10B981"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${carbsDash} ${circumference}`}
                        strokeDashoffset={0}
                        strokeLinecap="round"
                    />
                    {/* Fat (Red) - Middle segment */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#EF4444"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${fatDash} ${circumference}`}
                        strokeDashoffset={-carbsDash}
                        strokeLinecap="round"
                    />
                    {/* Protein (Blue) - Top segment */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#3B82F6"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${proteinDash} ${circumference}`}
                        strokeDashoffset={-(carbsDash + fatDash)}
                        strokeLinecap="round"
                    />
                </Svg>

                {/* Center Text */}
                <View className="absolute items-center justify-center">
                    <Text className="text-3xl font-bold text-gray-900">{Math.round(totalCal)}</Text>
                    <Text className="text-xs text-gray-500">kcal</Text>
                </View>
            </View>

            {/* Legend */}
            <View className="w-full px-8">
                {/* Protein */}
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                        <View className="w-3 h-3 rounded-full bg-[#3B82F6] mr-2" />
                        <Text className="text-sm text-gray-700">Đạm</Text>
                    </View>
                    <Text className="text-sm font-semibold text-gray-900">{protein_g.toFixed(1)} g</Text>
                </View>

                {/* Fat */}
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                        <View className="w-3 h-3 rounded-full bg-[#EF4444] mr-2" />
                        <Text className="text-sm text-gray-700">Béo</Text>
                    </View>
                    <Text className="text-sm font-semibold text-gray-900">{fat_g.toFixed(1)} g</Text>
                </View>

                {/* Carbs */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="w-3 h-3 rounded-full bg-[#10B981] mr-2" />
                        <Text className="text-sm text-gray-700">Tinh bột</Text>
                    </View>
                    <Text className="text-sm font-semibold text-gray-900">{carbs_g.toFixed(1)} g</Text>
                </View>
            </View>
        </View>
    )
}

export default NutritionChart
