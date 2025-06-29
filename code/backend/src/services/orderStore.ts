export interface PreOrder {
  id: string
  offer: unknown
  seats: string[]
}

const orders = new Map<string, PreOrder>()

export function createPreOrder(offer: unknown): PreOrder {
  const id = crypto.randomUUID()
  const order: PreOrder = { id, offer, seats: [] }
  orders.set(id, order)
  return order
}

export function getPreOrder(id: string): PreOrder | null {
  return orders.get(id) ?? null
}

export function updatePreOrderSeats(id: string, seats: string[]): PreOrder | null {
  const o = orders.get(id)
  if (o) o.seats = seats
  return o ?? null
}
