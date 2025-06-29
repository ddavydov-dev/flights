import { toTitleCasePreserveCode } from '@/app/utils'
import { NextRequest, NextResponse } from 'next/server'

let cache: { token: string; exp: number } | null = null
async function token() {
  const now = Date.now()
  if (cache && cache.exp - 60_000 > now) return cache.token

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.AMADEUS_API_KEY!,
    client_secret: process.env.AMADEUS_API_SECRET!
  })
  const r = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    body
  })
  const j = await r.json()
  cache = { token: j.access_token, exp: now + j.expires_in * 1_000 }
  return j.access_token
}

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')
  if (!q || q.length < 2) return NextResponse.json({ data: [] }, { status: 200 })

  const t = await token()
  const params = new URLSearchParams({
    subType: 'AIRPORT,CITY',
    keyword: q,
    'page[limit]': '10'
  })
  const api = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?${params}`, {
    headers: { Authorization: `Bearer ${t}` }
  })

  const j = await api.json()
  const raw = j.data ?? []

  /* deduplicate by IATA code */
  const seen = new Set<string>()
  const list = raw
    .map((d: any) => ({
      iata: d.iataCode,
      name: toTitleCasePreserveCode(d.name),
      city: toTitleCasePreserveCode(d.address?.cityName),
      label: toTitleCasePreserveCode(`${d.address?.cityName ?? d.name} (${d.iataCode})`),
      country: toTitleCasePreserveCode(d.address.countryName)
    }))
    .filter((item: { iata: string }) => {
      if (seen.has(item.iata)) return false
      seen.add(item.iata)
      return true
    })

  return NextResponse.json({ data: list }, { status: 200 })
}
