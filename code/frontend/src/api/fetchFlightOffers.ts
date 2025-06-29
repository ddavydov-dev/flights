import { AmadeusFlightOffer } from '@/app/types'

export interface UseFlightOffersParams {
  origin: string
  destination: string
  departureDate?: string | null
  returnDate?: string | null
  passengers: string
  limit?: number
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

  duration: string // ISO-8601 “PT18H40M”
  stops: number

  cabin: string
  bags: number | null

  raw: AmadeusFlightOffer
}

export async function fetchFlightOffers({
  origin,
  destination,
  departureDate,
  returnDate,
  passengers
}: UseFlightOffersParams): Promise<FlightOfferDTO[]> {
  const qs = new URLSearchParams({
    origin,
    destination,
    ...(departureDate ? { departureDate } : {}),
    ...(returnDate ? { returnDate } : {}),
    passengers
  })

  const res = await fetch(`/api/search/flights?${qs}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const data = (await res.json()) as AmadeusFlightOffer[]

  return data.map(flight => {
    const { segments, duration } = flight.itineraries[0]
    const first = segments[0]
    const last = segments[segments.length - 1]
    const fare0 = flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]

    return {
      id: flight.id,
      price: flight.price.total,
      currency: flight.price.currency,
      carrier: flight.validatingAirlineCodes[0],

      origin: first.departure.iataCode,
      destination: last.arrival.iataCode,
      departureTime: first.departure.at,
      arrivalTime: last.arrival.at,

      duration,
      stops: segments.length - 1,

      cabin: fare0?.cabin ?? '',
      bags: fare0?.includedCheckedBags?.quantity ?? null,

      raw: flight
    }
  })
}
