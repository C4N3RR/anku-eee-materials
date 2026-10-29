begin;
-- Bind administration to the verified account ID, not a reusable email address.
alter table public.portal_admins add column if not exists user_id uuid references auth.users(id) on delete cascade;
update public.portal_admins a set user_id=u.id from auth.users u where lower(u.email)=a.email and a.user_id is null;
alter table public.portal_admins alter column user_id set not null;
create unique index if not exists portal_admins_user_id_idx on public.portal_admins(user_id);
create or replace function public.is_portal_admin() returns boolean
language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.portal_admins where user_id=auth.uid());
$$;
revoke all on public.portal_admins from public,anon,authenticated;
alter table public.portal_admins enable row level security;
alter table public.portal_content enable row level security;
alter table public.portal_feedback enable row level security;
revoke all on public.portal_content from public,anon,authenticated;
grant select on public.portal_content to anon,authenticated;
revoke all on public.portal_feedback from public,anon,authenticated;
grant select on public.portal_feedback to authenticated;
grant update(status) on public.portal_feedback to authenticated;

-- Durable limits survive worker restarts and cannot be reset by changing a browser UUID.
create table if not exists public.portal_request_limits (
 bucket text primary key,
 hits integer not null,
 expires_at timestamptz not null
);
create index if not exists portal_request_limits_expiry_idx on public.portal_request_limits(expires_at);
alter table public.portal_request_limits enable row level security;
revoke all on public.portal_request_limits from public,anon,authenticated;
create or replace function public.consume_portal_limit(p_bucket text,p_max integer,p_seconds integer)
returns boolean language plpgsql security definer set search_path='' as $$
declare v_hits integer;
begin
 insert into public.portal_request_limits as l(bucket,hits,expires_at)
 values(p_bucket,1,now()+make_interval(secs=>p_seconds))
 on conflict(bucket) do update set
 hits=case when l.expires_at<=now() then 1 else l.hits+1 end,
 expires_at=case when l.expires_at<=now() then now()+make_interval(secs=>p_seconds) else l.expires_at end
 returning hits into v_hits;
 return v_hits<=p_max;
end;
$$;
revoke all on function public.consume_portal_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_portal_limit(text,integer,integer) to service_role;

create or replace function public.submit_portal_feedback_secure(payload jsonb,rate_key text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if payload is null or rate_key is null or jsonb_typeof(payload)<>'object' or octet_length(payload::text)>12000 or rate_key !~ '^[a-f0-9]{64}$' then
   raise exception 'Geçersiz istek.' using errcode='22023';
 end if;
 if exists(select 1 from jsonb_object_keys(payload) k where k not in('course_code','kind','message','url','name','email')) then
   raise exception 'Geçersiz alan.' using errcode='22023';
 end if;
 if coalesce(payload->>'course_code','') !~ '^[A-Z0-9_-]{2,30}$'
    or coalesce(payload->>'kind','') not in('kitap','not','site','gorus')
    or length(trim(coalesce(payload->>'message',''))) not between 10 and 4000
    or length(coalesce(payload->>'url',''))>2000
    or (coalesce(payload->>'url','')<>'' and (payload->>'url') !~ '^https?://')
    or length(coalesce(payload->>'name',''))>100 or length(coalesce(payload->>'email',''))>254 then
   raise exception 'Form alanlarını kontrol edin.' using errcode='22023';
 end if;
 delete from public.portal_request_limits where expires_at<now();
 if not public.consume_portal_limit('feedback-minute:'||rate_key,3,60)
    or not public.consume_portal_limit('feedback-hour:'||rate_key,30,3600)
    or not public.consume_portal_limit('feedback-global-minute',100,60)
    or not public.consume_portal_limit('feedback-global-day',1000,86400) then
   raise exception 'Çok sık gönderim yapıldı. Lütfen biraz bekleyin.' using errcode='P0429';
 end if;
 insert into public.portal_feedback(course_code,kind,message,url,name,email,client_token)
 values(payload->>'course_code',payload->>'kind',trim(payload->>'message'),coalesce(payload->>'url',''),trim(coalesce(payload->>'name','')),trim(coalesce(payload->>'email','')),gen_random_uuid());
end;
$$;
revoke all on function public.submit_portal_feedback_secure(jsonb,text) from public,anon,authenticated;
grant execute on function public.submit_portal_feedback_secure(jsonb,text) to service_role;

-- Gate uncached Google reads across all Edge instances, not only a single worker.
create or replace function public.consume_drive_quota(rate_key text) returns boolean
language plpgsql security definer set search_path='' as $$
begin
 if rate_key is null or rate_key !~ '^[a-f0-9]{64}$' then return false; end if;
 delete from public.portal_request_limits where expires_at<now();
 return public.consume_portal_limit('drive-minute:'||rate_key,120,60)
    and public.consume_portal_limit('drive-global-minute',120,60);
end;
$$;
revoke all on function public.consume_drive_quota(text) from public,anon,authenticated;
grant execute on function public.consume_drive_quota(text) to service_role;

-- Reject malformed collections and active URL schemes before publishing shared content.
create or replace function public.valid_portal_content(value jsonb) returns boolean
language plpgsql immutable set search_path='' as $$
declare k text; item jsonb; max_items integer;
begin
 if jsonb_typeof(value)<>'object' or octet_length(value::text)>1500000 then return false; end if;
 foreach k in array array['courses','staff','events','resources','sidebar'] loop
  if value?k then
   if jsonb_typeof(value->k)<>'array' then return false; end if;
   max_items=case when k in('courses','staff') then 500 when k='sidebar' then 100 else 3000 end;
   if jsonb_array_length(value->k)>max_items then return false; end if;
   for item in select * from jsonb_array_elements(value->k) loop
    if jsonb_typeof(item)<>'object' then return false; end if;
    if k='courses' then
      if coalesce(item->>'code','') !~ '^[A-Z0-9_-]{2,30}$' or coalesce(item->>'year','') not in('1','2','3','4') or coalesce(item->>'semester','') not in('guz','bahar') then return false; end if;
    elsif coalesce(item->>'id','') !~ '^[A-Za-z0-9_-]{1,100}$' or (item->>'id') in('__proto__','constructor','prototype') then return false;
    end if;
    if k in('resources','sidebar') and coalesce(item->>'url','') !~ '^https?://' then return false; end if;
   end loop;
  end if;
 end loop;
 return true;
exception when others then return false;
end;
$$;
revoke all on function public.valid_portal_content(jsonb) from public,anon,authenticated;
create or replace function public.save_portal_content(new_content jsonb,expected_revision integer)
returns integer language plpgsql security definer set search_path='' as $$
declare next_revision integer;
begin
 if not public.is_portal_admin() then raise exception 'Yönetici girişi gerekli.' using errcode='42501'; end if;
 if new_content is null or not public.valid_portal_content(new_content) then raise exception 'İçerik geçersiz veya çok büyük.' using errcode='22023'; end if;
 update public.portal_content set content=new_content,revision=revision+1,updated_at=now()
 where id=1 and revision=expected_revision returning revision into next_revision;
 if next_revision is null then raise exception 'İçerik başka bir oturumda değişti. Paneli yenileyip tekrar deneyin.' using errcode='40001'; end if;
 return next_revision;
end;
$$;
revoke all on function public.save_portal_content(jsonb,integer) from public,anon;
grant execute on function public.save_portal_content(jsonb,integer) to authenticated;
commit;
