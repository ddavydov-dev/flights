'use client'

import { Group, SegmentedControl } from '@mantine/core'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const ORIGIN_KEY = 'lastOrigin'

function flightToHotel(sp: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams()
  const origin = sp.get('origin') ?? ''
  const destination = sp.get('destination') ?? ''
  const departureDate = sp.get('departureDate') ?? null
  const returnDate = sp.get('returnDate') ?? null
  const passengers = sp.get('passengers') ?? '1'

  if (origin) sessionStorage.setItem(ORIGIN_KEY, origin)

  next.set('city', destination)
  if (departureDate) next.set('checkIn', departureDate)
  if (returnDate) next.set('checkOut', returnDate)
  next.set('adults', passengers)

  return next
}

function hotelToFlight(sp: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams()
  const origin = sessionStorage.getItem(ORIGIN_KEY) ?? ''
  const destination = sp.get('city') ?? ''
  const departureDate = sp.get('checkIn') ?? ''
  const returnDate = sp.get('checkOut') ?? ''
  const passengers = sp.get('adults') ?? '1'

  if (origin) next.set('origin', origin)
  next.set('destination', destination)
  if (departureDate) next.set('departureDate', departureDate)
  if (returnDate) next.set('returnDate', returnDate)
  next.set('passengers', passengers)

  return next
}

export default function Tabs() {
  const view = usePathname().slice(1)
  const params = useSearchParams()

  const router = useRouter()
  const handleToggle = useCallback(
    (view: string) => {
      let nextParams: URLSearchParams

      switch (view) {
        case 'flights':
          nextParams = hotelToFlight(params)
          break
        case 'hotels':
          nextParams = flightToHotel(params)
          break
        default:
          nextParams = params
      }

      router.push(`/${view}?${nextParams.toString()}`)
    },
    [router, params]
  )

  return (
    <Group justify="left" mb={20}>
      <SegmentedControl
        data={[
          { label: 'Flights', value: 'flights' },
          { label: 'Hotels', value: 'hotels' }
        ]}
        value={view}
        onChange={handleToggle}
        w={240}
      />
    </Group>
  )
}
