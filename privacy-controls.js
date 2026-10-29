document.getElementById('themeToggleBtn').onclick = () => {
      const currentlyDark = document.documentElement.classList.contains('dark');
      const target = currentlyDark ? 'light' : 'dark';
      localStorage.setItem('color-scheme', target);
      document.querySelector('meta[name="color-scheme"]').content = target;
      document.documentElement.classList.toggle('dark', target === 'dark');
    };
    lucide.createIcons();
