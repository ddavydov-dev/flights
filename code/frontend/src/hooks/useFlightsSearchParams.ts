import { useSearchParams } from 'next/navigation'

export function useFlightsSearchParams() {
  const sp = useSearchParams()

  const origin = sp.get('origin') ?? ''
  const destination = sp.get('destination') ?? ''
  const departureDate = sp.get('departureDate') ?? null
  const returnDate = sp.get('returnDate') ?? null
  const passengers = sp.get('passengers') ?? '1'

  return { origin, destination, departureDate, returnDate, passengers }
}
