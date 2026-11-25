-- ZONE A Learning Platform - initial schema (vision doc section 5)
-- 5 tables: profiles, courses, lessons, enrollments, lesson_progress + RLS

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  title_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  thumbnail_url text,
  level text not null default 'beginner' check (level in ('beginner','intermediate','advanced')),
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title_ar text not null,
  title_en text not null default '',
  description text not null default '',
  video_path text,
  duration_minutes integer,
  sort_order integer not null default 0,
  is_preview boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active' check (status in ('active','revoked')),
  granted_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create table public.lesson_progress (
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);

-- helper: is the current user an admin? (security definer avoids RLS recursion)
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$ select exists(select 1 from profiles where id = auth.uid() and role = 'admin') $$;

-- auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

-- profiles: student reads own row, admin reads/updates all
create policy profiles_select on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy profiles_admin_update on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- courses: published courses readable by anyone (even logged out), admin full control
create policy courses_public_read on public.courses
  for select using (is_published or public.is_admin());
create policy courses_admin_all on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

-- lessons: enrolled students + admin; preview lessons for any logged-in user
create policy lessons_read on public.lessons
  for select using (
    public.is_admin()
    or (is_preview and auth.uid() is not null)
    or exists (
      select 1 from public.enrollments e
      where e.course_id = lessons.course_id
        and e.student_id = auth.uid()
        and e.status = 'active'
    )
  );
create policy lessons_admin_all on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

-- enrollments: student reads own, admin manages
create policy enrollments_student_read on public.enrollments
  for select using (student_id = auth.uid() or public.is_admin());
create policy enrollments_admin_all on public.enrollments
  for all using (public.is_admin()) with check (public.is_admin());

-- lesson_progress: student reads/writes own, admin reads all
create policy progress_own on public.lesson_progress
  for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy progress_admin_read on public.lesson_progress
  for select using (public.is_admin());

-- storage buckets: private videos, public thumbnails
insert into storage.buckets (id, name, public)
values ('course-videos', 'course-videos', false),
       ('course-thumbnails', 'course-thumbnails', true)
on conflict (id) do nothing;

-- video files: admin writes; enrolled students (and admin) can read => signed URLs
create policy videos_admin_write on storage.objects
  for all using (bucket_id = 'course-videos' and public.is_admin())
  with check (bucket_id = 'course-videos' and public.is_admin());
create policy videos_enrolled_read on storage.objects
  for select using (
    bucket_id = 'course-videos'
    and (
      public.is_admin()
      or exists (
        select 1 from public.enrollments e
        where e.student_id = auth.uid()
          and e.status = 'active'
          and e.course_id::text = (storage.foldername(name))[1]
      )
    )
  );

-- thumbnails: public read (public bucket), admin writes
create policy thumbnails_admin_write on storage.objects
  for all using (bucket_id = 'course-thumbnails' and public.is_admin())
  with check (bucket_id = 'course-thumbnails' and public.is_admin());
