import { clamp, smooth } from './book-motion.ts'

export const LIBRARY_START = 2.14, LIBRARY_END = 2.64
export type MedalAnchor = { x:number; y:number; size:number }
const mix=(a:number,b:number,t:number)=>a+(b-a)*t
// A single reversible shot: release, tracked fall, rim contact, rebound, settle.
export function publicationMotion(p:number,w:number,h:number,anchor:MedalAnchor) {
  const t=clamp((p-LIBRARY_START)/(LIBRARY_END-LIBRARY_START))
  const release=smooth(0,.08,t),catchup=smooth(.04,.40,t)
  const landing=smooth(.59,.80,t),pullback=smooth(.86,1,t)
  const flightSize=Math.min(w*.32,310),finalSize=w<700?64:88
  const size=mix(mix(anchor.size,flightSize,catchup),finalSize,landing)
  const floor=h*.89
  const x=mix(mix(anchor.x,w*.53,catchup),w*.24,landing)
  const bounce=t>.80&&t<.91?Math.sin((t-.80)/.11*Math.PI)*h*.055:0
  const flatten=smooth(.87,.98,t)
  const scaleY=mix(1,.30,flatten)
  const y=mix(mix(anchor.y,h*.49,catchup),floor-size*(.36/.74)*scaleY,landing)-bounce
  const spin=360*smooth(.09,.76,t)+22*Math.sin(Math.PI*smooth(.80,.98,t))
  const speed=smooth(.15,.37,t)*(1-smooth(.60,.78,t))
  return {t,release,x,y,size,scaleY,spin,floor,bounce,
    blend:smooth(.34,.68,t),ui:smooth(.90,1,t),pullback,
    blur:26*speed,streaks:.34*speed,
    groveY:-h*.85*smooth(.08,.70,t),groveScale:1+.12*catchup,
    backdropY:h*.32*(1-smooth(.45,.82,t)),backdropScale:mix(1.20,1,pullback),
    deskScale:mix(1.5,1,pullback),deskOpacity:smooth(.82,.96,t),
    shadow:smooth(.67,.80,t)*(1-bounce/(h*.12)),
  }
}
