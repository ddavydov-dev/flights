import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export interface Airport {
  name: string
  iata: string
  label: string
  city: string
  country: string
}

function getCoords(): Promise<{ lat: number; lng: number } | null> {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      () => resolve(null)
    )
  })
}

export function useOrigin(enabled = true) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    getCoords().then(c => !cancelled && setCoords(c))
    return () => {
      cancelled = true
    }
  }, [enabled])

  return useQuery<Airport[]>({
    queryKey: coords
      ? ['nearest-airports', coords.lat, coords.lng]
      : ['nearest-airports', 'no-coords'],
    queryFn: async () => {
      if (!coords) return []
      const res = await fetch(`/api/airports/nearby?lat=${coords.lat}&lng=${coords.lng}`)
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    enabled: false,
    // enabled: !!coords && enabled,
    staleTime: 1000 * 60 * 60,
    retry: 1,
    placeholderData: keepPreviousData
  })
}
