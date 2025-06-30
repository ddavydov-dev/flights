import { useHotelsSearchParams } from './useHotelsSearchParams'
import { useQuery } from '@tanstack/react-query'
import { fetchHotelOffers } from '@/api/fetchHotelOffers'

export function useHotelOffers() {
  const { city, checkIn, checkOut, adults } = useHotelsSearchParams()

  return useQuery({
    queryKey: ['hotelOffers', city, checkIn, checkOut, adults],
    queryFn: () => fetchHotelOffers({ city, checkInDate: checkIn, checkOutDate: checkOut, adults }),
    enabled: !!city,
    staleTime: 0,
    retry: 1
  })
}
