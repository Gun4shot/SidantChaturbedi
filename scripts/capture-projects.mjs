import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { projects } from '../src/projects.ts'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
await mkdir('public/art/projects',{recursive:true})
const manifest=[]
let next=0
await Promise.all([0,1].map(async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1})
 while(next<projects.length){
  const p=projects[next++]
  let url=p.demo||p.url,kind=p.demo?'Live application':'GitHub repository'
  try{
   const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000})
   await page.waitForTimeout(3500)
   const body=await page.locator('body').innerText()
   if(!response?.ok()||/service unavailable|not found|application failed|Your service is waking|Preparing service|deployment_not_found/i.test(body))throw Error('Site unavailable')
  }catch{
   url=p.url;kind='GitHub repository'
   await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000})
   await page.waitForTimeout(2000)
  }
  await page.screenshot({path:`public/art/projects/${p.slug}.jpg`,type:'jpeg',quality:85})
  manifest.push({slug:p.slug,url,kind,captured:'2026-10-27',title:await page.title()})
  console.log(p.slug,kind,await page.title())
 }
 await page.close()
}))
await writeFile('docs/project-captures.json',JSON.stringify(manifest,null,2))
await browser.close()
