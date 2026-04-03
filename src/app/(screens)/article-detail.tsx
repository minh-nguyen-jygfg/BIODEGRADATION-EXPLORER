import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Heart, Share } from 'iconsax-react-native'
import { ArticlesService } from '@/services/articles.service'
import { useAuth } from '@/context/auth-provider'
import { Database } from '@/types/database.types'

const { width } = Dimensions.get('window')

type Article = Database['public']['Tables']['articles']['Row']

// Fallback article details for old structure compatibility
const ARTICLE_DETAILS_FALLBACK: Record<string, any> = {
    '1-1': {
        title: 'Quy tắc "Đĩa ăn hạnh phúc"\nĂn chuẩn không cần tính Calo',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
        sections: [
            {
                title: '1. Tại sao bạn nên biết quy tắc này?',
                content:
                    'Bạn cảm thấy mệt mỏi vì phải cân đo từng gram thức ăn hay nhập liệu calo phức tạp? Quy tắc "Đĩa ăn" (The Plate Method) là cách đơn giản nhất để bạn kiểm soát dinh dưỡng chỉ bằng mắt thường mà vẫn đảm bảo cơ thể có thể hấp thu đủ chất.',
            },
            {
                title: '2. Đặc Điểm Nhận Diện',
                content: 'Hãy tưởng tượng chắc địa của bạn chia làm 3 phần:',
                bullets: [
                    '1/2 Đĩa: Rau củ và trái cây (Chất xơ)',
                    '1/4 Đĩa: Chất đạm - Protein (Thịt, cá, trứng, đậu)',
                    '1/4 Đĩa: Tinh bột phức hợp (Carbs)',
                ],
                subContent: [
                    {
                        text: 'Nên chọn nhiều màu sắc khác nhau (xanh, đỏ, tím, vàng).',
                        indent: true,
                    },
                    {
                        text: 'Hạn chế các loại rau củ nhiều tinh bột như khoai tây trong phần này.',
                        indent: true,
                    },
                    {
                        text: 'Ưu tiên thịt đỏ và các loại thịt chế biến sẵn.',
                        indent: true,
                    },
                    {
                        text: 'Lựa chọn thông minh: Gạo lứt, khoai lang, yến mạch thay vì gạo trắng, bánh mì trắng, ngũ cốc.',
                        indent: true,
                    },
                    {
                        text: 'Giúp no lâu và giữ mức năng lượng ổn định suốt cả ngày.',
                        indent: true,
                    },
                ],
            },
            {
                title: '3. Dùng quen "Gia vị" cho sức khỏe',
                content: 'Đối bữa ăn hòa hảo hơn, hãy bổ sung:',
                bullets: [
                    'Chất béo tốt: Một ít dầu ô liu, bơ hoặc các loại hạt.',
                    'Đồ uống: Ưu tiên nước lọc, trà không đường thay vì nước ngọt có gas.',
                ],
            },
        ],
    },
    // Add more article details as needed
}

export default function ArticleDetailScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const params = useLocalSearchParams()
    const articleId = params.id as string
    
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSaved, setIsSaved] = useState(false)

    // Load article from Supabase
    useEffect(() => {
        loadArticle()
        if (user?.id) {
            checkIfSaved()
        }
    }, [articleId, user])

    const loadArticle = async () => {
        try {
            const data = await ArticlesService.getArticleById(articleId)
            if (data) {
                setArticle(data)
            } else {
                Alert.alert('Lỗi', 'Không tìm thấy bài viết')
                router.back()
            }
        } catch (error) {
            console.error('Error loading article:', error)
            Alert.alert('Lỗi', 'Không thể tải bài viết')
        } finally {
            setLoading(false)
        }
    }

    const checkIfSaved = async () => {
        if (!user?.id) return
        const saved = await ArticlesService.isArticleSaved(user.id, articleId)
        setIsSaved(saved)
    }

    const handleSaveToggle = async () => {
        if (!user?.id) {
            Alert.alert('Thông báo', 'Vui lòng đăng nhập để lưu bài viết')
            return
        }

        try {
            if (isSaved) {
                const success = await ArticlesService.unsaveArticle(user.id, articleId)
                if (success) {
                    setIsSaved(false)
                    Alert.alert('Thành công', 'Đã bỏ lưu bài viết')
                }
            } else {
                const success = await ArticlesService.saveArticle(user.id, articleId)
                if (success) {
                    setIsSaved(true)
                    Alert.alert('Thành công', 'Đã lưu bài viết')
                }
            }
        } catch (error) {
            console.error('Error toggling save:', error)
            Alert.alert('Lỗi', 'Không thể lưu bài viết')
        }
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
                <ActivityIndicator size="large" color="#A78BFA" />
            </View>
        )
    }

    if (!article) {
        return null
    }

    // Parse content as markdown-style sections
    const renderContent = () => {
        const content = article.content || 'Nội dung đang được cập nhật...'
        const lines = content.split('\n')
        const elements: JSX.Element[] = []
        let key = 0

        lines.forEach((line, index) => {
            if (line.startsWith('## ')) {
                // Section heading
                elements.push(
                    <Text key={key++} className="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2">
                        {line.replace('## ', '')}
                    </Text>
                )
            } else if (line.startsWith('### ')) {
                // Sub heading
                elements.push(
                    <Text key={key++} className="text-base font-semibold text-slate-900 dark:text-white mt-3 mb-2">
                        {line.replace('### ', '')}
                    </Text>
                )
            } else if (line.startsWith('- ')) {
                // Bullet point
                elements.push(
                    <View key={key++} className="flex-row mb-2 ml-2">
                        <Text className="text-slate-700 dark:text-slate-300 mr-2">•</Text>
                        <Text className="flex-1 text-base text-slate-700 dark:text-slate-300 leading-6">
                            {line.replace('- ', '')}
                        </Text>
                    </View>
                )
            } else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                // Bold text
                elements.push(
                    <Text key={key++} className="text-base font-semibold text-slate-900 dark:text-white mt-2 mb-1">
                        {line.replace(/\*\*/g, '')}
                    </Text>
                )
            } else if (line.trim()) {
                // Normal paragraph
                elements.push(
                    <Text key={key++} className="text-base text-slate-700 dark:text-slate-300 leading-6 mb-3">
                        {line}
                    </Text>
                )
            }
        })

        return elements
    }

    // Fallback to old structure if needed
    const articleOld = ARTICLE_DETAILS_FALLBACK[articleId] || {
        title: 'Protein: "Kiên trúc sư" xây dựng cơ bắp bạn cần biết',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
        sections: [
            {
                title: '1. Protein là gì?',
                content:
                    'Protein là một trong ba chất dinh dưỡng đa lượng quan trọng nhất (cùng với carbohydrate và chất béo). Nó đóng vai trò thiết yếu trong việc xây dựng và sửa chữa các mô trong cơ thể.',
            },
            {
                title: '2. Tại sao protein quan trọng?',
                content: 'Protein có nhiều vai trò quan trọng:',
                bullets: [
                    'Xây dựng và phục hồi cơ bắp',
                    'Tạo enzyme và hormone',
                    'Hỗ trợ hệ miễn dịch',
                    'Vận chuyển và lưu trữ các phân tử',
                ],
            },
            {
                title: '3. Nguồn protein tốt',
                content: 'Bạn có thể lấy protein từ nhiều nguồn khác nhau:',
                bullets: [
                    'Thịt nạc: Gà, bò, heo',
                    'Cá và hải sản',
                    'Trứng',
                    'Các loại đậu và hạt',
                    'Sản phẩm từ sữa',
                ],
            },
        ],
    }

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View className="relative">
                    <Image
                        source={{ uri: article.image_url || 'https://via.placeholder.com/800' }}
                        style={{ width, height: width * 0.6 }}
                        resizeMode="cover"
                    />
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-16 left-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full items-center justify-center shadow-lg"
                    >
                        <ArrowLeft size={24} color="#0F172A" />
                    </TouchableOpacity>
                    
                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSaveToggle}
                        className="absolute top-16 right-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full items-center justify-center shadow-lg"
                    >
                        <Heart 
                            size={24} 
                            color={isSaved ? "#EF4444" : "#0F172A"} 
                            variant={isSaved ? "Bold" : "Outline"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="px-4 py-6">
                    {/* Category Badge */}
                    <View className="bg-purple-100 dark:bg-purple-900 self-start px-3 py-1 rounded-full mb-3">
                        <Text className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            {ArticlesService.getCategoryName(article.category)}
                        </Text>
                    </View>

                    {/* Title */}
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-8">
                        {article.title}
                    </Text>

                    {/* Date */}
                    <Text className="text-sm text-slate-500 mb-6">
                        {new Date(article.created_at).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>

                    {/* Content - Markdown rendered */}
                    <View className="mb-6">
                        {renderContent()}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
