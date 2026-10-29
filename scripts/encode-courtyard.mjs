import {createRequire} from 'node:module'
import {stat} from 'node:fs/promises'
const require=createRequire('C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture/package.json')
const sharp=require('sharp')
for(const name of ['library-arch-v1','learning-courtyard-v1','teaching-board-v1']){
 const input=`assets/source/${name}.png`,output=`public/art/${name}.webp`
 await sharp(input).webp({quality:90,alphaQuality:100,effort:6}).toFile(output)
 console.log(name,(await stat(input)).size,'->',(await stat(output)).size)
}
