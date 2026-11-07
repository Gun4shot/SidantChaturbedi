// Inscribed rectangles measured from the opaque pixels of the two cutouts.
// Each row is [left, top, right, bottom] in image coordinates from 0 to 1.
const frames = {
  crane: [[.471,.425,.579,.775], [.417,.444,.633,.775], [.417,.444,.638,.769],
          [.375,.444,.679,.713], [.342,.444,.696,.694], [.288,.444,.721,.656]],
  leaf:  [[.4,.148,.592,.867], [.35,.178,.633,.859], [.325,.2,.692,.83],
          [.262,.244,.75,.785], [.225,.289,.779,.748], [.204,.326,.829,.681]],
}

export function fitCutout(kind: keyof typeof frames, w: number, h: number) {
  const aspect = kind === 'crane' ? 1536 / 1024 : 1672 / 941
  let size = Infinity, originX = .5, originY = .5
  for (const [left, top, right, bottom] of frames[kind]) {
    const required = Math.max(w / (right - left), h * aspect / (bottom - top))
    if (required < size) {
      size = required
      originX = (left + right) / 2
      originY = (top + bottom) / 2
    }
  }
  return { size, originX, originY }
}
