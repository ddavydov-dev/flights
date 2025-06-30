import { z } from 'zod'
import { fail } from '../utils/http'
import type { Request, Response, NextFunction } from 'express'

export function validate<T>(schema: z.ZodSchema<T>, source: 'query' | 'body' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[source])
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join('; ')
      return fail(res, 400, 'VALIDATION_ERROR', msg)
    }
    req[source] = parsed.data
    next()
  }
}

export const flightSearchSchema = z
  .object({
    originLocationCode: z.string().regex(/^[A-Z]{3}$/),
    destinationLocationCode: z.string().regex(/^[A-Z]{3}$/),
    departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    returnDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .nullable()
      .refine(v => !v || v >= '2025-01-01', {
        message: 'returnDate must be valid'
      }),
    passengers: z.coerce.number().int().min(1).max(9),
    sortBy: z.enum(['price', 'duration']).default('price'),
    sortOrder: z.enum(['asc', 'desc']).default('asc')
  })
  .superRefine((data, ctx) => {
    if (data.returnDate && data.returnDate < data.departureDate) {
      ctx.addIssue({
        path: ['returnDate'],
        code: 'custom',
        message: 'returnDate must be after or same as departureDate'
      })
    }
  })

export const hotelSearchSchema = z
  .object({
    city: z.string().regex(/^[A-Z]{3}$/),
    checkInDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .nullable(),
    checkOutDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .nullable(),
    adults: z.coerce.number().int().min(1).max(9).default(1)
  })
  .superRefine((data, ctx) => {
    if (data.checkOutDate && data.checkInDate && data.checkOutDate <= data.checkInDate) {
      ctx.addIssue({
        path: ['checkOutDate'],
        code: 'custom',
        message: 'checkOutDate must be after checkInDate'
      })
    }
  })

export const airportSearchSchema = z.object({
  keyword: z.string().trim().min(1, 'keyword is required')
})

export const nearbyAirportSchema = z.object({
  lat: z.preprocess(
    val => (Array.isArray(val) ? val[0] : val),
    z.coerce.number().min(-90).max(90).finite()
  ),
  lng: z.preprocess(
    val => (Array.isArray(val) ? val[0] : val),
    z.coerce.number().min(-180).max(180).finite()
  )
})
