import {createRequire} from 'node:module'
import {mkdir} from 'node:fs/promises'
import assert from 'node:assert/strict'
import {journeyToScroll} from '../src/scroll-timing.ts'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']})
const label=process.argv[2]??'after',errors=[]
await mkdir('artifacts/review',{recursive:true})
try {
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height}})
  page.on('pageerror',e=>errors.push(e.message))
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(`${r.status()} ${r.url()}`)})
  await page.goto('http://127.0.0.1:5175/',{waitUntil:'networkidle'})
  await page.waitForSelector('.is-ready',{timeout:60000})
  const travel=async p=>{await page.evaluate(f=>scrollTo({top:f*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'}),journeyToScroll(p));await page.waitForTimeout(2000)}
  for(const [frame,p] of [['arriving',1.14],['clearing',1.205],['opening',1.28],['reading',1.41]]){
   await travel(p)
   await page.screenshot({path:`artifacts/review/project-${label}-${name}-${frame}.png`})
  }
  assert.equal(await page.locator('.meadow-environment').evaluate(el=>getComputedStyle(el).filter),'none','settled clearing must not be blurred')
  assert.ok(await page.locator('.book-project-link').getAttribute('href'))
  if(label!=='before'){
   const light=()=>page.locator('.meadow-sunlight').evaluate(el=>getComputedStyle(el).transform)
   const moving=await light();await page.waitForTimeout(500)
   assert.notEqual(await light(),moving,'sunlight drifts while ambient motion is running')
   // The global controls live in the opening scene; use the actual visible UI.
   await travel(.15)
   await page.getByRole('button',{name:'Pause ambient animation',exact:true}).click()
   await travel(1.41)
   await page.waitForTimeout(250);const paused=await light();await page.waitForTimeout(500)
   assert.equal(await light(),paused,'sunlight respects Pause')
   await travel(.15)
   await page.getByRole('button',{name:'Resume ambient animation',exact:true}).click()
   await travel(1.41)
  }
  await page.getByRole('button',{name:'Next project',exact:true}).click()
  await page.waitForTimeout(1300)
  assert.match(await page.locator('.reader-count').textContent(),/02/)
  await page.getByRole('button',{name:'Previous',exact:true}).click()
  await page.waitForTimeout(1300)
  assert.match(await page.locator('.reader-count').textContent(),/01/)
  await page.locator('.index-trigger').click()
  assert.equal(await page.locator('.project-index').evaluate(el=>el.open),true)
  await page.getByRole('button',{name:'Close project index',exact:true}).click()
  for(const [frame,p] of [['bird',1.62],['reverse',1.205]]) {
   await travel(p);await page.screenshot({path:`artifacts/review/project-${label}-${name}-${frame}.png`})
  }
  console.log(name,'project links, page turns, index, reverse scroll and screenshots passed')
  await page.close()
 }
 assert.deepEqual(errors,[])
} finally {await browser.close()}
