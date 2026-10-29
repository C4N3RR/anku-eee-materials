(() => {
  'use strict';
  const backend = window.PORTAL_BACKEND;
  const copy = value => JSON.parse(JSON.stringify(value));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId = id => document.getElementById(id);
  const uid = () => crypto.randomUUID();
  const originalWelcomeHub = renderWelcomeHub;
  renderWelcomeHub = function(...args) { const result = originalWelcomeHub(...args); applyBrand(); return result; };
  const safeUrl = (value, optional = true) => {
    if (!value && optional) return '';
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Bağlantılar https:// veya http:// ile başlamalı.');
    return url.href;
  };
  const defaults = {
    courses: copy(CURRICULUM_COURSES).map(c=>({...c,shortName:SHORT_SIDEBAR_COURSE_LABELS[c.code]||c.name})), staff: copy(STAFF_DATA), events: [],
    resources: CURRICULUM_COURSES.flatMap(c => (c.links || []).map((link,i) => ({...link,id:`${c.code}-${i}`,courseCode:c.code,kind:'site'}))),
    sidebar: [...document.querySelectorAll('[data-portal-links] a:not(#sidebarDriveLink)')].map(a => ({id:uid(),title:a.textContent.trim(),url:a.href})),
    hiddenDrive: [], driveEdits: {},
    general: {name:'ANKU EEE Portal',description:'Ders materyalleri, sınav tarihleri ve bölüm bilgileri tek yerde.',footer:'Built by Caner Davarcı'}
  };
  let published = copy(defaults), draft = null, revision = 0, admin = false, tab = 'feedback', busy = false, ready = false;
  let sourceTree = driveTree ? copy(driveTree) : null, appliedTree = null, feedbackPage = 0;
  let session = null;
  try { session = JSON.parse(sessionStorage.getItem('anku_admin_session') || 'null'); } catch {}
  let refreshPromise = null;
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
    if (!backend?.url || !backend?.key) throw new Error('Bağlantı henüz hazır değil. Lütfen daha sonra tekrar deneyin.');
    if (auth && session && session.expires_at < Date.now()/1000 + 60) {
      if (!refreshPromise) refreshPromise = request('/auth/v1/token?grant_type=refresh_token', {method:'POST',body:{refresh_token:session.refresh_token}})
        .then(storeSession).catch(error => {storeSession(null);admin=false;throw error;}).finally(()=>{refreshPromise=null;});
      await refreshPromise;
    }
    if (auth && !session?.access_token) throw new Error('Yönetici oturumunuz sona erdi. Yeniden giriş yapın.');
    const response = await fetch(backend.url + path, {method, headers:{apikey:backend.key,'Content-Type':'application/json',...(auth?{Authorization:`Bearer ${session.access_token}`} : {}),...headers},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(18000)});
    const text = await response.text(); let result;
    try {result=text?JSON.parse(text):null;} catch {result=null;}
    if (!response.ok) {
      const message = result?.msg || result?.message || result?.error_description || result?.error;
      throw new Error(message || 'İşlem tamamlanamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
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
  const courseOptions = () => [['GENEL','Genel / Bölüm'],...(draft||published).courses.map(c=>[c.code,`${c.code} — ${c.name}`])];
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
    const sub=document.querySelector('.portal-hero-sub');if(sub)sub.textContent=g.description;
    const footer=document.querySelector('footer span.font-medium');if(footer)footer.textContent=g.footer;
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
    const ul=document.querySelector('[data-portal-links]');
    const drive=byId('sidebarDriveLink')?.closest('li');
    ul.querySelectorAll('li').forEach(li=>{if(li!==drive)li.remove();});
    for(const link of published.sidebar){const li=document.createElement('li');li.innerHTML=`<a href="${escape(safeUrl(link.url,false))}" target="_blank" rel="noopener noreferrer" title="${escape(link.title)}" class="sidebar-nav-btn flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition"><i data-lucide="external-link" class="size-4 shrink-0 text-muted-foreground"></i><span class="sidebar-hide-collapsed flex-1 truncate">${escape(link.title)}</span></a>`;ul.insertBefore(li,drive);}
    renderPublic();
  }
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
  window.portalCanEdit=()=>admin;
  window.portalEditCourse=code=>{if(!admin)return openSettings();openAdmin('courses');editRecord('courses',code);};

  const feedbackDialog=makeDialog('portalFeedbackDialog','İstek ve Görüşler','İstediğin kaynakları ve portal hakkındaki görüşlerini bize ilet.');
  function openFeedback(){
    feedbackDialog.querySelector('.portal-modal-body').innerHTML=`<form id="portalFeedbackForm" class="portal-form">${field('course_code','Ders','select','GENEL',courseOptions(),true)}${field('kind','Ne paylaşmak istiyorsun?','select','not',[['kitap','Kitap önerisi / isteği'],['not','Ders notu / materyal isteği'],['site','Site / kaynak önerisi'],['gorus','Görüş ve diğer istekler']],true)}${field('message','İsteğin veya görüşün','textarea','',null,true)}${field('url','Kaynak bağlantısı (isteğe bağlı)','url')}<div class="portal-grid">${field('name','Adın (isteğe bağlı)')}${field('email','E-posta (isteğe bağlı)','email')}</div><div class="portal-honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><p class="portal-help">Mesajını yalnızca site yöneticisi görür. E-posta adresini, yanıt almak istersen paylaşabilirsin.</p><div id="portalFeedbackStatus" class="portal-status" role="status" aria-live="polite"></div><div class="portal-actions"><button class="portal-btn portal-btn-primary" type="submit">Gönder</button></div></form>`;
    byId('portalFeedbackForm').onsubmit=async e=>{
      e.preventDefault();const form=e.currentTarget; if(form.elements.website.value)return;
      const data=Object.fromEntries(new FormData(form));delete data.website;
      if(data.message.trim().length<10)return status('portalFeedbackStatus','Lütfen en az 10 karakter yaz.',true);
      const button=form.querySelector('[type=submit]');button.disabled=true;status('portalFeedbackStatus','Gönderiliyor…');
      try{data.url=safeUrl(data.url);let token=localStorage.getItem('anku_feedback_client');if(!token){token=uid();localStorage.setItem('anku_feedback_client',token);}await request('/rest/v1/rpc/submit_portal_feedback',{method:'POST',body:{...data,client_token:token}});form.reset();status('portalFeedbackStatus','Mesajın yöneticiye ulaştı. Teşekkürler!');}
      catch(error){status('portalFeedbackStatus',error.message,true);}finally{button.disabled=false;}
    };
    show(feedbackDialog);toggleMobileSidebar(false);
  }
  byId('portalFeedbackButton').onclick=openFeedback;
  const settingsDialog=makeDialog('portalSettingsDialog','Ayarlar','Görünüm ve yönetici hesabı');
  function openSettings(){
    settingsDialog.querySelector('.portal-modal-body').innerHTML=`<div class="portal-form"><div class="portal-admin-row"><div><h3>Görünüm</h3><p>Açık ve koyu tema arasında geçiş yap.</p></div><button type="button" class="portal-btn" id="portalTheme">Temayı değiştir</button></div><div class="portal-admin-row"><div><h3>${admin?'Yönetici hesabı':'Admin girişi'}</h3><p>${admin?escape(session?.user?.email||'Yönetici oturumu açık'):'İçerikleri, önerileri ve takvimi yönet.'}</p></div><button type="button" class="portal-btn portal-btn-primary" id="portalOpenAdmin">${admin?'Paneli aç':'Giriş yap'}</button></div>${admin?`<button type="button" class="portal-btn" id="portalLogout">Çıkış yap</button>`:''}<div id="portalSettingsStatus" role="status" class="portal-status"></div></div>`;
    byId('portalTheme').onclick=()=>byId('themeToggleBtn').click();
    byId('portalOpenAdmin').onclick=()=>{settingsDialog.close();admin?openAdmin():openLogin();};
    if(admin)byId('portalLogout').onclick=async()=>{try{await request('/auth/v1/logout',{method:'POST',auth:true});}catch{}storeSession(null);admin=false;renderPublic();openSettings();};
    show(settingsDialog);
  }
  byId('portalSettingsButton').onclick=openSettings;
  const loginDialog=makeDialog('portalLoginDialog','Admin girişi','Yalnızca yetkili yönetici hesabı içerikleri değiştirebilir.');
  function openLogin(){
    loginDialog.querySelector('.portal-modal-body').innerHTML=`<form id="portalLoginForm" class="portal-form">${field('email','E-posta','email','',null,true)}${field('password','Şifre','password')}<div class="portal-actions"><button type="submit" class="portal-btn portal-btn-primary">Giriş yap</button></div><p class="portal-help">Yönetici hesabının e-posta adresi ve şifresiyle giriş yap. Öğrencilerin hesap açması gerekmez.</p><p id="portalLoginStatus" class="portal-status" role="status" aria-live="polite"></p></form>`;
    byId('portalLoginForm').onsubmit=async e=>{
      e.preventDefault();const form=e.currentTarget,button=form.querySelector('[type=submit]');button.disabled=true;
      try{if(!form.elements.password.value)throw new Error('Lütfen yönetici şifreni yaz.');status('portalLoginStatus','Giriş yapılıyor…');storeSession(await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email:form.elements.email.value.trim(),password:form.elements.password.value}}));await checkAdmin();if(!admin){storeSession(null);throw new Error('Bu hesabın yönetici yetkisi bulunmuyor.');}loginDialog.close();renderPublic();openAdmin();}
      catch(error){status('portalLoginStatus',error.message,true);}finally{button.disabled=false;}
    };
    show(loginDialog);
  }
  async function checkAdmin(){admin=!!(session&&await request('/rest/v1/rpc/is_portal_admin',{method:'POST',body:{},auth:true}));if(admin&&!session.user){session.user=await request('/auth/v1/user',{auth:true});storeSession(session);}}
  const adminDialog=makeDialog('portalAdminDialog','Yönetim Paneli','Düzenlemelerini tamamladıktan sonra Yayımla düğmesine bas.',true);
  adminDialog.querySelector('.portal-modal-body').insertAdjacentHTML('beforebegin','<nav class="portal-admin-tabs" aria-label="Yönetim bölümleri"></nav>');
  adminDialog.insertAdjacentHTML('beforeend','<div class="portal-admin-publish"><span id="portalPublishStatus" class="portal-status" role="status" aria-live="polite"></span><div class="portal-actions"><button type="button" id="portalDiscard" class="portal-btn">Değişiklikleri geri al</button><button type="button" id="portalPublish" class="portal-btn portal-btn-primary">Değişiklikleri yayımla</button></div></div>');
  const tabs=[['feedback','Gelen öneriler'],['courses','Dersler / Sınıflar'],['resources','Kitap, not ve siteler'],['drive','Drive materyalleri'],['staff','Öğretim görevlileri'],['events','Takvim'],['sidebar','Bağlantılar'],['general','Site bilgileri'],['account','Hesabım']];
  function openAdmin(next='feedback'){
    if(!admin)return openLogin();if(!ready){openSettings();status('portalSettingsStatus','İçerik bağlantısı kurulamadı. Sayfayı yenileyip tekrar dene.',true);return;}if(!draft)draft=copy(published);tab=next;renderAdmin();show(adminDialog);
  }
  function dirty(){return JSON.stringify(draft)!==JSON.stringify(published);}
  function updateDirty(){byId('portalPublish').disabled=busy||!dirty();byId('portalDiscard').disabled=busy||!dirty();status('portalPublishStatus',dirty()?'Yayımlanmamış değişikliklerin var.':'Tüm değişiklikler yayımlandı.');}
  byId('portalDiscard').onclick=async()=>{try{await loadPublished();draft=copy(published);renderAdmin();}catch(error){status('portalPublishStatus',error.message,true);}};
  byId('portalPublish').onclick=async()=>{
    if(!admin||busy||!dirty())return;busy=true;updateDirty();status('portalPublishStatus','Yayımlanıyor…');
    try{revision=await request('/rest/v1/rpc/save_portal_content',{method:'POST',auth:true,body:{new_content:draft,expected_revision:revision}});published=copy(draft);applyContent();status('portalPublishStatus','Yayımlandı. Değişiklikler tüm ziyaretçilere açık.');}
    catch(error){status('portalPublishStatus',error.message,true);}finally{busy=false;byId('portalPublish').disabled=!dirty();byId('portalDiscard').disabled=!dirty();}
  };
  function renderAdmin(){
    const nav=adminDialog.querySelector('nav');nav.innerHTML=tabs.map(([id,label])=>`<button type="button" class="portal-btn" data-tab="${id}" aria-selected="${tab===id}">${label}</button>`).join('');
    nav.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{tab=button.dataset.tab;renderAdmin();});
    const body=adminDialog.querySelector('.portal-modal-body');
    if(tab==='feedback'){renderFeedback(body);updateDirty();return;}
    if(tab==='account'){renderAccount(body);updateDirty();return;}
    if(tab==='general'){renderGeneral(body);updateDirty();return;}
    if(tab==='drive'){renderDrive(body);updateDirty();return;}
    const key=tab==='courses'?'code':'id';
    const items=tab==='events'?[...draft.events].sort((a,b)=>a.date.localeCompare(b.date)):draft[tab];
    body.innerHTML=`<div class="portal-admin-toolbar"><p class="portal-help">${items.length} kayıt · Sıralama oklarıyla görünüm sırasını değiştirebilirsin.</p><button type="button" class="portal-btn portal-btn-primary" data-add>Yeni ekle</button></div><input class="portal-input" type="search" placeholder="Bu bölümde ara…" aria-label="Kayıt ara" style="margin-bottom:12px" data-filter><div class="portal-admin-list">${items.length?items.map(item=>`<div class="portal-admin-row" data-record="${escape(item[key])}"><div><h3>${escape(item.title||item.name||item.code)}</h3><p>${escape(tab==='events'?`${item.date} ${item.time||''} · ${item.courseCode}`:item.courseCode||item.code||item.email||item.url||'')}</p></div><div class="portal-actions"><button type="button" class="portal-icon-btn" data-move="-1" title="Yukarı taşı" aria-label="Yukarı taşı">↑</button><button type="button" class="portal-icon-btn" data-move="1" title="Aşağı taşı" aria-label="Aşağı taşı">↓</button><button type="button" class="portal-btn" data-edit>Düzenle</button><button type="button" class="portal-btn portal-btn-danger" data-remove>Kaldır</button></div></div>`).join(''):'<p class="portal-help">Henüz kayıt yok. Yeni ekle düğmesiyle başlayabilirsin.</p>'}</div>`;
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
  const editor=makeDialog('portalRecordDialog','Kaydı düzenle');
  function editRecord(type,id=null){
    if(!admin)return;const key=type==='courses'?'code':'id',item=copy(draft[type].find(r=>r[key]===id)||{});
    let fields='';
    const staffOptions=draft.staff.map(s=>[s.id,`${s.title} ${s.name}`]);
    if(type==='courses')fields=`<div class="portal-grid">${field('code','Ders kodu','text',item.code||'',null,true)}${field('name','Ders adı','text',item.name||'',null,true)}${field('year','Sınıf','select',String(item.year||1),[1,2,3,4].map(n=>[String(n),`${n}. Sınıf`]),true)}${field('semester','Dönem','select',item.semester||'guz',[['guz','Güz'],['bahar','Bahar']],true)}${field('shortName','Menüdeki kısa ders adı','text',item.shortName||'')}${field('credits','Kredi / AKTS','text',item.credits||'')}${field('icon','Simge (Lucide adı)','text',item.icon||'book-open')}</div>${field('instructorIds','Öğretim görevlileri (çoklu seçim)','multiple',item.instructorIds||[],staffOptions)}${field('assistantIds','Araştırma görevlileri (çoklu seçim)','multiple',item.assistantIds||[],staffOptions)}${field('banner','Kapak görseli bağlantısı (isteğe bağlı)','text',item.banner||'')}<div class="portal-grid">${field('bannerPos','Kapak hizası','text',item.bannerPos||'center center')}${field('bannerRatio','Kapak oranı (genişlik / yükseklik)','number',item.bannerRatio||1.7778)}</div>`;
    if(type==='staff')fields=`<div class="portal-grid">${field('name','Ad soyad','text',item.name||'',null,true)}${field('title','Unvan','text',item.title||'')}${field('category','Kategori','select',item.category||'faculty',[['faculty','Öğretim üyesi'],['assistant','Araştırma görevlisi'],['parttime','Yarı zamanlı'],['service','Diğer bölüm']])}${field('email','E-posta','email',item.email||'')}${field('phone','Telefon','text',item.phone||'')}${field('room','Oda','text',item.room||'')}</div>${field('photo','Fotoğraf bağlantısı','text',item.photo||'')}${field('avesisUrl','AVESİS bağlantısı','url',item.avesisUrl||'')}${field('personalUrl','Kişisel site','url',item.personalUrl||'')}`;
    if(type==='events')fields=`${field('title','Etkinlik / sınav adı','text',item.title||'',null,true)}${field('courseCode','Ders / kategori','select',item.courseCode||'GENEL',courseOptions(),true)}<div class="portal-grid">${field('date','Tarih','date',item.date||getTodayDateStr(),null,true)}${field('time','Saat (isteğe bağlı)','time',item.time||'')}</div>${field('location','Yer / açıklama','text',item.location||'')}`;
    if(type==='resources')fields=`${field('title','Kaynak adı','text',item.title||'',null,true)}${field('courseCode','İlgili ders','select',item.courseCode||draft.courses[0]?.code,draft.courses.map(c=>[c.code,`${c.code} — ${c.name}`]),true)}${field('kind','Tür','select',item.kind||'site',[['kitap','Kitap'],['not','Ders notu / dosya'],['site','Site / video']])}${field('url','Kaynak bağlantısı','url',item.url||'',null,true)}<p class="portal-help">Paylaşıma açık Drive dosyasının, kitabın, notun veya sitenin bağlantısını ekleyebilirsin. Kaynak ilgili dersin sayfasında görünür.</p>`;
    if(type==='sidebar')fields=`${field('title','Bağlantı adı','text',item.title||'',null,true)}${field('url','Bağlantı','url',item.url||'',null,true)}`;
    editor.querySelector('.portal-modal-body').innerHTML=`<form id="portalRecordForm" class="portal-form">${fields}<p id="portalRecordStatus" class="portal-status" role="status"></p><button type="submit" class="portal-btn portal-btn-primary">Taslağa kaydet</button></form>`;
    byId('portalRecordForm').onsubmit=e=>{
      e.preventDefault();const form=e.currentTarget,data=Object.fromEntries(new FormData(form));
      try{
        const record={...item,...data};
        ['url','avesisUrl','personalUrl'].forEach(k=>{if(k in record)record[k]=safeUrl(record[k]);});
        ['photo','banner'].forEach(k=>{if(record[k]&&!record[k].startsWith('assets/')&&!record[k].startsWith('bannerlar/'))record[k]=safeUrl(record[k],false);});
        if(type==='courses'){
          record.code=record.code.toUpperCase().trim();if(!/^[A-Z0-9_-]{2,30}$/.test(record.code))throw new Error('Ders kodu 2–30 harf, rakam, tire veya alt çizgi içermeli.');
          if(draft.courses.some(c=>c.code===record.code&&c.code!==id))throw new Error('Bu ders kodu zaten var.');
          record.year=Number(record.year);record.bannerRatio=Number(record.bannerRatio)||1.7778;record.shortName=record.shortName||record.name;record.instructorIds=[...form.elements.instructorIds.selectedOptions].map(o=>o.value);record.assistantIds=[...form.elements.assistantIds.selectedOptions].map(o=>o.value);record.links=[];
          if(id&&id!==record.code){draft.resources.forEach(r=>{if(r.courseCode===id)r.courseCode=record.code;});draft.events.forEach(ev=>{if(ev.courseCode===id)ev.courseCode=record.code;});}
        }else record.id=item.id||uid();
        if(type==='staff')record.courses=draft.courses.filter(c=>(c.instructorIds||[]).includes(record.id)||(c.assistantIds||[]).includes(record.id)).map(c=>c.code);
        if(type==='resources')record.icon=record.kind==='site'?'external-link':'book-open';
        if(type==='courses' && id && record.code!==id)record.sourceCode=item.sourceCode||id;
        const index=draft[type].findIndex(r=>r[key]===id);if(index<0)draft[type].push(record);else draft[type][index]=record;
        editor.close();renderAdmin();
      }catch(error){status('portalRecordStatus',error.message,true);}
    };
    show(editor);
  }
  function renderGeneral(body){body.innerHTML=`<form id="portalGeneralForm" class="portal-form">${field('name','Portal adı','text',draft.general.name,null,true)}${field('description','Ana sayfa açıklaması','textarea',draft.general.description,null,true)}${field('footer','Alt bilgi','text',draft.general.footer)}<button type="submit" class="portal-btn portal-btn-primary">Taslağa kaydet</button></form>`;byId('portalGeneralForm').onsubmit=e=>{e.preventDefault();draft.general=Object.fromEntries(new FormData(e.currentTarget));updateDirty();};}
  function renderDrive(body){
    const nodes=[];function walk(list,path=''){for(const n of list||[]){nodes.push({...n,path});if(n.children)walk(n.children,`${path}${n.name} / `);}}walk(sourceTree);
    body.innerHTML=`<p class="portal-help" style="margin-bottom:12px">Drive materyallerini portaldan gizleyebilir veya görünen adını değiştirebilirsin. Drive'daki asıl dosyalar korunur. Yeni kaynak eklemek için Kitap, not ve siteler bölümünü kullan.</p><input class="portal-input" data-drive-filter placeholder="Dosya veya klasör ara…" aria-label="Drive materyali ara" style="margin-bottom:12px"><div class="portal-admin-list">${nodes.length?nodes.map(n=>`<div class="portal-admin-row" data-drive="${escape(n.id)}"><div><h3>${escape(draft.driveEdits[n.id]?.name||n.name)}</h3><p>${escape(n.path||'Ana klasör')}</p></div><div class="portal-actions"><button type="button" class="portal-btn" data-rename>Adını düzenle</button><button type="button" class="portal-btn" data-toggle>${draft.hiddenDrive.includes(n.id)?'Yeniden göster':'Gizle'}</button></div></div>`).join(''):'<p class="portal-help">Drive listesi henüz yüklenmedi. Biraz sonra bu sekmeyi tekrar aç.</p>'}</div>`;
    body.querySelector('[data-drive-filter]').oninput=e=>body.querySelectorAll('[data-drive]').forEach(row=>row.hidden=!row.textContent.toLocaleLowerCase('tr').includes(e.target.value.toLocaleLowerCase('tr')));
    body.querySelectorAll('[data-drive]').forEach(row=>{const id=row.dataset.drive;
      row.querySelector('[data-toggle]').onclick=()=>{draft.hiddenDrive=draft.hiddenDrive.includes(id)?draft.hiddenDrive.filter(x=>x!==id):[...draft.hiddenDrive,id];renderAdmin();};
      if(!nodes.find(n=>n.id===id).path && defaults.courses.some(c=>c.code===nodes.find(n=>n.id===id).name.toUpperCase().trim())) { row.querySelector('[data-rename]').disabled=true;row.querySelector('[data-rename]').title='Ders adını Dersler / Sınıflar bölümünden düzenle.'; }
      row.querySelector('[data-rename]').onclick=()=>{editor.querySelector('.portal-modal-body').innerHTML=`<form id="portalRenameForm" class="portal-form">${field('name','Portalda görünen ad','text',draft.driveEdits[id]?.name||nodes.find(n=>n.id===id).name,null,true)}<button class="portal-btn portal-btn-primary">Taslağa kaydet</button></form>`;byId('portalRenameForm').onsubmit=e=>{e.preventDefault();draft.driveEdits[id]={name:e.currentTarget.elements.name.value.trim()};editor.close();renderAdmin();};show(editor);};
    });
  }
  async function renderFeedback(body){
    body.innerHTML='<p class="portal-help">Öneriler yükleniyor…</p>';
    try{
      const rows=await request(`/rest/v1/portal_feedback?select=id,course_code,kind,message,url,name,email,status,created_at&order=created_at.desc&limit=30&offset=${feedbackPage*30}`,{auth:true});
      if(tab!=='feedback')return;
      body.innerHTML=`<div class="portal-admin-toolbar"><p class="portal-help">Öğrencilerin gönderdiği istek ve görüşler · Sayfa ${feedbackPage+1}</p><button class="portal-btn" data-refresh>Yenile</button></div><div class="portal-admin-list">${rows.length?rows.map(r=>`<article class="portal-feedback-card"><div class="portal-actions" style="justify-content:space-between"><strong style="font-size:12px">${escape(r.course_code)} · ${escape(({kitap:'Kitap',not:'Not',site:'Site',gorus:'Görüş'})[r.kind])}</strong><span class="portal-help">${escape(new Date(r.created_at).toLocaleString('tr-TR'))}</span></div><p class="portal-feedback-message">${escape(r.message)}</p>${r.url?`<a class="portal-help" href="${escape(safeUrl(r.url,false))}" target="_blank" rel="noopener noreferrer">Kaynak bağlantısını aç ↗</a>`:''}<p class="portal-help">${escape(r.name||'İsimsiz')} ${escape(r.email||'')}</p><label class="portal-field" style="margin-top:10px">Durum<select class="portal-input" data-feedback-id="${escape(r.id)}">${[['yeni','Yeni'],['inceleniyor','İnceleniyor'],['tamamlandi','Tamamlandı'],['arsiv','Arşiv']].map(([v,l])=>`<option value="${v}" ${v===r.status?'selected':''}>${l}</option>`).join('')}</select></label></article>`).join(''):'<p class="portal-help">Bu sayfada henüz istek veya görüş bulunmuyor.</p>'}</div><div class="portal-actions" style="margin-top:12px"><button class="portal-btn" data-prev ${feedbackPage===0?'disabled':''}>Önceki</button><button class="portal-btn" data-next ${rows.length<30?'disabled':''}>Sonraki</button></div><p id="portalFeedbackAdminStatus" role="status" class="portal-status"></p>`;
      body.querySelector('[data-refresh]').onclick=()=>renderFeedback(body);body.querySelector('[data-prev]').onclick=()=>{feedbackPage--;renderFeedback(body);};body.querySelector('[data-next]').onclick=()=>{feedbackPage++;renderFeedback(body);};
      body.querySelectorAll('[data-feedback-id]').forEach(select=>select.onchange=async()=>{select.disabled=true;try{await request('/rest/v1/portal_feedback?id=eq.'+encodeURIComponent(select.dataset.feedbackId),{method:'PATCH',auth:true,body:{status:select.value}});status('portalFeedbackAdminStatus','Öneri durumu kaydedildi.');}catch(error){status('portalFeedbackAdminStatus',error.message,true);}finally{select.disabled=false;}});
    }catch(error){body.innerHTML=`<p class="portal-status" data-error="true">${escape(error.message)}</p>`;}
  }
  function renderAccount(body){
    body.innerHTML=`<p class="portal-help" style="margin-bottom:16px">${escape(session?.user?.email||'Yönetici hesabı')}</p><form id="portalPasswordForm" class="portal-form">${field('password','Yeni şifre','password','',null,true)}${field('confirmation','Yeni şifre (tekrar)','password','',null,true)}<p class="portal-help">En az 12 karakter kullan. Yeni şifren bir sonraki girişte geçerli olur.</p><button class="portal-btn">Şifreyi kaydet</button><p id="portalPasswordStatus" class="portal-status" role="status"></p></form>`;
    byId('portalPasswordForm').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget,b=f.querySelector('button');b.disabled=true;try{if(f.elements.password.value.length<12)throw new Error('En az 12 karakter kullan.');if(f.elements.password.value!==f.elements.confirmation.value)throw new Error('Şifreler eşleşmiyor.');await request('/auth/v1/user',{method:'PUT',auth:true,body:{password:f.elements.password.value}});f.reset();status('portalPasswordStatus','Şifren kaydedildi.');}catch(error){status('portalPasswordStatus',error.message,true);}finally{b.disabled=false;}};
  }
  async function loadPublished(){
    const rows=await request('/rest/v1/portal_content?id=eq.1&select=content,revision');
    if(!rows?.length)throw new Error('Portal içerik kaydı bulunamadı.');
    published={...copy(defaults),...rows[0].content};revision=rows[0].revision;ready=true;window.portalSharedContentReady=true;applyContent();
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
