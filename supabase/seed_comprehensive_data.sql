-- ===================================
-- COMPREHENSIVE SEED DATA FOR BIODEGRADATION EXPLORER
-- ===================================
-- Dữ liệu tổng hợp từ Notion: Phân tích từng loại nhựa & So sánh môi trường
-- Bao gồm: PET, HDPE, PVC, PP, PS với đầy đủ thông tin khoa học

-- ===================================
-- POLLUTANTS (Chất ô nhiễm)
-- ===================================
INSERT INTO public.pollutants (id, name, scientific_name, description, structure_formula, category, image_url)
VALUES 
  -- PET
  (
    '00000000-0000-0000-0000-000000000001',
    'PET',
    'Polyethylene Terephthalate',
    'PET là một loại polymer nhiệt dẻo thuộc họ Polyester. Được hình thành từ phản ứng trùng ngưng giữa Ethylene Glycol (EG) và Terephthalic Acid (TPA). Cấu trúc chứa các vòng thơm (aromatic rings) liên kết với các nhóm chức ester bền vững. Độ kết tinh cao là rào cản chính khiến vi sinh vật tự nhiên khó tấn công. Mã tái chế: Số 1.',
    '(C₁₀H₈O₄)ₙ',
    'plastic',
    NULL
  ),
  -- HDPE
  (
    '00000000-0000-0000-0000-000000000002',
    'HDPE',
    'High-Density Polyethylene',
    'HDPE là một polymer mạch thẳng với rất ít nhánh, được tạo ra từ quá trình trùng hợp các monomer ethylene. Cấu trúc này cho phép các chuỗi polymer sắp xếp sít nhau hơn so với LDPE. Xương sống carbon bão hòa kỵ nước và không chứa các nhóm chức phân cực là nguyên nhân khiến vi khuẩn khó bám dính. Mã tái chế: Số 2.',
    '(C₂H₄)ₙ',
    'plastic',
    NULL
  ),
  -- PVC
  (
    '00000000-0000-0000-0000-000000000003',
    'PVC',
    'Polyvinyl Chloride',
    'PVC được tạo thành từ phản ứng trùng hợp các monomer vinyl clorua. Đặc trưng bởi sự hiện diện của nguyên tử Clo (Cl) thay thế cho một nguyên tử Hydro trong mỗi mắt xích. Liên kết C-Cl cực kỳ bền vững và Clo làm tăng khả năng kháng hóa chất và chống cháy. Clo cũng là tác nhân gây độc, ức chế sự phát triển của vi sinh vật. Mã tái chế: Số 3.',
    '(C₂H₃Cl)ₙ',
    'plastic',
    NULL
  ),
  -- PP
  (
    '00000000-0000-0000-0000-000000000004',
    'PP',
    'Polypropylene',
    'PP là một polymer nhiệt dẻo được tạo ra từ quá trình trùng hợp propylene. Đặc trưng bởi các nhóm methyl (-CH₃) gắn vào mạch carbon chính. Các nhóm methyl tạo ra hiện tượng cản trở không gian, khiến PP có độ bền nhiệt và độ cứng cao hơn PE. Mạch carbon bão hòa hoàn toàn khiến nhựa này rất trơ về mặt hóa học. Mã tái chế: Số 5.',
    '(C₃H₆)ₙ',
    'plastic',
    NULL
  ),
  -- PS
  (
    '00000000-0000-0000-0000-000000000005',
    'PS',
    'Polystyrene',
    'PS được hình thành từ monomer styrene. Cấu trúc chứa các vòng phenyl (vòng benzene) cồng kềnh gắn vào mọi mắt xích khác của mạch carbon. Các vòng aromatic có tính cộng hưởng cao, mang lại độ bền cực kỳ lớn. PS cực kỳ kỵ nước và trơ về mặt sinh học. Các vòng phenyl cồng kềnh ngăn cản enzyme tiếp cận mạch xương sống carbon. Mã tái chế: Số 6.',
    '(C₈H₈)ₙ',
    'plastic',
    NULL
  )
ON CONFLICT (name) DO UPDATE SET
  scientific_name = EXCLUDED.scientific_name,
  description = EXCLUDED.description,
  structure_formula = EXCLUDED.structure_formula,
  updated_at = now();

-- ===================================
-- ENZYMES (Enzyme)
-- ===================================
INSERT INTO public.enzymes (id, name, full_name, ec_number, description, mechanism, optimal_ph_min, optimal_ph_max, optimal_temperature_celsius, image_url)
VALUES 
  -- PETase
  (
    '00000000-0000-0000-0000-000000000101',
    'PETase',
    'Polyethylene Terephthalate Hydrolase',
    'EC 3.1.1.101',
    'PETase là enzyme đầu tiên trong chuỗi phân huỷ PET, có khả năng thuỷ phân liên kết ester trong PET polymer thành MHET (Mono(2-hydroxyethyl) terephthalate).',
    'PETase bám vào liên kết ester trên chuỗi polymer và cắt PET thành MHET. Enzyme này hoạt động tốt nhất ở pH ~7.0 và nhiệt độ 30-37°C.',
    7.0,
    7.0,
    33.5,
    NULL
  ),
  -- MHETase
  (
    '00000000-0000-0000-0000-000000000102',
    'MHETase',
    'Mono(2-hydroxyethyl) Terephthalate Hydrolase',
    'EC 3.1.1.102',
    'MHETase là enzyme thứ hai trong chuỗi phân huỷ PET, thuỷ phân MHET thành TPA (Terephthalic Acid) và EG (Ethylene Glycol).',
    'MHETase thuỷ phân liên kết ester trong MHET, tách thành Terephthalic Acid (TPA) và Ethylene Glycol (EG).',
    7.0,
    8.0,
    30,
    NULL
  ),
  -- Laccase
  (
    '00000000-0000-0000-0000-000000000103',
    'Laccase',
    'Laccase',
    'EC 1.10.3.2',
    'Laccase là enzyme oxy hóa được sử dụng để phân hủy các polymer có cấu trúc phức tạp như HDPE, PP, PS. Enzyme này oxy hóa các nhóm carbonyl và tạo ra các điểm yếu trên mạch polymer.',
    'Laccase oxy hóa các nhóm carbonyl trên bề mặt polymer đã được tiền xử lý bằng UV/nhiệt, tạo ra các điểm yếu để enzyme khác có thể tiếp cận.',
    6.5,
    7.5,
    35,
    NULL
  ),
  -- Alkane Hydroxylase
  (
    '00000000-0000-0000-0000-000000000104',
    'Alkane Hydroxylase',
    'Alkane Hydroxylase',
    'EC 1.14.15.3',
    'Alkane Hydroxylase là enzyme oxy hóa được sử dụng để phân hủy các polymer hydrocarbon như HDPE và PP. Enzyme này hydroxyl hóa các mạch carbon dài.',
    'Alkane Hydroxylase hydroxyl hóa các mạch carbon dài trong HDPE và PP, tạo ra các nhóm hydroxyl để enzyme khác có thể tiếp cận.',
    6.5,
    7.5,
    30,
    NULL
  ),
  -- Peroxidase
  (
    '00000000-0000-0000-0000-000000000105',
    'Peroxidase',
    'Peroxidase',
    'EC 1.11.1.7',
    'Peroxidase là enzyme oxy hóa được sử dụng để phân hủy các polymer có cấu trúc vòng thơm như PS và PVC.',
    'Peroxidase oxy hóa các vòng thơm và các nhóm chức trên polymer, tạo ra các điểm yếu để phân mảnh.',
    7.0,
    7.5,
    30,
    NULL
  ),
  -- Oxidoreductase
  (
    '00000000-0000-0000-0000-000000000106',
    'Oxidoreductase',
    'Oxidoreductase',
    NULL,
    'Oxidoreductase là nhóm enzyme oxy hóa tổng quát được sử dụng để phân hủy các polymer hydrocarbon.',
    'Oxidoreductase oxy hóa các mạch carbon, tạo ra các nhóm carbonyl và hydroxyl để phân mảnh polymer.',
    6.5,
    7.5,
    30,
    NULL
  )
ON CONFLICT (name) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  ec_number = EXCLUDED.ec_number,
  description = EXCLUDED.description,
  mechanism = EXCLUDED.mechanism,
  optimal_ph_min = EXCLUDED.optimal_ph_min,
  optimal_ph_max = EXCLUDED.optimal_ph_max,
  optimal_temperature_celsius = EXCLUDED.optimal_temperature_celsius,
  updated_at = now();

-- ===================================
-- MICROORGANISMS (Vi sinh vật)
-- ===================================
INSERT INTO public.microorganisms (id, name, scientific_name, kingdom, description, habitat, optimal_ph_min, optimal_ph_max, optimal_temperature_celsius, image_url)
VALUES 
  -- Ideonella sakaiensis
  (
    '00000000-0000-0000-0000-000000000201',
    'Ideonella sakaiensis',
    'Ideonella sakaiensis',
    'Bacteria',
    'Ideonella sakaiensis là một loài vi khuẩn được phát hiện tại Nhật Bản có khả năng phân huỷ hoàn toàn PET. Vi khuẩn này sản xuất cả PETase và MHETase, cho phép nó chuyển hoá PET thành các sản phẩm cuối cùng TPA và EG.',
    'Môi trường nước ngọt, đặc biệt là các khu vực có nhiều rác thải nhựa PET.',
    7.0,
    7.0,
    33.5,
    NULL
  ),
  -- Micrococcus Oceanic spp.
  (
    '00000000-0000-0000-0000-000000000202',
    'Micrococcus Oceanic',
    'Micrococcus Oceanic spp.',
    'Bacteria',
    'Micrococcus Oceanic là vi khuẩn biển có khả năng phân hủy PET trong môi trường biển, mặc dù tốc độ chậm hơn so với Ideonella sakaiensis trong nước ngọt.',
    'Môi trường biển, nước mặn.',
    7.5,
    8.5,
    25,
    NULL
  ),
  -- Pseudomonas spp.
  (
    '00000000-0000-0000-0000-000000000203',
    'Pseudomonas',
    'Pseudomonas spp.',
    'Bacteria',
    'Pseudomonas là một chi vi khuẩn đa dạng có khả năng phân hủy nhiều loại polymer hydrocarbon như HDPE và PVC. Chúng tiết các enzyme oxy hóa như Laccase và Alkane Hydroxylase.',
    'Đa dạng: nước ngọt, đất, môi trường biển.',
    6.5,
    7.5,
    30,
    NULL
  ),
  -- Rhodococcus ruber
  (
    '00000000-0000-0000-0000-000000000204',
    'Rhodococcus ruber',
    'Rhodococcus ruber',
    'Bacteria',
    'Rhodococcus ruber là vi khuẩn có khả năng phân hủy HDPE và PS thông qua các enzyme oxy hóa. Chúng tạo biofilm trên bề mặt polymer và tiết enzyme để phân mảnh.',
    'Nước ngọt, đất, môi trường biển.',
    6.5,
    7.5,
    30,
    NULL
  ),
  -- Bacillus spp.
  (
    '00000000-0000-0000-0000-000000000205',
    'Bacillus',
    'Bacillus spp.',
    'Bacteria',
    'Bacillus là một chi vi khuẩn hiếu khí có khả năng phân hủy nhiều loại polymer như HDPE, PP, và PVC. Chúng tiết các enzyme oxy hóa và có khả năng tạo bào tử để tồn tại trong điều kiện khắc nghiệt.',
    'Đa dạng: đất, nước ngọt, môi trường biển.',
    6.5,
    8.0,
    30,
    NULL
  ),
  -- Alcanivorax spp.
  (
    '00000000-0000-0000-0000-000000000206',
    'Alcanivorax',
    'Alcanivorax spp.',
    'Bacteria',
    'Alcanivorax là vi khuẩn biển chuyên biệt phân hủy hydrocarbon trong môi trường biển. Chúng có khả năng phân hủy HDPE và PVC trong điều kiện nước mặn.',
    'Môi trường biển, nước mặn.',
    7.5,
    8.5,
    25,
    NULL
  ),
  -- Stenotrophomonas maltophilia
  (
    '00000000-0000-0000-0000-000000000207',
    'Stenotrophomonas maltophilia',
    'Stenotrophomonas maltophilia',
    'Bacteria',
    'Stenotrophomonas maltophilia là vi khuẩn có khả năng phân hủy PP thông qua các enzyme oxy hóa. Chúng tạo biofilm trên bề mặt PP đã được tiền xử lý bằng UV.',
    'Nước ngọt, đất.',
    7.0,
    7.5,
    30,
    NULL
  ),
  -- Bacillus flexus
  (
    '00000000-0000-0000-0000-000000000208',
    'Bacillus flexus',
    'Bacillus flexus',
    'Bacteria',
    'Bacillus flexus là vi khuẩn hiếu khí có khả năng phân hủy PP thông qua các enzyme oxy hóa. Chúng cần nồng độ oxy hòa tan cao để hoạt động.',
    'Nước ngọt, đất.',
    7.0,
    7.5,
    30,
    NULL
  ),
  -- Exiguobacterium sp.
  (
    '00000000-0000-0000-0000-000000000209',
    'Exiguobacterium',
    'Exiguobacterium sp.',
    'Bacteria',
    'Exiguobacterium là vi khuẩn có khả năng phân hủy PS thông qua các enzyme Laccase và Peroxidase. Chúng tạo biofilm trên bề mặt PS đã được tiền xử lý bằng UV.',
    'Nước ngọt, đất.',
    7.0,
    7.5,
    30,
    NULL
  ),
  -- Pseudomonas citronellolis
  (
    '00000000-0000-0000-0000-00000000020a',
    'Pseudomonas citronellolis',
    'Pseudomonas citronellolis',
    'Bacteria',
    'Pseudomonas citronellolis là vi khuẩn có khả năng khử Clo từ PVC và phân hủy polymer sau khi loại bỏ Clo.',
    'Nước ngọt, đất.',
    7.0,
    8.0,
    32.5,
    NULL
  ),
  -- Bacillus cereus
  (
    '00000000-0000-0000-0000-00000000020b',
    'Bacillus cereus',
    'Bacillus cereus',
    'Bacteria',
    'Bacillus cereus là vi khuẩn hiếu khí có khả năng phân hủy HDPE thông qua các enzyme oxy hóa sau khi polymer được tiền xử lý bằng UV.',
    'Nước ngọt, đất.',
    6.5,
    7.5,
    30,
    NULL
  )
ON CONFLICT (name) DO UPDATE SET
  scientific_name = EXCLUDED.scientific_name,
  kingdom = EXCLUDED.kingdom,
  description = EXCLUDED.description,
  habitat = EXCLUDED.habitat,
  optimal_ph_min = EXCLUDED.optimal_ph_min,
  optimal_ph_max = EXCLUDED.optimal_ph_max,
  optimal_temperature_celsius = EXCLUDED.optimal_temperature_celsius,
  updated_at = now();

-- ===================================
-- ENZYME-POLLUTANT RELATIONSHIPS
-- ===================================
INSERT INTO public.enzyme_pollutant_relationships (enzyme_id, pollutant_id, efficiency, notes)
VALUES 
  -- PET
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'high', 'PETase có hiệu quả cao trong việc phân huỷ PET, đặc biệt là PET vô định hình (amorphous PET).'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'high', 'MHETase hoạt động hiệu quả trên sản phẩm trung gian MHET từ quá trình phân huỷ PET bằng PETase.'),
  -- HDPE
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000002', 'low', 'Laccase chỉ hoạt động sau khi HDPE được tiền xử lý bằng UV/nhiệt để tạo nhóm carbonyl.'),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000002', 'low', 'Alkane Hydroxylase hydroxyl hóa mạch carbon của HDPE sau tiền xử lý.'),
  ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000002', 'low', 'Oxidoreductase oxy hóa bề mặt HDPE đã được tiền xử lý.'),
  -- PVC
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000003', 'low', 'Peroxidase chỉ hoạt động sau khi PVC được khử Clo.'),
  ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000003', 'low', 'Oxidoreductase oxy hóa PVC sau khi khử Clo.'),
  -- PP
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000004', 'low', 'Laccase oxy hóa PP đã được tiền xử lý bằng UV để tạo nhóm carbonyl.'),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000004', 'low', 'Alkane Hydroxylase hydroxyl hóa mạch carbon của PP.'),
  -- PS
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000005', 'low', 'Laccase chỉ hoạt động sau khi PS được tiền xử lý bằng UV để phá vỡ vòng aromatic.'),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000005', 'low', 'Peroxidase oxy hóa PS sau khi vòng benzene bị phá vỡ.')
ON CONFLICT (enzyme_id, pollutant_id) DO UPDATE SET
  efficiency = EXCLUDED.efficiency,
  notes = EXCLUDED.notes;

-- ===================================
-- MICROORGANISM-ENZYME RELATIONSHIPS
-- ===================================
INSERT INTO public.microorganism_enzyme_relationships (microorganism_id, enzyme_id, notes)
VALUES 
  -- Ideonella sakaiensis
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Ideonella sakaiensis sản xuất PETase để bắt đầu quá trình phân huỷ PET.'),
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000102', 'Ideonella sakaiensis sản xuất MHETase để hoàn thành quá trình phân huỷ PET thành TPA và EG.'),
  -- Pseudomonas
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000103', 'Pseudomonas spp. sản xuất Laccase để phân hủy HDPE và PVC.'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000104', 'Pseudomonas spp. sản xuất Alkane Hydroxylase để phân hủy HDPE.'),
  -- Rhodococcus ruber
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000103', 'Rhodococcus ruber sản xuất Laccase để phân hủy HDPE và PS.'),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000105', 'Rhodococcus ruber sản xuất Peroxidase để phân hủy PS.'),
  -- Bacillus
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000103', 'Bacillus spp. sản xuất Laccase để phân hủy HDPE, PP và PVC.'),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000104', 'Bacillus spp. sản xuất Alkane Hydroxylase để phân hủy PP.'),
  -- Alcanivorax
  ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000104', 'Alcanivorax spp. sản xuất Alkane Hydroxylase để phân hủy HDPE và PVC trong môi trường biển.'),
  -- Stenotrophomonas maltophilia
  ('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000103', 'Stenotrophomonas maltophilia sản xuất Laccase để phân hủy PP.'),
  -- Bacillus flexus
  ('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000104', 'Bacillus flexus sản xuất Alkane Hydroxylase để phân hủy PP.'),
  -- Exiguobacterium
  ('00000000-0000-0000-0000-000000000209', '00000000-0000-0000-0000-000000000103', 'Exiguobacterium sp. sản xuất Laccase để phân hủy PS.'),
  ('00000000-0000-0000-0000-000000000209', '00000000-0000-0000-0000-000000000105', 'Exiguobacterium sp. sản xuất Peroxidase để phân hủy PS.'),
  -- Pseudomonas citronellolis
  ('00000000-0000-0000-0000-00000000020a', '00000000-0000-0000-0000-000000000105', 'Pseudomonas citronellolis sản xuất Peroxidase để phân hủy PVC sau khi khử Clo.'),
  -- Bacillus cereus
  ('00000000-0000-0000-0000-00000000020b', '00000000-0000-0000-0000-000000000103', 'Bacillus cereus sản xuất Laccase để phân hủy HDPE.')
ON CONFLICT (microorganism_id, enzyme_id) DO UPDATE SET
  notes = EXCLUDED.notes;

-- ===================================
-- PATHWAYS (Sơ đồ pathway hoá sinh)
-- ===================================
INSERT INTO public.pathways (id, name, description, pollutant_id)
VALUES 
  -- PET Pathway
  (
    '00000000-0000-0000-0000-000000000301',
    'PET Degradation Pathway',
    'Chuỗi phản ứng phân huỷ PET thành TPA và EG thông qua hai enzyme PETase và MHETase.',
    '00000000-0000-0000-0000-000000000001'
  ),
  -- HDPE Pathway
  (
    '00000000-0000-0000-0000-000000000302',
    'HDPE Degradation Pathway',
    'Chuỗi phản ứng phân huỷ HDPE thông qua tiền xử lý oxy hóa (UV/nhiệt) và enzyme oxy hóa sinh học.',
    '00000000-0000-0000-0000-000000000002'
  ),
  -- PVC Pathway
  (
    '00000000-0000-0000-0000-000000000303',
    'PVC Degradation Pathway',
    'Chuỗi phản ứng phân huỷ PVC thông qua khử Clo và oxy hóa sinh học.',
    '00000000-0000-0000-0000-000000000003'
  ),
  -- PP Pathway
  (
    '00000000-0000-0000-0000-000000000304',
    'PP Degradation Pathway',
    'Chuỗi phản ứng phân huỷ PP thông qua oxy hóa quang hóa và enzyme oxy hóa sinh học.',
    '00000000-0000-0000-0000-000000000004'
  ),
  -- PS Pathway
  (
    '00000000-0000-0000-0000-000000000305',
    'PS Degradation Pathway',
    'Chuỗi phản ứng phân huỷ PS thông qua phá vỡ vòng aromatic và enzyme oxy hóa sinh học.',
    '00000000-0000-0000-0000-000000000005'
  )
ON CONFLICT DO NOTHING;

-- ===================================
-- PATHWAY STEPS
-- ===================================
-- PET Pathway Steps
INSERT INTO public.pathway_steps (pathway_id, step_order, reactant_name, reactant_formula, product_name, product_formula, enzyme_id, mechanism_description, reaction_type)
VALUES 
  -- PET Step 1: Tiếp xúc & bám dính
  (
    '00000000-0000-0000-0000-000000000301',
    1,
    'PET Polymer',
    '(C₁₀H₈O₄)ₙ',
    'PET + Enzyme Complex',
    'PET-PETase',
    '00000000-0000-0000-0000-000000000101',
    'Vi khuẩn Ideonella sakaiensis tiếp cận bề mặt PET. Enzyme PETase bám vào liên kết ester trên chuỗi polymer.',
    'adsorption'
  ),
  -- PET Step 2: Cắt mạch polymer
  (
    '00000000-0000-0000-0000-000000000301',
    2,
    'PET',
    '(C₁₀H₈O₄)ₙ',
    'MHET',
    'C₁₀H₁₀O₅',
    '00000000-0000-0000-0000-000000000101',
    'PETase cắt liên kết ester trong chuỗi polymer PET, phá vỡ polymer thành các đơn vị MHET nhỏ hơn.',
    'hydrolysis'
  ),
  -- PET Step 3: Thuỷ phân MHET
  (
    '00000000-0000-0000-0000-000000000301',
    3,
    'MHET',
    'C₁₀H₁₀O₅',
    'TPA + EG',
    'TPA: C₈H₆O₄, EG: C₂H₆O₂',
    '00000000-0000-0000-0000-000000000102',
    'MHETase thuỷ phân liên kết ester trong MHET, tách thành Terephthalic Acid (TPA) và Ethylene Glycol (EG).',
    'hydrolysis'
  ),
  -- PET Step 4: Khoáng hóa
  (
    '00000000-0000-0000-0000-000000000301',
    4,
    'TPA + EG',
    'TPA: C₈H₆O₄, EG: C₂H₆O₂',
    'CO₂ + H₂O + Biomass',
    'CO₂ + H₂O + C₅H₇NO₂',
    NULL,
    'TPA và EG được vận chuyển vào tế bào vi khuẩn và tham gia chu trình chuyển hóa carbon nội bào, sinh ra CO₂, H₂O và sinh khối vi sinh vật.',
    'mineralization'
  ),
  -- HDPE Pathway Steps
  (
    '00000000-0000-0000-0000-000000000302',
    1,
    'HDPE Polymer',
    '(C₂H₄)ₙ',
    'HDPE + Carbonyl Groups',
    '(C₂H₄)ₙ + C=O',
    NULL,
    'Tiền xử lý oxy hóa: UV/nhiệt/oxy tạo nhóm carbonyl (C=O) trên bề mặt HDPE, làm nhựa "già hóa" (abiotic aging).',
    'oxidation'
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    2,
    'HDPE + Carbonyl',
    '(C₂H₄)ₙ + C=O',
    'HDPE + Biofilm',
    'HDPE-Biofilm',
    NULL,
    'Vi khuẩn bám vào vùng đã oxy hóa, tạo biofilm trên bề mặt polymer.',
    'adsorption'
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    3,
    'HDPE + Biofilm',
    'HDPE-Biofilm',
    'Wax-like Fragments',
    'C₁₄H₃₀ - C₃₀H₆₂',
    '00000000-0000-0000-0000-000000000103',
    'Enzyme oxy hóa (Laccase, Alkane Hydroxylase) cắt mạch carbon thành các đoạn sáp/paraffin ngắn.',
    'oxidation'
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    4,
    'Wax-like Fragments',
    'C₁₄H₃₀ - C₃₀H₆₂',
    'Microplastics',
    'Microplastics',
    NULL,
    'Phân mảnh hạn chế tạo microplastics. Khoáng hóa rất hạn chế, HDPE không biến mất hoàn toàn.',
    'fragmentation'
  ),
  -- PVC Pathway Steps
  (
    '00000000-0000-0000-0000-000000000303',
    1,
    'PVC Polymer',
    '(C₂H₃Cl)ₙ',
    'PVC + Cl⁻',
    '(C₂H₃)ₙ + Cl⁻',
    NULL,
    'Khử Clo (Dechlorination): Giải phóng Cl⁻ / HCl, làm polymer mất ổn định.',
    'dechlorination'
  ),
  (
    '00000000-0000-0000-0000-000000000303',
    2,
    'PVC (dechlorinated)',
    '(C₂H₃)ₙ',
    'PVC + Carbonyl',
    '(C₂H₃)ₙ + C=O',
    '00000000-0000-0000-0000-000000000105',
    'Sau khi mất Cl, chuỗi carbon bị oxy hóa bởi enzyme Peroxidase.',
    'oxidation'
  ),
  (
    '00000000-0000-0000-0000-000000000303',
    3,
    'PVC (oxidized)',
    '(C₂H₃)ₙ + C=O',
    'Microplastics + Toxic Residues',
    'Microplastics + Phthalates',
    NULL,
    'Phân mảnh hạn chế thành vi nhựa. Tồn dư độc hại (Phthalates) từ chất làm dẻo.',
    'fragmentation'
  ),
  -- PP Pathway Steps
  (
    '00000000-0000-0000-0000-000000000304',
    1,
    'PP Polymer',
    '(C₃H₆)ₙ',
    'PP + Carbonyl',
    '(C₃H₆)ₙ + C=O',
    NULL,
    'Tiền xử lý oxy hóa: UV/nhiệt tấn công carbon bậc ba, tạo nhóm carbonyl. Nhánh methyl (-CH₃) cản trở enzyme.',
    'oxidation'
  ),
  (
    '00000000-0000-0000-0000-000000000304',
    2,
    'PP + Carbonyl',
    '(C₃H₆)ₙ + C=O',
    'PP + Biofilm',
    'PP-Biofilm',
    NULL,
    'Vi khuẩn bám yếu, tạo biofilm mỏng trên bề mặt.',
    'adsorption'
  ),
  (
    '00000000-0000-0000-0000-000000000304',
    3,
    'PP + Biofilm',
    'PP-Biofilm',
    'Surface Pitting',
    'PP (eroded)',
    '00000000-0000-0000-0000-000000000103',
    'Enzyme oxy hóa chỉ phân hủy ở lớp ngoài, tạo các hố li ti (pitting). Bên trong gần như nguyên vẹn.',
    'oxidation'
  ),
  (
    '00000000-0000-0000-0000-000000000304',
    4,
    'PP (eroded)',
    'PP (eroded)',
    'Microplastics',
    'Microplastics',
    NULL,
    'Phân mảnh tạo microplastics. Không khoáng hóa hoàn toàn.',
    'fragmentation'
  ),
  -- PS Pathway Steps
  (
    '00000000-0000-0000-0000-000000000305',
    1,
    'PS Polymer',
    '(C₈H₈)ₙ',
    'PS + Broken Aromatic Rings',
    '(C₈H₈)ₙ (damaged)',
    NULL,
    'Phá vỡ vòng aromatic: UV/nhiệt/oxy phá một phần vòng phenyl, tạo các vết nứt phân tử.',
    'oxidation'
  ),
  (
    '00000000-0000-0000-0000-000000000305',
    2,
    'PS (damaged)',
    '(C₈H₈)ₙ (damaged)',
    'PS + Biofilm',
    'PS-Biofilm',
    NULL,
    'Hình thành biofilm và tiết enzyme Laccase/Peroxidase.',
    'adsorption'
  ),
  (
    '00000000-0000-0000-0000-000000000305',
    3,
    'PS + Biofilm',
    'PS-Biofilm',
    'Styrene Oligomers',
    '(C₈H₈)ₙ (n<10)',
    '00000000-0000-0000-0000-000000000103',
    'Enzyme oxy hóa phân mảnh hạn chế thành các oligomer styrene.',
    'oxidation'
  ),
  (
    '00000000-0000-0000-0000-000000000305',
    4,
    'Styrene Oligomers',
    '(C₈H₈)ₙ (n<10)',
    'Microplastics',
    'Microplastics',
    NULL,
    'Tồn tại dai dẳng dưới dạng vi nhựa. Rất chậm, chủ yếu tạo vi nhựa.',
    'fragmentation'
  )
ON CONFLICT (pathway_id, step_order) DO UPDATE SET
  reactant_name = EXCLUDED.reactant_name,
  reactant_formula = EXCLUDED.reactant_formula,
  product_name = EXCLUDED.product_name,
  product_formula = EXCLUDED.product_formula,
  enzyme_id = EXCLUDED.enzyme_id,
  mechanism_description = EXCLUDED.mechanism_description,
  reaction_type = EXCLUDED.reaction_type;

-- ===================================
-- CASE STUDIES (So sánh môi trường)
-- ===================================
INSERT INTO public.case_studies (id, title, description, environment_type, pollutant_id, microorganism_id, pathway_id, advantages, limitations, conditions, image_url)
VALUES 
  -- PET - Nước ngọt
  (
    '00000000-0000-0000-0000-000000000401',
    'Phân huỷ PET trong môi trường nước ngọt',
    'Nghiên cứu khả năng phân huỷ PET của Ideonella sakaiensis trong môi trường nước ngọt. Tốc độ phân hủy đạt 12% sau 1 năm.',
    'freshwater',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000301',
    'Môi trường nước ngọt có pH và nhiệt độ ổn định (pH ~7.0, nhiệt độ 30-37°C), phù hợp với điều kiện tối ưu của enzyme PETase. Nước cung cấp môi trường lỏng cho enzyme hoạt động hiệu quả. Độ mặn thấp (0.2 ppt) không ảnh hưởng đến cấu trúc enzyme.',
    'Tốc độ phân huỷ phụ thuộc vào diện tích bề mặt của PET. PET kết tinh (crystalline PET) khó phân huỷ hơn PET vô định hình. Quá trình phân huỷ diễn ra chậm, có thể mất vài tuần đến vài tháng.',
    'Nhiệt độ: 30-37°C, pH: 7.0, độ mặn: 0.2 ppt, cần có oxy đầy đủ. PET cần được nghiền nhỏ hoặc có diện tích bề mặt lớn để enzyme tiếp cận.',
    NULL
  ),
  -- PET - Nước biển
  (
    '00000000-0000-0000-0000-000000000402',
    'Phân huỷ PET trong môi trường biển',
    'Nghiên cứu khả năng phân huỷ PET trong môi trường biển. Tốc độ phân hủy chỉ đạt 5% sau 1 năm, thấp hơn 2.4 lần so với nước ngọt.',
    'marine',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000301',
    'Môi trường biển có diện tích lớn và có thể chứa nhiều vi sinh vật đa dạng. Nhiều loài vi khuẩn biển có khả năng phân huỷ nhựa.',
    'Độ mặn cao (35.2 ppt) làm biến đổi cấu trúc bậc ba của enzyme PETase, dẫn đến tốc độ phân hủy giảm nghiêm trọng. Nhiệt độ nước biển thấp hơn có thể làm chậm quá trình. Áp suất và độ sâu có thể ảnh hưởng đến hoạt động của vi sinh vật.',
    'Nhiệt độ: 15-25°C, pH: 7.5-8.5, độ mặn: 35.2 ppt. Khả năng thủy phân của enzyme PETase từ Ideonella sakaiensis bị suy giảm nghiêm trọng trong môi trường biển.',
    NULL
  ),
  -- HDPE - Nước ngọt
  (
    '00000000-0000-0000-0000-000000000403',
    'Phân huỷ HDPE trong môi trường nước ngọt',
    'Nghiên cứu khả năng phân huỷ HDPE của Bacillus cereus trong môi trường nước ngọt. Tốc độ phân hủy đạt 0.8% sau 1 năm.',
    'freshwater',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-00000000020b',
    '00000000-0000-0000-0000-000000000302',
    'Môi trường nước ngọt có pH trung tính (6.5-7.5) và nhiệt độ ổn định (30-40°C) phù hợp cho quá trình oxy hóa sinh học. Diện tích bề mặt lớn (dạng bột hoặc màng mỏng) giúp vi khuẩn kỵ nước dễ tìm điểm bám.',
    'Cần tiền xử lý bằng UV/nhiệt để tạo nhóm carbonyl trước khi vi khuẩn có thể bám dính. Quá trình oxy hóa sinh học diễn ra cực kỳ chậm. Tạo microplastics thay vì khoáng hóa hoàn toàn.',
    'Tiền xử lý: Cường độ UV cao hoặc nhiệt độ >50°C. Giai đoạn sinh học: pH 6.5-7.5, nhiệt độ 30-40°C. Diện tích bề mặt càng lớn tốc độ phân hủy càng nhanh.',
    NULL
  ),
  -- HDPE - Nước biển
  (
    '00000000-0000-0000-0000-000000000404',
    'Phân huỷ HDPE trong môi trường biển',
    'Nghiên cứu khả năng phân huỷ HDPE của Alcanivorax spp. trong môi trường biển. Tốc độ phân hủy chỉ đạt 0.3% sau 1 năm.',
    'marine',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000206',
    '00000000-0000-0000-0000-000000000302',
    'Alcanivorax spp. là vi khuẩn biển chuyên biệt phân hủy hydrocarbon.',
    'Quá trình oxy hóa bề mặt diễn ra cực kỳ chậm, dẫn đến hiện tượng phân mảnh cơ học nhanh hơn nhiều so với tốc độ khoáng hóa. Nguy cơ cao hình thành các hạt vi nhựa (microplastics) tồn tại lâu dài trong chuỗi thức ăn biển.',
    'Nhiệt độ: 15-25°C, pH: 7.5-8.5, độ mặn: 30-35 ppt. HDPE thể hiện tính trơ sinh học cao trong cả hai môi trường.',
    NULL
  ),
  -- PVC - Nước ngọt
  (
    '00000000-0000-0000-0000-000000000405',
    'Phân huỷ PVC trong môi trường nước ngọt',
    'Nghiên cứu khả năng phân huỷ PVC của Pseudomonas citronellolis trong môi trường nước ngọt. Tốc độ phân hủy < 0.05% sau 1 năm.',
    'freshwater',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-00000000020a',
    '00000000-0000-0000-0000-000000000303',
    'Môi trường nước ngọt có khả năng đệm tốt để duy trì pH ổn định khi quá trình khử Clo giải phóng HCl.',
    'PVC thể hiện tính trơ hóa học cực cao do sự hiện diện của các nguyên tử Clo. Quá trình khử Clo cần thời gian dài. Phân mảnh hạn chế thành vi nhựa, rất khó khoáng hóa hoàn toàn.',
    'pH: 7.0-8.0 (cần đệm tốt), nhiệt độ: 30-35°C. Việc loại bỏ các chất làm dẻo (plasticizers) trước giúp enzyme tiếp cận mạch polymer chính dễ dàng hơn.',
    NULL
  ),
  -- PVC - Nước biển
  (
    '00000000-0000-0000-0000-000000000406',
    'Phân huỷ PVC trong môi trường biển',
    'Nghiên cứu khả năng phân huỷ PVC trong môi trường biển. Tốc độ phân hủy < 0.01% sau 1 năm.',
    'marine',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000206',
    '00000000-0000-0000-0000-000000000303',
    'Không có ưu điểm đáng kể.',
    'Sự kết hợp giữa tia UV và độ mặn cao không thúc đẩy phân hủy sinh học mà lại kích thích quá trình giải phóng các chất phụ gia độc hại (plasticizers) như Phthalates, gây ô nhiễm nguồn nước nghiêm trọng dù cấu trúc nhựa vẫn còn nguyên vẹn.',
    'Nhiệt độ: 15-25°C, pH: 7.5-8.5, độ mặn: 30-35 ppt. PVC thể hiện tính trơ hóa học cực cao trong cả hai môi trường.',
    NULL
  ),
  -- PP - Nước ngọt
  (
    '00000000-0000-0000-0000-000000000407',
    'Phân huỷ PP trong môi trường nước ngọt',
    'Nghiên cứu khả năng phân huỷ PP của Stenotrophomonas maltophilia và Bacillus flexus trong môi trường nước ngọt. Tốc độ phân hủy đạt 0.8% sau 1 năm.',
    'freshwater',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000207',
    '00000000-0000-0000-0000-000000000304',
    'Cần nồng độ Oxy hòa tan cao vì PP phân hủy chủ yếu qua con đường oxy hóa hiếu khí. Nhựa PP có độ kết tinh thấp hoặc nhựa PP đã qua tái chế (chứa nhiều tạp chất oxy hóa) thường phân hủy nhanh hơn.',
    'Cấu trúc kỵ nước mạnh mẽ khiến vi sinh vật khó tiếp cận. Cần tiền xử lý bằng UV để tạo nhóm carbonyl. Chỉ phân hủy ở lớp ngoài, bên trong gần như nguyên vẹn. Tạo microplastics.',
    'Nhiệt độ: 25-37°C, pH: 7.0-7.5, nồng độ Oxy hòa tan cao. Sự kết hợp giữa nhiệt độ nước cao và tia UV tại tầng mặt tạo ra luồng oxy hóa mạnh mẽ.',
    NULL
  ),
  -- PP - Nước biển
  (
    '00000000-0000-0000-0000-000000000408',
    'Phân huỷ PP trong môi trường biển',
    'Nghiên cứu khả năng phân huỷ PP trong môi trường biển. Tốc độ phân hủy chỉ đạt 0.2% sau 1 năm.',
    'marine',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000206',
    '00000000-0000-0000-0000-000000000304',
    'Sự kết hợp giữa nhiệt độ nước cao và tia UV tại tầng mặt đại dương tạo ra luồng oxy hóa mạnh mẽ, làm bẻ gãy các mạch polymer dài thành các đoạn ngắn hơn.',
    'Oxy hóa rất yếu do áp suất và độ sâu kìm hãm. Vi khuẩn kỵ khí (anaerobic bacteria) không hiệu quả bằng vi khuẩn hiếu khí. Tốc độ phân hủy cực thấp.',
    'Nhiệt độ: 15-25°C, pH: 7.5-8.5, độ mặn: 30-35 ppt. Áp suất và độ sâu có thể ảnh hưởng đến hoạt động của vi sinh vật.',
    NULL
  ),
  -- PS - Nước ngọt
  (
    '00000000-0000-0000-0000-000000000409',
    'Phân huỷ PS trong môi trường nước ngọt',
    'Nghiên cứu khả năng phân huỷ PS của Rhodococcus ruber trong môi trường nước ngọt. Tốc độ phân hủy đạt 0.8% sau 1 năm.',
    'freshwater',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000305',
    'Cần sự tác động mạnh của tia UV bước sóng ngắn để mở vòng benzene. PS dạng xốp (EPS) có cấu trúc rỗng giúp tăng diện tích tiếp xúc cho vi sinh vật.',
    'Cấu trúc vòng thơm (phenyl group) tạo ra sự bền vững hóa học cao, khiến các enzyme từ Rhodococcus ruber rất khó tiếp cận để bẻ gãy mạch. Cần xử lý tính kỵ nước bề mặt bằng các chất hoạt động bề mặt sinh học (biosurfactants).',
    'pH: 7.0-7.5, nhiệt độ: 30°C (tối ưu cho chủng Exiguobacterium). Cần sự tác động mạnh của tia UV bước sóng ngắn để mở vòng benzene.',
    NULL
  ),
  -- PS - Nước biển
  (
    '00000000-0000-0000-0000-00000000040a',
    'Phân huỷ PS trong môi trường biển',
    'Nghiên cứu khả năng phân huỷ PS của Rhodococcus ruber trong môi trường biển. Tốc độ phân hủy chỉ đạt 0.3% sau 1 năm.',
    'marine',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000305',
    'Không có ưu điểm đáng kể.',
    'Hiện tượng biofouling (sinh vật bám bẩn) tạo lớp màng sinh học dày đặc, ngăn cản sự xâm nhập của oxy và ánh sáng UV, làm tốc độ phân hủy giảm xuống mức cực thấp. Cấu trúc vòng thơm bền vững khiến enzyme khó tiếp cận.',
    'Nhiệt độ: 15-25°C, pH: 7.5-8.5, độ mặn: 30-35 ppt. Biofouling cản trở quá trình phân hủy.',
    NULL
  )
ON CONFLICT DO NOTHING;
