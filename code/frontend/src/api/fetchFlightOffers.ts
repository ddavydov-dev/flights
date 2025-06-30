import { AmadeusFlightOffer } from '@/app/types'

export interface FetchFlightOffersParams {
  originLocationCode: string
  destinationLocationCode: string
  departureDate?: string | null
  returnDate?: string | null
  passengers: string
}

export interface FlightOfferDTO {
  id: string
  price: string
  currency: string
  carrier: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  cabin: string
  bags: number | null
  raw: AmadeusFlightOffer
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

  const { data = [] } = (await res.json()) as { data: FlightOfferDTO[] }

  return data
}
