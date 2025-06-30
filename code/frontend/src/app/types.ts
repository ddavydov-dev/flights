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

export type HotelOfferDTO = {
  id: string
  description: string
  price: string
  currency: string
  hotelName: string
}

export interface SeatDTO {
  id: string
  row: number
  col: number
  price: number | null
  available: boolean
}

export interface LocationDTO {
  iataCode: string
  name: string
  label: string
  latitude: number
  longitude: number
  city: string
  country: string
}

export interface SeatDTO {
  id: string
  row: number
  col: number
  available: boolean
}

export interface Passenger {
  id: string
  firstName: string
  lastName: string
  gender: 'MALE' | 'FEMALE'
  dateOfBirth: string
  seat?: string
}

export interface Order {
  id: string
  offer: FlightOfferDTO
  passengers: Passenger[]
  seats: SeatDTO[]
}
