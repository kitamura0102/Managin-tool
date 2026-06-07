# Leadership Notebook

A clean, private web app for team leads to document employee performance observations, coaching notes, PTO/attendance context, and follow-up actions.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Supabase Auth and Postgres

## App Structure

- `app/(private)/page.tsx` - dashboard with Add Note, Weekly Review, recent notes, and follow-ups.
- `app/(private)/employees` - employee roster and employee profile pages.
- `app/(private)/notes/new` - fast note capture with common documentation templates.
- `app/(private)/weekly-review` - Friday habit review with multiple note creation.
- `app/(private)/follow-ups` - upcoming, overdue, and completed follow-up actions.
- `app/(private)/settings` - privacy boundaries and Supabase setup checklist.
- `app/login` - Supabase Auth sign in/sign up.
- `components` - app shell, forms, cards, navigation, and shared UI.
- `lib/supabase` - Supabase browser/server/middleware clients and env checks.
- `supabase/schema.sql` - tables, indexes, triggers, and row-level security.
- `supabase/seed.sql` - optional demo data for one authenticated user.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL editor. It creates:

- `employees`
- `notes`
- `follow_ups`
- `weekly_reviews`

Every table has row-level security enabled. Policies require `auth.uid() = user_id`, and note/follow-up inserts also verify that the related employee belongs to the same signed-in user.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

3. Add your Supabase URL and anon key to `.env.local`.

4. In Supabase SQL editor, run:

   ```text
   supabase/schema.sql
   ```

5. Optional demo data:

   Replace the placeholder UUID in `supabase/seed.sql` with your user ID from Supabase Auth, then run the file in the SQL editor.

6. Verify the app:

   ```bash
   npm run typecheck
   npm run build
   ```

7. Start the app:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.
