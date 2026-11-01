import {smooth} from './book-motion.ts'
export const ENDING_START=4.42,ENDING_SKY=4.74,ENDING_READING=5.04,LOOP_END=5.55
export function endingMotion(p:number){
 const cloud=smooth(ENDING_START,4.69,p)*(1-smooth(4.79,4.98,p))
 const hello=smooth(5.18,5.43,p)
 return {cloud,sky:p>=ENDING_SKY,hello,thanks:smooth(4.88,5.00,p)*(1-smooth(5.15,5.34,p)),active:p>=ENDING_START,reading:p>=4.98&&p<5.30}
}
export function canWrapJourney(progress:number,target:number){return target>=LOOP_END-.00001&&progress>=LOOP_END-.0001}
export function endingCameraProgress(p:number){return p>=ENDING_START?0:p}
