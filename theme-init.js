try {
      const storedScheme = localStorage.getItem("color-scheme");
      document.querySelector('meta[name="color-scheme"]').content = storedScheme ?? "light dark";
      const isDark = storedScheme ? storedScheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } catch (e) {}
