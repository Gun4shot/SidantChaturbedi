import {createRequire} from 'node:module'
import {mkdir} from 'node:fs/promises'
import assert from 'node:assert/strict'
import {journeyToScroll} from '../src/scroll-timing.ts'
import {profile} from '../src/profile.ts'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']})
await mkdir('artifacts/review',{recursive:true})
const errors=[]
try{
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},permissions:['clipboard-read','clipboard-write']})
  page.on('pageerror',e=>errors.push(e.message))
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(`${r.status()} ${r.url()}`)})
  await page.goto('http://127.0.0.1:5175/',{waitUntil:'networkidle'})
  await page.waitForSelector('.is-ready',{timeout:60000})
  const travel=async p=>{await page.evaluate(f=>scrollTo({top:f*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'}),journeyToScroll(p));await page.waitForTimeout(1800)}
  for(const [i,p] of [3.53,3.69,3.80,3.92,4.04,4.15,4.29].entries()){
   await travel(p);await page.waitForSelector('.courtyard-ready',{timeout:60000})
   await page.screenshot({path:`artifacts/review/contact-${name}-${i}.png`})
  }
  assert.equal(await page.locator('#contact').getAttribute('aria-hidden'),'false')
  assert.equal(await page.locator('#community').getAttribute('inert'),'')
  assert.equal(await page.locator('.contact-email').getAttribute('href'),`mailto:${profile.email}`)
  assert.equal(await page.locator('.letter-links a').first().getAttribute('href'),profile.github)
  assert.equal(await page.locator('.letter-links a').nth(1).getAttribute('href'),profile.linkedin)
  await page.getByRole('button',{name:'Copy email',exact:true}).click()
  await page.waitForTimeout(200)
  assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),profile.email)
  assert.match(await page.locator('.copy-feedback').textContent(),/copied/)
  console.log(name,'letter content',await page.locator('.contact-letter').evaluate(el=>({height:el.clientHeight,scrollHeight:el.scrollHeight})))
  await travel(3.92);await page.screenshot({path:`artifacts/review/contact-${name}-reverse.png`})
  await travel(3.53)
  assert.equal(await page.locator('#community').getAttribute('inert'),null)
  await page.getByRole('button',{name:/Let’s start a conversation/}).click()
  await page.waitForTimeout(2800)
  assert.equal(await page.locator('#contact').getAttribute('inert'),null)
  await page.getByRole('button',{name:/Back to the courtyard/}).click()
  await page.waitForTimeout(2800)
  assert.equal(await page.locator('#community').getAttribute('inert'),null)
  if(name==='desktop'){
   await page.setViewportSize({width:844,height:390});await travel(4.29)
   await page.screenshot({path:'artifacts/review/contact-landscape.png'})
   for(const selector of ['.contact-email','.letter-links a','.letter-links button']){
    for(const el of await page.locator(selector).all()){
     const box=await el.boundingBox();assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=844&&box.y+box.height<=390,'contact controls stay inside short landscape viewport')
    }
   }
   await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Clipboard unavailable')}}}))
   await page.getByRole('button',{name:'Copy email',exact:true}).click()
   assert.match(await page.locator('.copy-feedback').textContent(),/Select the address/)
  }
  await page.close()
 }
 const still=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'})
 await still.goto('http://127.0.0.1:5175/?view=still',{waitUntil:'networkidle'})
 await still.locator('#contact').scrollIntoViewIfNeeded()
 await still.screenshot({path:'artifacts/review/contact-still.png'})
 assert.equal(await still.locator('#contact').getAttribute('inert'),null)
 assert.equal(await still.locator('.contact-email').getAttribute('href'),`mailto:${profile.email}`)
 assert.deepEqual(errors,[])
 console.log('Contact links, clipboard, forward/reverse passage, reading controls and reduced motion passed.')
}finally{await browser.close()}
