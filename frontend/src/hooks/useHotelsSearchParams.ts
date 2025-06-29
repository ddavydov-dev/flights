import { useSearchParams } from 'next/navigation'

export function useHotelsSearchParams() {
  const sp = useSearchParams()

  const city = sp.get('city') ?? ''
  const checkIn = sp.get('checkIn') ?? null
  const checkOut = sp.get('checkOut') ?? null
  const adults = sp.get('adults') ?? '1'

  return { city, checkIn, checkOut, adults }
}
