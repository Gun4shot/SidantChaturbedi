// Compress only the ground-to-tree camera move. Education/fall pacing stays intact.
const PAN_START = .28, PAN_END = .355, PAN_WEIGHT = .55
const SAVED = (PAN_END - PAN_START) * (1 - PAN_WEIGHT)
export const JOURNEY_END = 4.42
export const SCROLL_TRAVEL = JOURNEY_END - SAVED
export const SCROLL_HEIGHT = 100 + 1000 * SCROLL_TRAVEL
export function journeyToScroll(p: number) {
  const value = Math.max(0, Math.min(JOURNEY_END, p))
  const distance = value <= PAN_START ? value
    : value <= PAN_END ? PAN_START + (value - PAN_START) * PAN_WEIGHT : value - SAVED
  return distance / SCROLL_TRAVEL
}
export function scrollToJourney(p: number) {
  const distance = Math.max(0, Math.min(1, p)) * SCROLL_TRAVEL
  const panEnd = PAN_START + (PAN_END - PAN_START) * PAN_WEIGHT
  return distance <= PAN_START ? distance
    : distance <= panEnd ? PAN_START + (distance - PAN_START) / PAN_WEIGHT : distance + SAVED
}
