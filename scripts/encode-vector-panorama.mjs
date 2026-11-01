// Rasterize actual vector paths at the target size, not an enlarged bitmap.
// VTracer source command and version are recorded in docs/vector-panorama-v5.md.
import {createRequire} from 'node:module'
import {readFile} from 'node:fs/promises'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const sharp=require('sharp')
const source=await readFile('assets/source/contact-panorama-v5.svg','utf8')
if(/<image\b/i.test(source))throw new Error('Panorama must contain vector paths, not an embedded bitmap')
for(const width of [4096,8192]){
 const height=Math.round(width/3)
 const svg=source.replace('width="2172" height="724"',`width="${width}" height="${height}"`)
 const result=await sharp(Buffer.from(svg)).webp({quality:94,effort:6}).toFile(`public/art/contact-panorama-v5-${width}.webp`)
 console.log(`${width}×${height}: ${(result.size/1048576).toFixed(2)} MB`)
}
