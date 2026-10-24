import { forwardRef, useImperativeHandle, useRef } from 'react'
import { applePose, cardBloom, ease, panelSlide, type CollageProjection } from './apple-motion'
import { profile } from './profile'
import { APPLES } from './journey-path'
import './apple-journey.css'

export type AppleJourneyHandle = { update(progress: number, projection: CollageProjection, time: number): void }
const introductions = [
  { label: '01 / HELLO THERE', title: 'Sidant Chaturbedi', body: 'AI researcher · Full-stack developer', apple: 2 },
  { label: '02 / MY BACKGROUND', title: 'Rooted in curiosity.', body: 'From Birgunj and Butwal to Kathmandu. Researching AI and remote sensing.', apple: 8 },
  { label: '03 / MY SKILLS', title: 'Patterns into possibilities.', body: 'Python · C++ · JavaScript · React · PyTorch · QGIS', apple: 4 },
  { label: '04 / MY APPROACH', title: 'Learn. Build. Grow.', body: 'Researching road vulnerability. Building study tools. Helping train Nepal’s AI Olympiad community.', apple: 6 },
]
const education = [
  { ...profile.education[0], number: '01', label: 'THE FIRST SEED', title: 'A strong', emphasis: 'beginning.', timing: [.54, .565, .62, .642] },
  { ...profile.education[1], number: '02', label: 'REACHING FURTHER', title: 'Room to', emphasis: 'grow.', timing: [.632, .652, .70, .722] },
  { ...profile.education[2], number: '03', label: 'THE NEXT CHAPTER', title: 'Still', emphasis: 'becoming.', timing: [.712, .732, .79, .812] },
]

const AppleJourney = forwardRef<AppleJourneyHandle, { chapter: number; staticMode: boolean }>(function AppleJourney({ chapter, staticMode }, ref) {
  const root = useRef<HTMLDivElement>(null)
  const fruit = useRef<HTMLDivElement>(null)
  const stem = useRef<SVGSVGElement>(null)
  const stemLine = useRef<SVGPathElement>(null)
  const stemFibres = useRef<SVGGElement>(null)
  const introCards = useRef<(HTMLElement | null)[]>([])
  const introLayout = useRef<{ x: number; y: number; localX: number; localY: number }[]>([])
  const otherApples = useRef<(HTMLImageElement | null)[]>([])
  const newton = useRef<HTMLDivElement>(null)
  const connector = useRef<SVGSVGElement>(null)
  const lines = useRef<(SVGPathElement | null)[]>([])
  const circles = useRef<(SVGCircleElement | null)[]>([])
  const notes = useRef<(HTMLElement | null)[]>([])
  const noteAnchors = useRef<{ width: number; height: number; points: { x: number; y: number }[] }>({ width: 0, height: 0, points: [] })
  const impact = useRef<HTMLDivElement>(null)
  const streaks = useRef<HTMLDivElement>(null)
  const appleShadow = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({ update(p, projection, time) {
    const element = root.current
    if (!element || staticMode) return
    const width = innerWidth, height = innerHeight, phone = width < 700
    const pose = applePose(p, projection, width, height, time)
    // Read untransformed layout only on resize; animate cached anchor positions.
    if (noteAnchors.current.width !== width || noteAnchors.current.height !== height) {
      introLayout.current = introCards.current.map((card, i) => {
        const localX = phone ? (card?.offsetWidth ?? 0) * .5 : i < 2 ? card?.offsetWidth ?? 0 : 0
        const localY = phone ? 0 : (card?.offsetHeight ?? 0) * .5
        return { x: (card?.offsetLeft ?? 0) + localX, y: (card?.offsetTop ?? 0) + localY, localX, localY }
      })
      noteAnchors.current = { width, height, points: notes.current.map(note => {
        const paper = note?.firstElementChild as HTMLElement | null
        return { x: phone ? width * .5 : paper?.offsetLeft ?? width * .59,
          y: phone ? height * .88 - (paper?.offsetHeight ?? 350) : height * .5 }
      }) }
    }
    const visible = projection.apple.visible
    if (fruit.current) {
      fruit.current.style.transform = `translate3d(${pose.x}px,${pose.y}px,0) translate(-50%,-50%) rotate(${pose.rotation}deg)`
      fruit.current.style.width = `${pose.size}px`
      fruit.current.style.visibility = visible ? 'visible' : 'hidden'
      fruit.current.style.setProperty('--swing', `${pose.swing}deg`)
    }
    projection.apples.slice(1).forEach((a, i) => {
      const image = otherApples.current[i]
      if (!image) return
      image.style.width = `${a.size}px`
      image.style.transform = `translate3d(${a.x}px,${a.y}px,0) translate(-50%,-50%) rotate(${Math.sin(time * .65 + .8 + i * .12) * 3}deg)`
      image.style.filter = `blur(${pose.blur}px)`
      image.style.visibility = a.visible ? 'visible' : 'hidden'
    })
    const figure = projection.newton
    if (newton.current) {
      const breath = Math.sin(time * 1.2) * .002
      newton.current.style.height = `${figure.size}px`
      newton.current.style.transform = `translate3d(${figure.x}px,${figure.y}px,0) translate(-50%,-100%) rotate(${-pose.reaction * 6}deg) scale(${1 + breath},${1 - breath - pose.reaction * .035})`
      newton.current.style.filter = `blur(${pose.blur}px)`
      newton.current.style.visibility = figure.visible ? 'visible' : 'hidden'
    }
    element.style.setProperty('--canopy-open', String(cardBloom(p, [.345, .385, .485, .517])))
    element.style.setProperty('--landing-y', `${panelSlide(p, .798, .818, .845, .88)}vh`)
    element.style.setProperty('--speed', String(pose.speed))
    element.style.setProperty('--streak-y', `${(p * 12000) % 180}px`)
    element.parentElement?.style.setProperty('--world-blur', `${pose.blur}px`)
    element.parentElement?.style.setProperty('--chrome-y', `${ease(.86, .91, p) * -120}%`)
    element.parentElement?.style.setProperty('--footer-y', `${ease(.86, .91, p) * 120}%`)
    element.parentElement?.style.setProperty('--chrome-opacity', String(1-ease(.86,.91,p)))
    education.forEach((entry, i) => {
      const note = notes.current[i], anchor = noteAnchors.current.points[i]
      if (!note || !anchor) return
      const open = cardBloom(p, entry.timing)
      note.style.visibility = open > .001 ? 'visible' : 'hidden'
      note.style.transformOrigin = `${anchor.x}px ${anchor.y}px`
      note.style.transform = `translate3d(${(pose.x - anchor.x) * (1 - open)}px,${(pose.y - anchor.y) * (1 - open)}px,0) scale(${Math.max(.001, open)}) rotate(${(1 - open) * (phone ? 6 : -8)}deg)`
      note.style.setProperty('--card-interactive', open > .95 ? 'auto' : 'none')
    })
    if (stem.current && stemLine.current && stemFibres.current) {
      const anchor = projection.stem, resting = projection.apples[0]
      const stemTip = { x: pose.x, y: pose.y - pose.size * .43 }
      const endX = stemTip.x * (1 - pose.recoil) + anchor.x * pose.recoil
      const endY = stemTip.y * (1 - pose.recoil) + (anchor.y + resting.size * .12) * pose.recoil
      stem.current.setAttribute('viewBox', `0 0 ${width} ${height}`)
      stem.current.style.visibility = anchor.visible ? 'visible' : 'hidden'
      stem.current.style.filter = `blur(${pose.blur * ease(.555, .59, p)}px)`
      stemLine.current.setAttribute('d', `M ${anchor.x} ${anchor.y} Q ${anchor.x + resting.size * .09} ${(anchor.y + endY) * .5} ${endX} ${endY}`)
      stemLine.current.style.strokeWidth = `${Math.max(.7, Math.min(3, resting.size * .035))}px`
      stemFibres.current.setAttribute('transform', `translate(${endX},${endY}) scale(${Math.min(1.5, resting.size / 55)})`)
      stemFibres.current.style.opacity = String(pose.fibres)
    }
    if (connector.current) {
      connector.current.setAttribute('viewBox', `0 0 ${width} ${height}`)
      introductions.forEach((entry, i) => {
        const a = projection.apples[phone && i === 1 ? 10 : entry.apple]
        const layout = introLayout.current[i], card = introCards.current[i]
        if (!layout || !card) return
        const open = cardBloom(p, [.345 + i * .003, .375 + i * .003, .485, .517])
        const dx = (a.x - layout.x) * (1 - open), dy = (a.y - layout.y) * (1 - open)
        card.style.visibility = open > .001 ? 'visible' : 'hidden'
        card.style.transformOrigin = `${layout.localX}px ${layout.localY}px`
        card.style.transform = `translate3d(${dx}px,${dy}px,0) scale(${Math.max(.001, open)})`
        const endX = layout.x + dx, endY = layout.y + dy
        const radius = Math.max(9, a.size * .75)
        const direction = i >= 2 ? 1 : -1
        lines.current[i]?.setAttribute('d', phone
          ? `M ${a.x} ${a.y + radius} L ${a.x} ${endY - 12 * open} L ${endX} ${endY}`
          : `M ${a.x + radius * direction} ${a.y} L ${endX - direction * 20 * open} ${endY} L ${endX} ${endY}`)
        lines.current[i]?.style.setProperty('opacity', String(ease(.35, 1, open)))
        circles.current[i]?.setAttribute('cx', String(a.x))
        circles.current[i]?.setAttribute('cy', String(a.y))
        circles.current[i]?.setAttribute('r', String(radius))
        circles.current[i]?.style.setProperty('opacity', String(open))
      })
    }
    if (impact.current) {
      impact.current.style.transform = `translate3d(${pose.headX}px,${pose.headY}px,0) translate(-50%,-50%) scale(${.6 + pose.reaction * .7}) rotate(${-pose.reaction * 12}deg)`
      impact.current.style.opacity = String(pose.reaction)
    }
    if (streaks.current) streaks.current.style.transform = `translateX(${pose.x}px)`
    if (appleShadow.current) {
      appleShadow.current.style.transform = `translate3d(${projection.landing.x}px,${projection.landing.y}px,0) translate(-50%,-50%)`
      appleShadow.current.style.opacity = String(ease(.835, .87, p) * (1 - ease(.92, .95, p)) * .42)
    }
    if (import.meta.env.DEV) element.dataset.choreography = JSON.stringify({ progress: +p.toFixed(4), x: +pose.x.toFixed(1), y: +pose.y.toFixed(1), size: +pose.size.toFixed(1), rotation: +pose.rotation.toFixed(1), headX: +pose.headX.toFixed(1), headY: +pose.headY.toFixed(1), newtonSize: +figure.size.toFixed(1), blur: +pose.blur.toFixed(1), swing: +pose.swing.toFixed(2), recoil: +pose.recoil.toFixed(3) })
  } }), [staticMode])

  return <div ref={root} className="apple-journey">
    <div className="collage-world" aria-hidden="true">
      {APPLES.slice(1).map((_, i) => <img ref={el => { otherApples.current[i] = el }} className="canopy-apple" src="/art/apple-collage.png" alt="" key={i} draggable="false" />)}
      <div className="newton-cutout" ref={newton}><img src="/art/newton-collage.png" alt="" draggable="false" /></div>
      <div className="apple-ground-shadow" ref={appleShadow} />
      <div className="speed-lines" ref={streaks}>{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ left: `${(i % 2 ? 1 : -1) * (76 + (i * 41) % 185)}px`, top: `${(i * 19) % 100 - 20}%`, height: `${65 + (i * 47) % 180}px`, opacity: .15 + (i % 4) * .12 }} />)}</div>
      <div className="impact-spark" ref={impact}><span>✧</span><i /><i /><i /></div>
    </div>
    <svg className="apple-connectors" ref={connector} aria-hidden="true">{introductions.map((_, i) => <g key={i}><path ref={el => { lines.current[i] = el }} /><circle ref={el => { circles.current[i] = el }} /></g>)}</svg>
    <section className="canopy-note" aria-label="About Sidant, in the apple tree" aria-hidden={!staticMode && chapter !== 2}>
      {introductions.map((entry, i) => <article ref={el => { introCards.current[i] = el }} className={`tree-note tree-note-${i}`} key={entry.label}>
        <span className="tree-note-label">{entry.label}</span><h2>{entry.title}</h2><p>{entry.body}</p>
      </article>)}
      <p className="tree-invitation">A little curiosity. A world of possibilities.<span>↓ Follow an apple through my story</span></p>
    </section>
    {education.map((entry, i) => <section key={entry.number} ref={el => { notes.current[i] = el }} className="education-scroll-note" aria-label={`Education stage ${i + 1}`} aria-hidden={!staticMode && chapter !== i + 3}>
      <article className="education-paper"><div className="education-kicker"><span>GROWING, ONE CHAPTER AT A TIME</span><span>{entry.number} / 03</span></div><p className="education-label">{entry.label}</p><h2>{entry.title}<br /><em>{entry.emphasis}</em></h2><p className="qualification">{entry.qualification}</p><h3>{entry.school}</h3><p className="education-detail">{entry.detail}</p><div className="education-result"><strong>{entry.result}</strong><span>{entry.resultLabel}</span></div><div className="education-progress" aria-hidden="true">{[0, 1, 2].map(n => <span className={i === n ? 'current' : ''} key={n} />)}</div></article>
    </section>)}
    <section className="newton-note" aria-label="An apple meets Isaac Newton" aria-hidden={!staticMode && chapter !== 6}>
      <span className="eyebrow">A SMALL ENCOUNTER WITH GRAVITY</span><h2>A little nudge.<br /><em>A new perspective.</em></h2><p>Even the simplest things<br />can change how we see the world.</p><span className="newton-name">Sir Isaac Newton · a playful imagining</span><p className="orchard-next"><span aria-hidden="true">↓</span> There’s more inside an idea.</p>
    </section>
    <svg className="apple-stem" ref={stem} aria-hidden="true">
      <path ref={stemLine} className="stem-tether" />
      <g ref={stemFibres} className="stem-fibres"><path d="M-2 -3 -5 -7 M2 -3 5 -6 M0 -4 0 -9" /></g>
    </svg>
    <div className="apple-frame" aria-hidden="true"><div className="hero-apple" ref={fruit}>
      <img className="apple-swing" src="/art/apple-collage.png" alt="" draggable="false" />
    </div></div>
    {staticMode && <section className="still-finale"><img src="/art/newton-collage.png" alt="A hand-painted Isaac Newton sitting with a book" /><div><span className="eyebrow">A NEW PERSPECTIVE</span><h2>Every idea<br />starts <em>somewhere.</em></h2><img src="/art/apple-collage.png" alt="A painted red apple" /></div></section>}
  </div>
})
export default AppleJourney



