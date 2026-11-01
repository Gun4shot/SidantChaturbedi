import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
try{
 for(const [width,height] of [[1440,900],[390,844],[390,667],[844,390]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'})
 await page.goto('http://127.0.0.1:5175/?view=still',{waitUntil:'networkidle'})
 await page.locator('#community').scrollIntoViewIfNeeded()
 for(const [label,title] of [['AION','Scientific & training lead'],['Club','Building, together.'],['Tutoring','Making ideas click.'],['Service','Learning goes both ways.']]){
 await page.getByRole('button',{name:label,exact:true}).click()
 assert.equal(await page.locator('.chalk-story h3').textContent(),title)
 const fit=await page.locator('.chalk-story').evaluate(el=>({w:el.clientWidth,sw:el.scrollWidth,h:el.clientHeight,sh:el.scrollHeight}))
 assert.ok(fit.sw<=fit.w+1,`no horizontal overflow ${width} ${label}`)
 if(height>450) assert.ok(fit.sh<=fit.h+1,`no internal scroll ${width}x${height} ${label}: ${JSON.stringify(fit)}`)
 }
 await page.getByRole('button',{name:'AION',exact:true}).focus();await page.keyboard.press('Enter')
 assert.match(await page.locator('.chalk-story a').getAttribute('href'),/aionepal.org/)
 await page.locator('#community').screenshot({path:`artifacts/review/folio-${width}-${height}.png`})
 await page.close()
 }
 console.log('Four story choices, keyboard access, canonical destination and responsive text fit passed.')
}finally{await browser.close()}
