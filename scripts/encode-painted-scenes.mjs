// Preserve painted color transitions: format conversion only, no vector tracing.
import {createRequire} from 'node:module'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const sharp=require('sharp')
for(const name of ['library-arch-v7','contact-panorama-v7']){
 const source=`assets/source/${name}.png`,{width,height}=await sharp(source).metadata()
 const out=await sharp(source).webp({quality:98,alphaQuality:100,effort:6}).toFile(`public/art/${name}.webp`)
 console.log(name,`${width}×${height}`,(out.size/1048576).toFixed(2)+' MB')
}
