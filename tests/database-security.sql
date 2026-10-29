-- Read-only assertions plus transactionally rolled-back functional tests. No test messages remain.
begin;
do $$
declare uid uuid; rev integer; payload jsonb; n integer; owner_email text;
begin
 assert (select bool_and(relrowsecurity) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname in('portal_admins','portal_content','portal_feedback','portal_request_limits')),'RLS missing';
 assert not has_table_privilege('anon','public.portal_content','TRUNCATE'),'Unnecessary truncate privilege';
 assert not has_function_privilege('anon','public.save_portal_content(jsonb,integer)','EXECUTE'),'Public publish permission';
 assert not has_function_privilege('anon','public.submit_portal_feedback_secure(jsonb,text)','EXECUTE'),'Public secure RPC permission';
 assert not has_function_privilege('authenticated','public.submit_portal_feedback_secure(jsonb,text)','EXECUTE'),'User can bypass feedback gateway';
 assert has_function_privilege('service_role','public.submit_portal_feedback_secure(jsonb,text)','EXECUTE'),'Gateway RPC permission missing';
 select user_id,email into uid,owner_email from public.portal_admins limit 1;
 assert uid is not null,'No administrator bound';
 assert public.valid_portal_content('{"staff":[{"id":"staff-1","photo":"assets/staff/photo.jpg","avesisUrl":"https://example.com/profile","personalUrl":""}],"hiddenDrive":["file-1"],"driveEdits":{"file-1":{"name":"Note"}}}'),'Valid asset fields rejected';
 assert not public.valid_portal_content('{"staff":[{"id":"staff-1","avesisUrl":"javascript:alert(1)"}]}'),'Unsafe staff link accepted';
 assert not public.valid_portal_content('{"staff":[{"id":"staff-1","photo":{"url":"https://example.com/"}}]}'),'Non-string photo accepted';
 assert not public.valid_portal_content('{"courses":[{"code":"TST101","year":1,"semester":"guz","banner":"data:text/html,bad"}]}'),'Unsafe banner accepted';
 assert not public.valid_portal_content('{"hiddenDrive":"file-1"}'),'Non-array hiddenDrive accepted';
 assert not public.valid_portal_content('{"hiddenDrive":["__proto__"]}'),'Invalid hidden ID accepted';
 assert not public.valid_portal_content('{"driveEdits":[]}'),'Non-object driveEdits accepted';
 assert not public.valid_portal_content('{"driveEdits":{"file-1":{"name":17}}}'),'Invalid Drive edit name accepted';
 assert not public.valid_portal_link('"https://user:secret@example.com/file"',false),'Embedded URL credentials accepted';
 assert not public.valid_portal_link('"assets/../../other-repo/photo.jpg"',true),'Local asset traversal accepted';
 -- These counter writes are isolated to this transaction and rolled back below.
 delete from public.portal_request_limits where bucket='drive-global-minute' or bucket in('drive-minute:'||repeat('b',64),'drive-minute:'||repeat('c',64));
 for n in 1..40 loop assert public.consume_drive_quota(repeat('b',64)),'Drive allowance too small';end loop;
 for n in 1..10 loop assert not public.consume_drive_quota(repeat('b',64)),'Drive per-connection limit bypass';end loop;
 assert (select hits from public.portal_request_limits where bucket='drive-global-minute')=40,'Denied connection consumed global quota';
 assert public.consume_drive_quota(repeat('c',64)),'One connection exhausted allowance for everyone';
 perform set_config('request.jwt.claims',jsonb_build_object('sub',uid,'email','unrelated@example.test','role','authenticated')::text,true);
 assert public.is_portal_admin(),'Administrator UID binding failed';
 select revision into rev from public.portal_content where id=1;
 perform public.save_portal_content('{"events":[]}'::jsonb,rev);
 begin perform public.save_portal_content('{}',rev);raise exception 'Conflict bypass';exception when serialization_failure then null;end;
 begin perform public.save_portal_content('{"resources":[{"id":"link-1","url":"javascript:alert(1)"}]}',rev+1);raise exception 'Unsafe URL accepted';exception when invalid_parameter_value then null;end;
 perform set_config('request.jwt.claims',jsonb_build_object('sub','53e70ca2-384d-466b-a646-ab41b04e8f55','email',owner_email,'role','authenticated')::text,true);
 assert not public.is_portal_admin(),'Email-only privilege escalation';
 begin perform public.save_portal_content('{}',rev+1);raise exception 'Non-admin write';exception when insufficient_privilege then null;end;
 payload='{"course_code":"GENEL","kind":"gorus","message":"Rollback security test message","url":"","name":"","email":""}';
 for n in 1..3 loop perform public.submit_portal_feedback_secure(payload,repeat('a',64));end loop;
 begin perform public.submit_portal_feedback_secure(payload,repeat('a',64));raise exception 'Rate limit bypass';exception when sqlstate 'P0429' then null;end;
 assert (select count(*) from public.portal_feedback where message='Rollback security test message')=3,'Feedback insert test failed';
end;
$$;
set local role authenticated;
do $$ begin
 assert (select count(*) from public.portal_feedback)=0,'Ordinary user can read private feedback';
end; $$;
set local role anon;
do $$ begin
 begin perform * from public.portal_admins;raise exception 'Anonymous admin read';exception when insufficient_privilege then null;end;
 begin perform * from public.portal_feedback;raise exception 'Anonymous feedback read';exception when insufficient_privilege then null;end;
end; $$;
rollback;
