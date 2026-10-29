import {createRequire} from 'node:module'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const sharp=require('sharp')
for(const name of ['contact-veranda-v1','letterbox-atlas-v1','veranda-tree-v1','contact-panorama-v1']){
 const source=`assets/source/${name}.png`,output=`public/art/${name}.webp`
 const metadata=await sharp(source).metadata(),stats=await sharp(source).stats()
 await sharp(source).webp({quality:name==='contact-panorama-v1'?96:95,alphaQuality:100,effort:4}).toFile(output)
 console.log(name,metadata.width,metadata.height,'alpha',metadata.hasAlpha,stats.channels[3])
}
