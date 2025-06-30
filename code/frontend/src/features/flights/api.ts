import { FlightOfferDTO } from './types'

export interface FetchFlightOffersParams {
  originLocationCode: string
  destinationLocationCode: string
  departureDate?: string | null
  returnDate?: string | null
  passengers: string
}

export async function fetchFlightOffers(
  params: FetchFlightOffersParams
): Promise<FlightOfferDTO[]> {
  const res = await fetch(`/api/search/flights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const { data = [], error } = (await res.json()) as {
    data: FlightOfferDTO[]
    error?: { code: string; message?: string }
  }

  if (error) {
    throw new Error(error?.message || 'Something went wrong')
  }

  return data
}
