import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useOrderConfirmation(orderId: string) {
  const qc = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/orders/${orderId}/confirm`, { method: 'POST' })
      if (!res.ok) throw new Error('Could not confirm order')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['order', orderId] })
      router.push(`/orders/${orderId}/success`)
    }
  })
}
