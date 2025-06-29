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
  if (!r.ok) throw new Error(`auth failed ${r.status}`)
  const j = await r.json()
  cache = { token: j.access_token, exp: now + j.expires_in * 1_000 }
  return j.access_token
}

export async function GET(req: NextRequest) {
  const p = new URL(req.url).searchParams
  const city = p.get('city')
  const checkInDate = p.get('checkIn')
  const checkOutDate = p.get('checkOut')
  const adults = p.get('adults') ?? '1'

  if (!city) {
    return NextResponse.json({ error: 'city is required' }, { status: 400 })
  }

  const t = await token()
  const cityParams = new URLSearchParams({
    cityCode: city,
    radius: '5',
    radiusUnit: 'KM'
  })
  const cityRes = await fetch(
    `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?${cityParams}`,
    { headers: { Authorization: `Bearer ${t}` } }
  )
  if (!cityRes.ok) {
    return NextResponse.json(await cityRes.json(), { status: cityRes.status })
  }
  const cityJson = await cityRes.json()
  const hotelIds = cityJson.data
    .map((h: any) => h.hotelId)
    .slice(0, 20)
    .join(',')
  if (!hotelIds) {
    return NextResponse.json({ data: [], meta: cityJson.meta }, { status: 200 })
  }

  const offerParams = new URLSearchParams({
    hotelIds,
    ...(checkInDate ? { checkInDate } : {}),
    ...(checkOutDate ? { checkOutDate } : {}),
    adults,
    roomQuantity: '1',
    bestRateOnly: 'true',
    currency: 'EUR'
  })
  console.log('👨‍🎤 offerParams:', offerParams)
  const offerRes = await fetch(
    `https://test.api.amadeus.com/v3/shopping/hotel-offers?${offerParams}`,
    { headers: { Authorization: `Bearer ${t}` } }
  )
  console.log('❤️‍🔥 offerRes:', offerRes)
  const body = await offerRes.json()

  if (!('data' in body)) {
    return NextResponse.json(
      { data: [] },
      {
        status: offerRes.status
      }
    )
  }

  return NextResponse.json(body, {
    status: offerRes.status
  })
}
