'use client'

import { AmadeusFlightOrder } from '@/app/types'
import { useQuery } from '@tanstack/react-query'

export function useConfirmation(orderId: string) {
  return useQuery({
    queryKey: ['confirmation', orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}/confirmation`)
      if (!res.ok) throw new Error('No confirmation found')
      return (await res.json()) as { data: AmadeusFlightOrder }
    }
  })
}
