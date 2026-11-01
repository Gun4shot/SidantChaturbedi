import {forwardRef,useImperativeHandle,useRef,useState} from 'react'
import {ENDING_START,ENDING_READING} from './ending-motion'
import {profile} from './profile'
import {contactCorners,contactLayout,contactMotion,journeyCamera,CONTACT_END,CONTACT_START} from './contact-motion'
import {planeProjection} from './courtyard-motion'
import {usePaperReplay} from './usePaperReplay'
import {advanceContactReveal,contactRevealTarget,contactObjectPose,contactNoteReveal} from './contact-reveal'
import './contact-journey.css'
import './contact-stationery.css'

type Channel='letter'|'github'|'linkedin'
function PlatformMark({kind}:{kind:Channel}){
 return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">{kind==='letter'?<><rect x="8" y="15" width="48" height="35" rx="3"/><path d="m9 17 23 19 23-19M9 48l16-17m30 17L39 31"/><path d="m43 7 2-4m8 9 5-2"/></>:kind==='github'?<><path fill="currentColor" stroke="none" d="M32 6a26 26 0 0 0-8 50c1 .2 2-.5 2-1v-5c-7 1-9-3-9-3-1-3-3-4-3-4-2-1 0-2 0-2 3 0 4 3 4 3 2 3 5 2 8 2 0-2 1-3 2-4-6-1-13-3-13-13 0-3 1-6 3-8-1-2-1-5 0-8 0 0 3-1 9 3a30 30 0 0 1 16 0c6-4 9-3 9-3 1 3 1 6 0 8 2 2 3 5 3 8 0 10-7 12-13 13 1 1 2 3 2 6v7c0 1 1 2 2 1A26 26 0 0 0 32 6Z"/></>:<><rect x="8" y="8" width="48" height="48" rx="3"/><path strokeWidth="5" d="M20 29v17m11 0V29m0 7c0-9 14-9 14 0v10"/><circle cx="20" cy="20" r="3" fill="currentColor" stroke="none"/></>}</svg>
}
const channels: {id:Channel;label:string}[]=[{id:'letter',label:'Email'},{id:'github',label:'GitHub'},{id:'linkedin',label:'LinkedIn'}]

export type ContactHandle={update(p:number,time:number):void}
const ContactJourney=forwardRef<ContactHandle,{staticMode:boolean;onTravel(p:number):void}>(function ContactJourney({staticMode,onTravel},ref){
 const root=useRef<HTMLElement>(null),parcel=useRef<HTMLDivElement>(null)
 const {sheet,selected,select}=usePaperReplay(staticMode,true)
 const channel=channels[selected].id
 const reveal=useRef(0),lastTime=useRef<number|null>(null)
 const objects=useRef<(HTMLSpanElement|null)[]>([])
 const [note,setNote]=useState(''),[subject,setSubject]=useState('Just saying hello'),[breeze,setBreeze]=useState(0)
 const mailHref=`mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(note)}`
 const [reading,setReading]=useState(staticMode),[copyState,setCopyState]=useState('Copy address')
 useImperativeHandle(ref,()=>({update(p,time){
  if(staticMode||!root.current||!parcel.current)return
  const m=contactMotion(p),layout=contactLayout(innerWidth,innerHeight),el=parcel.current
  const dt=lastTime.current===null?0:time-lastTime.current
  lastTime.current=time
  reveal.current=advanceContactReveal(reveal.current,contactRevealTarget(m.t),dt)
  const r=reveal.current
  root.current.style.setProperty('--entrance',String(r))
  root.current.style.setProperty('--note-reveal',String(contactNoteReveal(r)))
  root.current.style.setProperty('--branch-reveal',String(Math.min(1,r*5)))
  objects.current.forEach((object,i)=>{
   if(!object)return
   const pose=contactObjectPose(r,i)
   object.style.opacity=String(pose.opacity)
   object.style.transform=`translate3d(0,${pose.y}px,${pose.z}px) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg)`
  })
  const active=p>=CONTACT_END-.008&&p<=ENDING_START&&r>.995
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
  <header className="contact-header"><span>THE HELLO GARDEN <i>/</i> LEAVE A LITTLE POSSIBILITY</span><button onClick={back}>↖ Back to the courtyard</button></header>
  <div className="contact-caption"><span>THE END IS A BEGINNING</span><h2>Let’s make<br/>something<br/><em>good happen.</em></h2><p>A thought. A collaboration.<br/>A wonderfully unexpected hello.</p><button className="breeze-button" onClick={()=>setBreeze(v=>v+1)}>✧ Send a little breeze <span aria-hidden="true">↝</span></button><small>Go on. The paper likes to dance.</small></div>
  <div ref={parcel} className="contact-parcel" data-channel={channel}>
   <div className="hello-mobile">
    <div className="mobile-branch" aria-hidden="true"><img src="/art/laurel-branch-v4.webp" alt=""/></div>
    <div className="hanging-objects" role="group" aria-label="Choose a way to connect">
     {channels.map((item,i)=><button className={`hanging-object object-${item.id}`} key={item.id} aria-label={item.label} aria-pressed={channel===item.id} onClick={()=>select(i)} aria-controls="contact-postcard"><span className="object-arrival" ref={el=>{objects.current[i]=el}}><span className="object-thread" aria-hidden="true"/><span key={breeze} className={`object-art ${breeze?'caught-breeze':''}`}><span className="object-cover" aria-hidden="true"/><span className="object-number">0{i+1}</span><span className="object-icon"><PlatformMark kind={item.id}/></span>{item.id==='letter'?<><span className="envelope-fold"/><span className="wax-seal">s</span></>:item.id==='github'?<><span className="code-scribble">&lt;hello world /&gt;<br/>+ a little curiosity</span><span className="repo-dots">● ● ●</span></>:<><span className="ticket-name">Sidant<br/><em>Let’s cross paths.</em></span><span className="ticket-perforation"/></>}<span className="object-label">{item.label}<b aria-hidden="true">↗</b></span></span></span></button>)}
    </div>
    <p className="pick-caption">Three little doors. Pick yours. <span aria-hidden="true">⤴</span></p>
    <div className="flying-crane" key={`bird-${breeze}`} data-flying={breeze>0} aria-hidden="true"><img src="/art/paper-crane-v2.png" alt=""/></div>
    <button className="mobile-breeze" onClick={()=>setBreeze(v=>v+1)} aria-label="Send a little breeze">✧</button>
   </div>
   <div ref={sheet} className="contact-letter" id="contact-postcard" role="region" aria-label="Contact invitation">
    <div className="stationery-margin" aria-hidden="true"><span>LETTERS FROM THE GARDEN</span><svg viewBox="0 0 45 135" fill="none"><path d="M22 129C12 98 33 61 21 9M21 104C5 103 4 88 6 80c11 4 15 10 15 24ZM23 82c17-3 19-18 15-25-11 5-16 12-15 25ZM24 60C8 55 8 40 12 34c10 7 14 15 12 26ZM24 38c13-2 16-13 13-20-8 3-12 10-13 20Z" stroke="currentColor" strokeWidth="1.1"/><circle cx="20" cy="9" r="4" fill="currentColor"/></svg></div>
    <div className="stationery-corner" aria-hidden="true"/>
    <div className="note-content">
     <div className="note-topline"><span>{channel==='letter'?'01 / A NOTE BETWEEN US':channel==='github'?'02 / THE CURIOSITY WORKSHOP':'03 / A NEW CONNECTION'}</span><span className="stationery-postmark" aria-hidden="true">✳<small>WITH CURIOSITY</small></span></div>
     <h3>{channel==='letter'?'Dear Sidant…':channel==='github'?'A peek behind the pixels.':'Good people. New possibilities.'}</h3>
     {channel==='letter'?<><div className="conversation-starters" role="group" aria-label="Choose an email subject">{['Just saying hello','Let’s build something','A research idea'].map(text=><button key={text} aria-pressed={subject===text} onClick={()=>setSubject(text)}>{text}</button>)}</div><label className="note-input"><span>Your note <small>(optional)</small></span><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="I’ve been thinking about…" rows={2} maxLength={1500}/></label><a className="postcard-action" href={mailHref}>Fold it into an email <span aria-hidden="true">↗</span></a><span className="mail-hint">Opens your mail app. Nothing is sent here.</span></>:<><p className="destination-description">{channel==='github'?'Experiments, small obsessions, and ideas becoming real. Wander through my repositories and find something to build on.':'Interesting conversations have a way of becoming interesting projects. Let’s find out where our paths might meet.'}</p><div className="destination-keepsake" aria-hidden="true"><PlatformMark kind={channel}/><span>{channel==='github'?'gun4shot':'Sidant Chaturbedi'}<small>{channel==='github'?'CODE · EXPERIMENTS · POSSIBILITIES':'RESEARCH · TECHNOLOGY · PEOPLE'}</small></span></div><a className="postcard-action" href={channel==='github'?profile.github:profile.linkedin} target="_blank" rel="noreferrer">{channel==='github'?'Wander through GitHub':'Meet me on LinkedIn'} <span aria-hidden="true">↗</span></a></>}
    </div>
    <div className="contact-address"><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={copy} aria-label="Copy email" title="Copy email">{copyState.includes('copied')?'✓':'⧉'}</button></div>
    <div className="letter-links"><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><span>FROM NEPAL, WITH CURIOSITY</span></div>
    <span className="copy-feedback" role="status" aria-live="polite">{copyState==='Copy address'?'':copyState}</span>
   </div>
  </div>
  <footer className="contact-footer"><span>A LITTLE WORLD, BUILT BY SIDANT.</span><button onClick={()=>staticMode?document.querySelector('.ending-journey')?.scrollIntoView({behavior:'instant'}):onTravel(ENDING_READING)}>One last look at the sky ↗</button></footer>
 </section>
})
export default ContactJourney
