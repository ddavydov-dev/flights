import { useMutation } from '@tanstack/react-query'
import { AmadeusFlightOffer } from '@/app/types'

export const useCreateOrder = () =>
  useMutation<{ id: string }, Error, AmadeusFlightOffer>({
    mutationFn: async flightOffer => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ flightOffer })
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    }
  })
