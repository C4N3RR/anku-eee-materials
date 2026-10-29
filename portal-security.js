(() => {
  'use strict';
  const html = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // HTML escaping alone does not safely quote JavaScript event-handler arguments.
  const argument = value => html(JSON.stringify(String(value ?? '')).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029'));
  function url(value, fallback = '#') {
    if (typeof value !== 'string' || !value.trim() || value.length > 2048) return fallback;
    try {
      const parsed = new URL(value, location.href);
      if (!['https:','http:'].includes(parsed.protocol) || parsed.username || parsed.password) return fallback;
      return parsed.href;
    } catch { return fallback; }
  }
  function frameUrl(value) {
    if (value === 'about:blank') return value;
    try {
      const parsed = new URL(value);
      if (parsed.protocol === 'blob:' && parsed.origin === location.origin) return value;
      if (parsed.protocol === 'https:' && ['drive.google.com','docs.google.com','www.youtube-nocookie.com','www.youtube.com'].includes(parsed.hostname) && !parsed.username && !parsed.password) return parsed.href;
    } catch {}
    return 'about:blank';
  }
  const text = (v,max=300) => typeof v==='string' ? v.slice(0,max) : '';
  const id = v => typeof v==='string' && /^[a-zA-Z0-9_-]{1,100}$/.test(v) && !['__proto__','constructor','prototype'].includes(v);
  const code = v => typeof v==='string' && /^[A-Z0-9_-]{2,30}$/.test(v);
  const icon = v => typeof v==='string' && /^[a-z0-9-]{1,50}$/.test(v) ? v : 'book-open';
  const image = v => url(v,'');
  const email = v => typeof v==='string' && /^[^\s<>"'@]+@[^\s<>"'@]+\.[^\s<>"'@]+$/.test(v) ? v.slice(0,254) : '';
  function stored(key,fallback=null) { try { const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback; } catch {return fallback;} }
  function content(input, defaults) {
    const source = input && typeof input==='object' && !Array.isArray(input) ? input : {};
    const list = (name,max) => Array.isArray(source[name]) ? source[name].slice(0,max).filter(v=>v&&typeof v==='object'&&!Array.isArray(v)) : defaults[name];
    const result={};
    result.courses=list('courses',500).filter(c=>code(c.code)).map(c=>({
      code:c.code,name:text(c.name),shortName:text(c.shortName,80),year:[1,2,3,4].includes(Number(c.year))?Number(c.year):1,semester:c.semester==='bahar'?'bahar':'guz',
      credits:text(c.credits,100),icon:icon(c.icon),instructorIds:Array.isArray(c.instructorIds)?c.instructorIds.filter(id).slice(0,50):[],assistantIds:Array.isArray(c.assistantIds)?c.assistantIds.filter(id).slice(0,50):[],
      banner:image(c.banner),bannerPos:typeof c.bannerPos==='string'&&/^[a-z0-9%. -]{1,60}$/i.test(c.bannerPos)?c.bannerPos:'center center',bannerRatio:Math.min(5,Math.max(.2,Number(c.bannerRatio)||1.7778)),
      ...(code(c.sourceCode)?{sourceCode:c.sourceCode}:{})
    }));
    result.staff=list('staff',500).filter(s=>id(s.id)).map(s=>({id:s.id,name:text(s.name),title:text(s.title,100),category:['faculty','assistant','parttime','service'].includes(s.category)?s.category:'faculty',email:email(s.email),phone:text(s.phone,100),room:text(s.room,100),role:text(s.role,150),photo:image(s.photo),avesisUrl:url(s.avesisUrl,''),personalUrl:url(s.personalUrl,''),courses:Array.isArray(s.courses)?s.courses.filter(code):[]}));
    result.resources=list('resources',3000).filter(r=>id(r.id)&&code(r.courseCode)&&url(r.url,'')).map(r=>({id:r.id,courseCode:r.courseCode,title:text(r.title),kind:['kitap','not','site'].includes(r.kind)?r.kind:'site',url:url(r.url),icon:typeof r.icon==='string'&&r.icon.startsWith('assets/')?image(r.icon):icon(r.icon)}));
    result.sidebar=list('sidebar',100).filter(l=>id(l.id)&&url(l.url,'')).map(l=>({id:l.id,title:text(l.title),url:url(l.url)}));
    result.events=list('events',3000).filter(e=>id(e.id)&&/^\d{4}-\d{2}-\d{2}$/.test(e.date)&&!Number.isNaN(Date.parse(e.date))&&(e.courseCode==='GENEL'||code(e.courseCode))).map(e=>({id:e.id,title:text(e.title),courseCode:e.courseCode,date:e.date,time:typeof e.time==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time)?e.time:'',location:text(e.location)}));
    result.hiddenDrive=Array.isArray(source.hiddenDrive)?source.hiddenDrive.filter(id).slice(0,5000):defaults.hiddenDrive;
    result.driveEdits=Object.create(null);
    if(source.driveEdits&&typeof source.driveEdits==='object') for(const [key,v] of Object.entries(source.driveEdits).slice(0,5000))if(id(key)&&v&&typeof v==='object')result.driveEdits[key]={name:text(v.name)};
    const g=source.general&&typeof source.general==='object'?source.general:defaults.general;
    result.general={name:text(g.name)||defaults.general.name,description:text(g.description,1000),footer:text(g.footer)};
    return result;
  }
  function tree(input) {
    let count=0;
    function walk(items,depth=0) {
      if(!Array.isArray(items)||depth>5)return [];
      return items.slice(0,5000).filter(n=>n&&id(n.id)&&typeof n.name==='string'&&typeof n.mimeType==='string'&&++count<=5000).map(n=>({
        id:n.id,name:text(n.name,500),mimeType:text(n.mimeType,200),size:/^\d{1,16}$/.test(String(n.size))?String(n.size):'',description:text(n.description,10000),webViewLink:url(n.webViewLink,''),
        ...(n.shortcutDetails&&id(n.shortcutDetails.targetId)?{shortcutDetails:{targetId:n.shortcutDetails.targetId,targetMimeType:text(n.shortcutDetails.targetMimeType,200)}}:{}),
        ...(Array.isArray(n.children)?{children:walk(n.children,depth+1)}:{})
      }));
    }
    return walk(input);
  }
  window.PortalSecurity=Object.freeze({html,argument,url,frameUrl,content,stored,image,email,icon,tree});
  // Prevent the authenticated controls from being presented inside another site's frame.
  if (window.top !== window.self) document.documentElement.style.display='none';
})();
