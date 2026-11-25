-- quizzes per lesson + attempts
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  question text not null,
  options jsonb not null default '[]',
  correct_index integer not null default 0,
  sort_order integer not null default 0
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  score integer not null,
  total integer not null,
  created_at timestamptz not null default now()
);

alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;

-- questions: readable when the lesson itself is readable (enrolled, admin, or preview+logged in)
create policy quiz_questions_read on public.quiz_questions
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.lessons l
      where l.id = lesson_id
        and (
          (l.is_preview and auth.uid() is not null)
          or exists (
            select 1 from public.enrollments e
            where e.course_id = l.course_id and e.student_id = auth.uid() and e.status = 'active'
          )
        )
    )
  );
create policy quiz_questions_admin_all on public.quiz_questions
  for all using (public.is_admin()) with check (public.is_admin());

create policy quiz_attempts_own on public.quiz_attempts
  for select using (student_id = auth.uid() or public.is_admin());
create policy quiz_attempts_insert on public.quiz_attempts
  for insert with check (student_id = auth.uid());

grant select, insert, update, delete on public.quiz_questions to authenticated;
grant select, insert on public.quiz_attempts to authenticated;
