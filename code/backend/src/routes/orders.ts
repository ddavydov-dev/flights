import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import {
  createPreOrder,
  getPreOrder,
  markOrderConfirmed,
  updatePreOrderSeats
} from '../services/orderStore.js'
import { amadeusPost } from '../services/amadeusAuth.js'
import { fail, ok } from '../utils/http.js'
import type { AmadeusFlightOffer, AmadeusFlightOrderResponse } from '../types.js'
import { toFlightOfferDTO } from '../utils/dto.js'

const router = Router()

router.post('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { flightOffer, passengers } = req.body as {
      flightOffer?: AmadeusFlightOffer
      passengers?: string
    }
    if (!flightOffer || !passengers) {
      return fail(res, 400, 'flightOffer and passengers are required')
    }
    const order = createPreOrder(toFlightOfferDTO(flightOffer), Number(passengers))
    res.status(201).json({ id: order.id })
  } catch (err) {
    next(err)
  }
})

router.get('/orders/:id', (req: Request, res: Response) => {
  const order = getPreOrder(req.params.id)
  return order ? res.json(order) : res.status(404).json({ error: 'Not found' })
})

router.patch('/orders/:id', async (req: Request, res: Response) => {
  try {
    const { assignments } = req.body

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return fail(res, 400, 'VALIDATION_ERROR', 'assignments must be a non-empty array')
    }

    const updated = updatePreOrderSeats(req.params.id, assignments)
    return updated ? ok(res, updated) : fail(res, 404, 'Not found')
  } catch (e: any) {
    return fail(res, 400, 'ASSIGNMENT_ERROR', e.message)
  }
})

router.post('/orders/:id/confirm', async (req, res) => {
  const order = getPreOrder(req.params.id)
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
  const order = getPreOrder(req.params.id)
  return order?.confirmation ? ok(res, order.confirmation) : fail(res, 404, 'Not confirmed')
})

export default router
