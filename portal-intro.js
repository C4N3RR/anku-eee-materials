(() => {
  const storageKey = 'anku_portal_intro_v1';
  const root = document.documentElement;
  if (location.hash || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, '1');
  } catch {
    // The page remains usable when session storage is unavailable.
  }

  // Mount before the rest of the page is parsed so the artwork can load immediately.
  const overlay = document.createElement('div');
  const backdrop = document.createElement('div');
  const logo = document.createElement('div');
  overlay.id = 'portalIntro';
  overlay.setAttribute('aria-hidden', 'true');
  backdrop.id = 'portalIntroBackdrop';
  logo.id = 'portalIntroLogo';
  overlay.append(backdrop, logo);
  root.append(overlay);
  root.classList.add('portal-intro-active');
  overlay.addEventListener('wheel', event => event.preventDefault(), { passive: false });

  const homeLogo = () => document.querySelector('.portal-hero h1.portal-brand-lockup');
  let pageReady;
  const ready = new Promise(resolve => { pageReady = resolve; });
  let waitingForHome = false;
  window.portalIntro = {
    ready: pageReady,
    waitForHome(load) {
      waitingForHome = true;
      load.then(pageReady, pageReady);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (overlay.isConnected) document.body.prepend(overlay);
    if (!waitingForHome) pageReady();
  }, { once: true });

  const artwork = new Image();
  artwork.src = 'testlogo/assets/brand/portal-original.png';
  const minimumDisplay = artwork.decode().then(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 500)));
  }));

  async function reveal() {
    try {
      await Promise.all([minimumDisplay, ready]);
      const target = homeLogo();
      const from = logo.getBoundingClientRect();
      const to = target?.getBoundingClientRect();
      const duration = 700;
      const fade = backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration, easing: 'ease-in-out', fill: 'forwards'
      });

      if (to?.width && to.height && from.width && from.height) {
        const x = to.left + to.width / 2 - from.left - from.width / 2;
        const y = to.top + to.height / 2 - from.top - from.height / 2;
        const flight = logo.animate([
          { transform: 'none', color: getComputedStyle(logo).color },
          {
            transform: `translate(${x}px, ${y}px) scale(${to.width / from.width}, ${to.height / from.height})`,
            color: getComputedStyle(target).getPropertyValue('--banner-fg').trim()
          }
        ], { duration, easing: 'cubic-bezier(.45, 0, .2, 1)', fill: 'forwards' });
        await Promise.all([fade.finished, flight.finished]);
      } else {
        const logoFade = logo.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration, easing: 'ease-in-out', fill: 'forwards'
        });
        await Promise.all([fade.finished, logoFade.finished]);
      }
    } catch {
      // Reveal the site if the artwork or animation fails.
    } finally {
      root.classList.remove('portal-intro-active');
      overlay.remove();
      delete window.portalIntro;
    }
  }

  void reveal();
})();
