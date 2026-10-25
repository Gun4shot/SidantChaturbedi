import assert from 'node:assert/strict'
import { test } from 'node:test'
import * as THREE from 'three'
import { cameraPosition, cameraTarget, groundHeight, joins, APPLES, NEWTON, HEAD, LANDING, appleWorld, HIT, GROUND, ZOOM } from '../src/journey-path.ts'
import { applePose } from '../src/apple-motion.ts'
function projection(p, width, height) {
  const phone = width < 700
  const camera = new THREE.PerspectiveCamera(phone ? 59 : 48, width / height, .4, 3800)
  camera.position.copy(cameraPosition(p, phone)); camera.lookAt(cameraTarget(p, phone)); camera.updateMatrixWorld()
  const project = point => {
    const world = new THREE.Vector3(point.x, point.y, point.z)
    const depth = -world.clone().applyMatrix4(camera.matrixWorldInverse).z
    const screen = world.project(camera)
    return { x: (screen.x * .5 + .5) * width, y: (-screen.y * .5 + .5) * height,
      size: (point.size ?? 1) * height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * depth), visible: depth > .01 }
  }
  return { apples: APPLES.map(project), apple: project(appleWorld(p)), head: project(HEAD), newton: project(NEWTON), landing: project(LANDING) }
}
for (const [width, height] of [[1280, 720], [390, 844]]) {
  const compact = width < 700
  test(`${width}px: continuous camera, above terrain, front-facing canopy`, () => {
    let previous = cameraPosition(0, compact), previousDirection = cameraTarget(0, compact).sub(previous).normalize()
    for (let i = 0; i <= 8000; i++) {
      const p = i / 8000, point = cameraPosition(p, compact), direction = cameraTarget(p, compact).sub(point).normalize()
      assert.ok(point.toArray().every(Number.isFinite))
      assert.ok(point.y - groundHeight(point.x, point.z) > .3, `terrain intersection ${p}`)
      assert.ok(point.distanceTo(previous) < .55, `camera jump ${p}`)
      assert.ok(direction.dot(previousDirection) > .9998, `orientation jump ${p}`)
      previous = point; previousDirection = direction
    }
    for (const boundary of joins) assert.ok(cameraPosition(boundary - 1e-7, compact).distanceTo(cameraPosition(boundary + 1e-7, compact)) < .001)
    assert.ok(Math.abs(cameraPosition(.435, compact).x + 82) < 1e-8)
    assert.deepEqual(cameraTarget(.435, compact).sub(cameraPosition(.435, compact)).normalize().toArray(), [0, 0, -1])
    assert.ok(cameraPosition(.295, compact).z > cameraPosition(.28, compact).z, 'pull back before approaching the tree')
  })
  test(`${width}px: closer fall smoothly widens for impact and stays left`, () => {
    for (let p = .555; p <= HIT; p += .001) {
      const projected = projection(p, width, height), pose = applePose(p, projected, width, height)
      assert.equal(pose.size, projected.apple.size)
      assert.ok(pose.x > width * .2 && pose.x < width * .5)
      assert.ok(pose.size < width * .2)
      assert.ok(pose.y >= projection(.555, width, height).apple.y - 1e-6, 'camera must never overtake the falling apple')
      assert.ok(pose.y + pose.size / 2 < height)
    }
    const a = projection(.60, width, height).apple, b = projection(HIT, width, height).apple
    assert.ok(a.size > b.size * 1.8, 'camera gives the falling apple a closer view')
    let previousSize = a.size
    for (let p = .755; p <= HIT; p += .001) {
      const apple = projection(p, width, height).apple
      assert.ok(apple.size <= previousSize + 1e-8, 'pullback must widen continuously')
      assert.ok(Math.abs(apple.x - a.x) < 1e-8, 'pullback preserves horizontal framing')
      previousSize = apple.size
    }
    const impact = applePose(HIT, projection(HIT, width, height), width, height)
    assert.ok(Math.abs(impact.x - impact.headX) < 1e-8)
    assert.ok(Math.abs(impact.y + impact.size * .46 - impact.headY) < 1e-8)
    assert.ok(projection(HIT + .002, width, height).apple.y < impact.y)
    assert.ok(appleWorld(.94).y > LANDING.y + APPLES[0].size, 'close-up happens in mid-air, before landing')
    for (const boundary of [.49, .555, .755, HIT, GROUND, ZOOM, .978, .995]) {
      const a = applePose(boundary - 1e-8, projection(boundary - 1e-8, width, height), width, height)
      const b = applePose(boundary + 1e-8, projection(boundary + 1e-8, width, height), width, height)
      for (const key of ['x','y','size','rotation','blur']) assert.ok(Math.abs(a[key] - b[key]) < .1, `${key} jumps at ${boundary}`)
    }
    const end = applePose(1, projection(1, width, height), width, height)
    assert.ok(end.size > width * .6 && end.size < width * 1.6, 'close-up keeps the apple recognizable')
    assert.ok(Math.abs((end.y + end.size/2-height)/end.size-.2)<1e-8, 'bottom 20% is cropped')
    assert.equal(end.blur,90)
    assert.ok(Math.abs(end.x - width / 2) < 1e-6)
  })
}
test('constant physical size, straight fall, then slow descending bounce during close-up', () => {
  for (let p = 0; p <= 1; p += .001) {
    const apple = appleWorld(p)
    assert.equal(apple.size, APPLES[0].size)
    if (p <= HIT) { assert.equal(apple.x, HEAD.x); assert.equal(apple.z, HEAD.z) }
    if (p > .556 && p < HIT) assert.ok(apple.y < appleWorld(p - .001).y)
    if (p > .843 && p < .94) assert.ok(apple.y < appleWorld(p-.001).y, 'apple is descending during the approach')
    if (p >= .94) assert.deepEqual(apple, appleWorld(.94))
  }
  const landed = appleWorld(.94), target = new THREE.Vector3(landed.x, landed.y, landed.z)
  assert.ok(cameraPosition(.97).distanceTo(target) < cameraPosition(ZOOM).distanceTo(target))
})
test('reverse scrolling retraces exactly', () => {
  const snapshots = Array.from({length:1001}, (_, i) => ({camera:cameraPosition(i/1000).toArray(),apple:appleWorld(i/1000)}))
  for(let i=1000;i>=0;i--){assert.deepEqual(cameraPosition(i/1000).toArray(),snapshots[i].camera);assert.deepEqual(appleWorld(i/1000),snapshots[i].apple)}
})




// Physical scroll distances must honor the distinction between the tree pan and fall.
test('only the ground-to-tree pan is shorter; fall duration and chapter jumps stay exact', async () => {
  const { journeyToScroll, scrollToJourney, SCROLL_TRAVEL } = await import('../src/scroll-timing.ts')
  const distance = (a, b) => (journeyToScroll(b) - journeyToScroll(a)) * SCROLL_TRAVEL
  assert.ok(Math.abs(distance(.28, .355) / (.355 - .28) - .55) < 1e-10)
  assert.ok(Math.abs(distance(.555, HIT) - (HIT - .555)) < 1e-10)
  assert.ok(Math.abs(distance(.49, .555) - (.555 - .49)) < 1e-10)
  for (let i = 0; i <= 1000; i++) assert.ok(Math.abs(scrollToJourney(journeyToScroll(i / 1000)) - i / 1000) < 1e-10)
})

test('cards unfold from zero; stem rocks, releases, and settles before landing', async () => {
  const { cardBloom, stemRelease } = await import('../src/apple-motion.ts')
  for (const timing of [[.345,.375,.485,.517],[.54,.565,.62,.642],[.632,.652,.70,.722],[.712,.732,.79,.812]]) {
    assert.equal(cardBloom(timing[0], timing), 0)
    assert.equal(cardBloom((timing[1] + timing[2]) / 2, timing), 1)
    assert.equal(cardBloom(timing[3], timing), 0)
  }
  assert.notEqual(stemRelease(.435, 0).swing, stemRelease(.435, 2).swing, 'hanging apple sways without scrolling')
  assert.ok(Math.abs(stemRelease(.55, 0).swing) > 10, 'stem must visibly lean under tension')
  assert.equal(stemRelease(.554, 0).recoil, 0, 'tether stays attached before release')
  assert.ok(stemRelease(.56, 0).recoil > 0 && stemRelease(.56, 0).fibres > .5)
  assert.equal(stemRelease(.59, 2).swing, 0, 'wind stops controlling the detached fruit')
  assert.equal(stemRelease(GROUND, 2).swing, 0, 'no erroneous post-landing shake')
  for (const p of [.505,.515,.525,.535,.54,.545,.55,.553,.555,.568,.57,.585]) {
    const a = stemRelease(p - 1e-8, 2), b = stemRelease(p + 1e-8, 2)
    for (const key of ['swing','recoil','fibres']) assert.ok(Math.abs(a[key] - b[key]) < .001)
  }
})

test('apples follow tree wind and join the original straight fall without a jump', async () => {
  const { canopyAppleWorld, fallingAppleWorld, treeWindOffset, HERO_TREE } = await import('../src/journey-path.ts')
  for (const time of [0,1,3,8]) {
    for (let i=0; i<APPLES.length; i++) {
      const a = canopyAppleWorld(i,time)
      assert.ok(Math.abs(a.x - APPLES[i].x - treeWindOffset(a.y,time)) < 1e-12)
    }
    for (const p of [.54,.555]) {
      const a=fallingAppleWorld(p-1e-8,time),b=fallingAppleWorld(p+1e-8,time)
      assert.ok(Math.hypot(a.x-b.x,a.y-b.y) < 1e-5)
    }
    for (const p of [.56,.7,HIT,GROUND,1]) assert.deepEqual(fallingAppleWorld(p,time),appleWorld(p))
    const base=groundHeight(HERO_TREE.x,HERO_TREE.z)-.25
    for(let row=0;row<=5;row++) {
      const h=row/5, y=base+h*HERO_TREE.size
      const shader=Math.sin(time*.65+h*1.2)*h*h*.018*HERO_TREE.size
      assert.ok(Math.abs(treeWindOffset(y,time)-shader)<1e-12)
    }
  }
})

test('environment changes only while fully defocused; pullback and scroll remain reversible', async () => {
  const { meadowHandoff } = await import('../src/book-motion.ts')
  for (let p=.975;p<1.025;p+=.0001) {
    const a=meadowHandoff(p), b=meadowHandoff(p+.0001)
    assert.equal(a.blur,90);assert.equal(a.reveal,0)
    assert.ok(b.blend>=a.blend)
  }
  for (const p of [.842,.94,.975,1.025,1.035,1.18,1.20]) {
    const a=meadowHandoff(p-1e-8),b=meadowHandoff(p+1e-8)
    for (const key of ['blend','reveal','blur','title','ready']) assert.ok(Math.abs(a[key]-b[key])<.001, `${key} is continuous at ${p}`)
  }
  const { journeyToScroll, scrollToJourney, JOURNEY_END, SCROLL_TRAVEL } = await import('../src/scroll-timing.ts')
  assert.equal(journeyToScroll(JOURNEY_END),1)
  for(let p=1;p<JOURNEY_END;p+=.001) assert.ok(Math.abs(scrollToJourney(journeyToScroll(p))-p)<1e-10)
  assert.ok(Math.abs((journeyToScroll(JOURNEY_END)-journeyToScroll(1))*SCROLL_TRAVEL-(JOURNEY_END-1))<1e-10)
})

test('two cameras hand over the exact same apple projection at desktop and phone sizes', async()=>{
  const {meadowCameraPose}=await import('../src/meadow-camera.ts')
  for(const [w,h] of [[1280,720],[390,844],[1920,1080],[768,1024]]){
    const phone=w<700,camera=new THREE.PerspectiveCamera(phone?59:48,w/h,.05,150)
    const {position,apple,tangent}=meadowCameraPose(.94,w/h,phone)
    camera.position.copy(position);camera.lookAt(position.clone().add(new THREE.Vector3(0,0,-100)));camera.updateMatrixWorld()
    const screen=apple.clone().project(camera),depth=-apple.clone().applyMatrix4(camera.matrixWorldInverse).z
    const old=new THREE.PerspectiveCamera(phone?59:48,w/h,.05,3800)
    old.position.copy(cameraPosition(.94,phone,w/h));old.lookAt(cameraTarget(.94,phone,w/h));old.updateMatrixWorld()
    const a=appleWorld(.94),oldScreen=new THREE.Vector3(a.x,a.y,a.z).project(old)
    const oldDepth=-new THREE.Vector3(a.x,a.y,a.z).applyMatrix4(old.matrixWorldInverse).z
    assert.ok(Math.abs(screen.x-oldScreen.x)*w<1e-8);assert.ok(Math.abs(screen.y-oldScreen.y)*h<1e-8)
    assert.ok(Math.abs(1.05*h/(2*tangent*depth)-1.05*h/(2*tangent*oldDepth))<1e-8)
  }
})

test('turning paper keeps its spine fixed and preserves each segment length', async()=>{
  const {curledPageRow}=await import('../src/book-motion.ts')
  assert.ok(Math.abs(curledPageRow(1,.5,3.05).at(-1).x+3.05)<1e-10)
  for(const row of [0,.25,.5,.75,1])for(let t=0;t<=1;t+=.01){
    const columns=curledPageRow(t,row,3.05)
    assert.deepEqual(columns[0],{x:0,z:0})
    assert.ok(columns.every(c=>Number.isFinite(c.x)&&Number.isFinite(c.z)&&c.z>=0))
    for(let i=1;i<columns.length;i++)assert.ok(Math.abs(Math.hypot(columns[i].x-columns[i-1].x,columns[i].z-columns[i-1].z)-3.05/56)<1e-10)
  }
  const top=curledPageRow(.5,0,3.05).at(-1),bottom=curledPageRow(.5,1,3.05).at(-1)
  assert.ok(Math.abs(top.x-bottom.x)>.1,'the corner leads rather than turning as one rigid rectangle')
})

test('turning sheet stays above both support pages, including the initial curl', async()=>{
  const {curledPageRow,restingPaperHeight,BOOK_WIDTH}=await import('../src/book-motion.ts')
  for(let t=0;t<=1;t+=.005)for(const row of [0,.5,1]){
    for(const point of curledPageRow(t,row,BOOK_WIDTH,80)){
      const leafZ=.093+point.z+restingPaperHeight(point.x)
      const supportZ=.085+restingPaperHeight(point.x)
      assert.ok(leafZ-supportZ>=.00799,`page artwork leaks through at ${t}`)
    }
  }
})

test('turn front/back artwork agrees with the settled spread, forwards, backwards and index jumps', async()=>{
  const {pageTurnTextures}=await import('../src/book-motion.ts')
  for(let from=0;from<9;from++)for(let to=0;to<9;to++){
    if(from===to)continue
    const m=pageTurnTextures(from,to)
    if(to>from){assert.equal(m.front,from+1);assert.equal(m.back,to);assert.equal(m.underneath,to+1)}
    else{assert.equal(m.back,from);assert.equal(m.front,to+1);assert.equal(m.underneath,to)}
  }
})

test('book opening follows a continuous reversible arc and settles with no drift', async()=>{
  const {bookOpeningPose,bookScroll}=await import('../src/book-motion.ts')
  const start=bookOpeningPose(0),end=bookOpeningPose(1)
  assert.equal(start.y,-2.1);assert.equal(start.cover,0)
  assert.equal(end.x,0);assert.equal(end.y,0);assert.equal(end.z,.7)
  assert.equal(end.cover,1);assert.equal(end.approach,1)
  let previous=start
  for(let i=1;i<=1000;i++){
    const pose=bookOpeningPose(i/1000)
    for(const key of Object.keys(pose))assert.ok(Math.abs(pose[key]-previous[key])<.015)
    previous=pose
  }
  assert.ok(bookOpeningPose(.6).z>.7,'book floats forward before settling')
  assert.deepEqual(bookScroll(1.41),{open:1,leave:0})
  assert.deepEqual(bookScroll(1.64),{open:1,leave:1})
})

test('equal page sizes stay clear of reading controls on desktop, tablet and phone', async()=>{
  const {readingLayout,BOOK_WIDTH,BOOK_HEIGHT}=await import('../src/book-motion.ts')
  for(const [w,h] of [[1280,720],[1920,1080],[841,604],[390,844],[640,360]]){
    const layout=readingLayout(w,h),compact=w<700
    assert.ok(layout.width<w)
    assert.ok(layout.top>=(compact?82:70))
    assert.ok(layout.top+layout.height<=h-(compact?154:116)+.001)
    assert.ok(Math.abs(layout.width/layout.height-(compact?1:2)*BOOK_WIDTH/BOOK_HEIGHT)<1e-10)
  }
})
import { honorsFlight, FLIGHT_START, GROVE_SETTLED } from '../src/honors-motion.ts'
import { projects } from '../src/projects.ts'
import { readFileSync } from 'node:fs'

test('scenery blends gradually across the bird flight', () => {
  for(const [w,h] of [[1280,720],[390,844]]) {
    for(let p=1.35;p<=2.14;p+=.0005) {
      const pose=honorsFlight(p,w,h)
      for(const value of Object.values(pose)) assert.ok(Number.isFinite(value))
      if(pose.blend>0&&pose.blend<1) {
        assert.ok(pose.blend>=0 && pose.blend<=1)
        assert.ok(pose.size<=w*2.051)
      }
    }
    const end=honorsFlight(2.14,w,h)
    assert.equal(end.ui,1);assert.equal(end.blend,1)
    assert.equal(end.backgroundScale,1);assert.equal(end.branchScale,1)
  }
})
test('crane camera trajectory is continuous and independent of scroll direction', () => {
  for(const [w,h] of [[1280,720],[390,844]]) {
    for(const join of [1.35,1.40,1.48,1.58,1.63,1.675,1.705,1.71,1.72,1.75,1.76,1.79,1.84,1.88,1.96,1.98,2.04]) {
      const a=honorsFlight(join-1e-7,w,h),b=honorsFlight(join+1e-7,w,h)
      for(const key of Object.keys(a)) assert.ok(Math.abs(a[key]-b[key])<Math.max(1,Math.abs(a[key]),Math.abs(b[key]))*.00002,`${join}: ${key}`)
    }
    const positions=Array.from({length:400},(_,i)=>1.35+i*.002)
    const forward=positions.map(p=>honorsFlight(p,w,h))
    const reverse=positions.toReversed().map(p=>honorsFlight(p,w,h)).toReversed()
    assert.deepEqual(forward,reverse)
  }
})
test('curated journal respects requested order, preserves games and uses verified repository links', () => {
  const inventory=JSON.parse(readFileSync(new URL('../docs/github-inventory.json',import.meta.url),'utf8').replace(/^\uFEFF/,''))
  assert.deepEqual(projects.slice(0,6).map(p=>p.slug),['solvescript','whitebook','ml-notes','khullamalpot','nidaan','meteormadness'])
  for(const slug of ['snakegame','taptapbird','tictactoe']) assert.ok(projects.some(p=>p.slug===slug))
  for(const slug of ['sentinel-1','road-graphs','himalayan-waters','futureself.id','nidaan_lite','profile-readme-generator']) assert.ok(!projects.some(p=>p.slug===slug))
  for(const project of projects) {
    const repo=inventory.find(r=>r.name===project.repo)
    assert.ok(repo,project.name)
    assert.equal(project.url.toLowerCase(),repo.html_url.toLowerCase())
  }
  assert.equal(new Set(projects.map(p=>p.slug)).size,projects.length)
})

test('bird leaves the upper-left corner, turns, and keeps travelling right through the lens', async () => {
  const {readingLayout}=await import('../src/book-motion.ts')
  for(const [w,h] of [[1280,720],[390,844]]){
    const layout=readingLayout(w,h),start=honorsFlight(1.48,w,h)
    assert.ok(start.x<layout.centerX-layout.width*.4)
    assert.ok(start.y<layout.top+layout.height*.1)
    assert.ok(honorsFlight(1.52,w,h).x<start.x)
    for(let p=1.65;p<GROVE_SETTLED-.005;p+=.002){
      const a=honorsFlight(p,w,h),b=honorsFlight(p+.001,w,h)
      assert.ok(b.x>a.x,'no stop or backward travel across the lens')
    }
    const peak=FLIGHT_START+(GROVE_SETTLED-FLIGHT_START)*.61
    assert.ok(honorsFlight(peak-.005,w,h).size<honorsFlight(peak,w,h).size)
    assert.ok(honorsFlight(peak+.005,w,h).size<honorsFlight(peak,w,h).size)
    assert.ok(honorsFlight(2.04,w,h).x>w)
  }
})

test('bird passage stays sharp and crosses its close-up within a short scroll span', () => {
  for(const [w,h] of [[1280,720],[390,844]]) {
    let blendSpan=0
    for(let p=FLIGHT_START;p<GROVE_SETTLED;p+=.0001) {
      const pose=honorsFlight(p,w,h)
      assert.ok(!Object.hasOwn(pose,'blur')); assert.ok(!Object.hasOwn(pose,'paper'))
      assert.ok(pose.size<=w*2.051)
      if(pose.blend>.01 && pose.blend<.99) blendSpan+=.0001
    }
    assert.ok(blendSpan>.1,'scenery changes over a broad continuous scroll span')
    assert.equal(honorsFlight(GROVE_SETTLED,w,h).ui,1)
  }
})



import { publicationMotion, LIBRARY_START, LIBRARY_END } from '../src/publication-motion.ts'
import { publications } from '../src/publications.ts'
test('library fall is continuous, reversible, and keeps the medal aligned with its desk surface',()=>{
  for(const [w,h] of [[1280,720],[390,844]]){
    const anchor={x:w*.55,y:h*.55,size:80}
    const start=publicationMotion(LIBRARY_START,w,h,anchor)
    assert.equal(start.x,anchor.x);assert.equal(start.y,anchor.y);assert.equal(start.size,anchor.size)
    assert.equal(start.release,0);assert.equal(start.blend,0)
    const finish=publicationMotion(LIBRARY_END,w,h,anchor)
    assert.equal(finish.blend,1);assert.equal(finish.ui,1);assert.equal(finish.blur,0)
    assert.ok(Math.abs(finish.y+finish.size*(.36/.74)*finish.scaleY-finish.tableY)<1e-8)
    assert.equal(finish.deskScale,1)
    for(const t of [0,.04,.08,.15,.34,.37,.40,.59,.60,.64,.68,.70,.76,.78,.80,.82,.86,.87,.90,.91,.96,.98,1]){
      const p=LIBRARY_START+t*(LIBRARY_END-LIBRARY_START)
      const a=publicationMotion(p-1e-8,w,h,anchor),b=publicationMotion(p+1e-8,w,h,anchor)
      for(const key of Object.keys(a))assert.ok(Math.abs(a[key]-b[key])<.01,`${t}: ${key}`)
    }
    const positions=Array.from({length:100},(_,i)=>LIBRARY_START+i*.006)
    assert.deepEqual(positions.map(p=>publicationMotion(p,w,h,anchor)),positions.toReversed().map(p=>publicationMotion(p,w,h,anchor)).toReversed())
  }
})
test('library distinguishes publication, submission and ongoing work and keeps public resource links',()=>{
  assert.match(publications[0].status,/Published/)
  assert.ok(publications[0].links.some(l=>l.url==='https://doi.org/10.1080/19475705.2026.2719295'))
  assert.equal(publications[0].figure,'/art/sentinel-road-vulnerability-figure.png')
  assert.match(publications[1].status,/Submitted/);assert.match(publications[2].status,/Ongoing/)
  assert.equal(publications[1].links.length,0);assert.equal(publications[2].links.length,0)
})
