export const clamp = (v: number) => Math.max(0, Math.min(1, v))
export const smooth = (a: number, b: number, p: number) => { const t = clamp((p-a)/(b-a)); return t*t*t*(t*(t*6-15)+10) }
export const CLOSE_START = .842, CLOSE_END = .94, REVEAL_START = 1.035, REVEAL_END = 1.20
export const BOOK_OPEN_START=1.21, BOOK_OPEN_END=1.36, BOOK_LEAVE_START=1.48, BOOK_LEAVE_END=1.60
export function bookScroll(p:number){return {open:smooth(BOOK_OPEN_START,BOOK_OPEN_END,p),leave:smooth(BOOK_LEAVE_START,BOOK_LEAVE_END,p)}}
export const BOOK_WIDTH=3.6, BOOK_HEIGHT=4
export function readingLayout(width:number,height:number){
  const compact=width<700,top=compact?82:70,bottom=compact?154:132
  const availableHeight=Math.max(100,height-top-bottom)
  const aspect=(compact?BOOK_WIDTH:BOOK_WIDTH*2)/BOOK_HEIGHT
  const h=Math.min(availableHeight,(width-(compact?32:120))/aspect)
  return {width:h*aspect,height:h,centerX:width/2,centerY:top+availableHeight/2,top:top+(availableHeight-h)/2}
}
// The book travels along a rising arc; the cover follows after the initial lift.
// Every pose is derived from scroll, so reversing the scroll retraces the path.
export function bookOpeningPose(open:number){
  const t=smooth(0,1,open),s=1-t
  const bezier=(a:number,b:number,c:number,d:number)=>s*s*s*a+3*s*s*t*b+3*s*t*t*c+t*t*t*d
  const settle=Math.sin(t*Math.PI*2)*Math.sin(t*Math.PI)
  return {
    x:bezier(-BOOK_WIDTH/2,-BOOK_WIDTH/2-.32,-.38,0),
    y:bezier(-2.1,-1.15,.64,0),z:bezier(0,.2,1.35,.7),
    pitch:-1.12*(1-smooth(.06,.94,open)),
    yaw:Math.sin(t*Math.PI)*-.18,
    roll:-.085*(1-t)+settle*.045,
    cover:smooth(.16,.96,open),approach:smooth(.12,1,open),lift:t,
    clearance:Math.sin(t*Math.PI)*1.15,
  }
}
export const restingPaperHeight=(distance:number,width=BOOK_WIDTH)=>{
  const u=clamp(Math.abs(distance)/width)
  return .035*Math.sin(Math.PI*u)-.018*Math.exp(-u*12)
}
// Texture indices include the introduction at zero. Each side of the turning
// sheet is the page it actually reveals, including jumps through the index.
export function pageTurnTextures(from:number,to:number){
  const forward=to>from
  return {front:forward?from+1:to+1,back:forward?to:from,
    underneath:forward?to+1:to,direction:forward?1:-1}
}
export function closeFraming(aspect: number) {
  const size = Math.min(aspect * 1.5, 1.16)
  return { size, centerY: 1 - .3 * size }
}
export function meadowHandoff(p: number) {
  return { blend: smooth(.975, 1.025, p), reveal: smooth(REVEAL_START, REVEAL_END, p),
    blur: 90 * smooth(.85, .94, p) * (1-smooth(REVEAL_START, 1.18, p)),
    title: smooth(.90, .945, p) * (1-smooth(1.055, 1.105, p)), ready: smooth(1.17, 1.21, p) }
}
// A lifted corner leads the turn; the lower edge follows with a short paper lag.
// Integrating each row keeps its width fixed while allowing a traveling diagonal curl.
export function curledPageRow(turn: number, row: number, width: number, segments=56) {
  const result=[{x:0,z:0}], wave=Math.sin(Math.PI*turn)
  let x=0,z=0
  for(let i=1;i<=segments;i++){
    const u=(i-.5)/segments
    const band=width*(.08+.18*wave)
    const fold=(1-turn)*(width+band)-band*.5+(row-.5)*width*.22*wave
    // A moving fold rolls the outer edge back onto the left page. The rest of
    // the sheet stays flat until the curl reaches it; it never turns as a card.
    const angle=-Math.PI*smooth(fold-band*.5,fold+band*.5,u*width)
    x+=Math.cos(angle)*width/segments;z-=Math.sin(angle)*width/segments
    result.push({x,z:Math.max(0,z)})
  }
  return result
}
