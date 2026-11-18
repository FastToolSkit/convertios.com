const {chromium}=require('C:/workspace/convertios-pt-qa/node_modules/playwright');
const fs=require('fs'); const path=require('path'); const {execFileSync}=require('child_process');
const root=path.resolve(__dirname,'../..');
const out=path.join(__dirname,'screenshots');fs.mkdirSync(out,{recursive:true});
const phase=process.argv[2]||'after';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 for(const [device,width,height] of [['desktop',1440,1050],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  await page.route('**/*',route=>{
   const u=new URL(route.request().url());if(u.hostname!=='127.0.0.1')return route.abort();
   let file=path.join(root,decodeURIComponent(u.pathname));
   if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
   const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
   return fs.existsSync(file)?route.fulfill({body:fs.readFileSync(file),contentType:mime[path.extname(file)]||'application/octet-stream'}):route.fulfill({status:404,body:'Not found'});
  });
  if(phase==='original') {const original=execFileSync('git',['show','origin/main:blog/index.html'],{cwd:root});await page.route('**/blog/',r=>r.fulfill({contentType:'text/html',body:original}));}
  const pages=phase==='original'?[['home','/blog/']]:[['home','/blog/'],['article','/blog/convert-pdf-to-word-keep-formatting/'],['category','/blog/category/pdf-documents/'],['page-2','/blog/page/2/'],['arabic','/ar/blog/']];
  for(const [name,url] of pages){
   await page.goto('http://127.0.0.1:8890'+url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   // Load lazy images before the full-page evidence capture.
   await page.evaluate(async()=>{const imgs=[...document.images];imgs.forEach(i=>i.loading='eager');await Promise.all(imgs.map(i=>i.decode().catch(()=>{})));});
   await page.screenshot({path:path.join(out,`${phase}-${name}-${device}.png`),fullPage:true});
   if(name==='home') {await page.screenshot({path:path.join(out,`${phase}-home-${device}-viewport.png`)});const nav=page.locator('.lib-pagination');if(await nav.count())await nav.screenshot({path:path.join(out,`${phase}-pagination-${device}.png`)});}
   console.log(phase,name,device,await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)})));
  }await page.close();
 }await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
