import { useEffect, useRef, useState } from 'react'

/** Change the content only when the rolled sheet has completely concealed it. */
export function usePaperReplay(staticMode:boolean) {
  const sheet=useRef<HTMLDivElement>(null)
  const [selected,setSelected]=useState(0)
  const current=useRef(0),pending=useRef(0),frame=useRef(0),open=useRef(1)
  const phase=useRef<'idle'|'closing'|'opening'>('idle')
  function paint(value:number) {
    open.current=value
    sheet.current?.style.setProperty('--paper-open',String(value))
    sheet.current?.style.setProperty('--paper-curl',String(Math.min(1,(1-value)*12)))
  }
  function reset() {
    cancelAnimationFrame(frame.current)
    phase.current='idle';open.current=1
    sheet.current?.style.removeProperty('--paper-open')
    sheet.current?.style.removeProperty('--paper-curl')
  }
  function animate(from:number,to:number,duration:number,done:()=>void) {
    const start=performance.now()
    function tick(now:number) {
      const t=Math.min(1,(now-start)/duration)
      paint(from+(to-from)*(t*t*(3-2*t)))
      if(t<1)frame.current=requestAnimationFrame(tick)
      else done()
    }
    frame.current=requestAnimationFrame(tick)
  }
  function select(index:number) {
    if(staticMode||matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reset();current.current=index;setSelected(index);return
    }
    if(phase.current==='idle'&&index===current.current)return
    pending.current=index
    if(phase.current==='closing')return
    cancelAnimationFrame(frame.current)
    phase.current='closing'
    animate(open.current,0,Math.max(80,260*open.current),()=>{
      current.current=pending.current
      setSelected(current.current)
      phase.current='opening'
      // Let React commit the new article while the sheet is fully closed.
      frame.current=requestAnimationFrame(()=>{
        frame.current=requestAnimationFrame(()=>animate(0,1,680,reset))
      })
    })
  }
  useEffect(()=>()=>cancelAnimationFrame(frame.current),[])
  return {sheet,selected,select,reset,phase}
}
