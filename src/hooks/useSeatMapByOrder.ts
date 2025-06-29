import { fetchSeatMapByOrder, SeatDTO } from '@/api/fetchSeatMap'
import { useQuery } from '@tanstack/react-query'

export const useSeatMapByOrder = (id: string) =>
  useQuery<SeatDTO[], Error>({
    queryKey: ['seatMap', id],
    enabled: !!id,
    queryFn: async () => fetchSeatMapByOrder(id),
    staleTime: 0
  })
