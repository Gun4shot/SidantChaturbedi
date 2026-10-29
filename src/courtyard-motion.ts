import { clamp, smooth } from './book-motion.ts'

export const COURTYARD_START=2.80, COURTYARD_END=3.48, COURTYARD_READING=3.53
export const ARCH={width:1536,height:1024,cx:1182,cy:540,left:1135,right:1225,top:430,bottom:650}
// Approximate single-view calibration. Dimensions are world units, not CSS pixels.
// The optical centre is shifted vertically to preserve the painting's horizon.
export const LENS={focal:1100,cx:768,cy:610,width:1536,height:1024,near:.04,far:2400}
const back=1.6*LENS.focal/(680-LENS.cy)
export const ROOM={eye:1.6,back,left:(440-LENS.cx)*back/LENS.focal,right:(1025-LENS.cx)*back/LENS.focal,ceiling:1.6+(LENS.cy-140)*back/LENS.focal}
// The doorway is a recessed, diagonal bay, not the room's perpendicular side wall.
// Its normal is chosen to preserve a plausible width/height after rectification.
export const DOOR={x:ROOM.right,z:-ROOM.right*LENS.focal/(ARCH.cx-LENS.cx),yaw:40*Math.PI/180}
export const OUT={x:Math.sin(DOOR.yaw),z:-Math.cos(DOOR.yaw)}
export const RIGHT={x:Math.cos(DOOR.yaw),z:Math.sin(DOOR.yaw)}
export const FINAL_CAMERA={x:DOOR.x+OUT.x*4,y:ROOM.eye,z:DOOR.z+OUT.z*4,yaw:DOOR.yaw}
export function facadePoint(u:number){
  const ray=(u-LENS.cx)/LENS.focal
  const depth=(OUT.x*DOOR.x+OUT.z*DOOR.z)/(OUT.x*ray-OUT.z)
  return {x:ray*depth,z:-depth}
}
export type CameraPose={x:number;y:number;z:number;yaw:number}
export type Point3={x:number;y:number;z:number}
export type BoardBounds={left:number;top:number;width:number;height:number}

export function viewportLens(w:number,h:number){
  const crop=Math.max(w*1.08/LENS.width,h*1.08/LENS.height)
  return {focal:LENS.focal*crop,cx:w/2,cy:h/2+(LENS.cy-LENS.height/2)*crop,crop}
}

export function courtyardCamera(t:number):CameraPose {
  // One fixed-height dolly curve approaches the recessed bay along its normal.
  const u=smooth(0,1,clamp(t)),v=1-u
  const c1={x:0,z:-6.5},c2={x:FINAL_CAMERA.x-OUT.x*7,z:FINAL_CAMERA.z-OUT.z*7}
  const x=3*v*v*u*c1.x+3*v*u*u*c2.x+u*u*u*FINAL_CAMERA.x
  const z=3*v*v*u*c1.z+3*v*u*u*c2.z+u*u*u*FINAL_CAMERA.z
  const dx=3*v*v*c1.x+6*v*u*(c2.x-c1.x)+3*u*u*(FINAL_CAMERA.x-c2.x)
  const dz=3*v*v*c1.z+6*v*u*(c2.z-c1.z)+3*u*u*(FINAL_CAMERA.z-c2.z)
  // Look through the bay before crossing it, like a camera operator anticipating
  // a turn. Finish the pan as the dolly reaches the threshold, not afterwards.
  const tangent=Math.atan2(dx,-dz),aim=smooth(.3,.7,clamp(t))
  return {x,y:ROOM.eye,z,yaw:tangent+(DOOR.yaw-tangent)*aim}
}

export function projectPoint(point:Point3,camera:CameraPose,w:number,h:number){
  const lens=viewportLens(w,h),dx=point.x-camera.x,dy=point.y-camera.y,dz=point.z-camera.z
  const c=Math.cos(camera.yaw),s=Math.sin(camera.yaw)
  const depth=dx*s-dz*c
  return {x:lens.cx+lens.focal*(dx*c+dz*s)/depth,y:lens.cy-lens.focal*dy/depth,depth}
}

// A DOM sheet is a world-space plane too. This is its exact CSS homography;
// its corners match the rendered scene's camera rather than a second scale curve.
export function boardCorners(w:number,h:number,bounds:BoardBounds){
  const lens=viewportLens(w,h),depth=6,unit=depth/lens.focal
  return [[bounds.left,bounds.top],[bounds.left+bounds.width,bounds.top],[bounds.left+bounds.width,bounds.top+bounds.height],[bounds.left,bounds.top+bounds.height]].map(([x,y])=>({x:FINAL_CAMERA.x+OUT.x*depth+RIGHT.x*(x-lens.cx)*unit,y:ROOM.eye+(lens.cy-y)*unit,z:FINAL_CAMERA.z+OUT.z*depth+RIGHT.z*(x-lens.cx)*unit}))
}
export function planeProjection(corners:Point3[],camera:CameraPose,w:number,h:number,bounds:BoardBounds){
  const lens=viewportLens(w,h),origin=corners[0]
  const horizontal={x:(corners[1].x-origin.x)/bounds.width,y:(corners[1].y-origin.y)/bounds.width,z:(corners[1].z-origin.z)/bounds.width}
  const vertical={x:(corners[3].x-origin.x)/bounds.height,y:(corners[3].y-origin.y)/bounds.height,z:(corners[3].z-origin.z)/bounds.height}
  const c=Math.cos(camera.yaw),s=Math.sin(camera.yaw),dx=origin.x-camera.x,dy=origin.y-camera.y,dz=origin.z-camera.z
  const q=dx*s-dz*c,r=dx*c+dz*s
  const g=horizontal.x*s-horizontal.z*c,j=vertical.x*s-vertical.z*c
  const a=lens.focal*(horizontal.x*c+horizontal.z*s)+(lens.cx-bounds.left)*g
  const b=-lens.focal*horizontal.y+(lens.cy-bounds.top)*g
  const d=lens.focal*(vertical.x*c+vertical.z*s)+(lens.cx-bounds.left)*j
  const e=-lens.focal*vertical.y+(lens.cy-bounds.top)*j
  const tx=lens.focal*r+lens.cx*q-bounds.left*q,ty=lens.cy*q-lens.focal*dy-bounds.top*q
  return `matrix3d(${a},${b},0,${g},${d},${e},0,${j},0,0,1,0,${tx},${ty},0,${q})`
}
export function boardProjection(p:number,w:number,h:number,bounds:BoardBounds,camera?:CameraPose){
  return planeProjection(boardCorners(w,h,bounds),camera??courtyardCamera(clamp((p-COURTYARD_START)/(COURTYARD_END-COURTYARD_START))),w,h,bounds)
}

export function courtyardMotion(p:number,_w:number,_h:number) {
  const t=clamp((p-COURTYARD_START)/(COURTYARD_END-COURTYARD_START))
  return {t,arrival:smooth(.72,1,t),ui:smooth(.86,.99,t),libraryUi:1-smooth(0,.25,t),paperOpen:1-smooth(0,.23,t)}
}
