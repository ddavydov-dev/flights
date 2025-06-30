import { Router } from 'express'
import type { Request, Response } from 'express'
import { amadeusPost } from '../services/amadeusAuth.js'
import { getPreOrder } from '../services/orderStore.js'
import { fail, ok } from '../utils/http.js'

const router = Router()

router.get('/orders/:id/seatmap', async (req: Request, res: Response) => {
  const order = getPreOrder(req.params.id)
  if (!order) return fail(res, 404, 'Not found')

  const payload = { data: [order.offer.raw] }
  const seatMap = await amadeusPost('/v1/shopping/seatmaps', payload)

  return ok(res, seatMap)
})

export default router
