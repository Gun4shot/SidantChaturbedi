// Render vector masters at target dimensions before compression; never upscale a PNG.
import {createRequire} from 'node:module'
import {readFile,writeFile} from 'node:fs/promises'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const sharp=require('sharp')
for(const [name,w,h,sizes] of [['contact-panorama',2172,724,[4096,8192]],['library-arch',1536,1024,[2048,4096]],['veranda-tree',1024,1536,[1024,2048]]]){
 const path=`assets/source/${name}-v6.svg`
 let source=await readFile(path,'utf8')
 if(/<image\b/i.test(source))throw new Error(`${name}: embedded bitmap is not a vector master`)
 if(!source.includes('viewBox=')){source=source.replace(`width="${w}" height="${h}"`,`width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"`);await writeFile(path,source)}
 for(const width of sizes){
  const height=Math.round(width*h/w)
  const svg=source.replace(`width="${w}" height="${h}"`,`width="${width}" height="${height}"`)
  const out=await sharp(Buffer.from(svg)).webp({quality:96,alphaQuality:100,effort:6}).toFile(`public/art/${name}-v6-${width}.webp`)
  console.log(name,`${width}×${height}`,(out.size/1048576).toFixed(2)+' MB')
 }
}
