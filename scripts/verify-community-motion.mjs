import {createRequire} from 'node:module'
import {journeyToScroll} from '../src/scroll-timing.ts'
import assert from 'node:assert/strict'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']})
try{for(const [width,height] of [[1440,900],[390,844]]){
 const page=await browser.newPage({viewport:{width,height}})
 await page.goto('http://127.0.0.1:5175/',{waitUntil:'networkidle'})
 await page.waitForSelector('.is-ready',{timeout:60000})
 await page.evaluate(f=>scrollTo({top:f*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'}),journeyToScroll(3.53))
 await page.waitForSelector('#community:not([inert])',{timeout:60000})
 for(const [label,id] of [['AION','aion'],['Club','club'],['Tutoring','tutor'],['Service','service']]){
 await page.getByRole('button',{name:label,exact:true}).click()
 await page.waitForFunction(id=>document.querySelector('.courtyard-board').dataset.story===id,id)
 await page.waitForSelector('.community-folio:not([inert])')
 assert.equal(await page.locator('.community-folio').evaluate(el=>getComputedStyle(el).opacity),'1')
 await page.screenshot({path:`artifacts/review/community-folio-${width}-${id}.png`})
 }
 await page.getByRole('button',{name:'AION',exact:true}).click()
 await page.getByRole('button',{name:'Tutoring',exact:true}).click()
 await page.getByRole('button',{name:'Club',exact:true}).click()
 await page.waitForFunction(()=>document.querySelector('.courtyard-board').dataset.story==='club')
 await page.waitForSelector('.community-folio:not([inert])')
 assert.match(await page.locator('.chalk-story h3').textContent(),/Building/)
 await page.getByRole('button',{name:/Let’s start a conversation/}).click()
 await page.waitForSelector('#contact:not([inert])',{timeout:30000})
 await page.getByRole('button',{name:/Back to the courtyard/}).click()
 await page.waitForSelector('#community:not([inert])',{timeout:30000})
 await page.close()
}console.log('Live illustrated stories, rapid switching, visible settled folio and contact round-trip passed.')}finally{await browser.close()}
