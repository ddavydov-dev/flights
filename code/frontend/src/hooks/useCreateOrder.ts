import { useMutation } from '@tanstack/react-query'
import { AmadeusFlightOffer } from '@/app/types'

export const useCreateOrder = () =>
  useMutation<{ id: string }, Error, { flightOffer: AmadeusFlightOffer; passengers: string }>({
    mutationFn: async payload => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    }
  })
