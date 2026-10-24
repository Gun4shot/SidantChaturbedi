import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { meadowHandoff, bookScroll, smooth, readingLayout } from './book-motion'
import { honorsFlight } from './honors-motion'
import { projects, projectArtwork } from './projects'
import type { ProjectedCutout } from './apple-motion'
import type { MeadowEngine } from './project-meadow'
import './book-journey.css'

export type BookHandle={update(progress:number,time:number):ProjectedCutout|undefined}
type Props={staticMode:boolean;onTravel(progress:number):void}
function Icon({kind}:{kind:'arrow'|'grid'|'close'}){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==='arrow'?<path d="M4 12h16m-6-6 6 6-6 6"/>:kind==='close'?<path d="m6 6 12 12M6 18 18 6"/>:<><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>}</svg>}

const BookJourney=forwardRef<BookHandle,Props>(function BookJourney({staticMode,onTravel},ref){
  const root=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null),engine=useRef<MeadowEngine|null>(null)
  const dialog=useRef<HTMLDialogElement>(null),indexButton=useRef<HTMLButtonElement>(null)
  const [active,setActive]=useState(false),[failed,setFailed]=useState(false),[arrived,setArrived]=useState(false)
  const [state,setState]=useState({open:false,page:0,busy:false}),[indexOpen,setIndexOpen]=useState(false),[query,setQuery]=useState('')
  const fallback=staticMode||failed
  const [viewport,setViewport]=useState({width:innerWidth,height:innerHeight})
  const pageGesture=useRef({x:0,y:0,dragged:false})
  useEffect(()=>{const resize=()=>setViewport({width:innerWidth,height:innerHeight});window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize)},[])
  const layout=readingLayout(viewport.width,viewport.height)
  const pageWidth=layout.width/(viewport.width<700?1:2)
  useEffect(()=>{
    if(staticMode||!host.current)return
    let disposed=false
    import('./project-meadow').then(m=>m.createProjectMeadow(host.current!,{state:(open,page,busy)=>{if(!disposed)setState({open,page,busy})},failed:()=>{if(!disposed)setFailed(true)}})).then(e=>{if(disposed)e.dispose();else engine.current=e}).catch(()=>{if(!disposed)setFailed(true)})
    return()=>{disposed=true;engine.current?.dispose();engine.current=null}
  },[staticMode])
  useImperativeHandle(ref,()=>({update(p,time){
    if(staticMode||!root.current)return
    const h=meadowHandoff(p),b=bookScroll(p),f=honorsFlight(p,innerWidth,innerHeight),el=root.current
    // Keep the outgoing scene opaque under the incoming grove to avoid a
    // brightness dip or a glimpse of the original landscape between scenes.
    el.style.setProperty('--meadow-opacity',String(h.blend))
    el.style.setProperty('--meadow-filter',h.blur>.01?`blur(${h.blur}px)`:'none')
    el.style.setProperty('--project-title',String(h.title))
    el.style.setProperty('--meadow-ready',String(h.ready))
    el.style.setProperty('--welcome-opacity',String(h.ready*(1-smooth(.06,.42,b.open))))
    el.style.setProperty('--book-open',String(b.open))
    el.style.setProperty('--book-leave',String(b.leave))
    el.style.setProperty('--flight-lift',String(f.lift))
    el.style.setProperty('--reading-ui',String(smooth(.90,1,b.open)*(1-smooth(0,.12,b.leave))))
    setActive(old=>old===(p>=1.17&&p<1.70)?old:p>=1.17&&p<1.70)
    setArrived(old=>old===(p>=1.75)?old:p>=1.75)
    const apple=engine.current?.update(p,time)
    return p>=.94?apple:undefined
  }}),[staticMode])
  useEffect(()=>{
    if(!active||fallback)return
    const keys=(e:KeyboardEvent)=>{
      const target=e.target
      if(indexOpen||e.altKey||e.ctrlKey||e.metaKey||(target instanceof HTMLElement&&target.closest('input,textarea,select,[contenteditable="true"]')))return
      if(state.open&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){
        e.preventDefault();e.stopPropagation()
        if(!e.repeat)engine.current?.turn(e.key==='ArrowRight'?1:-1)
      }
    };window.addEventListener('keydown',keys,true);return()=>window.removeEventListener('keydown',keys,true)
  },[active,fallback,state.open,indexOpen])
  useEffect(()=>{
    const modal=dialog.current;if(!modal)return
    if(indexOpen){modal.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;if(modal.open)modal.close();indexButton.current?.focus()}}
    if(modal.open)modal.close()
  },[indexOpen])
  useEffect(()=>{if(!state.open)setIndexOpen(false)},[state.open])
  const project=projects[state.page]
  const matches=projects.map((p,i)=>({p,i})).filter(({p})=>`${p.name} ${p.repo??''} ${p.kind} ${p.status} ${p.stack.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  const choose=(i:number)=>{setIndexOpen(false);engine.current?.select(i)}
  return <section ref={root} id="projects" className={`book-journey ${active?'is-active':''} ${state.open?'is-reading':''} ${arrived?'has-left':''} ${fallback?'book-still':''} ${failed&&!staticMode?'book-failed':''}`} aria-label="The project journal">
    {!fallback&&<>
      <div className="meadow-environment" aria-hidden="true"><div className="meadow-backdrop"/><div ref={host} className="meadow-canvas"/></div>
      <div className="apple-project-title" aria-hidden="true"><span>AN IDEA CAN TAKE YOU ANYWHERE</span><h2>Let’s look at<br/><em>my projects.</em></h2></div>
      <div className="meadow-welcome" aria-hidden={!active||state.open}><span className="journal-eyebrow">A NEW CLEARING · A NEW CHAPTER</span><h2>Ideas, in full bloom.</h2><p>Keep scrolling. There’s a story inside.</p><div className="scroll-glyph">↓</div></div>
      <div className="reader-interface" inert={!state.open||!active} aria-hidden={!state.open||!active}>
        <header className="reader-header"><button ref={indexButton} className="index-trigger" onClick={()=>{setQuery('');setIndexOpen(true)}} disabled={state.busy}><Icon kind="grid"/>Project index<span className="project-total">{String(projects.length).padStart(2,'0')}</span></button></header>
        {(project.demo||project.url)&&<a className="book-project-link" href={project.demo||project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}${project.demo?' live site':' on GitHub'}`} tabIndex={state.busy?-1:0} style={{left:viewport.width<700?(viewport.width-layout.width)/2:viewport.width/2,top:layout.top,width:pageWidth,height:layout.height,pointerEvents:state.busy?'none':undefined}} onPointerDown={e=>{pageGesture.current={x:e.clientX,y:e.clientY,dragged:false}}} onPointerUp={e=>{const dx=e.clientX-pageGesture.current.x,dy=e.clientY-pageGesture.current.y;pageGesture.current.dragged=Math.hypot(dx,dy)>12;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)engine.current?.turn(dx<0?1:-1)}} onClick={e=>{if(state.busy||pageGesture.current.dragged)e.preventDefault();pageGesture.current.dragged=false}}><span>{project.demo?'Visit live site':'View on GitHub'} ↗</span></a>}
        <nav className="reader-navigation" aria-label="Project pages"><button className="page-button previous" aria-keyshortcuts="ArrowLeft" onClick={()=>engine.current?.turn(-1)} disabled={state.page===0||state.busy}><Icon kind="arrow"/><span>Previous</span></button><div className="reader-count" aria-live="polite"><span>{String(state.page+1).padStart(2,'0')} <i>/</i> {String(projects.length).padStart(2,'0')}</span><small>{project.name}</small></div><button className="page-button next" aria-keyshortcuts="ArrowRight" onClick={()=>engine.current?.turn(1)} disabled={state.page===projects.length-1||state.busy}><span>Next project</span><Icon kind="arrow"/></button></nav>
        <footer className="reader-footer"><button onClick={()=>onTravel(1.20)}>↑ Back to the meadow</button><span>← → TURN PAGES · SCROLL TO CONTINUE ↓</span><span className="project-link">{project.demo&&<a href={project.demo} target="_blank" rel="noreferrer">Live site ↗</a>}{project.url ? <a href={project.url} target="_blank" rel="noreferrer">{project.linkLabel} ↗</a> : project.status}</span></footer>
        <article className="sr-only" aria-live="polite"><h2>{state.page===0?'View my projects':projects[state.page-1].name}</h2><h3>{project.name}</h3><p>{project.description}</p><p>{project.stack.join(', ')}</p><p>{project.status}</p></article>
      </div>

      <dialog ref={dialog} className="project-index" onCancel={()=>setIndexOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setIndexOpen(false)}} aria-labelledby="index-title">
        <div className="index-inner"><header className="index-heading"><div><span className="journal-eyebrow">SELECTED WORK</span><h2 id="index-title">Find your next page.</h2><p>Useful tools, experiments, and games.</p></div><button className="index-close" onClick={()=>setIndexOpen(false)} aria-label="Close project index"><Icon kind="close"/></button></header>
        <label className="index-search"><Icon kind="grid"/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a project, topic, or technology" aria-label="Search projects"/><span>{matches.length} projects</span></label>
        <div className="index-grid">{matches.map(({p,i})=><article key={p.slug} className={`index-card ${i===state.page?'is-current':''}`}><button className="index-open" onClick={()=>choose(i)} aria-label={`Open ${p.name} in journal`}><div className="index-card-image"><img src={`/art/${projectArtwork[i]}`} alt="" loading="lazy"/><span>{String(i+1).padStart(2,'0')}</span></div><div className="index-card-copy"><small>{p.kind}</small><h3>{p.name}<Icon kind="arrow"/></h3><p>{p.subtitle}</p><span>{i===state.page?'CURRENT PAGE':'OPEN THIS PAGE'}</span></div></button>{p.demo&&<a className="index-demo-link" href={p.demo} target="_blank" rel="noreferrer">Visit live site ↗</a>}{p.url?<a className="index-repo-link" href={p.url} target="_blank" rel="noreferrer" aria-label={`View ${p.repo??p.name} on GitHub`}>{p.fork?'View fork':'View code'} ↗ <span>{p.repo}</span></a>:<span className="index-repo-status">{p.status}</span>}</article>)}</div>
        {matches.length===0&&<p className="index-empty">No pages match that search. Try a project name or technology.</p>}
        <div className="index-colophon"><span>PAINTED ILLUSTRATIONS · REAL PROJECTS</span><span>MADE WITH CURIOSITY ✳</span></div></div>
      </dialog>
    </>}
    {fallback&&<div className="still-projects"><span className="journal-eyebrow">SIDANT CHATURBEDI · FIELD NOTES</span><h2>View my projects.</h2><p>Research, useful tools, and experiments.</p><div>{projects.map(p=><article key={p.slug}><span>{p.kind}</span><h3>{p.demo||p.url?<a href={p.demo||p.url} target="_blank" rel="noreferrer">{p.name} ↗</a>:p.name}</h3><p>{p.description}</p><small>{p.stack.join(' · ')}</small><p>{p.status}</p>{p.url && <a href={p.url} target="_blank" rel="noreferrer">{p.linkLabel} ↗</a>}</article>)}</div><button onClick={()=>onTravel(0)}>↑ Back to the sky</button></div>}
  </section>
})
export default BookJourney

