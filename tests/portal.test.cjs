const {JSDOM}=require('jsdom'),fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'..');const html=fs.readFileSync(root+'/index.html','utf8');
const dom=new JSDOM(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''),{url:'https://c4n3rr.github.io/anku-eee-materials/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,ctx=dom.getInternalVMContext();
w.Blob=Blob;w.tailwind={};w.matchMedia=()=>({matches:false,addEventListener(){}});w.scrollTo=()=>{};w.lucide={createIcons(){}};w.AbortSignal=AbortSignal;w.structuredClone=structuredClone;
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
let content={},revision=0,feedback=[],failPublish=false,pendingFeedback=null,delayFeedback=false;const writes=[],passwordWrites=[];let infoReads=0;
w.fetch=async(url,opt={})=>{let data={},code=200;const body=opt.body?JSON.parse(opt.body):{};const auth=opt.headers?.Authorization;
 if(url.includes('mode=media')){infoReads++;data={};}
 else if(url.includes('mode=feedback')){feedback.push({...body,id:'fb-1',created_at:new Date().toISOString(),status:'yeni'});data={ok:true};}
 else if(url.includes('/functions/v1/drive-proxy'))data={tree:[{id:'drive-course',name:'CHM109',mimeType:'application/vnd.google-apps.folder',children:[{id:'note-1',name:'Orijinal not.pdf',mimeType:'application/pdf',size:'123'}]}]};
 else if(url.includes('googleapis.com'))data={files:new URL(url).searchParams.get('q').includes("'drive-course'")?[{id:'note-1',name:'Orijinal not.pdf',mimeType:'application/pdf',size:'123'}]:[{id:'drive-course',name:'CHM109',mimeType:'application/vnd.google-apps.folder'}]};
 else if(url.includes('/portal_content?'))data=[{content,revision}];
 else if(url.includes('token?'))data={access_token:'test-session',refresh_token:'test-refresh',expires_in:3600,user:{email:'admin@example.test'}};
 else if(url.includes('is_portal_admin'))data=auth==='Bearer test-session';
 else if(url.includes('save_portal_content')){if(failPublish){code=409;data={message:'Çakışma'};}else{assert.equal(auth,'Bearer test-session');assert.equal(body.expected_revision,revision);content=body.new_content;revision++;data=revision;writes.push(body);}}
 else if(url.includes('submit_portal_feedback')){feedback.push({...body,id:'fb-1',created_at:new Date().toISOString(),status:'yeni'});data=null;}
 else if(url.includes('/portal_feedback?')){if(delayFeedback)await new Promise(resolve=>{pendingFeedback=resolve;});data=feedback;}
 else if(url.includes('/auth/v1/user')){passwordWrites.push(body);data={email:'admin@example.test'};}
 return {ok:code<400,status:code,json:async()=>data,text:async()=>JSON.stringify(data)};
};
w.localStorage.setItem('anku_tree_cache_v3',JSON.stringify({folderId:'1n9cyf8eSj3OremDKF5BdQIBayaryPofN',tree:[{id:'drive-course',name:'CHM109',mimeType:'application/vnd.google-apps.folder',children:[{id:'legacy-info-file',name:'info.txt',mimeType:'text/plain'}]}],time:Date.now()}));
w.localStorage.setItem('anku_calendar_class_v1','3');
for(const file of ['portal-security.js','theme-init.js','portal-config.js','analytics-init.js','app.js','portal-admin.js'])vm.runInContext(fs.readFileSync(root+'/'+file,'utf8'),ctx);
const tick=()=>new Promise(r=>setTimeout(r,30));const el=id=>w.document.getElementById(id);const submit=form=>(assert(form.checkValidity(),'Form validity: '+form.id),form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true})));
const set=(form,name,value)=>form.elements.namedItem(name).value=value;
const clickTab=name=>w.document.querySelector(`[data-tab="${name}"]`).click();
(async()=>{
 assert.equal(await vm.runInContext("validPdfBlob(new Blob(['<html>'],{type:'text/html'}))",ctx),false);
 assert.equal(await vm.runInContext("validPdfBlob(new Blob(['<html>'],{type:'application/pdf'}))",ctx),false);
 assert.equal(await vm.runInContext("validPdfBlob(new Blob(['%PDF-1.7'],{type:'application/pdf'}))",ctx),true);
 assert.equal(infoReads,0,'Cached tree must not start legacy info.txt reads before shared content loads');
 await tick();assert.equal(infoReads,0);assert.equal(vm.runInContext('getAcademicEvents().length',ctx),0);assert.equal(w.portalCanEdit(),false);
 // Restore the saved class, cycle through all classes, and keep dates isolated.
 assert.equal(vm.runInContext('calendarClassYear',ctx),3);
 const originalEvents=w.portalEvents;
 const date=vm.runInContext('getTodayDateStr()',ctx);
 const courses=vm.runInContext('[1,2,3,4].map(year=>CURRICULUM_COURSES.find(c=>c.year===year).code)',ctx);
 w.portalEvents=()=>[
   ...courses.map((courseCode,i)=>({id:`class-${i+1}`,title:`Class ${i+1} exam`,courseCode,date})),
   {id:'shared',title:'Shared date',courseCode:'GENEL',date},
   {id:'class-general',title:'Second year meeting',courseCode:'GENEL',year:2,date}
 ];
 vm.runInContext('refreshCalendarWidget()',ctx);
 for(const expected of [4,1,2,3]){
   el('calendarClassButton').click();
   assert.equal(w.localStorage.getItem('anku_calendar_class_v1'),String(expected));
   assert.equal(w.document.activeElement.id,'calendarClassButton');
   const ids=Array.from(vm.runInContext('getCalendarEvents().map(e=>e.id)',ctx));
   assert.deepEqual(ids,[`class-${expected}`,'shared',...(expected===2?['class-general']:[])]);
   assert.match(el('academicCalendarContainer').textContent,new RegExp(`Class ${expected} exam`));
   assert.doesNotMatch(el('academicCalendarContainer').textContent,new RegExp(`Class ${expected%4+1} exam`));
   vm.runInContext('calendarActiveDateStr = getTodayDateStr()',ctx);
   vm.runInContext(`showCalendarDayPopover(document.querySelector('[data-date="${date}"]'), '${date}', true)`,ctx);
   assert.match(el('calendarDayPopover').textContent,new RegExp(`Class ${expected} exam`));
 }
 el('calendarClassButton').click();
 assert.equal(el('calendarDayPopover').classList.contains('is-open'),false);
 assert.equal(vm.runInContext('calendarActiveDateStr',ctx),null);
 w.portalEvents=originalEvents;
 vm.runInContext('refreshCalendarWidget()',ctx);
 const originalViewer=w.openViewerModal;let captured=null;w.openViewerModal=(...args)=>{captured=args;};
 const attack="'); window.__xss=true; //";
 const markup=vm.runInContext('renderFileItem('+JSON.stringify({id:'safe-file-id',name:'<img src=x onerror=alert(1)>',mimeType:'application/pdf',webViewLink:'javascript:alert(1)'})+','+JSON.stringify(attack)+')',ctx);
 const container=w.document.createElement('div');container.innerHTML=markup;
 w.document.body.append(container);container.querySelector('[data-portal-click]').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));container.remove();
 assert.equal(w.__xss,undefined);assert.equal(captured[1],attack);assert.equal(container.querySelector('a[title="Drive"]').getAttribute('href'),'#');assert.equal(container.querySelectorAll('img').length,0);w.openViewerModal=originalViewer;
 el('portalFeedbackButton').click();let form=el('portalFeedbackForm');set(form,'message','Kimya dersi için çalışma notları istiyorum.');submit(form);await tick();assert.equal(feedback.length,1);assert.match(el('portalFeedbackStatus').textContent,/ulaştı/);el('portalFeedbackDialog').close();
 el('portalSettingsButton').click();el('portalOpenAdmin').click();form=el('portalLoginForm');set(form,'email','admin@example.test');set(form,'password','not-a-real-password');submit(form);await tick();assert.equal(w.portalCanEdit(),true);assert.equal(form.elements.password.value,'');assert(el('portalAdminDialog').open);await tick();assert.match(el('portalAdminDialog').textContent,/Kimya dersi için/);
 clickTab('events');el('portalAdminDialog').querySelector('[data-add]').click();form=el('portalRecordForm');set(form,'title','Doğrulama etkinliği');set(form,'date','2026-11-20');set(form,'time','14:00');submit(form);assert.equal(w.portalEvents().length,0);assert(!el('portalPublish').disabled);el('portalPublish').click();await tick();assert.equal(w.portalEvents().length,1);assert.equal(content.events[0].title,'Doğrulama etkinliği');assert.equal(revision,1);
 clickTab('courses');el('portalAdminDialog').querySelector('[data-add]').click();form=el('portalRecordForm');set(form,'code','TST101');set(form,'name','Eklenen test dersi');submit(form);assert.equal(vm.runInContext("CURRICULUM_MAP.has('TST101')",ctx),false);el('portalPublish').click();await tick();assert.equal(vm.runInContext("CURRICULUM_MAP.has('TST101')",ctx),true);
 clickTab('resources');el('portalAdminDialog').querySelector('[data-add]').click();form=el('portalRecordForm');set(form,'title','Test kaynak');set(form,'courseCode','TST101');set(form,'url','https://example.com/notes.pdf');set(form,'kind','not');submit(form);el('portalPublish').click();await tick();assert.equal(vm.runInContext("courseMetadata.TST101.links[0].title",ctx),'Test kaynak');
 clickTab('general');form=el('portalGeneralForm');set(form,'name','Test portal adı');submit(form);failPublish=true;el('portalPublish').click();await tick();assert.match(el('portalPublishStatus').textContent,/Çakışma/);assert.notEqual(content.general.name,'Test portal adı');failPublish=false;el('portalDiscard').click();await tick();assert.equal(el('portalPublish').disabled,true);
 clickTab('events');el('portalAdminDialog').querySelector('[data-remove]').click();el('portalPublish').click();await tick();assert.equal(w.portalEvents().length,0);
 clickTab('staff');el('portalAdminDialog').querySelector('[data-add]').click();form=el('portalRecordForm');set(form,'name','Eklenen görevli');set(form,'email','staff@example.test');set(form,'photo','assets/../../other/photo.jpg');submit(form);assert(el('portalRecordDialog').open);assert.match(el('portalRecordStatus').textContent,/Görsel/);set(form,'photo','./assets/staff/test.jpg');submit(form);el('portalPublish').click();await tick();assert(vm.runInContext("STAFF_DATA.some(s=>s.name==='Eklenen görevli')",ctx));
 clickTab('drive');let driveRow=el('portalAdminDialog').querySelector('[data-drive="note-1"]');assert(driveRow,'Drive test file loaded');driveRow.querySelector('[data-rename]').click();form=el('portalRenameForm');set(form,'name','Düzenlenen not.pdf');submit(form);el('portalPublish').click();await tick();assert.equal(vm.runInContext("getCourseNodeByCode('CHM109').children[0].name",ctx),'Düzenlenen not.pdf');
 driveRow=el('portalAdminDialog').querySelector('[data-drive="note-1"]');driveRow.querySelector('[data-toggle]').click();el('portalPublish').click();await tick();assert.equal(vm.runInContext("getCourseNodeByCode('CHM109').children.length",ctx),0);
 driveRow=el('portalAdminDialog').querySelector('[data-drive="note-1"]');driveRow.querySelector('[data-toggle]').click();el('portalPublish').click();await tick();assert.equal(vm.runInContext("getCourseNodeByCode('CHM109').children.length",ctx),1);
 clickTab('account');form=el('portalPasswordForm');set(form,'current_password','fake-current-password');set(form,'password','fake-new-password');set(form,'confirmation','fake-new-password');submit(form);await tick();assert.equal(passwordWrites[0].current_password,'fake-current-password');assert.equal(form.elements.current_password.value,'');assert.equal(form.elements.password.value,'');
 delayFeedback=true;clickTab('feedback');await tick();assert(pendingFeedback,'Feedback request pending before logout');
 const ids=[...w.document.querySelectorAll('[id]')].map(x=>x.id);assert.equal(ids.length,new Set(ids).size,'unique DOM IDs');
 el('portalAdminDialog').close();el('portalSettingsButton').click();el('portalLogout').click();await tick();pendingFeedback();await tick();assert.equal(w.portalCanEdit(),false);assert.equal(w.sessionStorage.getItem('anku_admin_session'),null);assert.equal(el('portalAdminDialog').querySelector('.portal-modal-body').textContent,'');
 console.log('PASS: anonymous access, feedback submission, login, private feedback rendering, draft/publish, calendar add/remove, course/resource add, conflict retention, discard, unique field IDs');
 console.log('No live content or feedback was changed; tests used isolated mocked API responses.');
 w.close();
})().catch(e=>{console.error(e);w.close();process.exitCode=1});
