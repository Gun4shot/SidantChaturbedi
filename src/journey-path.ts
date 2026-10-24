import * as THREE from 'three'
import { CLOSE_START, CLOSE_END, closeFraming } from './book-motion.ts'

const mix = THREE.MathUtils.lerp
export const smooth = (a: number, b: number, v: number) => { const t = THREE.MathUtils.clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }
const ease = (a: number, b: number, v: number) => { const t = THREE.MathUtils.clamp((v - a) / (b - a), 0, 1); return THREE.MathUtils.clamp(t * t * t * (t * (t * 6 - 15) + 10), 0, 1) }
export const riverCenter = (z: number) => 48 + Math.sin(z * .007) * 37 + Math.sin(z * .019) * 10
export const riverWidth = (z: number) => 12 + smooth(50, 900, -z) * 20
export function groundHeight(x: number, z: number) {
  const d = Math.abs(x - riverCenter(z))
  const inland = 3.2 + Math.sin(x * .017 + z * .006) * 2.2 + Math.cos(z * .014 - x * .007) * 1.5
    + smooth(90, 380, d) * (15 + 18 * Math.sin(z * .005 + x * .003) ** 2)
  return mix(-1.8, inland, smooth(riverWidth(z) - 1, riverWidth(z) + 10, d))
}

export const HIT = .825, GROUND = .87, ZOOM = .91
export const HERO_TREE = { x: -82, z: -140, size: 43 }
const base = groundHeight(HERO_TREE.x, HERO_TREE.z)
// World anchors project image cutouts; these are not modeled props.
export const NEWTON = { x: -84.2, y: groundHeight(-84.2, -137.6) + .15, z: -137.6, size: 6.8 }
export const HEAD = { x: NEWTON.x + NEWTON.size * .025, y: NEWTON.y + NEWTON.size * .96, z: NEWTON.z }
export const APPLES = [
  { x: HEAD.x, y: base + 29, z: NEWTON.z, size: 1.05 },
  ...[[-94, 30, .85], [-91, 35, .9], [-81, 37, .8], [-73, 34, .95], [-69, 29, .8],
    [-76, 27, .9], [-87, 24, .85], [-97, 26, .75], [-82, 33, .8], [-90, 28, .75],
    [-78, 22, .8], [-72, 24, .75], [-87, 38, .75], [-78, 30, .8]]
    .map(([x, y, size]) => ({ x, y: base + y, z: -137.6, size })),
]
export const LANDING = { x: HEAD.x + 3.5, y: groundHeight(HEAD.x + 3.5, NEWTON.z) + .1, z: NEWTON.z }
// Match the hero tree's five-row wind-deformed painted plane, including the
// interpolation between its vertices. Fruit anchors therefore travel with foliage.
export function treeWindOffset(y: number, time: number) {
  const height = THREE.MathUtils.clamp((y - (base - .25)) / HERO_TREE.size, 0, 1)
  const row = Math.min(4, Math.floor(height * 5)), fraction = height * 5 - row
  const wave = (h: number) => Math.sin(time * .65 + h * 1.2) * h * h * .018 * HERO_TREE.size
  return mix(wave(row / 5), wave((row + 1) / 5), fraction)
}
export function canopyAppleWorld(index: number, time: number) {
  const apple = APPLES[index]
  return { ...apple, x: apple.x + treeWindOffset(apple.y, time) }
}
export function appleStemAnchor(time: number) {
  const apple = APPLES[0], y = apple.y + apple.size * .8
  return { x: apple.x + treeWindOffset(y, time), y, z: apple.z }
}
export function appleWorld(p: number) {
  const apple = APPLES[0]
  const t = THREE.MathUtils.clamp((p - .555) / (HIT - .555), 0, 1)
  const contactY = HEAD.y + apple.size * .46
  let x = apple.x, y = mix(apple.y, contactY, t * t), rotation = t * 720
  if (p >= HIT) {
    // Slow time during the descending bounce. The fruit never reaches this ground.
    const clock = p <= CLOSE_START ? p : CLOSE_START + .016 * (1 - Math.exp(-(Math.min(p, CLOSE_END)-CLOSE_START)/.016))
    const b = THREE.MathUtils.clamp((clock - HIT) / (GROUND - HIT), 0, 1)
    x = mix(apple.x, LANDING.x, smooth(0, 1, b))
    y = mix(contactY, LANDING.y + apple.size * .46, b * b) + Math.sin(b * Math.PI) * 1.8
    rotation = mix(720, 1080, smooth(0, 1, b))
    rotation = mix(rotation, 1080, ease(CLOSE_START, CLOSE_END, p))
  }
  return { x, y, z: apple.z, size: apple.size, rotation }
}
export function fallingAppleWorld(p: number, time: number) {
  const apple = appleWorld(p)
  const attached = 1 - smooth(.54, .555, p)
  const tug = Math.sin(Math.PI * smooth(.525, .555, p)) * .16
  return { ...apple, x: apple.x + treeWindOffset(APPLES[0].y, time) * attached, y: apple.y - tug }
}
export const joins = [.24, .28, .355, .49, .525, .54, .555, .755, .77, HIT, GROUND, ZOOM, .995]
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
const descent = new THREE.CatmullRomCurve3([
  v(0, 100, 170), v(-3, 85, 136), v(-12, 54, 83), v(-24, 26, 16),
  v(-29, 12, -32), v(-28, groundHeight(-28, -58) + 5.1, -58),
], false, 'centripetal')
const meadow = descent.getPointAt(1)
const canopy = (compact: boolean) => v(-82, base + (compact ? 25 : 30), compact ? -94 : -99)
// A brief backwards drift opens the view before the camera travels left and pushes in.
const approaches = [false, true].map(c => new THREE.CatmullRomCurve3([
  meadow, meadow.clone().add(v(0, 2, 9)), v(-56, base + 21, -59), v(-82, base + 30, -77), canopy(c),
], false, 'centripetal'))
function follow(p: number, compact: boolean) {
  const apple = appleWorld(p)
  const wideDistance = compact ? 22 : 24
  const distance = mix(compact ? 12 : 10, wideDistance, ease(.755, HIT, p))
  // Dolly back for the encounter while preserving the apple's left-of-center framing.
  const framing = distance / wideDistance
  const offsetY = (compact ? mix(-5.5, -1, ease(.75, HIT, p)) : -1) * framing
  return v(apple.x + (compact ? 1.8 : 6) * framing, apple.y + offsetY, apple.z + distance)
}
const restingCamera = (compact: boolean) => { const camera = follow(HIT, compact); camera.y = HEAD.y + 2; return camera }
export function cameraPosition(progress: number, compact = false, aspect = compact ? 390/844 : 1280/720) {
  if (progress <= .28) return descent.getPointAt(smooth(.025, .24, progress))
  if (progress <= .49) return approaches[+compact].getPointAt(ease(.28, .355, progress))
  if (progress <= .555) return canopy(compact).lerp(follow(.555, compact), ease(.49, .555, progress))
  if (progress < HIT) {
    const camera = follow(progress, compact), floor = restingCamera(compact).y
    // Smooth maximum slows the camera above the head without overtaking the fruit.
    const blend = Math.max(2 - Math.abs(camera.y - floor), 0)
    camera.y = Math.max(camera.y, floor) + blend * blend / 8
    return camera
  }
  const camera = restingCamera(compact)
  if (progress < CLOSE_START) return camera
  const apple = appleWorld(progress), framing = closeFraming(aspect)
  const tangent = Math.tan(THREE.MathUtils.degToRad((compact ? 59 : 48)/2))
  const distance = apple.size/(2*tangent*framing.size)
  const close = v(apple.x, apple.y + (framing.centerY-.5)*2*tangent*distance, apple.z+distance)
  return camera.lerp(close, ease(CLOSE_START, CLOSE_END, progress))
}
export function cameraTarget(progress: number, compact = false, aspect = compact ? 390/844 : 1280/720) {
  const travel = smooth(.025, .24, progress)
  const meadowView = v(mix(0, 8, travel), mix(160, 8, smooth(0, .88, travel)), -420)
  const front = cameraPosition(progress, compact, aspect).add(v(0, 0, -100))
  if (progress <= .355) return meadowView.lerp(front, ease(.28, .355, progress))
  return front
}




