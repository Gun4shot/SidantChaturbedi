import * as THREE from 'three'
import { LENS, ROOM, DOOR, OUT, RIGHT, facadePoint, FINAL_CAMERA, viewportLens, boardCorners, type BoardBounds, type CameraPose } from './courtyard-motion'
import { journeyCamera } from './contact-motion'

export type CourtyardProjection={update(p:number,w:number,h:number,board:BoardBounds):void;dispose():void}

function lensMatrix(f:number,cx:number,cy:number,w:number,h:number){
  const n=LENS.near,z=LENS.far
  return new THREE.Matrix4().set(2*f/w,0,1-2*cx/w,0, 0,2*f/h,2*cy/h-1,0, 0,0,-(z+n)/(z-n),-2*z*n/(z-n), 0,0,-1,0)
}
function place(camera:THREE.Camera,pose:CameraPose){
  camera.position.set(pose.x,pose.y,pose.z)
  camera.lookAt(pose.x+Math.sin(pose.yaw),pose.y,pose.z-Math.cos(pose.yaw))
  camera.updateMatrixWorld(true)
}
function sourceCamera(pose:CameraPose){
  const c=new THREE.Camera()
  c.projectionMatrix.copy(lensMatrix(LENS.focal,LENS.cx,LENS.cy,LENS.width,LENS.height))
  place(c,pose)
  return new THREE.Matrix4().multiplyMatrices(c.projectionMatrix,c.matrixWorldInverse)
}
function painting(texture:THREE.Texture,source:THREE.Matrix4,overscan=false){
  return new THREE.ShaderMaterial({
    uniforms:{painting:{value:texture},sourceCamera:{value:source},overscan:{value:overscan}},side:THREE.DoubleSide,
    vertexShader:`uniform mat4 sourceCamera; varying vec4 paintedPosition;
      void main(){vec4 world=modelMatrix*vec4(position,1.0);paintedPosition=sourceCamera*world;
        gl_Position=projectionMatrix*viewMatrix*world;}`,
    fragmentShader:`uniform sampler2D painting; uniform bool overscan; varying vec4 paintedPosition;
      void main(){
        if(paintedPosition.w<=0.0)discard;
        vec2 uv=paintedPosition.xy/paintedPosition.w*.5+.5;
        if(!overscan&&(any(lessThan(uv,vec2(0.0)))||any(greaterThan(uv,vec2(1.0)))))discard;
        vec4 color=texture2D(painting,clamp(uv,vec2(0.0),vec2(1.0)));
        if(color.a<.12)discard;
        gl_FragColor=vec4(color.rgb,1.0);
        #include <colorspace_fragment>
      }`,
  })
}
function quad(points:number[][]){
  const g=new THREE.BufferGeometry()
  g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3))
  g.setIndex([0,1,2,0,2,3]);return g
}

function panoramaMaterial(texture:THREE.Texture,origin:{x:number;z:number}){
  return new THREE.ShaderMaterial({
    side:THREE.DoubleSide,
    uniforms:{painting:{value:texture},origin:{value:new THREE.Vector2(origin.x,origin.z)},outward:{value:new THREE.Vector2(OUT.x,OUT.z)},rightward:{value:new THREE.Vector2(RIGHT.x,RIGHT.z)},groundUV:{value:false}},
    vertexShader:`varying vec3 worldPoint;varying vec2 paintUV;void main(){vec4 world=modelMatrix*vec4(position,1.0);worldPoint=world.xyz;paintUV=uv;gl_Position=projectionMatrix*viewMatrix*world;}`,
    fragmentShader:`uniform sampler2D painting;uniform vec2 origin,outward,rightward;uniform bool groundUV;varying vec3 worldPoint;varying vec2 paintUV;
      void main(){vec2 delta=worldPoint.xz-origin;float radius=max(length(delta),0.01);
        float angle=atan(dot(delta,rightward),dot(delta,outward));
        vec2 uv=groundUV?vec2((angle+radians(35.0))/radians(140.0),1.0-(735.0+3520.0*(1.0/radius-1.0/56.0))/1024.0):paintUV;
        gl_FragColor=vec4(texture2D(painting,clamp(uv,vec2(0.001),vec2(0.999))).rgb,1.0);
        #include <colorspace_fragment>
      }`,
  })
}

export async function createCourtyardProjection(host:HTMLElement):Promise<CourtyardProjection>{
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'})
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor('#c9d9d0')
  renderer.outputColorSpace=THREE.SRGBColorSpace
  renderer.domElement.className='courtyard-camera';renderer.domElement.setAttribute('aria-hidden','true')
  const scene=new THREE.Scene(),camera=new THREE.Camera(),geometries:THREE.BufferGeometry[]=[]
  const textures:THREE.Texture[]=[],materials:THREE.Material[]=[]
  let disposed=false
  function dispose(){
    disposed=true;geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose())
    renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()
  }
  try{
    const loader=new THREE.TextureLoader()
    await Promise.all(['/art/library-arch-v1.webp','/art/contact-panorama-v1.webp','/art/teaching-board-v1.webp','/art/veranda-tree-v1.webp'].map(async(url,i)=>{
      const texture=await loader.loadAsync(url);textures[i]=texture
      texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy())
    }))
    const indoor=painting(textures[0],sourceCamera({x:0,y:ROOM.eye,z:0,yaw:0}))
    // The exterior has its own fixed capture camera, never an independently animated camera.
    const outsideOrigin={x:DOOR.x-OUT.x*1.4,z:DOOR.z-OUT.z*1.4}
    const outdoor=panoramaMaterial(textures[1],outsideOrigin)
    materials.push(indoor,outdoor)
    const add=(geometry:THREE.BufferGeometry,material:THREE.Material)=>{geometries.push(geometry);scene.add(new THREE.Mesh(geometry,material))}
    const {left:l,ceiling:top,back}=ROOM,front=2,z=-back
    const farCorner=facadePoint(1025),nearCorner=facadePoint(1245)
    add(quad([[l,0,z],[farCorner.x,0,z],[farCorner.x,top,z],[l,top,z]]),indoor)
    add(quad([[l,0,front],[l,0,z],[l,top,z],[l,top,front]]),indoor)
    const wall=(a:{x:number;z:number},b:{x:number;z:number})=>add(quad([[a.x,0,a.z],[b.x,0,b.z],[b.x,top,b.z],[a.x,top,a.z]]),indoor)
    wall({x:farCorner.x,z},farCorner);wall(farCorner,nearCorner);wall(nearCorner,{x:nearCorner.x,z:front})
    const outline=[[l,front],[nearCorner.x,front],[nearCorner.x,nearCorner.z],[farCorner.x,farCorner.z],[farCorner.x,z],[l,z]]
    for(const y of [0,top]){
      const geometry=new THREE.BufferGeometry()
      geometry.setAttribute('position',new THREE.Float32BufferAttribute(outline.flatMap(([x,z])=>[x,y,z]),3))
      geometry.setIndex([0,1,2,0,2,3,0,3,4,0,4,5]);add(geometry,indoor)
    }
    // One continuous cylindrical matte covers both courtyard and veranda.
    // A shared horizontal floor meets it at a single ring; there is no image seam.
    const join=735,groundDepth=56
    const point=(radius:number,angle:number,y:number)=>[outsideOrigin.x+(OUT.x*Math.cos(angle)+RIGHT.x*Math.sin(angle))*radius,y,outsideOrigin.z+(OUT.z*Math.cos(angle)+RIGHT.z*Math.sin(angle))*radius]
    const cols=160,rows=12,positions:number[]=[],indices:number[]=[],uvs:number[]=[]
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      const angle=(-55+i/cols*180)*Math.PI/180,u=(angle+35*Math.PI/180)/(140*Math.PI/180),v=-260+j/rows*(join+260)
      // A continuous cylindrical matte must not fold between inferred depths:
      // lateral travel would expose those folds as stretched strips of paint.
      // Foreground depth comes from the separate tree, board and letterbox.
      positions.push(...point(groundDepth,angle,(join-v)*groundDepth/LENS.focal))
      uvs.push(u,1-v/1024)
      if(i<cols&&j<rows){const a=j*(cols+1)+i;indices.push(a,a+1,a+cols+2,a,a+cols+2,a+cols+1)}
    }
    const panorama=new THREE.BufferGeometry();panorama.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));panorama.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));panorama.setIndex(indices);add(panorama,outdoor)
    const floorPositions:number[]=[],floorIndices:number[]=[],floorCols=180,floorRows=24
    for(let j=0;j<=floorRows;j++)for(let i=0;i<=floorCols;i++){
      const radius=.1+(groundDepth-.1)*j/floorRows,angle=(-85+i/floorCols*250)*Math.PI/180
      floorPositions.push(...point(radius,angle,0))
      if(i<floorCols&&j<floorRows){const a=j*(floorCols+1)+i;floorIndices.push(a,a+1,a+floorCols+2,a,a+floorCols+2,a+floorCols+1)}
    }
    // Keep the previous floor-overlap fix when the exterior extends under the library.
    const groundMaterial=outdoor.clone();groundMaterial.uniforms.groundUV.value=true;groundMaterial.polygonOffset=true;groundMaterial.polygonOffsetFactor=1;groundMaterial.polygonOffsetUnits=4;materials.push(groundMaterial)
    const ground=new THREE.BufferGeometry();ground.setAttribute('position',new THREE.Float32BufferAttribute(floorPositions,3));ground.setIndex(floorIndices);add(ground,groundMaterial)
    const treeMaterial=new THREE.MeshBasicMaterial({map:textures[3],side:THREE.DoubleSide,alphaTest:.25})
    materials.push(treeMaterial)
    const treeX=FINAL_CAMERA.x+RIGHT.x*4.8+OUT.x*5.2,treeZ=FINAL_CAMERA.z+RIGHT.z*4.8+OUT.z*5.2,treeYaw=FINAL_CAMERA.yaw+32*Math.PI/180
    const treeRight={x:Math.cos(treeYaw),z:Math.sin(treeYaw)},treeHalf=1.4
    const treeGeometry=quad([[treeX-treeRight.x*treeHalf,0,treeZ-treeRight.z*treeHalf],[treeX+treeRight.x*treeHalf,0,treeZ+treeRight.z*treeHalf],[treeX+treeRight.x*treeHalf,6.8,treeZ+treeRight.z*treeHalf],[treeX-treeRight.x*treeHalf,6.8,treeZ-treeRight.z*treeHalf]])
    treeGeometry.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,1],2));add(treeGeometry,treeMaterial)
    const boardMaterial=new THREE.MeshBasicMaterial({map:textures[2],side:THREE.DoubleSide,transparent:true,alphaTest:.1})
    materials.push(boardMaterial)
    const boardGeometry=new THREE.BufferGeometry()
    boardGeometry.setIndex([0,1,2,0,2,3]);boardGeometry.setAttribute('uv',new THREE.Float32BufferAttribute([0,1,1,1,1,0,0,0],2))
    add(boardGeometry,boardMaterial)
    host.append(renderer.domElement)
    let width=0,height=0,lastT=-1
    return {update(p,w,h,board){
      if(disposed)return
      if(width===w&&height===h&&Math.abs(lastT-p)<1e-7)return
      if(width!==w||height!==h){
        width=w;height=h;renderer.setSize(w,h,false)
        const lens=viewportLens(w,h)
        camera.projectionMatrix.copy(lensMatrix(lens.focal,lens.cx,lens.cy,w,h))
        camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()
        boardGeometry.setAttribute('position',new THREE.Float32BufferAttribute(boardCorners(w,h,board).flatMap(p=>[p.x,p.y,p.z]),3))
        boardGeometry.computeBoundingSphere()
      }
      place(camera,journeyCamera(p));renderer.render(scene,camera);lastT=p
      renderer.domElement.dataset.camera=JSON.stringify({...journeyCamera(p),focal:viewportLens(w,h).focal,finalX:FINAL_CAMERA.x})
    },dispose}
  }catch(error){dispose();throw error}
}
