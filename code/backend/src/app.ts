import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import routes from './routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', routes)

app.use((err: unknown, _: Request, res: Response) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

export default app
