import { useSearchParams } from 'next/navigation'

export function useFlightsSearchParams() {
  const sp = useSearchParams()

  const originLocationCode = sp.get('origin') ?? ''
  const destinationLocationCode = sp.get('destination') ?? ''
  const departureDate = sp.get('departureDate') ?? null
  const returnDate = sp.get('returnDate') ?? null
  const passengers = sp.get('passengers') ?? '1'
  const sortBy = sp.get('sort') ?? 'price'
  const sortOrder = sp.get('order') ?? 'asc'

  return {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    passengers,
    sortBy,
    sortOrder
  }
}
