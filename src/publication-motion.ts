import { clamp, smooth } from './book-motion.ts'
import { fitCutout } from './cutout-framing.ts'

export const LIBRARY_START = 2.035, LIBRARY_END = 2.64

// The leaf keeps moving while the scenery changes behind its opaque centre.
// Scroll alone controls the shot, including the exact reverse journey.
export function publicationMotion(p:number,w:number,h:number) {
  const t=clamp((p-LIBRARY_START)/(LIBRARY_END-LIBRARY_START))
  const approach=smooth(0,.44,t),exit=smooth(.56,.91,t)
  const fit=fitCutout('leaf',w,h)
  const leafSize=w*.3+(fit.size*1.025-w*.3)*approach
  const centerX=w*(1.2-.7*approach+.12*(.49-t)*approach)-(w*.60+leafSize*.60)*exit
  const centerY=h*(-.15+.65*approach+.34*exit)
  return {
    t,release:smooth(0,.24,t),
    leafX:centerX+(.5-fit.originX)*leafSize,
    leafY:centerY+(.5-fit.originY)*leafSize*941/1672,
    leafSize,
    blend:smooth(.44,.54,t),
    ui:smooth(.74,.89,t),paperOpen:smooth(.77,1,t),
    groveX:-w*.075*smooth(0,.6,t),groveY:h*.055*smooth(0,.6,t),
    groveScale:1+.16*smooth(0,.6,t),
    backdropX:w*.055*(1-smooth(.48,.96,t)),
    backdropY:-h*.025*(1-smooth(.48,.96,t)),
    backdropScale:1+.07*(1-smooth(.48,.96,t)),
  }
}
