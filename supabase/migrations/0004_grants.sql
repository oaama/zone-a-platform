-- table privileges for API roles (RLS still governs row access)
grant usage on schema public to anon, authenticated;

grant select on public.courses to anon;
grant select on public.lesson_catalog to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.courses to authenticated;
grant select, insert, update, delete on public.lessons to authenticated;
grant select, insert, update on public.enrollments to authenticated;
grant select, insert, update on public.lesson_progress to authenticated;
