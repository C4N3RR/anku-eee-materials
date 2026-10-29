const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('Failed navigations preserve successful offline pages; activation preserves other projects caches',async()=>{
 const events={},saved=[],deleted=[];
 const request={method:'GET',mode:'navigate',url:'https://c4n3rr.github.io/anku-eee-materials/',headers:new Headers()};
 let offline=false;
 const good=new Response('<h1>Saved portal</h1>');
 const context={URL,Promise,self:{location:{origin:'https://c4n3rr.github.io'},addEventListener:(type,handler)=>{events[type]=handler;},clients:{claim:async()=>{}},skipWaiting(){}},
  caches:{open:async()=>({put:async(req,response)=>saved.push(await response.text())}),match:async()=>good.clone(),keys:async()=>['anku-eee-shell-v1','other-project-shell-v1'],delete:async name=>deleted.push(name)},
  fetch:async(request,options)=>{assert.equal(options?.cache,'no-cache','Navigation must revalidate the browser HTTP cache');if(offline)throw new Error('Offline');return new Response('Temporary outage',{status:503});}};
 vm.runInNewContext(fs.readFileSync(require('node:path').resolve(__dirname,'../sw.js'),'utf8'),context);
 let response;events.fetch({request,respondWith(value){response=value;}});
 assert.equal((await response).status,503);await new Promise(r=>setImmediate(r));assert.deepEqual(saved,[]);
 offline=true;events.fetch({request,respondWith(value){response=value;}});assert.match(await(await response).text(),/Saved portal/);
 let activated;events.activate({waitUntil(value){activated=value;}});await activated;
 assert.deepEqual(deleted,['anku-eee-shell-v1']);
});
