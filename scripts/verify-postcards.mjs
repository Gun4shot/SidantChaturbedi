import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
try {
 for(const [width,height] of [[1440,900],[390,844],[390,667],[844,390]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'})
 await page.goto('http://127.0.0.1:5175/?view=still',{waitUntil:'networkidle'})
 await page.locator('#contact').scrollIntoViewIfNeeded()
 for(const [name,match] of [['GitHub','github.com/gun4shot'],['LinkedIn','linkedin.com/in/'],['Email','mailto:']]){
 await page.getByRole('button',{name,exact:true}).click()
 assert.ok((await page.locator('.postcard-action').getAttribute('href')).includes(match))
 assert.equal(await page.getByRole('button',{name,exact:true}).getAttribute('aria-pressed'),'true')
 }
 await page.locator('#contact').screenshot({path:`artifacts/review/postcards-${width}-${height}.png`})
 await page.getByRole('button',{name:'A research idea',exact:true}).click()
 await page.getByRole('textbox',{name:/Your note/}).fill('Hello & a question?\nAbout earth observation.')
 const mail=new URL(await page.locator('.postcard-action').getAttribute('href'))
 assert.equal(mail.searchParams.get('subject'),'A research idea')
 assert.equal(mail.searchParams.get('body'),'Hello & a question?\nAbout earth observation.')
 await page.getByRole('button',{name:'GitHub',exact:true}).focus()
 await page.keyboard.press('Enter')
 assert.equal(await page.getByRole('button',{name:'GitHub',exact:true}).getAttribute('aria-pressed'),'true')
 await page.getByRole('button',{name:'Email',exact:true}).click()
 assert.equal(await page.getByRole('textbox',{name:/Your note/}).inputValue(),'Hello & a question?\nAbout earth observation.')
 await page.locator(width<700?'.mobile-breeze':'.breeze-button').click()
 assert.equal(await page.locator('.flying-crane').getAttribute('data-flying'),'true')
 assert.equal(await page.locator('.flying-crane').evaluate(el=>getComputedStyle(el).animationName),'none')
 const contact=await page.locator('#contact').boundingBox()
 const links=await page.locator('.letter-links').boundingBox()
 assert.ok(links.y+links.height<contact.y+contact.height,'Links remain within contact section')
 await page.close()
 }
 console.log('Postcard selection, destinations and reduced-motion layouts passed at four sizes.')
} finally {await browser.close()}
