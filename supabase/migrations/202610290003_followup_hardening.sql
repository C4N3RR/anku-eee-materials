begin;

-- A single connection can use at most 40 of the portal's 600 upstream reads/minute.
-- Stop at the per-connection gate before incrementing the shared allowance.
create or replace function public.consume_drive_quota(rate_key text) returns boolean
language plpgsql security definer set search_path='' as $$
begin
 if rate_key is null or rate_key !~ '^[a-f0-9]{64}$' then return false; end if;
 delete from public.portal_request_limits where expires_at<now();
 if not public.consume_portal_limit('drive-minute:'||rate_key,40,60) then return false; end if;
 return public.consume_portal_limit('drive-global-minute',600,60);
end;
$$;
revoke all on function public.consume_drive_quota(text) from public,anon,authenticated;
grant execute on function public.consume_drive_quota(text) to service_role;

create or replace function public.valid_portal_id(value jsonb) returns boolean
language sql immutable set search_path='' as $$
 select coalesce(jsonb_typeof(value)='string'
  and (value #>> '{}') ~ '^[A-Za-z0-9_-]{1,100}$'
  and (value #>> '{}') not in('__proto__','constructor','prototype'),false);
$$;
revoke all on function public.valid_portal_id(jsonb) from public,anon,authenticated;

-- Optional links must be strings with an HTTP(S) authority and no embedded credentials.
-- Local image paths are restricted to the portal's asset folders.
create or replace function public.valid_portal_link(value jsonb,allow_local boolean)
returns boolean language plpgsql immutable set search_path='' as $$
declare link text;
begin
 if value is null then return true; end if;
 if jsonb_typeof(value)<>'string' then return false; end if;
 link=value #>> '{}';
 if link='' then return true; end if;
 if length(link)>2048 or link ~ '[[:space:][:cntrl:]]' or position(chr(92) in link)>0 then return false; end if;
 if link ~* '^https?://[^/?#@[:space:]]+([/?#].*)?$' then return true; end if;
 if not allow_local then return false; end if;
 if link ~* '%2e|%2f|%5c' or link ~ '(^|/)\.{1,2}(/|$)' then return false; end if;
 return link ~ '^(\./|/anku-eee-materials/)?(assets|bannerlar)/[^?#]+';
end;
$$;
revoke all on function public.valid_portal_link(jsonb,boolean) from public,anon,authenticated;

create or replace function public.valid_portal_content(value jsonb) returns boolean
language plpgsql immutable set search_path='' as $$
declare k text; item jsonb; entry record; max_items integer; field text;
begin
 if value is null or jsonb_typeof(value)<>'object' or octet_length(value::text)>1500000 then return false; end if;
 foreach k in array array['courses','staff','events','resources','sidebar'] loop
  if value?k then
   if jsonb_typeof(value->k)<>'array' then return false; end if;
   max_items=case when k in('courses','staff') then 500 when k='sidebar' then 100 else 3000 end;
   if jsonb_array_length(value->k)>max_items then return false; end if;
   for item in select * from jsonb_array_elements(value->k) loop
    if jsonb_typeof(item)<>'object' then return false; end if;
    if k='courses' then
     if jsonb_typeof(item->'code') is distinct from 'string'
       or coalesce(item->>'code','') !~ '^[A-Z0-9_-]{2,30}$'
       or coalesce(item->>'year','') not in('1','2','3','4')
       or coalesce(item->>'semester','') not in('guz','bahar') then return false; end if;
     if not public.valid_portal_link(item->'banner',true) then return false; end if;
    elsif not public.valid_portal_id(item->'id') then return false;
    end if;
    if k in('resources','sidebar') and
      (coalesce(item->>'url','')='' or not public.valid_portal_link(item->'url',false)) then return false; end if;
    if k='staff' then
     foreach field in array array['avesisUrl','personalUrl'] loop
      if not public.valid_portal_link(item->field,false) then return false; end if;
     end loop;
     if not public.valid_portal_link(item->'photo',true) then return false; end if;
    end if;
   end loop;
  end if;
 end loop;
 if value?'hiddenDrive' then
  if jsonb_typeof(value->'hiddenDrive')<>'array' then return false; end if;
  if jsonb_array_length(value->'hiddenDrive')>5000 then return false; end if;
  for item in select * from jsonb_array_elements(value->'hiddenDrive') loop
   if not public.valid_portal_id(item) then return false; end if;
  end loop;
 end if;
 if value?'driveEdits' then
  if jsonb_typeof(value->'driveEdits')<>'object' then return false; end if;
  if (select count(*) from jsonb_object_keys(value->'driveEdits'))>5000 then return false; end if;
  for entry in select * from jsonb_each(value->'driveEdits') loop
   if not public.valid_portal_id(to_jsonb(entry.key)) or jsonb_typeof(entry.value)<>'object'
    or jsonb_typeof(entry.value->'name') is distinct from 'string'
    or length(entry.value->>'name')>300 then return false; end if;
   if exists(select 1 from jsonb_object_keys(entry.value) f where f<>'name') then return false; end if;
  end loop;
 end if;
 if value?'general' then
  if jsonb_typeof(value->'general')<>'object' then return false; end if;
  foreach field in array array['name','description','footer'] loop
   if (value->'general')?field and jsonb_typeof(value->'general'->field)<>'string' then return false; end if;
  end loop;
 end if;
 return true;
exception when others then return false;
end;
$$;
revoke all on function public.valid_portal_content(jsonb) from public,anon,authenticated;
commit;
