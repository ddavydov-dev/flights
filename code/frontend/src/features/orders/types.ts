import { AmadeusFlightOffer, FlightOfferDTO } from '../flights/types'

export interface RawSeat {
  number: string
  coordinates: { x: number; y: number }
  travelerPricing?: {
    seatAvailabilityStatus?: 'AVAILABLE' | 'UNAVAILABLE'
    price?: { total: string }
  }[]
}

export interface SeatDTO {
  id: string
  row: number
  col: number
  price: number | null
  available: boolean
}

export interface Order {
  id: string
  offer: FlightOfferDTO
  passengers: Passenger[]
  seats: SeatDTO[]
}

export interface AmadeusFlightOrder {
  type: 'flight-order'
  id: string
  queuingOfficeId: string
  flightOffers: AmadeusFlightOffer[]
  associatedRecords: {
    reference: string
    originSystemCode: string
    flightOfferId: string
  }[]
}

export interface Passenger {
  id: string
  firstName: string
  lastName: string
  gender: 'MALE' | 'FEMALE'
  dateOfBirth: string
  seat?: string
}

export interface SeatAssignment {
  passengerId: string
  seatId: string
  row: number
  col: number
}
