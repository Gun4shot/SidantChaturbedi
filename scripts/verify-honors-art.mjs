import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
import {journeyToScroll} from '../src/scroll-timing.ts'
import {honors} from '../src/profile.ts'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']})
const label=process.argv[2]??'v4',errors=[]
await mkdir('artifacts/review',{recursive:true})
try{
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}})
  page.on('pageerror',e=>errors.push(e.message))
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(`${r.status()} ${r.url()}`)})
  await page.goto('http://127.0.0.1:5175/',{waitUntil:'networkidle'})
  await page.waitForSelector('.is-ready',{timeout:60000})
  const travel=async p=>{await page.evaluate(f=>scrollTo({top:f*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'}),journeyToScroll(p));await page.waitForTimeout(1900)}
  for(const [frame,p] of [['bird-near',1.71],['bird-retreat',1.80],['arriving',1.89],['reading',2.02]]){
   await travel(p);await page.screenshot({path:`artifacts/review/honors-${label}-${name}-${frame}.png`})
  }
  for(const award of honors){
   const button=page.getByRole('button',{name:`${award.short}: ${award.distinction}`,exact:true})
   // These buttons intentionally sway continuously; click without waiting for
   // a motionless bounding box, then verify the real selection result.
   await button.click({force:true});assert.equal(await button.getAttribute('aria-pressed'),'true')
   assert.equal(await page.locator('.grove-story h3').textContent(),award.title)
   const box=await page.locator('.grove-story').boundingBox()
   assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width&&box.y+box.height<=height,'award story stays on screen')
  }
  await page.getByRole('button',{name:`${honors[0].short}: ${honors[0].distinction}`,exact:true}).click({force:true})
  if(label!=='before'){
   const light=()=>page.locator('.grove-sunlight').evaluate(el=>getComputedStyle(el).transform)
   const moving=await light();await page.waitForTimeout(500);assert.notEqual(await light(),moving)
   await travel(.15);await page.getByRole('button',{name:'Pause ambient animation',exact:true}).click();await travel(2.02)
   const paused=await light();await page.waitForTimeout(500);assert.equal(await light(),paused,'honors light respects Pause')
   await travel(.15);await page.getByRole('button',{name:'Resume ambient animation',exact:true}).click();await travel(2.02)
  }
  for(const [frame,p] of [['leaf-approach',2.30],['leaf-cover',2.39],['library',2.64],['reverse',2.02]]){
   await travel(p);await page.screenshot({path:`artifacts/review/honors-${label}-${name}-${frame}.png`})
  }
  assert.equal(await page.locator('#honors').getAttribute('aria-hidden'),'false')
  console.log(name,'four awards, reading layout, lighting, forward/reverse transitions passed')
  await page.close()
 }
 assert.deepEqual(errors,[])
}finally{await browser.close()}
