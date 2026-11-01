(() => {
  'use strict';
  const backend = window.PORTAL_BACKEND;
  localStorage.removeItem('anku_feedback_client');
  const copy = value => JSON.parse(JSON.stringify(value));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId = id => document.getElementById(id);
  const uid = () => crypto.randomUUID();
  const L = (tr, en) => (window.getPortalLang?.() === 'en' ? en : tr);
  const DEFAULT_DESC_TR = 'Ders materyalleri, sınav tarihleri ve bölüm bilgileri tek yerde.';
  const DEFAULT_DESC_EN = 'Course materials, exam dates and department info in one place.';
  const FOOTER_TR = 'Caner Davarcı tarafından geliştirildi', FOOTER_EN = 'Built by Caner Davarcı';
  const linkTitle = t => (typeof formatLinkTitle === 'function' ? formatLinkTitle(t) : t);
  const ADMIN_LABELS = {
  "Bağlantılar https:// veya http:// ile başlamalı.": "Links must start with https:// or http://.",
  "Bağlantı henüz hazır değil. Lütfen daha sonra tekrar deneyin.": "The connection is not ready yet. Please try again later.",
  "Oturum kapatıldı.": "Signed out.",
  "Yönetici oturumunuz sona erdi. Yeniden giriş yapın.": "Your admin session has expired. Please sign in again.",
  "İşlem tamamlanamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.": "The action could not be completed. Check your connection and try again.",
  "Pencereyi kapat": "Close window",
  "Lütfen yönetici şifreni yaz.": "Please enter your admin password.",
  "Giriş yapılıyor…": "Signing in…",
  "Bu hesabın yönetici yetkisi bulunmuyor.": "This account does not have admin access.",
  "Yönetim Paneli": "Admin Panel",
  "Düzenlemelerini tamamladıktan sonra Yayımla düğmesine bas.": "Publish when your changes are ready.",
  "İçerik bağlantısı kurulamadı. Sayfayı yenileyip tekrar dene.": "Content could not be loaded. Refresh the page and try again.",
  "Yayımlanmamış değişikliklerin var.": "You have unpublished changes.",
  "Tüm değişiklikler yayımlandı.": "All changes have been published.",
  "Yayımlanıyor…": "Publishing…",
  "Yayımlandı. Değişiklikler tüm ziyaretçilere açık.": "Published. Changes are visible to all visitors.",
  "Kaydı düzenle": "Edit Record",
  "Ders kodu": "Course code",
  "Ders adı": "Course name",
  "Sınıf": "Year",
  "Dönem": "Semester",
  "Güz": "Fall",
  "Bahar": "Spring",
  "Menüdeki kısa ders adı": "Short course name in menu",
  "Kredi / AKTS": "Credits / ECTS",
  "Simge (Lucide adı)": "Icon (Lucide name)",
  "Öğretim görevlileri (çoklu seçim)": "Instructors (multiple selection)",
  "Araştırma görevlileri (çoklu seçim)": "Research assistants (multiple selection)",
  "Kapak görseli bağlantısı (isteğe bağlı)": "Cover image link (optional)",
  "Kapak hizası": "Cover alignment",
  "Kapak oranı (genişlik / yükseklik)": "Cover ratio (width / height)",
  "Ad soyad": "Full name",
  "Unvan": "Title",
  "Kategori": "Category",
  "Öğretim üyesi": "Faculty member",
  "Araştırma görevlisi": "Research assistant",
  "Yarı zamanlı": "Part-time",
  "Diğer bölüm": "Other department",
  "E-posta": "Email",
  "Telefon": "Phone",
  "Oda": "Room",
  "Fotoğraf bağlantısı": "Photo link",
  "AVESİS bağlantısı": "AVESİS link",
  "Kişisel site": "Personal website",
  "Etkinlik / sınav adı": "Event / exam name",
  "Ders / kategori": "Course / category",
  "Genel etkinliğin sınıfı (ders tarihleri dersin sınıfını kullanır)": "Year for general events (course events use the course year)",
  "Tüm sınıflar": "All years",
  "Tarih": "Date",
  "Saat (isteğe bağlı)": "Time (optional)",
  "Yer / açıklama": "Location / description",
  "Kaynak adı": "Resource name",
  "İlgili ders": "Related course",
  "Tür": "Type",
  "Kitap": "Book",
  "Ders notu / dosya": "Lecture notes / file",
  "Site / video": "Website / video",
  "Kaynak bağlantısı": "Resource link",
  "Bağlantı adı": "Link name",
  "Bağlantı": "Link",
  "Görsel için geçerli bir bağlantı veya bu sitenin assets/ ya da bannerlar/ yolunu kullan.": "Use a valid image link or a path in this site's assets/ or bannerlar/ directory.",
  "Ders kodu 2–30 harf, rakam, tire veya alt çizgi içermeli.": "Course codes must contain 2–30 letters, numbers, hyphens or underscores.",
  "Bu ders kodu zaten var.": "This course code already exists.",
  "Portal adı": "Portal name",
  "Ana sayfa açıklaması": "Home page description",
  "Alt bilgi": "Footer",
  "Ana klasör": "Root folder",
  "Yeniden göster": "Show again",
  "Gizle": "Hide",
  "Ders adını Dersler / Sınıflar bölümünden düzenle.": "Edit the course name in Courses / Years.",
  "Portalda görünen ad": "Name shown in portal",
  "Not": "Notes",
  "Site": "Website",
  "Görüş": "Feedback",
  "İsimsiz": "Anonymous",
  "Yeni": "New",
  "İnceleniyor": "Under review",
  "Tamamlandı": "Completed",
  "Arşiv": "Archived",
  "Öneri durumu kaydedildi.": "Feedback status saved.",
  "Yönetici hesabı": "Admin account",
  "Mevcut şifre": "Current password",
  "Yeni şifre": "New password",
  "Yeni şifre (tekrar)": "Repeat new password",
  "En az 12 karakter kullan.": "Use at least 12 characters.",
  "Şifreler eşleşmiyor.": "Passwords do not match.",
  "Şifren kaydedildi.": "Your password has been saved.",
  "Portal içerik kaydı bulunamadı.": "Portal content could not be found.",
  "Gelen öneriler": "Incoming feedback",
  "Dersler / Sınıflar": "Courses / Years",
  "Kitap, not ve siteler": "Books, notes and websites",
  "Drive materyalleri": "Drive materials",
  "Öğretim görevlileri": "Academic staff",
  "Takvim": "Calendar",
  "Bağlantılar": "Links",
  "Site bilgileri": "Site information",
  "Hesabım": "My account"
};
  const T = text => L(text, ADMIN_LABELS[text] || text);
  function setDialogTitle(dialog, title, subtitle) {
    const h = dialog.querySelector('.portal-modal-head h2'); if (h) h.textContent = title;
    const p = dialog.querySelector('.portal-modal-head p'); if (p) p.textContent = subtitle;
    dialog.querySelector('[data-close]')?.setAttribute('aria-label', L('Pencereyi kapat', 'Close window'));
  }
  const originalWelcomeHub = renderWelcomeHub;
  renderWelcomeHub = function(...args) { const result = originalWelcomeHub(...args); applyBrand(); return result; };
  const safeUrl = (value, optional = true) => {
    if (!value && optional) return '';
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error(T('Bağlantılar https:// veya http:// ile başlamalı.'));
    return url.href;
  };
  const defaults = {
    courses: copy(CURRICULUM_COURSES).map(c=>({...c,shortName:SHORT_SIDEBAR_COURSE_LABELS[c.code]||c.name})), staff: copy(STAFF_DATA), events: [],
    resources: CURRICULUM_COURSES.flatMap(c => (c.links || []).map((link,i) => ({...link,id:`${c.code}-${i}`,courseCode:c.code,kind:'site'}))),
    sidebar: [...document.querySelectorAll('[data-portal-links] a:not(#sidebarDriveLink)')].map(a => ({id:uid(),title:a.textContent.trim(),url:a.href})),
    hiddenDrive: [], driveEdits: {},
    general: {name:'ANKU EEE Portal',description:'Ders materyalleri, sınav tarihleri ve bölüm bilgileri tek yerde.',footer:FOOTER_TR}
  };
  let published = copy(defaults), draft = null, revision = 0, admin = false, tab = 'feedback', busy = false, ready = false;
  let sourceTree = driveTree ? copy(driveTree) : null, appliedTree = null, feedbackPage = 0;
  let session = null;
  try { session = JSON.parse(sessionStorage.getItem('anku_admin_session') || 'null'); } catch {}
  let refreshPromise = null;
  let sessionEpoch = 0;
  let lastAdminActivity = Date.now();
  function endAdminSession() {
    sessionEpoch++;storeSession(null);admin=false;draft=null;
    for(const name of ['portalAdminDialog','portalRecordDialog']) { const dialog=byId(name);if(dialog?.open)dialog.close();const body=dialog?.querySelector('.portal-modal-body');if(body)body.replaceChildren(); }
    byId('portalLoginForm')?.reset();byId('portalPasswordForm')?.reset();
  }
  for(const type of ['pointerdown','keydown'])document.addEventListener(type,()=>{if(admin)lastAdminActivity=Date.now();},{passive:true});
  setInterval(()=>{if(admin && Date.now()-lastAdminActivity>30*60*1000){endAdminSession();renderPublic();}},30000);
  function storeSession(data) {
    session = data ? {...data, expires_at:data.expires_at || (Date.now()/1000 + (data.expires_in||3600))} : null;
    if (session) sessionStorage.setItem('anku_admin_session', JSON.stringify(session));
    else sessionStorage.removeItem('anku_admin_session');
  }
  function status(id, message, error = false) {
    const el = byId(id); if (!el) return;
    el.textContent = message; el.dataset.error = String(error);
  }
  async function request(path, {method='GET', body, auth=false, headers={}} = {}) {
    const requestEpoch=sessionEpoch;
    if (!backend?.url || !backend?.key) throw new Error(T('Bağlantı henüz hazır değil. Lütfen daha sonra tekrar deneyin.'));
    if (auth && session && session.expires_at < Date.now()/1000 + 60) {
      if (!refreshPromise) refreshPromise = request('/auth/v1/token?grant_type=refresh_token', {method:'POST',body:{refresh_token:session.refresh_token}})
        .then(data=>{if(requestEpoch!==sessionEpoch)throw new Error(T('Oturum kapatıldı.'));storeSession(data);}).catch(error => {endAdminSession();throw error;}).finally(()=>{refreshPromise=null;});
      await refreshPromise;
    }
    if (auth && !session?.access_token) throw new Error(T('Yönetici oturumunuz sona erdi. Yeniden giriş yapın.'));
    const response = await fetch(backend.url + path, {method, headers:{apikey:backend.key,'Content-Type':'application/json',...(auth?{Authorization:`Bearer ${session.access_token}`} : {}),...headers},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(18000)});
    const text = await response.text();
    if(auth&&requestEpoch!==sessionEpoch)throw new Error(T('Oturum kapatıldı.'));
    let result;
    try {result=text?JSON.parse(text):null;} catch {result=null;}
    if (!response.ok) {
      if(auth && response.status===401)endAdminSession();
      const message = result?.msg || result?.message || result?.error_description || result?.error;
      throw new Error(message || T('İşlem tamamlanamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.'));
    }
    return result;
  }
  function makeDialog(id,title,subtitle='',wide=false) {
    const dialog = document.createElement('dialog'); dialog.id=id; dialog.className=`portal-dialog ${wide?'portal-dialog-wide':''}`;
    dialog.setAttribute('aria-labelledby',`${id}Title`);
    dialog.innerHTML=`<div class="portal-modal-head"><div><h2 id="${id}Title">${escape(title)}</h2>${subtitle?`<p>${escape(subtitle)}</p>`:''}</div><button type="button" class="portal-icon-btn" data-close aria-label="Pencereyi kapat"><i data-lucide="x" class="size-4"></i></button></div><div class="portal-modal-body"></div>`;
    dialog.querySelector('[data-close]').onclick=()=>dialog.close();
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    document.body.append(dialog);return dialog;
  }
  function show(dialog){if(!dialog.open)dialog.showModal();window.lucide?.createIcons();}
  let fieldSequence = 0;
  function field(name,label,type='text',value='',options=null,required=false) {
    const id=`portalField_${name}_${++fieldSequence}`;
    let input;
    if(options) input=`<select id="${id}" name="${name}" class="portal-input" ${type==='multiple'?'multiple':''} ${required?'required':''}>${options.map(([v,l])=>`<option value="${escape(v)}" ${(Array.isArray(value)?value.includes(v):String(value)===String(v))?'selected':''}>${escape(l)}</option>`).join('')}</select>`;
    else if(type==='textarea')input=`<textarea id="${id}" name="${name}" class="portal-input" maxlength="4000" ${required?'required':''}>${escape(value)}</textarea>`;
    else input=`<input id="${id}" name="${name}" type="${type}" value="${escape(value)}" class="portal-input" ${required?'required':''} ${type==='number'?'step="any" min="0.01"':''} ${type==='password'?'autocomplete="current-password"': ''} maxlength="${type==='url'?2000:name==='email'?254:name==='name'?100:300}">`;
    return `<label class="portal-field" for="${id}">${escape(label)}${input}</label>`;
  }
  const courseOptions = () => [['GENEL',L('Genel / Bölüm','General / Department')],...(draft||published).courses.map(c=>[c.code,`${c.code} — ${typeof formatCourseDisplayName==='function'?formatCourseDisplayName(c.code,c.name):c.name}`])];
  function renderPublic() {
    window.portalApplyDrive();
    renderSidebarCourses();
    if(activeCourseId&&!getCourseNodeById(activeCourseId)){activeCourseId=null;activeView='home';}
    if(activeView==='staff')renderStaffHub(highlightedStaffId);
    else if(activeCourseId)renderCourseHub(activeCourseId);
    else renderWelcomeHub();
    applyBrand();window.lucide?.createIcons();
  }
  function applyBrand() {
    const g=published.general;
    const brand=document.querySelector('.sidebar-brand-btn span');if(brand)brand.textContent=g.name;
    const hero=document.querySelector('.portal-hero h1');if(hero)hero.textContent=g.name;
    const desc=[DEFAULT_DESC_TR,DEFAULT_DESC_EN].includes((g.description||'').trim())?L(DEFAULT_DESC_TR,DEFAULT_DESC_EN):g.description;
    const sub=document.querySelector('.portal-hero-sub');if(sub)sub.textContent=desc;
    const foot=[FOOTER_TR,FOOTER_EN,''].includes((g.footer||'').trim())?L(FOOTER_TR,FOOTER_EN):g.footer;
    const footer=document.querySelector('footer span.font-medium');if(footer)footer.textContent=foot;
  }
  function applyContent() {
    CURRICULUM_COURSES.splice(0,CURRICULUM_COURSES.length,...copy(published.courses));
    CURRICULUM_MAP.clear();CURRICULUM_COURSES.forEach(c=>CURRICULUM_MAP.set(c.code,c));
    STAFF_DATA.splice(0,STAFF_DATA.length,...copy(published.staff));
    STAFF_DATA.forEach(s => { s.courses = published.courses.filter(c => (c.instructorIds||[]).includes(s.id) || (c.assistantIds||[]).includes(s.id)).map(c=>c.code); });STAFF_MAP.clear();STAFF_DATA.forEach(s=>STAFF_MAP.set(s.id,s));
    courseMetadata={};
    for(const c of CURRICULUM_COURSES){
      const instructors=(c.instructorIds||[]).map(id=>STAFF_MAP.get(id)).filter(Boolean);
      const assistants=(c.assistantIds||[]).map(id=>STAFF_MAP.get(id)).filter(Boolean);
      courseMetadata[c.code]={...c, instructor:instructors.map(s=>`${s.title} ${s.name}`).join(', '),assistantsText:assistants.map(s=>`${s.title} ${s.name}`).join(', '),email:instructors[0]?.email||'',avesisUrl:instructors[0]?.avesisUrl||'',links:published.resources.filter(r=>r.courseCode===c.code).map(r=>({title:r.title,url:r.url,icon:r.icon||'external-link'}))};
    }
    renderSidebarLinks();
    renderPublic();
  }
  function renderSidebarLinks() {
    const ul=document.querySelector('[data-portal-links]');if(!ul)return;
    const drive=byId('sidebarDriveLink')?.closest('li');
    ul.querySelectorAll('li').forEach(li=>{if(li!==drive)li.remove();});
    for(const link of published.sidebar){const t=linkTitle(link.title);const li=document.createElement('li');li.innerHTML=`<a href="${escape(safeUrl(link.url,false))}" target="_blank" rel="noopener noreferrer" title="${escape(t)}" class="sidebar-nav-btn flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition"><i data-lucide="external-link" class="size-4 shrink-0 text-muted-foreground"></i><span class="sidebar-hide-collapsed flex-1 truncate">${escape(t)}</span></a>`;ul.insertBefore(li,drive);}
  }
  window.portalApplyLanguage=()=>{
    if(ready)renderSidebarLinks();
    else document.querySelectorAll('[data-portal-links] a:not(#sidebarDriveLink)').forEach(a=>{const sp=a.querySelector('span');if(!sp)return;sp.dataset.orig??=sp.textContent.trim();const t=linkTitle(sp.dataset.orig);sp.textContent=t;a.title=t;});
    const tt=byId('academicTimetableDialog');if(tt && tt.dataset.language !== window.getPortalLang?.()){const wasOpen=tt.open;if(wasOpen)tt.close();tt.disposeTimetable?.();tt.remove();if(wasOpen)window.openAcademicTimetable();}
    function relabelForm(dialog, render) {
      if (!dialog.open) return;
      const form=dialog.querySelector('form');
      const values=form ? new FormData(form) : null;
      render();
      if(values)for(const [name,value] of values){const input=dialog.querySelector('form')?.elements.namedItem(name);if(input && input.type !== 'password')input.value=value;}
    }
    relabelForm(feedbackDialog,openFeedback);if(settingsDialog.open)openSettings();relabelForm(loginDialog,openLogin);
    setDialogTitle(adminDialog,T('Yönetim Paneli'),T('Düzenlemelerini tamamladıktan sonra Yayımla düğmesine bas.'));
    setDialogTitle(editor,T('Kaydı düzenle'));
    if(adminDialog.open)renderAdmin();
    applyBrand();
  };
  window.portalApplyBrand=applyBrand;
  window.portalApplyDrive=()=>{
    if(driveTree!==appliedTree)sourceTree=driveTree?copy(driveTree):sourceTree;
    if(!sourceTree)return;
    const courseCodes=new Set(published.courses.map(c=>c.code));
    const originalCodes=new Set(defaults.courses.map(c=>c.code));
    const hidden=new Set(published.hiddenDrive);
    const codeAliases=new Map(published.courses.filter(c=>c.sourceCode).map(c=>[c.sourceCode,c.code]));
    function walk(nodes,root=false){return nodes.map(n=>root&&codeAliases.has(n.name.toUpperCase().trim())?{...n,name:codeAliases.get(n.name.toUpperCase().trim())}:n).filter(n=>!hidden.has(n.id)&&(!root||!originalCodes.has(n.name.toUpperCase().trim())||courseCodes.has(n.name.toUpperCase().trim()))).map(n=>({...n,...(published.driveEdits[n.id]||{}),...(n.children?{children:walk(n.children)}:{})}));}
    driveTree=walk(copy(sourceTree),true);appliedTree=driveTree;
  };
  window.portalOpenCalendar=()=>{if(!admin)return;openAdmin('events');editRecord('events');};
  window.portalEvents=()=>copy(published.events);
  window.openAcademicTimetable=()=>{
    let dialog=byId('academicTimetableDialog');
    if(!dialog){
      dialog=makeDialog('academicTimetableDialog',L('2026–2027 Akademik Takvim','2026–2027 Academic Calendar'),L('Elektrik-Elektronik Mühendisliği · Lisans','Electrical & Electronics Engineering · Undergraduate'),true);
      dialog.dataset.language=window.getPortalLang?.() || 'tr';
      let scrollState=null;
      const stopBackgroundScroll=event=>{
        if(dialog.open && !(event.touches?.length>1))event.preventDefault();
      };
      dialog.lockBackground=()=>{
        if(scrollState)return;
        const root=document.documentElement,body=document.body;
        scrollState={x:window.scrollX,y:window.scrollY,body:body.style.cssText,root:root.style.cssText};
        const scrollbar=window.innerWidth-root.clientWidth;
        const padding=parseFloat(getComputedStyle(body).paddingRight)||0;
        root.style.overflow='hidden';
        root.style.overscrollBehavior='none';
        Object.assign(body.style,{position:'fixed',top:`-${scrollState.y}px`,left:`-${scrollState.x}px`,width:'100%',overflow:'hidden',paddingRight:`${padding+scrollbar}px`});
        document.addEventListener('wheel',stopBackgroundScroll,{passive:false});
        document.addEventListener('touchmove',stopBackgroundScroll,{passive:false});
      };
      dialog.unlockBackground=()=>{
        if(!scrollState)return;
        document.removeEventListener('wheel',stopBackgroundScroll);
        document.removeEventListener('touchmove',stopBackgroundScroll);
        const saved=scrollState;scrollState=null;
        document.body.style.cssText=saved.body;
        document.documentElement.style.cssText=saved.root;
        window.scrollTo({left:saved.x,top:saved.y,behavior:'instant'});
      };
      dialog.addEventListener('close',dialog.unlockBackground);

      const dates=[{"date": "01 Eylül 2026", "title": "OBS’de derslerin bölümler tarafından açılması ve ders programlarının ilanı", "sort": "2026-09-01", "term": "Güz"}, {"date": "14-20 Eylül 2026", "title": "Öğrenciler İçin Kayıt Yenileme Başlama ve Bitiş Tarihleri", "sort": "2026-09-14", "term": "Güz"}, {"date": "14-20 Eylül 2026", "title": "Katkı Payı/ Materyal/ Öğrenim Ücreti Yatırma Tarihleri", "sort": "2026-09-14", "term": "Güz"}, {"date": "14-21 Eylül 2026", "title": "Danışman Onayı", "sort": "2026-09-14", "term": "Güz"}, {"date": "16-18 Eylül 2026", "title": "Üniversite Yaşamına Uyum Haftası", "sort": "2026-09-16", "term": "Güz"}, {"date": "21 Eylül-31 Aralık 2026", "title": "Derslerin Başlama ve Bitiş Tarihleri", "sort": "2026-09-21", "term": "Güz"}, {"date": "22 Eylül 2026", "title": "BİLİM ATEŞİ YAKMA TÖRENİ", "sort": "2026-09-22", "term": "Güz"}, {"date": "22 Eylül 2026", "title": "Birim Başkanı Onayı", "sort": "2026-09-22", "term": "Güz"}, {"date": "23-24 Eylül 2026", "title": "Bölümlerde Öğrencilerle Danışmaların Yüz Yüze Görüşme Tarihleri", "sort": "2026-09-23", "term": "Güz"}, {"date": "23-27 Eylül 2026", "title": "Öğrenciler İçin Ders Ekleme Bırakma ve Mazeret Başlama Bitiş Tarihleri", "sort": "2026-09-23", "term": "Güz"}, {"date": "23-28 Eylül 2026", "title": "Danışman Onayı", "sort": "2026-09-23", "term": "Güz"}, {"date": "29 Eylül 2026", "title": "Birim Başkanı Onayı", "sort": "2026-09-29", "term": "Güz"}, {"date": "16 Kasım 2026", "title": "UÖ Yöntemi ile Okutulan 5(ı) Derslerinin Ara Sınav Tarihi", "sort": "2026-11-16", "term": "Güz"}, {"date": "16-22 Kasım 2026", "title": "UÖ Yöntemi ile Okutulan GSS, Üni. Alan Dışı Derslerin Ara Sınav Tarihleri", "sort": "2026-11-16", "term": "Güz"}, {"date": "02-17 Ocak 2027", "title": "Final Sınavı Tarihleri", "sort": "2027-01-02", "term": "Güz"}, {"date": "02-21 Ocak 2027", "title": "Final Sınavı Not Giriş Başlama ve Bitiş Tarihleri", "sort": "2027-01-02", "term": "Güz"}, {"date": "04 Ocak 2027", "title": "UÖ Yöntemi ile Okutulan 5(ı) Derslerinin Final Sınav Tarihi", "sort": "2027-01-04", "term": "Güz"}, {"date": "04-10 Ocak 2027", "title": "UÖ Yöntemi ile Okutulan GSS, Üni. Alan Dışı Derslerin Final Sınav Tarihleri", "sort": "2027-01-04", "term": "Güz"}, {"date": "25 Ocak-02 Şubat 2027", "title": "Bütünleme Sınav Tarihleri", "sort": "2027-01-25", "term": "Güz"}, {"date": "25 Ocak-03 Şubat 2027", "title": "Bütünleme Not Giriş Başlama ve Bitiş Tarihleri", "sort": "2027-01-25", "term": "Güz"}, {"date": "25 Ocak 2027", "title": "UÖ Yöntemi ile Okutulan 5(ı) Derslerinin Bütünleme Sınav Tarihi", "sort": "2027-01-25", "term": "Güz"}, {"date": "25-31 Ocak 2027", "title": "UÖ Yöntemi ile Okutulan GSS, Üni. Alan Dışı Derslerin Bütünleme Sınav Tarihleri", "sort": "2027-01-25", "term": "Güz"}, {"date": "01 Şubat 2027", "title": "OBS’de derslerin bölümler tarafından açılması ve ders programlarının ilanı", "sort": "2027-02-01", "term": "Bahar"}, {"date": "04 Şubat 2027", "title": "Üç Ders Sınav Başvuru Tarihleri", "sort": "2027-02-04", "term": "Güz"}, {"date": "06-12 Şubat 2027", "title": "Üç Ders Sınav Tarihleri", "sort": "2027-02-06", "term": "Güz"}, {"date": "06-14 Şubat 2027", "title": "Üç Ders Sınav Not Giriş Başlama ve Bitiş Tarihleri", "sort": "2027-02-06", "term": "Güz"}, {"date": "08-14 Şubat 2027", "title": "Öğrenciler İçin Kayıt Yenileme Başlama ve Bitiş Tarihleri", "sort": "2027-02-08", "term": "Bahar"}, {"date": "08-14 Şubat 2027", "title": "Katkı Payı/ Materyal/ Öğrenim Ücreti Yatırma Tarihleri", "sort": "2027-02-08", "term": "Bahar"}, {"date": "08-15 Şubat 2027", "title": "Danışman Onayı", "sort": "2027-02-08", "term": "Bahar"}, {"date": "15 Şubat-04 Haziran 2027", "title": "Derslerin Başlama ve Bitiş Tarihleri", "sort": "2027-02-15", "term": "Bahar"}, {"date": "16 Şubat 2027", "title": "Birim Başkanı Onayı", "sort": "2027-02-16", "term": "Bahar"}, {"date": "17-18 Şubat 2027", "title": "Bölümlerde Öğrencilerle Danışmaların Yüz Yüze Görüşme Tarihleri", "sort": "2027-02-17", "term": "Bahar"}, {"date": "17-21 Şubat 2027", "title": "Öğrenciler İçin Ders Ekleme Bırakma ve Mazeret Başlama Bitiş Tarihleri", "sort": "2027-02-17", "term": "Bahar"}, {"date": "17-22 Şubat 2027", "title": "Danışman Onayı", "sort": "2027-02-17", "term": "Bahar"}, {"date": "23 Şubat 2027", "title": "Birim Başkanı Onayı", "sort": "2027-02-23", "term": "Bahar"}, {"date": "12 Nisan 2027", "title": "UÖ Yöntemi ile Okutulan 5(ı) Derslerinin Ara Sınav Tarihi", "sort": "2027-04-12", "term": "Bahar"}, {"date": "12-18 Nisan 2027", "title": "UÖ Yöntemi ile Okutulan GSS, Üni. Alan Dışı Derslerin Ara Sınav Tarihleri", "sort": "2027-04-12", "term": "Bahar"}, {"date": "05-27 Haziran 2027", "title": "Final Sınavı Tarihleri", "sort": "2027-06-05", "term": "Bahar"}, {"date": "05-30 Haziran 2027", "title": "Final Sınavı Not Giriş Başlama ve Bitiş Tarihleri", "sort": "2027-06-05", "term": "Bahar"}, {"date": "12-20 Haziran 2027", "title": "UÖ Yöntemi ile Okutulan GSS, Üni. Alan Dışı Derslerin Final Sınav Tarihleri", "sort": "2027-06-12", "term": "Bahar"}, {"date": "14 Haziran 2027", "title": "UÖ Yöntemi ile Okutulan 5(ı) Derslerinin Final Sınav Tarihi", "sort": "2027-06-14", "term": "Bahar"}, {"date": "03-13 Temmuz 2027", "title": "Bütünleme Sınav Tarihleri", "sort": "2027-07-03", "term": "Bahar"}, {"date": "03-14 Temmuz 2027", "title": "Bütünleme Not Giriş Başlama ve Bitiş Tarihleri", "sort": "2027-07-03", "term": "Bahar"}, {"date": "08-13 Temmuz 2027", "title": "UÖ Yöntemi ile Okutulan GSS, Üni. Alan Dışı Derslerin Bütünleme Sınav Tarihleri", "sort": "2027-07-08", "term": "Bahar"}, {"date": "12 Temmuz 2027", "title": "UÖ Yöntemi ile Okutulan 5(ı) Derslerinin Bütünleme Sınav Tarihi", "sort": "2027-07-12", "term": "Bahar"}, {"date": "16 Temmuz 2027", "title": "Üç Ders Sınav Başvuru Tarihleri", "sort": "2027-07-16", "term": "Bahar"}, {"date": "20-23 Temmuz 2027", "title": "Üç Ders Sınav Tarihleri", "sort": "2027-07-20", "term": "Bahar"}, {"date": "20-25 Temmuz 2027", "title": "Üç Ders Sınav Not Giriş Başlama ve Bitiş Tarihleri", "sort": "2027-07-20", "term": "Bahar"}];
      const TITLE_EN={'OBS’de derslerin bölümler tarafından açılması ve ders programlarının ilanı':'Courses opened on OBS by departments and timetables announced','Öğrenciler İçin Kayıt Yenileme Başlama ve Bitiş Tarihleri':'Student registration renewal period','Katkı Payı/ Materyal/ Öğrenim Ücreti Yatırma Tarihleri':'Tuition / contribution / material fee payment period','Danışman Onayı':'Advisor approval','Üniversite Yaşamına Uyum Haftası':'University orientation week','Derslerin Başlama ve Bitiş Tarihleri':'Start and end of classes','BİLİM ATEŞİ YAKMA TÖRENİ':'SCIENCE TORCH LIGHTING CEREMONY','Birim Başkanı Onayı':'Head of unit approval','Bölümlerde Öğrencilerle Danışmaların Yüz Yüze Görüşme Tarihleri':'Face-to-face advisor meetings with students in departments','Öğrenciler İçin Ders Ekleme Bırakma ve Mazeret Başlama Bitiş Tarihleri':'Add / drop and excused registration period for students','UÖ Yöntemi ile Okutulan 5(ı) Derslerinin Ara Sınav Tarihi':'Midterm date for 5(i) courses taught via distance learning','UÖ Yöntemi ile Okutulan GSS, Üni. Alan Dışı Derslerin Ara Sınav Tarihleri':'Midterm dates for distance-learning GSS / university non-field electives','Final Sınavı Tarihleri':'Final exam period','Final Sınavı Not Giriş Başlama ve Bitiş Tarihleri':'Final exam grade entry period','UÖ Yöntemi ile Okutulan 5(ı) Derslerinin Final Sınav Tarihi':'Final exam date for 5(i) courses taught via distance learning','UÖ Yöntemi ile Okutulan GSS, Üni. Alan Dışı Derslerin Final Sınav Tarihleri':'Final exam dates for distance-learning GSS / university non-field electives','Bütünleme Sınav Tarihleri':'Make-up exam period','Bütünleme Not Giriş Başlama ve Bitiş Tarihleri':'Make-up exam grade entry period','UÖ Yöntemi ile Okutulan 5(ı) Derslerinin Bütünleme Sınav Tarihi':'Make-up exam date for 5(i) courses taught via distance learning','UÖ Yöntemi ile Okutulan GSS, Üni. Alan Dışı Derslerin Bütünleme Sınav Tarihleri':'Make-up exam dates for distance-learning GSS / university non-field electives','Üç Ders Sınav Başvuru Tarihleri':'Three-course exam application dates','Üç Ders Sınav Tarihleri':'Three-course exam dates','Üç Ders Sınav Not Giriş Başlama ve Bitiş Tarihleri':'Three-course exam grade entry period'};
      const MONTHS_EN={'Ocak':'January','Şubat':'February','Mart':'March','Nisan':'April','Mayıs':'May','Haziran':'June','Temmuz':'July','Ağustos':'August','Eylül':'September','Ekim':'October','Kasım':'November','Aralık':'December'};
      const en=window.getPortalLang?.()==='en';
      const tTitle=t=>en?(TITLE_EN[t]||t):t;
      const tDate=d=>en?d.replace(/Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık/g,m=>MONTHS_EN[m]):d;
      const highlightTitles=['Derslerin Başlama ve Bitiş Tarihleri','BİLİM ATEŞİ YAKMA TÖRENİ','Final Sınavı Tarihleri','Bütünleme Sınav Tarihleri'];
      const counts={};
      const rows=new Map();
      dates.forEach(e=>{
        const countKey=e.term+'|'+e.title;
        const occurrence=counts[countKey]=(counts[countKey]||0)+1;
        const key=e.title+'|'+occurrence;
        if(!rows.has(key))rows.set(key,{title:tTitle(e.title),hl:highlightTitles.includes(e.title)});
        const row=rows.get(key);row[e.term]=tDate(e.date);
        if(e.title==='Danışman Onayı'||e.title==='Birim Başkanı Onayı')row.title=tTitle(e.title)+(occurrence===1?L(' (Kayıt yenileme)',' (registration renewal)'):L(' (Ders ekleme / bırakma)',' (add / drop)'));
      });
      const body=dialog.querySelector('.portal-modal-body');
      body.innerHTML=`<div class="academic-sheet"><table class="academic-table"><caption>${L('ANKARA ÜNİVERSİTESİ<br>ELEKTRİK-ELEKTRONİK MÜHENDİSLİĞİ<br>2026–2027 EĞİTİM-ÖĞRETİM YILI AKADEMİK TAKVİMİ','ANKARA UNIVERSITY<br>ELECTRICAL & ELECTRONICS ENGINEERING<br>2026–2027 ACADEMIC YEAR CALENDAR')}</caption><colgroup><col><col style="width:264px"><col style="width:264px"></colgroup><thead><tr><th scope="col">${L('OLAY / İŞLEM','EVENT / ACTION')}</th><th scope="col">${L('GÜZ YARIYILI','FALL SEMESTER')}</th><th scope="col">${L('BAHAR YARIYILI','SPRING SEMESTER')}</th></tr></thead><tbody>${[...rows.values()].map(e=>`<tr class="${e.hl?'academic-highlight':''}"><th scope="row">${escape(e.title)}</th><td>${escape(e.Güz||'—')}</td><td>${escape(e.Bahar||'—')}</td></tr>`).join('')}</tbody></table><div class="academic-footnotes">${L('<p>• Uyum haftası: yeni başlayan 1. sınıf öğrencileri için zorunludur.</p><p>• UÖ sınav tarihleri yalnızca ilgili uzaktan öğretim derslerini alan öğrenciler içindir.</p><p>—: Bu yarıyıl için tarih belirtilmemiştir. Bölüm ara sınavları ayrıca ilan edilir.</p><p>Kaynak: Ankara Üniversitesi 2026–2027 genel lisans akademik takvimi, s. 1–2.</p>','<p>• Orientation week is mandatory for incoming first-year students.</p><p>• Distance-learning (UÖ) exam dates apply only to students taking the related distance-learning courses.</p><p>—: No date specified for this semester. Department midterms are announced separately.</p><p>Source: Ankara University 2026–2027 general undergraduate academic calendar, pp. 1–2.</p>')}</div></div>`;
      const sheet=body.querySelector('.academic-sheet');
      const fit=()=>{
        if(!dialog.open)return;
        const viewportHeight=window.visualViewport?.height||window.innerHeight;
        const headerHeight=dialog.querySelector('.portal-modal-head').getBoundingClientRect().height;
        const availableHeight=Math.max(1,viewportHeight*.96-headerHeight-14);
        const scale=Math.min((document.documentElement.clientWidth*.98-26)/sheet.offsetWidth,availableHeight/sheet.offsetHeight,1);
        sheet.style.transform=`scale(${scale})`;
        dialog.style.width=`${Math.ceil(sheet.offsetWidth*scale)+26}px`;
        dialog.style.height=`${Math.ceil(sheet.offsetHeight*scale)+headerHeight+14}px`;
      };
      dialog.fitTimetable=fit;
      const observer=typeof ResizeObserver === 'function' ? new ResizeObserver(fit) : null;
      observer?.observe(body);
      dialog.disposeTimetable=()=>{dialog.unlockBackground();observer?.disconnect();window.removeEventListener('resize',fit);window.visualViewport?.removeEventListener('resize',fit);};
      window.addEventListener('resize',fit);
      window.visualViewport?.addEventListener('resize',fit);

    }
    show(dialog);
    dialog.lockBackground();
    dialog.fitTimetable();
  };

  window.portalCanEdit=()=>admin;
  window.portalEditCourse=code=>{if(!admin)return openSettings();openAdmin('courses');editRecord('courses',code);};

  const feedbackDialog=makeDialog('portalFeedbackDialog','İstek ve Görüşler','İstediğin kaynakları ve portal hakkındaki görüşlerini bize ilet.');
  function openFeedback(){
    setDialogTitle(feedbackDialog,L('İstek ve Görüşler','Feedback & Requests'),L('İstediğin kaynakları ve portal hakkındaki görüşlerini bize ilet.','Send us the resources you need and your thoughts about the portal.'));
    feedbackDialog.querySelector('.portal-modal-body').innerHTML=`<form id="portalFeedbackForm" class="portal-form">${field('course_code',L('Ders','Course'),'select','GENEL',courseOptions(),true)}${field('kind',L('Ne paylaşmak istiyorsun?','What would you like to share?'),'select','not',[['kitap',L('Kitap önerisi / isteği','Book suggestion / request')],['not',L('Ders notu / materyal isteği','Lecture notes / material request')],['site',L('Site / kaynak önerisi','Website / resource suggestion')],['gorus',L('Görüş ve diğer istekler','Feedback and other requests')]],true)}${field('message',L('İsteğin veya görüşün','Your request or feedback'),'textarea','',null,true)}${field('url',L('Kaynak bağlantısı (isteğe bağlı)','Resource link (optional)'),'url')}<div class="portal-grid">${field('name',L('Adın (isteğe bağlı)','Your name (optional)'))}${field('email',L('E-posta (isteğe bağlı)','Email (optional)'),'email')}</div><div class="portal-honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><p class="portal-help">${L('Mesajını yalnızca site yöneticisi görür. E-posta adresini, yanıt almak istersen paylaşabilirsin.','Only the site admin sees your message. Share your email if you would like a reply.')}</p><div id="portalFeedbackStatus" class="portal-status" role="status" aria-live="polite"></div><div class="portal-actions"><button class="portal-btn portal-btn-primary" type="submit">${L('Gönder','Send')}</button></div></form>`;
    byId('portalFeedbackForm').onsubmit=async e=>{
      e.preventDefault();const form=e.currentTarget; if(form.elements.website.value)return;
      const data=Object.fromEntries(new FormData(form));delete data.website;
      if(data.message.trim().length<10)return status('portalFeedbackStatus',L('Lütfen en az 10 karakter yaz.','Please write at least 10 characters.'),true);
      const button=form.querySelector('[type=submit]');button.disabled=true;status('portalFeedbackStatus',L('Gönderiliyor…','Sending…'));
      try{data.url=safeUrl(data.url);await request('/functions/v1/drive-proxy?mode=feedback',{method:'POST',body:data});form.reset();status('portalFeedbackStatus',L('Mesajın yöneticiye ulaştı. Teşekkürler!','Your message reached the admin. Thank you!'));}
      catch(error){status('portalFeedbackStatus',error.message,true);}finally{button.disabled=false;}
    };
    show(feedbackDialog);toggleMobileSidebar(false);
  }
  byId('portalFeedbackButton').onclick=openFeedback;
  const settingsDialog=makeDialog('portalSettingsDialog','Ayarlar','Görünüm ve yönetici hesabı');
  function openSettings(){
    setDialogTitle(settingsDialog,L('Ayarlar','Settings'),L('Görünüm ve yönetici hesabı','Appearance and admin account'));
    settingsDialog.querySelector('.portal-modal-body').innerHTML=`<div class="portal-form"><div class="portal-admin-row"><div><h3>${L('Görünüm','Appearance')}</h3><p>${L('Açık ve koyu tema arasında geçiş yap.','Switch between light and dark theme.')}</p></div><button type="button" class="portal-btn" id="portalTheme">${L('Temayı değiştir','Toggle theme')}</button></div><div class="portal-admin-row"><div><h3>${L('Dil','Language')}</h3><p>${L('Arayüz dilini seç.','Choose the interface language.')}</p></div><button type="button" class="portal-btn" id="portalLangToggle">${L('English','Türkçe')}</button></div><div class="portal-admin-row"><div><h3>${admin?L('Yönetici hesabı','Admin account'):L('Admin girişi','Admin login')}</h3><p>${admin?escape(session?.user?.email||L('Yönetici oturumu açık','Admin session active')):L('İçerikleri, önerileri ve takvimi yönet.','Manage content, suggestions and the calendar.')}</p></div><button type="button" class="portal-btn portal-btn-primary" id="portalOpenAdmin">${admin?L('Paneli aç','Open panel'):L('Giriş yap','Sign in')}</button></div>${admin?`<button type="button" class="portal-btn" id="portalLogout">${L('Çıkış yap','Sign out')}</button>`:''}<div id="portalSettingsStatus" role="status" class="portal-status"></div></div>`;
    byId('portalTheme').onclick=()=>byId('themeToggleBtn').click();
    byId('portalLangToggle').onclick=()=>window.setPortalLanguage?.(window.getPortalLang?.()==='en'?'tr':'en');
    byId('portalOpenAdmin').onclick=()=>{settingsDialog.close();admin?openAdmin():openLogin();};
    if(admin)byId('portalLogout').onclick=async()=>{try{await request('/auth/v1/logout',{method:'POST',auth:true});}catch{}endAdminSession();renderPublic();openSettings();};
    show(settingsDialog);
  }
  byId('portalSettingsButton').onclick=openSettings;
  const loginDialog=makeDialog('portalLoginDialog','Admin girişi','Yalnızca yetkili yönetici hesabı içerikleri değiştirebilir.');
  function openLogin(){
    setDialogTitle(loginDialog,L('Admin girişi','Admin Login'),L('Yalnızca yetkili yönetici hesabı içerikleri değiştirebilir.','Only the authorized admin account can change content.'));
    loginDialog.querySelector('.portal-modal-body').innerHTML=`<form id="portalLoginForm" class="portal-form">${field('email',L('E-posta','Email'),'email','',null,true)}${field('password',L('Şifre','Password'),'password')}<div class="portal-actions"><button type="submit" class="portal-btn portal-btn-primary">${L('Giriş yap','Sign in')}</button></div><p class="portal-help">${L('Yönetici hesabının e-posta adresi ve şifresiyle giriş yap. Öğrencilerin hesap açması gerekmez.','Sign in with the admin account email and password. Students do not need an account.')}</p><p id="portalLoginStatus" class="portal-status" role="status" aria-live="polite"></p></form>`;
    byId('portalLoginForm').onsubmit=async e=>{
      e.preventDefault();const form=e.currentTarget,button=form.querySelector('[type=submit]');button.disabled=true;
      try{if(!form.elements.password.value)throw new Error(T('Lütfen yönetici şifreni yaz.'));status('portalLoginStatus',T('Giriş yapılıyor…'));storeSession(await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email:form.elements.email.value.trim(),password:form.elements.password.value}}));await checkAdmin();if(!admin){storeSession(null);throw new Error(T('Bu hesabın yönetici yetkisi bulunmuyor.'));}form.reset();lastAdminActivity=Date.now();loginDialog.close();renderPublic();openAdmin();}
      catch(error){status('portalLoginStatus',error.message,true);}finally{form.elements.password.value='';button.disabled=false;}
    };
    show(loginDialog);
  }
  async function checkAdmin(){admin=!!(session&&await request('/rest/v1/rpc/is_portal_admin',{method:'POST',body:{},auth:true}));if(admin&&!session.user){session.user=await request('/auth/v1/user',{auth:true});storeSession(session);}}
  const adminDialog=makeDialog('portalAdminDialog',T('Yönetim Paneli'),T('Düzenlemelerini tamamladıktan sonra Yayımla düğmesine bas.'),true);
  adminDialog.querySelector('.portal-modal-body').insertAdjacentHTML('beforebegin',`<nav class="portal-admin-tabs" aria-label="${L("Yönetim bölümleri","Admin sections")}"></nav>`);
  adminDialog.insertAdjacentHTML('beforeend',`<div class="portal-admin-publish"><span id="portalPublishStatus" class="portal-status" role="status" aria-live="polite"></span><div class="portal-actions"><button type="button" id="portalDiscard" class="portal-btn">${L("Değişiklikleri geri al","Discard changes")}</button><button type="button" id="portalPublish" class="portal-btn portal-btn-primary">${L("Değişiklikleri yayımla","Publish changes")}</button></div></div>`);
  const tabs=[['feedback','Gelen öneriler'],['courses','Dersler / Sınıflar'],['resources','Kitap, not ve siteler'],['drive','Drive materyalleri'],['staff','Öğretim görevlileri'],['events','Takvim'],['sidebar','Bağlantılar'],['general','Site bilgileri'],['account','Hesabım']];
  function openAdmin(next='feedback'){
    if(!admin)return openLogin();if(!ready){openSettings();status('portalSettingsStatus',T('İçerik bağlantısı kurulamadı. Sayfayı yenileyip tekrar dene.'),true);return;}if(!draft)draft=copy(published);tab=next;renderAdmin();show(adminDialog);
  }
  function dirty(){return JSON.stringify(draft)!==JSON.stringify(published);}
  function updateDirty(){byId('portalPublish').disabled=busy||!dirty();byId('portalDiscard').disabled=busy||!dirty();status('portalPublishStatus',dirty()?T('Yayımlanmamış değişikliklerin var.'):T('Tüm değişiklikler yayımlandı.'));}
  byId('portalDiscard').onclick=async()=>{try{await loadPublished();draft=copy(published);renderAdmin();}catch(error){status('portalPublishStatus',error.message,true);}};
  byId('portalPublish').onclick=async()=>{
    if(!admin||busy||!dirty())return;busy=true;updateDirty();status('portalPublishStatus',T('Yayımlanıyor…'));
    try{revision=await request('/rest/v1/rpc/save_portal_content',{method:'POST',auth:true,body:{new_content:PortalSecurity.content(draft,copy(defaults)),expected_revision:revision}});published=PortalSecurity.content(draft,copy(defaults));draft=copy(published);applyContent();status('portalPublishStatus',T('Yayımlandı. Değişiklikler tüm ziyaretçilere açık.'));}
    catch(error){status('portalPublishStatus',error.message,true);}finally{busy=false;byId('portalPublish').disabled=!dirty();byId('portalDiscard').disabled=!dirty();}
  };
  function renderAdmin(){
    setDialogTitle(adminDialog,T('Yönetim Paneli'),T('Düzenlemelerini tamamladıktan sonra Yayımla düğmesine bas.'));
    adminDialog.querySelector('nav').setAttribute('aria-label',L('Yönetim bölümleri','Admin sections'));
    byId('portalDiscard').textContent=L('Değişiklikleri geri al','Discard changes');
    byId('portalPublish').textContent=L('Değişiklikleri yayımla','Publish changes');
    const nav=adminDialog.querySelector('nav');nav.innerHTML=tabs.map(([id,label])=>`<button type="button" class="portal-btn" data-tab="${id}" aria-selected="${tab===id}">${T(label)}</button>`).join('');
    nav.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{tab=button.dataset.tab;renderAdmin();});
    const body=adminDialog.querySelector('.portal-modal-body');
    if(tab==='feedback'){renderFeedback(body);updateDirty();return;}
    if(tab==='account'){renderAccount(body);updateDirty();return;}
    if(tab==='general'){renderGeneral(body);updateDirty();return;}
    if(tab==='drive'){renderDrive(body);updateDirty();return;}
    const key=tab==='courses'?'code':'id';
    const items=tab==='events'?[...draft.events].sort((a,b)=>a.date.localeCompare(b.date)):draft[tab];
    body.innerHTML=`<div class="portal-admin-toolbar"><p class="portal-help">${items.length}${L(" kayıt · Sıralama oklarıyla görünüm sırasını değiştirebilirsin."," records · Use the arrows to change the display order.")}</p><button type="button" class="portal-btn portal-btn-primary" data-add>${L("Yeni ekle","Add new")}</button></div><input class="portal-input" type="search" placeholder="${L("Bu bölümde ara…","Search this section…")}" aria-label="${L("Kayıt ara","Search records")}" style="margin-bottom:12px" data-filter><div class="portal-admin-list">${items.length?items.map(item=>`<div class="portal-admin-row" data-record="${escape(item[key])}"><div><h3>${escape(item.title||item.name||item.code)}</h3><p>${escape(tab==='events'?`${item.date} ${item.time||''} · ${item.courseCode}`:item.courseCode||item.code||item.email||item.url||'')}</p></div><div class="portal-actions"><button type="button" class="portal-icon-btn" data-move="-1" title="${L("Yukarı taşı","Move up")}" aria-label="${L("Yukarı taşı","Move up")}">↑</button><button type="button" class="portal-icon-btn" data-move="1" title="${L("Aşağı taşı","Move down")}" aria-label="${L("Aşağı taşı","Move down")}">↓</button><button type="button" class="portal-btn" data-edit>${L("Düzenle","Edit")}</button><button type="button" class="portal-btn portal-btn-danger" data-remove>${L("Kaldır","Remove")}</button></div></div>`).join(''):`<p class="portal-help">${L("Henüz kayıt yok. Yeni ekle düğmesiyle başlayabilirsin.","No records yet. Use Add new to get started.")}</p>`}</div>`;
    body.querySelector('[data-add]').onclick=()=>editRecord(tab);
    body.querySelector('[data-filter]').oninput=e=>body.querySelectorAll('[data-record]').forEach(row=>row.hidden=!row.textContent.toLocaleLowerCase('tr').includes(e.target.value.toLocaleLowerCase('tr')));
    body.querySelectorAll('[data-record]').forEach(row=>{
      const id=row.dataset.record;
      row.querySelector('[data-edit]').onclick=()=>editRecord(tab,id);
      row.querySelector('[data-remove]').onclick=()=>{
        draft[tab]=draft[tab].filter(item=>item[key]!==id);
        if(tab==='courses'){draft.resources=draft.resources.filter(r=>r.courseCode!==id);draft.events=draft.events.filter(ev=>ev.courseCode!==id);}
        if(tab==='staff')draft.courses.forEach(c=>{c.instructorIds=(c.instructorIds||[]).filter(s=>s!==id);c.assistantIds=(c.assistantIds||[]).filter(s=>s!==id);});
        renderAdmin();
      };
      row.querySelectorAll('[data-move]').forEach(button=>button.onclick=()=>{const arr=draft[tab],index=arr.findIndex(item=>item[key]===id),next=index+Number(button.dataset.move);if(next>=0&&next<arr.length)[arr[index],arr[next]]=[arr[next],arr[index]];renderAdmin();});
    });updateDirty();
  }
  const editor=makeDialog('portalRecordDialog',T('Kaydı düzenle'));
  function editRecord(type,id=null){
    if(!admin)return;const key=type==='courses'?'code':'id',item=copy(draft[type].find(r=>r[key]===id)||{});
    let fields='';
    const staffOptions=draft.staff.map(s=>[s.id,`${s.title} ${s.name}`]);
    if(type==='courses')fields=`<div class="portal-grid">${field('code',T('Ders kodu'),'text',item.code||'',null,true)}${field('name',T('Ders adı'),'text',item.name||'',null,true)}${field('year',T('Sınıf'),'select',String(item.year||1),[1,2,3,4].map(n=>[String(n),formatClassOrdinal(n)]),true)}${field('semester',T('Dönem'),'select',item.semester||'guz',[['guz',T('Güz')],['bahar',T('Bahar')]],true)}${field('shortName',T('Menüdeki kısa ders adı'),'text',item.shortName||'')}${field('credits',T('Kredi / AKTS'),'text',item.credits||'')}${field('icon',T('Simge (Lucide adı)'),'text',item.icon||'book-open')}</div>${field('instructorIds',T('Öğretim görevlileri (çoklu seçim)'),'multiple',item.instructorIds||[],staffOptions)}${field('assistantIds',T('Araştırma görevlileri (çoklu seçim)'),'multiple',item.assistantIds||[],staffOptions)}${field('banner',T('Kapak görseli bağlantısı (isteğe bağlı)'),'text',item.banner||'')}<div class="portal-grid">${field('bannerPos',T('Kapak hizası'),'text',item.bannerPos||'center center')}${field('bannerRatio',T('Kapak oranı (genişlik / yükseklik)'),'number',item.bannerRatio||1.7778)}</div>`;
    if(type==='staff')fields=`<div class="portal-grid">${field('name',T('Ad soyad'),'text',item.name||'',null,true)}${field('title',T('Unvan'),'text',item.title||'')}${field('category',T('Kategori'),'select',item.category||'faculty',[['faculty',T('Öğretim üyesi')],['assistant',T('Araştırma görevlisi')],['parttime',T('Yarı zamanlı')],['service',T('Diğer bölüm')]])}${field('email',T('E-posta'),'email',item.email||'')}${field('phone',T('Telefon'),'text',item.phone||'')}${field('room',T('Oda'),'text',item.room||'')}</div>${field('photo',T('Fotoğraf bağlantısı'),'text',item.photo||'')}${field('avesisUrl',T('AVESİS bağlantısı'),'url',item.avesisUrl||'')}${field('personalUrl',T('Kişisel site'),'url',item.personalUrl||'')}`;
    if(type==='events')fields=`${field('title',T('Etkinlik / sınav adı'),'text',item.title||'',null,true)}${field('courseCode',T('Ders / kategori'),'select',item.courseCode||'GENEL',courseOptions(),true)}${field('year',T('Genel etkinliğin sınıfı (ders tarihleri dersin sınıfını kullanır)'),'select',String(item.year||''),[['',T('Tüm sınıflar')],...[1,2,3,4].map(n=>[String(n),formatClassOrdinal(n)])])}<div class="portal-grid">${field('date',T('Tarih'),'date',item.date||getTodayDateStr(),null,true)}${field('time',T('Saat (isteğe bağlı)'),'time',item.time||'')}</div>${field('location',T('Yer / açıklama'),'text',item.location||'')}`;
    if(type==='resources')fields=`${field('title',T('Kaynak adı'),'text',item.title||'',null,true)}${field('courseCode',T('İlgili ders'),'select',item.courseCode||draft.courses[0]?.code,draft.courses.map(c=>[c.code,`${c.code} — ${c.name}`]),true)}${field('kind',T('Tür'),'select',item.kind||'site',[['kitap',T('Kitap')],['not',T('Ders notu / dosya')],['site',T('Site / video')]])}${field('url',T('Kaynak bağlantısı'),'url',item.url||'',null,true)}<p class="portal-help">${L("Paylaşıma açık Drive dosyasının, kitabın, notun veya sitenin bağlantısını ekleyebilirsin. Kaynak ilgili dersin sayfasında görünür.","Add a public link to a Drive file, book, notes or website. The resource appears on the related course page.")}</p>`;
    if(type==='sidebar')fields=`${field('title',T('Bağlantı adı'),'text',item.title||'',null,true)}${field('url',T('Bağlantı'),'url',item.url||'',null,true)}`;
    editor.querySelector('.portal-modal-body').innerHTML=`<form id="portalRecordForm" class="portal-form">${fields}<p id="portalRecordStatus" class="portal-status" role="status"></p><button type="submit" class="portal-btn portal-btn-primary">${L("Taslağa kaydet","Save to draft")}</button></form>`;
    byId('portalRecordForm').onsubmit=e=>{
      e.preventDefault();const form=e.currentTarget,data=Object.fromEntries(new FormData(form));
      try{
        const record={...item,...data};
        ['url','avesisUrl','personalUrl'].forEach(k=>{if(k in record)record[k]=safeUrl(record[k]);});
        ['photo','banner'].forEach(k=>{if(k in record){const normalized=PortalSecurity.image(record[k]);if(record[k]&&!normalized)throw new Error(T('Görsel için geçerli bir bağlantı veya bu sitenin assets/ ya da bannerlar/ yolunu kullan.'));record[k]=normalized;}});
        if(type==='courses'){
          record.code=record.code.toUpperCase().trim();if(!/^[A-Z0-9_-]{2,30}$/.test(record.code))throw new Error(T('Ders kodu 2–30 harf, rakam, tire veya alt çizgi içermeli.'));
          if(draft.courses.some(c=>c.code===record.code&&c.code!==id))throw new Error(T('Bu ders kodu zaten var.'));
          record.year=Number(record.year);record.bannerRatio=Number(record.bannerRatio)||1.7778;record.shortName=record.shortName||record.name;record.instructorIds=[...form.elements.instructorIds.selectedOptions].map(o=>o.value);record.assistantIds=[...form.elements.assistantIds.selectedOptions].map(o=>o.value);record.links=[];
          if(id&&id!==record.code){draft.resources.forEach(r=>{if(r.courseCode===id)r.courseCode=record.code;});draft.events.forEach(ev=>{if(ev.courseCode===id)ev.courseCode=record.code;});}
        }else record.id=item.id||uid();
        if(type==='events')record.year=record.courseCode==='GENEL'&&record.year?Number(record.year):null;
        if(type==='staff')record.courses=draft.courses.filter(c=>(c.instructorIds||[]).includes(record.id)||(c.assistantIds||[]).includes(record.id)).map(c=>c.code);
        if(type==='resources')record.icon=record.kind==='site'?'external-link':'book-open';
        if(type==='courses' && id && record.code!==id)record.sourceCode=item.sourceCode||id;
        const index=draft[type].findIndex(r=>r[key]===id);if(index<0)draft[type].push(record);else draft[type][index]=record;
        editor.close();renderAdmin();
      }catch(error){status('portalRecordStatus',error.message,true);}
    };
    setDialogTitle(editor,T('Kaydı düzenle'));show(editor);
  }
  function renderGeneral(body){body.innerHTML=`<form id="portalGeneralForm" class="portal-form">${field('name',T('Portal adı'),'text',draft.general.name,null,true)}${field('description',T('Ana sayfa açıklaması'),'textarea',draft.general.description,null,true)}${field('footer',T('Alt bilgi'),'text',draft.general.footer)}<button type="submit" class="portal-btn portal-btn-primary">${L("Taslağa kaydet","Save to draft")}</button></form>`;byId('portalGeneralForm').onsubmit=e=>{e.preventDefault();draft.general=Object.fromEntries(new FormData(e.currentTarget));updateDirty();};}
  function renderDrive(body){
    const nodes=[];function walk(list,path=''){for(const n of list||[]){nodes.push({...n,path});if(n.children)walk(n.children,`${path}${n.name} / `);}}walk(sourceTree);
    body.innerHTML=`<p class="portal-help" style="margin-bottom:12px">${L("Drive materyallerini portaldan gizleyebilir veya görünen adını değiştirebilirsin. Drive'daki asıl dosyalar korunur. Yeni kaynak eklemek için Kitap, not ve siteler bölümünü kullan.","Hide Drive materials from the portal or change their display names. Original Drive files are preserved. To add a resource, use Books, notes and websites.")}</p><input class="portal-input" data-drive-filter placeholder="${L("Dosya veya klasör ara…","Search files or folders…")}" aria-label="${L("Drive materyali ara","Search Drive materials")}" style="margin-bottom:12px"><div class="portal-admin-list">${nodes.length?nodes.map(n=>`<div class="portal-admin-row" data-drive="${escape(n.id)}"><div><h3>${escape(draft.driveEdits[n.id]?.name||n.name)}</h3><p>${escape(n.path||T('Ana klasör'))}</p></div><div class="portal-actions"><button type="button" class="portal-btn" data-rename>${L("Adını düzenle","Rename")}</button><button type="button" class="portal-btn" data-toggle>${draft.hiddenDrive.includes(n.id)?T('Yeniden göster'):T('Gizle')}</button></div></div>`).join(''):`<p class="portal-help">${L("Drive listesi henüz yüklenmedi. Biraz sonra bu sekmeyi tekrar aç.","The Drive list has not loaded yet. Reopen this tab shortly.")}</p>`}</div>`;
    body.querySelector('[data-drive-filter]').oninput=e=>body.querySelectorAll('[data-drive]').forEach(row=>row.hidden=!row.textContent.toLocaleLowerCase('tr').includes(e.target.value.toLocaleLowerCase('tr')));
    body.querySelectorAll('[data-drive]').forEach(row=>{const id=row.dataset.drive;
      row.querySelector('[data-toggle]').onclick=()=>{draft.hiddenDrive=draft.hiddenDrive.includes(id)?draft.hiddenDrive.filter(x=>x!==id):[...draft.hiddenDrive,id];renderAdmin();};
      if(!nodes.find(n=>n.id===id).path && defaults.courses.some(c=>c.code===nodes.find(n=>n.id===id).name.toUpperCase().trim())) { row.querySelector('[data-rename]').disabled=true;row.querySelector('[data-rename]').title=T('Ders adını Dersler / Sınıflar bölümünden düzenle.'); }
      row.querySelector('[data-rename]').onclick=()=>{editor.querySelector('.portal-modal-body').innerHTML=`<form id="portalRenameForm" class="portal-form">${field('name',T('Portalda görünen ad'),'text',draft.driveEdits[id]?.name||nodes.find(n=>n.id===id).name,null,true)}<button class="portal-btn portal-btn-primary">${L("Taslağa kaydet","Save to draft")}</button></form>`;byId('portalRenameForm').onsubmit=e=>{e.preventDefault();draft.driveEdits[id]={name:e.currentTarget.elements.name.value.trim()};editor.close();renderAdmin();};show(editor);};
    });
  }
  async function renderFeedback(body){
    body.innerHTML=`<p class="portal-help">${L("Öneriler yükleniyor…","Loading feedback…")}</p>`;
    try{
      const rows=await request(`/rest/v1/portal_feedback?select=id,course_code,kind,message,url,name,email,status,created_at&order=created_at.desc&limit=30&offset=${feedbackPage*30}`,{auth:true});
      if(tab!=='feedback'||!admin||!session)return;
      body.innerHTML=`<div class="portal-admin-toolbar"><p class="portal-help">${L("Öğrencilerin gönderdiği istek ve görüşler · Sayfa ","Student requests and feedback · Page ")}${feedbackPage+1}</p><button class="portal-btn" data-refresh>${L("Yenile","Refresh")}</button></div><div class="portal-admin-list">${rows.length?rows.map(r=>`<article class="portal-feedback-card"><div class="portal-actions" style="justify-content:space-between"><strong style="font-size:12px">${escape(r.course_code)} · ${escape(({kitap:T('Kitap'),not:T('Not'),site:T('Site'),gorus:T('Görüş')})[r.kind])}</strong><span class="portal-help">${escape(new Date(r.created_at).toLocaleString(L('tr-TR','en-GB')))}</span></div><p class="portal-feedback-message">${escape(r.message)}</p>${r.url?`<a class="portal-help" href="${escape(safeUrl(r.url,false))}" target="_blank" rel="noopener noreferrer">${L("Kaynak bağlantısını aç ↗","Open resource link ↗")}</a>`:''}<p class="portal-help">${escape(r.name||T('İsimsiz'))} ${escape(r.email||'')}</p><label class="portal-field" style="margin-top:10px">${L("Durum","Status")}<select class="portal-input" data-feedback-id="${escape(r.id)}">${[['yeni',T('Yeni')],['inceleniyor',T('İnceleniyor')],['tamamlandi',T('Tamamlandı')],['arsiv',T('Arşiv')]].map(([v,l])=>`<option value="${v}" ${v===r.status?'selected':''}>${l}</option>`).join('')}</select></label></article>`).join(''):`<p class="portal-help">${L("Bu sayfada henüz istek veya görüş bulunmuyor.","No requests or feedback on this page yet.")}</p>`}</div><div class="portal-actions" style="margin-top:12px"><button class="portal-btn" data-prev ${feedbackPage===0?'disabled':''}>${L("Önceki","Previous")}</button><button class="portal-btn" data-next ${rows.length<30?'disabled':''}>${L("Sonraki","Next")}</button></div><p id="portalFeedbackAdminStatus" role="status" class="portal-status"></p>`;
      body.querySelector('[data-refresh]').onclick=()=>renderFeedback(body);body.querySelector('[data-prev]').onclick=()=>{feedbackPage--;renderFeedback(body);};body.querySelector('[data-next]').onclick=()=>{feedbackPage++;renderFeedback(body);};
      body.querySelectorAll('[data-feedback-id]').forEach(select=>select.onchange=async()=>{select.disabled=true;try{await request('/rest/v1/portal_feedback?id=eq.'+encodeURIComponent(select.dataset.feedbackId),{method:'PATCH',auth:true,body:{status:select.value}});status('portalFeedbackAdminStatus',T('Öneri durumu kaydedildi.'));}catch(error){status('portalFeedbackAdminStatus',error.message,true);}finally{select.disabled=false;}});
    }catch(error){if(admin&&session)body.innerHTML=`<p class="portal-status" data-error="true">${escape(error.message)}</p>`;}
  }
  function renderAccount(body){
    body.innerHTML=`<p class="portal-help" style="margin-bottom:16px">${escape(session?.user?.email||T('Yönetici hesabı'))}</p><form id="portalPasswordForm" class="portal-form">${field('current_password',T('Mevcut şifre'),'password','',null,true)}${field('password',T('Yeni şifre'),'password','',null,true)}${field('confirmation',T('Yeni şifre (tekrar)'),'password','',null,true)}<p class="portal-help">${L("En az 12 karakter kullan. Yeni şifren bir sonraki girişte geçerli olur.","Use at least 12 characters. Your new password will apply on your next sign-in.")}</p><button class="portal-btn">${L("Şifreyi kaydet","Save password")}</button><p id="portalPasswordStatus" class="portal-status" role="status"></p></form>`;
    byId('portalPasswordForm').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget,b=f.querySelector('button');b.disabled=true;try{if(f.elements.password.value.length<12)throw new Error(T('En az 12 karakter kullan.'));if(f.elements.password.value!==f.elements.confirmation.value)throw new Error(T('Şifreler eşleşmiyor.'));await request('/auth/v1/user',{method:'PUT',auth:true,body:{password:f.elements.password.value,current_password:f.elements.current_password.value}});f.reset();status('portalPasswordStatus',T('Şifren kaydedildi.'));}catch(error){status('portalPasswordStatus',error.message,true);}finally{f.reset();b.disabled=false;}};
  }
  async function loadPublished(){
    const rows=await request('/rest/v1/portal_content?id=eq.1&select=content,revision');
    if(!rows?.length)throw new Error(T('Portal içerik kaydı bulunamadı.'));
    published=PortalSecurity.content(rows[0].content,copy(defaults));revision=rows[0].revision;ready=true;window.portalSharedContentReady=true;applyContent();
  }
  async function initialize(){
    try{await loadPublished();}catch(error){console.warn('Portal content unavailable:',error.message);ready=false;}
    if(session){try{await checkAdmin();renderPublic();if(admin&&sessionStorage.getItem('anku_open_admin')){sessionStorage.removeItem('anku_open_admin');openAdmin();}}catch{storeSession(null);admin=false;}}
  }
  window.addEventListener('beforeunload',e=>{if(draft&&dirty()){e.preventDefault();e.returnValue='';}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!adminDialog.open&&!(draft&&dirty()))loadPublished().catch(()=>{});});
  setInterval(()=>{if(!adminDialog.open&&!document.hidden&&!(draft&&dirty()))loadPublished().catch(()=>{});},60000);
  initialize();
})();
