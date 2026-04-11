-- * Submissions table, RLS, and storage bucket policies for the submission MVP.
-- * Run in Supabase SQL Editor after linking a project, or via: supabase db push

-- * Submission types: must match SUBMISSION_TYPE_VALUES in the Next.js app.
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  identifier text not null,
  submission_type text not null
    constraint submissions_submission_type_check
      check (submission_type in ('retailer_receipt', 'serial_plate')),
  image_path text not null,
  status text not null default 'pending'
    constraint submissions_status_check
      check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index submissions_user_id_created_at_idx
  on public.submissions (user_id, created_at desc);

create index submissions_status_idx
  on public.submissions (status);

alter table public.submissions enable row level security;

-- * Users read only their own rows.
create policy "submissions_select_own"
  on public.submissions
  for select
  to authenticated
  using (user_id = auth.uid());

-- * Inserts must be for self, start as pending, with allowed submission_type.
create policy "submissions_insert_own_pending"
  on public.submissions
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
    and submission_type in ('retailer_receipt', 'serial_plate')
  );

-- * Optional: allow users to update own rows later (e.g. withdraw); not required for MVP.
-- * No update policy: only service role / admin path can change status for review.

-- * Private bucket for submission images (create if not exists).
insert into storage.buckets (id, name, public)
values ('submission-images', 'submission-images', false)
on conflict (id) do nothing;

-- * Authenticated users upload only under their user id prefix: {uid}/...
create policy "storage_insert_own_prefix"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'submission-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- * Users can read objects in their own folder.
create policy "storage_select_own_prefix"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'submission-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- * Users can update/delete only their own objects (e.g. retry upload).
create policy "storage_update_own_prefix"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'submission-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_delete_own_prefix"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'submission-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
