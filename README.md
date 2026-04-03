# Biodegradation Explorer

Ứng dụng di động nghiên cứu và khám phá quá trình phân hủy sinh học các chất ô nhiễm (nhựa, dầu mỏ, hóa chất) thông qua vi sinh vật và enzyme. Ứng dụng cung cấp thông tin khoa học, case studies, và so sánh hiệu quả phân hủy sinh học trong các môi trường khác nhau.

---

## 🚀 Tính năng chính

- **🔬 Thư viện khoa học**: Tra cứu thông tin về chất ô nhiễm (PET, PE, PP, PS, dầu mỏ, v.v.)
- **🦠 Vi sinh vật & Enzyme**: Khám phá các loài vi khuẩn, nấm và enzyme có khả năng phân hủy
- **📊 Case Studies**: Nghiên cứu các trường hợp thực tế về phân hủy sinh học
- **⚖️ So sánh môi trường**: Đối chiếu hiệu quả phân hủy giữa nước ngọt và nước biển
- **📚 Chi tiết chất ô nhiễm**: Công thức hóa học, cấu trúc phân tử, phương pháp phân hủy
- **👤 Quản lý hồ sơ**: Cập nhật thông tin cá nhân, avatar

---

## 📋 Công nghệ

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|--------|
| **React Native** | - | Framework phát triển ứng dụng di động |
| **Expo** | SDK 52+ | Platform và toolchain cho React Native |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Supabase** | - | Backend-as-a-Service (Database, Auth, Storage) |
| **React Query** | v5 | Quản lý state và cache dữ liệu server |
| **NativeWind** | v4 | Tailwind CSS cho React Native |
| **Expo Router** | - | File-based routing |
| **Expo Image** | - | Component hiển thị ảnh tối ưu |

---

## 🛠️ Yêu cầu hệ thống

### Công cụ cần cài đặt

- **Node.js**: 18.x hoặc 20.x LTS ([nodejs.org](https://nodejs.org))
- **npm** hoặc **yarn**: 9.x trở lên
- **Expo CLI**: Mới nhất (chạy `npx expo`)
- **Git**: Để clone và quản lý mã nguồn
- **Supabase**: Tài khoản miễn phí ([supabase.com](https://supabase.com))

### Chạy trên thiết bị / Simulator

- **iOS**: Mac với **Xcode** (cho iOS simulator)
- **Android**: **Android Studio** + Android SDK
- **Expo Go** (khuyến nghị): Cài app Expo Go trên điện thoại để test nhanh

---

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url> biodegradation-explore
cd biodegradation-explore
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình môi trường

Tạo file `.env` ở thư mục gốc:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Lấy Supabase credentials:**
1. Vào [Supabase Dashboard](https://supabase.com)
2. Chọn project → **Settings** → **API**
3. Copy **Project URL** và **anon public** key

⚠️ **Lưu ý:** File `.env` đã được thêm vào `.gitignore` để bảo mật

---

## 🗄️ Setup Database (Supabase)

### Bước 1: Tạo Database Schema

Vào **SQL Editor** trong Supabase Dashboard và chạy file SQL:

```bash
supabase/biodegradation_schema.sql
```

File này sẽ tạo:
- ✅ Bảng `profiles` (hồ sơ người dùng)
- ✅ Bảng `pollutants` (chất ô nhiễm)
- ✅ Bảng `enzymes` (enzyme phân hủy)
- ✅ Bảng `microorganisms` (vi sinh vật)
- ✅ Bảng `case_studies` (nghiên cứu trường hợp)
- ✅ Bảng `biodegradation_methods` (phương pháp phân hủy)
- ✅ Bảng liên kết và ánh xạ
- ✅ Row Level Security (RLS) policies
- ✅ Trigger tự động tạo profile khi đăng ký

### Bước 2: Seed dữ liệu mẫu

Chạy các file SQL để thêm dữ liệu mẫu:

```bash
# Dữ liệu chi tiết và đầy đủ
supabase/seed_comprehensive_data.sql

# Hoặc dữ liệu cơ bản
supabase/seed_biodegradation_data.sql
```

### Bước 3: Tạo Storage Bucket

1. Vào **Storage** trong Supabase Dashboard
2. Tạo bucket mới: `profiles`
3. Đặt là **Public** để avatar có thể xem được
4. Bucket này dùng để lưu ảnh đại diện người dùng

---

## ▶️ Chạy ứng dụng

### Development mode

```bash
npm start
# hoặc
npx expo start
```

Sau đó:
- Quét **QR code** bằng **Expo Go** app trên điện thoại
- Hoặc nhấn `i` (iOS) / `a` (Android) để mở simulator/emulator

### Build cho production

```bash
# iOS
npm run ios

# Android
npm run android

# Web (nếu cần)
npm run web
```

---

## 🏗️ Cấu trúc dự án

```
biodegradation-explore/
├── src/
│   ├── app/                      # Expo Router screens
│   │   ├── (auth)/              # Màn hình đăng nhập/đăng ký
│   │   ├── (tabs)/              # Bottom tabs (home, story, user)
│   │   └── (screens)/           # Màn hình khác (edit-profile, pollutant-detail)
│   ├── components/              # Reusable components
│   │   ├── biodegradation/      # Components liên quan biodegradation
│   │   └── common/              # Common UI components
│   ├── context/                 # React Context (auth, notification)
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API services
│   │   ├── auth.service.ts
│   │   ├── profile.service.ts
│   │   └── biodegradation.service.ts
│   ├── utils/                   # Utility functions
│   ├── constants/               # Constants và configs
│   └── lib/                     # Third-party lib setup (supabase)
├── supabase/                    # Database schema & seed data
├── assets/                      # Images, fonts, etc.
└── .env                         # Environment variables (không commit)
```

---

## 📱 Màn hình chính

### 1. **Home** (`/home`)
- Header với logo và avatar
- Hero banner
- Danh sách chất ô nhiễm (Science Library)
- Pull-to-refresh

### 2. **Story** (`/story`) 
- So sánh môi trường phân hủy
- Chọn loại nhựa
- Bảng so sánh: Tốc độ, độ mặn, vi sinh, đặc tính
- Kết luận khoa học

### 3. **User** (`/user`)
- Thông tin profile
- Avatar, tên, email
- Menu cài đặt: Giới thiệu, Liên hệ, Điều khoản
- Đăng xuất

### 4. **Pollutant Detail** (`/pollutant-detail`)
- Thông tin chi tiết chất ô nhiễm
- Công thức hóa học, cấu trúc
- Vi sinh vật có thể phân hủy
- Phương pháp phân hủy
- Case studies liên quan

### 5. **Edit Profile** (`/edit-profile`)
- Cập nhật tên
- Thay đổi avatar (upload ảnh)
- Email (read-only)

---

## 🔐 Authentication (Tùy chọn)

Dự án này **không bắt buộc đăng nhập để xem nội dung**:

- Trang **Home**, **Story**, **Pollutant Detail**, **Article Detail** đều **public**.
- Người dùng có thể mở app và xem toàn bộ nội dung khoa học **không cần tài khoản**.

Supabase Auth hiện chỉ được dùng (tùy chọn) cho:

1. **Quản lý hồ sơ cá nhân** (màn `/user`, `/edit-profile`)
2. **Tính năng cá nhân hóa** như:
   - Lưu/bỏ lưu bài viết
   - Ảnh đại diện, tên hiển thị

Trong tương lai, có thể:

- **Loại bỏ hoàn toàn Supabase Auth** nếu không cần tính năng cá nhân.
- Hoặc giữ Auth chỉ cho một số tính năng nâng cao (bookmark, ghi chú, v.v.).

---

## 🐛 Xử lý lỗi thường gặp

### Không kết nối được Supabase
- ✅ Kiểm tra file `.env` có đúng URL và anon key
- ✅ Kiểm tra `src/lib/supabase.ts` đang sử dụng env variables
- ✅ Kiểm tra network trong Supabase Dashboard

### Profile không hiển thị / lỗi PGRST116
- ✅ Trigger tự động tạo profile có thể chưa chạy
- ✅ Code đã tự động tạo profile nếu chưa có
- ✅ Kiểm tra RLS policies trong Supabase

### Avatar không cập nhật
- ✅ Đã tạo Storage bucket `profiles` chưa?
- ✅ Bucket có public không?
- ✅ Kiểm tra path upload: `avatars/{userId}_{timestamp}.jpg`

### Lỗi RLS (Row Level Security)
- ✅ Đã chạy file `biodegradation_schema.sql` đầy đủ
- ✅ User đã đăng nhập đúng
- ✅ Kiểm tra policies trong Table Editor

---

## 🧪 Testing

```bash
# Chạy tests (nếu có)
npm test

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📝 Database Schema

### Bảng chính

| Bảng | Mô tả |
|------|--------|
| `profiles` | Thông tin người dùng |
| `pollutants` | Chất ô nhiễm (PET, PE, PP, dầu mỏ...) |
| `enzymes` | Enzyme phân hủy (PETase, MHETase...) |
| `microorganisms` | Vi sinh vật (Ideonella sakaiensis...) |
| `case_studies` | Nghiên cứu trường hợp thực tế |
| `biodegradation_methods` | Phương pháp phân hủy |

### Bảng liên kết

- `pollutant_microorganisms`: Ánh xạ chất ô nhiễm - vi sinh vật
- `pollutant_enzymes`: Ánh xạ chất ô nhiễm - enzyme
- `case_study_pollutants`: Ánh xạ case study - chất ô nhiễm
- `case_study_microorganisms`: Ánh xạ case study - vi sinh vật
- `case_study_methods`: Ánh xạ case study - phương pháp

---

## 🤝 Contributing

Contributions are welcome! Vui lòng tạo issue hoặc pull request.

---

## 📄 License

[MIT License](LICENSE)

---

## 👨‍💻 Developer

Developed with ❤️ using React Native, Expo, and Supabase

---

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.
