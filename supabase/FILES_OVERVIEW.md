# Tổng quan các file SQL trong thư mục supabase/

## 📋 File mới cho Biodegradation Explorer

### ✅ Bắt buộc phải chạy
1. **`biodegradation_schema.sql`** - Schema chính cho Biodegradation Explorer
   - Tạo tất cả các bảng: pollutants, enzymes, microorganisms, pathways, case_studies, references
   - Tạo RLS policies
   - Tạo trigger tự động tạo profile khi user đăng ký

2. **`seed_biodegradation_data.sql`** - Dữ liệu mẫu (khuyến nghị)
   - Seed dữ liệu: PET, PETase, MHETase, Ideonella sakaiensis
   - Seed pathway và case studies
   - Seed references

### 🔄 Migration (nếu đang migrate từ health app)
3. **`migrate_to_biodegradation.sql`** - Script migration
   - Xóa các bảng cũ của health tracking app
   - Cập nhật profiles table
   - Chỉ chạy nếu bạn đang migrate từ health app

### 📖 Documentation
4. **`README_BIODEGRADATION.md`** - Hướng dẫn setup chi tiết

---

## 🗑️ File cũ của Health Tracking App (có thể xóa)

Các file sau đây là từ dự án health tracking cũ và **KHÔNG CẦN THIẾT** cho Biodegradation Explorer:

### Schema files
- ❌ `schema.sql` - Schema cũ cho health tracking
- ❌ `setup_steps.sql` - Setup steps cũ cho health tracking
- ❌ `add_exercise_sleep_tables.sql` - Bảng exercise và sleep logs
- ❌ `add_meal_type_column.sql` - Cột meal_type cho meal_logs
- ❌ `notifications_schema.sql` - Schema cho notifications
- ❌ `add_notification_triggers.sql` - Triggers cho notifications
- ❌ `enable_realtime_notifications.sql` - Enable realtime cho notifications
- ❌ `fix_meal_logs_policy.sql` - Policy cho meal_logs
- ❌ `storage_policies.sql` - Storage policies cho avatar
- ❌ `meals_data.sql` - Seed data cho meals
- ❌ `seed_articles_simple.sql` - Seed data cho articles

### README cũ
- ❌ `README.md` (nếu có trong thư mục supabase/) - README cũ cho health app

---

## 📝 Hướng dẫn cleanup

### Nếu bạn muốn xóa các file cũ:

```bash
# Xóa các file SQL cũ (chỉ giữ lại file mới)
cd supabase/

# Xóa schema cũ
rm schema.sql setup_steps.sql

# Xóa các file bổ sung
rm add_exercise_sleep_tables.sql
rm add_meal_type_column.sql
rm notifications_schema.sql
rm add_notification_triggers.sql
rm enable_realtime_notifications.sql
rm fix_meal_logs_policy.sql
rm storage_policies.sql
rm meals_data.sql
rm seed_articles_simple.sql
```

### Hoặc giữ lại để tham khảo:

Nếu bạn muốn giữ lại các file cũ để tham khảo, có thể di chuyển vào thư mục `supabase/archive/`:

```bash
mkdir -p supabase/archive
mv schema.sql setup_steps.sql add_*.sql notifications_*.sql enable_*.sql fix_*.sql storage_*.sql meals_*.sql seed_articles_*.sql supabase/archive/
```

---

## ✅ Checklist sau khi setup

- [ ] Đã chạy `biodegradation_schema.sql` trong Supabase SQL Editor
- [ ] Đã chạy `seed_biodegradation_data.sql` để có dữ liệu mẫu
- [ ] Đã cập nhật `.env` với Supabase URL và anon key
- [ ] Đã cập nhật `src/lib/supabase.ts` để sử dụng environment variables
- [ ] Đã test authentication flow (sign up, sign in)
- [ ] Đã xóa hoặc archive các file SQL cũ không cần thiết

---

## 📚 Tham khảo

- Xem `README_BIODEGRADATION.md` để biết chi tiết cách setup
- Xem `biodegradation_schema.sql` để hiểu cấu trúc database
- Xem `seed_biodegradation_data.sql` để xem dữ liệu mẫu
