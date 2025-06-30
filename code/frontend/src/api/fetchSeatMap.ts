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

export async function fetchSeatMapByOrder(id: string): Promise<SeatDTO[]> {
  const r = await fetch(`/api/orders/${id}/seatmap`)
  if (!r.ok) throw new Error(await r.text())

  const { data } = (await r.json()) as any
  const raw: RawSeat[] = data.data?.[0]?.decks?.[0]?.seats ?? []

  return raw.map(s => ({
    id: s.number,
    row: s.coordinates.x,
    col: s.coordinates.y,
    price: Number(s.travelerPricing?.[0]?.price?.total ?? NaN),
    available: s.travelerPricing?.[0]?.seatAvailabilityStatus === 'AVAILABLE'
  }))
}
