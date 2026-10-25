import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { honorsFlight, GROVE_SETTLED } from './honors-motion'
import { honors, profile } from './profile'
import { publicationMotion, LIBRARY_START, type MedalAnchor } from './publication-motion'
import './honors-journey.css'

export type HonorsHandle = { update(progress: number, time: number): MedalAnchor | undefined }
const HonorsJourney = forwardRef<HonorsHandle, { staticMode: boolean; onTravel(p: number): void }>(function HonorsJourney({ staticMode, onTravel }, ref) {
  const root = useRef<HTMLElement>(null), crane = useRef<HTMLDivElement>(null)
  const ornaments = useRef<(HTMLButtonElement | null)[]>([])
  const stage=useRef<HTMLDivElement>(null),fallBlur=useRef<SVGFEGaussianBlurElement>(null)
  const anchor=useRef<MedalAnchor|undefined>(undefined),dimensions=useRef('')
  const [active, setActive] = useState(staticMode), [reading, setReading] = useState(staticMode), [selected, setSelected] = useState(0)
  useImperativeHandle(ref, () => ({ update(p, time) {
    if (staticMode || !root.current || !crane.current) return
    const pose = honorsFlight(p, innerWidth, innerHeight), visible = p > 1.35 && p < 2.50
    const dimensionKey=`${innerWidth}/${innerHeight}`
    if(ornaments.current[0]&&(!anchor.current||p<=LIBRARY_START||dimensions.current!==dimensionKey)){
      const transform=stage.current?.style.transform
      if(stage.current)stage.current.style.transform='none'
      const r=ornaments.current[0].getBoundingClientRect()
      anchor.current={x:r.left+r.width*.5,y:r.top+r.height*.81,size:r.width*.47}
      if(stage.current)stage.current.style.transform=transform||''
      dimensions.current=dimensionKey
    }
    const departure=publicationMotion(p,innerWidth,innerHeight,anchor.current??{x:innerWidth*.55,y:innerHeight*.55,size:90})
    setActive(old => old === visible ? old : visible)
    const canRead=p>=GROVE_SETTLED-.04&&p<=LIBRARY_START
    setReading(old=>old===canRead?old:canRead)
    const style=root.current.style
    style.setProperty('--grove-blend', String(pose.blend))
    style.setProperty('--grove-ui', String(pose.ui*(1-departure.release)))
    style.setProperty('--medal-release',String(departure.release))
    style.setProperty('--honors-underlay',String(departure.release))
    if(stage.current)stage.current.style.transform=`translateY(${departure.groveY}px) scale(${departure.groveScale})`
    fallBlur.current?.setAttribute('stdDeviation',`0 ${departure.blur}`)
    style.setProperty('--grove-scale', String(pose.backgroundScale))
    style.setProperty('--branch-scale', String(pose.branchScale))
    style.setProperty('--grove-drift', `${(1-pose.retreat)*-10}%`)
    style.setProperty('--grove-breath', `${Math.sin(time*.27)*.6}deg`)
    crane.current.style.width='384px'
    crane.current.style.opacity=String(pose.craneOpacity)
    const flutter=pose.wing*1.5
    crane.current.style.setProperty('--wing-fold',`${pose.wing*10}deg`)
    crane.current.style.transform=`translate3d(${pose.x}px,${pose.y}px,0) translate(-45%,-58%) rotate(${pose.rotation+flutter}deg) scale(${pose.size/384})`
    ornaments.current.forEach((el,i)=>{if(el)el.style.setProperty('--sway',`${Math.sin(time*.8+i*1.8)*(i===selected?1.1:2.2)*(1-departure.release)}deg`)})
    return anchor.current
  }}), [staticMode,selected])
  const award = honors[selected]
  return <section ref={root} id="honors" className={`honors-journey ${active?'honors-active':''} ${reading?'honors-reading':''} ${staticMode?'honors-still':''}`} aria-label="The laurel grove — honors and achievements" aria-hidden={!reading}>
    <svg className="honors-filter" aria-hidden="true"><defs><filter id="honors-fall-blur" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur ref={fallBlur} stdDeviation="0 0"/></filter></defs></svg>
    <div className="honors-departure" ref={stage} style={{position:'absolute',inset:0}}>
    <div className="grove-world" aria-hidden="true"><div className="grove-backdrop"/><div className="grove-sunlight"/><img className="grove-near-leaves" src="/art/laurel-branch-v2.png" alt=""/><div className="grove-dust">{Array.from({length:16},(_,i)=><i key={i} style={{left:`${(i*17+13)%100}%`,top:`${(i*23+19)%100}%`,animationDelay:`${-i*.7}s`}}/>)}</div></div>
    <div className="grove-content" inert={!reading}>
      <header className="grove-header"><span>THE LAUREL GROVE <i> / </i> HONORS & ACHIEVEMENTS</span><button onClick={()=>staticMode?document.getElementById('projects')?.scrollIntoView():onTravel(1.41)}>↙ Back to the journal</button></header>
      <div className="grove-introduction"><span className="grove-eyebrow">CURIOSITY TAKES FLIGHT</span><h2>A little courage.<br/><em>A wider world.</em></h2><p>Some moments I carry with me.</p></div>
      <div className="grove-mobile" onPointerMove={e=>{if(staticMode)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--look',`${((e.clientX-r.left)/r.width-.5)*5}deg`)}} onPointerLeave={e=>e.currentTarget.style.setProperty('--look','0deg')}>
        <img className="grove-branch" src="/art/laurel-branch-v2.png" alt=""/>
        <nav className="grove-keepsakes" aria-label="Choose an achievement">{honors.map((h,i)=><button ref={el=>{ornaments.current[i]=el}} key={h.short} className={`grove-keepsake keepsake-${i}`} aria-pressed={selected===i} aria-label={`${h.short}: ${h.distinction}`} onClick={()=>setSelected(i)}>{i===0?<><img className="medal-ribbon-only" src="/art/honor-ribbon-v2.png" alt=""/><img className="medal-face-only" src="/art/honor-ribbon-v2.png" alt=""/></>:<img src="/art/honor-ribbon-v2.png" alt=""/>}<span className="keepsake-symbol" aria-hidden="true">{h.symbol}</span><span className="keepsake-label">{h.short}<small>{i===selected?'EXPLORING':'EXPLORE ↗'}</small></span></button>)}</nav>
        <span className="grove-hint">Four keepsakes. Four stories.<br/><i>Choose one to look closer.</i></span>
      </div>
      <article className="grove-story" aria-live="polite" aria-atomic="true"><span className="grove-eyebrow">0{selected+1} / {award.label}</span><h3>{award.title}</h3><p>{award.detail}</p><div><strong>{award.distinction}</strong><span>{award.year}</span></div></article>
      <button className="grove-library-link" onClick={()=>staticMode?document.getElementById('library')?.scrollIntoView():onTravel(2.64)}>Follow a little further. The reading room awaits ↓</button>
      <footer className="grove-footer"><button onClick={()=>onTravel(0)}>↑ Back to the sky</button><span>THERE IS STILL SO MUCH TO EXPLORE.</span><div><a href={`mailto:${profile.email}`}>Say hello ↗</a><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div></footer>
    </div>
    </div>
    {!staticMode&&<div className="journey-crane" ref={crane} aria-hidden="true"><img src="/art/paper-crane-v2.png" alt=""/></div>}
  </section>
})
export default HonorsJourney

