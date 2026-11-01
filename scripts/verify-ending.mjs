import {createRequire} from 'node:module'
import {writeFile} from 'node:fs/promises'
import assert from 'node:assert/strict'
import {journeyToScroll} from '../src/scroll-timing.ts'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const sharp=require('sharp')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']})
try{
 for(const [width,height] of [[1440,900],[390,844]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:width<700,isMobile:width<700})
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:5175/',{waitUntil:'networkidle'})
 await page.waitForSelector('.is-ready',{timeout:60000})
 await page.getByRole('button',{name:'Pause ambient animation',exact:true}).click()
 await page.waitForTimeout(200)
 const isolate='.opening,.opening *,.site-header,.site-header *,.world-footer,.world-footer *,.chapter-nav,.chapter-nav *,.journey-progress,.ending-copy,.ending-copy *,.paper-grain{visibility:hidden!important}'
 const inspect=()=>page.locator('.newton-cutout').evaluate(el=>({style:el.getAttribute('style'),box:el.getBoundingClientRect().toJSON(),parent:el.parentElement.getAttribute('style')}))
 const first=await inspect()
 const start=await page.screenshot({style:isolate})
 const travel=async p=>{await page.evaluate(f=>scrollTo({top:f*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'}),journeyToScroll(p));await page.waitForTimeout(2200)}
 await travel(5.04)
 await page.waitForSelector('.ending-copy:not([inert])')
 assert.equal(await page.locator('.journey').getAttribute('data-return-sky'),'true')
 assert.equal(await page.locator('#contact').getAttribute('inert'),'')
 await page.screenshot({path:`artifacts/review/ending-${width}.png`})
 const end=await page.screenshot({style:isolate})
 await writeFile(`artifacts/review/loop-start-${width}.png`,start);await writeFile(`artifacts/review/loop-end-${width}.png`,end)
 assert.deepEqual(await inspect(),first,'foreground cutout has the identical opening transform')
 const a=await sharp(start).removeAlpha().raw().toBuffer(),b=await sharp(end).removeAlpha().raw().toBuffer()
 let different=0
 for(let i=0;i<a.length;i+=3){if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2]){different++;const x=(i/3)%width,y=Math.floor(i/3/width);assert.ok(x>=first.box.x-24&&x<=first.box.right+24&&y>=first.box.y-24&&y<=first.box.bottom+24,'sky matches exactly outside the rerasterized foreground cutout')}}
 assert.ok(different<width*height*.001,'less than 0.1% compositor antialiasing difference')
 await page.getByRole('button',{name:'Wander again',exact:false}).click()
 await page.waitForFunction(()=>scrollY<2)
 await page.waitForTimeout(200)
 assert.equal(await page.locator('.opening').getAttribute('inert'),null)
 await travel(5.47)
 await page.screenshot({path:`artifacts/review/loop-seam-${width}.png`})
 const before=Number(await page.locator('.world canvas').getAttribute('data-loop-count'))
 if(width>=700)await page.mouse.wheel(0,1800)
 else{const cdp=await page.context().newCDPSession(page);for(let swipe=0;swipe<4;swipe++){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width/2,y:height*.8}]});for(let step=1;step<=12;step++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width/2,y:height*(.8-step*.05)}]});await page.waitForTimeout(20)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(200)}await cdp.detach()}
 await page.waitForFunction(n=>Number(document.querySelector('.world canvas').dataset.loopCount)>n,before,{timeout:30000})
 assert.ok(await page.evaluate(()=>scrollY<innerHeight*2),'loop returns to opening range even with residual gesture momentum')
 assert.equal(await page.locator('.opening').getAttribute('inert'),null)
 await page.keyboard.press('PageDown');await page.waitForTimeout(700)
 assert.ok(await page.evaluate(()=>scrollY>0),'second traversal scrolls normally')
 await travel(5.04);await travel(4.29)
 await page.getByRole('button',{name:'Resume ambient animation',exact:true}).evaluate(el=>el.click())
 await page.waitForSelector('#contact:not([inert])',{timeout:30000})
 assert.deepEqual(errors,[])
 await page.close()
 }
 const still=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'})
 await still.goto('http://127.0.0.1:5175/?view=still',{waitUntil:'networkidle'})
 await still.locator('.ending-still').scrollIntoViewIfNeeded()
 await still.getByRole('button',{name:'Wander again',exact:false}).click()
 await still.waitForFunction(()=>scrollY<2)
 console.log('Matching sky and foreground geometry, thank-you, button restart, wheel/touch loop, continued scrolling, reverse and reduced motion passed.')
}finally{await browser.close()}
