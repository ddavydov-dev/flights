const R = 6_371_000 // earth radius in metres

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) // metres
}

export function toTitleCasePreserveCode(input: string): string {
  return input.replace(/([^(]+)(\s*\(.*\))?/, (_, namePart: string, codePart: string) => {
    const titled = namePart
      .toLowerCase()
      .replace(/(^|[-\u2012-\u2015\s])\w/gu, m => m.toUpperCase())
    return titled + (codePart ?? '')
  })
}
