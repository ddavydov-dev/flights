// import { Router } from 'express'
// import type { Request, Response, NextFunction } from 'express'
// import { amadeusPost } from '../services/amadeusAuth.js'

// const router = Router()

// export default router

import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { createPreOrder, getPreOrder, updatePreOrderSeats } from '../services/orderStore.js'
import { amadeusPost } from '../services/amadeusAuth.js'

const router = Router()

/** POST /api/orders – create a *pre-order* and return { id } */
router.post('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { flightOffer } = req.body
    if (!flightOffer) {
      return res.status(400).json({ error: 'flightOffer required' })
    }
    const order = createPreOrder(flightOffer)
    res.status(201).json({ id: order.id })
  } catch (err) {
    next(err)
  }
})

/** GET /api/orders/:id – fetch the stored pre-order */
router.get('/orders/:id', (req: Request, res: Response) => {
  const order = getPreOrder(req.params.id)
  return order ? res.json(order) : res.status(404).json({ error: 'Not found' })
})

/** PATCH /api/orders/:id – overwrite `seats` array */
router.patch('/orders/:id', async (req: Request, res: Response) => {
  const { seats } = req.body
  const order = updatePreOrderSeats(req.params.id, seats ?? [])
  return order ? res.json(order) : res.status(404).json({ error: 'Not found' })
})

router.post('/orders/confirm', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offer = req.body
    if (!offer) {
      return res.status(400).json({ error: 'Request body must contain a flight offer' })
    }

    const payload = {
      type: 'flight-order',
      flightOffers: [offer],
      travelers: [
        {
          id: '1',
          dateOfBirth: '1990-01-01',
          name: { firstName: 'John', lastName: 'Doe' },
          gender: 'MALE',
          contact: {
            emailAddress: 'john.doe@example.com',
            phones: [{ deviceType: 'MOBILE', countryCallingCode: '358', number: '401234567' }]
          },
          documents: [
            {
              documentType: 'PASSPORT',
              number: 'XX1234567',
              expiryDate: '2030-01-01',
              issuanceCountry: 'FI',
              nationality: 'FI',
              holder: true
            }
          ]
        }
      ]
    }

    const data = await amadeusPost('/v1/booking/flight-orders', payload)
    res.json(data)
  } catch (e) {
    next(e)
  }
})

export default router
