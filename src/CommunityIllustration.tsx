import type {CSSProperties} from 'react'

/** Original schematic illustrations, not screenshots or institutional logos. */
export function CommunityIllustration({index}:{index:number}){
 const drawings=[
  <g key="network"><path d="M55 95 120 50 190 95 172 175 85 185 55 95 172 175 120 50 85 185 190 95M55 95h135M85 185l87-10"/>{[[55,95],[120,50],[190,95],[172,175],[85,185]].map(([x,y],i)=><g key={i} className="idea-node" style={{'--node':i} as CSSProperties}><circle cx={x} cy={y} r="15"/><circle cx={x} cy={y} r="4"/></g>)}<path d="M108 118h24v24h-24zM116 110v8m8-8v8m-8 24v8m8-8v8m-24-24h8m24 0h8m-40 8h8m24 0h8"/></g>,
  <g key="build"><path d="m45 91 74-40 76 40-76 43-74-43Zm0 0v73l74 43 76-43V91M119 134v73M82 113v73m76-75v75M45 128l74 43 76-43M82 72l76 41m-2-42-75 42"/><path d="m61 37 10-9m100 7-4-14M209 128l13 2M31 182l-12 8"/><circle cx="119" cy="134" r="12"/></g>,
  <g key="learn"><path d="M39 158q40-18 81 3 41-21 81-3v36q-41-17-81 2-41-19-81-2v-36Zm81 3v35M47 169q30-9 58 1m29 0q30-10 58-1"/><ellipse cx="121" cy="91" rx="66" ry="24" transform="rotate(-35 121 91)"/><ellipse cx="121" cy="91" rx="66" ry="24" transform="rotate(35 121 91)"/><ellipse cx="121" cy="91" rx="24" ry="66"/><circle cx="121" cy="91" r="10"/><circle cx="179" cy="66" r="5"/><circle cx="105" cy="151" r="5"/></g>,
  <g key="grow"><path d="M121 193v-85m0 39c-38 3-58-21-56-48 30-2 55 16 56 48Zm0-26c35 2 54-23 48-52-29 3-48 22-48 52Zm-1 72c-18-23-41-34-71-29m71 29c22-23 43-32 73-29M40 178q42 41 80 37 40 4 81-37M121 108c-25-18-23-45-4-67 24 21 28 47 4 67Z"/><path d="m39 91 5-12m153 34 13-3M68 47l-9-9"/><circle cx="181" cy="43" r="8"/></g>
 ]
 return <svg className="community-drawing" viewBox="0 0 240 240" fill="none" aria-hidden="true"><circle className="drawing-orbit" cx="120" cy="120" r="108"/><circle className="drawing-orbit orbit-inner" cx="120" cy="120" r="100"/>{drawings[index]}<path className="drawing-ground" d="M80 226h80"/></svg>
}
