const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
function setup(){const dom=new JSDOM('<html><body></body></html>',{url:'https://c4n3rr.github.io/anku-eee-materials/',runScripts:'dangerously'});dom.window.eval(fs.readFileSync(path.resolve(__dirname,'../portal-security.js'),'utf8'));return dom;}
test('HTML and JavaScript argument boundaries resist quote, tag and backslash payloads',()=>{
 const dom=setup(),w=dom.window;let captured;w.capture=value=>captured=value;
 for(const payload of ["'); window.pwned=1; //",'\"); window.pwned=1; //','</button><script>window.pwned=1</script>',"a\\\n'\"<>&\u2028"]){
  w.document.body.innerHTML='<button onclick="capture('+w.PortalSecurity.argument(payload)+')">Open</button>';
  w.document.querySelector('button').click();assert.equal(captured,payload);assert.equal(w.pwned,undefined);assert.equal(w.document.querySelectorAll('script').length,0);
 }
 dom.window.close();
});
test('Unsafe links and frame destinations are rejected',()=>{
 const dom=setup(),s=dom.window.PortalSecurity;
 for(const value of ['javascript:alert(1)','\njava\tscript:alert(1)','data:text/html,<script>alert(1)</script>','https://admin:password@attacker.example/'])assert.equal(s.url(value),'#');
 assert.equal(s.image(''),'');assert.equal(s.url('https://example.com/notes'),'https://example.com/notes');
 assert.equal(s.frameUrl('https://attacker.example/'),'about:blank');assert.equal(s.frameUrl('https://drive.google.com/file/d/test/preview'),'https://drive.google.com/file/d/test/preview');
 dom.window.close();
});
test('Published content rejects malformed collections, dangerous schemes, IDs and prototype keys',()=>{
 const dom=setup(),s=dom.window.PortalSecurity,defaults={courses:[],staff:[],resources:[],sidebar:[],events:[],hiddenDrive:[],driveEdits:{},general:{name:'Portal',description:'',footer:''}};
 const source=JSON.parse('{"__proto__":{"polluted":true},"courses":[{"code":"bad code","year":1}],"staff":[{"id":"constructor","name":"Bad"}],"resources":[{"id":"link-1","courseCode":"CHM109","url":"javascript:alert(1)"}],"sidebar":[],"events":[{"id":"event-1","date":"injected","courseCode":"GENEL"}],"driveEdits":{"__proto__":{"name":"Injected"}}}');
 const clean=s.content(source,defaults);assert.equal(clean.courses.length,0);assert.equal(clean.staff.length,0);assert.equal(clean.resources.length,0);assert.equal(clean.events.length,0);assert.equal(Object.keys(clean.driveEdits).length,0);assert.equal({}.polluted,undefined);
 dom.window.close();
});
test('Drive tree fields are bounded and cached JSON corruption is tolerated',()=>{
 const dom=setup(),w=dom.window,s=w.PortalSecurity;
 w.localStorage.setItem('broken','{');assert.equal(s.stored('broken'),null);
 const tree=s.tree([{id:'bad id',name:'No',mimeType:'text/html'},{id:'file-1',name:'A',mimeType:'application/pdf',webViewLink:'javascript:alert(1)'}]);assert.equal(tree.length,1);assert.equal(tree[0].webViewLink,'');
 dom.window.close();
});

test('Every page uses strict script CSP without executable inline handlers or CDN application scripts',()=>{
 for(const file of ['index.html','privacy.html','404.html']){
  const html=fs.readFileSync(path.resolve(__dirname,'../'+file),'utf8');
  assert(!/\bon\w+=["']/.test(html),file+' has executable inline attributes');
  const dom=new JSDOM(html),doc=dom.window.document;
  const csp=doc.querySelector('meta[http-equiv="Content-Security-Policy"]').content;
  const scripts=csp.split(';').find(s=>s.trim().startsWith('script-src'));
  assert(!scripts.includes('unsafe-inline')&&!scripts.includes('unsafe-eval'));
  for(const script of doc.querySelectorAll('script'))if(script.type!=='application/ld+json')assert(script.src&&!/unpkg|cdn.tailwindcss/.test(script.src));
  dom.window.close();
 }
});
