import type { FlightOfferDTO } from '../types'

export type SortKey = 'price' | 'duration'
export type SortOrder = 'asc' | 'desc'

export function sortFlightOffers(
  offers: FlightOfferDTO[],
  sortBy: SortKey = 'price',
  order: SortOrder = 'asc'
): FlightOfferDTO[] {
  const dir = order === 'asc' ? 1 : -1

  const compare = (a: FlightOfferDTO, b: FlightOfferDTO): number => {
    switch (sortBy) {
      case 'price':
        return dir * (Number(a.price) - Number(b.price))

      case 'duration': {
        const durA = parseISODuration(a.duration)
        const durB = parseISODuration(b.duration)
        return dir * (durA - durB)
      }

      default:
        return 0
    }
  }

  return [...offers].sort(compare)
}

function parseISODuration(iso: string): number {
  const m = iso.match(/PT(\d+)H(\d+)M/)
  if (!m) return 0
  return +m[1] * 60 + +m[2]
}
