const fs=require('fs');const path=require('path');const {spawnSync}=require('child_process');
const ROOT=path.resolve(__dirname,'..'),SITE=path.join(ROOT,'website');const errors=[],warnings=[];
function walk(dir,pred,out=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);e.isDirectory()?walk(f,pred,out):pred(f)&&out.push(f);}return out;}
const htmlFiles=walk(SITE,f=>f.endsWith('.html'));const attrs=/\s(?:href|src|action|poster|data-src|data-href)\s*=\s*["']([^"']+)["']/gi;
const external=v=>/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|data:|javascript:)/i.test(v);const clean=v=>decodeURIComponent(v.split('#')[0].split('?')[0]);
for(const file of htmlFiles){const rel=path.relative(SITE,file).replace(/\\/g,'/'),html=fs.readFileSync(file,'utf8');if(!/<title>[\s\S]*?\S[\s\S]*?<\/title>/i.test(html))errors.push(`${rel}: missing page title.`);
 const metaTags=html.match(/<meta\b[^>]*>/gi)||[];const hasDescription=metaTags.some(t=>/name=["']description["']/i.test(t)&&/content=["'][^"']+/i.test(t));if(!hasDescription&&!/^(tools|typing-trainer|shortcut-trainer|quiz|calculator|qr-code-generator)\.html$/.test(rel))warnings.push(`${rel}: missing meta description.`);
 const ids=new Set();for(const m of html.matchAll(/\bid=["']([^"']+)["']/gi)){if(ids.has(m[1]))errors.push(`${rel}: duplicate id "${m[1]}".`);ids.add(m[1]);}
 for(const m of html.matchAll(/<img\b[^>]*>/gi)){if(!/\balt\s*=/.test(m[0]))warnings.push(`${rel}: image without alt text.`);}
 let m;attrs.lastIndex=0;while((m=attrs.exec(html))){const raw=m[1];if(!raw||external(raw))continue;const target=clean(raw);if(!target)continue;let candidate=path.resolve(path.dirname(file),target);if(target.endsWith('/'))candidate=path.join(candidate,'index.html');if(!fs.existsSync(candidate))errors.push(`${rel}: missing local target "${raw}".`);}
}
for(const file of walk(path.join(SITE,'js'),f=>f.endsWith('.js'))){const r=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status!==0)errors.push(`${path.relative(SITE,file)}: JavaScript syntax error: ${r.stderr.trim()}`);}
for(const file of walk(path.join(SITE,'assets','images'),()=>true)){const size=fs.statSync(file).size;if(size>1.5*1024*1024)warnings.push(`${path.relative(SITE,file)} is ${(size/1024/1024).toFixed(1)} MB.`);}

const testimonialsFile=path.join(ROOT,'source','data','testimonials.json');
if(!fs.existsSync(testimonialsFile))errors.push('Source data missing: testimonials.json');
else{
  try{
    const testimonials=JSON.parse(fs.readFileSync(testimonialsFile,'utf8'));
    if(!Array.isArray(testimonials)||testimonials.length===0)errors.push('YouTube testimonials data is empty.');
  }catch(error){errors.push('YouTube testimonials data is invalid JSON: '+error.message);}
}
const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'source','data','build-manifest.json'),'utf8'));for(const p of Object.keys(manifest.pages)){if(!fs.existsSync(path.join(SITE,p)))errors.push(`Generated page missing: ${p}`);}
console.log(`\nSITE CHECK: ${htmlFiles.length} HTML pages checked.`);if(warnings.length){console.log(`\nWARNINGS (${warnings.length})`);warnings.slice(0,80).forEach(x=>console.log(' - '+x));}
if(errors.length){console.error(`\nERRORS (${errors.length})`);errors.slice(0,120).forEach(x=>console.error(' - '+x));process.exit(1);}console.log('\nPASS: no critical broken local files, duplicate IDs, missing generated pages, or JavaScript syntax errors were found.');
