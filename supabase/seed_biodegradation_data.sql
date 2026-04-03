-- ===================================
-- SEED DATA FOR BIODEGRADATION EXPLORER
-- ===================================
-- Dữ liệu mẫu cho dự án Biodegradation Explorer
-- Tập trung vào phân huỷ PET bằng enzyme

-- ===================================
-- POLLUTANTS
-- ===================================
INSERT INTO public.pollutants (id, name, scientific_name, description, structure_formula, category, image_url)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'PET',
    'Polyethylene Terephthalate',
    'PET là một loại nhựa polyester được sử dụng rộng rãi trong sản xuất chai nước, bao bì thực phẩm và sợi dệt may. Đây là một trong những chất ô nhiễm nhựa phổ biến nhất trong môi trường.',
    'C₁₀H₈O₄',
    'plastic',
    NULL
  )
ON CONFLICT (name) DO NOTHING;

-- ===================================
-- ENZYMES
-- ===================================
INSERT INTO public.enzymes (id, name, full_name, ec_number, description, mechanism, optimal_ph_min, optimal_ph_max, optimal_temperature_celsius, image_url)
VALUES 
  (
    '00000000-0000-0000-0000-000000000101',
    'PETase',
    'Polyethylene Terephthalate Hydrolase',
    'EC 3.1.1.101',
    'PETase là enzyme đầu tiên trong chuỗi phân huỷ PET, có khả năng thuỷ phân liên kết ester trong PET polymer thành MHET (Mono(2-hydroxyethyl) terephthalate).',
    'PETase xúc tác phản ứng thuỷ phân liên kết ester trong chuỗi polymer PET, phá vỡ liên kết giữa các đơn vị terephthalate và ethylene glycol.',
    7.0,
    8.0,
    30,
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'MHETase',
    'Mono(2-hydroxyethyl) Terephthalate Hydrolase',
    'EC 3.1.1.102',
    'MHETase là enzyme thứ hai trong chuỗi phân huỷ PET, thuỷ phân MHET thành TPA (Terephthalic Acid) và EG (Ethylene Glycol) - các sản phẩm cuối cùng có thể được vi sinh vật sử dụng làm nguồn carbon.',
    'MHETase thuỷ phân liên kết ester trong MHET, tách thành TPA và EG. Đây là bước quan trọng để giải phóng các phân tử đơn giản có thể được chuyển hoá tiếp.',
    7.5,
    8.5,
    30,
    NULL
  )
ON CONFLICT (name) DO NOTHING;

-- ===================================
-- MICROORGANISMS
-- ===================================
INSERT INTO public.microorganisms (id, name, scientific_name, kingdom, description, habitat, optimal_ph_min, optimal_ph_max, optimal_temperature_celsius, image_url)
VALUES 
  (
    '00000000-0000-0000-0000-000000000201',
    'Ideonella sakaiensis',
    'Ideonella sakaiensis',
    'Bacteria',
    'Ideonella sakaiensis là một loài vi khuẩn được phát hiện tại Nhật Bản có khả năng phân huỷ hoàn toàn PET. Vi khuẩn này sản xuất cả PETase và MHETase, cho phép nó chuyển hoá PET thành các sản phẩm cuối cùng TPA và EG.',
    'Môi trường nước ngọt, đặc biệt là các khu vực có nhiều rác thải nhựa PET.',
    7.0,
    8.5,
    30,
    NULL
  )
ON CONFLICT (name) DO NOTHING;

-- ===================================
-- ENZYME-POLLUTANT RELATIONSHIPS
-- ===================================
INSERT INTO public.enzyme_pollutant_relationships (enzyme_id, pollutant_id, efficiency, notes)
VALUES 
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'high',
    'PETase có hiệu quả cao trong việc phân huỷ PET, đặc biệt là PET vô định hình (amorphous PET).'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000001',
    'high',
    'MHETase hoạt động hiệu quả trên sản phẩm trung gian MHET từ quá trình phân huỷ PET bằng PETase.'
  )
ON CONFLICT (enzyme_id, pollutant_id) DO NOTHING;

-- ===================================
-- MICROORGANISM-ENZYME RELATIONSHIPS
-- ===================================
INSERT INTO public.microorganism_enzyme_relationships (microorganism_id, enzyme_id, notes)
VALUES 
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000101',
    'Ideonella sakaiensis sản xuất PETase để bắt đầu quá trình phân huỷ PET.'
  ),
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000102',
    'Ideonella sakaiensis sản xuất MHETase để hoàn thành quá trình phân huỷ PET thành TPA và EG.'
  )
ON CONFLICT (microorganism_id, enzyme_id) DO NOTHING;

-- ===================================
-- PATHWAYS
-- ===================================
INSERT INTO public.pathways (id, name, description, pollutant_id)
VALUES 
  (
    '00000000-0000-0000-0000-000000000301',
    'PET Degradation Pathway',
    'Chuỗi phản ứng phân huỷ PET thành TPA và EG thông qua hai enzyme PETase và MHETase.',
    '00000000-0000-0000-0000-000000000001'
  )
ON CONFLICT DO NOTHING;

-- ===================================
-- PATHWAY STEPS
-- ===================================
INSERT INTO public.pathway_steps (pathway_id, step_order, reactant_name, reactant_formula, product_name, product_formula, enzyme_id, mechanism_description, reaction_type)
VALUES 
  (
    '00000000-0000-0000-0000-000000000301',
    1,
    'PET',
    'Polymer (C₁₀H₈O₄)ₙ',
    'MHET',
    'C₁₀H₁₀O₅',
    '00000000-0000-0000-0000-000000000101',
    'PETase thuỷ phân liên kết ester trong chuỗi polymer PET, phá vỡ polymer thành các đơn vị MHET nhỏ hơn. Phản ứng này xảy ra ở bề mặt của PET polymer.',
    'hydrolysis'
  ),
  (
    '00000000-0000-0000-0000-000000000301',
    2,
    'MHET',
    'C₁₀H₁₀O₅',
    'TPA + EG',
    'TPA: C₈H₆O₄, EG: C₂H₆O₂',
    '00000000-0000-0000-0000-000000000102',
    'MHETase thuỷ phân liên kết ester trong MHET, tách thành Terephthalic Acid (TPA) và Ethylene Glycol (EG). Đây là các sản phẩm cuối cùng có thể được vi sinh vật sử dụng làm nguồn carbon và năng lượng.',
    'hydrolysis'
  )
ON CONFLICT (pathway_id, step_order) DO NOTHING;

-- ===================================
-- CASE STUDIES
-- ===================================
INSERT INTO public.case_studies (id, title, description, environment_type, pollutant_id, microorganism_id, pathway_id, advantages, limitations, conditions, image_url)
VALUES 
  (
    '00000000-0000-0000-0000-000000000401',
    'Phân huỷ PET trong môi trường nước ngọt',
    'Nghiên cứu khả năng phân huỷ PET của Ideonella sakaiensis trong môi trường nước ngọt như sông, hồ.',
    'freshwater',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000301',
    'Môi trường nước ngọt có pH và nhiệt độ ổn định, phù hợp với điều kiện tối ưu của enzyme. Nước cung cấp môi trường lỏng cho enzyme hoạt động hiệu quả.',
    'Tốc độ phân huỷ phụ thuộc vào diện tích bề mặt của PET. PET kết tinh (crystalline PET) khó phân huỷ hơn PET vô định hình. Quá trình phân huỷ diễn ra chậm, có thể mất vài tuần đến vài tháng.',
    'Nhiệt độ: 25-35°C, pH: 7.0-8.5, cần có oxy đầy đủ. PET cần được nghiền nhỏ hoặc có diện tích bề mặt lớn để enzyme tiếp cận.',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000402',
    'Phân huỷ PET trong môi trường biển',
    'Nghiên cứu khả năng phân huỷ PET của Ideonella sakaiensis trong môi trường biển.',
    'marine',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000301',
    'Môi trường biển có diện tích lớn và có thể chứa nhiều vi sinh vật đa dạng. Nhiều loài vi khuẩn biển có khả năng phân huỷ nhựa.',
    'Độ mặn cao có thể ảnh hưởng đến hoạt động của enzyme. Nhiệt độ nước biển thấp hơn có thể làm chậm quá trình. Áp suất và độ sâu có thể ảnh hưởng đến hoạt động của vi sinh vật.',
    'Nhiệt độ: 15-25°C, pH: 7.5-8.5, độ mặn: 30-35 ppt. Cần nghiên cứu thêm về khả năng thích ứng của Ideonella sakaiensis với môi trường biển.',
    NULL
  )
ON CONFLICT DO NOTHING;

-- ===================================
-- REFERENCES (Tài liệu tham khảo mẫu)
-- ===================================
INSERT INTO public.scientific_references (id, title, authors, journal, year, doi, url, reference_type)
VALUES 
  (
    '00000000-0000-0000-0000-000000000501',
    'A bacterium that degrades and assimilates poly(ethylene terephthalate)',
    'Yoshida, S., Hiraga, K., Takehana, T., Taniguchi, I., Yamaji, H., Maeda, Y., ... & Oda, K.',
    'Science',
    2016,
    '10.1126/science.aad6359',
    'https://www.science.org/doi/10.1126/science.aad6359',
    'paper'
  ),
  (
    '00000000-0000-0000-0000-000000000502',
    'Characterization and engineering of a plastic-degrading aromatic polyesterase',
    'Austin, H. P., Allen, M. D., Donohoe, B. S., Rorrer, N. A., Kearns, F. L., Silveira, R. L., ... & Beckham, G. T.',
    'Proceedings of the National Academy of Sciences',
    2018,
    '10.1073/pnas.1718804115',
    'https://www.pnas.org/doi/10.1073/pnas.1718804115',
    'paper'
  )
ON CONFLICT DO NOTHING;

-- ===================================
-- ENTITY REFERENCES
-- ===================================
-- Liên kết tài liệu với các entity
INSERT INTO public.entity_references (reference_id, entity_type, entity_id)
VALUES 
  -- Reference cho PET
  ('00000000-0000-0000-0000-000000000501', 'pollutant', '00000000-0000-0000-0000-000000000001'),
  -- Reference cho Ideonella sakaiensis
  ('00000000-0000-0000-0000-000000000501', 'microorganism', '00000000-0000-0000-0000-000000000201'),
  -- Reference cho PETase
  ('00000000-0000-0000-0000-000000000501', 'enzyme', '00000000-0000-0000-0000-000000000101'),
  -- Reference cho pathway
  ('00000000-0000-0000-0000-000000000501', 'pathway', '00000000-0000-0000-0000-000000000301'),
  -- Reference cho PETase (paper thứ 2)
  ('00000000-0000-0000-0000-000000000502', 'enzyme', '00000000-0000-0000-0000-000000000101')
ON CONFLICT DO NOTHING;
