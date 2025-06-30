import { Router } from 'express'
import type { Request, Response } from 'express'
import { amadeusGet } from '../services/amadeusAuth.js'
import type {
  FlightOfferDTO,
  FlightsApiResponse,
  HotelOffersApiResponse,
  HotelsResponse
} from '../types.js'
import { toFlightOfferDTO, toHotelOfferDTO } from '../utils/dto.js'
import { fail, ok } from '../utils/http.js'
import { flightSearchSchema, hotelSearchSchema, validate } from '../validation/schemas.js'

const router = Router()

router.post(
  '/search/flights',
  validate(flightSearchSchema),
  async (req: Request, res: Response) => {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      passengers,
      sortBy = 'price',
      sortOrder = 'asc'
    } = req.body

    const { data = [], errors } = await amadeusGet<FlightsApiResponse>(
      '/v2/shopping/flight-offers',
      {
        originLocationCode,
        destinationLocationCode,
        departureDate,
        ...(returnDate ? { returnDate } : {}),
        adults: passengers,
        currencyCode: 'EUR'
      }
    )

    if (errors?.[0]) {
      return fail(res, errors[0].status, errors[0].title, errors[0].detail)
    }

    const result = data.map(toFlightOfferDTO)

    return ok(res, sortFlightOffers(result, sortBy as SortKey, sortOrder as SortOrder))
  }
)

router.post('/search/hotels', validate(hotelSearchSchema), async (req: Request, res: Response) => {
  const { city, checkInDate, checkOutDate, adults = '1' } = req.body

  const { data: hotels = [], errors: hotelsError } = await amadeusGet<HotelsResponse>(
    '/v1/reference-data/locations/hotels/by-city',
    {
      cityCode: city
    }
  )

  if (hotelsError?.[0]) {
    return fail(res, hotelsError[0].status, hotelsError[0].title, hotelsError[0].detail)
  }

  const hotelIds = hotels
    .map(h => h.hotelId)
    .slice(0, 20)
    .join(',')

  if (!hotelIds) {
    return res.status(200).json({ data: [] })
  }

  const searchParams: Record<string, string> = {
    hotelIds,
    adults,
    ...(checkInDate ? { checkInDate } : {}),
    ...(checkOutDate ? { checkOutDate } : {}),
    currency: 'EUR'
  }

  const { data = [], errors } = await amadeusGet<HotelOffersApiResponse>(
    '/v3/shopping/hotel-offers',
    searchParams
  )

  if (errors?.[0]) {
    return fail(res, errors[0].status, errors[0].title, errors[0].detail)
  }

  return ok(res, data.flatMap(toHotelOfferDTO))
})

export default router

type SortKey = 'price' | 'duration'
type SortOrder = 'asc' | 'desc'

function sortFlightOffers(
  offers: FlightOfferDTO[],
  sortBy: SortKey = 'price',
  order: SortOrder = 'asc'
): FlightOfferDTO[] {
  const dir = order === 'asc' ? 1 : -1

  const compare = (a: FlightOfferDTO, b: FlightOfferDTO): number => {
    switch (sortBy) {
      case 'price':
        return dir * (Number(a.price) - Number(b.price))

      case 'duration': {
        const durA = parseISODuration(a.duration)
        const durB = parseISODuration(b.duration)
        return dir * (durA - durB)
      }

      default:
        return 0
    }
  }

  return [...offers].sort(compare)
}

function parseISODuration(iso: string): number {
  const m = iso.match(/PT(\d+)H(\d+)M/)
  if (!m) return 0
  return +m[1] * 60 + +m[2]
}
