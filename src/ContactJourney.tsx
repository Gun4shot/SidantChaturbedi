import {forwardRef,useImperativeHandle,useRef,useState} from 'react'
import {profile} from './profile'
import {contactCorners,contactLayout,contactMotion,journeyCamera,CONTACT_END,CONTACT_START} from './contact-motion'
import {planeProjection} from './courtyard-motion'
import './contact-journey.css'

export type ContactHandle={update(p:number):void}
const ContactJourney=forwardRef<ContactHandle,{staticMode:boolean;onTravel(p:number):void}>(function ContactJourney({staticMode,onTravel},ref){
 const root=useRef<HTMLElement>(null),parcel=useRef<HTMLDivElement>(null)
 const [reading,setReading]=useState(staticMode),[copyState,setCopyState]=useState('Copy address')
 useImperativeHandle(ref,()=>({update(p){
  if(staticMode||!root.current||!parcel.current)return
  const m=contactMotion(p),layout=contactLayout(innerWidth,innerHeight),el=parcel.current
  const active=p>=CONTACT_END-.008
  setReading(old=>old===active?old:active)
  root.current.style.visibility=p>=CONTACT_START?'visible':'hidden'
  root.current.style.setProperty('--contact-ink',String(m.ink))
  root.current.style.setProperty('--letter-rise',String(m.letter))
  root.current.style.setProperty('--lid-angle',`${70+95*m.lid}deg`)
  el.style.left=`${layout.left}px`;el.style.top=`${layout.top}px`
  el.style.width=`${layout.width}px`;el.style.height=`${layout.height}px`
  el.style.transform=planeProjection(contactCorners(innerWidth,innerHeight,layout),journeyCamera(p),innerWidth,innerHeight,layout)
 }}),[staticMode])
 const copy=async()=>{
  try{await navigator.clipboard.writeText(profile.email);setCopyState('Address copied ✓')}
  catch{setCopyState('Select the address to copy')}
 }
 const back=()=>staticMode?document.getElementById('community')?.scrollIntoView({behavior:'instant'}):onTravel(3.53)
 return <section ref={root} id="contact" className={`contact-journey ${staticMode?'contact-still':''}`} aria-label="The letter veranda — contact Sidant" aria-hidden={!reading} inert={!reading}>
  <header className="contact-header"><span>THE LETTER VERANDA <i>/</i> A NEW CONVERSATION</span><button onClick={back}>↖ Back to the courtyard</button></header>
  <div className="contact-caption" aria-hidden="true"><span>THE JOURNEY ENDS HERE.</span><p>The conversation<br/>can begin.</p><svg viewBox="0 0 110 65" fill="none"><path d="M5 12C25 54 64 58 96 29m-18 1 20-5-4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div>
  <div ref={parcel} className="contact-parcel">
   <div className="mail-lid" aria-hidden="true"/>
   <div className="contact-letter-window"><article className="contact-letter">
    <div className="letter-topline"><span>FROM NEPAL, WITH CURIOSITY</span><span className="letter-stamp" aria-hidden="true">✳<small>HELLO</small></span></div>
    <h2>Every good idea<br/>starts with <em>a hello.</em></h2>
    <p className="letter-invitation">Have a project, a research question, or something worth exploring? Let’s talk.</p>
    <a className="contact-email" href={`mailto:${profile.email}`}><span>WRITE TO ME</span><strong>{profile.email}</strong><b aria-hidden="true">↗</b></a>
    <div className="letter-links"><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><button onClick={copy}>Copy email</button></div>
    <span className="copy-feedback" role="status" aria-live="polite">{copyState==='Copy address'?'':copyState}</span>
    <div className="letter-signature">Sidant<span>RESEARCHER · BUILDER · ALWAYS CURIOUS</span></div>
   </article></div>
   <div className="mail-body" aria-hidden="true"/>
   <span className="mail-plaque" aria-hidden="true">LETTERS & NEW BEGINNINGS</span>
  </div>
  <footer className="contact-footer"><span>A LITTLE WORLD, BUILT BY SIDANT.</span><button onClick={()=>onTravel(0)}>Back to the sky ↑</button></footer>
 </section>
})
export default ContactJourney
