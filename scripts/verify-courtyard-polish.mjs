import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
import {journeyToScroll} from '../src/scroll-timing.ts'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']})
const page=await browser.newPage({viewport:{width:1440,height:900}})
await page.goto('http://127.0.0.1:5175/',{waitUntil:'networkidle'})
await page.waitForSelector('.is-ready')
await page.evaluate(f=>scrollTo(0,f*(document.documentElement.scrollHeight-innerHeight)),journeyToScroll(2.68))
await page.waitForSelector('.courtyard-ready')
for(const p of [3.20,3.23,3.25,3.26,3.27]){
 await page.evaluate(f=>scrollTo(0,f*(document.documentElement.scrollHeight-innerHeight)),journeyToScroll(p))
 await page.waitForTimeout(1500)
 await page.screenshot({path:`artifacts/review/threshold-${p}.png`})
}
await page.evaluate(f=>scrollTo(0,f*(document.documentElement.scrollHeight-innerHeight)),journeyToScroll(3.53))
await page.waitForTimeout(2500)
const checkBoard=async()=>{
 const box=await page.locator('.courtyard-board').evaluate(el=>{
  const bounds=el.getBoundingClientRect()
  return {x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height,left:el.offsetLeft,top:el.offsetTop,layoutWidth:el.offsetWidth,layoutHeight:el.offsetHeight}
 })
 assert.ok(Math.abs(box.x-box.left)<1&&Math.abs(box.y-box.top)<1,'settled camera preserves the responsive board position')
 assert.ok(Math.abs(box.width-box.layoutWidth)<1&&Math.abs(box.height-box.layoutHeight)<1,'HTML and painted board dimensions agree')
}
await checkBoard()
assert.match(await page.locator('.courtyard-intro p').textContent(),/others\. Learning/)
await page.screenshot({path:'artifacts/review/desktop-court-final.png'})
await page.setViewportSize({width:844,height:390})
await page.evaluate(f=>scrollTo(0,f*(document.documentElement.scrollHeight-innerHeight)),journeyToScroll(3.53))
await page.waitForTimeout(1200)
await checkBoard()
await page.screenshot({path:'artifacts/review/landscape-court-final.png'})
await page.getByRole('button',{name:/Service/}).click()
assert.match(await page.locator('.chalk-story h3').textContent(),/Learning goes both ways/)
await page.emulateMedia({reducedMotion:'reduce'})
await page.waitForTimeout(600)
assert.equal(await page.locator('.library-reading').getAttribute('inert'),null)
console.log('Board projection alignment, short landscape, text spacing, and live reduced-motion change passed.')
await browser.close()
