create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default '',
  team text not null default '',
  start_date date,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  note_date date not null default current_date,
  category text not null check (
    category in (
      'Performance',
      'Attendance / PTO',
      'Communication',
      'Quality',
      'Ownership',
      'Coaching',
      'Positive Feedback',
      'Follow-up'
    )
  ),
  observation text not null,
  expected_behavior text,
  impact text,
  feedback_given text,
  employee_response text,
  next_step text,
  follow_up_date date,
  severity text not null default 'Low' check (severity in ('Low', 'Medium', 'High')),
  visibility text not null default 'Private note' check (visibility in ('Private note', 'Manager-ready summary')),
  is_1on1_talking_point boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  note_id uuid references public.notes(id) on delete cascade,
  follow_up_date date not null,
  next_step text not null,
  status text not null default 'Open' check (status in ('Open', 'Done')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  review_week_start date not null,
  review_week_end date not null,
  team_impact_notes text,
  feedback_given text,
  expectation_acknowledged text,
  repeated_patterns text,
  next_week_priorities text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists employees_user_id_idx on public.employees(user_id);
create index if not exists employees_status_idx on public.employees(status);
create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_employee_id_idx on public.notes(employee_id);
create index if not exists notes_note_date_idx on public.notes(note_date desc);
create index if not exists notes_category_idx on public.notes(category);
create index if not exists follow_ups_user_id_idx on public.follow_ups(user_id);
create index if not exists follow_ups_due_idx on public.follow_ups(follow_up_date, status);
create index if not exists weekly_reviews_user_id_idx on public.weekly_reviews(user_id);
create index if not exists weekly_reviews_week_idx on public.weekly_reviews(review_week_start desc);

drop trigger if exists set_employees_updated_at on public.employees;
create trigger set_employees_updated_at
before update on public.employees
for each row execute function public.set_updated_at();

drop trigger if exists set_notes_updated_at on public.notes;
create trigger set_notes_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

drop trigger if exists set_follow_ups_updated_at on public.follow_ups;
create trigger set_follow_ups_updated_at
before update on public.follow_ups
for each row execute function public.set_updated_at();

drop trigger if exists set_weekly_reviews_updated_at on public.weekly_reviews;
create trigger set_weekly_reviews_updated_at
before update on public.weekly_reviews
for each row execute function public.set_updated_at();

alter table public.employees enable row level security;
alter table public.notes enable row level security;
alter table public.follow_ups enable row level security;
alter table public.weekly_reviews enable row level security;

drop policy if exists "Users can manage their own employees" on public.employees;
create policy "Users can manage their own employees"
on public.employees
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their own notes" on public.notes;
create policy "Users can manage their own notes"
on public.notes
for all
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.employees
    where employees.id = notes.employee_id
      and employees.user_id = auth.uid()
  )
);

drop policy if exists "Users can manage their own follow ups" on public.follow_ups;
create policy "Users can manage their own follow ups"
on public.follow_ups
for all
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.employees
    where employees.id = follow_ups.employee_id
      and employees.user_id = auth.uid()
  )
);

drop policy if exists "Users can manage their own weekly reviews" on public.weekly_reviews;
create policy "Users can manage their own weekly reviews"
on public.weekly_reviews
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
