(() => {
  'use strict';
  if (!location.pathname.startsWith('/anku-eee-materials')) {
    const brand = document.getElementById('brandHomeLink');
    if (brand) brand.href = './';
    const cta = document.getElementById('ctaHomeBtn');
    if (cta) cta.href = './';
    const priv = document.getElementById('footerPrivacyLink');
    if (priv) priv.href = './privacy.html';
  }

  const PORTAL_LANG_KEY = 'anku_portal_lang_v1';
  let lang = window.PortalLanguage?.read() || 'tr';

  const I18N = {
    tr: {
      docTitle: '404 — Sayfa Bulunamadı | ANKU EEE Ders Portalı',
      heading: 'Sayfa Bulunamadı',
      subtitle: 'Aradığınız bağlantı mevcut değil veya taşınmış.',
      home: 'Ana Sayfa',
      privacy: 'Gizlilik Politikası',
      builtBy: 'Caner Davarcı tarafından geliştirildi'
    },
    en: {
      docTitle: '404 — Page Not Found | ANKU EEE Course Portal',
      heading: 'Page Not Found',
      subtitle: 'The page you are looking for does not exist or has been moved.',
      home: 'Home',
      privacy: 'Privacy Policy',
      builtBy: 'Built by Caner Davarcı'
    }
  };

  function applyLanguage(l) {
    lang = l;
    window.PortalLanguage?.write(l);
    document.documentElement.lang = l;
    const t = I18N[l] || I18N.tr;
    document.title = t.docTitle;
    document.getElementById('themeToggleBtn')?.setAttribute('aria-label', l === 'en' ? 'Toggle theme' : 'Tema Değiştir');
    document.querySelector('header img')?.setAttribute('alt', l === 'en' ? 'ANKU EEE Portal Logo' : 'ANKU EEE Portal Logosu');
    document.getElementById('themeToggleBtn')?.setAttribute('title', l === 'en' ? 'Theme' : 'Tema');
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.docTitle);
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setText('notFoundHeading', t.heading);
    setText('notFoundSubtitle', t.subtitle);
    setText('ctaHomeBtnText', t.home);
    setText('footerPrivacyLink', t.privacy);
    setText('footerBuiltBy', t.builtBy);

  }

  document.getElementById('langToggleBtn')?.addEventListener('click', () => applyLanguage(lang === 'en' ? 'tr' : 'en'));

  document.getElementById('themeToggleBtn').onclick = () => {
    const currentlyDark = document.documentElement.classList.contains('dark');
    const target = currentlyDark ? 'light' : 'dark';
    localStorage.setItem('color-scheme', target);
    document.querySelector('meta[name="color-scheme"]').content = target;
    document.documentElement.classList.toggle('dark', target === 'dark');
  };

  window.addEventListener('popstate', () => applyLanguage(window.PortalLanguage?.read() || 'tr'));
  window.addEventListener('storage', event => { if (event.key === PORTAL_LANG_KEY && ['tr', 'en'].includes(event.newValue)) applyLanguage(event.newValue); });
  applyLanguage(lang);
  lucide.createIcons();

  document.addEventListener('error', event => {
    const image = event.target;
    if (image instanceof HTMLImageElement && image.hasAttribute('data-logo-fallback')) {
      image.removeAttribute('data-logo-fallback');
      image.src = '/anku-eee-materials/assets/brand/portal-mark.svg';
    }
  }, true);
})();
