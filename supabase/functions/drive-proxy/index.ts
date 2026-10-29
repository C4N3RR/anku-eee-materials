// Public, read-only access to the portal's materials. The Google key never leaves this function.
const ROOT = '1n9cyf8eSj3OremDKF5BdQIBayaryPofN';
const FOLDER = 'application/vnd.google-apps.folder';
const ORIGIN = 'https://c4n3rr.github.io';
const CACHE_MS = 180000;
type Item = { id: string; name: string; mimeType: string; children?: Item[]; shortcutDetails?: {targetId: string; targetMimeType: string}; [key: string]: unknown };
type Snapshot = { tree: Item[]; files: Set<string>; expires: number };
let snapshot: Snapshot | undefined;
let loading: Promise<Snapshot> | undefined;
let active = 0;
const waiting: Array<() => void> = [];
const limits = new Map<string, {count: number; expires: number}>();
const cors = {'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Methods':'GET, POST, OPTIONS', 'Access-Control-Allow-Headers':'apikey, content-type, range', 'Access-Control-Expose-Headers':'content-length, content-range, accept-ranges', 'Vary':'Origin'};
function json(value: unknown, status = 200, cache = false) {
  return Response.json(value, {status, headers:{...cors,'Cache-Control':cache?'public, max-age=120':'no-store'}});
}
async function google(path: string, params: Record<string,string> = {}, headers: Record<string,string> = {}) {
  const key = Deno.env.get('GOOGLE_DRIVE_API_KEY') || Deno.env.get('Google_Drive_API');
  if (!key) throw new Error('not-configured');
  const url = new URL('https://www.googleapis.com/drive/v3/files' + path);
  for (const [name,value] of Object.entries(params)) url.searchParams.set(name,value);
  if (active >= 4) await new Promise<void>(resolve => waiting.push(resolve));
  else active++;
  try {
    const response = await fetch(url, {headers:{'x-goog-api-key':key,...headers},signal:AbortSignal.timeout(30000),redirect:'error'});
    if (!response.ok) { await response.body?.cancel(); throw new Error('upstream'); }
    return response;
  } finally {const next=waiting.shift();if(next)next();else active--;}
}
async function buildSnapshot(): Promise<Snapshot> {
  const files = new Set<string>();
  const visited = new Set<string>();
  let count = 0;
  async function scan(folder: string, depth: number): Promise<Item[]> {
    if (depth > 4 || visited.has(folder)) return [];
    visited.add(folder);
    const items: Item[] = [];
    let page = '';
    do {
      const response = await google('',{q:"'"+folder+"' in parents and trashed = false",fields:'nextPageToken,files(id,name,mimeType,size,description,webViewLink,shortcutDetails)',orderBy:'folder,name',pageSize:'1000',supportsAllDrives:'true',includeItemsFromAllDrives:'true',...(page?{pageToken:page}:{})});
      const result = await response.json();
      if (!Array.isArray(result.files)) throw new Error('upstream');
      items.push(...result.files);count+=result.files.length;
      if (count > 5000) throw new Error('too-many-files');
      page = result.nextPageToken || '';
    } while(page);
    await Promise.all(items.map(async item => {
      const id = item.shortcutDetails?.targetId || item.id;
      const mime = item.shortcutDetails?.targetMimeType || item.mimeType;
      if (mime === FOLDER) item.children = await scan(id, depth+1);
      else files.add(id);
    }));
    return items;
  }
  return {tree:await scan(ROOT,0),files,expires:Date.now()+CACHE_MS};
}
async function getSnapshot() {
  if (snapshot && snapshot.expires > Date.now()) return snapshot;
  if (!loading) loading=buildSnapshot().then(value => {snapshot=value;return value;}).finally(()=>{loading=undefined;});
  return await loading;
}
function callerAddress(request: Request) {
  // Supabase's public gateway is behind Cloudflare, which sets CF-Connecting-IP.
  // Never trust the first X-Forwarded-For entry: it can be supplied by the caller.
  const value=request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',').at(-1) || 'unknown';
  return value.trim().toLowerCase().slice(0,100);
}
function serviceCredentials() {
  let key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!key){const keys=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');key=Object.values(keys)[0] as string;}
  const url=Deno.env.get('SUPABASE_URL');
  if(!key||!url)throw new Error('not-configured');
  return {key,url};
}
async function rateIdentity(request: Request,key: string,purpose: string) {
  const encoder=new TextEncoder();
  const cryptoKey=await crypto.subtle.importKey('raw',encoder.encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const signature=await crypto.subtle.sign('HMAC',cryptoKey,encoder.encode(purpose+':'+callerAddress(request)));
  return Array.from(new Uint8Array(signature),b=>b.toString(16).padStart(2,'0')).join('');
}
async function serviceRpc(name: string,body: unknown,credentials=serviceCredentials()) {
  return await fetch(credentials.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:credentials.key,'Content-Type':'application/json',...(credentials.key.startsWith('ey')?{Authorization:'Bearer '+credentials.key}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
}
async function submitFeedback(request: Request): Promise<Response> {
  if (request.headers.get('origin') !== ORIGIN) return json({error:'Origin not allowed'},403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({error:'JSON required'},415);
  if (Number(request.headers.get('content-length'))>12000) return json({error:'Request too large'},413);
  let payload: Record<string,string>;
  try {
    const reader=request.body?.getReader();if(!reader)return json({error:'Empty request'},400);
    const chunks: Uint8Array[]=[];let total=0;
    while(true){const part=await reader.read();if(part.done)break;total+=part.value.length;if(total>12000){await reader.cancel();return json({error:'Request too large'},413);}chunks.push(part.value);}
    const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    const input=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    const allowed=['course_code','kind','message','url','name','email'];
    if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!allowed.includes(k)))return json({error:'Geçersiz form.'},400);
    payload={};for(const key of allowed){if(input[key]!==undefined&&typeof input[key]!=='string')return json({error:'Geçersiz form.'},400);payload[key]=(input[key]||'').trim();}
    if(!/^[A-Z0-9_-]{2,30}$/.test(payload.course_code)||!['kitap','not','site','gorus'].includes(payload.kind)||payload.message.length<10||payload.message.length>4000||payload.name.length>100||payload.email.length>254||payload.url.length>2000)return json({error:'Form alanlarını kontrol edin.'},400);
    if(payload.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))return json({error:'E-posta adresini kontrol edin.'},400);
    if(payload.url){const link=new URL(payload.url);if(!['http:','https:'].includes(link.protocol)||link.username||link.password)return json({error:'Geçersiz bağlantı.'},400);payload.url=link.href;}
  } catch { return json({error:'Geçersiz form.'},400); }
  try {
    const credentials=serviceCredentials();
    const rateKey=await rateIdentity(request,credentials.key,'anku-feedback-v1');
    const response=await serviceRpc('submit_portal_feedback_secure',{payload,rate_key:rateKey},credentials);
    if(!response.ok){const error=await response.json().catch(()=>({}));if(error.code==='P0429')return json({error:'Çok sık gönderim yapıldı. Lütfen biraz bekleyin.'},429);return json({error:'Mesaj kaydedilemedi. Lütfen tekrar deneyin.'},502);}
    await response.body?.cancel();return json({ok:true});
  } catch {return json({error:'Mesaj kaydedilemedi. Lütfen tekrar deneyin.'},502);}
}
export async function handler(request: Request): Promise<Response> {
  if (request.headers.get('origin') && request.headers.get('origin') !== ORIGIN) return json({error:'Origin not allowed'},403);
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:cors});
  const initial=new URL(request.url);
  if(initial.searchParams.get('mode')==='feedback'){
    if(request.method!=='POST')return json({error:'Method not allowed'},405);
    if([...initial.searchParams.keys()].some(k=>k!=='mode'))return json({error:'Invalid parameters'},400);
    return await submitFeedback(request);
  }
  if (request.method !== 'GET') return json({error:'Method not allowed'},405);
  const ip=callerAddress(request);
  const now=Date.now();
  if(limits.size>=5000){for(const [key,value] of limits)if(value.expires<now)limits.delete(key);if(limits.size>=5000&&!limits.has(ip))return json({error:'Lütfen biraz bekleyin.'},429);}
  const bucket=limits.get(ip);
  if(bucket && bucket.expires>now){if(++bucket.count>120)return json({error:'Lütfen biraz bekleyip tekrar deneyin.'},429);}
  else limits.set(ip,{count:1,expires:now+60000});
  const url=new URL(request.url);
  const mode=url.searchParams.get('mode')||'tree';
  if (![...url.searchParams.keys()].every(k=>k==='mode'||k==='file')) return json({error:'Invalid parameters'},400);
  if (mode!=='tree'&&mode!=='media')return json({error:'Invalid operation'},400);
  const id=url.searchParams.get('file')||'';
  if(mode==='media'&&!/^[A-Za-z0-9_-]{10,200}$/.test(id))return json({error:'Invalid file'},400);
  if(mode==='tree'&&id)return json({error:'Invalid parameters'},400);
  try {
    if(mode==='media'||!snapshot||snapshot.expires<=Date.now()){
      const credentials=serviceCredentials();
      const rateKey=await rateIdentity(request,credentials.key,'anku-drive-v1');
      const quota=await serviceRpc('consume_drive_quota',{rate_key:rateKey},credentials);
      if(!quota.ok)return json({error:'Dosya bağlantısı şu anda kullanılamıyor.'},503);
      if(await quota.json()!==true)return json({error:'Çok sık dosya isteği gönderildi. Lütfen biraz bekleyin.'},429);
    }
    const current=await getSnapshot();
    if(mode==='tree')return json({tree:current.tree},200,true);
    if(!current.files.has(id))return json({error:'File is not part of this portal'},404);
    const range=request.headers.get('range');
    if(range&&!/^bytes=\d+-\d*$/.test(range))return json({error:'Invalid range'},400);
    const upstream=await google('/'+encodeURIComponent(id),{alt:'media',supportsAllDrives:'true'},range?{Range:range}:{});
    const headers: Record<string,string>={...cors,'Cache-Control':'private, max-age=300','X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'"};
    for(const name of ['content-type','content-length','content-range','accept-ranges']){const value=upstream.headers.get(name);if(value)headers[name]=value;}
    if(!['application/pdf','text/plain'].includes((headers['content-type']||'').split(';')[0]))headers['Content-Disposition']='attachment';
    return new Response(upstream.body,{status:upstream.status,headers});
  } catch(error) {
    // Do not return or log upstream URLs, headers, or credentials.
    return json({error:error instanceof Error&&error.message==='not-configured'?'Drive bağlantısı henüz yapılandırılmadı.':'Drive materyalleri şu anda alınamıyor. Lütfen tekrar deneyin.'},502);
  }
}
if (import.meta.main) Deno.serve(handler);
