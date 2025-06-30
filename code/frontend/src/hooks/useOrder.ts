import { Order } from '@/app/types'
import { useQuery } from '@tanstack/react-query'

export const useOrder = (id: string) =>
  useQuery<Order, Error>({
    queryKey: ['order', id],
    queryFn: async () => {
      const r = await fetch(`/api/orders/${id}`)
      if (!r.ok) throw new Error(await r.text())
      return r.json()
    }
  })
