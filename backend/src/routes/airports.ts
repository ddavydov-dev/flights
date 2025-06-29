import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { amadeusGet } from '../services/amadeusAuth.js'
import { fallback } from '../data/fallbackAirports.js'
import { haversine } from '../services/haversine.js'

interface Airport {
  iata: string
  name: string
  label: string
  lat: number
  lon: number
  city: string
  country: string
}

const router = Router()

export function toTitleCasePreserveCode(input: string): string {
  return input.replace(/([^(]+)(\s*\(.*\))?/, (_, namePart: string, codePart: string) => {
    const titled = namePart
      .toLowerCase()
      .replace(/(^|[-\u2012-\u2015\s])\w/gu, m => m.toUpperCase())
    return titled + (codePart ?? '')
  })
}

router.get('/airports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyword = String(req.query.keyword ?? '').trim()
    console.log('👨‍🌾 keyword:', keyword)
    if (!keyword) {
      return res.status(400).json({ error: 'Missing keyword query string' })
    }
    const { data = fallback } = await amadeusGet('/v1/reference-data/locations', {
      keyword,
      subType: 'AIRPORT'
    })

    const list =
      data.map((d: any) => ({
        iata: d.iataCode,
        name: toTitleCasePreserveCode(d.name),
        city: toTitleCasePreserveCode(d.address?.cityName),
        label: toTitleCasePreserveCode(`${d.address?.cityName ?? d.name} (${d.iataCode})`),
        country: toTitleCasePreserveCode(d.address.countryName)
      })) ?? []

    res.json({ data: list })
  } catch (e) {
    next(e)
  }
})

const RADIUS_KM = 200
const LIMIT = 6

router.get('/airports/nearby', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng } = req.query as Record<string, string>

    if (!lat || !lng || isNaN(+lat) || isNaN(+lng)) {
      return res.status(400).json({ error: 'Invalid lat/lng values' })
    }

    let airports: Airport[]
    try {
      const api = await amadeusGet('/v1/reference-data/locations/airports', {
        latitude: lat,
        longitude: lng,
        radius: RADIUS_KM,
        'page[limit]': LIMIT
      })
      airports = api.data
    } catch {
      airports = []
    }

    if (!airports?.length) airports = fallback

    const latNum = Number(lat)
    const lngNum = Number(lng)

    const result = airports
      .map(a => ({
        ...a,
        distKm: haversine(latNum, lngNum, a.lat, a.lon) / 1000
      }))
      .filter(a => a.distKm <= RADIUS_KM)
      .sort((a, b) => a.distKm - b.distKm)
      .slice(0, LIMIT)

    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

export default router
