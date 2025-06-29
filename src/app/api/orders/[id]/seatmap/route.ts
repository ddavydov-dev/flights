import { NextRequest, NextResponse } from 'next/server'
import { getOrder } from '@/lib/orders'
import { amadeusToken } from '@/lib/amadeus'

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const order = getOrder(id)
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const t = await amadeusToken()
  const seat = await fetch('https://test.api.amadeus.com/v1/shopping/seatmaps', {
    method: 'POST',
    headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [order.offer] })
  })

  return new NextResponse(await seat.text(), {
    status: seat.status,
    headers: { 'Content-Type': 'application/json' }
  })
}
