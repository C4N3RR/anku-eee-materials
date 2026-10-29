import {handler} from './index.ts';
function assert(value: unknown, message: string) { if(!value) throw new Error(message); }
Deno.test('Drive proxy hides credentials and confines reads to the portal tree', async () => {
  const originalFetch = globalThis.fetch;
  const previous = Deno.env.get('GOOGLE_DRIVE_API_KEY');
  Deno.env.set('GOOGLE_DRIVE_API_KEY','test-secret-do-not-publish');
  const requests: string[]=[];
  let failMedia=false;
  globalThis.fetch = ((input: string | URL | Request, init?: RequestInit) => {
    const url=new URL(String(input));requests.push(url.href);
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
    if(previous===undefined)Deno.env.delete('GOOGLE_DRIVE_API_KEY');else Deno.env.set('GOOGLE_DRIVE_API_KEY',previous);
  }
});
