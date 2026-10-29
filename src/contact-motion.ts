import { clamp, smooth } from './book-motion.ts'
import { FINAL_CAMERA, OUT, RIGHT, ROOM, viewportLens, courtyardCamera, COURTYARD_START, COURTYARD_END, type CameraPose, type BoardBounds } from './courtyard-motion.ts'

export const CONTACT_START=3.62,CONTACT_END=4.24,CONTACT_READING=4.29
export const CONTACT_YAW=FINAL_CAMERA.yaw+65*Math.PI/180
export const CONTACT_OUT={x:Math.sin(CONTACT_YAW),z:-Math.cos(CONTACT_YAW)}
export const CONTACT_RIGHT={x:Math.cos(CONTACT_YAW),z:Math.sin(CONTACT_YAW)}
export const CONTACT_FINAL={x:FINAL_CAMERA.x+RIGHT.x*5.2+OUT.x*1.5,y:ROOM.eye,z:FINAL_CAMERA.z+RIGHT.z*5.2+OUT.z*1.5,yaw:CONTACT_YAW}
export function contactCamera(t:number):CameraPose {
 const u=smooth(0,1,clamp(t)),v=1-u
 const side=3*v*v*u*1.6+3*v*u*u*4.4+u*u*u*5.2
 const forward=3*v*v*u*(-.15)+3*v*u*u*.3+u*u*u*1.5
 return {x:FINAL_CAMERA.x+RIGHT.x*side+OUT.x*forward,y:ROOM.eye,z:FINAL_CAMERA.z+RIGHT.z*side+OUT.z*forward,yaw:FINAL_CAMERA.yaw+(CONTACT_YAW-FINAL_CAMERA.yaw)*smooth(.02,.92,t)}
}
export function journeyCamera(p:number){
 return p<=CONTACT_START?courtyardCamera(clamp((p-COURTYARD_START)/(COURTYARD_END-COURTYARD_START))):contactCamera((p-CONTACT_START)/(CONTACT_END-CONTACT_START))
}
export function contactMotion(p:number){
 const t=clamp((p-CONTACT_START)/(CONTACT_END-CONTACT_START))
 return {t,leave:smooth(0,.18,t),lid:smooth(.48,.78,t),letter:smooth(.64,.94,t),ink:smooth(.84,.99,t)}
}
export function contactLayout(w:number,h:number):BoardBounds {
 const mobile=w<700,width=mobile?w*.9:Math.min(590,w*.48)
 const height=mobile?Math.min(680,h*.8):Math.min(650,h*.80)
 return {width,height,left:mobile?(w-width)/2:w*.61-width/2,top:(h-height)/2-8}
}
export function contactCorners(w:number,h:number,bounds:BoardBounds){
 const lens=viewportLens(w,h),unit=6/lens.focal
 return [[0,0],[bounds.width,0],[bounds.width,bounds.height],[0,bounds.height]].map(([x,y])=>({
  x:CONTACT_FINAL.x+CONTACT_OUT.x*6+CONTACT_RIGHT.x*(bounds.left+x-lens.cx)*unit,
  y:ROOM.eye+(lens.cy-bounds.top-y)*unit,
  z:CONTACT_FINAL.z+CONTACT_OUT.z*6+CONTACT_RIGHT.z*(bounds.left+x-lens.cx)*unit,
 }))
}
