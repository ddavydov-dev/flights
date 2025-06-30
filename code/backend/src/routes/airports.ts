import { Router } from 'express'
import type { Request, Response } from 'express'
import { amadeusGet } from '../services/amadeusAuth.js'
import { fallback } from '../data/fallback.js'
import { haversine } from '../services/haversine.js'
import type { AmadeusLocationsResponse } from '../types.js'
import { toLocationDTO } from '../utils/dto.js'
import { fail, ok } from '../utils/http.js'

const router = Router()

router.get('/airports', async (req: Request, res: Response) => {
  const keyword = String(req.query.keyword ?? '').trim()
  if (!keyword) {
    return fail(res, 400, 'VALIDATION_ERROR', 'keyword is required')
  }
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
})

const RADIUS_KM = 200
const LIMIT = 6

router.get('/airports/nearby', async (req: Request, res: Response) => {
  const { lat, lng } = req.query as Record<string, string>

  if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid lat/lng values')
  }

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

  const latNum = Number(lat)
  const lngNum = Number(lng)

  const result = (data.length === 0 ? fallback : data)
    .map(a => ({
      ...a,
      distKm: haversine(latNum, lngNum, a.geoCode.latitude, a.geoCode.longitude) / 1000
    }))
    .filter(a => a.distKm <= RADIUS_KM)
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, LIMIT)
    .map(toLocationDTO)

  return ok(res, result)
})

export default router
