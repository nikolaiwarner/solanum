export function secondsToTime(e: number, toFixed = 0): string {
  const h = Math.max(0, Math.floor(e / 3600))
  const m = Math.max(0, Math.floor((e % 3600) / 60))
  const s = Math.max(0, Math.floor(e % 60))
  let fraction = ''

  if (toFixed > 0) {
    fraction = `.${(e % 60).toFixed(toFixed).split('.')[1]}`
  }
  if (h) {
    return h.toString().padStart(2, '0') + ':' + m + ':' + s + fraction
  }
  return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0') + fraction
}
