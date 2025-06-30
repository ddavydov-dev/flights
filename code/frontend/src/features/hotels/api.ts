import { HotelOfferDTO } from './types'

interface FetchHotelOffersParams {
  city: string
  checkInDate: string | null
  checkOutDate: string | null
  adults: string
}

export async function fetchHotelOffers(params: FetchHotelOffersParams): Promise<HotelOfferDTO[]> {
  const res = await fetch(`/api/search/hotels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const { data = [], error } = (await res.json()) as {
    data: HotelOfferDTO[]
    error?: { code: string; message?: string }
  }

  if (error) {
    throw new Error(error?.message || 'Something went wrong')
  }

  return data
}
