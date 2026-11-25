-- store email on profiles so admin can find students by email
alter table public.profiles add column if not exists email text not null default '';

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), coalesce(new.email,''));
  return new;
end $$;

-- backfill existing users
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email = '';
