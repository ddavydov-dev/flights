import { Router } from 'express'
import type { Request, Response } from 'express'
import { amadeusGet } from '../services/amadeusAuth.js'
import type { FlightsApiResponse, HotelOffersApiResponse, HotelsResponse } from '../types.js'
import { toFlightOfferDTO, toHotelOfferDTO } from '../utils/dto.js'
import { fail, ok } from '../utils/http.js'
import { sortFlightOffers, type SortKey, type SortOrder } from '../utils/sortFlightOffers.js'

const router = Router()

router.post('/search/flights', async (req: Request, res: Response) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    passengers,
    sortBy = 'price',
    sortOrder = 'asc'
  } = req.body as Record<string, string>
  if (!originLocationCode || !destinationLocationCode || !departureDate || !passengers) {
    return fail(res, 400, 'VALIDATION_ERROR', 'origin, destination, date & passengers are required')
  }

  const allowedSorts: SortKey[] = ['price', 'duration']
  const allowedOrders: SortOrder[] = ['asc', 'desc']
  if (
    !allowedSorts.includes(sortBy as SortKey) ||
    !allowedOrders.includes(sortOrder as SortOrder)
  ) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid sortBy or order')
  }

  const { data = [], errors } = await amadeusGet<FlightsApiResponse>('/v2/shopping/flight-offers', {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    ...(returnDate ? { returnDate } : {}),
    adults: passengers,
    currencyCode: 'EUR'
  })

  if (errors?.[0]) {
    return fail(res, errors[0].status, errors[0].title, errors[0].detail)
  }

  const result = data.map(toFlightOfferDTO)

  return ok(res, sortFlightOffers(result, sortBy as SortKey, sortOrder as SortOrder))
})

router.post('/search/hotels', async (req: Request, res: Response) => {
  const {
    city,
    checkInDate,
    checkOutDate,
    adults = '1'
  } = req.body as Record<string, string | undefined>

  if (!city) {
    return fail(res, 400, 'VALIDATION_ERROR', 'city is required')
  }

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

  return ok(res, data.map(toHotelOfferDTO))
})

export default router
