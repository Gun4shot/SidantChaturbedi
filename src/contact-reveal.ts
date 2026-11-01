import {clamp,smooth} from './book-motion.ts'

/** A bounded reveal clock prevents fast scroll jumps skipping the entrance. */
export function advanceContactReveal(value:number,target:number,dt:number){
 const step=Math.max(0,Math.min(dt,.05))/1.65
 return value+Math.max(-step,Math.min(step,target-value))
}
export function contactRevealTarget(t:number){return smooth(.42,.99,t)}
export function contactObjectPose(reveal:number,index:number){
 const u=clamp((reveal-.08-index*.13)/.57)
 const settle=1-Math.pow(1-u,3)
 const swing=Math.sin(u*Math.PI*3)*Math.pow(1-u,2)
 return {opacity:smooth(0,.13,u),y:-260*(1-settle),z:140*(1-settle),rx:-65*(1-settle),ry:(index%2?-1:1)*(100*(1-settle)+32*swing),rz:24*swing}
}
export function contactNoteReveal(reveal:number){return smooth(.64,1,reveal)}
