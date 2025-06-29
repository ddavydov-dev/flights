import { AirportOption } from '@/components/AirportSelect'

export async function fetchAirports(q: string): Promise<AirportOption[]> {
  const res = await fetch(`/api/airports?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const { data, error } = (await res.json()) as {
    data: AirportOption[]
    error?: string
  }

  if (error) throw new Error(error)
  return data
}
