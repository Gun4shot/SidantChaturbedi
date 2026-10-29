import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { honorsFlight, GROVE_SETTLED } from './honors-motion'
import { honors, profile } from './profile'
import { publicationMotion, LIBRARY_START } from './publication-motion'
import './honors-journey.css'

export type HonorsHandle = { update(progress: number, time: number): void }
const HonorsJourney = forwardRef<HonorsHandle, { staticMode: boolean; onTravel(p: number): void }>(function HonorsJourney({ staticMode, onTravel }, ref) {
  const root = useRef<HTMLElement>(null), crane = useRef<HTMLDivElement>(null)
  const ornaments = useRef<(HTMLButtonElement | null)[]>([])
  const stage=useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(staticMode), [reading, setReading] = useState(staticMode), [selected, setSelected] = useState(0)
  useImperativeHandle(ref, () => ({ update(p, time) {
    if (staticMode || !root.current || !crane.current) return
    const pose = honorsFlight(p, innerWidth, innerHeight), visible = p > 1.35 && p < 2.50
    const departure=publicationMotion(p,innerWidth,innerHeight)
    setActive(old => old === visible ? old : visible)
    const canRead=p>=GROVE_SETTLED-.04&&p<=LIBRARY_START
    setReading(old=>old===canRead?old:canRead)
    const style=root.current.style
    style.setProperty('--grove-blend', String(pose.blend))
    style.setProperty('--grove-ui', String(pose.ui*(1-departure.release)))
    style.setProperty('--medal-release','0')
    style.setProperty('--honors-underlay',String(departure.release))
    if(stage.current)stage.current.style.transform=`translate3d(${departure.groveX}px,${departure.groveY}px,0) scale(${departure.groveScale})`
    style.setProperty('--grove-scale', String(pose.backgroundScale))
    style.setProperty('--branch-scale', String(pose.branchScale))
    style.setProperty('--grove-drift', `${(1-pose.retreat)*-10}%`)
    style.setProperty('--grove-breath', `${Math.sin(time*.27)*.6}deg`)
    if(visible){
      // Shared ambient time keeps light, pollen and medal highlights in step
      // with the existing Pause control, including reverse scroll playback.
      style.setProperty('--honors-light-x',`${Math.sin(time*.16)*14}px`)
      style.setProperty('--honors-light-y',`${Math.sin(time*.12+.5)*8}px`)
      style.setProperty('--honors-light',String(.64+Math.sin(time*.21)*.08))
      style.setProperty('--metal-light-x',`${Math.sin(time*.25)*35}%`)
      style.setProperty('--honors-float',`${Math.sin(time*.22)*6}px`)
    }
    crane.current.style.width='384px'
    crane.current.style.opacity=String(pose.craneOpacity)
    const flutter=0
    crane.current.style.setProperty('--wing-fold',`${pose.wing*10}deg`)
    crane.current.style.transform=`translate3d(${pose.x}px,${pose.y}px,0) translate(-45%,-58%) rotate(${pose.rotation+flutter}deg) scale(${pose.size/384})`
    ornaments.current.forEach((el,i)=>{if(el)el.style.setProperty('--sway',`${Math.sin(time*.8+i*1.8)*(i===selected?1.1:2.2)*(1-departure.release)}deg`)})
  }}), [staticMode,selected])
  const award = honors[selected]
  return <section ref={root} id="honors" className={`honors-journey ${active?'honors-active':''} ${reading?'honors-reading':''} ${staticMode?'honors-still':''}`} aria-label="The laurel grove — honors and achievements" aria-hidden={!reading}>
    <div className="honors-departure" ref={stage} style={{position:'absolute',inset:0}}>
    <div className="grove-world" aria-hidden="true"><div className="grove-backdrop"/><div className="grove-sunlight"/><div className="grove-shade"/><img className="grove-near-leaves" src="/art/laurel-branch-v4.webp" alt=""/><div className="grove-dust">{Array.from({length:16},(_,i)=><i key={i} style={{left:`${(i*17+13)%100}%`,top:`${(i*23+19)%100}%`}}/>)}</div></div>
    <div className="grove-content" inert={!reading}>
      <header className="grove-header"><span>THE LAUREL GROVE <i> / </i> HONORS & ACHIEVEMENTS</span><button onClick={()=>staticMode?document.getElementById('projects')?.scrollIntoView():onTravel(1.41)}>↙ Back to the journal</button></header>
      <div className="grove-introduction"><span className="grove-eyebrow">CURIOSITY TAKES FLIGHT</span><h2>A little courage.<br/><em>A wider world.</em></h2><p>Some moments I carry with me.</p></div>
      <div className="grove-mobile" onPointerMove={e=>{if(staticMode)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--look',`${((e.clientX-r.left)/r.width-.5)*5}deg`)}} onPointerLeave={e=>e.currentTarget.style.setProperty('--look','0deg')}>
        <img className="grove-branch" src="/art/laurel-branch-v4.webp" alt=""/>
        <nav className="grove-keepsakes" aria-label="Choose an achievement">{honors.map((h,i)=><button ref={el=>{ornaments.current[i]=el}} key={h.short} className={`grove-keepsake keepsake-${i}`} aria-pressed={selected===i} aria-label={`${h.short}: ${h.distinction}`} onClick={()=>setSelected(i)}>{i===0?<><img className="medal-ribbon-only" src="/art/honor-ribbon-v4.svg" alt=""/><img className="medal-face-only" src="/art/honor-ribbon-v4.svg" alt=""/></>:<img src="/art/honor-ribbon-v4.svg" alt=""/>}<span className="keepsake-light" aria-hidden="true"/><span className="keepsake-symbol" aria-hidden="true">{h.symbol}</span><span className="keepsake-label">{h.short}<small>{i===selected?'EXPLORING':'EXPLORE ↗'}</small></span></button>)}</nav>
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

