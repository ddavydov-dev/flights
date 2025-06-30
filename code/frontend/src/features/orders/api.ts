import { RawSeat, SeatDTO } from './types'

export async function fetchSeatMapByOrder(id: string): Promise<SeatDTO[]> {
  const r = await fetch(`/api/orders/${id}/seatmap`)
  if (!r.ok) throw new Error(await r.text())

  const { data, error } = (await r.json()) as {
    data: { data: { decks: { seats: RawSeat[] }[] }[] }
    error?: { code: string; message?: string }
  }

  if (error) {
    throw new Error(error?.message || 'Something went wrong')
  }

  const raw: RawSeat[] = data.data?.[0]?.decks?.[0]?.seats ?? []

  return raw.map(s => ({
    id: s.number,
    row: s.coordinates.x,
    col: s.coordinates.y,
    price: Number(s.travelerPricing?.[0]?.price?.total ?? NaN),
    available: s.travelerPricing?.[0]?.seatAvailabilityStatus === 'AVAILABLE'
  }))
}
