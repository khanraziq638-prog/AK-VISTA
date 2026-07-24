# AK Vista

AK Vista is a premium real-estate consultancy and multiple-property listing website for Nashik, Maharashtra. It provides a public property catalogue, owner property submissions with review, and a protected admin dashboard for publishing and managing listings.

## Technology stack

- Vite, React, and TypeScript
- React Router
- Supabase: Auth, PostgreSQL database, Storage, and Row Level Security
- Lucide React and Framer Motion
- Custom responsive CSS

## Run locally

### Prerequisites

- Node.js 20 or newer
- npm or pnpm
- A Supabase project

### Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Open the Vite URL shown in the terminal. To create a production bundle:

```bash
npm run build
```

## Environment variables

Create `.env` from `.env.example` and provide only publishable frontend values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key
VITE_GA_ID=
```

Never commit `.env`, a Supabase `service_role` key, passwords, or other private credentials.

## Supabase setup

1. Create or select a Supabase project.
2. Run [supabase/migrations/20260724000100_initial_schema.sql](supabase/migrations/20260724000100_initial_schema.sql) in the Supabase SQL Editor.
3. Add the project URL and publishable key to `.env`.
4. The migration creates `properties`, `leads`, and `property_owner_submissions`, plus secure Storage buckets for images and documents.
5. Row Level Security allows the public to read only published listings and submit enquiries/property requests. Only admins can manage listings and leads.

## Admin dashboard

1. Create an email/password user in **Supabase Authentication → Users**.
2. Assign the immutable admin claim in the Supabase SQL Editor:

```sql
update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'your-admin-email@example.com';
```

3. Sign out and sign in again so the browser receives the refreshed JWT claim.
4. Visit `/admin/login` and sign in. Admins can add, edit, publish, unpublish, delete, and upload photos for properties.

Public owner submissions remain pending until reviewed by an AK Vista administrator.

## Deploy to Hostinger

1. Run `npm run build`.
2. Upload the contents of `dist/` to the domain’s `public_html` folder.
3. Configure an SPA fallback so unknown URLs serve `index.html` (required for routes such as `/properties` and `/admin/login`).
4. Build with the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values; do not upload `.env` to source control.
5. In Supabase Authentication, add the production domain to the allowed redirect URLs if needed.

## Update GitHub

```bash
git status
git add .
git commit -m "Describe the change"
git push origin main
```

Before committing, confirm `.env`, `node_modules`, `dist`, caches, temporary files, and private credentials remain excluded by `.gitignore`.
