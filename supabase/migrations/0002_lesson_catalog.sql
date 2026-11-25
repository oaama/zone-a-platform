-- Public lesson catalog (no video_path) for course pages, published courses only
create or replace view public.lesson_catalog as
select l.id, l.course_id, l.title_ar, l.title_en, l.description,
       l.duration_minutes, l.sort_order, l.is_preview
from public.lessons l
join public.courses c on c.id = l.course_id
where c.is_published
order by l.sort_order;

grant select on public.lesson_catalog to anon, authenticated;
