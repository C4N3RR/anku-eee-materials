(() => {
  'use strict';
  const PORTAL_LANG_KEY = 'anku_portal_lang_v1';
  let lang = window.PortalLanguage?.read() || 'tr';

  const I18N = {
    tr: {
      docTitle: 'Gizlilik Politikası — ANKU EEE Ders Portalı',
      home: 'Ana Sayfa',
      title: 'Gizlilik Politikası',
      updated: 'Son güncelleme: 29 Ekim 2026',
      sec1Title: '1. Paylaştığın bilgiler',
      sec1Text: 'Siteyi kullanmak için hesap açman gerekmez. İstek ve Görüşler bölümünden gönderdiğin mesaj, seçtiğin ders ve varsa paylaştığın bağlantı sunucularımızda saklanır. Bu bilgileri yalnızca site yöneticisi görebilir. Adını ve e-posta adresini yazmak zorunda değilsin. Paylaşırsan bu bilgiler de mesajınla birlikte saklanır.',
      sec2Title: '2. Cihazında saklanan bilgiler',
      sec2Text: 'Tema tercihin, dil seçimin ve bazı dosyalar, siteyi daha hızlı ve rahat kullanabilmen için cihazında saklanır. Aynı bağlantıdan çok fazla mesaj gönderilmesini önlemek için kısa süreli güvenlik kayıtları tutulur. Yönetici girişi yapıldığında, girişin açık kalması için gerekli bilgiler de tarayıcıda tutulur.',
      sec3Title: '3. Dosyalar ve site kullanımı',
      sec3Text: 'Ders dosyalarını görüntülemek ve indirmek için Google Drive kullanılır. Siteyi geliştirmek amacıyla ziyaret sayısı ve görüntülenen sayfalar gibi kullanım istatistikleri Google Analytics ile toplanır.',
      privacyLink: 'Gizlilik Politikası',
      builtBy: 'Caner Davarcı tarafından geliştirildi'
    },
    en: {
      docTitle: 'Privacy Policy — ANKU EEE Course Portal',
      home: 'Home',
      title: 'Privacy Policy',
      updated: 'Last updated: October 29, 2026',
      sec1Title: '1. Information you share',
      sec1Text: 'You do not need to create an account to use the site. Messages sent via the Feedback & Requests section, selected courses, and any shared links are stored on our servers. Only the site administrator can access this information. Providing your name and email address is optional; if provided, they are stored alongside your message.',
      sec2Title: '2. Information stored on your device',
      sec2Text: 'Your theme preference, language selection, and certain cached files are stored on your device to make using the site faster and smoother. Short-term security records are maintained to prevent excessive message submissions from the same connection. When an administrator signs in, necessary session tokens are kept in the browser.',
      sec3Title: '3. Files and site usage',
      sec3Text: 'Google Drive is used to view and download course materials. Usage statistics such as page views and visitor counts are collected via Google Analytics to help improve the site.',
      privacyLink: 'Privacy Policy',
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
    document.querySelector('header img')?.setAttribute('alt', l === 'en' ? 'Ankara University Logo' : 'Ankara Üniversitesi Logosu');
    document.querySelector('#langSwitcher, [role="group"]')?.setAttribute('aria-label', l === 'en' ? 'Language' : 'Dil Seçimi');
    document.getElementById('themeToggleBtn')?.setAttribute('title', l === 'en' ? 'Theme' : 'Tema');
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.docTitle);
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setText('homeLinkText', t.home);
    setText('privacyTitle', t.title);
    setText('privacyUpdated', t.updated);
    setText('sec1Title', t.sec1Title);
    setText('sec1Text', t.sec1Text);
    setText('sec2Title', t.sec2Title);
    setText('sec2Text', t.sec2Text);
    setText('sec3Title', t.sec3Title);
    setText('sec3Text', t.sec3Text);
    setText('footerPrivacyLink', t.privacyLink);
    setText('footerBuiltBy', t.builtBy);

    const bTr = document.getElementById('langBtnTr');
    const bEn = document.getElementById('langBtnEn');
    const isE = (l === 'en');
    if (bTr) {
      bTr.setAttribute('aria-pressed', String(!isE));
      bTr.className = 'h-7 px-2 rounded-[5px] transition ' + (!isE ? 'bg-background text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground');
    }
    if (bEn) {
      bEn.setAttribute('aria-pressed', String(isE));
      bEn.className = 'h-7 px-2 rounded-[5px] transition ' + (isE ? 'bg-background text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground');
    }
  }

  document.getElementById('langBtnTr')?.addEventListener('click', () => applyLanguage('tr'));
  document.getElementById('langBtnEn')?.addEventListener('click', () => applyLanguage('en'));

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
})();
