import { Router } from 'express'
import type { Request, Response } from 'express'
import { amadeusGet } from '../services/amadeusAuth.js'
import { fallback } from '../data/fallback.js'
import { haversine } from '../services/haversine.js'
import type { AmadeusLocationsResponse } from '../types.js'
import { toLocationDTO } from '../utils/dto.js'
import { fail, ok } from '../utils/http.js'
import { airportSearchSchema, nearbyAirportSchema, validate } from '../validation/schemas.js'

const router = Router()

router.get(
  '/airports',
  validate(airportSearchSchema, 'query'),
  async (req: Request, res: Response) => {
    const keyword = req.query.keyword as string

    const { data = fallback, errors } = await amadeusGet<AmadeusLocationsResponse>(
      '/v1/reference-data/locations',
      {
        keyword,
        subType: 'AIRPORT'
      }
    )

    if (errors?.[0]) {
      return fail(res, errors[0].status, errors[0].title, errors[0].detail)
    }

    return ok(res, data.map(toLocationDTO))
  }
)

const RADIUS_KM = 200
const LIMIT = 6

router.get(
  '/airports/nearby',
  validate(nearbyAirportSchema, 'query'),
  async (req: Request, res: Response) => {
    const { lat, lng } = req.query as Record<string, string>

    const { data = [], errors } = await amadeusGet<AmadeusLocationsResponse>(
      '/v1/reference-data/locations/airports',
      {
        latitude: lat,
        longitude: lng,
        radius: RADIUS_KM
      }
    )

    if (errors?.[0]) {
      return fail(res, errors[0].status, errors[0].title, errors[0].detail)
    }

    const result = (data.length === 0 ? fallback : data)
      .map(a => ({
        ...a,
        distKm: haversine(Number(lat), Number(lng), a.geoCode.latitude, a.geoCode.longitude) / 1000
      }))
      .filter(a => a.distKm <= RADIUS_KM)
      .sort((a, b) => a.distKm - b.distKm)
      .slice(0, LIMIT)
      .map(toLocationDTO)

    return ok(res, result)
  }
)

export default router
