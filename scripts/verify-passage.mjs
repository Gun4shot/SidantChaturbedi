import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
import {journeyToScroll} from '../src/scroll-timing.ts'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']})
const errors=[]
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1})
 page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:5175/',{waitUntil:'networkidle'})
 await page.waitForSelector('.is-ready',{timeout:60000})
 const travel=async p=>{
  await page.evaluate(f=>window.scrollTo({top:f*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'}),journeyToScroll(p))
  await page.waitForTimeout(1800)
 }
 for(const [step,p] of [[1,2.20],[2,2.31],[3,2.385],[4,2.46],[5,2.55],[6,2.68]]){
  await travel(p)
  await page.screenshot({path:`artifacts/review/${name}-passage-${step}.png`})
 }
 assert.equal(await page.locator('.library-desk,.library-falling-medal').count(),0)
 const first=await page.locator('.library-paper h3').textContent()
 const fraction=()=>page.locator('.research-scroll').evaluate(el=>Number(getComputedStyle(el).getPropertyValue('--paper-open')))
 // Capture the close and the fresh unroll, not just the final changed heading.
 await page.evaluate(()=>{
  const sheet=document.querySelector('.research-scroll'),old=sheet.querySelector('h3').textContent
  window.paperSwapFraction=null
  const observer=new MutationObserver(()=>{
   if(sheet.querySelector('h3').textContent!==old){
    window.paperSwapFraction=Number(getComputedStyle(sheet).getPropertyValue('--paper-open'))
    observer.disconnect()
   }
  })
  observer.observe(sheet,{childList:true,subtree:true})
 })
 await page.getByRole('button',{name:/02 Roads as networks/}).click()
 await page.waitForTimeout(100)
 assert.ok(await fraction()<1,'sheet should close after selecting a new record')
 await page.screenshot({path:`artifacts/review/${name}-paper-closing.png`})
 await page.waitForFunction(old=>document.querySelector('.library-paper h3').textContent!==old,first)
 assert.equal(await page.evaluate(()=>window.paperSwapFraction),0,'new content is installed while the sheet is concealed')
 await page.waitForTimeout(200)
 await page.screenshot({path:`artifacts/review/${name}-paper-reopening.png`})
 await page.waitForTimeout(900)
 assert.equal(await fraction(),1)
 const buttons=page.locator('.library-shelf button')
 // Latest choice wins even if it arrives during close/open or returns to the current sheet.
 await buttons.nth(0).click();await buttons.nth(2).click();await buttons.nth(1).click()
 await page.waitForTimeout(1200)
 assert.equal(await buttons.nth(1).getAttribute('aria-pressed'),'true')
 assert.equal(await fraction(),1)
 await buttons.nth(0).click();await page.waitForTimeout(400);await buttons.nth(2).click()
 await page.waitForTimeout(1300)
 assert.equal(await buttons.nth(2).getAttribute('aria-pressed'),'true')
 assert.equal(await fraction(),1)
 // Reverse the scene and reenter; no abandoned local animation override.
 await travel(2.385)
 await page.screenshot({path:`artifacts/review/${name}-passage-reverse.png`})
 await travel(2.03);await travel(2.68)
 assert.equal(await fraction(),1)
 await page.emulateMedia({reducedMotion:'reduce'})
 await buttons.nth(0).click()
 await page.waitForTimeout(100)
 assert.equal(await buttons.nth(0).getAttribute('aria-pressed'),'true')
 console.log(name,'passage, replay, rapid selection, reverse and reduced motion passed')
 await page.close()
}
await browser.close()
assert.deepEqual(errors,[])
