// Focused visual regression captures for the overlapping interior/exterior floors.
import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
import {journeyToScroll} from '../src/scroll-timing.ts'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']})
const label=process.argv[2]==='before'?'before':'after',errors=[]
await mkdir('artifacts/review',{recursive:true})
try{
 for(const [name,width,height] of [['desktop',1333,797],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1})
  page.on('pageerror',e=>errors.push(e.message))
  await page.goto('http://127.0.0.1:5175/',{waitUntil:'networkidle'})
  await page.waitForSelector('.is-ready',{timeout:60000})
  for(const [i,p] of [2.98,3.02,3.08,3.23,3.53,3.02].entries()){
   await page.evaluate(f=>scrollTo({top:f*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'}),journeyToScroll(p))
   await page.waitForSelector('.courtyard-ready')
   await page.waitForTimeout(1600)
   await page.screenshot({path:`artifacts/review/floor-${label}-${name}-${i}.png`})
  }
  await page.close()
 }
 assert.deepEqual(errors,[])
 console.log(`${label}: floor approach, threshold, courtyard and reverse captured on desktop/mobile; no browser errors.`)
}finally{await browser.close()}
