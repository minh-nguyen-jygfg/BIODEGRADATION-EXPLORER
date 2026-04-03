# Hướng dẫn chạy Comprehensive Seed Data

## 📋 Tổng quan

File `seed_comprehensive_data.sql` chứa dữ liệu tổng hợp từ 2 mục trong Notion:
1. **Phân tích từng loại nhựa**: PET, HDPE, PVC, PP, PS
2. **So sánh môi trường**: Nước ngọt vs Nước biển cho từng loại nhựa

## 📊 Dữ liệu bao gồm

### Pollutants (5 loại nhựa)
- ✅ **PET** (Polyethylene Terephthalate)
- ✅ **HDPE** (High-Density Polyethylene)
- ✅ **PVC** (Polyvinyl Chloride)
- ✅ **PP** (Polypropylene)
- ✅ **PS** (Polystyrene)

### Enzymes (6 loại)
- ✅ **PETase** - Phân hủy PET
- ✅ **MHETase** - Phân hủy MHET (sản phẩm trung gian của PET)
- ✅ **Laccase** - Oxy hóa HDPE, PP, PS
- ✅ **Alkane Hydroxylase** - Hydroxyl hóa HDPE, PP
- ✅ **Peroxidase** - Oxy hóa PVC, PS
- ✅ **Oxidoreductase** - Oxy hóa tổng quát

### Microorganisms (11 loài)
- ✅ **Ideonella sakaiensis** - Phân hủy PET
- ✅ **Micrococcus Oceanic** - Phân hủy PET trong biển
- ✅ **Pseudomonas spp.** - Phân hủy HDPE, PVC
- ✅ **Rhodococcus ruber** - Phân hủy HDPE, PS
- ✅ **Bacillus spp.** - Phân hủy HDPE, PP, PVC
- ✅ **Alcanivorax spp.** - Phân hủy HDPE, PVC trong biển
- ✅ **Stenotrophomonas maltophilia** - Phân hủy PP
- ✅ **Bacillus flexus** - Phân hủy PP
- ✅ **Exiguobacterium sp.** - Phân hủy PS
- ✅ **Pseudomonas citronellolis** - Phân hủy PVC
- ✅ **Bacillus cereus** - Phân hủy HDPE

### Pathways (5 pathways)
- ✅ **PET Degradation Pathway** - 4 bước
- ✅ **HDPE Degradation Pathway** - 4 bước
- ✅ **PVC Degradation Pathway** - 3 bước
- ✅ **PP Degradation Pathway** - 4 bước
- ✅ **PS Degradation Pathway** - 4 bước

### Case Studies (10 case studies)
- ✅ **PET**: Nước ngọt (12% tốc độ) + Nước biển (5% tốc độ)
- ✅ **HDPE**: Nước ngọt (0.8%) + Nước biển (0.3%)
- ✅ **PVC**: Nước ngọt (<0.05%) + Nước biển (<0.01%)
- ✅ **PP**: Nước ngọt (0.8%) + Nước biển (0.2%)
- ✅ **PS**: Nước ngọt (0.8%) + Nước biển (0.3%)

## 🚀 Cách chạy

### Bước 1: Chạy Schema (nếu chưa chạy)
```sql
-- Chạy file: supabase/biodegradation_schema.sql
-- Tạo tất cả các bảng và RLS policies
```

### Bước 2: Chạy Comprehensive Seed Data
```sql
-- Chạy file: supabase/seed_comprehensive_data.sql
-- Insert tất cả dữ liệu: pollutants, enzymes, microorganisms, pathways, case studies
```

### Thứ tự chạy SQL Files:
1. `biodegradation_schema.sql` (bắt buộc - tạo schema)
2. `seed_comprehensive_data.sql` (khuyến nghị - dữ liệu đầy đủ)
   - Hoặc `seed_biodegradation_data.sql` (dữ liệu mẫu cơ bản - chỉ có PET)

## ⚠️ Lưu ý

- File này sử dụng `ON CONFLICT DO UPDATE` để cập nhật dữ liệu nếu đã tồn tại
- Nếu bạn đã chạy `seed_biodegradation_data.sql` trước đó, file này sẽ cập nhật và bổ sung thêm dữ liệu
- Tất cả UUIDs đã được format đúng chuẩn
- Foreign keys đã được kiểm tra và đảm bảo tính toàn vẹn

## 📈 Kết quả sau khi chạy

Sau khi chạy thành công, bạn sẽ có:
- ✅ 5 pollutants (PET, HDPE, PVC, PP, PS)
- ✅ 6 enzymes với đầy đủ thông tin khoa học
- ✅ 11 microorganisms với habitat và điều kiện tối ưu
- ✅ 5 pathways với tổng cộng 19 pathway steps
- ✅ 10 case studies so sánh nước ngọt vs biển
- ✅ Đầy đủ relationships giữa enzyme-pollutant và microorganism-enzyme

## 🔍 Kiểm tra dữ liệu

Sau khi chạy, bạn có thể kiểm tra bằng các query:

```sql
-- Đếm số lượng pollutants
SELECT COUNT(*) FROM public.pollutants;

-- Xem tất cả pollutants
SELECT name, scientific_name, category FROM public.pollutants;

-- Xem case studies
SELECT title, environment_type, pollutant_id FROM public.case_studies;

-- Xem pathways
SELECT name, pollutant_id FROM public.pathways;
```

## 📝 Ghi chú

- Tất cả dữ liệu được tổng hợp từ tài liệu Notion của dự án
- Các thông tin khoa học đã được kiểm tra và chuẩn hóa
- Tốc độ phân hủy (%) được tính sau 1 năm trong điều kiện tối ưu
- Các điều kiện môi trường (pH, nhiệt độ, độ mặn) đã được ghi chú đầy đủ trong case studies
