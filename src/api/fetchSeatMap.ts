import { AmadeusFlightOffer } from '@/app/types'

export interface RawSeat {
  number: string
  coordinates: { x: number; y: number }
  travelerPricing?: {
    seatAvailabilityStatus?: 'AVAILABLE' | 'UNAVAILABLE'
    price?: { total: string }
  }[]
}

interface SeatMapResponse {
  data: { decks: { seats: RawSeat[] }[] }[]
}

export interface SeatDTO {
  id: string
  row: number
  col: number
  price: number | null
  available: boolean
}

export async function fetchSeatMap(offer: AmadeusFlightOffer): Promise<SeatDTO[]> {
  const res = await fetch('/api/seatmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flightOffer: offer })
  })
  if (!res.ok) throw new Error(await res.text())

  const json = (await res.json()) as SeatMapResponse
  const raw: RawSeat[] = json.data?.[0]?.decks?.[0]?.seats ?? []

  return raw.map(s => ({
    id: s.number,
    row: s.coordinates.x,
    col: s.coordinates.y,
    price: Number(s.travelerPricing?.[0]?.price?.total ?? NaN),
    available: s.travelerPricing?.[0]?.seatAvailabilityStatus === 'AVAILABLE'
  }))
}

export async function fetchSeatMapByOrder(id: string): Promise<SeatDTO[]> {
  const r = await fetch(`/api/orders/${id}/seatmap`)
  if (!r.ok) throw new Error(await r.text())

  const json = (await r.json()) as SeatMapResponse
  const raw: RawSeat[] = json.data?.[0]?.decks?.[0]?.seats ?? []

  return raw.map(s => ({
    id: s.number,
    row: s.coordinates.x,
    col: s.coordinates.y,
    price: Number(s.travelerPricing?.[0]?.price?.total ?? NaN),
    available: s.travelerPricing?.[0]?.seatAvailabilityStatus === 'AVAILABLE'
  }))
}
