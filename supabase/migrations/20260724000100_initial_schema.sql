-- AK Vista: public users may submit leads/property requests, but only JWT app_metadata.role = 'admin' can manage listings.
-- Set the first admin from Supabase SQL editor after creating their Auth user:
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb where email = 'admin@example.com';

create extension if not exists pgcrypto;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text not null unique, reference_number text unique,
  description text, purpose text not null check (purpose in ('sale','rent')),
  category text not null, subtype text, city text not null default 'Nashik', locality text not null,
  address text, landmark text, latitude numeric, longitude numeric, map_url text,
  price numeric, rent numeric, deposit numeric, maintenance numeric, price_per_sqft numeric, price_text text, negotiable boolean default false,
  bedrooms integer, bathrooms integer, balconies integer, parking integer, carpet_area numeric, builtup_area numeric, super_builtup_area numeric, plot_area numeric, area_unit text default 'sq ft',
  floor_number integer, total_floors integer, property_age text, facing text, furnishing text, availability text, possession_date date,
  project_name text, developer_name text, rera_number text, project_status text, amenities text[] default '{}',
  images text[] default '{}', cover_image text, brochure_url text, floor_plans text[] default '{}', video_url text, virtual_tour_url text,
  status text not null default 'draft' check (status in ('draft','published','sold','rented','archived')), featured boolean not null default false,
  seo_title text, meta_description text, focus_keyword text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(), name text not null, mobile text not null, whatsapp text, email text,
  enquiry_type text not null default 'general', property_id uuid references public.properties(id) on delete set null, property_title text,
  budget text, preferred_location text, message text, lead_status text not null default 'New', source text, internal_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.property_owner_submissions (
  id uuid primary key default gen_random_uuid(), owner_name text not null, mobile text not null, whatsapp text, email text,
  property_type text not null, purpose text not null check (purpose in ('sale','rent')), location text not null, expected_price text not null,
  details text not null, images text[] not null default '{}', consent boolean not null check (consent),
  status text not null default 'pending' check (status in ('pending','reviewing','accepted','rejected','converted')),
  admin_notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.properties enable row level security;
alter table public.leads enable row level security;
alter table public.property_owner_submissions enable row level security;

create policy "public reads published properties" on public.properties for select to anon, authenticated using (status = 'published');
create policy "admins fully manage properties" on public.properties for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "public can send leads" on public.leads for insert to anon, authenticated with check (char_length(regexp_replace(mobile, '\\D', '', 'g')) = 10);
create policy "admins read and update leads" on public.leads for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "public can submit a property for review" on public.property_owner_submissions for insert to anon, authenticated with check (status = 'pending' and consent = true and char_length(regexp_replace(mobile, '\\D', '', 'g')) = 10);
create policy "admins manage owner submissions" on public.property_owner_submissions for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant usage on schema public to anon, authenticated;
grant select on public.properties to anon, authenticated;
grant insert on public.leads, public.property_owner_submissions to anon, authenticated;
grant all on public.properties, public.leads, public.property_owner_submissions to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('property-images','property-images',true,10485760,array['image/jpeg','image/png','image/webp']),
  ('property-brochures','property-brochures',false,10485760,array['application/pdf']),
  ('floor-plans','floor-plans',false,10485760,array['image/jpeg','image/png','image/webp']),
  ('owner-submissions','owner-submissions',false,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "admins upload listing media" on storage.objects for insert to authenticated with check (bucket_id in ('property-images','property-brochures','floor-plans') and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admins read restricted listing media" on storage.objects for select to authenticated using (bucket_id in ('property-brochures','floor-plans','owner-submissions') and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admins update listing media" on storage.objects for update to authenticated using (bucket_id in ('property-images','property-brochures','floor-plans') and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admins delete listing media" on storage.objects for delete to authenticated using (bucket_id in ('property-images','property-brochures','floor-plans','owner-submissions') and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "property owners upload submissions" on storage.objects for insert to anon, authenticated with check (bucket_id = 'owner-submissions' and octet_length(name) < 256);
