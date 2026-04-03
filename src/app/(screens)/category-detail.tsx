import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'iconsax-react-native'
import { ArticlesService, ArticleCategory } from '@/services/articles.service'
import { Database } from '@/types/database.types'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

type Article = Database['public']['Tables']['articles']['Row']

// Fallback fake data for old structure compatibility
const CATEGORY_ARTICLES_FALLBACK: Record<string, { title: string; articles: Article[] }> = {
    '1': {
        title: 'Dinh dưỡng',
        articles: [
            {
                id: '1-1',
                title: 'Protein: "Kiên trúc sư" xây dựng cơ bắp bạn cần biết',
                image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
            },
            {
                id: '1-2',
                title: 'Chất béo tốt và chất béo xấu: Cách phân biệt trong chế độ ăn',
                image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
            },
            {
                id: '1-3',
                title: 'Vitamin và khoáng chất: Bạn có đang thiếu hụt?',
                image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400',
            },
            {
                id: '1-4',
                title: 'Đường ăn - "Kẻ sát nhân" thầm lặng trong chế độ ăn',
                image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400',
            },
            {
                id: '1-5',
                title: 'Siêu thực phẩm: Có thực sự thần thánh như lời đồn?',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
            },
            {
                id: '1-6',
                title: 'Tinh bột: Không phải kẻ thù của cân nặng',
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
            },
        ],
    },
    '2': {
        title: 'Lời sống',
        articles: [
            {
                id: '2-1',
                title: 'Ngủ đủ giấc: Chia khóa vàng cho quá trình phục hồi',
                image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
            },
            {
                id: '2-2',
                title: 'Stress và thói quen ăn uống: Tại sao bạn ăn nhiều hơn?',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
            },
            {
                id: '2-3',
                title: 'Tác hại của việc ngồi quá nhiều',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
            },
            {
                id: '2-4',
                title: 'Thiền định: Lợi ích cho sức khỏe tinh thần',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
            },
            {
                id: '2-5',
                title: 'Tập thể dục buổi sáng hay buổi tối tốt hơn?',
                image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
            },
            {
                id: '2-6',
                title: 'Cân bằng công việc và cuộc sống',
                image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
            },
        ],
    },
    '3': {
        title: 'Ăn uống khoa học',
        articles: [
            {
                id: '3-1',
                title: 'Quy tắc "Đĩa ăn hạnh phúc": Chia tỷ lệ thực phẩm như thế nào?',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            },
            {
                id: '3-2',
                title: 'Meal Prep: Bí quyết chuẩn bị thực đơn tuần hiệu quả',
                image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
            },
            {
                id: '3-3',
                title: 'Nhịn ăn gián đoạn: Những điều cần biết',
                image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
            },
            {
                id: '3-4',
                title: 'Ăn chay có giúp giảm cân hiệu quả?',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
            },
            {
                id: '3-5',
                title: 'Keto Diet: Lợi ích và rủi ro',
                image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
            },
            {
                id: '3-6',
                title: 'Chế độ ăn Địa Trung Hải: Bí quyết sống thọ',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            },
        ],
    },
    '4': {
        title: 'Thói quen sống',
        articles: [
            {
                id: '4-1',
                title: 'Cách xây dựng thói quen mới trong 21 ngày',
                image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
            },
            {
                id: '4-2',
                title: 'Lập kế hoạch đi chợ: Tiết kiệm thời gian và tiền bạc',
                image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
            },
            {
                id: '4-3',
                title: 'Check-in sức khỏe hàng tuần: Tại sao quan trọng?',
                image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
            },
            {
                id: '4-4',
                title: 'Uống đủ nước: Lợi ích bạn chưa biết',
                image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
            },
            {
                id: '4-5',
                title: 'Tập yoga mỗi ngày: Thay đổi cuộc sống',
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
            },
            {
                id: '4-6',
                title: 'Viết nhật ký sức khỏe: Công cụ theo dõi hiệu quả',
                image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
            },
        ],
    },
}

const ArticleCard = ({ article }: { article: Article }) => {
    const router = useRouter()

    return (
        <TouchableOpacity
            className="mb-4"
            style={{ width: CARD_WIDTH }}
            onPress={() => {
                router.push({
                    pathname: '/(screens)/article-detail',
                    params: { id: article.id },
                })
            }}
        >
            <Image
                source={{ uri: article.image_url || 'https://via.placeholder.com/400' }}
                className="w-full h-40 rounded-2xl mb-2"
                resizeMode="cover"
            />
            <Text className="text-sm font-medium text-slate-900 dark:text-white" numberOfLines={2}>
                {article.title}
            </Text>
        </TouchableOpacity>
    )
}

export default function CategoryDetailScreen() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const categoryId = params.id as string
    
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // Load articles for this category
    const loadArticles = async () => {
        try {
            const data = await ArticlesService.getArticlesByCategory(categoryId as ArticleCategory)
            setArticles(data)
        } catch (error) {
            console.error('Error loading category articles:', error)
            Alert.alert('Lỗi', 'Không thể tải bài viết')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        loadArticles()
    }, [categoryId])

    const handleRefresh = () => {
        setRefreshing(true)
        loadArticles()
    }

    const categoryName = ArticlesService.getCategoryName(categoryId)

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
                <ActivityIndicator size="large" color="#A78BFA" />
            </View>
        )
    }

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 mt-14 bg-white dark:bg-slate-900">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900 dark:text-white">
                    {categoryName}
                </Text>
            </View>

            {/* Articles Grid */}
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#A78BFA"
                        colors={['#A78BFA']}
                    />
                }
            >
                <View className="flex-row flex-wrap justify-between px-4 pt-4">
                    {articles.length === 0 ? (
                        <View className="w-full py-8 items-center">
                            <Text className="text-slate-500">Chưa có bài viết nào</Text>
                        </View>
                    ) : (
                        articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    )
}
