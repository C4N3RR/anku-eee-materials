(() => {
  const root = document.documentElement;
  if (!root.classList.contains('portal-intro-active')) return;

  const overlay = document.getElementById('portalIntroOverlay');
  const backdrop = document.getElementById('portalIntroBackdrop');
  const logo = document.getElementById('portalIntroLogo');
  if (overlay.hasAttribute('data-play-once')) {
    try {
      sessionStorage.setItem('anku_portal_intro_v1', '1');
    } catch {}
  }

  const mark = document.getElementById('portalIntroMark');
  const wordmarkWindow = document.getElementById('portalIntroWordmarkWindow');
  const wordmark = document.getElementById('portalIntroWordmark');

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
  const viewportSettled = artwork.decode().then(() => new Promise(resolve => {
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
      resolve({ width, bounds });
    }
    requestAnimationFrame(showWhenCentered);
  }));

  async function assembleLogo({ width, bounds }) {
    // Percentages use the original artwork's left opening and visible mark center.
    const lensX = 7.8;
    const markCenterX = 12.2;
    const centeredOffset = 50 - markCenterX;
    const nearScale = 1.15 * Math.max(
      bounds.width / (2 * width * .017),
      bounds.height / (2 * width * .045)
    );
    const flyAway = mark.animate([
      { transform: `translateX(${50 - lensX}%) scale(${nearScale})`, offset: 0 },
      { transform: `translateX(${50 - lensX}%) scale(${Math.sqrt(nearScale)})`, offset: .27 },
      { transform: 'translateX(40%) scale(2)', offset: .62 },
      { transform: `translateX(${centeredOffset}%) scale(1)`, offset: 1 }
    ], { duration: 780, easing: 'cubic-bezier(.32, .12, .27, 1)', fill: 'forwards' });
    logo.classList.add('is-visible');
    await flyAway.finished;
    await new Promise(resolve => setTimeout(resolve, 180));

    const slide = { duration: 460, easing: 'cubic-bezier(.25, .65, .25, 1)', fill: 'forwards' };
    const moveMark = mark.animate([
      { transform: `translateX(${centeredOffset}%)` },
      { transform: 'translateX(0)' }
    ], slide);
    flyAway.cancel();
    const uncover = wordmarkWindow.animate([
      { clipPath: `inset(0 0 0 ${21.5 + centeredOffset}%)` },
      { clipPath: 'inset(0 0 0 21.5%)' }
    ], slide);
    const moveWordmark = wordmark.animate([
      { transform: 'translateX(-48%)' },
      { transform: 'translateX(0)' }
    ], slide);
    wordmarkWindow.hidden = false;
    await Promise.all([moveMark.finished, uncover.finished, moveWordmark.finished]);
    moveMark.cancel();
    uncover.cancel();
    moveWordmark.cancel();
  }

  async function reveal() {
    try {
      await Promise.all([viewportSettled.then(assembleLogo), ready]);
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
