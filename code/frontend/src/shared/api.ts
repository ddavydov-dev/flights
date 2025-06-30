import { LocationDTO } from './types'

export async function fetchAirports(keyword: string): Promise<LocationDTO[]> {
  const res = await fetch(`/api/airports?keyword=${encodeURIComponent(keyword)}`)

  const { data, error } = (await res.json()) as {
    data: LocationDTO[]
    error?: { code: string; message?: string }
  }

  if (!res.ok || error) {
    throw new Error(error?.message || 'Something went wrong')
  }

  return data
}
