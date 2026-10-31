const {JSDOM}=require('jsdom'),fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),test=require('node:test');
const root=require('node:path').resolve(__dirname,'..');

test('TR/EN language switcher localizes the whole interface and defaults to Turkish',async(t)=>{
  const html=fs.readFileSync(root+'/index.html','utf8');
  const dom=new JSDOM(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''),{url:'https://c4n3rr.github.io/anku-eee-materials/',runScripts:'outside-only',pretendToBeVisual:true});
  t.after(()=>dom.window.close());
  const w=dom.window,ctx=dom.getInternalVMContext();
  w.Blob=Blob;w.tailwind={};w.matchMedia=()=>({matches:false,addEventListener(){}});w.scrollTo=()=>{};w.lucide={createIcons(){}};w.AbortSignal=AbortSignal;w.structuredClone=structuredClone;
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
  w.fetch=async()=>({ok:false,status:500,json:async()=>({}),text:async()=>'{}'});
  for(const file of ['portal-language.js','portal-security.js','theme-init.js','portal-config.js','calculus-study-data.js','app.js','portal-admin.js'])vm.runInContext(fs.readFileSync(root+'/'+file,'utf8'),ctx);
  await new Promise(r=>setTimeout(r,30));
  const $=id=>w.document.getElementById(id);

  // Default is Turkish
  assert.equal(w.getPortalLang(),'tr');
  assert.equal(w.document.documentElement.lang,'tr');
  assert.equal($('langBtnTr').getAttribute('aria-pressed'),'true');
  vm.runInContext('renderWelcomeHub()',ctx);
  assert.match($('courseHubView').textContent,/Tüm Materyaller/);

  // Switch to English
  $('langBtnEn').click();
  assert.equal(w.getPortalLang(),'en');
  assert.equal(w.document.documentElement.lang,'en');
  assert.equal(w.localStorage.getItem('anku_portal_lang_v1'),'en');
  assert.equal($('langBtnEn').getAttribute('aria-pressed'),'true');
  assert.match($('courseHubView').textContent,/All Materials/);
  assert.doesNotMatch($('courseHubView').textContent,/Tüm Materyaller/);
  assert.match($('sidebarDashboardNav').textContent,/Academic Staff/);
  assert.equal($('globalSearchInput').placeholder,'Search...');
  assert.match(w.document.querySelector('footer').textContent,/Privacy Policy/);
  assert.match(w.document.querySelector('footer').textContent,/Built by Caner Davarcı/);

  // Staff hub in English
  vm.runInContext("goToStaffPage()",ctx);
  assert.match($('courseHubView').textContent,/Research Assistants/);
  assert.match($('courseHubView').textContent,/Department Chair/);

  // Course hub in English
  vm.runInContext("selectCourseByCode('MTH0101')",ctx);
  assert.match($('courseHubView').textContent,/Calculus I/);
  assert.match($('courseHubView').textContent,/Step-by-Step Study/);

  // Timetable modal in English
  w.openAcademicTimetable();
  const ttDialog = $('academicTimetableDialog');
  assert(ttDialog);
  assert.match(ttDialog.textContent,/2026–2027 Academic Calendar/);
  assert.match(ttDialog.textContent,/FALL SEMESTER/);
  assert.match(ttDialog.textContent,/SPRING SEMESTER/);
  assert.match(ttDialog.textContent,/SCIENCE TORCH LIGHTING CEREMONY/);
  ttDialog.close();

  // Feedback dialog in English
  $('portalFeedbackButton').click();
  const fbDialog = $('portalFeedbackDialog');
  assert.match(fbDialog.textContent,/Feedback & Requests/);
  assert.match(fbDialog.textContent,/What would you like to share\?/);
  fbDialog.close();

  // Settings dialog in English
  $('portalSettingsButton').click();
  const setDialog = $('portalSettingsDialog');
  assert.match(setDialog.textContent,/Settings/);
  assert.match(setDialog.textContent,/Appearance/);
  setDialog.close();

  // Language switching must retain drafts and the selected study section.
  $('portalFeedbackButton').click();
  $('portalFeedbackForm').elements.message.value='Çalışma notları için önerim';
  $('portalFeedbackForm').elements.course_code.value='CHM109';
  w.setPortalLanguage('tr');
  assert.equal($('portalFeedbackForm').elements.message.value,'Çalışma notları için önerim');
  assert.equal($('portalFeedbackForm').elements.course_code.value,'CHM109');
  assert.match($('portalFeedbackDialog').textContent,/İstek ve Görüşler/);
  $('portalFeedbackDialog').close();
  assert.equal(new URL(w.location.href).searchParams.get('lang'),'tr');
  assert.equal(new URL($('footerPrivacyLink').href).searchParams.get('lang'),'tr');
  vm.runInContext("setCourseActiveTab('study'); selectStudyTopic('continuity'); setStudySectionTab('examples')",ctx);
  const studyHash=w.location.hash;
  w.setPortalLanguage('en');
  assert.equal(w.location.hash,studyHash);
  assert.match($('courseHubView').textContent,/Continuity/);
  assert.doesNotMatch($('courseHubView').textContent,/Süreklilik/);
  w.setPortalLanguage('tr');
  assert.match($('courseHubView').textContent,/Süreklilik/);
  assert.equal($('totalFilesBadge').textContent,'0 dosya');
  w.setPortalLanguage('en');
  assert.equal($('totalFilesBadge').textContent,'0 files');

  // Switch back to Turkish
  $('langBtnTr').click();
  assert.equal(w.getPortalLang(),'tr');
  assert.match($('courseHubView').textContent,/Matematik I/);
  assert.match($('courseHubView').textContent,/Adım Adım Öğren/);
  assert.match(w.document.querySelector('footer').textContent,/Caner Davarcı tarafından geliştirildi/);

  // Timetable modal in Turkish
  w.openAcademicTimetable();
  const trTimetable = $('academicTimetableDialog');
  assert.match(trTimetable.textContent,/2026–2027 Akademik Takvim/);
  assert.match(trTimetable.textContent,/GÜZ YARIYILI/);
  assert.match(trTimetable.textContent,/BİLİM ATEŞİ YAKMA TÖRENİ/);
  ttDialog.close();

  dom.window.close();
});

test('Privacy and 404 pages support TR/EN toggle and follow default language',async()=>{
  // Privacy page
  const privHtml=fs.readFileSync(root+'/privacy.html','utf8');
  const privDom=new JSDOM(privHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''),{url:'https://c4n3rr.github.io/anku-eee-materials/privacy.html',runScripts:'outside-only'});
  const pw=privDom.window,pctx=privDom.getInternalVMContext();
  pw.lucide={createIcons(){}};
  vm.runInContext(fs.readFileSync(root+'/portal-language.js','utf8'),pctx);
  vm.runInContext(fs.readFileSync(root+'/privacy-controls.js','utf8'),pctx);
  assert.equal(pw.document.documentElement.lang,'tr');
  assert.match(pw.document.getElementById('privacyTitle').textContent,/Gizlilik Politikası/);
  pw.document.getElementById('langBtnEn').click();
  assert.equal(pw.document.documentElement.lang,'en');
  assert.match(pw.document.getElementById('privacyTitle').textContent,/Privacy Policy/);
  assert.match(pw.document.getElementById('footerBuiltBy').textContent,/Built by Caner Davarcı/);
  privDom.window.close();

  // 404 page
  const nfHtml=fs.readFileSync(root+'/404.html','utf8');
  const nfDom=new JSDOM(nfHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''),{url:'https://c4n3rr.github.io/anku-eee-materials/404.html',runScripts:'outside-only'});
  const nw=nfDom.window,nctx=nfDom.getInternalVMContext();
  nw.lucide={createIcons(){}};
  vm.runInContext(fs.readFileSync(root+'/portal-language.js','utf8'),nctx);
  vm.runInContext(fs.readFileSync(root+'/not-found-controls.js','utf8'),nctx);
  assert.equal(nw.document.documentElement.lang,'tr');
  assert.match(nw.document.getElementById('notFoundHeading').textContent,/Sayfa Bulunamadı/);
  nw.document.getElementById('langBtnEn').click();
  assert.equal(nw.document.documentElement.lang,'en');
  assert.match(nw.document.getElementById('notFoundHeading').textContent,/Page Not Found/);
  assert.match(nw.document.getElementById('footerBuiltBy').textContent,/Built by Caner Davarcı/);
  nfDom.window.close();
});

test('language URLs override stored preference and preserve course deep links',()=>{
  for(const page of ['index.html','test.html','privacy.html','404.html']){
    const dom=new JSDOM('<!doctype html><html><body><a href="privacy.html" id="privacy">Privacy</a><a href="https://example.com/" id="external">External</a></body></html>',{url:'https://c4n3rr.github.io/anku-eee-materials/'+page+'?other=1&lang=en#MTH0101:study',runScripts:'outside-only'});
    try {
      const w=dom.window;
      w.localStorage.setItem('anku_portal_lang_v1','tr');
      vm.runInContext(fs.readFileSync(root+'/portal-language.js','utf8'),dom.getInternalVMContext());
      assert.equal(w.PortalLanguage.read(),'en');
      w.PortalLanguage.write('en');
      assert.equal(w.localStorage.getItem('anku_portal_lang_v1'),'en');
      assert.equal(w.document.documentElement.lang,'en');
      w.PortalLanguage.write('tr');
      assert.equal(w.location.hash,'#MTH0101:study');
      assert.equal(new URL(w.location.href).searchParams.get('other'),'1');
      assert.equal(new URL(w.document.getElementById('privacy').href).searchParams.get('lang'),'tr');
      assert.equal(w.document.getElementById('external').href,'https://example.com/');
      w.PortalLanguage.write('invalid');
      assert.equal(w.document.documentElement.lang,'tr');
    } finally {dom.window.close();}
  }
});
