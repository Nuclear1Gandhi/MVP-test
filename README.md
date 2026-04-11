# Submission MVP (Next.js + Supabase + Vercel)

Focused **Phase 1** slice: sign in, upload an image, submit identifier + type, persist as **`pending`** in Postgres with **RLS**, optional **admin** queue with signed previews.

## Stack choices

| Piece | Role |
|--------|------|
| **Next.js (App Router)** | UI, Server Actions, middleware for session refresh and route guards |
| **Supabase Auth** | Email + password (magic-link-ready via `/auth/callback`) |
| **Supabase Storage** | Private `submission-images` bucket; paths scoped per user |
| **Supabase Postgres** | `submissions` table; RLS for user-owned rows |
| **Vercel** | Deployment; env vars for publishable + server-only secret API key |

**Intentionally omitted** for this test task: search, points, full account settings, heavy design systems, Prisma/extra ORM, background jobs, separate Express API.

**Scales toward full MVP** by adding admin `UPDATE` on `status`, indexes for search, a `points` column or ledger table, and richer dashboards—without changing the core upload → pending row pattern.

## Prerequisites

- Node 20+
- A [Supabase](https://supabase.com) project

## Supabase setup

1. In the SQL editor, run the migration in [`supabase/migrations/20260411000000_submissions_and_storage.sql`](supabase/migrations/20260411000000_submissions_and_storage.sql) (or use the Supabase CLI: `supabase db push` if you link the project).

2. Confirm a Storage bucket **`submission-images`** exists (the migration inserts it) and policies match your project.

3. Under **Authentication → URL configuration**, add your local and production site URL (e.g. `http://localhost:3000`, `https://your-app.vercel.app`) and set **Redirect URLs** to include `{origin}/auth/callback`.

## Local development

```bash
cp .env.local.example .env.local
# Fill NEXT_PUBLIC_* (publishable key) and optional ADMIN_EMAILS + SUPABASE_SECRET_KEY
npm install
npm run dev
```

- **`ADMIN_EMAILS`**: comma-separated list; those users see **Admin** in the nav and can open `/admin`.
- **`SUPABASE_SECRET_KEY`** (recommended; `sb_secret_...`) or legacy **`SUPABASE_SERVICE_ROLE_KEY`**: server-only; required for the admin pending list and signed image URLs. Never expose to the client or commit it. See [Supabase API keys](https://supabase.com/docs/guides/api/api-keys).
- **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`** (recommended) or legacy **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: used by all browser and server Supabase clients in this app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (needs `NEXT_PUBLIC_SUPABASE_*` set) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Vercel

1. Import the repo and set the same environment variables as in `.env.local.example`.
2. Add production **Redirect URLs** in Supabase for `https://<your-deployment>.vercel.app/auth/callback`.
3. Redeploy after changing env vars.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing; redirects signed-in users to `/submit` |
| `/login` | Sign in / sign up |
| `/submit` | Submission form (protected) |
| `/submit/success` | Confirmation (protected) |
| `/admin` | Pending submissions for allowlisted emails (protected) |
| `POST /auth/signout` | Sign out |

## Data model

`submissions`: `id`, `user_id`, `identifier`, `submission_type` (`retailer_receipt` \| `serial_plate`), `image_path`, `status` (default `pending`), `created_at`.

Submission types and validation live in [`src/lib/constants.ts`](src/lib/constants.ts) and must stay aligned with the SQL `CHECK` constraints.

## License

Private / test task — use per your agreement with the client.
