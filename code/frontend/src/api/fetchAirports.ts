import { LocationDTO } from '@/app/types'

export async function fetchAirports(keyword: string): Promise<LocationDTO[]> {
  const res = await fetch(`/api/airports?keyword=${encodeURIComponent(keyword)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const { data, error } = (await res.json()) as {
    data: LocationDTO[]
    error?: { code: string; message?: string }
  }

  if (error) throw new Error(error.code)
  return data
}
