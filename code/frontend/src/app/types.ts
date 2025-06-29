export interface AmadeusFlightOffer {
  id: string
  price: { total: string; currency: string }
  validatingAirlineCodes: string[]
  itineraries: {
    segments: {
      departure: { at: string; iataCode: string }
      arrival: { at: string; iataCode: string }
    }[]
    duration: string
  }[]
  travelerPricings: [
    {
      fareDetailsBySegment: [{ cabin: string; includedCheckedBags: { quantity: number } }]
    }
  ]
}

export interface FlightsApiResponse {
  data: AmadeusFlightOffer[]
}

export interface AmadeusHotelOffer {
  hotel: { hotelId: string; name: string }
  offers: {
    id: string
    boardType?: string
    price: { total: string; currency: string }
    room?: { typeEstimated?: { category?: string } }
  }[]
}

export interface HotelsApiResponse {
  data: AmadeusHotelOffer[]
}

export type Offer = {
  id: string
  price: string
  carrier: string
  dep: string
  arr: string
  raw: AmadeusFlightOffer
}

export type Hotel = {
  id: string
  name: string
  price: string
  currency: string
  room: string
  board: string
  offerId: string
}
