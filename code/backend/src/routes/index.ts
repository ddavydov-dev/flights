import { Router } from 'express'
import airportsRouter from './airports.ts'
import ordersRouter from './orders.ts'
import seatMapsRouter from './seatMaps.ts'
import searchRouter from './search.ts'

const router = Router()

router.use(airportsRouter)
router.use(searchRouter)
router.use(ordersRouter)
router.use(seatMapsRouter)

export default router
