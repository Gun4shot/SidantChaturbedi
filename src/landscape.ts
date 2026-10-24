import * as THREE from 'three'
import { scrollToJourney } from './scroll-timing'
import { cameraPosition, cameraTarget, groundHeight, HERO_TREE, riverCenter, riverWidth, smooth, APPLES, NEWTON, LANDING, HEAD, canopyAppleWorld, fallingAppleWorld, appleStemAnchor } from './journey-path'
import type { CollageProjection } from './apple-motion'

export interface Landscape {
  dispose(): void
  setPaused(paused: boolean): void
  setUltra(ultra: boolean): void
}
interface Options {
  onLoad(value: number): void
  onProgress(value: number): void
  onCollageFrame?(value: number, projection: CollageProjection, ambientTime: number): void
  onError(): void
}

const clamp = THREE.MathUtils.clamp
const mix = THREE.MathUtils.lerp
const noiseGLSL = `
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){return .55*noise(p)+.27*noise(p*2.03)+.12*noise(p*4.13)+.06*noise(p*8.21);}
`

function seededRandom(seed = 1201) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

export async function createLandscape(host: HTMLDivElement, options: Options): Promise<Landscape> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0xa5d3df)
  renderer.domElement.setAttribute('aria-label', 'A continuous painted landscape, from the sky to a riverside meadow')
  host.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xb2d1c4, 260, 1350)
  const camera = new THREE.PerspectiveCamera(48, 1, 0.4, 3800)
  const textures: THREE.Texture[] = []
  let disposed = false
  let paused = false
  let ultra = false
  let targetProgress = 0
  let progress = 0
  let ambientTime = 0
  let lastTime = performance.now()
  let emittedProgress = -1
  let frames = 0
  let averageFrame = 16
  const random = seededRandom()
  const timeUniform = { value: 0 }
  const windMaterials: THREE.MeshBasicMaterial[] = []
  const mobile = () => innerWidth < 700

  const resize = () => {
    const ratio = ultra ? Math.min(devicePixelRatio * 1.5, 3) : Math.min(devicePixelRatio, mobile() ? 1.75 : 2)
    renderer.setPixelRatio(ratio)
    renderer.setSize(innerWidth, innerHeight)
    camera.aspect = innerWidth / innerHeight
    camera.fov = mobile() ? 59 : 48
    camera.updateProjectionMatrix()
    onScroll()
  }
  const onScroll = () => { targetProgress = scrollToJourney(clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight), 0, 1)) }

  const cleanup = () => {
    disposed = true
    renderer.setAnimationLoop(null)
    window.removeEventListener('resize', resize)
    window.removeEventListener('scroll', onScroll)
    document.removeEventListener('visibilitychange', onVisibility)
    renderer.domElement.removeEventListener('webglcontextlost', onLost)
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
        geometries.add(object.geometry)
        const mats = Array.isArray(object.material) ? object.material : [object.material]
        mats.forEach((material) => materials.add(material))
      }
    })
    geometries.forEach((geometry) => geometry.dispose())
    materials.forEach((material) => material.dispose())
    textures.forEach((texture) => texture.dispose())
    renderer.dispose()
    renderer.domElement.remove()
  }
  const onLost = (event: Event) => { event.preventDefault(); renderer.setAnimationLoop(null); options.onError() }
  const onVisibility = () => { lastTime = performance.now() }

  try {
    const loader = new THREE.TextureLoader()
    let loaded = 0
    const urls = ['mountains.png', 'cloud.png', 'meadow-grasses.png', 'tree.png', 'ground-texture.png']
    // All assets load before the first scene frame. No mid-flight texture swaps.
    const collageReady = Promise.all(['apple-collage.png', 'newton-collage.png', 'project-meadow-v2.png'].map(url => new Promise<void>((resolve, reject) => {
      const image = new Image(); image.onload = () => image.decode().then(resolve, reject); image.onerror = reject; image.src = `/art/${url}`
    })))
    const maps = await Promise.all(urls.map(async (url) => {
      const texture = await loader.loadAsync(`/art/${url}`)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      textures.push(texture)
      options.onLoad(++loaded / urls.length * 0.85)
      return texture
    }))
    const [mountainMap, cloudMap, grassMap, treeMap, groundMap] = maps
    await collageReady
    groundMap.wrapS = groundMap.wrapT = THREE.RepeatWrapping

    const sky = new THREE.Mesh(new THREE.SphereGeometry(3000, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: { top: { value: new THREE.Color('#4b97ca') }, horizon: { value: new THREE.Color('#c6e0d9') } },
      vertexShader: 'varying vec3 vPosition;void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: `varying vec3 vPosition;uniform vec3 top;uniform vec3 horizon;${noiseGLSL}
        void main(){float h=normalize(vPosition).y;vec3 c=mix(horizon,top,pow(smoothstep(-.08,.65,h),.65));c+=(noise(vPosition.xz*.025)-.5)*.008;gl_FragColor=vec4(c,1.);
        #include <colorspace_fragment>
        }`,
    }))
    scene.add(sky)

    const mountainAspect = mountainMap.image.width / mountainMap.image.height
    const mountain = new THREE.Mesh(new THREE.PlaneGeometry(3100, 3100 / mountainAspect), new THREE.MeshBasicMaterial({ map: mountainMap, transparent: true, depthWrite: false, fog: false, color: '#cbe3e7' }))
    mountain.position.set(-110, -460 + 1550 / mountainAspect, -1550)
    mountain.renderOrder = -4
    scene.add(mountain)

    // Continuous terrain, with a recessed riverbed. Nothing is a full-screen background transition.
    const terrainGeo = new THREE.PlaneGeometry(1900, 1900, 256, 256)
    terrainGeo.rotateX(-Math.PI / 2)
    const terrainPos = terrainGeo.attributes.position
    for (let i = 0; i < terrainPos.count; i++) {
      const x = terrainPos.getX(i), z = terrainPos.getZ(i) - 650
      terrainPos.setXYZ(i, x, groundHeight(x, z), z)
    }
    terrainGeo.computeVertexNormals()
    const terrainMaterial = new THREE.ShaderMaterial({
      uniforms: { groundMap: { value: groundMap }, fogColor: { value: new THREE.Color('#b2d1c4') }, sun: { value: new THREE.Vector3(-0.5, 0.85, 0.2).normalize() } },
      vertexShader: `varying vec3 vWorld;varying vec3 vNormal;varying float vDepth;void main(){vec4 w=modelMatrix*vec4(position,1.);vWorld=w.xyz;vNormal=normalize(mat3(modelMatrix)*normal);vec4 mv=viewMatrix*w;vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `${noiseGLSL}varying vec3 vWorld;varying vec3 vNormal;varying float vDepth;uniform vec3 fogColor;uniform vec3 sun;uniform sampler2D groundMap;
      void main(){vec2 p=vWorld.xz;float n=fbm(p*.027);float field=fbm(p*vec2(.008,.021)+vec2(42.));float brush=fbm(p*vec2(.44,.13));
      vec3 dark=vec3(.12,.235,.075), light=vec3(.41,.50,.17), straw=vec3(.57,.59,.25);
      vec3 c=mix(dark,light,smoothstep(.18,.8,n));c=mix(c,straw,smoothstep(.43,.82,field)*.52);c+=vec3(.045,.045,.016)*(brush-.4);
      vec3 painted=texture2D(groundMap,p*.085).rgb;vec3 painted2=texture2D(groundMap,mat2(.8,-.6,.6,.8)*p*.039+vec2(.31,.17)).rgb;
      painted=mix(painted,painted2,.3);c=mix(c,painted*(.82+n*.4),.62);
      float blades=noise(p*vec2(11.,3.5));c+=vec3(.025,.03,.008)*(blades-.5)*(1.-smoothstep(60.,220.,vDepth));
      c*=.8+.24*max(0.,dot(normalize(vNormal),sun));
      float fog=smoothstep(230.,1400.,vDepth);c=mix(c,fogColor,fog*.94);gl_FragColor=vec4(c,1.);
      #include <colorspace_fragment>
      }`,
    })
    scene.add(new THREE.Mesh(terrainGeo, terrainMaterial))

    const waterVertices: number[] = [], waterUV: number[] = [], waterIndices: number[] = []
    for (let i = 0; i <= 600; i++) {
      const z = 300 - i / 600 * 1900
      const center = riverCenter(z), width = riverWidth(z) + 1.5
      waterVertices.push(center - width, 0.65, z, center + width, 0.65, z)
      waterUV.push(0, i / 600, 1, i / 600)
      if (i < 600) { const k = i * 2; waterIndices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2) }
    }
    const waterGeo = new THREE.BufferGeometry()
    waterGeo.setAttribute('position', new THREE.Float32BufferAttribute(waterVertices, 3))
    waterGeo.setAttribute('uv', new THREE.Float32BufferAttribute(waterUV, 2))
    waterGeo.setIndex(waterIndices)
    waterGeo.computeVertexNormals()
    const water = new THREE.Mesh(waterGeo, new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: { time: timeUniform, fogColor: { value: new THREE.Color('#b2d1c4') } },
      vertexShader: 'varying vec3 vWorld;varying vec2 vUv;varying float vDepth;void main(){vWorld=(modelMatrix*vec4(position,1.)).xyz;vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vDepth=-mv.z;gl_Position=projectionMatrix*mv;}',
      fragmentShader: `${noiseGLSL}uniform float time;uniform vec3 fogColor;varying vec3 vWorld;varying vec2 vUv;varying float vDepth;
      void main(){vec2 p=vWorld.xz;float n=fbm(p*vec2(.075,.12)+vec2(0.,time*.035));vec3 c=mix(vec3(.065,.28,.245),vec3(.27,.60,.55),n);
      float ripples=sin(p.y*2.4+p.x*.4+noise(p*.4)*5.+time*.9);float glints=smoothstep(.975,1.,ripples)*smoothstep(.56,.82,noise(p*vec2(.15,1.6)+time*.02));
      float shore=1.-smoothstep(0.,.12,min(vUv.x,1.-vUv.x));c=mix(c,vec3(.4,.58,.38),shore*.55);c+=vec3(.65,.68,.48)*glints*.6*(1.-smoothstep(150.,450.,vDepth));
      float bands=sin(p.y*.5+noise(p*.08)*8.+time*.13);c+=vec3(.02,.045,.04)*bands;c=mix(c,fogColor,smoothstep(230.,1400.,vDepth)*.94);gl_FragColor=vec4(c,1.);
      #include <colorspace_fragment>
      }`,
    }))
    scene.add(water)

    function vegetationMaterial(map: THREE.Texture, sway: number) {
      const material = new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide, alphaTest: 0.16, alphaToCoverage: true, fog: true })
      material.onBeforeCompile = (shader) => {
        shader.uniforms.uWindTime = timeUniform
        shader.vertexShader = 'uniform float uWindTime;\n' + shader.vertexShader
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
          float seed=0.;
          #ifdef USE_INSTANCING
          seed=instanceMatrix[3].x+instanceMatrix[3].z;
          #endif
          transformed.x+=sin(uWindTime*.65+seed*.18+position.y*1.2)*pow(uv.y,2.)*${sway.toFixed(4)};`)
      }
      material.customProgramCacheKey = () => `wind-${sway}`
      windMaterials.push(material)
      return material
    }

    const dummy = new THREE.Object3D()
    const treeGeometry = new THREE.PlaneGeometry(1, 1, 1, 5)
    treeGeometry.translate(0, .5, 0)
    const treeMaterial = vegetationMaterial(treeMap, .018)
    const treePoints: { x: number; z: number; size: number }[] = []
    for (let i = 0; i < 450; i++) {
      const z = 120 - random() * 1250
      const x = (random() - .5) * 1300
      if (Math.abs(x - riverCenter(z)) < riverWidth(z) + 22) continue
      if (Math.abs(x + 23) < 68 && z > -200) continue
      treePoints.push({ x, z, size: 13 + random() * 24 })
    }
    // Keep the approach to the hero tree open; the same tree exists from the first frame.
    const treesInGrove = treePoints.filter(({ x, z }) => Math.hypot(x - HERO_TREE.x, z - HERO_TREE.z) > 38)
    treesInGrove.push({ x: 92, z: -140, size: 44 }, { x: 106, z: -240, size: 32 }, { x: -122, z: -80, size: 32 })
    const trees = new THREE.InstancedMesh(treeGeometry, treeMaterial, treesInGrove.length)
    treesInGrove.forEach(({ x, z, size }, i) => {
      dummy.position.set(x, groundHeight(x, z) - .25, z)
      dummy.scale.set(size * (random() > .5 ? -1 : 1), size, 1)
      dummy.rotation.set(0, Math.atan2(-28 - x, 190 - z) * .5, 0)
      dummy.updateMatrix(); trees.setMatrixAt(i, dummy.matrix)
      trees.setColorAt(i, new THREE.Color().setHSL(.12, .08, .81 + random() * .18))
    })
    trees.instanceMatrix.needsUpdate = true
    scene.add(trees)
    const heroBase = groundHeight(HERO_TREE.x, HERO_TREE.z) - .25
    const heroTree = new THREE.Mesh(treeGeometry, treeMaterial)
    heroTree.position.set(HERO_TREE.x, heroBase, HERO_TREE.z)
    heroTree.scale.setScalar(HERO_TREE.size)
    heroTree.rotation.y = 0
    scene.add(heroTree)
    // Soft painted contact shadows conform to the same terrain as the tree roots.
    const shadowPositions: number[] = [], shadowUvs: number[] = [], shadowIndices: number[] = []
    ;[...treesInGrove, HERO_TREE].forEach(({ x, z, size }) => {
      const base = shadowPositions.length / 3
      const centerX = x + size * .12, centerZ = z - size * .08
      shadowPositions.push(centerX, groundHeight(centerX, centerZ) + .09, centerZ)
      shadowUvs.push(0, 0)
      for (let j = 0; j <= 24; j++) {
        const angle = j / 24 * Math.PI * 2, u = Math.cos(angle), v = Math.sin(angle)
        const sx = centerX + u * size * .49, sz = centerZ + v * size * .3
        shadowPositions.push(sx, groundHeight(sx, sz) + .09, sz)
        shadowUvs.push(u, v)
        if (j < 24) shadowIndices.push(base, base + j + 1, base + j + 2)
      }
    })
    const shadowGeo = new THREE.BufferGeometry()
    shadowGeo.setAttribute('position', new THREE.Float32BufferAttribute(shadowPositions, 3))
    shadowGeo.setAttribute('uv', new THREE.Float32BufferAttribute(shadowUvs, 2))
    shadowGeo.setIndex(shadowIndices)
    scene.add(new THREE.Mesh(shadowGeo, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: 'varying vec2 vUv;varying float vDepth;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vDepth=-mv.z;gl_Position=projectionMatrix*mv;}',
      fragmentShader: 'varying vec2 vUv;varying float vDepth;void main(){float a=(1.-smoothstep(.08,1.,length(vUv)))*.24*(1.-smoothstep(350.,1000.,vDepth));gl_FragColor=vec4(.08,.15,.09,a);}',
    })))

    const grassGeometry = new THREE.PlaneGeometry(1, 1, 3, 4)
    grassGeometry.translate(0, .5, 0)
    const grassMaterial = vegetationMaterial(grassMap, .05)
    const grassPoints: { x: number; z: number; scale: number }[] = []
    for (let i = 0; i < 5300; i++) {
      const near = i < 3300
      const x = near ? -115 + random() * 220 : (random() - .5) * 550
      const z = near ? 70 - random() * 320 : 180 - random() * 950
      if (Math.abs(x - riverCenter(z)) < riverWidth(z) + 8) continue
      // Keep the camera route free of tall billboards.
      if (z > -62 && Math.abs(x + 28) < 3) continue
      grassPoints.push({ x, z, scale: .7 + random() * 1.65 })
    }
    const grass = new THREE.InstancedMesh(grassGeometry, grassMaterial, grassPoints.length)
    grassPoints.forEach(({ x, z, scale }, i) => {
      dummy.position.set(x, groundHeight(x, z) - .18, z)
      dummy.rotation.set(0, (random() - .5) * .7, 0)
      dummy.scale.set(scale * 2.33, scale, 1)
      dummy.updateMatrix(); grass.setMatrixAt(i, dummy.matrix)
      grass.setColorAt(i, new THREE.Color().setHSL(.15, .07, .81 + random() * .18))
    })
    grass.instanceMatrix.needsUpdate = true
    scene.add(grass)

    // Thin real blades retain depth when viewed from above during the descent.
    const bladeGeometry = new THREE.BufferGeometry()
    bladeGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-.045,0,0,.045,0,0,-.03,.45,0,.03,.45,0,.06,.9,0],3))
    bladeGeometry.setAttribute('uv', new THREE.Float32BufferAttribute([0,0,1,0,0,.5,1,.5,.5,1],2))
    bladeGeometry.setIndex([0,1,2,1,3,2,2,3,4])
    const bladeMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide, uniforms: { time: timeUniform, fogColor: { value: new THREE.Color('#b2d1c4') } },
      vertexShader: `uniform float time;varying float vY;varying float vDepth;varying float vSeed;void main(){vY=uv.y;vec3 p=position;vSeed=fract(sin(instanceMatrix[3].x*23.+instanceMatrix[3].z)*453.);p.x+=sin(time+instanceMatrix[3].x*.3+instanceMatrix[3].z*.2)*uv.y*uv.y*.13;vec4 mv=modelViewMatrix*instanceMatrix*vec4(p,1.);vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `varying float vY;varying float vDepth;varying float vSeed;uniform vec3 fogColor;void main(){vec3 c=mix(vec3(.11,.22,.045),vec3(.43,.49,.15),vY);c*=.85+vSeed*.3;c=mix(c,fogColor,smoothstep(230.,1400.,vDepth)*.94);gl_FragColor=vec4(c,1.);
      #include <colorspace_fragment>
      }`,
    })
    const blades = new THREE.InstancedMesh(bladeGeometry, bladeMaterial, 48000)
    let bladeCount = 0
    for (let i = 0; i < 62000 && bladeCount < 48000; i++) {
      const x = -90 + random() * 180, z = 40 - random() * 210
      if (Math.abs(x - riverCenter(z)) < riverWidth(z) + 7) continue
      dummy.position.set(x, groundHeight(x, z) - .06, z)
      dummy.rotation.set(0, random() * Math.PI * 2, 0)
      dummy.scale.setScalar(.28 + random() * .6)
      dummy.updateMatrix(); blades.setMatrixAt(bladeCount++, dummy.matrix)
    }
    blades.count = bladeCount
    blades.instanceMatrix.needsUpdate = true
    scene.add(blades)

    // Rounded river stones, with warm upper faces and cool shaded sides.
    const rockGeometry = new THREE.IcosahedronGeometry(1, 1)
    const rockMaterial = new THREE.MeshStandardMaterial({ color: '#909c80', roughness: 1, flatShading: true })
    const rocks = new THREE.InstancedMesh(rockGeometry, rockMaterial, 170)
    for (let i = 0; i < 170; i++) {
      const z = 180 - random() * 1100, side = random() > .5 ? 1 : -1
      const x = riverCenter(z) + (riverWidth(z) + 4 + random() * 3) * side
      const size = .45 + random() * 1.5
      dummy.position.set(x, groundHeight(x, z) + .1, z)
      dummy.rotation.set(random(),random()*6,random())
      dummy.scale.set(size * 1.5,size*.65,size)
      dummy.updateMatrix(); rocks.setMatrixAt(i,dummy.matrix)
      rocks.setColorAt(i,new THREE.Color().setHSL(.16,.09,.58+random()*.2))
    }
    scene.add(rocks, new THREE.HemisphereLight('#e1f5f2', '#5e6840', 2))
    const sun = new THREE.DirectionalLight('#fff1c6', 2.3)
    sun.position.set(-200,500,100)
    scene.add(sun)

    const clouds: { mesh: THREE.Mesh; x: number; phase: number; speed: number }[] = []
    const cloudGeometry = new THREE.PlaneGeometry(cloudMap.image.width / cloudMap.image.height, 1)
    const cloudMaterial = new THREE.MeshBasicMaterial({ map: cloudMap, transparent: true, depthWrite: false, fog: false, opacity: .91 })
    const cloudPlacements = [
      [-550,320,-820,185], [490,345,-1050,240], [-220,420,-1550,190], [760,330,-1400,210],
      [-350,230,-350,110], [330,260,-400,135], [-800,210,-950,145], [900,530,-1800,210],
      [150,480,-1500,130], [-1100,400,-1900,240], [70,250,-1450,70],
    ]
    cloudPlacements.forEach(([x,y,z,size],i) => {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)
      cloud.position.set(x,y,z);cloud.scale.set(size,size,1)
      cloud.renderOrder = -2
      scene.add(cloud)
      clouds.push({ mesh: cloud, x, phase: i * 2.7, speed: .7 + random() * .5 })
    })

    const birdMaterial = new THREE.MeshBasicMaterial({ color: '#284b56', side: THREE.DoubleSide, fog: true })
    const wingGeometry = new THREE.BufferGeometry()
    wingGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0,1.9,.15,-.18,1.15,0,.65,0,0,.35],3))
    wingGeometry.setIndex([0,1,2,0,2,3])
    const birds: { group: THREE.Group; left: THREE.Mesh; right: THREE.Mesh; phase: number; radius: number; height: number }[] = []
    for (let i = 0; i < 9; i++) {
      const group = new THREE.Group()
      const left = new THREE.Mesh(wingGeometry,birdMaterial), right = new THREE.Mesh(wingGeometry,birdMaterial)
      left.scale.x = -1
      group.add(left,right)
      group.scale.setScalar(1.1+random()*.65)
      scene.add(group)
      birds.push({group,left,right,phase:random()*Math.PI*2,radius:55+random()*95,height:100+random()*70})
    }

    // A handful of wind-borne seeds near the meadow, never a screen-space transition.
    const seedGeometry = new THREE.BufferGeometry()
    const seedPositions = new Float32Array(70*3)
    for(let i=0;i<70;i++){seedPositions[i*3]=-100+random()*190;seedPositions[i*3+1]=4+random()*22;seedPositions[i*3+2]=-150+random()*230}
    seedGeometry.setAttribute('position',new THREE.BufferAttribute(seedPositions,3))
    const seeds = new THREE.Points(seedGeometry,new THREE.PointsMaterial({color:'#fff2c2',size:.09,transparent:true,opacity:.7,depthWrite:false,fog:true}))
    scene.add(seeds)

    const projectionPoint = new THREE.Vector3()
    function projectCutout(point: { x: number; y: number; z: number; size?: number }) {
      projectionPoint.set(point.x, point.y, point.z).applyMatrix4(camera.matrixWorldInverse)
      const depth = -projectionPoint.z
      projectionPoint.set(point.x, point.y, point.z).project(camera)
      return { x: (projectionPoint.x * .5 + .5) * innerWidth, y: (-projectionPoint.y * .5 + .5) * innerHeight,
        size: (point.size ?? 1) * innerHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.max(.01, depth)),
        visible: depth > .01 && projectionPoint.z < 1 }
    }
    function frame(now: number) {
      if (disposed || document.hidden) { lastTime = now; return }
      const dt = Math.min((now-lastTime)/1000,.06)
      lastTime=now
      // Frame-rate independent damping, including wheel, touch and reversed scrolling.
      const smoothing=1-Math.exp(-dt*7.5)
      progress += (targetProgress-progress)*smoothing
      if(Math.abs(targetProgress-progress)<.000015) progress=targetProgress
      if(!paused) ambientTime+=dt
      timeUniform.value=ambientTime
      camera.position.copy(cameraPosition(progress, mobile(), innerWidth/innerHeight))
      // Look direction changes continuously with the same progress as position.
      camera.lookAt(cameraTarget(progress, mobile(), innerWidth/innerHeight))
      clouds.forEach(({mesh,x,phase,speed})=>{mesh.position.x=x+Math.sin(ambientTime*.024*speed+phase)*70})
      birds.forEach(({group,left,right,phase,radius,height})=>{
        const a=ambientTime*.075+phase
        group.position.set(Math.cos(a)*radius, height+Math.sin(a*2)*3,-170+Math.sin(a)*radius*.4)
        group.rotation.y=-a
        const flap=Math.sin(ambientTime*3.2+phase)*.5
        left.rotation.z=-flap;right.rotation.z=flap
      })
      seeds.position.x=Math.sin(ambientTime*.06)*7
      seeds.position.y=Math.sin(ambientTime*.14)*.6
      // Both environments share the scroll clock during the defocused transition.
      camera.updateMatrixWorld(); if (progress < 1.03) renderer.render(scene,camera)
      options.onCollageFrame?.(progress, { apples: APPLES.map((_, index) => projectCutout(canopyAppleWorld(index, ambientTime))), apple: projectCutout(fallingAppleWorld(progress, ambientTime)), stem: projectCutout(appleStemAnchor(ambientTime)), head: projectCutout(HEAD), newton: projectCutout(NEWTON), landing: projectCutout(LANDING) }, ambientTime)
      if(Math.abs(progress-emittedProgress)>.00015){options.onProgress(progress);emittedProgress=progress}
      if(import.meta.env.DEV){
        frames++;averageFrame=mix(averageFrame,dt*1000,.025)
        if(frames%45===0)renderer.domElement.dataset.diagnostics=JSON.stringify({progress:+progress.toFixed(4),camera:camera.position.toArray().map(n=>+n.toFixed(2)),clearance:+(camera.position.y-groundHeight(camera.position.x,camera.position.z)).toFixed(2),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,averageFrameMs:+averageFrame.toFixed(1),pixelRatio:renderer.getPixelRatio(),ambientTime:+ambientTime.toFixed(2),paused})
      }
    }
    window.addEventListener('scroll',onScroll,{passive:true})
    window.addEventListener('resize',resize)
    document.addEventListener('visibilitychange',onVisibility)
    renderer.domElement.addEventListener('webglcontextlost',onLost)
    resize()
    progress=targetProgress
    camera.position.copy(cameraPosition(progress, mobile(), innerWidth/innerHeight))
    camera.lookAt(cameraTarget(progress, mobile(), innerWidth/innerHeight))
    await renderer.compileAsync(scene,camera)
    frame(performance.now())
    options.onLoad(1)
    renderer.setAnimationLoop(frame)
    return { dispose: cleanup, setPaused(value){paused=value},setUltra(value){ultra=value;resize()} }
  } catch(error) {
    cleanup()
    throw error
  }
}




