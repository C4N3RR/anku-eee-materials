-- Apply only after the new frontend and Edge feedback handler are live.
revoke all on function public.submit_portal_feedback(text,text,text,text,text,text,uuid) from public,anon,authenticated;
