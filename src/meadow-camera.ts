import * as THREE from 'three'
import { closeFraming, meadowHandoff } from './book-motion.ts'
export function meadowCameraPose(p: number, aspect: number, compact: boolean) {
  const {reveal}=meadowHandoff(p), f=closeFraming(aspect)
  const tangent=Math.tan(THREE.MathUtils.degToRad((compact?59:48)/2))
  const distance=1.05/(2*tangent*f.size)
  const apple=new THREE.Vector3(-3,THREE.MathUtils.lerp(.3,-2.05,reveal),2)
  const position=new THREE.Vector3(apple.x,apple.y+(f.centerY-.5)*2*tangent*distance,apple.z+distance)
    .lerp(new THREE.Vector3(0,0,compact?13.8:10.8),reveal)
  return { apple, position, tangent }
}
