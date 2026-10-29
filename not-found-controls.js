if (!location.pathname.startsWith('/anku-eee-materials')) {
      document.getElementById('brandHomeLink').href = './';
      document.getElementById('ctaHomeBtn').href = './';
      document.getElementById('footerPrivacyLink').href = './privacy.html';
    }
    document.getElementById('themeToggleBtn').onclick = () => {
      const currentlyDark = document.documentElement.classList.contains('dark');
      const target = currentlyDark ? 'light' : 'dark';
      localStorage.setItem('color-scheme', target);
      document.querySelector('meta[name="color-scheme"]').content = target;
      document.documentElement.classList.toggle('dark', target === 'dark');
    };
    lucide.createIcons();

document.addEventListener('error', event => { const image=event.target;if(image instanceof HTMLImageElement && image.hasAttribute('data-logo-fallback')) {image.removeAttribute('data-logo-fallback');image.src='/anku-eee-materials/assets/ankara-uni-logo.png';} },true);
