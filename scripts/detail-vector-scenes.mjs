// Original vector embellishments, placed only within existing painted foliage.
// The stable seed makes exports reproducible and keeps details fixed during scrolling.
import {createRequire} from 'node:module'
import {readFile,writeFile} from 'node:fs/promises'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const sharp=require('sharp')
let seed=260630
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
const n=v=>Number(v.toFixed(2))
const {data,info}=await sharp('assets/source/contact-panorama-v4.png').ensureAlpha().raw().toBuffer({resolveWithObject:true})
const pixel=(x,y)=>{const i=(Math.floor(y)*info.width+Math.floor(x))*4;return [...data.subarray(i,i+4)]}
const green=([r,g,b,a])=>a>240&&g>r*1.12&&g>b*1.16&&g>58
const color=(c,f)=>`rgb(${c.slice(0,3).map(v=>Math.min(255,Math.round(v*f))).join(',')})`
const details=[]
for(const [x,y,w,h,count,size] of [[15,180,180,520,95,4.2],[1880,170,275,440,110,4.2],[280,5,1330,175,100,3.2],[1270,415,120,85,25,2.8]]){
 let placed=0
 for(let tries=0;tries<count*30&&placed<count;tries++){
  const px=x+random()*w,py=y+random()*h,c=pixel(px,py)
  if(!green(c))continue
  const s=size*(.6+random()*.6),angle=-65+random()*130
  details.push(`<g transform="translate(${n(px)} ${n(py)}) rotate(${n(angle)})" opacity=".72"><path d="M0 ${n(s)} Q${n(-s*.8)} 0 0 ${n(-s)} Q${n(s*.9)} 0 0 ${n(s)}Z" fill="${color(c,1.14)}" stroke="${color(c,.64)}" stroke-width=".38"/><path d="M0 ${n(s*.8)} Q.2 0 0 ${n(-s*.75)} M0 0 l${n(s*.35)} ${n(-s*.36)}" fill="none" stroke="${color(c,1.55)}" stroke-width=".32"/></g>`)
  placed++
 }
}
// Small blossoms tucked into the existing flowering shrubs, not across the landscape.
for(const [x,y,w,h] of [[30,490,135,180],[1985,395,130,140],[1275,435,85,48]]){
 for(let i=0,placed=0;i<200&&placed<10;i++){
  const px=x+random()*w,py=y+random()*h
  if(!green(pixel(px,py)))continue
  const r=1.2+random()*.8,coral=random()>.72
  details.push(`<g transform="translate(${n(px)} ${n(py)}) rotate(${n(random()*70)})" fill="${coral?'#f3b09a':'#fff5d5'}" stroke="#69815a" stroke-width=".25">${Array.from({length:5},(_,j)=>`<ellipse cy="${n(-r)}" rx="${n(r*.56)}" ry="${n(r)}" transform="rotate(${j*72})"/>`).join('')}<circle r=".75" fill="#e6b954" stroke="none"/></g>`)
  placed++
 }
}
// Quiet, tapered snow ridges: these remain fine marks rather than texture noise.
// Pick out a few real stone boundaries using the source painting as a placement guide.
for(let attempt=0,placed=0;attempt<600&&placed<24;attempt++){
 const x=330+random()*1540,y=450+random()*52,c=pixel(x,y),above=pixel(x,y-2)
 if(c[0]<135||c[0]<c[1]||c[2]>c[1]*.86||c[0]-above[0]<25)continue
 const length=2+random()*4
 details.push(`<path d="M${n(x)} ${n(y)}q${n(length*.5)} -.6 ${n(length)} -.3" fill="none" stroke="#f6dfa4" stroke-width=".55" stroke-linecap="round" opacity=".65"/>`)
 placed++
}
details.push(`<g fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".54"><path d="M525 152l-10 28-8 7m-4 3-15 17m24-23 10 8 7 18m14-18 18 21 14 7" stroke="#f8fcf0" stroke-width=".75"/><path d="M495 201l-7 11-14 7m65-20 5 17 12 10" stroke="#4d8abe" stroke-width=".65"/></g>`)
// Sparse blades rooted at existing paving joints, with warm rim lighting.
for(const [x,y,s] of [[308,650,1],[892,665,.85],[1542,621,.7],[1819,572,.5]])details.push(`<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke-linecap="round"><path d="M0 0q-4-11-8-13M1 0q0-14 5-19M2 0q6-9 11-10" stroke="#527144" stroke-width="1.2"/><path d="M1 0q0-10 4-16" stroke="#bccb79" stroke-width=".55"/></g>`)
let svg=await readFile('assets/source/contact-panorama-v5.svg','utf8')
svg=svg.replace('</svg>',`<g id="close-view-details">${details.join('')}</g></svg>`)
await writeFile('assets/source/contact-panorama-v6.svg',svg)
console.log('Added',details.length,'curated vector detail groups')
