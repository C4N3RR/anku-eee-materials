(() => {
  const root = document.documentElement;
  if (!root.classList.contains('portal-intro-active')) return;

  const overlay = document.getElementById('portalIntro');
  const backdrop = document.getElementById('portalIntroBackdrop');
  const logo = document.getElementById('portalIntroLogo');
  try {
    sessionStorage.setItem('anku_portal_intro_v1', '1');
  } catch {}

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
    if (!waitingForHome) pageReady();
  }, { once: true });

  const artwork = new Image();
  artwork.src = 'testlogo/assets/brand/portal-original.png';
  const minimumDisplay = artwork.decode().then(() => new Promise(resolve => {
    let previous;
    function showWhenCentered() {
      const { left, top, width, height } = logo.getBoundingClientRect();
      const bounds = overlay.getBoundingClientRect();
      const geometry = [left, top, width, height];
      const centered = width > 0 && height > 0 &&
        Math.abs(left + width / 2 - bounds.left - bounds.width / 2) < 1 &&
        Math.abs(top + height / 2 - bounds.top - bounds.height / 2) < 1;
      if (!centered || !previous || geometry.some((value, index) => Math.abs(value - previous[index]) >= 1)) {
        previous = centered ? geometry : undefined;
        requestAnimationFrame(showWhenCentered);
        return;
      }
      logo.classList.add('is-visible');
      requestAnimationFrame(() => setTimeout(resolve, 500));
    }
    requestAnimationFrame(showWhenCentered);
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
