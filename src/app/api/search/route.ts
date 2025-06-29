import { NextRequest, NextResponse } from 'next/server'

let cached: { token: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
  const now = Date.now()

  if (cached && cached.expiresAt - 60_000 > now) return cached.token

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.AMADEUS_API_KEY!,
    client_secret: process.env.AMADEUS_API_SECRET!
  })

  const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    body
  })

  if (!res.ok) throw new Error(`Auth failed: ${res.status}`)

  const { access_token, expires_in } = await res.json()
  cached = { token: access_token, expiresAt: now + expires_in * 1_000 }
  return access_token
}

/*───────────────────────────────────────────────────────────────────────────
  2. GET /api/search?origin=HEL&destination=PAR&from=2025-07-01&to=2025-07-07&passengers=1
───────────────────────────────────────────────────────────────────────────*/
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams

  const origin = q.get('origin')
  const dest = q.get('destination')
  const departureDate = q.get('departureDate')
  const returnDate = q.get('returnDate')
  const pax = q.get('passengers') ?? '1'
  const limit = q.get('limit') ?? '10'

  if (!origin || !dest || !departureDate) {
    return NextResponse.json(
      { error: 'origin, destination and departureDate are required' },
      { status: 400 }
    )
  }

  try {
    const token = await getToken()

    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: dest,
      departureDate,
      adults: pax,
      ...(returnDate ? { returnDate } : {}),
      currencyCode: 'EUR',
      max: limit
    })

    const apiRes = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await apiRes.text() // stream back as-is
    return new NextResponse(data, {
      status: apiRes.status,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'unknown error' }, { status: 500 })
  }
}
