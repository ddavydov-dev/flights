'use client'

import { useQuery } from '@tanstack/react-query'

export function useConfirmation(orderId: string) {
  return useQuery({
    queryKey: ['confirmation', orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}/confirmation`)
      if (!res.ok) throw new Error('No confirmation found')
      return res.json()
    }
  })
}
