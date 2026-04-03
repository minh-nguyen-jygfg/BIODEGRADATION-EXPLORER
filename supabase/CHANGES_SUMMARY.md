# Tóm tắt thay đổi kiến trúc Supabase cho Biodegradation Explorer

## 📋 Tổng quan

Đã nghiên cứu và thiết kế lại kiến trúc Supabase cho dự án **Biodegradation Explorer** dựa trên tài liệu Notion. Kiến trúc mới tập trung vào nghiên cứu phân huỷ sinh học các chất ô nhiễm môi trường, đặc biệt là PET.

---

## ✅ Những gì đã hoàn thành

### 1. Schema mới cho Biodegradation Explorer

**File**: `supabase/biodegradation_schema.sql`

Tạo các bảng mới phù hợp với dự án:

- ✅ **profiles** - Đơn giản hóa (chỉ email, full_name, avatar_url)
- ✅ **pollutants** - Chất ô nhiễm (PET, PE, etc.)
- ✅ **enzymes** - Enzyme (PETase, MHETase, etc.)
- ✅ **microorganisms** - Vi sinh vật (Ideonella sakaiensis, etc.)
- ✅ **pathways** - Sơ đồ pathway hoá sinh
- ✅ **pathway_steps** - Các bước trong pathway
- ✅ **enzyme_pollutant_relationships** - Mối quan hệ enzyme-chất ô nhiễm
- ✅ **microorganism_enzyme_relationships** - Mối quan hệ vi sinh vật-enzyme
- ✅ **case_studies** - Case study về phân huỷ
- ✅ **references** - Tài liệu tham khảo khoa học
- ✅ **entity_references** - Liên kết tài liệu với các entity

Tất cả các bảng đều có:
- Row Level Security (RLS) enabled
- Policies phù hợp (public read cho dữ liệu khoa học, user-only cho profiles)
- Indexes cho các foreign keys và queries thường dùng

### 2. Seed Data mẫu

**File**: `supabase/seed_biodegradation_data.sql`

Dữ liệu mẫu bao gồm:
- ✅ PET (pollutant)
- ✅ PETase và MHETase (enzymes)
- ✅ Ideonella sakaiensis (microorganism)
- ✅ PET Degradation Pathway với 2 bước:
  1. PET → (PETase) → MHET
  2. MHET → (MHETase) → TPA + EG
- ✅ 2 Case studies: nước ngọt và biển
- ✅ 2 References: Papers khoa học về PET degradation

### 3. Đơn giản hóa Authentication

**File**: `src/services/auth.service.ts`

- ✅ `signUp()` - full_name là optional (không bắt buộc)
- ✅ Profile được tạo tự động khi user đăng ký (qua trigger)
- ✅ **Không cần profile setup flow** - user có thể sử dụng app ngay sau khi đăng ký

**File**: `supabase/biodegradation_schema.sql`

- ✅ Trigger `on_auth_user_created` tự động tạo profile với email và full_name (nếu có)
- ✅ Profiles table đơn giản: chỉ có id, email, full_name, avatar_url, timestamps

### 4. Migration Script

**File**: `supabase/migrate_to_biodegradation.sql`

Script để migrate từ health tracking app sang Biodegradation Explorer:
- ✅ Xóa các bảng cũ (weight_logs, water_logs, meal_logs, exercise_logs, sleep_logs, articles, notifications, etc.)
- ✅ Xóa các trigger cũ
- ✅ Cập nhật profiles table (xóa các cột không cần thiết)
- ✅ Tạo profile đơn giản cho user cũ (nếu có)

### 5. Cập nhật Supabase Client

**File**: `src/lib/supabase.ts`

- ✅ Hỗ trợ environment variables (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`)
- ✅ Fallback về hardcoded values nếu env vars không có
- ✅ Hỗ trợ cả `Constants.expoConfig?.extra` và `process.env`

### 6. Documentation

**File**: `supabase/README_BIODEGRADATION.md`
- ✅ Hướng dẫn setup chi tiết
- ✅ Giải thích cấu trúc database
- ✅ Hướng dẫn authentication flow
- ✅ Troubleshooting guide

**File**: `supabase/FILES_OVERVIEW.md`
- ✅ Tổng quan các file SQL
- ✅ File nào cần giữ, file nào có thể xóa
- ✅ Checklist sau khi setup

---

## 🔄 So sánh với kiến trúc cũ

### Health Tracking App (cũ)
- ❌ Profiles phức tạp: gender, date_of_birth, height, weight, activity_level, goal
- ❌ Nhiều bảng tracking: weight_logs, water_logs, meal_logs, exercise_logs, sleep_logs
- ❌ Articles và saved_articles
- ❌ Notifications system phức tạp
- ❌ Profile setup flow bắt buộc sau khi đăng ký

### Biodegradation Explorer (mới)
- ✅ Profiles đơn giản: chỉ email, full_name, avatar_url
- ✅ Bảng khoa học: pollutants, enzymes, microorganisms, pathways
- ✅ Case studies và references
- ✅ Không có notifications (không cần thiết cho dự án học thuật)
- ✅ **Không cần profile setup** - user có thể sử dụng ngay

---

## 📝 Các bước tiếp theo (cho developer)

### 1. Setup Database
```bash
# 1. Vào Supabase Dashboard → SQL Editor
# 2. Chạy theo thứ tự:
#    - migrate_to_biodegradation.sql (nếu migrate từ health app)
#    - biodegradation_schema.sql
#    - seed_biodegradation_data.sql
```

### 2. Cấu hình Environment Variables
```bash
# Tạo file .env ở thư mục gốc
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Cập nhật Code
- ✅ `src/lib/supabase.ts` - Đã cập nhật để dùng env vars
- ✅ `src/services/auth.service.ts` - Đã đơn giản hóa
- ⚠️ Cần cập nhật các component/screen sử dụng profile setup flow (có thể xóa hoặc comment out)

### 4. Cleanup (tùy chọn)
- Xóa hoặc archive các file SQL cũ không cần thiết (xem `FILES_OVERVIEW.md`)
- Xóa hoặc comment out profile setup flow trong code

---

## 🎯 Kết quả

Kiến trúc Supabase mới:
- ✅ **Phù hợp với dự án Biodegradation Explorer**
- ✅ **Đơn giản hóa authentication** - chỉ cần email/password
- ✅ **Không yêu cầu profile setup** - user có thể sử dụng ngay
- ✅ **Có dữ liệu mẫu** để test và demo
- ✅ **Có documentation đầy đủ** để setup và maintain

---

## 📚 Tài liệu tham khảo

- Notion: https://hexagonal-wildflower-2a6.notion.site/Biodegradation-Explorer-2d8e640a4192802d8135d24f8d348854
- Supabase Docs: https://supabase.com/docs
- File SQL: `supabase/biodegradation_schema.sql`
- Hướng dẫn setup: `supabase/README_BIODEGRADATION.md`
