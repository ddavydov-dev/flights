import { AmadeusFlightOffer } from '@/app/types'

export interface Order {
  id: string
  offer: AmadeusFlightOffer
  seats: string[]
}

declare global {
  var _ordersSingleton: Map<string, Order> | undefined
}
const orders = global._ordersSingleton ?? (global._ordersSingleton = new Map<string, Order>())

export function createOrder(offer: AmadeusFlightOffer): Order {
  const id = crypto.randomUUID()
  const order: Order = { id, offer, seats: [] }
  console.log('🌋 order:', order)
  orders.set(id, order)
  console.log('🧅 orders:', orders)
  return order
}

export function getOrder(id: string) {
  console.log('🧑‍🦰 id:', id)
  console.log('🤣 orders:', orders)
  return orders.get(id) ?? null
}

export function updateSeats(id: string, seats: string[]) {
  const o = orders.get(id)
  if (o) o.seats = seats
  return o
}
