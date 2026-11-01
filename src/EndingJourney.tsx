import {forwardRef,useImperativeHandle,useRef,useState} from 'react'
import {endingMotion,ENDING_START} from './ending-motion'
import './ending-journey.css'
export type EndingHandle={update(p:number):void}
const EndingJourney=forwardRef<EndingHandle,{staticMode:boolean;onRestart():void}>(function EndingJourney({staticMode,onRestart},ref){
 const root=useRef<HTMLElement>(null)
 const [reading,setReading]=useState(staticMode)
 useImperativeHandle(ref,()=>({update(p){
  if(staticMode||!root.current)return
  const m=endingMotion(p)
  root.current.style.visibility=p>=ENDING_START?'visible':'hidden'
  root.current.style.setProperty('--ending-cloud',String(m.cloud))
  root.current.style.setProperty('--ending-thanks',String(m.thanks))
  root.current.style.setProperty('--ending-drift',`${(1-m.thanks)*24}px`)
  setReading(old=>old===m.reading?old:m.reading)
 }}),[staticMode])
 return <section ref={root} className={`ending-journey ${staticMode?'ending-still':''}`} aria-label="Thank you for wandering" aria-hidden={!reading}>
  {!staticMode&&<div className="ending-clouds" aria-hidden="true"><img src="/art/cloud.png" alt=""/><img src="/art/cloud.png" alt=""/><img src="/art/cloud.png" alt=""/></div>}
  <div className="ending-copy" inert={!reading}>
   <span className="eyebrow">EVERY ENDING HOLDS A BEGINNING</span>
   <h2>Thank you<br/>for <em>wandering.</em></h2>
   <p>For your time. Your curiosity.<br/>For being part of this little world.</p>
   <span className="ending-flourish" aria-hidden="true">✧</span>
   <button onClick={onRestart}>Wander again <span aria-hidden="true">↻</span></button>
   {!staticMode&&<small>OR KEEP SCROLLING. THE SKY IS WHERE WE BEGIN.</small>}
  </div>
 </section>
})
export default EndingJourney
