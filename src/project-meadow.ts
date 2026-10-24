import * as THREE from 'three'
import { curledPageRow, smooth, bookScroll, readingLayout, bookOpeningPose, restingPaperHeight, pageTurnTextures, BOOK_WIDTH, BOOK_HEIGHT } from './book-motion'
import { meadowCameraPose } from './meadow-camera'
import { projects, projectArtwork } from './projects'
import type { ProjectedCutout } from './apple-motion'

const W = BOOK_WIDTH, H = BOOK_HEIGHT, SEGMENTS = 80, ROWS = 28
const art = '/art/'
const illustrations = projectArtwork
export type MeadowEngine = {
  update(p: number, time: number): ProjectedCutout
  turn(direction: number): void; select(index:number): void; dispose(): void
}
type Events = { state(open: boolean, page: number, busy: boolean): void; failed(): void }
const image = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = art+url
})

export async function createProjectMeadow(host: HTMLElement, events: Events): Promise<MeadowEngine> {
  const urls = [...new Set(['project-flowers-v2.png', 'project-butterfly-v2.png', 'journal-cover-v2.png', ...illustrations])]
  const loaded = await Promise.all(urls.map(image))
  const images = Object.fromEntries(urls.map((url, i) => [url, loaded[i]]))
  await document.fonts.ready
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
  // Supersample even a 1x display: small printed type needs more than one
  // framebuffer sample per CSS pixel during curved/perspective motion.
  renderer.setPixelRatio(Math.min(Math.max(devicePixelRatio,1.75),2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0, 0)
  host.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const scenery = new THREE.Scene()
  const sceneryCamera = new THREE.PerspectiveCamera(48,1,.05,150)
  const camera = new THREE.PerspectiveCamera(48, 1, .05, 150)
  scene.add(new THREE.AmbientLight('#ffffff', 1.3))
  const sun = new THREE.DirectionalLight('#fffaf0', 1.4); sun.position.set(-5, 9, 12); scene.add(sun)
  const fill = new THREE.DirectionalLight('#e4f1ff', .45); fill.position.set(6, 2, 6); scene.add(fill)
  const textures: THREE.Texture[] = []
  const texture = (source: HTMLImageElement | HTMLCanvasElement) => {
    const t = source instanceof HTMLCanvasElement ? new THREE.CanvasTexture(source) : new THREE.Texture(source)
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); t.needsUpdate = true; textures.push(t); return t
  }
  const wrap = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, line: number) => {
    let row = ''
    for (const word of text.split(' ')) {
      if (ctx.measureText(row+word).width > width && row) { ctx.fillText(row.trim(), x, y); row=''; y+=line }
      row += word+' '
    }
    ctx.fillText(row.trim(),x,y); return y+line
  }
  const paperTexture = (index: number) => {
    const canvas = document.createElement('canvas'); canvas.width=2160; canvas.height=2400
    const c = canvas.getContext('2d')!
    c.scale(1.5,1.5)
    c.fillStyle='#fcfaf3'; c.fillRect(0,0,1440,1600)
    const edge=c.createLinearGradient(0,0,1440,0);edge.addColorStop(0,'#85765a26');edge.addColorStop(.055,'#fffdf500');edge.addColorStop(.94,'#fffdf500');edge.addColorStop(1,'#85765a16');c.fillStyle=edge;c.fillRect(0,0,1440,1600)
    for(let i=0;i<5000;i++){c.fillStyle=`rgba(126,94,48,${.012+(i%5)*.004})`;c.fillRect((i*193.31)%1440,(i*127.57)%1600,1.5,1.5)}
    c.fillStyle='#49584d';c.font='600 32px "DM Sans", sans-serif';c.fillText(index<0?'THE PROJECT JOURNAL':`FIELD NOTE ${String(index+1).padStart(2,'0')}  /  ${projects[index].kind}`,130,145)
    c.fillStyle='#b6a579';c.fillRect(130,190,1180,2)
    if(index<0){
      c.fillStyle='#b69b54';c.font='100px Georgia';c.fillText('✳',130,370)
      c.fillStyle='#243c30';c.font='bold 136px Georgia';c.fillText('View my',122,590);c.fillText('projects.',122,750)
      c.fillStyle='#3c4b42';c.font='46px "DM Sans", sans-serif';wrap(c,'A collection of small experiments, thoughtful tools, and things made with curiosity.',130,890,1050,66)
      c.fillStyle='#b6a579';c.fillRect(130,1180,90,3)
      c.fillStyle='#293f31';c.font='500 40px "DM Sans", sans-serif';c.fillText('Sidant Chaturbedi',130,1295)
      c.fillStyle='#4e5d50';c.font='32px "DM Sans", sans-serif';c.fillText('COMPUTER SCIENCE & MACHINE LEARNING',130,1352)
      c.font='30px "DM Sans", sans-serif';c.fillText(`${String(projects.length).padStart(2,'0')} PROJECTS  /  RESEARCH & EXPLORATION`,130,1480)
    } else {
      const p=projects[index]
      let titleSize=80;c.font=`bold ${titleSize}px Georgia`;while(c.measureText(p.name).width>1180&&titleSize>40){titleSize-=2;c.font=`bold ${titleSize}px Georgia`}c.fillStyle='#243c30';c.fillText(p.name,125,320)
      const img=images[illustrations[index]], x=130,y=380,w=1180,h=610
      c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.fillStyle='#d9e5cb';c.fillRect(x,y,w,h)
      const scale=Math.max(w/img.width,h/img.height);c.drawImage(img,x+(w-img.width*scale)/2,y+(h-img.height*scale)/2,img.width*scale,img.height*scale);c.restore()
      const summary=p.description.split(/(?<=[.!?])\s/)[0]
      c.font='52px "DM Sans", sans-serif';c.fillStyle='#3d4c3e';wrap(c,summary,130,1090,1180,68)
      c.fillStyle='#4e5d50';c.font='34px "DM Sans", sans-serif';c.fillText(p.stack.join('   /   '),130,1400)
      c.font='30px "DM Sans", sans-serif';c.fillText(p.status,130,1480)
    }
    c.textAlign='right';c.font='28px "DM Sans", sans-serif';c.fillStyle='#8c917b';c.fillText(String(index+2).padStart(2,'0'),1310,1480)
    const map=texture(canvas)
    // Mip-level blending softened small text even when the page was stationary.
    map.generateMipmaps=false;map.minFilter=THREE.LinearFilter
    return map
  }
  const pageCache = new Map<number,THREE.Texture>()
  const getPage = (index:number) => {
    let map=pageCache.get(index)
    if(!map){map=paperTexture(index-1);pageCache.set(index,map)}
    return map
  }
  const prunePages=(keep:number[])=>{
    for(const [index,map] of pageCache){if(!keep.includes(index)){map.dispose();pageCache.delete(index);const at=textures.indexOf(map);if(at>=0)textures.splice(at,1)}}
  }
  const coverCanvas=document.createElement('canvas');coverCanvas.width=1024;coverCanvas.height=1392
  const cc=coverCanvas.getContext('2d')!;cc.drawImage(images['journal-cover-v2.png'],0,0,1024,1392)
  cc.textAlign='center';cc.fillStyle='#e8d49a';cc.font='bold 66px Georgia';cc.fillText('FIELD NOTES',512,905)
  cc.font='23px "DM Sans", sans-serif';cc.fillText('SIDANT CHATURBEDI',512,972);cc.fillText('IDEAS WORTH EXPLORING',512,1078)
  const coverMap=texture(coverCanvas)
  const book = new THREE.Group();scene.add(book)
  const coverMaterial=new THREE.MeshStandardMaterial({map:coverMap,roughness:.94,metalness:0})
  const coverEdge=new THREE.MeshStandardMaterial({color:'#526d53',roughness:1})
  const box=(w:number,h:number,d:number,material:THREE.Material|THREE.Material[])=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material)
  function roundedShape(w:number,h:number,r:number){
    const s=new THREE.Shape(),x=-w/2,y=-h/2
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s
  }
  function cover(){
    const g=new THREE.Group(),w=W+.12,h=H+.16,d=.095,shape=roundedShape(w,h,.075)
    const body=new THREE.ExtrudeGeometry(shape,{depth:d-.028,bevelEnabled:true,bevelSize:.022,bevelThickness:.014,bevelSegments:3,steps:1,curveSegments:10});body.translate(0,0,-d/2+.014)
    g.add(new THREE.Mesh(body,coverEdge))
    const faceGeometry=new THREE.ShapeGeometry(shape,14),pos=faceGeometry.attributes.position,uv=faceGeometry.attributes.uv
    for(let i=0;i<pos.count;i++)uv.setXY(i,pos.getX(i)/w+.5,pos.getY(i)/h+.5)
    const face=new THREE.Mesh(faceGeometry,coverMaterial);face.position.z=d/2+.001;g.add(face)
    const lining=new THREE.Mesh(faceGeometry.clone(),new THREE.MeshStandardMaterial({color:'#e9dfc0',roughness:.97}));lining.rotation.y=Math.PI;lining.position.z=-d/2-.001;g.add(lining)
    return g
  }
  const back=cover();back.position.set(W/2,0,-.22);book.add(back)
  const paperBlock=box(W-.035,H-.025,.23,new THREE.MeshStandardMaterial({color:'#eee9dc',roughness:1}));paperBlock.position.set(W/2,0,-.055);book.add(paperBlock)
  const frontPivot=new THREE.Group();frontPivot.position.z=.19;book.add(frontPivot)
  const front=cover();front.position.set(W/2,0,0);frontPivot.add(front)
  const spine=box(.035,H-.06,.38,new THREE.MeshStandardMaterial({color:'#61725b',roughness:1}));spine.position.set(-.017,0,-.16);book.add(spine)
  // Individual page edges catch light around the solid paper block.
  const edgeMat=new THREE.MeshBasicMaterial({color:'#b5a17b',transparent:true,opacity:.28})
  for(let i=0;i<19;i++){
    const z=-.16+i*.011
    const bottom=box(W-.02,.006,.002,edgeMat);bottom.position.set(W/2,-H/2-.005,z);book.add(bottom)
    const side=box(.006,H-.03,.002,edgeMat);side.position.set(W-.012,0,z);book.add(side)
  }
  // The paper keeps its original ivory and ink colors; lighting comes from its
  // subtle gutter texture and the moving fold's vertex shading, not a yellow wash.
  const pageMat=(map:THREE.Texture,side:THREE.Side=THREE.FrontSide)=>new THREE.MeshBasicMaterial({map,side})
  const rightMaterial=pageMat(getPage(1)), leftMaterial=pageMat(getPage(0))
  const restingPage=(sign:number)=>{
    const geo=new THREE.PlaneGeometry(W,H,32,12),pos=geo.attributes.position
    for(let i=0;i<pos.count;i++){const x=pos.getX(i)/W+.5;const fromSpine=sign>0?x:1-x;pos.setZ(i,restingPaperHeight(fromSpine*W))}
    pos.needsUpdate=true;geo.computeVertexNormals();return geo
  }
  const right=new THREE.Mesh(restingPage(1),rightMaterial);right.position.set(W/2,0,.085);book.add(right)
  const left=new THREE.Mesh(restingPage(-1),leftMaterial);left.position.set(W/2,0,-.305);left.rotation.y=Math.PI;frontPivot.add(left)
  const leftBlock=box(W-.035,H-.025,.23,new THREE.MeshStandardMaterial({color:'#eee9dc',roughness:1}));leftBlock.position.set(W/2,0,-.165);frontPivot.add(leftBlock)
  const leafGeometry=new THREE.PlaneGeometry(W,H,SEGMENTS,ROWS)
  leafGeometry.translate(W/2,0,0)
  const leafFrontMaterial=pageMat(getPage(1)),leafBackMaterial=pageMat(getPage(1),THREE.BackSide)
  const leafBackGeometry=leafGeometry.clone()
  for(const geo of [leafGeometry,leafBackGeometry])geo.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count*3).fill(1),3))
  leafFrontMaterial.vertexColors=true;leafBackMaterial.vertexColors=true
  const uv=leafBackGeometry.attributes.uv
  for(let i=0;i<uv.count;i++) uv.setX(i,1-uv.getX(i))
  const leafFront=new THREE.Mesh(leafGeometry,leafFrontMaterial),leafBack=new THREE.Mesh(leafBackGeometry,leafBackMaterial)
  const leaf=new THREE.Group();leaf.add(leafFront,leafBack);leaf.position.z=.093;leaf.visible=false;book.add(leaf)
  const shadeCanvas=document.createElement('canvas');shadeCanvas.width=256;shadeCanvas.height=16
  const shadeCtx=shadeCanvas.getContext('2d')!,shadeGradient=shadeCtx.createLinearGradient(0,0,256,0)
  shadeGradient.addColorStop(0,'#43341b00');shadeGradient.addColorStop(.35,'#43341b66');shadeGradient.addColorStop(1,'#43341b00');shadeCtx.fillStyle=shadeGradient;shadeCtx.fillRect(0,0,256,16)
  const turningShade=new THREE.Mesh(new THREE.PlaneGeometry(W,H),new THREE.MeshBasicMaterial({map:texture(shadeCanvas),transparent:true,depthWrite:false,opacity:0}));turningShade.position.set(W/2,0,.135);book.add(turningShade)
  const bend=(t:number)=>{
    const rows=Array.from({length:ROWS+1},(_,row)=>curledPageRow(t,row/ROWS,W,SEGMENTS))
    for(const geo of [leafGeometry,leafBackGeometry]){
      const pos=geo.attributes.position
      for(let i=0;i<pos.count;i++){
        const column=i%(SEGMENTS+1),c=rows[Math.floor(i/(SEGMENTS+1))][column]
        // Sample the support surface at the CURRENT horizontal position. Fading
        // out the original curvature made the sheet sink through the next page.
        pos.setX(i,c.x);pos.setZ(i,c.z+restingPaperHeight(c.x))
      }
      pos.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere()
      const normals=geo.attributes.normal,colors=geo.attributes.color
      for(let i=0;i<pos.count;i++){const light=.80+.20*Math.abs(normals.getZ(i));colors.setXYZ(i,light,light,light)}
      colors.needsUpdate=true
    }
  }
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=256;shadowCanvas.height=128
  const sc=shadowCanvas.getContext('2d')!,gradient=sc.createRadialGradient(128,64,4,128,64,120);gradient.addColorStop(0,'#30432899');gradient.addColorStop(1,'#30432800');sc.fillStyle=gradient;sc.fillRect(0,0,256,128)
  const shadowMap=texture(shadowCanvas)
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(4.7,1.3),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false}));shadow.position.set(0,-2.65,.4);scene.add(shadow)
  const fruitShadow=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.28),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false,opacity:.7}));fruitShadow.position.set(-3,-2.55,2.01);scene.add(fruitShadow)
  const flowerMap=texture(images['project-flowers-v2.png'])
  const flowers:THREE.Group[]=[]
  for(const [x,y,z,size] of [[-5,-3.5,2.4,3.1],[5.4,-3.7,3.2,3.6],[-3.8,-2.3,-.9,1.8],[3.9,-2.3,-1.8,1.5],[-6.8,-2.5,-3,2.1],[6.6,-2.8,-2.5,2.4],[-1.8,-3.5,3.8,1.4],[2.7,-3.5,4,1.6]]){
    const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(size)
    const f=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:flowerMap,transparent:true,alphaTest:.015,depthWrite:false,side:THREE.DoubleSide}));f.position.y=.5;g.add(f);scenery.add(g);flowers.push(g)
  }
  const butterflyMap=texture(images['project-butterfly-v2.png'])
  const butterflies: {g:THREE.Group; wings:THREE.Mesh[]}[]=[]
  for(let i=0;i<6;i++){
    const g=new THREE.Group(),wings:THREE.Mesh[]=[]
    for(const sign of [-1,1]){
      const geo=new THREE.PlaneGeometry(.5,1);geo.translate(sign*.25,0,0)
      const uv=geo.attributes.uv;for(let n=0;n<uv.count;n++)uv.setX(n,uv.getX(n)*.5+(sign>0?.5:0))
      const wing=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:butterflyMap,transparent:true,alphaTest:.03,side:THREE.DoubleSide,depthWrite:false}));g.add(wing);wings.push(wing)
    }
    g.scale.setScalar(.28+i%3*.1);scenery.add(g);butterflies.push({g,wings})
  }
  const sparkCanvas=document.createElement('canvas');sparkCanvas.width=64;sparkCanvas.height=64
  const sparkCtx=sparkCanvas.getContext('2d')!,sparkGlow=sparkCtx.createRadialGradient(32,32,1,32,32,31)
  sparkGlow.addColorStop(0,'#fffef9');sparkGlow.addColorStop(.14,'#fff1b4dd');sparkGlow.addColorStop(1,'#f9d77c00');sparkCtx.fillStyle=sparkGlow;sparkCtx.fillRect(0,0,64,64)
  sparkCtx.fillStyle='#fffce8';sparkCtx.beginPath();sparkCtx.moveTo(32,5);sparkCtx.lineTo(36,28);sparkCtx.lineTo(58,32);sparkCtx.lineTo(36,36);sparkCtx.lineTo(32,59);sparkCtx.lineTo(28,36);sparkCtx.lineTo(6,32);sparkCtx.lineTo(28,28);sparkCtx.closePath();sparkCtx.fill()
  const sparkGeometry=new THREE.BufferGeometry();sparkGeometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(72*3),3))
  const sparkMaterial=new THREE.PointsMaterial({map:texture(sparkCanvas),color:'#ffedb0',size:.15,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})
  const sparks=new THREE.Points(sparkGeometry,sparkMaterial);book.add(sparks)
  let width=0,height=0,openTarget=false,opening=0,page=0,turn: {from:number;to:number;t:number;direction:number}|null=null
  let last=performance.now(),progress=0,disposed=false,lastBusy=false,queuedDirection=0
  const resize=()=>{width=host.clientWidth||innerWidth;height=host.clientHeight||innerHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.fov=width<700?59:48;camera.updateProjectionMatrix();sceneryCamera.copy(camera);sceneryCamera.position.set(0,0,width<700?13.8:10.8);sceneryCamera.lookAt(0,0,0);sceneryCamera.updateMatrixWorld()}
  resize();window.addEventListener('resize',resize)
  const emit=()=>events.state(openTarget,page,!!turn)
  const selectPage=(next:number)=>{
    if(!openTarget||opening<.995||turn)return
    if(next<0||next>=projects.length||next===page)return
    const maps=pageTurnTextures(page,next),direction=maps.direction
    turn={from:page,to:next,t:0,direction};leaf.visible=true
    leafFrontMaterial.map=getPage(maps.front);leafBackMaterial.map=getPage(maps.back)
    if(direction>0)rightMaterial.map=getPage(maps.underneath)
    else leftMaterial.map=getPage(maps.underneath)
    prunePages([page,page+1,maps.front,maps.back,maps.underneath])
    bend(direction>0?0:1);emit()
  }
  const turnPage=(direction:number)=>{if(turn){queuedDirection=Math.sign(direction);return}selectPage(page+Math.sign(direction))}
  let gesture:{x:number;y:number}|null=null
  const down=(event:PointerEvent)=>{gesture={x:event.clientX,y:event.clientY}}
  const cancel=()=>{gesture=null}
  const click=(event:PointerEvent)=>{
    const start=gesture;gesture=null
    if(progress<1.17)return
    if(openTarget){
      if(start&&Math.abs(event.clientX-start.x)>45&&Math.abs(event.clientX-start.x)>Math.abs(event.clientY-start.y)*1.3)turnPage(event.clientX<start.x?1:-1)
      return
    }
  }
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',click);renderer.domElement.addEventListener('pointercancel',cancel)
  const lost=(event:Event)=>{event.preventDefault();events.failed()};renderer.domElement.addEventListener('webglcontextlost',lost)
  const update=(p:number,time:number):ProjectedCutout=>{
    progress=p
    const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now
    const scroll=bookScroll(p),wasOpen=openTarget
    opening=scroll.open;openTarget=opening>.995&&scroll.leave<.005
    if(!openTarget&&turn){
      turn=null;queuedDirection=0;leaf.visible=false
      rightMaterial.map=getPage(page+1);leftMaterial.map=getPage(page===0?0:page)
      ;(turningShade.material as THREE.MeshBasicMaterial).opacity=0
    }
    if(wasOpen!==openTarget)emit()
    const pose=bookOpeningPose(opening),{lift,cover:unfold,approach:advance}=pose
    frontPivot.rotation.y=-Math.PI*unfold
    frontPivot.position.z=THREE.MathUtils.lerp(.19,-.22,unfold)
    book.position.set(pose.x,pose.y,pose.z)
    book.rotation.set(pose.pitch,pose.yaw,pose.roll)
    if(!openTarget&&opening===0){book.position.y+=Math.sin(time*.65)*.025;book.rotation.z+=Math.sin(time*.4)*.006}
    ;(shadow.material as THREE.MeshBasicMaterial).opacity=1-lift*.7;shadow.scale.setScalar(1+lift*.4)
    if(turn){
      turn.t=Math.min(1,turn.t+dt/1.15);const t=smooth(0,1,turn.t),phase=turn.direction>0?t:1-t;bend(phase)
      turningShade.position.x=(phase<.5?1:-1)*W/2;turningShade.position.z=.124
      ;(turningShade.material as THREE.MeshBasicMaterial).opacity=Math.sin(Math.PI*t)*.45
      if(turn.t===1){page=turn.to;rightMaterial.map=getPage(page+1);leftMaterial.map=getPage(page===0?0:page);turn=null;leaf.visible=false;(turningShade.material as THREE.MeshBasicMaterial).opacity=0;emit();const queued=queuedDirection;queuedDirection=0;if(queued)selectPage(page+queued)}
    }
    const busy=!!turn;if(busy!==lastBusy){lastBusy=busy;emit()}
    const sparkPositions=sparkGeometry.attributes.position
    for(let i=0;i<72;i++){
      const angle=i*2.399+time*.11,rad=.3+opening*(3.2+(i%7)*.23)
      sparkPositions.setXYZ(i,Math.cos(angle)*rad,Math.sin(angle)*rad*.7+(opening-.3)*.5,.3+Math.sin(i+time*.5)*.18)
    }
    sparkPositions.needsUpdate=true;sparkMaterial.opacity=Math.sin(Math.PI*opening)*.9;sparks.visible=opening>.001&&opening<.999
    flowers.forEach((g,i)=>{g.rotation.z=Math.sin(time*.65+i*.8)*.025;g.rotation.y=Math.sin(time*.4+i)*.04})
    butterflies.forEach(({g,wings},i)=>{
      const t=time*.32+i*2.1,z=1+Math.sin(t*.7)*.35,depth=sceneryCamera.position.z-z
      const halfH=Math.tan(THREE.MathUtils.degToRad(sceneryCamera.fov/2))*depth,halfW=halfH*sceneryCamera.aspect
      // Screen-space lanes stay beyond the book's full silhouette at every viewport.
      const x=(i%2?1:-1)*halfW*(width<700?.96+Math.sin(t)*.012:.89+Math.sin(t)*.025)
      g.position.set(x,Math.cos(t*.8+i)*halfH*.72,z);g.rotation.z=Math.sin(t)*.3;wings[0].rotation.y=Math.sin(time*9+i)*1.0;wings[1].rotation.y=-wings[0].rotation.y
    })
    const {apple,position,tangent}=meadowCameraPose(p,camera.aspect,width<700)
    camera.position.copy(position)
    const mobile=width<700
    const layout=readingLayout(width,height),fit=H*height/(2*tangent*layout.height)
    const reading=new THREE.Vector3(mobile?W/2:0,(layout.centerY/height-.5)*2*tangent*fit,.785+fit)
    camera.position.lerp(reading,advance)
    // Give the opening cover breathing room before the camera settles into
    // its exact reading position; the nearer left edge never rushes past it.
    camera.position.z+=pose.clearance
    const flight=smooth(1.48,1.70,p)
    camera.position.z-=flight*fit*.25
    camera.position.x+=flight*.7
    camera.position.y+=flight*.35
    // The fruit rolls into the flowers as the book rises, keeping the reading area clear.
    apple.x-=3*smooth(1.22,1.34,p)
    camera.lookAt(camera.position.x,camera.position.y,camera.position.z-100);camera.updateMatrixWorld()
    if(p>=.94&&p<1.86){renderer.autoClear=true;renderer.render(scenery,sceneryCamera);renderer.autoClear=false;renderer.clearDepth();renderer.render(scene,camera)}
    const depth=apple.clone().applyMatrix4(camera.matrixWorldInverse).z*-1,screen=apple.clone().project(camera)
    if(import.meta.env.DEV)renderer.domElement.dataset.book=JSON.stringify({progress:+p.toFixed(4),opening:+opening.toFixed(3),page,turn:turn?.t??null,drawCalls:renderer.info.render.calls})
    return {x:(screen.x*.5+.5)*width,y:(-.5*screen.y+.5)*height,size:1.05*height/(2*tangent*Math.max(.01,depth)),visible:depth>.01}
  }
  return {update,turn:turnPage,select:selectPage,dispose(){
    if(disposed)return;disposed=true;window.removeEventListener('resize',resize);renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerup',click);renderer.domElement.removeEventListener('pointercancel',cancel);renderer.domElement.removeEventListener('webglcontextlost',lost)
    for(const s of [scene,scenery])s.traverse(obj=>{if(obj instanceof THREE.Mesh||obj instanceof THREE.Points){obj.geometry.dispose();(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>m.dispose())}});textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove()
  }}
}
