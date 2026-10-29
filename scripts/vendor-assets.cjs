const fs=require('node:fs');
fs.copyFileSync('node_modules/lucide/dist/umd/lucide.min.js','assets/vendor/lucide.min.js');
fs.copyFileSync('node_modules/lucide/LICENSE','assets/vendor/lucide.LICENSE');
