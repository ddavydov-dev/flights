import { AmadeusHotelOffer, Hotel } from '@/app/types'

export async function fetchHotelOffers(
  city: string,
  checkIn: string | null,
  checkOut: string | null,
  adults: string
): Promise<Hotel[]> {
  const qs = new URLSearchParams({
    city,
    ...(checkIn ? { checkInDate: checkIn } : {}),
    ...(checkOut ? { checkOutDate: checkOut } : {}),
    adults
  })

  const res = await fetch(`/api/search/hotels?${qs}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const { data } = (await res.json()) as { data: AmadeusHotelOffer[] }

  return data.map(h => {
    const offer = h.offers[0]
    return {
      id: h.hotel.hotelId,
      name: h.hotel.name,
      price: offer.price.total,
      currency: offer.price.currency,
      room: offer.room?.typeEstimated?.category ?? '',
      board: offer.boardType ?? '',
      offerId: offer.id
    }
  })
}
