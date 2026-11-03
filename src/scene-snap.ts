import { JOURNEY_END } from './scroll-timing.ts'

import {ENDING_READING} from './ending-motion.ts'

// Resting compositions only: never capture a bird pass, leaf pass or doorway.
// The canopy is fully readable here; the cards start folding on the next frame.
export const CANOPY = .485
export const EDUCATION_STOPS = [.61, .673, .755] as const
export const NEWTON_READING = .87
export const APPLE_CLOSEUP = 1.025
export const READING_ROOM = 2.68
export const SCENE_STOPS = [0, .26, CANOPY, ...EDUCATION_STOPS, NEWTON_READING, APPLE_CLOSEUP, 1.20, 1.41, 2.03, READING_ROOM, 3.53, 4.29, ENDING_READING]
export const SNAP_RADIUS = .055
export function nearbyScene(progress:number, released:number|null=null) {
  if(released!==null && Math.abs(progress-released)<SNAP_RADIUS*1.6)return null
  const nearest=SCENE_STOPS.reduce((a,b)=>Math.abs(b-progress)<Math.abs(a-progress)?b:a)
  return Math.abs(nearest-progress)<=SNAP_RADIUS ? nearest : null
}

// Each duration belongs to the passage leading into the corresponding stop.
const stops = [...SCENE_STOPS, JOURNEY_END]
const passageMs = [0, 2300, 2100, 1050, 680, 680, 1160, 950, 1050, 2100, 3100, 2000, 2600, 3600, 2900, 1700]

function nearestStopIndex(progress: number) {
  return stops.reduce((best, stop, i) =>
    Math.abs(stop - progress) < Math.abs(stops[best] - progress) ? i : best, 0)
}

export function nextBeat(progress: number, direction: number) {
  const current = nearestStopIndex(progress)
  const index = Math.max(0, Math.min(stops.length - 1, current + direction))
  return stops[index]
}

export function passageDuration(from: number, to: number) {
  const start = nearestStopIndex(from)
  const end = nearestStopIndex(to)
  return Math.abs(start - end) === 1 ? passageMs[Math.max(start, end)] : 0
}
