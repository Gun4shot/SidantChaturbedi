import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { publicationMotion, LIBRARY_START, LIBRARY_END } from './publication-motion'
import { usePaperReplay } from './usePaperReplay'
import { publications } from './publications'
import CourtyardJourney, { type CourtyardHandle } from './CourtyardJourney'
import { courtyardMotion, COURTYARD_START, COURTYARD_END, COURTYARD_READING } from './courtyard-motion'
import { profile } from './profile'
import research from './research-source.json'
import './library-journey.css'

export type LibraryHandle={update(p:number,time:number):void}
const LibraryJourney=forwardRef<LibraryHandle,{staticMode:boolean;onTravel(p:number):void}>(function LibraryJourney({staticMode,onTravel},ref){
  const courtyard=useRef<CourtyardHandle>(null)
  const root=useRef<HTMLElement>(null),leaf=useRef<HTMLImageElement>(null)
  const [reading,setReading]=useState(staticMode),[prepared,setPrepared]=useState(staticMode),[inCourtyard,setInCourtyard]=useState(false)
  const {sheet,selected,select,reset,phase}=usePaperReplay(staticMode)
  useEffect(()=>{if(staticMode){setReading(true);setPrepared(true);setInCourtyard(false)}},[staticMode])
  useImperativeHandle(ref,()=>({update(p,_time){
    if(staticMode||!root.current)return
    if(p>1.85)setPrepared(true)
    const m=publicationMotion(p,innerWidth,innerHeight),c=courtyardMotion(p,innerWidth,innerHeight),s=root.current.style
    courtyard.current?.update(p,_time)
    if((m.paperOpen<1||p>COURTYARD_START)&&phase.current!=='idle')reset()
    root.current.style.visibility=p>LIBRARY_START?'visible':'hidden'
    const canRead=p>=LIBRARY_END-.025&&p<=COURTYARD_START
    setReading(old=>old===canRead?old:canRead)
    setInCourtyard(old=>old===(p>=COURTYARD_END-.012)?old:p>=COURTYARD_END-.012)
    s.setProperty('--library-blend',String(m.blend));s.setProperty('--library-ui',String(m.ui*c.libraryUi))
    s.setProperty('--paper-open',String(m.paperOpen*c.paperOpen))
    s.setProperty('--paper-curl',String(Math.min(1,(1-m.paperOpen*c.paperOpen)*12)))
    s.setProperty('--library-x',`${m.backdropX}px`)
    s.setProperty('--library-y',`${m.backdropY}px`);s.setProperty('--library-scale',String(m.backdropScale))
    s.setProperty('--library-shade',String(1-c.arrival*.6))
    if(leaf.current)leaf.current.style.transform=`translate3d(${m.leafX}px,${m.leafY}px,0) translate(-50%,-50%) scale(${m.leafSize/768})`
  }}))
  const record=publications[selected]
  return <><section ref={root} id="library" className={`library-journey ${staticMode?'library-still':''}`} aria-label="The reading room — research and resources" aria-hidden={!reading&&!inCourtyard}>
    {prepared&&<>
      <div className="library-world">{staticMode?<div className="library-backdrop" aria-hidden="true"/>:<CourtyardJourney ref={courtyard} staticMode={false} onTravel={onTravel}/>}<div className="library-shade" aria-hidden="true"/></div>
      {!staticMode&&<img ref={leaf} className="library-passage-leaf" src="/art/laurel-passage-v4.webp" alt="" aria-hidden="true"/>}
    </>}
    <div className="library-reading" inert={!reading}>
      <header className="library-header"><span>THE READING ROOM <i>/</i> RESEARCH & RESOURCES</span><button onClick={()=>staticMode?document.getElementById('honors')?.scrollIntoView():onTravel(2.03)}>↖ Back to the grove</button></header>
      <nav className="library-shelf" aria-label="Choose a research record"><span className="shelf-label">RESEARCH INDEX</span>{publications.map((item,i)=><button key={item.id} aria-label={`0${i+1} ${item.short} — ${item.status}`} aria-pressed={selected===i} onClick={()=>select(i)}><span>0{i+1}</span><strong>{item.short}</strong><small>{item.status}</small></button>)}</nav>
      <div ref={sheet} className="research-scroll">
      <article className="library-paper" aria-live="polite" key={record.id} tabIndex={reading?0:-1} aria-label={`${record.short} — scroll to read`}>
        <div className="library-paper-top"><span>{record.category}</span><span>{record.status}</span></div>
        <h3>{record.title}</h3>
        <p className="library-venue">{record.venue}</p><p className="library-authors">{record.authors}</p>
        <div className="library-paper-links">{record.links.length?record.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>):<span>{record.id==='graphs'?'Manuscript not publicly available yet.':'Updates will follow as the work develops.'}</span>}</div>
        <div className="paper-rule"/>
        <div className="paper-abstract"><div><h4>{record.id==='sentinel'?'Abstract':'Research overview'}</h4><p>{record.id==='sentinel'?research.abstract:record.summary}</p></div>
        {record.figure&&<figure className="library-figure"><a href={record.figure} target="_blank" rel="noreferrer" aria-label="Open Sindhuli research figure at full resolution"><img src={record.figure} alt={record.figureAlt}/></a><figcaption>{record.figureCaption}</figcaption></figure>}</div>
        <div className="library-tags"><b>Keywords</b>{record.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
        <h4>Methodology & contribution</h4><p className="paper-methods">{record.detail}</p>
        {record.id==='sentinel'&&<div className="methodology-figures">{research.figures.map(figure=><figure key={figure.src}><a href={figure.src} target="_blank" rel="noreferrer" aria-label={`Open ${figure.caption} at full resolution`}><img src={figure.src} alt={figure.caption} width={figure.width} height={figure.height} loading="lazy"/></a><figcaption>{figure.caption}</figcaption></figure>)}</div>}
        <div className="paper-colophon"><span>SIDANT CHATURBEDI / RESEARCH NOTES</span><span>0{selected+1}</span></div>
      </article>
      <div className="paper-curl" aria-hidden="true"/>
      </div>
      <footer className="library-footer"><a href="https://github.com/Gun4shot/ML_notebooks" target="_blank" rel="noreferrer">Explore my ML notebooks ↗</a><a href={`mailto:${profile.email}`}>Let’s talk research ↗</a><button className="courtyard-continue" onClick={()=>staticMode?document.getElementById('community')?.scrollIntoView():onTravel(COURTYARD_READING)}>Into the courtyard ↗</button></footer>
    </div>
  </section>{staticMode&&<CourtyardJourney staticMode onTravel={onTravel}/>}</>
})
export default LibraryJourney
