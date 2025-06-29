// import { Router } from 'express'
// import type { Request, Response, NextFunction } from 'express'
// import { amadeusGet, amadeusPost } from '../services/amadeusAuth.js'

// const router = Router()

// router.get('/seatmap', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const offerId = String(req.query.offerId ?? '')
//     if (!offerId) {
//       return res.status(400).json({ error: 'offerId query parameter required' })
//     }
//     const payload = { data: [{ type: 'flight-offers', id: offerId }] }
//     const data = await amadeusPost('/v1/shopping/seatmaps', payload)
//     res.json(data?.data ?? [])
//   } catch (e) {
//     next(e)
//   }
// })

// router.get('/orders/:id/seatmap', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const orderId = req.params.id
//     const data = await amadeusGet(`/v1/shopping/seatmaps/${orderId}`, {})
//     res.json(data?.data ?? [])
//   } catch (e) {
//     next(e)
//   }
// })

// export default router

import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { amadeusPost, amadeusGet } from '../services/amadeusAuth.js'
import { getPreOrder } from '../services/orderStore.js'

const router = Router()

/** GET /api/orders/:id/seatmap – same as the former Next API handler */
router.get('/orders/:id/seatmap', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = getPreOrder(req.params.id)
    if (!order) return res.status(404).json({ error: 'Not found' })

    const payload = { data: [order.offer] } // identical to frontend code
    console.log('🐟 payload:', JSON.stringify(payload))
    const seatMap = await amadeusPost('/v1/shopping/seatmaps', payload)

    res.json(seatMap)
  } catch (err) {
    next(err)
  }
})

export default router
