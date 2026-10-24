import { useEffect, useRef, useState } from 'react'
import type { Landscape } from './landscape'
import AppleJourney, { type AppleJourneyHandle } from './AppleJourney'
import { journeyToScroll, SCROLL_HEIGHT, JOURNEY_END } from './scroll-timing'
import BookJourney, { type BookHandle } from './BookJourney'
import HonorsJourney, { type HonorsHandle } from './HonorsJourney'
import LibraryJourney, { type LibraryHandle } from './LibraryJourney'
import { meadowHandoff } from './book-motion'

const chapters = ['Above it all', 'Down to earth', 'In the canopy', 'Grade 10', 'A-Levels', 'Research ahead', 'Newton’s apple', 'A new perspective', 'The clearing', 'Project journal']
const chapterStops = [0, .26, .435, .59, .673, .755, .825, .98, 1.20, 1.41]

function Leaf({ className = '' }: { className?: string }) {
  return <svg className={className} width="26" height="32" viewBox="0 0 26 32" fill="none" aria-hidden="true"><path d="M21 3C5 4 1 12 7 21c8 6 17-2 14-18Z" stroke="currentColor" strokeWidth="1.2"/><path d="M4 29 18 8M10 19l-1-7m5 1 6-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
}

function Arrow({ up = false }: { up?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: up ? 'rotate(180deg)' : undefined }}><path d="M12 3v17m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

export default function App() {
  const host = useRef<HTMLDivElement>(null)
  const journey = useRef<HTMLElement>(null)
  const engine = useRef<Landscape | null>(null)
  const collage = useRef<AppleJourneyHandle>(null)
  const book = useRef<BookHandle>(null)
  const honors = useRef<HonorsHandle>(null)
  const library = useRef<LibraryHandle>(null)
  const [inFlight, setInFlight] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [failed, setFailed] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [paused, setPaused] = useState(false)
  const [ultra, setUltra] = useState(false)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).get('view') === 'still')
  const [readyToEnter, setReadyToEnter] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(query.matches || new URLSearchParams(location.search).get('view') === 'still')
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    if (!host.current || !journey.current || reduced) { setLoaded(true); return }
    const hostElement = host.current
    let disposed = false
    let active: Landscape | undefined
    setLoaded(false)
    setFailed(false)
    import('./landscape').then(({ createLandscape }) => createLandscape(hostElement, {
      onLoad: (value) => { if (!disposed) setLoadProgress(value) },
      onProgress: (value) => {
        if (disposed || !journey.current) return
        journey.current.style.setProperty('--journey', String(value / JOURNEY_END))
        journey.current.style.setProperty('--intro-y', `${-Math.min(1, value / .105) * 150}vh`)
        const slide = (start: number, end: number, leave: number, gone: number) =>
          Math.max(0, Math.min(1, (end - value) / (end - start))) * 120 - Math.max(0, Math.min(1, (value - leave) / (gone - leave))) * 130
        journey.current.style.setProperty('--arrival-y', `${slide(.21, .24, .277, .31)}vh`)
        setChapter(value < .21 ? 0 : value < .355 ? 1 : value < .54 ? 2 : value < .632 ? 3 : value < .712 ? 4 : value < .798 ? 5 : value < .90 ? 6 : value < 1.07 ? 7 : value < 1.20 ? 8 : 9)
        setInFlight(value > .10 && value < .24)
      },
      onCollageFrame: (value, projection, time) => {
        if (disposed) return
        const handoff = meadowHandoff(value)
        journey.current?.style.setProperty('--overworld-opacity', String(1-handoff.blend))
        const medalAnchor=honors.current?.update(value, time)
        if(medalAnchor)library.current?.update(value,time,medalAnchor)
        const apple = book.current?.update(value, time)
        collage.current?.update(value, apple ? { ...projection, apple } : projection, time)
      },
      onError: () => { if (!disposed) { setFailed(true); setLoaded(true) } },
    })).then((landscape) => {
      if (disposed) { landscape.dispose(); return }
      active = landscape
      engine.current = landscape
      setLoaded(true)
    }).catch(() => { if (!disposed) { setFailed(true); setLoaded(true) } })
    return () => { disposed = true; active?.dispose(); engine.current = null }
  }, [reduced])

  useEffect(() => { engine.current?.setPaused(paused) }, [paused, loaded])
  useEffect(() => { engine.current?.setUltra(ultra) }, [ultra, loaded])
  useEffect(() => {
    if (!loaded) return
    const timer = window.setTimeout(() => setReadyToEnter(true), 80)
    return () => window.clearTimeout(timer)
  }, [loaded])

  const staticMode = reduced || failed
  useEffect(() => {
    if (!staticMode) return
    const update = () => {
      const value = Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))
      setChapter(Math.min(6, Math.floor(value * 6.9)))
      journey.current?.style.setProperty('--journey', String(value))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [staticMode])
  const scrollTo = (progress: number) => {
    const distance = Math.max(0, document.documentElement.scrollHeight - innerHeight)
    window.scrollTo({ top: distance * (staticMode ? progress : journeyToScroll(progress)), behavior: reduced ? 'instant' : 'smooth' })
  }

  return <main ref={journey} className={`journey ${staticMode ? 'static-mode' : ''} ${readyToEnter ? 'is-ready' : ''}`}>
    <div className="world" ref={host} aria-hidden="true" />
    {staticMode && <div className="static-landscape" aria-hidden="true" />}
    <div className="paper-grain" aria-hidden="true" />
    {!loaded && <div className="loading-screen" role="status" aria-live="polite">
      <Leaf />
      <span className="eyebrow">A SMALL WORLD IS TAKING SHAPE</span>
      <p>Somewhere, a little quieter.</p>
      <div className="loading-track"><span style={{ width: `${loadProgress * 100}%` }} /></div>
      <span className="loading-percent">{Math.round(loadProgress * 100)}%</span>
    </div>}

    <header className="site-header" inert={!staticMode && chapter >= 8}>
      <a className="identity" href="#sky" onClick={(e) => { e.preventDefault(); scrollTo(0) }} aria-label="Sidant Chaturbedi, back to the sky"><Leaf /><span>SIDANT<span className="identity-sub">CHATURBEDI</span></span></a>
      <span className="header-note"><span className="status-dot" /> A WORLD OF MY OWN</span>
      <button className="skip-link" onClick={() => scrollTo(chapter === 9 || (staticMode && chapter === 6) ? 0 : staticMode ? Math.min(1, (chapter + 1) / 6) : chapterStops[chapter + 1])}>{staticMode && chapter === 6 ? 'Back to the sky' : ['Meet me below', 'Find my story', 'Follow an apple', 'Keep growing', 'What’s next', 'Meet Newton', 'Look closer', 'A new clearing', 'Open the journal', 'Back to the sky'][chapter]}<span aria-hidden="true">↗</span></button>
    </header>

    <section id="sky" className="opening" aria-label="Welcome" aria-hidden={!staticMode && chapter !== 0} inert={!staticMode && chapter !== 0}>
      <div className="opening-copy">
        <p className="eyebrow">A MOMENT TO LOOK UP</p>
        <h1>Hello<span className="hello-dot">.</span></h1>
        <p className="opening-subtitle">Welcome to my little corner of the world.</p>
        <span className="tiny-flourish" aria-hidden="true">✧</span>
      </div>
      <button className="scroll-invitation" onClick={() => scrollTo(staticMode ? 1 / 6 : .18)}><span className="scroll-line" /><span>SCROLL TO WANDER</span><Arrow /></button>
    </section>

    <div className="travel-caption" aria-hidden="true" style={{ display: inFlight ? undefined : 'none' }}><span className="caption-line" />A change of perspective.</div>

    <section id="meadow" className="arrival" aria-label="About Sidant Chaturbedi" aria-hidden={!staticMode && chapter !== 1}>
      <div className="arrival-copy">
        <span className="eyebrow arrival-eyebrow"><span className="small-star">✳</span> NICE TO MEET YOU</span>
        <h2><span>Hi, I am</span>Sidant<br /><em>Chaturbedi.</em></h2>
        <p>AI researcher. Full-stack developer.<br />From Kathmandu, looking outward.</p>
        <div className="arrival-rule" />
        <span className="arrival-footnote">Satellite research · Thoughtful tools · AI education</span>
      </div>
      <div className="meadow-note"><span>Stay a little.</span><span>There’s no hurry here.</span><Leaf /></div>
    </section>

    <AppleJourney ref={collage} chapter={chapter} staticMode={staticMode} />
    <BookJourney ref={book} staticMode={staticMode} onTravel={p => scrollTo(staticMode ? (p > 1 ? 1 : p) : p)} />

    <HonorsJourney ref={honors} staticMode={staticMode} onTravel={scrollTo} />
    <LibraryJourney ref={library} staticMode={staticMode} onTravel={scrollTo} />

    <nav className="chapter-nav" aria-label="Journey chapters" inert={!staticMode && chapter >= 8}>
      {chapters.map((name, index) => <button key={name} className={chapter === index ? 'active' : ''} onClick={() => scrollTo(staticMode ? Math.min(1, index / 6) : chapterStops[index])} aria-label={name} aria-current={chapter === index ? 'step' : undefined}><span className="chapter-label">{name}</span><span className="chapter-tick" /></button>)}
    </nav>

    <footer className="world-footer" inert={!staticMode && chapter >= 8}>
      <div className="coordinates"><span className="compass" aria-hidden="true">✧</span><span><span className="chapter-number">0{chapter + 1}</span> / {chapters[chapter]}</span></div>
      <span className="footer-center">TAKE THE SCENIC ROUTE</span>
      <div className="scene-controls">
        {!staticMode && <><button aria-label={ultra ? 'Switch to high rendering quality' : 'Switch to ultra rendering quality'} aria-pressed={ultra} onClick={() => setUltra(!ultra)} className="quality-control">{ultra ? 'ULTRA' : 'HIGH'}<span className="quality-dot" /></button><span className="control-divider" /><button className="motion-control" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume ambient animation' : 'Pause ambient animation'} aria-pressed={paused}>{paused ? <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 8 5-8 5Z" fill="currentColor" /></svg> : <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="1.7" /></svg>}<span>{paused ? 'Play' : 'Pause'}</span></button></>}
        {staticMode && <span className="static-label">{failed ? 'STILL A BEAUTIFUL VIEW' : 'A QUIETER EXPERIENCE'}</span>}
      </div>
    </footer>
    <div className="journey-progress" aria-hidden="true"><span /></div>
    <div className="scroll-space" style={staticMode ? undefined : { height: `${SCROLL_HEIGHT}svh` }} />
  </main>
}




