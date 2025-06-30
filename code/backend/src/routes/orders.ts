import { Router } from 'express'
import type { Request, Response } from 'express'
import {
  createOrder,
  getOrder,
  markOrderConfirmed,
  updateOrderSeats
} from '../services/orderStore.js'
import { amadeusPost } from '../services/amadeusAuth.js'
import { fail, ok } from '../utils/http.js'
import type { AmadeusFlightOffer, AmadeusFlightOrderResponse } from '../types.js'
import { toFlightOfferDTO } from '../utils/dto.js'

const router = Router()

router.post('/orders', async (req: Request, res: Response) => {
  const { flightOffer, passengers } = req.body as {
    flightOffer?: AmadeusFlightOffer
    passengers?: string
  }
  if (!flightOffer || !passengers) {
    return fail(res, 400, 'flightOffer and passengers are required')
  }
  const order = createOrder(toFlightOfferDTO(flightOffer), Number(passengers))
  res.status(201).json({ id: order.id })
})

router.get('/orders/:id', (req: Request, res: Response) => {
  const order = getOrder(req.params.id)

  if (!order) return fail(res, 404, 'NOT FOUND')

  return ok(res, order)
})

router.patch('/orders/:id', async (req: Request, res: Response) => {
  try {
    const { assignments } = req.body

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return fail(res, 400, 'VALIDATION_ERROR', 'assignments must be a non-empty array')
    }

    const updated = updateOrderSeats(req.params.id, assignments)

    if (!updated) return fail(res, 404, 'NOT FOUND')

    return ok(res, updated)
  } catch (e: unknown) {
    if (e instanceof Error) {
      return fail(res, 400, 'ASSIGNMENT_ERROR', e.message)
    }
    console.error(e)
    return fail(res, 500, 'INTERNAL_ERROR')
  }
})

router.get('/orders/:id/seatmap', async (req: Request, res: Response) => {
  const order = getOrder(req.params.id)
  if (!order) return fail(res, 404, 'Not found')

  const payload = { data: [order.offer.raw] }
  const seatMap = await amadeusPost('/v1/shopping/seatmaps', payload)

  return ok(res, seatMap)
})

router.post('/orders/:id/confirm', async (req, res) => {
  const order = getOrder(req.params.id)
  if (!order) return fail(res, 404, 'Not found')

  if (order.passengers.some(p => !p.seat)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'every passenger must have a seat')
  }

  const travelers = order.passengers.map((p, idx) => ({
    id: String(idx + 1),
    dateOfBirth: p.dateOfBirth,
    gender: p.gender,
    name: { firstName: p.firstName, lastName: p.lastName },
    contact: {
      emailAddress: 'dummy@example.com',
      phones: [{ deviceType: 'MOBILE', countryCallingCode: '358', number: '401234567' }]
    },
    documents: [
      {
        documentType: 'PASSPORT',
        birthPlace: 'Madrid',
        issuanceLocation: 'Madrid',
        number: `0000000${idx}`,
        expiryDate: '2030-01-01',
        issuanceCountry: 'ES',
        nationality: 'ES',
        validityCountry: 'ES',
        holder: true
      }
    ]
  }))

  const payload = {
    data: {
      type: 'flight-order',
      flightOffers: [order.offer.raw],
      travelers
    }
  }

  const { data, errors } = await amadeusPost<AmadeusFlightOrderResponse>(
    '/v1/booking/flight-orders',
    payload
  )

  if (errors?.[0]) {
    return fail(res, errors[0].status, errors[0].title, errors[0].detail)
  }

  markOrderConfirmed(order.id, data!)

  return ok(res, { data })
})

router.get('/orders/:id/confirmation', (req, res) => {
  const order = getOrder(req.params.id)

  if (!order?.confirmation) return fail(res, 404, 'NOT_CONFIRMED')

  return ok(res, order.confirmation)
})

export default router
