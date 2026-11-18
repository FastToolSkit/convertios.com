// Browser regression for the visual checkpoint. Local assets are fulfilled from
// disk to make the test deterministic; this is not a production CWV measurement.
const {chromium}=require('C:/workspace/convertios-pt-qa/node_modules/playwright');
const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'../..');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json'};
function localFile(url){let f=path.join(root,decodeURIComponent(new URL(url).pathname));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');return f;}
function htmlFiles(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?htmlFiles(path.join(dir,x.name)):x.name==='index.html'?[path.join(dir,x.name)]:[]);}
(async()=>{
 const urls=['','es/','ar/','pt-br/'].flatMap(l=>htmlFiles(path.join(root,l,'blog'))).map(f=>'/'+path.relative(root,f).replaceAll('\\','/').replace(/index\.html$/,''));
 const browser=await chromium.launch({headless:true,channel:'chrome'});const failures=[];const metrics=[];let checks=0;
 for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1});
  await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname!=='preview.local')return route.abort();const f=localFile(u);return fs.existsSync(f)?route.fulfill({body:fs.readFileSync(f),contentType:mime[path.extname(f)]||'application/octet-stream'}):route.fulfill({status:404,body:'Not found'});});
  await context.addInitScript(()=>{window.__shifts=[];new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__shifts.push(e.value);}).observe({type:'layout-shift',buffered:true});});
  const page=await context.newPage();let current='';page.on('pageerror',e=>failures.push({url:current,width,error:e.message}));
  for(const url of urls){
   current=url;await page.goto('http://preview.local'+url,{waitUntil:'load'});
   await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),links:[...document.querySelectorAll('main a[href]')].map(a=>a.getAttribute('href')),dir:document.documentElement.dir,cls:window.__shifts.reduce((a,b)=>a+b,0),cover:[...document.querySelectorAll('.lib-card__media img,.lib-article__figure img')].some(i=>!i.width||!i.height||!i.alt)}));
   const missing=state.links.filter(h=>h.startsWith('/')&&!fs.existsSync(localFile('http://preview.local'+h)));
   const anchors=await page.evaluate(()=>[...document.querySelectorAll('main a[href^="#"]')].map(a=>a.hash.slice(1)).filter(id=>!document.getElementById(decodeURIComponent(id))));
   if(state.overflow||state.broken.length||missing.length||anchors.length||state.cover||(url.startsWith('/ar/')&&state.dir!=='rtl'))failures.push({url,width,...state,missing,anchors,links:undefined});
   if(url==='/blog/'||url.includes('convert-pdf-to-word-keep-formatting')||url==='/ar/blog/')metrics.push({url,width,cls:state.cls});
   checks++;if(checks%80===0)console.log('checked',checks);
  }
  // Real navigation and category scrolling, independent of page enumeration.
  await page.goto('http://preview.local/blog/');await page.locator('.lib-page--num').filter({hasText:/^2$/}).click();
  if(!page.url().endsWith('/blog/page/2/'))failures.push({error:'pagination click failed',width});
  await page.locator('.lib-chip--pdf-documents').click();
  if(!page.url().endsWith('/blog/category/pdf-documents/'))failures.push({error:'category click failed',width});
  await page.locator('.lib-card__link').first().click();
  if(!page.url().includes('/blog/convert-pdf-to-word-keep-formatting/'))failures.push({error:'article click failed',width});
  await context.close();
 }
 await browser.close();
 const report={pages:urls.length,viewports:[390,1440],checks,failures,metrics,limitations:'Local disk-backed browser rendering; third-party requests blocked. CLS samples are lab observations, not field CWV or Lighthouse scores.'};
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
