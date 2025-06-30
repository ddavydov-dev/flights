import { useCallback, useState } from 'react'
import { useHotelsSearchParams } from './useHotelsSearchParams'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from '@mantine/hooks'

export function useHotelsSearchForm() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const values = useHotelsSearchParams()
  const [city, setCityDraft] = useState(values.city)
  const [checkIn, setCheckInDraft] = useState(values.checkIn)
  const [checkOut, setCheckOutDraft] = useState(values.checkOut)
  const [adults, setAdultsDraft] = useState(values.adults)

  const updateParam = useDebouncedCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(searchParams.toString())

    if (value === null || value === '') {
      p.delete(key)
    } else {
      p.set(key, value)
    }

    router.replace(`${pathname}?${p.toString()}`)
  }, 400)

  const setCity = useCallback(
    (v: string) => {
      setCityDraft(v)
      updateParam('city', v)
    },
    [updateParam]
  )
  const setCheckIn = useCallback(
    (v: string | null) => {
      setCheckInDraft(v)
      updateParam('checkIn', v)
    },
    [updateParam]
  )
  const setCheckOut = useCallback(
    (v: string | null) => {
      setCheckOutDraft(v)
      updateParam('checkOut', v)
    },
    [updateParam]
  )
  const setAdults = useCallback(
    (v: number) => {
      setAdultsDraft(v.toString())
      updateParam('adults', v.toString())
    },
    [updateParam]
  )

  return { city, checkIn, checkOut, adults, setCity, setCheckIn, setCheckOut, setAdults }
}
