import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth-provider'
import { ProfileService } from '@/services/profile.service'
import { useDate } from '@/context/date-context'

type ModalType = 'height' | 'weight' | 'age' | 'gender' | 'activity' | 'goal' | null

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
type Gender = 'male' | 'female'
type Goal = 'lose_weight' | 'maintain' | 'gain_muscle'

interface BMRData {
    height: number
    weight: number
    age: number
    gender: Gender
    activityLevel: ActivityLevel
    goal: Goal
}

const BmrTrackingScreen = () => {
    const { user } = useAuth()
    const { triggerRefresh } = useDate()
    
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [currentModal, setCurrentModal] = useState<ModalType>(null)
    
    const [bmrData, setBmrData] = useState<BMRData>({
        height: 172,
        weight: 68,
        age: 25,
        gender: 'male',
        activityLevel: 'moderate',
        goal: 'maintain'
    })
    
    const [tempValue, setTempValue] = useState<number | string>(0)

    // Load profile data
    useEffect(() => {
        loadProfileData()
    }, [user])

    const loadProfileData = async () => {
        if (!user?.id) return
        
        try {
            const profile = await ProfileService.getProfile(user.id)
            if (profile) {
                const age = profile.date_of_birth 
                    ? calculateAge(profile.date_of_birth)
                    : 25
                
                setBmrData({
                    height: profile.height_cm || 172,
                    weight: profile.current_weight_kg || 68,
                    age,
                    gender: (profile.gender as Gender) || 'male',
                    activityLevel: (profile.activity_level as ActivityLevel) || 'moderate',
                    goal: (profile.goal as Goal) || 'maintain'
                })
            }
        } catch (error) {
            console.error('Error loading profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateAge = (dateOfBirth: string): number => {
        const today = new Date()
        const birthDate = new Date(dateOfBirth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        
        return age
    }

    const openModal = (type: ModalType) => {
        setCurrentModal(type)
        
        // Set temp value
        switch (type) {
            case 'height':
                setTempValue(bmrData.height)
                break
            case 'weight':
                setTempValue(bmrData.weight)
                break
            case 'age':
                setTempValue(bmrData.age)
                break
            case 'gender':
                setTempValue(bmrData.gender)
                break
            case 'activity':
                setTempValue(bmrData.activityLevel)
                break
            case 'goal':
                setTempValue(bmrData.goal)
                break
        }
        
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setCurrentModal(null)
    }

    const handleIncrement = () => {
        if (currentModal === 'height') {
            setTempValue(prev => Math.min((prev as number) + 1, 250))
        } else if (currentModal === 'weight') {
            setTempValue(prev => Math.min((prev as number) + 1, 300))
        } else if (currentModal === 'age') {
            setTempValue(prev => Math.min((prev as number) + 1, 120))
        }
    }

    const handleDecrement = () => {
        if (currentModal === 'height') {
            setTempValue(prev => Math.max((prev as number) - 1, 100))
        } else if (currentModal === 'weight') {
            setTempValue(prev => Math.max((prev as number) - 1, 30))
        } else if (currentModal === 'age') {
            setTempValue(prev => Math.max((prev as number) - 1, 10))
        }
    }

    const handleSaveModal = async () => {
        let newData = { ...bmrData }
        
        switch (currentModal) {
            case 'height':
                newData.height = tempValue as number
                break
            case 'weight':
                newData.weight = tempValue as number
                break
            case 'age':
                newData.age = tempValue as number
                break
            case 'gender':
                newData.gender = tempValue as Gender
                break
            case 'activity':
                newData.activityLevel = tempValue as ActivityLevel
                break
            case 'goal':
                newData.goal = tempValue as Goal
                break
        }
        
        setBmrData(newData)
        closeModal()
        
        // Auto save to database
        await saveToDatabase(newData)
    }

    const saveToDatabase = async (data: BMRData) => {
        if (!user?.id) return
        
        setSaving(true)
        
        try {
            // Calculate birth year from age
            const currentYear = new Date().getFullYear()
            const birthYear = currentYear - data.age
            const dateOfBirth = `${birthYear}-01-01`
            
            await ProfileService.updateProfile(user.id, {
                height_cm: data.height,
                current_weight_kg: data.weight,
                date_of_birth: dateOfBirth,
                gender: data.gender,
                activity_level: data.activityLevel,
                goal: data.goal
            })
            
            // Trigger refresh home screen
            triggerRefresh()
            
            Alert.alert('Thành công', 'Đã cập nhật thông tin BMR', [
                { text: 'OK', onPress: () => router.back() }
            ])
        } catch (error: any) {
            console.error('Error saving BMR data:', error)
            Alert.alert('Lỗi', error.message || 'Không thể lưu thông tin')
        } finally {
            setSaving(false)
        }
    }

    const getActivityLevelLabel = (level: ActivityLevel) => {
        switch (level) {
            case 'sedentary': return 'Ít vận động'
            case 'light': return 'Vận động nhẹ'
            case 'moderate': return 'Vận động vừa'
            case 'active': return 'Vận động mạnh'
            case 'very_active': return 'Vận động cực độ'
        }
    }

    const getGoalLabel = (goal: Goal) => {
        switch (goal) {
            case 'lose_weight': return 'Giảm cân'
            case 'maintain': return 'Giữ nguyên cân nặng'
            case 'gain_muscle': return 'Tăng cân'
        }
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#A78BFA" />
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 pt-10">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-lg font-semibold text-gray-900 mr-6">
                    Cập nhật BMR
                </Text>
            </View>

            {/* Content */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4 space-y-3">
                    {/* Height */}
                    <TouchableOpacity
                        onPress={() => openModal('height')}
                        className="bg-white rounded-2xl p-4 flex-row justify-between items-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 1,
                        }}
                    >
                        <Text className="text-base text-gray-900">Chiều cao</Text>
                        <Text className="text-base text-gray-500">{bmrData.height}</Text>
                    </TouchableOpacity>

                    {/* Weight */}
                    <TouchableOpacity
                        onPress={() => openModal('weight')}
                        className="bg-white rounded-2xl p-4 flex-row justify-between items-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 1,
                        }}
                    >
                        <Text className="text-base text-gray-900">Cân nặng</Text>
                        <Text className="text-base text-gray-500">{bmrData.weight}</Text>
                    </TouchableOpacity>

                    {/* Age */}
                    <TouchableOpacity
                        onPress={() => openModal('age')}
                        className="bg-white rounded-2xl p-4 flex-row justify-between items-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 1,
                        }}
                    >
                        <Text className="text-base text-gray-900">Tuổi</Text>
                        <Text className="text-base text-gray-500">{bmrData.age}</Text>
                    </TouchableOpacity>

                    {/* Gender */}
                    <TouchableOpacity
                        onPress={() => openModal('gender')}
                        className="bg-white rounded-2xl p-4 flex-row justify-between items-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 1,
                        }}
                    >
                        <Text className="text-base text-gray-900">Giới tính</Text>
                        <Text className="text-base text-gray-500">
                            {bmrData.gender === 'male' ? 'Nam' : 'Nữ'}
                        </Text>
                    </TouchableOpacity>

                    {/* Activity Level */}
                    <TouchableOpacity
                        onPress={() => openModal('activity')}
                        className="bg-white rounded-2xl p-4 flex-row justify-between items-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 1,
                        }}
                    >
                        <Text className="text-base text-gray-900">Cường độ tập luyện</Text>
                        <Text className="text-base text-gray-500">
                            {getActivityLevelLabel(bmrData.activityLevel)}
                        </Text>
                    </TouchableOpacity>

                    {/* Goal */}
                    <TouchableOpacity
                        onPress={() => openModal('goal')}
                        className="bg-white rounded-2xl p-4 flex-row justify-between items-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 1,
                        }}
                    >
                        <Text className="text-base text-gray-900">Mục tiêu của bạn</Text>
                        <Text className="text-base text-gray-500">
                            {getGoalLabel(bmrData.goal)}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white rounded-3xl p-6 w-full max-w-md">
                        {/* Number Input Modals */}
                        {(currentModal === 'height' || currentModal === 'weight' || currentModal === 'age') && (
                            <>
                                <Text className="text-xl font-bold text-gray-900 text-center mb-6">
                                    {currentModal === 'height' && 'Chiều cao'}
                                    {currentModal === 'weight' && 'Cân nặng'}
                                    {currentModal === 'age' && 'Tuổi'}
                                </Text>

                                <View className="flex-row items-center justify-center mb-6">
                                    <TouchableOpacity
                                        onPress={handleDecrement}
                                        className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
                                    >
                                        <Ionicons name="remove" size={24} color="#374151" />
                                    </TouchableOpacity>

                                    <View className="mx-8">
                                        <Text className="text-5xl font-bold text-gray-900 text-center">
                                            {tempValue}
                                        </Text>
                                        <Text className="text-base text-gray-500 text-center mt-1">
                                            {currentModal === 'height' && '(cm)'}
                                            {currentModal === 'weight' && '(kg)'}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleIncrement}
                                        className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
                                    >
                                        <Ionicons name="add" size={24} color="#374151" />
                                    </TouchableOpacity>
                                </View>

                                <View className="flex-row space-x-3">
                                    <TouchableOpacity
                                        onPress={closeModal}
                                        className="flex-1 py-4 rounded-2xl border border-gray-300"
                                    >
                                        <Text className="text-center text-base font-semibold text-gray-700">
                                            Hủy bỏ
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={handleSaveModal}
                                        className="flex-1 py-4 rounded-2xl bg-green-500"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Text className="text-center text-base font-semibold text-white">
                                                Cập nhật
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {/* Gender Modal */}
                        {currentModal === 'gender' && (
                            <>
                                <Text className="text-xl font-bold text-gray-900 text-center mb-6">
                                    Giới tính
                                </Text>

                                <TouchableOpacity
                                    onPress={() => setTempValue('male')}
                                    className="flex-row items-center py-4 border-b border-gray-200"
                                >
                                    <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                                        tempValue === 'male' ? 'border-blue-500' : 'border-gray-300'
                                    }`}>
                                        {tempValue === 'male' && (
                                            <View className="w-3 h-3 rounded-full bg-blue-500" />
                                        )}
                                    </View>
                                    <Text className="text-base text-gray-900">Nam</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setTempValue('female')}
                                    className="flex-row items-center py-4"
                                >
                                    <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                                        tempValue === 'female' ? 'border-blue-500' : 'border-gray-300'
                                    }`}>
                                        {tempValue === 'female' && (
                                            <View className="w-3 h-3 rounded-full bg-blue-500" />
                                        )}
                                    </View>
                                    <Text className="text-base text-gray-900">Nữ</Text>
                                </TouchableOpacity>

                                <View className="flex-row space-x-3 mt-6">
                                    <TouchableOpacity
                                        onPress={closeModal}
                                        className="flex-1 py-4 rounded-2xl border border-gray-300"
                                    >
                                        <Text className="text-center text-base font-semibold text-gray-700">
                                            Hủy bỏ
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={handleSaveModal}
                                        className="flex-1 py-4 rounded-2xl bg-green-500"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Text className="text-center text-base font-semibold text-white">
                                                Cập nhật
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {/* Activity Level Modal */}
                        {currentModal === 'activity' && (
                            <>
                                <Text className="text-xl font-bold text-gray-900 text-center mb-6">
                                    Cường độ tập luyện
                                </Text>

                                {[
                                    { value: 'sedentary', label: 'Ít vận động', desc: 'Ít đi lại, không tập thể dục.' },
                                    { value: 'light', label: 'Vận động nhẹ', desc: 'Đi bộ nhẹ nhàng hoặc tập thể dục.' },
                                    { value: 'moderate', label: 'Vận động vừa', desc: 'Tập thể thao hoặc chạy bộ.' },
                                    { value: 'active', label: 'Vận động mạnh', desc: 'Tập luyện cường độ cao.' },
                                    { value: 'very_active', label: 'Vận động cực độ', desc: 'Vận động viên/làm công việc tay chân.' },
                                ].map((item, index, array) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        onPress={() => setTempValue(item.value)}
                                        className={`py-4 ${index < array.length - 1 ? 'border-b border-gray-200' : ''}`}
                                    >
                                        <View className="flex-row items-start">
                                            <View className={`w-6 h-6 rounded-full border-2 mr-3 mt-1 items-center justify-center ${
                                                tempValue === item.value ? 'border-blue-500' : 'border-gray-300'
                                            }`}>
                                                {tempValue === item.value && (
                                                    <View className="w-3 h-3 rounded-full bg-blue-500" />
                                                )}
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-base font-semibold text-gray-900">{item.label}</Text>
                                                <Text className="text-sm text-gray-500 mt-1">{item.desc}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}

                                <View className="flex-row space-x-3 mt-6">
                                    <TouchableOpacity
                                        onPress={closeModal}
                                        className="flex-1 py-4 rounded-2xl border border-gray-300"
                                    >
                                        <Text className="text-center text-base font-semibold text-gray-700">
                                            Hủy bỏ
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={handleSaveModal}
                                        className="flex-1 py-4 rounded-2xl bg-green-500"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Text className="text-center text-base font-semibold text-white">
                                                Cập nhật
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {/* Goal Modal */}
                        {currentModal === 'goal' && (
                            <>
                                <Text className="text-xl font-bold text-gray-900 text-center mb-6">
                                    Mục tiêu
                                </Text>

                                {[
                                    { value: 'lose_weight', label: 'Giảm cân', desc: 'Quản lý cân nặng của bạn' },
                                    { value: 'maintain', label: 'Giữ nguyên cân nặng', desc: 'Tối ưu cho sức khỏe của bạn' },
                                    { value: 'gain_muscle', label: 'Tăng cân', desc: 'Tăng cân với eat clean' },
                                ].map((item, index, array) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        onPress={() => setTempValue(item.value)}
                                        className={`py-4 ${index < array.length - 1 ? 'border-b border-gray-200' : ''}`}
                                    >
                                        <View className="flex-row items-start">
                                            <View className={`w-6 h-6 rounded-full border-2 mr-3 mt-1 items-center justify-center ${
                                                tempValue === item.value ? 'border-blue-500' : 'border-gray-300'
                                            }`}>
                                                {tempValue === item.value && (
                                                    <View className="w-3 h-3 rounded-full bg-blue-500" />
                                                )}
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-base font-semibold text-gray-900">{item.label}</Text>
                                                <Text className="text-sm text-gray-500 mt-1">{item.desc}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}

                                <View className="flex-row space-x-3 mt-6">
                                    <TouchableOpacity
                                        onPress={closeModal}
                                        className="flex-1 py-4 rounded-2xl border border-gray-300"
                                    >
                                        <Text className="text-center text-base font-semibold text-gray-700">
                                            Hủy bỏ
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={handleSaveModal}
                                        className="flex-1 py-4 rounded-2xl bg-green-500"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Text className="text-center text-base font-semibold text-white">
                                                Cập nhật
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default BmrTrackingScreen
