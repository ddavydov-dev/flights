import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { amadeusGet } from '../services/amadeusAuth.js'

const router = Router()

router.get('/search/flights', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { origin, destination, departureDate, returnDate, passengers } = req.query as Record<
      string,
      string
    >
    if (!origin || !destination || !departureDate || !passengers) {
      return res.status(400).json({ error: 'origin, destination, date & passengers are required' })
    }
    const data = await amadeusGet('/v2/shopping/flight-offers', {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      ...(returnDate ? { returnDate } : {}),
      adults: passengers,
      currencyCode: 'EUR',
      max: 20
    })
    res.json(data?.data ?? [])
  } catch (e) {
    next(e)
  }
})

router.get('/search/hotels', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      city,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults = '1'
    } = req.query as Record<string, string | undefined>

    if (!city) {
      return res.status(400).json({ error: 'city is required' })
    }

    const byCityResp = await amadeusGet('/v1/reference-data/locations/hotels/by-city', {
      cityCode: city,
      radius: '5',
      radiusUnit: 'KM'
    })

    const hotelIds = (byCityResp.data ?? [])
      .map((h: { hotelId: string }) => h.hotelId)
      .slice(0, 20)
      .join(',')

    if (!hotelIds) {
      return res.status(200).json({ data: [], meta: byCityResp.meta })
    }

    const searchParams: Record<string, string> = {
      hotelIds,
      adults,
      roomQuantity: '1',
      bestRateOnly: 'true',
      currency: 'EUR'
    }
    if (checkInDate) searchParams.checkInDate = checkInDate
    if (checkOutDate) searchParams.checkOutDate = checkOutDate

    const offers = await amadeusGet('/v3/shopping/hotel-offers', searchParams)

    res.status(200).json(offers)
  } catch (err) {
    next(err)
  }
})

export default router
