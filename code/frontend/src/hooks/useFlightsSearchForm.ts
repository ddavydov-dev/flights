import { useCallback, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useFlightsSearchParams } from './useFlightsSearchParams'

export function useFlightsSearchForm() {
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
      const p = new URLSearchParams(searchParams.toString())

      if (value === null || value === '') {
        p.delete(key)
      } else {
        p.set(key, value)
      }

      router.replace(`${pathname}?${p.toString()}`)
    },
    [pathname, router, searchParams]
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
    // sortBy: values.sortBy,
    // setSortBy,
    // sortOrder: values.sortOrder,
    // setSortOrder
  }
}
