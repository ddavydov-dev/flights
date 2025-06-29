import { NextRequest, NextResponse } from 'next/server'
import { getOrder, updateSeats } from '@/lib/orders'

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const order = getOrder(id)
  return order
    ? NextResponse.json(order)
    : NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params

  const { seats } = await req.json()
  const order = updateSeats(id, seats ?? [])
  return order
    ? NextResponse.json(order)
    : NextResponse.json({ error: 'Not found' }, { status: 404 })
}
