(() => {
  'use strict';
  const key = 'anku_portal_lang_v1';
  const valid = lang => lang === 'tr' || lang === 'en';
  function read() {
    const explicit = new URL(location.href).searchParams.get('lang');
    if (valid(explicit)) return explicit;
    try { const saved = localStorage.getItem(key); if (valid(saved)) return saved; } catch {}
    return 'tr';
  }
  function write(lang) {
    if (!valid(lang)) return;
    try { localStorage.setItem(key, lang); } catch {}
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    try { history.replaceState(history.state, '', url); } catch {}
    document.documentElement.lang = lang;
    document.querySelectorAll('a[href]').forEach(link => {
      const target = new URL(link.getAttribute('href'), location.href);
      if (target.origin !== location.origin || !/\/(?:index\.html|test\.html|privacy\.html)?$/.test(target.pathname)) return;
      target.searchParams.set('lang', lang);
      link.href = target.href;
    });
  }
  window.PortalLanguage = Object.freeze({read, write});
  document.documentElement.lang = read();
})();
