import type { Landscape } from './landscape'
import { ENDING_READING } from './ending-motion'

function nativeInput(target: EventTarget | null) {
  return document.querySelector('dialog[open]') ||
    (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]'))
}

function canScrollWithin(target: EventTarget | null, direction: number) {
  for (let el = target instanceof Element ? target : null; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
    const limit = el.scrollHeight - el.clientHeight
    if (limit <= 1 || !/^(auto|scroll)$/.test(getComputedStyle(el).overflowY)) continue
    if (direction > 0 ? el.scrollTop < limit - 1 : el.scrollTop > 1) return true
  }
  return false
}

export function installStoryInput(story: Landscape) {
  const events = new AbortController()
  const { signal } = events
  let lastWheel = -Infinity
  let lastDelta = 0
  let peak = 0
  let distance = 0
  let consumed = false
  let strokeStart = -Infinity
  let readWithinStroke = false

  window.addEventListener('wheel', event => {
    if (event.ctrlKey || event.shiftKey || event.defaultPrevented || !event.deltaY ||
      Math.abs(event.deltaX) > Math.abs(event.deltaY) || nativeInput(event.target)) return
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1
    const delta = event.deltaY * unit
    const magnitude = Math.abs(delta)
    const previous = Math.abs(lastDelta)
    const direction = Math.sign(delta)
    const now = event.timeStamp
    // A trackpad can start another stroke before its previous momentum stops.
    const newStroke = previous < peak * .6 && magnitude >= Math.max(4, previous * 1.6)
    const carriedIntoLibrary = strokeStart <= story.readingArrival() && lastWheel !== -Infinity
    const fresh = now - lastWheel > (carriedIntoLibrary ? 220 : 110) ||
      direction !== Math.sign(lastDelta) || (!carriedIntoLibrary && newStroke)
    if (fresh) {
      strokeStart = now
      readWithinStroke = false
      consumed = false
      distance = 0
      peak = 0
    }
    lastWheel = now
    lastDelta = delta
    peak = Math.max(peak, magnitude)
    if (!consumed && !story.isPlaying() && canScrollWithin(event.target, direction)) {
      readWithinStroke = true
      return
    }
    event.preventDefault()
    if (consumed || readWithinStroke || strokeStart <= story.readingArrival()) return
    distance += magnitude
    if (distance >= 3) {
      consumed = true
      story.step(direction)
    }
  }, { passive: false, signal })

  let swipe: { x: number; y: number } | null = null
  window.addEventListener('touchstart', event => {
    swipe = null
    if (event.touches.length !== 1 || nativeInput(event.target)) return
    const touch = event.touches[0]
    swipe = { x: touch.clientX, y: touch.clientY }
  }, { passive: true, signal })

  window.addEventListener('touchmove', event => {
    if (!swipe || event.touches.length !== 1) return
    const touch = event.touches[0]
    const dy = swipe.y - touch.clientY
    if (Math.abs(dy) < 12 || Math.abs(dy) < Math.abs(swipe.x - touch.clientX) * 1.2) return
    swipe = null
    const direction = Math.sign(dy)
    if (!story.isPlaying() && canScrollWithin(event.target, direction)) return
    event.preventDefault()
    story.step(direction)
  }, { passive: false, signal })
  const release = () => { swipe = null }
  window.addEventListener('touchend', release, { signal })
  window.addEventListener('touchcancel', release, { signal })

  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey || nativeInput(event.target)) return
    if (event.key === ' ' && event.target instanceof Element && event.target.closest('button, a, summary, [role="button"]')) return
    const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1
      : ['ArrowUp', 'PageUp'].includes(event.key) ? -1
      : event.key === ' ' ? (event.shiftKey ? -1 : 1) : 0
    if (!direction && event.key !== 'Home' && event.key !== 'End') return
    if (!story.isPlaying() && canScrollWithin(event.target, direction || (event.key === 'Home' ? -1 : 1))) return
    event.preventDefault()
    if (event.repeat) return
    if (direction) story.step(direction)
    else story.travelTo(event.key === 'Home' ? 0 : ENDING_READING)
  }, { signal })

  return () => events.abort()
}
