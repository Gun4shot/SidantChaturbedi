import { appleWorld, HIT, GROUND, ZOOM } from './journey-path.ts'
import { meadowHandoff } from './book-motion.ts'
export { HIT, GROUND, ZOOM }
export type ProjectedCutout = { x: number; y: number; size: number; visible: boolean }
export type CollageProjection = { apples: ProjectedCutout[]; apple: ProjectedCutout; stem: ProjectedCutout; head: ProjectedCutout; newton: ProjectedCutout; landing: { x: number; y: number } }
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t))
export const ease = (a: number, b: number, p: number) => { const t = clamp01((p - a) / (b - a)); return t * t * (3 - 2 * t) }
export function panelSlide(p: number, start: number, enter: number, leave: number, end: number) {
  return (1 - ease(start, enter, p)) * 120 - ease(leave, end, p) * 130
}
export function cardBloom(p: number, timing: readonly number[]) {
  return ease(timing[0], timing[1], p) * (1 - ease(timing[2], timing[3], p))
}
export function stemRelease(p: number, time: number) {
  const attached = 1 - ease(.545, .555, p)
  const sway = Math.sin(time * .65 + .8) * 4 * attached
  const rock = Math.sin(clamp01((p - .505) / .045) * Math.PI * 3)
    * ease(.505, .515, p) * (1 - ease(.535, .55, p)) * 10
  const lean = -15 * ease(.535, .553, p) * (1 - ease(.555, .585, p))
  return { swing: (sway + rock + lean) || 0,
    recoil: ease(.555, .568, p),
    fibres: Math.sin(Math.PI * ease(.551, .57, p)) }
}
/** Screen placement and size come exclusively from the camera's world projection. */
export function applePose(p: number, projection: CollageProjection, _width: number, _height: number, time = 0) {
  const reaction = p < HIT ? 0 : Math.sin(clamp01((p - HIT) / .036) * Math.PI) * Math.exp(-Math.max(0, p - HIT) * 12)
  return { ...projection.apple, rotation: appleWorld(p).rotation, reaction, ...stemRelease(p, time),
    headX: projection.head.x, headY: projection.head.y,
    blur: 7 * ease(.49, .56, p) * (1 - ease(.785, .824, p)) + meadowHandoff(p).blur,
    speed: ease(.55, .58, p) * (1 - ease(.78, .82, p)),
  }
}
