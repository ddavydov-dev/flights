import { Airport } from '@/hooks/useOrigin'

export async function fetchAirports(keyword: string): Promise<Airport[]> {
  const res = await fetch(`/api/airports?keyword=${encodeURIComponent(keyword)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const { data, error } = (await res.json()) as {
    data: Airport[]
    error?: string
  }

  if (error) throw new Error(error)
  return data
}
