import { journeyToScroll, scrollToJourney } from './scroll-timing.ts'

// Resting compositions only: never capture a bird pass, leaf pass or doorway.
export const SCENE_STOPS = [0, .26, .435, .59, .673, .755, .825, 1.20, 1.41, 2.03, 2.68, 3.53, 4.29]
export const SNAP_RADIUS = .055
export function nearbyScene(progress:number, released:number|null=null) {
  if(released!==null && Math.abs(progress-released)<SNAP_RADIUS*1.6)return null
  const nearest=SCENE_STOPS.reduce((a,b)=>Math.abs(b-progress)<Math.abs(a-progress)?b:a)
  return Math.abs(nearest-progress)<=SNAP_RADIUS ? nearest : null
}

export function installSceneSnap() {
  let timer=0,frame=0,snapping=false,held=false,released:number|null=null
  const position=()=>scrollToJourney(window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))
  const clear=()=>{window.clearTimeout(timer);cancelAnimationFrame(frame);snapping=false}
  const settle=()=>{
    if(held||document.hidden)return
    const p=position()
    if(released!==null&&Math.abs(p-released)>=SNAP_RADIUS*1.6)released=null
    const stop=nearbyScene(p,released)
    if(stop===null)return
    released=stop
    const from=window.scrollY,to=journeyToScroll(stop)*(document.documentElement.scrollHeight-innerHeight)
    if(Math.abs(to-from)<2)return
    snapping=true
    const start=performance.now(),duration=440+Math.min(220,Math.abs(to-from)*.35)
    const tick=(now:number)=>{
      const t=Math.min(1,(now-start)/duration),ease=t*t*t*(t*(t*6-15)+10)
      window.scrollTo({top:from+(to-from)*ease,behavior:'instant'})
      if(t<1)frame=requestAnimationFrame(tick)
      else{snapping=false;window.clearTimeout(timer)}
    }
    frame=requestAnimationFrame(tick)
  }
  const onScroll=()=>{if(snapping)return;window.clearTimeout(timer);timer=window.setTimeout(settle,180)}
  const interrupt=()=>{clear()}
  const down=()=>{held=true;clear()}
  const up=()=>{held=false;onScroll()}
  const key=(event:KeyboardEvent)=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))interrupt()}
  window.addEventListener('scroll',onScroll,{passive:true})
  window.addEventListener('wheel',interrupt,{passive:true})
  window.addEventListener('touchstart',down,{passive:true})
  window.addEventListener('touchend',up,{passive:true})
  window.addEventListener('touchcancel',up,{passive:true})
  window.addEventListener('pointerdown',down,{passive:true})
  window.addEventListener('pointerup',up,{passive:true})
  window.addEventListener('keydown',key)
  window.addEventListener('resize',clear)
  return ()=>{
    clear()
    window.removeEventListener('scroll',onScroll)
    window.removeEventListener('wheel',interrupt)
    window.removeEventListener('touchstart',down)
    window.removeEventListener('touchend',up)
    window.removeEventListener('touchcancel',up)
    window.removeEventListener('pointerdown',down)
    window.removeEventListener('pointerup',up)
    window.removeEventListener('keydown',key)
    window.removeEventListener('resize',clear)
  }
}
