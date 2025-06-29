import { useQuery } from '@tanstack/react-query'
import { Order } from '@/lib/orders'

export const useOrder = (id: string) =>
  useQuery<Order, Error>({
    queryKey: ['order', id],
    queryFn: async () => {
      const r = await fetch(`/api/orders/${id}`)
      if (!r.ok) throw new Error(await r.text())
      return r.json()
    }
  })
