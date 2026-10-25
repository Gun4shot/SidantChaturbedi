import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { publicationMotion, LIBRARY_START, LIBRARY_END, type MedalAnchor } from './publication-motion'
import { publications } from './publications'
import { profile } from './profile'
import './library-journey.css'

export type LibraryHandle={update(p:number,time:number,anchor:MedalAnchor):void}
const LibraryJourney=forwardRef<LibraryHandle,{staticMode:boolean;onTravel(p:number):void}>(function LibraryJourney({staticMode,onTravel},ref){
  const root=useRef<HTMLElement>(null),medal=useRef<HTMLDivElement>(null),shadow=useRef<HTMLDivElement>(null),blur=useRef<SVGFEGaussianBlurElement>(null)
  const [reading,setReading]=useState(staticMode),[prepared,setPrepared]=useState(staticMode),[selected,setSelected]=useState(0)
  useImperativeHandle(ref,()=>({update(p,_time,anchor){
    if(staticMode||!root.current)return
    if(p>1.85)setPrepared(true)
    const m=publicationMotion(p,innerWidth,innerHeight,anchor),s=root.current.style
    root.current.style.visibility=p>LIBRARY_START?'visible':'hidden'
    setReading(old=>old===(p>=LIBRARY_END-.025)?old:p>=LIBRARY_END-.025)
    s.setProperty('--library-blend',String(m.blend));s.setProperty('--library-ui',String(m.ui))
    s.setProperty('--library-y',`${m.backdropY}px`);s.setProperty('--library-scale',String(m.backdropScale))
    s.setProperty('--desk-scale',String(m.deskScale));s.setProperty('--desk-opacity',String(m.deskOpacity))
    s.setProperty('--fall-streaks',String(m.streaks));s.setProperty('--streak-offset',`${m.t*150}%`)
    blur.current?.setAttribute('stdDeviation',`0 ${m.blur}`)
    if(medal.current){medal.current.style.opacity=String(m.release);medal.current.style.width=`${m.size/.74}px`;medal.current.style.transform=`translate3d(${m.x}px,${m.y}px,0) translate(-50%,-55%) rotate(${m.spin}deg) scaleY(${m.scaleY})`}
    if(shadow.current){shadow.current.style.opacity=String(m.shadow*.5);shadow.current.style.transform=`translate(${m.x}px,${m.tableY}px) translate(-50%,-50%) scale(${m.size/100})`}
  }}),[staticMode])
  const record=publications[selected]
  return <section ref={root} id="library" className={`library-journey ${staticMode?'library-still':''}`} aria-label="The reading room — research and resources" aria-hidden={!reading}>
    <svg className="library-filter" aria-hidden="true"><defs><filter id="library-fall-blur" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur ref={blur} stdDeviation="0 0"/></filter></defs></svg>
    {prepared&&<>
      <div className="library-world" aria-hidden="true"><div className="library-backdrop"/><div className="library-shade"/></div>
      <div className="library-streaks" aria-hidden="true"/>
      <div ref={shadow} className="library-medal-shadow" aria-hidden="true"/>
      {!staticMode&&<div ref={medal} className="library-falling-medal" aria-hidden="true"><img src="/art/publications-medal-v1.png" alt=""/><span>III</span></div>}
      <div className="library-desk" aria-hidden="true"><img src="/art/publications-desk-v1.png" alt=""/></div>
    </>}
    <div className="library-reading" inert={!reading}>
      <header className="library-header"><span>THE READING ROOM <i>/</i> RESEARCH & RESOURCES</span><button onClick={()=>staticMode?document.getElementById('honors')?.scrollIntoView():onTravel(2.03)}>↖ Back to the grove</button></header>
      <div className="library-heading"><span className="library-eyebrow">A QUESTION BECOMES A PAGE</span><h2>Notes from<br/><em>a curious mind.</em></h2><p>Research, publications & open resources.</p></div>
      <nav className="library-shelf" aria-label="Choose a research record">{publications.map((item,i)=><button key={item.id} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span>0{i+1}</span><strong>{item.short}</strong><small>{item.status}</small></button>)}</nav>
      <article className="library-paper" aria-live="polite" key={record.id}>
        <div className="library-paper-top"><span>{record.category}</span><span>{record.status}</span></div>
        <h3>{record.title}</h3><p className="library-summary">{record.summary}</p>
        <p className="library-venue">{record.venue}</p><p className="library-authors">{record.authors}</p>
        {record.figure&&<figure className="library-figure"><img src={record.figure} alt={record.figureAlt}/><figcaption>{record.figureCaption}</figcaption></figure>}
        <div className="library-tags">{record.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
        <details><summary>Research notes</summary><p>{record.detail}</p></details>
        <div className="library-paper-links">{record.links.length?record.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>):<span>{record.id==='graphs'?'Manuscript not publicly available yet.':'Updates will follow as the work develops.'}</span>}</div>
      </article>
      <footer className="library-footer"><a href="https://github.com/Gun4shot/ML_notebooks" target="_blank" rel="noreferrer">Explore my ML notebooks ↗</a><a href={`mailto:${profile.email}`}>Let’s talk research ↗</a><button onClick={()=>onTravel(0)}>Back to the sky ↑</button></footer>
    </div>
  </section>
})
export default LibraryJourney
