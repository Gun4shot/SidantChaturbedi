import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { courtyardMotion, boardProjection, COURTYARD_END } from './courtyard-motion'
import { community } from './community'
import type { CourtyardProjection } from './courtyard-projection'
import ContactJourney, { type ContactHandle } from './ContactJourney'
import { contactMotion, journeyCamera, CONTACT_START, CONTACT_READING } from './contact-motion'
import {usePaperReplay} from './usePaperReplay'
import {advanceContactReveal} from './contact-reveal'
import {CommunityIllustration} from './CommunityIllustration'
import './courtyard-journey.css'
import './community-folio.css'

export type CourtyardHandle={update(p:number,time:number):void}
export const courtyardAssets=['/art/letterbox-atlas-v1.webp']

const CourtyardJourney=forwardRef<CourtyardHandle,{staticMode:boolean;onTravel(p:number):void}>(function CourtyardJourney({staticMode,onTravel},ref){
  const root=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null),board=useRef<HTMLDivElement>(null)
  const projection=useRef<CourtyardProjection|null>(null)
  const contact=useRef<ContactHandle>(null)
  const bounds=useRef({left:0,top:0,width:0,height:0}),size=useRef('')
  const {sheet,selected,select}=usePaperReplay(staticMode,true)
  const [reading,setReading]=useState(staticMode)
  const reveal=useRef(0),lastTime=useRef<number|null>(null)
  const [ready,setReady]=useState(false)
  useEffect(()=>{
    if(staticMode){setReady(true);return}
    let alive=true,active:CourtyardProjection|undefined
    const target=stage.current
    if(target)import('./courtyard-projection').then(({createCourtyardProjection})=>createCourtyardProjection(target)).then(scene=>{
      if(!alive){scene.dispose();return}
      active=scene;projection.current=scene;setReady(true)
    }).catch(error=>console.error('Courtyard projection unavailable:',error))
    return()=>{alive=false;projection.current=null;active?.dispose()}
  },[staticMode])
  useImperativeHandle(ref,()=>({update(p,time){
    if(staticMode||!root.current)return
    const pose=courtyardMotion(p,innerWidth,innerHeight),s=root.current.style,exit=contactMotion(p)
    s.setProperty('--garden-view',String(pose.t*pose.t*(3-2*pose.t)))
    s.setProperty('--veranda-view',String(exit.t))
    const now=performance.now()/1000
    const dt=lastTime.current===null?0:now-lastTime.current
    lastTime.current=now
    reveal.current=advanceContactReveal(reveal.current,pose.arrival,dt)
    s.setProperty('--community-reveal',String(reveal.current))
    const canRead=p>=COURTYARD_END-.012&&p<=CONTACT_START&&reveal.current>.995
    setReading(old=>old===canRead?old:canRead)
    s.setProperty('--court-ui',String(pose.ui*(1-exit.leave)))
    s.setProperty('--court-arrival',String(pose.arrival))
    const key=`${innerWidth}/${innerHeight}`
    if(board.current&&size.current!==key){
      const el=board.current
      bounds.current={left:el.offsetLeft,top:el.offsetTop,width:el.offsetWidth,height:el.offsetHeight}
      size.current=key
    }
    projection.current?.update(p,innerWidth,innerHeight,bounds.current)
    if(board.current)board.current.style.transform=boardProjection(p,innerWidth,innerHeight,bounds.current,journeyCamera(p))
    contact.current?.update(p,time)
    s.setProperty('--canopy-sway',`${Math.sin(time*.4)*.4}deg`)
  }}),[staticMode])
  const item=community[selected]
  return <><div ref={root} className={`courtyard-journey ${staticMode?'courtyard-still':''} ${ready?'courtyard-ready':''}`}>
    {staticMode?<div className="courtyard-exterior" aria-hidden="true"/>:<div className="courtyard-projection" ref={stage} aria-hidden="true"/>}
    {staticMode&&<img className="courtyard-canopy" src="/art/laurel-branch-v2.png" alt="" aria-hidden="true"/>}
    <section id="community" className="courtyard-content" aria-label="Leadership and community — the learning courtyard" aria-hidden={!reading} inert={!reading}>
      <header className="courtyard-header"><span>THE LEARNING COURTYARD <i>/</i> LEADERSHIP & COMMUNITY</span><button onClick={()=>staticMode?document.getElementById('library')?.scrollIntoView():onTravel(2.68)}>↖ Back to the library</button></header>
      <div ref={board} className="courtyard-board" data-story={item.id}>
        <div className="community-folio" ref={sheet}>
          <div className="folio-binding" aria-hidden="true"/>
          <div className="folio-illustration">
            <span className="folio-issue">COMMUNITY FIELD GUIDE</span>
            <h2>Teaching &amp; <em>leadership.</em></h2>
            <CommunityIllustration index={selected}/>
            <span className="folio-caption">Four roles in education</span>
          </div>
          <article id="community-story" className="chalk-story" aria-live="polite" aria-atomic="true"><span className="chalk-eyebrow">{item.label}</span><h3>{item.role}</h3><p>{item.text}</p><div className="chalk-note">{item.note}</div>{item.link&&<a href={item.link} target="_blank" rel="noreferrer">{item.linkLabel} ↗</a>}<span className="folio-flourish" aria-hidden="true">✧</span></article>
        </div>
        <nav className="chalk-tabs" aria-label="Choose a leadership or teaching story">{community.map((story,i)=><button key={story.id} aria-label={story.tab} aria-pressed={i===selected} aria-controls="community-story" onClick={()=>select(i)}><span className="tab-symbol" aria-hidden="true">{['✳','⌘','✧','❋'][i]}</span><span><small>0{i+1}</small>{story.tab}</span></button>)}</nav>
      </div>
      <footer className="courtyard-footer"><button onClick={()=>staticMode?document.getElementById('contact')?.scrollIntoView({behavior:'instant'}):onTravel(CONTACT_READING)}>Contact me ↗</button><button onClick={()=>onTravel(0)}>Back to the sky ↑</button></footer>
    </section>
    {!staticMode&&<ContactJourney ref={contact} staticMode={false} onTravel={onTravel}/>}
  </div>{staticMode&&<ContactJourney staticMode onTravel={onTravel}/>}</>
})
export default CourtyardJourney
