'use client'

import { AmadeusFlightOffer } from '@/app/types'
import { useQuery } from '@tanstack/react-query'
import { fetchSeatMap, SeatDTO } from '@/api/fetchSeatMap'

export function useSeatMap(opened: boolean, flight: AmadeusFlightOffer | null) {
  const { data: seats = [], isLoading } = useQuery<SeatDTO[], Error>({
    queryKey: ['seatMap', flight?.id],
    enabled: opened && !!flight,
    staleTime: 0,
    retry: 1,
    queryFn: () => fetchSeatMap(flight!)
  })

  return { seats, loading: isLoading }
}
