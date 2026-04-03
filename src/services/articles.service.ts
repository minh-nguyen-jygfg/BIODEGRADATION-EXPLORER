import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type Article = Database['public']['Tables']['articles']['Row']

export type ArticleCategory = 'nutrition' | 'cooking_tips' | 'home_workout'

export interface ArticlesByCategory {
  nutrition: Article[]
  cooking_tips: Article[]
  home_workout: Article[]
}

export const ArticlesService = {
  /**
   * Get all articles grouped by category
   */
  async getAllArticles(): Promise<ArticlesByCategory> {
    console.log('📚 Fetching all articles')

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching articles:', error)
      return {
        nutrition: [],
        cooking_tips: [],
        home_workout: [],
      }
    }

    // Group by category
    const grouped: ArticlesByCategory = {
      nutrition: [],
      cooking_tips: [],
      home_workout: [],
    }

    data.forEach((article) => {
      if (article.category && grouped[article.category as ArticleCategory]) {
        grouped[article.category as ArticleCategory].push(article)
      }
    })

    console.log('Articles found:', {
      nutrition: grouped.nutrition.length,
      cooking_tips: grouped.cooking_tips.length,
      home_workout: grouped.home_workout.length,
    })

    return grouped
  },

  /**
   * Get single article by ID
   */
  async getArticleById(articleId: string): Promise<Article | null> {
    console.log('📖 Fetching article:', articleId)

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .single()

    if (error) {
      console.error('Error fetching article:', error)
      return null
    }

    return data
  },

  /**
   * Get articles by category
   */
  async getArticlesByCategory(category: ArticleCategory): Promise<Article[]> {
    console.log('📚 Fetching articles for category:', category)

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching articles by category:', error)
      return []
    }

    console.log('Articles found:', data?.length || 0)
    return data || []
  },

  /**
   * Search articles by title
   */
  async searchArticles(query: string): Promise<Article[]> {
    if (!query.trim()) return []

    console.log('🔍 Searching articles:', query)

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error searching articles:', error)
      return []
    }

    console.log('Search results:', data?.length || 0)
    return data || []
  },

  /**
   * Save article (bookmark)
   */
  async saveArticle(userId: string, articleId: string): Promise<boolean> {
    console.log('💾 Saving article:', { userId, articleId })

    const { error } = await supabase.from('saved_articles').insert({
      user_id: userId,
      article_id: articleId,
    })

    if (error) {
      console.error('Error saving article:', error)
      return false
    }

    console.log('✅ Article saved successfully')
    return true
  },

  /**
   * Unsave article (remove bookmark)
   */
  async unsaveArticle(userId: string, articleId: string): Promise<boolean> {
    console.log('🗑️ Unsaving article:', { userId, articleId })

    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('user_id', userId)
      .eq('article_id', articleId)

    if (error) {
      console.error('Error unsaving article:', error)
      return false
    }

    console.log('✅ Article unsaved successfully')
    return true
  },

  /**
   * Check if article is saved
   */
  async isArticleSaved(userId: string, articleId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('saved_articles')
      .select('id')
      .eq('user_id', userId)
      .eq('article_id', articleId)
      .single()

    if (error) return false
    return !!data
  },

  /**
   * Get category name in Vietnamese
   */
  getCategoryName(category: ArticleCategory | string | null): string {
    const names: Record<string, string> = {
      nutrition: 'Dinh dưỡng',
      cooking_tips: 'Mẹo nấu ăn',
      home_workout: 'Lối sống',
    }
    return category ? names[category] || category : 'Khác'
  },
}
