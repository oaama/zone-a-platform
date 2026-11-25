-- 0006: theory lesson content, lesson materials, social links

-- theory text + material file per lesson
alter table public.lessons add column if not exists content_ar text not null default '';
alter table public.lessons add column if not exists content_en text not null default '';
alter table public.lessons add column if not exists material_path text;

-- materials bucket: private, admin writes, enrolled students read (same rule as course-videos)
insert into storage.buckets (id, name, public)
values ('course-materials', 'course-materials', false)
on conflict (id) do nothing;

create policy materials_admin_write on storage.objects
  for all using (bucket_id = 'course-materials' and public.is_admin())
  with check (bucket_id = 'course-materials' and public.is_admin());

create policy materials_enrolled_read on storage.objects
  for select using (
    bucket_id = 'course-materials'
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

-- social links managed from the admin dashboard, rendered in the footer
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.social_links enable row level security;

create policy social_links_public_read on public.social_links
  for select using (true);

create policy social_links_admin_all on public.social_links
  for all using (public.is_admin()) with check (public.is_admin());

grant select on public.social_links to anon, authenticated;
grant insert, update, delete on public.social_links to authenticated;

-- first link: the academy's WhatsApp
insert into public.social_links (platform, url, sort_order)
select 'whatsapp', 'https://wa.me/201202412997', 0
where not exists (select 1 from public.social_links);
