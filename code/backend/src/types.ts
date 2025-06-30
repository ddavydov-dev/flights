export interface AmadeusError {
  status: number
  code: number
  title: string
  detail?: string
}

export interface FlightsApiResponse {
  data?: AmadeusFlightOffer[]
  errors?: AmadeusError[]
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

export interface AmadeusHotel {
  chainCode: string
  iataCode: string
  dupeId: number
  name: string
  hotelId: string
  geoCode: {
    latitude: number
    longitude: number
  }
  address: {
    countryCode: string
  }
  distance: {
    value: number
    unit: string
  }
}

export interface HotelsResponse {
  data?: AmadeusHotel[]
  errors?: AmadeusError[]
}

export interface AmadeusHotelOffer {
  id: string
  checkInDate: string
  checkOutDate: string
  room: {
    type: string
    typeEstimated: {
      category: string
      beds: number
      bedType: string
    }
    description: {
      text: string
      lang: string
    }
  }
  guests: {
    adults: number
  }
  price: {
    currency: string
    total: string
  }
}

export interface AmadeusHotelOffersAggregate {
  hotel: { hotelId: string; name: string }
  offers: AmadeusHotelOffer[]
}

export interface HotelOffersApiResponse {
  data?: AmadeusHotelOffersAggregate[]
  errors?: AmadeusError[]
}

export type HotelOfferDTO = {
  id: string
  description: string
  price: string
  currency: string
  hotelName: string
}

export interface Airport {
  iata: string
  name: string
  city: string
  country: string
}

export interface AmadeusLocation {
  subType: string
  name: string
  id: string
  iataCode: string
  geoCode: {
    latitude: number
    longitude: number
  }
  address: {
    cityName: string
    cityCode: string
    countryName: string
  }
}

export interface AmadeusLocationsResponse {
  data?: AmadeusLocation[]
  errors?: AmadeusError[]
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
  confirmation: AmadeusFlightOrder | null
}

export interface SeatAssignmentDTO {
  passengerId: string
  seatId: string
  row: number
  col: number
}

export interface AmadeusFlightOrder {
  type: 'flight-order'
  id: string
  queuingOfficeId: string
  flightOffers: AmadeusFlightOffer[]
}

export interface AmadeusFlightOrderResponse {
  data?: AmadeusFlightOrder
  errors?: AmadeusError[]
}
