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
    const button = document.getElementById('langToggleBtn');
    if (button) {
      const english = lang === 'en';
      button.textContent = english ? 'EN' : 'TR';
      button.setAttribute('title', english ? 'Switch to Turkish' : 'İngilizceye geç');
      button.setAttribute('aria-label', english ? 'Language: English. Switch to Turkish' : 'Dil: Türkçe. İngilizceye geç');
    }
    document.querySelectorAll('a[href]').forEach(link => {
      const target = new URL(link.getAttribute('href'), location.href);
      if (target.origin !== location.origin || !/\/(?:index\.html|test\.html|privacy\.html)?$/.test(target.pathname)) return;
      target.searchParams.set('lang', lang);
      link.href = target.href;
    });
  }
  let feedbackAnimation;
  document.addEventListener('click', event => {
    const button = event.target instanceof Element ? event.target.closest('#langToggleBtn') : null;
    if (!button || typeof button.animate !== 'function') return;
    feedbackAnimation?.cancel();
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    feedbackAnimation = button.animate([
      {transform: 'scale(1)', offset: 0},
      {transform: 'scale(0.86)', offset: 0.16},
      {transform: 'scale(1.12)', offset: 0.44},
      {transform: 'scale(0.96)', offset: 0.67},
      {transform: 'scale(1.025)', offset: 0.84},
      {transform: 'scale(1)', offset: 1}
    ], {duration: 440, easing: 'ease-out'});
  }, true);
  window.PortalLanguage = Object.freeze({read, write});
  document.documentElement.lang = read();
})();
