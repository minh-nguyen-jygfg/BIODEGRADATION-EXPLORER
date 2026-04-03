# Hướng dẫn Setup Supabase cho Biodegradation Explorer

Tài liệu này mô tả cách setup database Supabase cho dự án **Biodegradation Explorer** - nền tảng nghiên cứu và mô phỏng phân huỷ sinh học các chất ô nhiễm môi trường.

---

## 1. Tổng quan

Dự án Biodegradation Explorer tập trung vào:
- **Thư viện khoa học**: Pollutant (PET), Enzyme (PETase, MHETase), Microorganism (Ideonella sakaiensis)
- **Biochemical Pathway Explorer**: Sơ đồ pathway hoá sinh tương tác
- **Environmental Condition Simulator**: Mô phỏng định tính ảnh hưởng của môi trường
- **Case Study**: Phân tích phân huỷ PET trong các môi trường khác nhau

---

## 2. Cấu trúc Database

### 2.1. Bảng chính

| Bảng | Mô tả |
|------|-------|
| `profiles` | Thông tin người dùng (đơn giản: email, full_name) |
| `pollutants` | Chất ô nhiễm (PET, PE, etc.) |
| `enzymes` | Enzyme (PETase, MHETase, etc.) |
| `microorganisms` | Vi sinh vật (Ideonella sakaiensis, etc.) |
| `pathways` | Sơ đồ pathway hoá sinh |
| `pathway_steps` | Các bước trong pathway |
| `enzyme_pollutant_relationships` | Mối quan hệ enzyme-chất ô nhiễm |
| `microorganism_enzyme_relationships` | Mối quan hệ vi sinh vật-enzyme |
| `case_studies` | Case study về phân huỷ |
| `references` | Tài liệu tham khảo khoa học |
| `entity_references` | Liên kết tài liệu với các entity |

### 2.2. Authentication

- **Đơn giản hóa**: Chỉ cần email và password
- **Không yêu cầu profile setup**: User có thể sử dụng ngay sau khi đăng ký
- Profile được tạo tự động với email và full_name (nếu có)

---

## 3. Setup Database

### 3.1. Tạo project Supabase mới

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com)
2. Tạo project mới hoặc sử dụng project có sẵn
3. Lấy **Supabase URL** và **anon key** tại: Project Settings → API

### 3.2. Chạy SQL Scripts

Vào **SQL Editor** trong Supabase Dashboard và chạy các file theo thứ tự:

#### Bước 1: Migration (nếu đang migrate từ health app)
```sql
-- Chạy file: supabase/migrate_to_biodegradation.sql
-- Script này xóa các bảng cũ và chuẩn bị database
```

#### Bước 2: Tạo Schema mới
```sql
-- Chạy file: supabase/biodegradation_schema.sql
-- Tạo tất cả các bảng và RLS policies
```

#### Bước 3: Seed dữ liệu mẫu
```sql
-- Chạy file: supabase/seed_biodegradation_data.sql
-- Thêm dữ liệu mẫu: PET, PETase, MHETase, Ideonella sakaiensis, pathway, case studies
```

---

## 4. Cấu hình Environment Variables

Tạo file `.env` ở thư mục gốc:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Cập nhật `src/lib/supabase.ts` để sử dụng environment variables:

```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://xxxxx.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'your-anon-key';
```

---

## 5. Authentication Flow

### 5.1. Sign Up
```typescript
import { AuthService } from '@/services/auth.service';

// Sign up với email và password (full_name là optional)
await AuthService.signUp('user@example.com', 'password123', 'John Doe');
// hoặc không có full_name
await AuthService.signUp('user@example.com', 'password123');
```

### 5.2. Sign In
```typescript
await AuthService.signIn('user@example.com', 'password123');
```

### 5.3. Profile tự động tạo
- Khi user đăng ký, trigger `on_auth_user_created` tự động tạo profile
- Profile chỉ chứa: `id`, `email`, `full_name` (nếu có), `avatar_url` (nếu có)
- **Không cần profile setup flow** - user có thể sử dụng app ngay

---

## 6. Dữ liệu mẫu

Sau khi chạy `seed_biodegradation_data.sql`, bạn sẽ có:

### Pollutants
- **PET** (Polyethylene Terephthalate)

### Enzymes
- **PETase** (EC 3.1.1.101) - Thuỷ phân PET thành MHET
- **MHETase** (EC 3.1.1.102) - Thuỷ phân MHET thành TPA + EG

### Microorganisms
- **Ideonella sakaiensis** - Vi khuẩn phân huỷ PET

### Pathway
- **PET Degradation Pathway**:
  1. PET → (PETase) → MHET
  2. MHET → (MHETase) → TPA + EG

### Case Studies
- Phân huỷ PET trong môi trường nước ngọt
- Phân huỷ PET trong môi trường biển

### References
- Paper về Ideonella sakaiensis (Science, 2016)
- Paper về PETase (PNAS, 2018)

---

## 7. Row Level Security (RLS)

Tất cả các bảng đều có RLS enabled:

- **profiles**: User chỉ có thể xem/update profile của chính mình
- **pollutants, enzymes, microorganisms, pathways, case_studies, references**: Public read-only (mọi người đều có thể xem)
- **pathway_steps, relationships, entity_references**: Public read-only

---

## 8. Storage (nếu cần)

Nếu bạn cần upload hình ảnh cho pollutants, enzymes, microorganisms:

1. Tạo bucket `biodegradation-assets` trong Supabase Storage
2. Tạo policy cho phép public read:

```sql
-- Cho phép public đọc
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'biodegradation-assets');
```

---

## 9. Troubleshooting

### Lỗi: RLS chặn truy vấn
- Kiểm tra đã chạy đủ các file schema chưa
- Kiểm tra user đã đăng nhập đúng chưa

### Lỗi: Trigger không tạo profile
- Kiểm tra function `handle_new_user()` đã được tạo chưa
- Kiểm tra trigger `on_auth_user_created` đã được tạo chưa

### Lỗi: Không kết nối được Supabase
- Kiểm tra `EXPO_PUBLIC_SUPABASE_URL` và `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Kiểm tra network trong Supabase Dashboard

---

## 10. Tài liệu tham khảo

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 11. Thứ tự chạy SQL Files

1. `migrate_to_biodegradation.sql` (nếu migrate từ health app)
2. `biodegradation_schema.sql` (bắt buộc)
3. `seed_biodegradation_data.sql` (khuyến nghị để có dữ liệu mẫu)

---

**Lưu ý**: Đảm bảo bạn đã backup database trước khi chạy migration script nếu đang migrate từ health app!
