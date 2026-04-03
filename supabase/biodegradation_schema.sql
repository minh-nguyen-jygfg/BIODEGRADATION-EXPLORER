-- ===================================
-- BIODEGRADATION EXPLORER SCHEMA
-- ===================================
-- Schema mới cho dự án Biodegradation Explorer
-- Tập trung vào nghiên cứu phân huỷ sinh học các chất ô nhiễm

-- NOTE: Không cần (và không được phép) chỉnh RLS trên auth.users trong Supabase
-- alter table auth.users enable row level security;

-- ===================================
-- PROFILES (Đơn giản hóa - chỉ email và tên)
-- ===================================
-- Xóa bảng cũ nếu tồn tại và tạo lại (hoặc chỉ tạo nếu chưa có)
DROP TABLE IF EXISTS public.profiles CASCADE;

create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- ===================================
-- POLLUTANTS (Chất ô nhiễm)
-- ===================================
DROP TABLE IF EXISTS public.pollutants CASCADE;

create table public.pollutants (
  id uuid default gen_random_uuid() primary key,
  name text not null unique, -- 'PET', 'PE', etc.
  scientific_name text, -- 'Polyethylene Terephthalate'
  description text,
  structure_formula text, -- Công thức cấu trúc (text)
  structure_image_url text, -- Link ảnh công thức hóa học / cấu trúc (riêng, không dùng chung image_url)
  category text check (category in ('plastic', 'oil', 'chemical', 'other')),
  image_url text,

  -- Quá trình phân hủy (tối đa 6 giai đoạn)
  -- Ảnh hiển thị ngoài danh sách (outer), ảnh trong popup chi tiết (modal), tiêu đề và nội dung
  degradation_stage1_outer_image_url text,
  degradation_stage1_modal_image_url text,
  degradation_stage1_title text,
  degradation_stage1_content text,

  degradation_stage2_outer_image_url text,
  degradation_stage2_modal_image_url text,
  degradation_stage2_title text,
  degradation_stage2_content text,

  degradation_stage3_outer_image_url text,
  degradation_stage3_modal_image_url text,
  degradation_stage3_title text,
  degradation_stage3_content text,

  degradation_stage4_outer_image_url text,
  degradation_stage4_modal_image_url text,
  degradation_stage4_title text,
  degradation_stage4_content text,

  degradation_stage5_outer_image_url text,
  degradation_stage5_modal_image_url text,
  degradation_stage5_title text,
  degradation_stage5_content text,

  degradation_stage6_outer_image_url text,
  degradation_stage6_modal_image_url text,
  degradation_stage6_title text,
  degradation_stage6_content text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pollutants enable row level security;
create policy "Pollutants are viewable by everyone." 
  on pollutants for select using ( true );

-- ===================================
-- ENZYMES (Enzyme)
-- ===================================
DROP TABLE IF EXISTS public.enzymes CASCADE;

create table public.enzymes (
  id uuid default gen_random_uuid() primary key,
  name text not null unique, -- 'PETase', 'MHETase'
  full_name text, -- 'Polyethylene Terephthalate Hydrolase'
  ec_number text, -- EC number nếu có
  description text,
  mechanism text, -- Cơ chế hoạt động
  optimal_ph_min numeric,
  optimal_ph_max numeric,
  optimal_temperature_celsius numeric,
  structure_url text, -- Link đến cấu trúc 3D hoặc hình ảnh
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.enzymes enable row level security;
create policy "Enzymes are viewable by everyone." 
  on enzymes for select using ( true );

-- ===================================
-- MICROORGANISMS (Vi sinh vật)
-- ===================================
DROP TABLE IF EXISTS public.microorganisms CASCADE;

create table public.microorganisms (
  id uuid default gen_random_uuid() primary key,
  name text not null unique, -- 'Ideonella sakaiensis'
  scientific_name text,
  kingdom text, -- 'Bacteria', 'Fungi', etc.
  description text,
  habitat text, -- Môi trường sống
  optimal_ph_min numeric,
  optimal_ph_max numeric,
  optimal_temperature_celsius numeric,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.microorganisms enable row level security;
create policy "Microorganisms are viewable by everyone." 
  on microorganisms for select using ( true );

-- ===================================
-- PATHWAYS (Sơ đồ pathway hoá sinh)
-- ===================================
DROP TABLE IF EXISTS public.pathways CASCADE;

create table public.pathways (
  id uuid default gen_random_uuid() primary key,
  name text not null, -- 'PET Degradation Pathway'
  description text,
  pollutant_id uuid references public.pollutants(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pathways enable row level security;
create policy "Pathways are viewable by everyone." 
  on pathways for select using ( true );

-- ===================================
-- PATHWAY STEPS (Các bước trong pathway)
-- ===================================
DROP TABLE IF EXISTS public.pathway_steps CASCADE;

create table public.pathway_steps (
  id uuid default gen_random_uuid() primary key,
  pathway_id uuid references public.pathways(id) on delete cascade not null,
  step_order int not null, -- Thứ tự bước (1, 2, 3...)
  reactant_name text not null, -- Tên chất phản ứng đầu vào
  reactant_formula text, -- Công thức chất phản ứng
  product_name text not null, -- Tên sản phẩm đầu ra
  product_formula text, -- Công thức sản phẩm
  enzyme_id uuid references public.enzymes(id), -- Enzyme xúc tác (nếu có)
  mechanism_description text, -- Mô tả cơ chế phản ứng
  reaction_type text, -- 'hydrolysis', 'oxidation', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(pathway_id, step_order)
);

alter table public.pathway_steps enable row level security;
create policy "Pathway steps are viewable by everyone." 
  on pathway_steps for select using ( true );

create index idx_pathway_steps_pathway on public.pathway_steps(pathway_id);
create index idx_pathway_steps_order on public.pathway_steps(pathway_id, step_order);

-- ===================================
-- ENZYME-POLLUTANT RELATIONSHIPS
-- ===================================
DROP TABLE IF EXISTS public.enzyme_pollutant_relationships CASCADE;

create table public.enzyme_pollutant_relationships (
  id uuid default gen_random_uuid() primary key,
  enzyme_id uuid references public.enzymes(id) on delete cascade not null,
  pollutant_id uuid references public.pollutants(id) on delete cascade not null,
  efficiency text, -- 'high', 'medium', 'low'
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(enzyme_id, pollutant_id)
);

alter table public.enzyme_pollutant_relationships enable row level security;
create policy "Enzyme-pollutant relationships are viewable by everyone." 
  on enzyme_pollutant_relationships for select using ( true );

-- ===================================
-- MICROORGANISM-ENZYME RELATIONSHIPS
-- ===================================
DROP TABLE IF EXISTS public.microorganism_enzyme_relationships CASCADE;

create table public.microorganism_enzyme_relationships (
  id uuid default gen_random_uuid() primary key,
  microorganism_id uuid references public.microorganisms(id) on delete cascade not null,
  enzyme_id uuid references public.enzymes(id) on delete cascade not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(microorganism_id, enzyme_id)
);

alter table public.microorganism_enzyme_relationships enable row level security;
create policy "Microorganism-enzyme relationships are viewable by everyone." 
  on microorganism_enzyme_relationships for select using ( true );

-- ===================================
-- CASE STUDIES (Case study)
-- ===================================
DROP TABLE IF EXISTS public.case_studies CASCADE;

create table public.case_studies (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  environment_type text not null check (environment_type in ('freshwater', 'marine', 'soil', 'other')),
  pollutant_id uuid references public.pollutants(id) not null,
  microorganism_id uuid references public.microorganisms(id),
  pathway_id uuid references public.pathways(id),
  advantages text, -- Thuận lợi
  limitations text, -- Hạn chế
  conditions text, -- Điều kiện thực tế
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.case_studies enable row level security;
create policy "Case studies are viewable by everyone." 
  on case_studies for select using ( true );

-- Dùng tên bảng không trùng từ khóa SQL: scientific_references
DROP TABLE IF EXISTS public.scientific_references CASCADE;

create table public.scientific_references (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  authors text,
  journal text,
  year int,
  doi text,
  url text,
  reference_type text check (reference_type in ('paper', 'book', 'website', 'other')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.scientific_references enable row level security;
create policy "References are viewable by everyone." 
  on scientific_references for select using ( true );

-- ===================================
-- ENTITY REFERENCES (Liên kết tài liệu với các entity)
-- ===================================
DROP TABLE IF EXISTS public.entity_references CASCADE;

create table public.entity_references (
  id uuid default gen_random_uuid() primary key,
  reference_id uuid references public.scientific_references(id) on delete cascade not null,
  entity_type text not null check (entity_type in ('pollutant', 'enzyme', 'microorganism', 'pathway', 'case_study')),
  entity_id uuid not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(reference_id, entity_type, entity_id)
);

alter table public.entity_references enable row level security;
create policy "Entity references are viewable by everyone." 
  on entity_references for select using ( true );

create index idx_entity_references_entity on public.entity_references(entity_type, entity_id);

-- ===================================
-- TRIGGER: Tạo profile tự động khi user đăng ký
-- ===================================
-- Xóa function và trigger cũ nếu tồn tại
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data ->> 'full_name', 
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
