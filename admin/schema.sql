-- ANKU EEE Portal: public content, private feedback, server-enforced administration.
create table if not exists public.portal_admins (
  email text primary key check (email = lower(email))
);
alter table public.portal_admins enable row level security;
revoke all on public.portal_admins from anon, authenticated;

create or replace function public.is_portal_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from public.portal_admins where email = lower(auth.jwt() ->> 'email')
  );
$$;
revoke all on function public.is_portal_admin() from public;
grant execute on function public.is_portal_admin() to anon, authenticated;

create table if not exists public.portal_content (
  id integer primary key check (id = 1),
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  revision integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.portal_content enable row level security;
create policy "Anyone can read published content" on public.portal_content for select to anon, authenticated using (true);
grant select on public.portal_content to anon, authenticated;
revoke insert, update, delete on public.portal_content from anon, authenticated;
insert into public.portal_content (id) values (1) on conflict do nothing;

create or replace function public.save_portal_content(new_content jsonb, expected_revision integer)
returns integer language plpgsql security definer set search_path = '' as $$
declare next_revision integer;
begin
  if not public.is_portal_admin() then raise exception 'Yönetici girişi gerekli.' using errcode = '42501'; end if;
  if jsonb_typeof(new_content) <> 'object' or octet_length(new_content::text) > 1500000 then
    raise exception 'İçerik geçersiz veya çok büyük.';
  end if;
  update public.portal_content set content = new_content, revision = revision + 1, updated_at = now()
    where id = 1 and revision = expected_revision returning revision into next_revision;
  if next_revision is null then raise exception 'İçerik başka bir oturumda değişti. Paneli yenileyip tekrar deneyin.' using errcode = '40001'; end if;
  return next_revision;
end;
$$;
revoke all on function public.save_portal_content(jsonb, integer) from public;
grant execute on function public.save_portal_content(jsonb, integer) to authenticated;

create table if not exists public.portal_feedback (
  id uuid primary key default gen_random_uuid(),
  course_code text not null default '' check (length(course_code) <= 40),
  kind text not null check (kind in ('kitap','not','site','gorus')),
  message text not null check (length(message) between 10 and 4000),
  url text not null default '' check (length(url) <= 2000 and (url = '' or url ~ '^https?://')),
  name text not null default '' check (length(name) <= 100),
  email text not null default '' check (length(email) <= 254),
  status text not null default 'yeni' check (status in ('yeni','inceleniyor','tamamlandi','arsiv')),
  client_token uuid not null,
  created_at timestamptz not null default now()
);
create index on public.portal_feedback (client_token, created_at);
alter table public.portal_feedback enable row level security;
create policy "Only administrators read suggestions" on public.portal_feedback for select to authenticated using (public.is_portal_admin());
create policy "Only administrators update suggestions" on public.portal_feedback for update to authenticated using (public.is_portal_admin()) with check (public.is_portal_admin());
revoke all on public.portal_feedback from authenticated;
grant select on public.portal_feedback to authenticated;
grant update (status) on public.portal_feedback to authenticated;
revoke all on public.portal_feedback from anon;
revoke insert, delete on public.portal_feedback from authenticated;

create or replace function public.submit_portal_feedback(
  course_code text, kind text, message text, url text, name text, email text, client_token uuid
) returns void language plpgsql security definer set search_path = '' as $$
begin
  if client_token is null then raise exception 'İstek kimliği gerekli.'; end if;
  perform pg_advisory_xact_lock(hashtextextended(client_token::text, 0));
  if exists (select 1 from public.portal_feedback f where f.client_token = submit_portal_feedback.client_token and f.created_at > now() - interval '1 minute')
    or (select count(*) from public.portal_feedback f where f.client_token = submit_portal_feedback.client_token and f.created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Çok sık gönderim yapıldı. Lütfen biraz bekleyin.';
  end if;
  insert into public.portal_feedback (course_code, kind, message, url, name, email, client_token)
  values (trim(course_code), kind, trim(message), trim(url), trim(name), trim(email), client_token);
end;
$$;
revoke all on function public.submit_portal_feedback(text,text,text,text,text,text,uuid) from public;
grant execute on function public.submit_portal_feedback(text,text,text,text,text,text,uuid) to anon, authenticated;
