import type { Response } from 'express'

interface Envelope<T> {
  data?: T
  error?: { code: string; message?: string }
}

export function ok<T>(res: Response, payload: T) {
  const body: Envelope<T> = { data: payload }
  return res.status(200).json(body)
}

export function fail(res: Response, httpStatus: number, code: string, message?: string) {
  const body: Envelope<never> = { error: { code, message } }
  return res.status(httpStatus).json(body)
}
