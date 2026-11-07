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
 return <section ref={root} className={`ending-journey ${staticMode?'ending-still':''}`} aria-label="Thank you for visiting" aria-hidden={!reading}>
  {!staticMode&&<div className="ending-clouds" aria-hidden="true"><img src="/art/cloud.png" alt=""/><img src="/art/cloud.png" alt=""/><img src="/art/cloud.png" alt=""/></div>}
  <div className="ending-copy" inert={!reading}>

   <h2>Thank you<br/>for <em>visiting.</em></h2>
   <p>Sidant Chaturbedi</p>
   <span className="ending-flourish" aria-hidden="true">✧</span>
   <button onClick={onRestart}>Restart the portfolio <span aria-hidden="true">↻</span></button>
   {!staticMode&&<small>Or scroll once to return to the beginning.</small>}
  </div>
 </section>
})
export default EndingJourney
