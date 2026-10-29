import { clamp, smooth, readingLayout } from './book-motion.ts'

export const FLIGHT_START = 1.48, GROVE_SETTLED = 1.90
const mix = (a:number,b:number,t:number) => a+(b-a)*t
const bezier = (a:number,b:number,c:number,d:number,t:number) => {
  const s=1-t
  return s*s*s*a+3*s*s*t*b+3*s*t*t*c+t*t*t*d
}
// One C1-continuous flight: peel left from the page, bank, cross the lens,
// and depart right. The bird never holds at the lens between two zooms.
export function honorsFlight(p: number, width: number, height: number) {
  const layout=readingLayout(width,height), t=clamp((p-FLIGHT_START)/(GROVE_SETTLED-FLIGHT_START))
  const turn=.22, peak=.61
  const anchorX=layout.centerX-layout.width*.44, anchorY=layout.top+layout.height*.065
  const turnX=width*.08,turnY=height*.25,vx=width*.1,vy=height*.5
  const u=t<turn?t/turn:(t-turn)/(1-turn)
  const x=t<turn?bezier(anchorX,anchorX-width*.13,turnX-vx*turn/3,turnX,u)
    :bezier(turnX,turnX+vx*(1-turn)/3,width*.7533,width*1.2,u)
  const y=t<turn?bezier(anchorY,anchorY-height*.12,turnY-vy*turn/3,turnY,u)
    :bezier(turnY,turnY+vy*(1-turn)/3,height*.65,height*.16,u)
  // The scenery blends throughout the pass, without a covering paper overlay.
  const approach=smooth(0,peak,t),retreat=smooth(.40,1,t)
  const near=Math.exp(-Math.pow((t-peak)/.15,2))
  const restSize=Math.max(60,layout.height*.15),closeSize=width*2.05
  const size=Math.exp(mix(Math.log(mix(restSize,90,t)),Math.log(closeSize),near))
  const blend=smooth(.40,.82,t)
  const wing=Math.sin(t*Math.PI*12)*(1-near)*smooth(0,.07,t)
  return {
    lift:smooth(0,.25,t),approach,retreat,blend,x,y,size,
    // Keep the crane facing its travel direction.  The wing can flutter, but
    // the paper itself must not read as spinning as it passes the viewer.
    rotation:0,
    wing, craneOpacity:smooth(1.35,1.40,p),
    ui:smooth(GROVE_SETTLED-.09,GROVE_SETTLED,p),
    backgroundScale:mix(1.3,1,retreat),branchScale:mix(1.6,1,retreat),
  }
}

