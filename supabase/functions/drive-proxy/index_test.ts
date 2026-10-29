import {handler} from './index.ts';
function assert(value: unknown, message: string) { if(!value) throw new Error(message); }
Deno.test('Drive proxy hides credentials and confines reads to the portal tree', async () => {
  const originalFetch = globalThis.fetch;
  const previous = Deno.env.get('GOOGLE_DRIVE_API_KEY');
  const servicePrevious=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),urlPrevious=Deno.env.get('SUPABASE_URL');
  Deno.env.set('SUPABASE_SERVICE_ROLE_KEY','ey.test-service-key');Deno.env.set('SUPABASE_URL','https://project.example');
  Deno.env.set('GOOGLE_DRIVE_API_KEY','test-secret-do-not-publish');
  const requests: string[]=[];
  let failMedia=false;
  globalThis.fetch = ((input: string | URL | Request, init?: RequestInit) => {
    const url=new URL(String(input));if(url.hostname==='project.example')return Promise.resolve(Response.json(true));requests.push(url.href);
    assert(!url.searchParams.has('key'),'Google credentials must not appear in URLs');
    assert(new Headers(init?.headers).get('x-goog-api-key')==='test-secret-do-not-publish','Server credential header missing');
    if(url.searchParams.get('alt')==='media') {
      if(failMedia)throw new Error('Upstream URL could contain test-secret-do-not-publish');
      return Promise.resolve(new Response('%PDF-1.7 test',{headers:{'content-type':'application/pdf'}}));
    }
    const nested=url.searchParams.get('q')?.includes('course-folder-123');
    return Promise.resolve(Response.json({files:nested?[{id:'portal-file-123',name:'Not.pdf',mimeType:'application/pdf'}]:[{id:'course-folder-123',name:'CHM109',mimeType:'application/vnd.google-apps.folder'}]}));
  }) as typeof fetch;
  const base='https://example.test/drive-proxy';
  try {
    assert((await handler(new Request(base+'?q=arbitrary'))).status===400,'Arbitrary queries allowed');
    assert((await handler(new Request(base,{method:'POST'}))).status===405,'Writes allowed');
    assert((await handler(new Request(base,{headers:{Origin:'https://unrelated.test'}}))).status===403,'Unexpected origin allowed');
    assert(requests.length===0,'Invalid request reached Google');
    assert((await handler(new Request(base,{method:'OPTIONS',headers:{Origin:'https://c4n3rr.github.io'}}))).status===204,'Public site preflight failed');
    const trees=await Promise.all([handler(new Request(base)),handler(new Request(base))]);
    assert(requests.length===2,'Concurrent tree calls should share one snapshot build');
    const data=await trees[0].text();await trees[1].body?.cancel();
    assert(data.includes('Not.pdf')&&!data.includes('test-secret'),'Tree response leaked credential or omitted materials');
    const before=requests.length;
    assert((await handler(new Request(base+'?mode=media&file=outside-file-123'))).status===404,'Arbitrary Drive file allowed');
    assert(requests.length===before,'Outside file was fetched upstream');
    const pdf=await handler(new Request(base+'?mode=media&file=portal-file-123'));
    assert(pdf.status===200&&(await pdf.text()).startsWith('%PDF'),'Portal file stream failed');
    assert((await handler(new Request(base+'?mode=media&file=portal-file-123',{headers:{Range:'bytes=1-5,10-20'}}))).status===400,'Invalid range accepted');
    failMedia=true;
    const failed=await handler(new Request(base+'?mode=media&file=portal-file-123'));
    assert(failed.status===502&&!(await failed.text()).includes('test-secret'),'Upstream error leaked credential');
  } finally {
    globalThis.fetch=originalFetch;
    if(servicePrevious===undefined)Deno.env.delete('SUPABASE_SERVICE_ROLE_KEY');else Deno.env.set('SUPABASE_SERVICE_ROLE_KEY',servicePrevious);
    if(urlPrevious===undefined)Deno.env.delete('SUPABASE_URL');else Deno.env.set('SUPABASE_URL',urlPrevious);
    if(previous===undefined)Deno.env.delete('GOOGLE_DRIVE_API_KEY');else Deno.env.set('GOOGLE_DRIVE_API_KEY',previous);
  }
});

Deno.test('Feedback gateway validates requests and derives stable private limits from the gateway IP',async()=>{
 const originalFetch=globalThis.fetch;
 const previousKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),previousUrl=Deno.env.get('SUPABASE_URL');
 Deno.env.set('SUPABASE_SERVICE_ROLE_KEY','ey.test-private-service-key');Deno.env.set('SUPABASE_URL','https://project.example');
 const calls: Array<{payload: Record<string,string>;rate_key:string}>=[];let rateDenied=false;
 globalThis.fetch=((input: string|URL|Request,init?:RequestInit)=>{
  assert(String(input)==='https://project.example/rest/v1/rpc/submit_portal_feedback_secure','Unexpected server destination');
  assert(new Headers(init?.headers).get('apikey')==='ey.test-private-service-key','Private credential missing');
  calls.push(JSON.parse(String(init?.body)));
  return Promise.resolve(rateDenied?Response.json({code:'P0429',message:'internal details'},{status:400}):new Response(null,{status:204}));
 }) as typeof fetch;
 const body={course_code:'CHM109',kind:'not',message:'Kimya dersi için kaynak önerisi.',url:'https://example.com/',name:'',email:''};
 const make=(payload:unknown,extra:Record<string,string>={})=>new Request('https://project.example/functions/v1/drive-proxy?mode=feedback',{method:'POST',headers:{Origin:'https://c4n3rr.github.io','Content-Type':'application/json','cf-connecting-ip':'203.0.113.15',...extra},body:JSON.stringify(payload)});
 try{
  assert((await handler(make({...body,url:'javascript:alert(1)'}))).status===400,'Active URL accepted');
  assert((await handler(make({...body,client_token:'arbitrary-resettable-id'}))).status===400,'Client-controlled rate identity accepted');
  assert((await handler(make(body,{Origin:'https://attacker.example'}))).status===403,'Cross-origin submission accepted');
  assert((await handler(make({...body,message:'x'.repeat(13000)}))).status===413,'Oversized body accepted');
  assert(calls.length===0,'Invalid feedback reached the privileged database');
  const accepted=await handler(make(body,{'x-forwarded-for':'attacker-chosen'}));assert(accepted.status===200,'Valid feedback failed');
  const acceptedText=await accepted.text();assert(!acceptedText.includes('private-service-key'),'Server credential exposed');
  await handler(make(body,{'x-forwarded-for':'different-spoofed-ip'}));
  assert(calls.length===2&&calls[0].rate_key===calls[1].rate_key,'Spoofed forwarded IP bypassed the stable gateway identity');
  assert(/^[a-f0-9]{64}$/.test(calls[0].rate_key)&&!calls[0].rate_key.includes('203.0.113'),'Raw IP stored in rate key');
  rateDenied=true;const denied=await handler(make(body));assert(denied.status===429&&!(await denied.text()).includes('internal details'),'Rate limit or error redaction failed');
 } finally{
  globalThis.fetch=originalFetch;
  if(previousKey===undefined)Deno.env.delete('SUPABASE_SERVICE_ROLE_KEY');else Deno.env.set('SUPABASE_SERVICE_ROLE_KEY',previousKey);
  if(previousUrl===undefined)Deno.env.delete('SUPABASE_URL');else Deno.env.set('SUPABASE_URL',previousUrl);
 }
});
