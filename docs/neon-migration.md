# Neon cutover (from Supabase)

App code now expects **Neon Postgres** + **Auth.js**. Complete these ops steps once Neon credentials are ready.

## 1. Create Neon project

1. Create a project at [console.neon.tech](https://console.neon.tech)
2. Copy the **pooled** connection string → `DATABASE_URL`
3. Copy the **direct** connection string → `DIRECT_URL`
4. Ensure both include `?sslmode=require`

## 2. Point env at Neon (keep Supabase URL for copy)

In `.env` / Vercel:

```bash
# New Neon targets
DATABASE_URL=postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require

# Temporary: old Supabase URL for one-time data copy
SOURCE_DATABASE_URL=postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres

AUTH_SECRET=<openssl rand -base64 32>
ADMIN_EMAILS=wastesolutions80@gmail.com
```

Remove from Vercel / local env:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3. Apply schema + copy data

```bash
npm run db:push
npm run db:copy-from-source
```

## 4. Seed admin password

Supabase Auth passwords do **not** carry over.

```bash
npm run db:admin-password -- wastesolutions80@gmail.com 'choose-a-strong-password'
```

## 5. Deploy + verify

1. Redeploy on Vercel with updated env
2. Smoke test: quote/contact forms, admin sign-in, submissions, invoices
3. Keep Supabase read-only briefly, then delete the project

## Rollback

Restore previous `DATABASE_URL` / Supabase Auth env vars and redeploy the prior git revision.
