// Format conversion only: preserve the generator's native dimensions and alpha.
import {createRequire} from 'node:module'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const sharp=require('sharp')
for(const name of ['library-arch-v4','contact-panorama-v4','veranda-tree-v4','teaching-board-v4']){
 const source=`assets/source/${name}.png`
 const {width,height}=await sharp(source).metadata()
 await sharp(source).webp({quality:96,alphaQuality:100,effort:6}).toFile(`public/art/${name}.webp`)
 console.log(name,`${width}×${height}`)
}
