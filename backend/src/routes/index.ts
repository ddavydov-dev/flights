import { Router } from 'express'
import airportsRouter from './airports'
import ordersRouter from './orders'
import seatMapsRouter from './seatMaps'
import searchRouter from './search.js'

const router = Router()

router.use(airportsRouter)
router.use(searchRouter)
router.use(ordersRouter)
router.use(seatMapsRouter)

export default router
