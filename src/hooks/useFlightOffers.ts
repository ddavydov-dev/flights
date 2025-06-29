import { fetchFlightOffers } from '@/api/fetchFlightOffers'
import { useQuery } from '@tanstack/react-query'
import { useFlightsSearchParams } from './useFlightsSearchParams'

export function useFlightOffers() {
  const params = useFlightsSearchParams()
  return useQuery({
    queryKey: [
      'flightOffers',
      params.origin,
      params.destination,
      params.departureDate,
      params.returnDate,
      params.passengers
    ],
    queryFn: () => fetchFlightOffers(params),
    enabled: !!params.origin && !!params.destination && !!params.departureDate,
    staleTime: 0
  })
}
