-- ============================================================
-- PORTFOLIO SUPABASE DATABASE SCHEMA
-- Run this in Supabase SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILE TABLE
-- ============================================================
create table if not exists public.profile (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null default 'Fatwa Bawahsi',
  title               text default 'Business Analyst · QA Engineer',
  tagline             text default 'Bridging business needs and technical solutions.',
  summary             text default '',
  photo_url           text,
  cv_url              text,
  cv_download_count   integer default 0,
  email               text not null default '',
  phone               text,
  location            text default 'Jakarta, Indonesia',
  linkedin_url        text,
  github_url          text,
  instagram_url       text,
  available           boolean default true,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- Insert default profile row (only one row needed)
insert into public.profile (name, email, location)
values ('Fatwa Bawahsi', 'hello@example.com', 'Jakarta, Indonesia')
on conflict do nothing;

-- ============================================================
-- 2. SKILLS TABLE
-- ============================================================
create table if not exists public.skills (
  id            uuid primary key default uuid_generate_v4(),
  category      text not null default 'Business Analysis',
  name          text not null,
  icon          text,
  proficiency   integer default 80 check (proficiency between 0 and 100),
  order_index   integer default 0,
  created_at    timestamptz default now()
);

-- Sample skill data
insert into public.skills (category, name, proficiency, order_index) values
  ('Business Analysis', 'Requirements Gathering', 90, 1),
  ('Business Analysis', 'BRD / FRD Writing',      88, 2),
  ('Business Analysis', 'User Stories & Epics',   85, 3),
  ('Business Analysis', 'BPMN Process Mapping',   80, 4),
  ('System Analysis',   'UML Diagrams',            87, 1),
  ('System Analysis',   'ERD Design',              85, 2),
  ('System Analysis',   'Use Case Diagrams',       90, 3),
  ('System Analysis',   'Data Flow Diagrams',      82, 4),
  ('QA Testing',        'Test Planning',           92, 1),
  ('QA Testing',        'Test Case Design',        90, 2),
  ('QA Testing',        'UAT Management',          85, 3),
  ('QA Testing',        'JIRA & Bug Reporting',    88, 4),
  ('QA Engineering',    'Selenium WebDriver',      82, 1),
  ('QA Engineering',    'Cypress',                 78, 2),
  ('QA Engineering',    'Postman / API Testing',   88, 3),
  ('QA Engineering',    'JMeter / Load Testing',   75, 4),
  ('Tools & Platforms', 'Confluence & Notion',     85, 1),
  ('Tools & Platforms', 'Figma (Wireframing)',     72, 2),
  ('Tools & Platforms', 'Git & GitHub',            80, 3),
  ('Tools & Platforms', 'SQL / Database',          78, 4),
  ('Methodologies',     'Agile / Scrum',           90, 1),
  ('Methodologies',     'Kanban',                  85, 2),
  ('Methodologies',     'SDLC & STLC',            88, 3),
  ('Methodologies',     'Waterfall',               80, 4);

-- ============================================================
-- 3. PROJECTS TABLE
-- ============================================================
create table if not exists public.projects (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text default '',
  role          text not null default 'BA'
                  check (role in ('BA','SA','QA','QA Engineer','Full Stack')),
  tech_stack    text[] default '{}',
  image_url     text,
  demo_url      text,
  github_url    text,
  featured      boolean default false,
  order_index   integer default 0,
  created_at    timestamptz default now()
);

-- Sample project data
insert into public.projects (title, description, role, tech_stack, featured, order_index) values
  (
    'E-Commerce BRD & Process Redesign',
    'Complete business requirements document and AS-IS/TO-BE process mapping for a B2C marketplace migration project involving 40+ stakeholders.',
    'BA',
    array['Confluence','Visio','BPMN','Lucidchart'],
    true, 1
  ),
  (
    'Banking App Automated Regression Suite',
    'Selenium + TestNG automation framework covering 300+ test cases integrated into Jenkins CI/CD pipeline. Reduced regression cycle by 70%.',
    'QA Engineer',
    array['Selenium','TestNG','Jenkins','Java','Maven'],
    true, 2
  ),
  (
    'HR Management System — UML Architecture',
    'Full system architecture documentation with use case, sequence, ERD, and DFD diagrams for a mid-scale HR SaaS platform.',
    'SA',
    array['StarUML','Draw.io','SQL','Lucidchart'],
    true, 3
  );

-- ============================================================
-- 4. EXPERIENCES TABLE
-- ============================================================
create table if not exists public.experiences (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  company       text not null,
  location      text default '',
  type          text default 'Full-time'
                  check (type in ('Full-time','Part-time','Contract','Internship','Freelance')),
  start_date    date not null,
  end_date      date,
  current       boolean default false,
  description   text default '',
  order_index   integer default 0,
  created_at    timestamptz default now()
);

-- ============================================================
-- 5. CERTIFICATIONS TABLE
-- ============================================================
create table if not exists public.certifications (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  issuer          text not null,
  issue_date      date not null,
  expiry_date     date,
  credential_url  text,
  image_url       text,
  order_index     integer default 0,
  created_at      timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.profile       enable row level security;
alter table public.skills        enable row level security;
alter table public.projects      enable row level security;
alter table public.experiences   enable row level security;
alter table public.certifications enable row level security;

-- PUBLIC READ: Anyone can read portfolio data
create policy "Public read profile"       on public.profile       for select using (true);
create policy "Public read skills"        on public.skills        for select using (true);
create policy "Public read projects"      on public.projects      for select using (true);
create policy "Public read experiences"   on public.experiences   for select using (true);
create policy "Public read certifications" on public.certifications for select using (true);

-- AUTHENTICATED WRITE: Only logged-in admin can insert/update/delete
create policy "Auth insert profile"       on public.profile       for insert with check (auth.role() = 'authenticated');
create policy "Auth update profile"       on public.profile       for update using (auth.role() = 'authenticated');
create policy "Auth insert skills"        on public.skills        for insert with check (auth.role() = 'authenticated');
create policy "Auth update skills"        on public.skills        for update using (auth.role() = 'authenticated');
create policy "Auth delete skills"        on public.skills        for delete using (auth.role() = 'authenticated');
create policy "Auth insert projects"      on public.projects      for insert with check (auth.role() = 'authenticated');
create policy "Auth update projects"      on public.projects      for update using (auth.role() = 'authenticated');
create policy "Auth delete projects"      on public.projects      for delete using (auth.role() = 'authenticated');
create policy "Auth insert experiences"   on public.experiences   for insert with check (auth.role() = 'authenticated');
create policy "Auth update experiences"   on public.experiences   for update using (auth.role() = 'authenticated');
create policy "Auth delete experiences"   on public.experiences   for delete using (auth.role() = 'authenticated');
create policy "Auth insert certifications" on public.certifications for insert with check (auth.role() = 'authenticated');
create policy "Auth update certifications" on public.certifications for update using (auth.role() = 'authenticated');
create policy "Auth delete certifications" on public.certifications for delete using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Run this separately in Supabase Storage → Create Bucket
-- Bucket name: portfolio
-- Public: true

-- Storage RLS policies (run after creating bucket)
create policy "Public read storage"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "Auth upload storage"
  on storage.objects for insert
  with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');

create policy "Auth update storage"
  on storage.objects for update
  using (bucket_id = 'portfolio' and auth.role() = 'authenticated');

create policy "Auth delete storage"
  on storage.objects for delete
  using (bucket_id = 'portfolio' and auth.role() = 'authenticated');
