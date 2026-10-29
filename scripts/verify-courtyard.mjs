import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
import {journeyToScroll} from '../src/scroll-timing.ts'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']})
await mkdir('artifacts/review',{recursive:true})
const errors=[]
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1})
 page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:5175/',{waitUntil:'networkidle'})
 await page.waitForSelector('.is-ready',{timeout:60000})
 const travel=async p=>{
  await page.evaluate(f=>window.scrollTo({top:f*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'}),journeyToScroll(p))
  await page.waitForTimeout(1900)
 }
 await travel(2.68)
 await page.waitForSelector('.courtyard-ready')
 await page.screenshot({path:`artifacts/review/${name}-court-library.png`})
 for(const [step,p] of [[1,2.88],[2,3.02],[3,3.14],[4,3.28],[5,3.40],[6,3.53]]){
  await travel(p)
  await page.screenshot({path:`artifacts/review/${name}-court-${step}.png`})
 }
 assert.equal(await page.locator('#community').getAttribute('aria-hidden'),'false')
 assert.equal(await page.locator('.library-reading').getAttribute('inert'),'')
 console.log(name,'layout',await page.locator('.chalk-story').evaluate(el=>({width:el.clientWidth,scrollWidth:el.scrollWidth,height:el.clientHeight,scrollHeight:el.scrollHeight})))
 for(const tab of ['Club','Tutoring','Service','AION']){
  await page.getByRole('button',{name:new RegExp(tab)}).click()
  await page.waitForTimeout(450)
  console.log(name,tab,await page.locator('.chalk-story h3').textContent())
 }
 await page.screenshot({path:`artifacts/review/${name}-court-final.png`})
 await travel(3.14)
 await page.screenshot({path:`artifacts/review/${name}-court-reverse.png`})
 await travel(2.68)
 assert.equal(await page.locator('.library-reading').getAttribute('inert'),null)
 await page.getByRole('button',{name:/02 Roads as networks/}).click()
 await page.waitForTimeout(1200)
 assert.match(await page.locator('.library-paper h3').textContent(),/Graph-attention/)
 await page.getByRole('button',{name:/Into the courtyard/}).click()
 await page.waitForTimeout(2800)
 assert.equal(await page.locator('#community').getAttribute('aria-hidden'),'false')
 await page.close()
}
const still=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'})
await still.goto('http://127.0.0.1:5175/?view=still',{waitUntil:'networkidle'})
await still.locator('#community').scrollIntoViewIfNeeded()
await still.screenshot({path:'artifacts/review/mobile-court-still.png'})
await still.getByRole('button',{name:/Service/}).click()
assert.match(await still.locator('.chalk-story h3').textContent(),/Learning goes both ways/)
await browser.close()
assert.deepEqual(errors,[])
console.log('Desktop/mobile scenes, story selection, reverse, manuscript replay, continue control and static fallback passed.')
