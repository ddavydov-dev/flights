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

export interface AmadeusFlightOffer {
  id: string
  price: { total: string; currency: string }
  validatingAirlineCodes: string[]
  itineraries: {
    segments: {
      id: string
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
