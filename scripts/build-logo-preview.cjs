// Publish a self-contained preview without replacing the production homepage.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'testlogo');
fs.mkdirSync(out,{recursive:true});
const files=fs.readdirSync(root).filter(name=>/\.(js|css|svg)$/.test(name));
files.push('index.html','privacy.html','site.webmanifest');
for(const name of files)fs.copyFileSync(path.join(root,name),path.join(out,name));
for(const name of ['assets','bannerlar'])fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true});
// The live portal's worker must never be replaced by an experimental worker.
fs.rmSync(path.join(out,'sw.js'),{force:true});
fs.writeFileSync(path.join(out,'preview-init.js'),'window.PORTAL_LOGO_PREVIEW = true;\n');
for(const name of ['index.html','privacy.html']){
 const file=path.join(out,name);let html=fs.readFileSync(file,'utf8');
 html=html.replace('<head>','<head>\n  <meta name="robots" content="noindex,nofollow">\n  <script src="preview-init.js"></script>');
 html=html.replaceAll('https://c4n3rr.github.io/anku-eee-materials/','https://c4n3rr.github.io/anku-eee-materials/testlogo/');
 // Preview visits should not distort production analytics.
 html=html.replace(/\s*<script[^>]*src="https:\/\/www.googletagmanager.com[^>]*><\/script>/g,'').replace(/\s*<script src="analytics-init.js"><\/script>/g,'');
 fs.writeFileSync(file,html);
}
