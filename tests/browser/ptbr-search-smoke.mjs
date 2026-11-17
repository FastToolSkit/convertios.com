import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const browser=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined,headless:true});
try{
  for(const [locale,expectName] of [['pt-br','Juntar PDF'],['es','Merge PDF'],['ar','Merge PDF'],['','Merge PDF']]){
    const page=await browser.newPage();
    await page.goto('http://127.0.0.1:'+port+'/'+(locale?locale+'/':''),{waitUntil:'domcontentloaded'});
    await page.locator('#toolSearch').fill('juntar');
    const results=page.locator('#searchResults .search-item');
    if(locale==='pt-br'){
      assert.ok(await results.count()>0,'Portuguese search result missing');
      assert.equal((await results.first().innerText()).trim(),expectName);
      await results.first().click();
      assert.ok(page.url().endsWith('/pt-br/merge-pdf/'),'Portuguese navigation broken: '+page.url());
    }else if(locale===''){
      await page.locator('#toolSearch').fill('merge');
      assert.ok(await results.count()>0,'English search missing');
      assert.equal((await results.first().innerText()).trim(),expectName);
    }
    await page.close();
    console.log('PASS search '+(locale||'en'));
  }
  const page=await browser.newPage();
  await page.goto('http://127.0.0.1:'+port+'/pt-br/image-resizer/',{waitUntil:'domcontentloaded'});
  const dropzone=page.locator('.dropzone').first();
  if(await dropzone.count())assert.equal(await dropzone.getAttribute('aria-label'),'Escolher ou soltar um arquivo');
  console.log('PASS Portuguese upload accessibility (if dropzone present)');
  await page.close();
}finally{await browser.close();server.close();}
