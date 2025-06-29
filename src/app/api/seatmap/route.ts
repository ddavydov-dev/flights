import { NextRequest, NextResponse } from 'next/server'

let cache: { token: string; exp: number } | null = null
async function token() {
  const now = Date.now()
  if (cache && cache.exp - 60_000 > now) return cache.token

  const form = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.AMADEUS_API_KEY!,
    client_secret: process.env.AMADEUS_API_SECRET!
  })

  const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    body: form
  })
  const j = await res.json()
  cache = { token: j.access_token, exp: now + j.expires_in * 1000 }
  return j.access_token
}

export async function POST(req: NextRequest) {
  const { flightOffer } = await req.json()
  if (!flightOffer) return NextResponse.json({ error: 'flightOffer required' }, { status: 400 })

  console.log('🧑‍🎄 flightOffer:', flightOffer)
  const t = await token()
  const seat = await fetch('https://test.api.amadeus.com/v1/shopping/seatmaps', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${t}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: [flightOffer]
    })
  })

  return new NextResponse(await seat.text(), {
    status: seat.status,
    headers: { 'Content-Type': 'application/json' }
  })
}
