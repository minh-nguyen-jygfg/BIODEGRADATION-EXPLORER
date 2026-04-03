const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Get from your .env file or replace with actual values
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials!')
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env file')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const meals = [
  // Breakfast
  { name: 'Phở bò', calories: 350, protein_g: 20, fats_g: 8, carbs_g: 50, meal_type: 'breakfast', image_url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400' },
  { name: 'Bánh mì thịt', calories: 400, protein_g: 15, fats_g: 18, carbs_g: 45, meal_type: 'breakfast', image_url: 'https://images.unsplash.com/photo-1588938059665-2d5e9e0fc8f5?w=400' },
  { name: 'Xôi gà', calories: 380, protein_g: 18, fats_g: 12, carbs_g: 52, meal_type: 'breakfast', image_url: 'https://images.unsplash.com/photo-1625384267851-84ea88bd7a4c?w=400' },
  { name: 'Bún bò Huế', calories: 420, protein_g: 22, fats_g: 14, carbs_g: 55, meal_type: 'breakfast', image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
  { name: 'Cháo gà', calories: 250, protein_g: 15, fats_g: 5, carbs_g: 35, meal_type: 'breakfast', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
  { name: 'Bánh cuốn', calories: 280, protein_g: 12, fats_g: 6, carbs_g: 42, meal_type: 'breakfast', image_url: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400' },
  { name: 'Yến mạch trộn sữa chua không đường và hạt chia', calories: 300, protein_g: 10, fats_g: 8, carbs_g: 45, meal_type: 'breakfast', image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400' },
  { name: 'Bánh mì trứng ốp la', calories: 350, protein_g: 14, fats_g: 16, carbs_g: 38, meal_type: 'breakfast', image_url: 'https://images.unsplash.com/photo-1619895092538-128341789043?w=400' },
  { name: 'Cơm tấm sườn nướng', calories: 450, protein_g: 25, fats_g: 18, carbs_g: 48, meal_type: 'breakfast', image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' },
  { name: 'Hủ tiếu Nam Vang', calories: 380, protein_g: 18, fats_g: 10, carbs_g: 52, meal_type: 'breakfast', image_url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400' },

  // Lunch & Main Dishes
  { name: 'Cơm gạo lứt', calories: 216, protein_g: 5, fats_g: 2, carbs_g: 45, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400' },
  { name: 'Cơm trắng', calories: 205, protein_g: 4, fats_g: 0, carbs_g: 45, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
  { name: 'Cá thu kho nhạt', calories: 280, protein_g: 35, fats_g: 12, carbs_g: 5, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400' },
  { name: 'Cá hồi hấp xì dầu', calories: 320, protein_g: 38, fats_g: 15, carbs_g: 3, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
  { name: 'Thịt kho trứng', calories: 380, protein_g: 28, fats_g: 22, carbs_g: 15, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
  { name: 'Gà luộc', calories: 165, protein_g: 31, fats_g: 4, carbs_g: 0, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400' },
  { name: 'Thịt bò xào rau củ', calories: 320, protein_g: 28, fats_g: 18, carbs_g: 12, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400' },
  { name: 'Canh chua cá lóc', calories: 180, protein_g: 20, fats_g: 5, carbs_g: 15, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
  { name: 'Đậu phụ sốt cà chua', calories: 210, protein_g: 12, fats_g: 10, carbs_g: 18, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
  { name: 'Cá diêu hồng hấp xì dầu', calories: 290, protein_g: 36, fats_g: 13, carbs_g: 4, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400' },
  { name: 'Thịt gà nướng mật ong', calories: 310, protein_g: 32, fats_g: 14, carbs_g: 12, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400' },
  { name: 'Bò lúc lắc', calories: 380, protein_g: 30, fats_g: 22, carbs_g: 10, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
  { name: 'Tôm sú rang muối', calories: 240, protein_g: 28, fats_g: 12, carbs_g: 5, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523f?w=400' },
  { name: 'Sườn heo nướng', calories: 420, protein_g: 32, fats_g: 28, carbs_g: 8, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' },
  { name: 'Cá basa chiên giòn', calories: 260, protein_g: 30, fats_g: 12, carbs_g: 8, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523f?w=400' },

  // Vegetables
  { name: 'Súp lơ luộc', calories: 55, protein_g: 4, fats_g: 1, carbs_g: 10, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400' },
  { name: 'Rau muống xào tỏi', calories: 85, protein_g: 3, fats_g: 5, carbs_g: 8, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
  { name: 'Cải xào nấm', calories: 95, protein_g: 4, fats_g: 6, carbs_g: 7, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400' },
  { name: 'Bí đỏ luộc', calories: 82, protein_g: 2, fats_g: 0, carbs_g: 20, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1570836596382-c39b8e6bed0d?w=400' },
  { name: 'Đậu que xào', calories: 70, protein_g: 3, fats_g: 4, carbs_g: 6, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400' },
  { name: 'Su su luộc', calories: 39, protein_g: 1, fats_g: 0, carbs_g: 9, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400' },
  { name: 'Cà chua bi', calories: 27, protein_g: 1, fats_g: 0, carbs_g: 6, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400' },
  { name: 'Dưa leo', calories: 16, protein_g: 1, fats_g: 0, carbs_g: 4, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400' },

  // Soups
  { name: 'Canh rau ngót thịt bằm', calories: 120, protein_g: 8, fats_g: 5, carbs_g: 10, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
  { name: 'Canh bí đỏ', calories: 90, protein_g: 2, fats_g: 2, carbs_g: 18, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
  { name: 'Canh chua tôm', calories: 140, protein_g: 12, fats_g: 4, carbs_g: 15, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
  { name: 'Súp gà nấm', calories: 180, protein_g: 15, fats_g: 8, carbs_g: 12, meal_type: 'lunch', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },

  // Snacks
  { name: 'Táo', calories: 95, protein_g: 0, fats_g: 0, carbs_g: 25, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400' },
  { name: 'Chuối', calories: 105, protein_g: 1, fats_g: 0, carbs_g: 27, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400' },
  { name: 'Cam', calories: 62, protein_g: 1, fats_g: 0, carbs_g: 15, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400' },
  { name: 'Nho', calories: 104, protein_g: 1, fats_g: 0, carbs_g: 27, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1599819177331-b8d6e1cb0c8c?w=400' },
  { name: 'Dâu tây', calories: 49, protein_g: 1, fats_g: 0, carbs_g: 12, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400' },
  { name: 'Dưa hấu', calories: 46, protein_g: 1, fats_g: 0, carbs_g: 12, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784053?w=400' },
  { name: 'Đu đủ', calories: 59, protein_g: 1, fats_g: 0, carbs_g: 15, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=400' },
  { name: 'Bơ', calories: 240, protein_g: 3, fats_g: 22, carbs_g: 13, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400' },
  { name: 'Hạt hạnh nhân', calories: 164, protein_g: 6, fats_g: 14, carbs_g: 6, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400' },
  { name: 'Hạt điều', calories: 157, protein_g: 5, fats_g: 12, carbs_g: 9, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400' },
  { name: 'Sữa chua Hy Lạp không đường', calories: 100, protein_g: 10, fats_g: 0, carbs_g: 6, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
  { name: 'Phô mai que', calories: 80, protein_g: 6, fats_g: 6, carbs_g: 1, meal_type: 'morning_snack', image_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400' },

  // Afternoon Snacks
  { name: 'Bánh gạo lứt', calories: 35, protein_g: 1, fats_g: 0, carbs_g: 7, meal_type: 'afternoon_snack', image_url: 'https://images.unsplash.com/photo-1588059929884-e1a77d2d6b30?w=400' },
  { name: 'Bánh quy yến mạch', calories: 68, protein_g: 1, fats_g: 2, carbs_g: 10, meal_type: 'afternoon_snack', image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },
  { name: 'Ngô luộc', calories: 96, protein_g: 3, fats_g: 1, carbs_g: 21, meal_type: 'afternoon_snack', image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400' },
  { name: 'Khoai lang luộc', calories: 103, protein_g: 2, fats_g: 0, carbs_g: 24, meal_type: 'afternoon_snack', image_url: 'https://images.unsplash.com/photo-1596097635780-1e9a6ea0c5f6?w=400' },

  // Dinner
  { name: 'Salad trộn', calories: 150, protein_g: 8, fats_g: 10, carbs_g: 10, meal_type: 'dinner', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
  { name: 'Gà nướng lá chanh', calories: 280, protein_g: 35, fats_g: 12, carbs_g: 3, meal_type: 'dinner', image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400' },
  { name: 'Cá áp chảo', calories: 240, protein_g: 32, fats_g: 10, carbs_g: 4, meal_type: 'dinner', image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400' },
  { name: 'Đậu hũ non hấp', calories: 140, protein_g: 12, fats_g: 8, carbs_g: 6, meal_type: 'dinner', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
  { name: 'Canh bầu tôm', calories: 110, protein_g: 10, fats_g: 3, carbs_g: 12, meal_type: 'dinner', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
  { name: 'Gỏi cuốn tôm thịt', calories: 180, protein_g: 14, fats_g: 6, carbs_g: 18, meal_type: 'dinner', image_url: 'https://images.unsplash.com/photo-1599943513346-ac15c9d3f15e?w=400' },
  { name: 'Cá hấp gừng', calories: 200, protein_g: 28, fats_g: 8, carbs_g: 2, meal_type: 'dinner', image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400' },
  { name: 'Tôm luộc', calories: 140, protein_g: 26, fats_g: 2, carbs_g: 2, meal_type: 'dinner', image_url: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523f?w=400' },
  { name: 'Canh cải thảo', calories: 45, protein_g: 2, fats_g: 1, carbs_g: 8, meal_type: 'dinner', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
  { name: 'Mực xào cần tỏi', calories: 220, protein_g: 24, fats_g: 10, carbs_g: 8, meal_type: 'dinner', image_url: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=400' },
]

async function seedMeals() {
  console.log('🌱 Starting to seed meals...')
  console.log(`📊 Total meals to insert: ${meals.length}`)

  try {
    // Check if meals already exist
    const { data: existingMeals, error: checkError } = await supabase
      .from('meals')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('❌ Error checking existing meals:', checkError)
      throw checkError
    }

    if (existingMeals && existingMeals.length > 0) {
      console.log('⚠️  Meals already exist in database')
      console.log('Proceeding to add more meals...\n')
    }

    // Insert meals in batches of 10
    const batchSize = 10
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < meals.length; i += batchSize) {
      const batch = meals.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('meals')
        .insert(batch)
        .select()

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message)
        errorCount += batch.length
      } else {
        successCount += batch.length
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} inserted successfully (${successCount}/${meals.length})`)
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('\n🎉 Seeding completed!')
    console.log(`✅ Success: ${successCount} meals`)
    console.log(`❌ Failed: ${errorCount} meals`)

    // Verify
    const { data: allMeals, error: verifyError } = await supabase
      .from('meals')
      .select('meal_type')

    if (!verifyError && allMeals) {
      const counts = allMeals.reduce((acc, meal) => {
        acc[meal.meal_type] = (acc[meal.meal_type] || 0) + 1
        return acc
      }, {})

      console.log('\n📊 Meals by type in database:')
      Object.entries(counts).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`)
      })
      console.log(`  Total: ${allMeals.length}`)
    }

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the seeder
seedMeals()
  .then(() => {
    console.log('\n✨ All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
