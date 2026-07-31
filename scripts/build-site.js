const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'source');
const OUTPUT = path.join(ROOT, 'website');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(SOURCE, 'data', 'build-manifest.json'), 'utf8'));
let sharp = null; let terser = null;
try { sharp = require('sharp'); } catch (_) {}
try { terser = require('terser'); } catch (_) {}

function rm(target) { fs.rmSync(target, { recursive: true, force: true }); }
function ensure(target) { fs.mkdirSync(target, { recursive: true }); }
function copyDir(src, dest) {
  ensure(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name); const to = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(from, to) : fs.copyFileSync(from, to);
  }
}
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function walk(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out); else if (predicate(full)) out.push(full);
  }
  return out;
}
function parseFrontMatter(text) {
  if (!text.startsWith('---\n')) throw new Error('Page is missing front matter.');
  const end = text.indexOf('\n---\n', 4); if (end < 0) throw new Error('Page front matter is not closed.');
  const header = text.slice(4, end).split(/\r?\n/); const data = {};
  for (const line of header) {
    if (!line.trim()) continue; const colon = line.indexOf(':');
    if (colon < 0) continue; const key = line.slice(0, colon).trim(); const raw = line.slice(colon + 1).trim();
    try { data[key] = JSON.parse(raw); } catch (_) { data[key] = raw; }
  }
  return { data, body: text.slice(end + 5) };
}
function extractBlocks(text) {
  const blocks = {}; const rx = /\{% block\s+([A-Za-z0-9_]+)\s*%\}([\s\S]*?)\{% endblock %\}/g; let m;
  while ((m = rx.exec(text))) blocks[m[1]] = m[2].trim();
  return blocks;
}
function escapeAttr(value) { return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }
function renderComponent(file, data) {
  let html = fs.readFileSync(file, 'utf8');
  return html.replace(/\{\{\s*basePath\s*\}\}/g, data.basePath || '');
}
function renderPage(file) {
  const parsed = parseFrontMatter(fs.readFileSync(file, 'utf8')); const d = parsed.data; const b = extractBlocks(parsed.body);
  const analytics = d.analytics ? fs.readFileSync(path.join(SOURCE,'_includes','components','analytics.njk'),'utf8') : '';
  const nav = d.sharedChrome ? renderComponent(path.join(SOURCE,'_includes','components','navigation.njk'), d) : '';
  const footer = d.sharedChrome ? renderComponent(path.join(SOURCE,'_includes','components','footer.njk'), d) : '';
  const extraStyles = (d.extraStyles || []).map((style)=>`<link rel="stylesheet" href="${/^(?:https?:)?\/\//.test(style)?style:(d.basePath||'')+style}">`).join('\n');
  const externalScripts = (d.extraScripts || []).map((script)=>`<script defer src="${/^(?:https?:)?\/\//.test(script)?script:(d.basePath||'')+script}"></script>`).join('\n');
  const bundleScript = d.jsBundle ? `<script defer src="${d.basePath||''}js/${d.jsBundle}.min.js?v=${d.buildVersion||'1'}"></script>` : '';
  const values = {
    SITE_PATHS: `<script src="${d.basePath||''}js/site-paths.js"></script>`,
    ANALYTICS: analytics,
    PAGE_HEAD: b.head || '',
    STYLES: `<link rel="stylesheet" href="${d.basePath||''}css/${d.cssBundle}.min.css?v=${d.buildVersion||'1'}">\n${extraStyles}`,
    BODY_OPEN: `<body${d.bodyClass?` class="${escapeAttr(d.bodyClass)}"`:''}>`,
    BEFORE_NAVIGATION: b.beforeNavigation || '', NAVIGATION: nav, CONTENT: b.content || '',
    FOOTER: footer, AFTER_FOOTER: b.afterFooter || '',
    SCRIPTS: `${externalScripts}\n${bundleScript}`,
    INLINE_SCRIPTS: b.inlineScripts || ''
  };
  let layout = fs.readFileSync(path.join(SOURCE,'_includes','layouts','base.html'),'utf8');
  for (const [key,value] of Object.entries(values)) layout = layout.replaceAll(`{{${key}}}`, value);
  return layout;
}
function buildLearningContent() {
  const platform = readJson(path.join(SOURCE, 'data', 'platform.json'));
  const content = {
    ...platform,
    latestUpdates: readJson(path.join(SOURCE, 'data', 'latest-updates.json')),
    testimonials: readJson(path.join(SOURCE, 'data', 'testimonials.json'))
  };
  const seriesOrder = readJson(path.join(SOURCE, 'content', 'lessons', 'series-order.json'));
  content.series = seriesOrder.map((seriesId) => {
    const dir = path.join(SOURCE, 'content', 'lessons', seriesId); const series = readJson(path.join(dir, 'series.json'));
    series.lessons = readJson(path.join(dir, 'lesson-order.json')).map((id)=>readJson(path.join(dir,'lessons',`${id}.json`))); return series;
  });
  for (const [key, folder] of [['futureSeries','future-series'],['assignments','assignments'],['downloads','downloads'],['tools','tools'],['pages','page-directory'],['articles','articles']]) {
    const dir = path.join(SOURCE,'content',folder); const order = readJson(path.join(dir,'order.json'));
    content[key] = order.map((id)=> folder==='articles'?readJson(path.join(dir,id,'article.json')):folder==='tools'?readJson(path.join(dir,id,'tool.json')):readJson(path.join(dir,`${id}.json`)));
  }
  const generated = path.join(ROOT,'.build','learning-content.js'); ensure(path.dirname(generated));
  fs.writeFileSync(generated,`/* Generated from individual source/content files. */\nwindow.ATHANAS_LEARNING_CONTENT = ${JSON.stringify(content,null,2)};\n`); return generated;
}
function minifyCssSafe(input) {
  /*
   * CSS selector whitespace can be meaningful. The earlier character-level
   * compressor removed spaces before pseudo classes/functions and changed
   * descendant selectors into compound selectors. That caused contrast rules
   * and YouTube reveal rules to stop matching.
   *
   * Keep the combined production stylesheet conservative and standards-safe.
   * GitHub Pages/browser compression still reduces transfer size, while the
   * exact behaviour of the original styles is preserved.
   */
  return input.replace(/\r\n/g, '\n').trim() + '\n';
}

async function minifyJsOptional(source) {
  if (!terser) return source; const result = await terser.minify(source,{compress:false,mangle:false,format:{comments:false}}); return result.code || source;
}
async function buildCss() {
  ensure(path.join(OUTPUT,'css'));
  for(const [name,files] of Object.entries(MANIFEST.cssBundles)){
    const source=files.map(f=>fs.readFileSync(path.join(ROOT,f),'utf8')).join('\n\n'); fs.writeFileSync(path.join(OUTPUT,'css',`${name}.min.css`),minifyCssSafe(source));
  }
  const bot=fs.readFileSync(path.join(SOURCE,'styles','assistant','assistant.css'),'utf8'); fs.writeFileSync(path.join(OUTPUT,'css','bot.min.css'),minifyCssSafe(bot));
}
async function buildJs(learning) {
  ensure(path.join(OUTPUT,'js'));
  const sitePaths=fs.readFileSync(path.join(SOURCE,'scripts','site','site-paths.js'),'utf8'); fs.writeFileSync(path.join(OUTPUT,'js','site-paths.js'),await minifyJsOptional(sitePaths));
  for(const [name,files] of Object.entries(MANIFEST.jsBundles)){
    const source=files.map(f=>f==='GENERATED_LEARNING_CONTENT'?fs.readFileSync(learning,'utf8'):fs.readFileSync(path.join(ROOT,f),'utf8')).join('\n;\n');
    fs.writeFileSync(path.join(OUTPUT,'js',`${name}.min.js`),await minifyJsOptional(source));
  }
  for(const [outName,srcName] of Object.entries({'bot-data.min.js':'bot-data.js','assistant-learning-sync.js':'assistant-learning-sync.js','assistant-knowledge-base.js':'assistant-knowledge-base.js','bot.min.js':'bot.js'})){
    const source=fs.readFileSync(path.join(SOURCE,'scripts','assistant',srcName),'utf8'); fs.writeFileSync(path.join(OUTPUT,'js',outName),await minifyJsOptional(source));
  }
  ensure(path.join(OUTPUT,'js','vendor')); const qr=fs.readFileSync(path.join(SOURCE,'scripts','tools','vendor','athanas-qr-engine.js'),'utf8'); fs.writeFileSync(path.join(OUTPUT,'js','vendor','athanas-qr-engine.js'),await minifyJsOptional(qr));
}
async function optimiseImages() {
  if(process.env.SKIP_IMAGE_OPTIMIZATION==='1'){ console.log('IMAGE NOTE: image optimisation skipped for this verification build.'); return; }
  if(!sharp){ console.log('IMAGE NOTE: optional Sharp module is unavailable, so image copies were preserved without recompression.'); return; }
  const imageRoot=path.join(OUTPUT,'assets','images'); if(!fs.existsSync(imageRoot))return;
  const files=walk(imageRoot,f=>/\.(?:jpe?g|png|webp)$/i.test(f)); const protectedPattern=/(qr|logo|screenshot|preview|certificate|social)/i;
  for(const file of files){ const stat=fs.statSync(file); if(stat.size<220*1024||protectedPattern.test(path.basename(file)))continue; const ext=path.extname(file).toLowerCase(),tmp=file+'.optimised'; let p=sharp(file,{failOn:'none'}).rotate();
    if(ext==='.jpg'||ext==='.jpeg')p=p.jpeg({quality:92,mozjpeg:true}); else if(ext==='.png')p=p.png({compressionLevel:9,adaptiveFiltering:true}); else p=p.webp({quality:92,effort:4});
    await p.toFile(tmp); if(fs.statSync(tmp).size<stat.size)fs.renameSync(tmp,file);else fs.unlinkSync(tmp);
  }
}
async function main(){ console.log('Preparing a fresh website folder...');rm(OUTPUT);rm(path.join(ROOT,'.build'));ensure(OUTPUT);copyDir(path.join(SOURCE,'public'),OUTPUT);
  const sharedAssets=path.join(SOURCE,'assets','shared');if(fs.existsSync(sharedAssets))copyDir(sharedAssets,path.join(OUTPUT,'assets'));
  const contentAssets=readJson(path.join(SOURCE,'data','content-assets.json'));for(const item of contentAssets){const from=path.join(ROOT,item.source),to=path.join(OUTPUT,item.output);ensure(path.dirname(to));fs.copyFileSync(from,to);}
  console.log('Building lessons, articles, tools, and search data...');const learning=buildLearningContent();console.log('Combining and optimising styles...');await buildCss();console.log('Combining website behaviour and tool scripts...');await buildJs(learning);console.log('Creating all HTML pages from shared components...');
  for(const file of walk(path.join(SOURCE,'content'),f=>f.endsWith('page.njk'))){const parsed=parseFrontMatter(fs.readFileSync(file,'utf8'));const out=path.join(OUTPUT,parsed.data.permalink);ensure(path.dirname(out));fs.writeFileSync(out,renderPage(file));}
  console.log('Optimising safe image copies...');await optimiseImages();console.log('Running automatic safety checks...');const result=spawnSync(process.execPath,[path.join(ROOT,'scripts','check-site.js')],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);console.log('\nBUILD COMPLETE: open website/index.html or run OPEN WEBSITE.bat');
}
main().catch(e=>{console.error('\nBUILD FAILED\n'+(e.stack||e));process.exit(1);});
