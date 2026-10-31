const fs = require('node:fs');
const path = require('node:path');

// Lucide
fs.copyFileSync('node_modules/lucide/dist/umd/lucide.min.js', 'assets/vendor/lucide.min.js');
fs.copyFileSync('node_modules/lucide/LICENSE', 'assets/vendor/lucide.LICENSE');

// KaTeX for crisp mathematical formulas
const katexVendorDir = 'assets/vendor/katex';
fs.mkdirSync(katexVendorDir, { recursive: true });
fs.copyFileSync('node_modules/katex/dist/katex.min.js', path.join(katexVendorDir, 'katex.min.js'));
fs.copyFileSync('node_modules/katex/dist/katex.min.css', path.join(katexVendorDir, 'katex.min.css'));
if (fs.existsSync('node_modules/katex/dist/contrib/auto-render.min.js')) {
  fs.copyFileSync('node_modules/katex/dist/contrib/auto-render.min.js', path.join(katexVendorDir, 'auto-render.min.js'));
}
if (fs.existsSync('node_modules/katex/LICENSE')) {
  fs.copyFileSync('node_modules/katex/LICENSE', path.join(katexVendorDir, 'LICENSE'));
}

// Copy KaTeX fonts
const fontsSrc = 'node_modules/katex/dist/fonts';
const fontsDest = path.join(katexVendorDir, 'fonts');
if (fs.existsSync(fontsSrc)) {
  fs.cpSync(fontsSrc, fontsDest, { recursive: true });
}
