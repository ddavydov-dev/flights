import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { fetchFlightOffers } from './api'

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

export function useFlightsSearchForm(syncToUrl = false) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const values = useFlightsSearchParams()
  const [origin, setOriginDraft] = useState(values.originLocationCode)
  const [destination, setDestinationDraft] = useState(values.destinationLocationCode)
  const [departureDate, setDepartureDateDraft] = useState(values.departureDate)
  const [returnDate, setReturnDateDraft] = useState(values.returnDate)
  const [passengers, setPassengersDraft] = useState(values.passengers)

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      if (!syncToUrl) return
      const p = new URLSearchParams(searchParams.toString())

      if (value === null || value === '') {
        p.delete(key)
      } else {
        p.set(key, value)
      }

      router.replace(`${pathname}?${p.toString()}`)
    },
    [pathname, router, searchParams, syncToUrl]
  )

  const setOrigin = useCallback(
    (v: string) => {
      setOriginDraft(v)
      updateParam('origin', v)
    },
    [updateParam]
  )
  const setDestination = useCallback(
    (v: string) => {
      setDestinationDraft(v)
      updateParam('destination', v)
    },
    [updateParam]
  )
  const setDepartureDate = useCallback(
    (v: string | null) => {
      setDepartureDateDraft(v)
      updateParam('departureDate', v)
    },
    [updateParam]
  )
  const setReturnDate = useCallback(
    (v: string | null) => {
      setReturnDateDraft(v)
      updateParam('returnDate', v)
    },
    [updateParam]
  )

  const setPassengers = useCallback(
    (v: number) => {
      setPassengersDraft(v.toString())
      updateParam('passengers', v.toString())
    },
    [updateParam]
  )

  return {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    setOrigin,
    setDestination,
    setDepartureDate,
    setReturnDate,
    setPassengers
  }
}

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
