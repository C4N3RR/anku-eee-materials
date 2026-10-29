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
const cors = {'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Methods':'GET, OPTIONS', 'Access-Control-Allow-Headers':'apikey, content-type, range', 'Access-Control-Expose-Headers':'content-length, content-range, accept-ranges', 'Vary':'Origin'};
function json(value: unknown, status = 200, cache = false) {
  return Response.json(value, {status, headers:{...cors,'Cache-Control':cache?'public, max-age=120':'no-store'}});
}
async function google(path: string, params: Record<string,string> = {}, headers: Record<string,string> = {}) {
  const key = Deno.env.get('GOOGLE_DRIVE_API_KEY') || Deno.env.get('Google_Drive_API');
  if (!key) throw new Error('not-configured');
  const url = new URL('https://www.googleapis.com/drive/v3/files' + path);
  for (const [name,value] of Object.entries(params)) url.searchParams.set(name,value);
  if (active >= 4) await new Promise<void>(resolve => waiting.push(resolve));
  active++;
  try {
    const response = await fetch(url, {headers:{'x-goog-api-key':key,...headers},signal:AbortSignal.timeout(30000),redirect:'error'});
    if (!response.ok) { await response.body?.cancel(); throw new Error('upstream'); }
    return response;
  } finally {active--;waiting.shift()?.();}
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
export async function handler(request: Request): Promise<Response> {
  if (request.headers.get('origin') && request.headers.get('origin') !== ORIGIN) return json({error:'Origin not allowed'},403);
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:cors});
  if (request.method !== 'GET') return json({error:'Method not allowed'},405);
  const ip=request.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown';
  const now=Date.now();
  if(limits.size>5000) for(const [key,value] of limits) if(value.expires<now)limits.delete(key);
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
    const current=await getSnapshot();
    if(mode==='tree')return json({tree:current.tree},200,true);
    if(!current.files.has(id))return json({error:'File is not part of this portal'},404);
    const range=request.headers.get('range');
    if(range&&!/^bytes=\d+-\d*$/.test(range))return json({error:'Invalid range'},400);
    const upstream=await google('/'+encodeURIComponent(id),{alt:'media',supportsAllDrives:'true'},range?{Range:range}:{});
    const headers: Record<string,string>={...cors,'Cache-Control':'private, max-age=300','X-Content-Type-Options':'nosniff'};
    for(const name of ['content-type','content-length','content-range','accept-ranges']){const value=upstream.headers.get(name);if(value)headers[name]=value;}
    return new Response(upstream.body,{status:upstream.status,headers});
  } catch(error) {
    // Do not return or log upstream URLs, headers, or credentials.
    return json({error:error instanceof Error&&error.message==='not-configured'?'Drive bağlantısı henüz yapılandırılmadı.':'Drive materyalleri şu anda alınamıyor. Lütfen tekrar deneyin.'},502);
  }
}
if (import.meta.main) Deno.serve(handler);
