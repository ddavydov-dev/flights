import { fetchFlightOffers } from '@/api/fetchFlightOffers'
import { useQuery } from '@tanstack/react-query'
import { useFlightsSearchParams } from './useFlightsSearchParams'

export function useFlightOffers() {
  const params = useFlightsSearchParams()
  return useQuery({
    queryKey: [
      'flightOffers',
      params.originLocationCode,
      params.destinationLocationCode,
      params.departureDate,
      params.returnDate,
      params.passengers,
      params.sortBy,
      params.sortOrder
    ],
    queryFn: () => fetchFlightOffers(params),
    enabled:
      !!params.originLocationCode &&
      !!params.destinationLocationCode &&
      !!params.departureDate &&
      !!params.passengers,
    staleTime: 0
  })
}
