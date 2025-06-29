import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/orders'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { flightOffer } = await req.json()
  if (!flightOffer) {
    return NextResponse.json({ error: 'flightOffer required' }, { status: 400 })
  }
  const order = createOrder(flightOffer)
  return NextResponse.json({ id: order.id })
}
