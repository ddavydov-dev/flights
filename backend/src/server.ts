// import express from 'express'
// import cors from 'cors'
// import type { Request, Response } from 'express'
// import { randomUUID } from 'node:crypto'

// // dotenv.config();

// const { AMADEUS_API_KEY, AMADEUS_API_SECRET } = process.env

// if (!AMADEUS_API_KEY) {
//   throw new Error('Missing AMADEUS_API_KEY')
// }
// if (!AMADEUS_API_SECRET) {
//   throw new Error('Missing AMADEUS_API_KEY')
// }

// const app = express()
// app.use(cors())
// app.use(express.json())

// /*───────────────────────────────────────────────────────────────────────────
//   Types & utils
// ───────────────────────────────────────────────────────────────────────────*/
// interface TokenCache {
//   token: string | null
//   exp: number // epoch ms
// }

// interface Order {
//   id: string
//   offer: unknown // flight‑offer blob – refine if you like
//   seats: unknown[]
// }

// let tokenCache: TokenCache = { token: null, exp: 0 }

// async function amadeusToken(): Promise<string> {
//   const now = Date.now()
//   if (tokenCache.token && tokenCache.exp - 60_000 > now) return tokenCache.token

//   const form = new URLSearchParams({
//     grant_type: 'client_credentials',
//     client_id: AMADEUS_API_KEY!,
//     client_secret: AMADEUS_API_SECRET!
//   })

//   const r = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
//     method: 'POST',
//     body: form
//   })
//   if (!r.ok) {
//     const text = await r.text()
//     throw new Error(`Auth failed ${r.status}: ${text}`)
//   }
//   const j = (await r.json()) as { access_token: string; expires_in: number }
//   tokenCache = { token: j.access_token, exp: now + j.expires_in * 1000 }
//   return j.access_token
// }

// const orders = new Map<string, Order>()

// /*───────────────────────────────────────────────────────────────────────────
//   1. GET /api/airports?q=HEL
// ───────────────────────────────────────────────────────────────────────────*/
// app.get('/api/airports', async (req: Request, res: Response) => {
//   try {
//     const q = req.query.q as string | undefined
//     if (!q) return res.status(400).json({ error: 'q is required' })

//     const t = await amadeusToken()
//     const params = new URLSearchParams({
//       keyword: q,
//       'subType[]': 'AIRPORT'
//     })
//     const r = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?${params}`, {
//       headers: { Authorization: `Bearer ${t}` }
//     })
//     if (!r.ok) return res.status(r.status).json(await r.json())
//     res.json(await r.json())
//   } catch (err: any) {
//     console.error(err)
//     res.status(500).json({ error: err.message })
//   }
// })

// /*───────────────────────────────────────────────────────────────────────────
//   2. GET /api/nearest-airports?lat=60.16952&lng=24.93545
// ───────────────────────────────────────────────────────────────────────────*/
// app.get('/api/nearest-airports', async (req: Request, res: Response) => {
//   try {
//     const { lat, lng } = req.query as Record<string, string | undefined>
//     if (!lat || !lng) return res.status(400).json({ error: 'lat and lng are required' })

//     const t = await amadeusToken()
//     const params = new URLSearchParams({
//       latitude: lat,
//       longitude: lng,
//       'page[limit]': '10'
//     })
//     const r = await fetch(
//       `https://test.api.amadeus.com/v1/reference-data/locations/airports?${params}`,
//       { headers: { Authorization: `Bearer ${t}` } }
//     )
//     if (!r.ok) return res.status(r.status).json(await r.json())
//     res.json(await r.json())
//   } catch (err: any) {
//     console.error(err)
//     res.status(500).json({ error: err.message })
//   }
// })

// /*───────────────────────────────────────────────────────────────────────────
//   3. GET /api/search?origin=HEL&destination=PAR...
// ───────────────────────────────────────────────────────────────────────────*/
// app.get('/api/search', async (req: Request, res: Response) => {
//   try {
//     const {
//       origin,
//       destination,
//       departureDate,
//       returnDate,
//       passengers = '1',
//       limit = '10'
//     } = req.query as Record<string, string | undefined>

//     if (!origin || !destination || !departureDate)
//       return res.status(400).json({ error: 'origin, destination and departureDate are required' })

//     const t = await amadeusToken()
//     const params = new URLSearchParams({
//       originLocationCode: origin,
//       destinationLocationCode: destination,
//       departureDate,
//       adults: passengers,
//       currencyCode: 'EUR',
//       max: limit,
//       ...(returnDate ? { returnDate } : {})
//     })
//     const r = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`, {
//       headers: { Authorization: `Bearer ${t}` }
//     })
//     if (!r.ok) return res.status(r.status).json(await r.json())
//     res.json(await r.json())
//   } catch (err: any) {
//     console.error(err)
//     res.status(500).json({ error: err.message })
//   }
// })

// /*───────────────────────────────────────────────────────────────────────────
//   4. GET /api/hotels?city=PAR...
// ───────────────────────────────────────────────────────────────────────────*/
// app.get('/api/hotels', async (req: Request, res: Response) => {
//   try {
//     const {
//       city,
//       checkIn,
//       checkOut,
//       adults = '1'
//     } = req.query as Record<string, string | undefined>
//     if (!city) return res.status(400).json({ error: 'city is required' })

//     const t = await amadeusToken()

//     // Locate hotels in city radius
//     const cityParams = new URLSearchParams({ cityCode: city, radius: '5', radiusUnit: 'KM' })
//     const cityRes = await fetch(
//       `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?${cityParams}`,
//       { headers: { Authorization: `Bearer ${t}` } }
//     )
//     if (!cityRes.ok) return res.status(cityRes.status).json(await cityRes.json())

//     const cityJson = (await cityRes.json()) as { data: { hotelId: string }[] }
//     const hotelIds = cityJson.data
//       .map(h => h.hotelId)
//       .slice(0, 20)
//       .join(',')
//     if (!hotelIds) return res.json({ data: [] })

//     // Pull hotel offers
//     const params = new URLSearchParams({
//       hotelIds,
//       roomQuantity: adults,
//       currency: 'EUR',
//       ...(checkIn ? { checkInDate: checkIn } : {}),
//       ...(checkOut ? { checkOutDate: checkOut } : {})
//     })
//     const r = await fetch(`https://test.api.amadeus.com/v3/shopping/hotel-offers?${params}`, {
//       headers: { Authorization: `Bearer ${t}` }
//     })
//     if (!r.ok) return res.status(r.status).json(await r.json())
//     res.json(await r.json())
//   } catch (err: any) {
//     console.error(err)
//     res.status(500).json({ error: err.message })
//   }
// })

// /*───────────────────────────────────────────────────────────────────────────
//   5. Orders endpoints
// ───────────────────────────────────────────────────────────────────────────*/
// app.post('/api/orders', (req: Request, res: Response) => {
//   const { offer } = req.body as { offer?: unknown }
//   if (!offer) return res.status(400).json({ error: 'offer is required' })
//   const id = randomUUID()
//   orders.set(id, { id, offer, seats: [] })
//   res.status(201).json({ id })
// })

// app.get('/api/orders/:id', (req: Request, res: Response) => {
//   const order = orders.get(req.params.id)
//   if (!order) return res.status(404).json({ error: 'Not found' })
//   res.json(order)
// })

// app.post('/api/orders/:id/seatmap', (req: Request, res: Response) => {
//   const { seats } = req.body as { seats?: unknown[] }
//   const order = orders.get(req.params.id)
//   if (!order) return res.status(404).json({ error: 'Not found' })
//   if (!Array.isArray(seats)) return res.status(400).json({ error: 'seats must be array' })
//   order.seats = seats
//   res.json(order)
// })

// app.get('/api/orders/:id/seatmap', async (req: Request, res: Response) => {
//   try {
//     const order = orders.get(req.params.id)
//     if (!order) return res.status(404).json({ error: 'Not found' })
//     const t = await amadeusToken()

//     const r = await fetch('https://test.api.amadeus.com/v1/shopping/seatmaps', {
//       method: 'POST',
//       headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         data: [
//           {
//             type: 'flight-offers',
//             id: (order.offer as any).id,
//             flightOffers: [order.offer]
//           }
//         ]
//       })
//     })
//     if (!r.ok) return res.status(r.status).json(await r.json())
//     res.json(await r.json())
//   } catch (err: any) {
//     res.status(500).json({ error: err.message })
//   }
// })

// /*───────────────────────────────────────────────────────────────────────────
//   6. Stand‑alone seatmap lookup
// ───────────────────────────────────────────────────────────────────────────*/
// app.get('/api/seatmap', async (req: Request, res: Response) => {
//   try {
//     const offerId = req.query.offerId as string | undefined
//     if (!offerId) return res.status(400).json({ error: 'offerId is required' })

//     const t = await amadeusToken()
//     const r = await fetch(
//       `https://test.api.amadeus.com/v1/shopping/seatmaps?flightOfferId=${offerId}`,
//       { headers: { Authorization: `Bearer ${t}` } }
//     )
//     if (!r.ok) return res.status(r.status).json(await r.json())
//     res.json(await r.json())
//   } catch (err: any) {
//     res.status(500).json({ error: err.message })
//   }
// })

// const PORT = Number(process.env.PORT) || 4000
// app.listen(PORT, () => {
//   console.log(`✨ Backend proxy listening on ${PORT}`)
// })
