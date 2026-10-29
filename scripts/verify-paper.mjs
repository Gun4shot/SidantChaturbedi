import {createRequire} from 'node:module'
import {mkdir} from 'node:fs/promises'
import {journeyToScroll} from '../src/scroll-timing.ts'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']})
await mkdir('artifacts/review',{recursive:true})
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1})
 page.on('pageerror',e=>console.log('PAGE_ERROR',e.message))
 await page.goto('http://127.0.0.1:5175/',{waitUntil:'networkidle'})
 await page.waitForSelector('.is-ready',{timeout:60000})
 for(const [scene,p] of [['projects',1.41],['honors',2.03],['unroll',2.60],['paper',2.68]]){
  await page.evaluate(f=>window.scrollTo({top:f*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'}),journeyToScroll(p))
  await page.waitForTimeout(2200)
  await page.screenshot({path:`artifacts/review/${name}-${scene}.png`})
 }
 console.log(name,await page.locator('.library-paper').evaluate(el=>({width:el.clientWidth,scrollWidth:el.scrollWidth,abstract:el.textContent.includes('Unpaved rural roads'),images:[...el.querySelectorAll('img')].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0}))})))
 await page.locator('.library-paper').evaluate(el=>el.scrollTop=el.scrollHeight)
 await page.waitForTimeout(800)
 await page.screenshot({path:`artifacts/review/${name}-methods.png`})
 await page.getByRole('button',{name:/02 Roads as networks/}).click()
 await page.waitForTimeout(1200)
 console.log(name,'second record',await page.locator('.library-paper h3').textContent())
 await page.close()
}
await browser.close()
