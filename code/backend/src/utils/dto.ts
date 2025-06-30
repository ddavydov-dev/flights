import type {
  AmadeusFlightOffer,
  AmadeusHotelOffersAggregate,
  AmadeusLocation,
  FlightOfferDTO,
  HotelOfferDTO,
  LocationDTO
} from '../types'

function toTitleCase(input: string): string {
  const namePart = input.replace(/\s*\(.*\)\s*$/, '')

  return namePart.toLowerCase().replace(/(^|[-\u2012-\u2015\s])\w/gu, m => m.toUpperCase())
}

export function toLocationDTO(l: AmadeusLocation): LocationDTO {
  return {
    ...l,
    label: `${toTitleCase(l.address?.cityName ?? l.name)} (${l.iataCode})`,
    latitude: l.geoCode.latitude,
    longitude: l.geoCode.longitude,
    city: toTitleCase(l.address.cityName),
    country: toTitleCase(l.address.countryName)
  }
}

export function toFlightOfferDTO(f: AmadeusFlightOffer): FlightOfferDTO {
  const { segments, duration } = f.itineraries[0]
  const first = segments[0]
  const last = segments[segments.length - 1]
  const fare0 = f.travelerPricings?.[0]?.fareDetailsBySegment?.[0]

  return {
    id: f.id,
    price: f.price.total,
    currency: f.price.currency,
    carrier: f.validatingAirlineCodes[0],
    origin: first.departure.iataCode,
    destination: last.arrival.iataCode,
    departureTime: first.departure.at,
    arrivalTime: last.arrival.at,
    duration,
    stops: segments.length - 1,
    cabin: fare0?.cabin ?? '',
    bags: fare0?.includedCheckedBags?.quantity ?? null,
    raw: f
  }
}

export function toHotelOfferDTO({ hotel, offers }: AmadeusHotelOffersAggregate): HotelOfferDTO[] {
  return offers.map(offer => ({
    id: offer.id,
    hotelName: hotel.name,
    description: offer.room.description.text,
    currency: offer.price.currency,
    price: offer.price.total
  }))
}
