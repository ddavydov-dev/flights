import { haversine } from '@/app/utils'
import { NextRequest, NextResponse } from 'next/server'

export const fallback = [
  {
    iata: 'HEL',
    name: 'Helsinki-Vantaa',
    label: 'Helsinki-Vantaa (HEL)',
    lat: 60.3172,
    lon: 24.9633,
    city: 'Helsinki',
    country: 'Finland'
  },
  {
    iata: 'TLL',
    name: 'Lennart Meri Tallinn',
    label: 'Lennart Meri Tallinn (TLL)',
    lat: 59.4133,
    lon: 24.8328,
    city: 'Tallinn',
    country: 'Estonia'
  },
  {
    iata: 'RIX',
    name: 'Riga International',
    label: 'Riga International (RIX)',
    lat: 56.9236,
    lon: 23.9711,
    city: 'Riga',
    country: 'Latvia'
  },
  {
    iata: 'VNO',
    name: 'Vilnius International',
    label: 'Vilnius International (VNO)',
    lat: 54.6341,
    lon: 25.2858,
    city: 'Vilnius',
    country: 'Lithuania'
  },
  {
    iata: 'MSQ',
    name: 'Minsk National',
    label: 'Minsk National (MSQ)',
    lat: 53.8825,
    lon: 28.0307,
    city: 'Minsk',
    country: 'Belarus'
  },
  {
    iata: 'WAW',
    name: 'Warsaw Chopin',
    label: 'Warsaw Chopin (WAW)',
    lat: 52.1657,
    lon: 20.9671,
    city: 'Warsaw',
    country: 'Poland'
  },
  {
    iata: 'KRK',
    name: 'John Paul II Kraków-Balice',
    label: 'John Paul II Kraków-Balice (KRK)',
    lat: 50.0777,
    lon: 19.7848,
    city: 'Kraków',
    country: 'Poland'
  },
  {
    iata: 'PRG',
    name: 'Václav Havel Prague',
    label: 'Václav Havel Prague (PRG)',
    lat: 50.1008,
    lon: 14.26,
    city: 'Prague',
    country: 'Czech Republic'
  },
  {
    iata: 'BUD',
    name: 'Budapest Ferenc Liszt',
    label: 'Budapest Ferenc Liszt (BUD)',
    lat: 47.4369,
    lon: 19.2556,
    city: 'Budapest',
    country: 'Hungary'
  },
  {
    iata: 'OTP',
    name: 'Henri Coandă International',
    label: 'Henri Coandă International (OTP)',
    lat: 44.5711,
    lon: 26.085,
    city: 'Bucharest',
    country: 'Romania'
  },
  {
    iata: 'SOF',
    name: 'Sofia',
    label: 'Sofia (SOF)',
    lat: 42.6967,
    lon: 23.4114,
    city: 'Sofia',
    country: 'Bulgaria'
  },
  {
    iata: 'SJJ',
    name: 'Sarajevo International',
    label: 'Sarajevo International (SJJ)',
    lat: 43.8246,
    lon: 18.3315,
    city: 'Sarajevo',
    country: 'Bosnia and Herzegovina'
  },
  {
    iata: 'SKP',
    name: 'Skopje International',
    label: 'Skopje International (SKP)',
    lat: 41.9616,
    lon: 21.6214,
    city: 'Skopje',
    country: 'North Macedonia'
  },
  {
    iata: 'TGD',
    name: 'Podgorica',
    label: 'Podgorica (TGD)',
    lat: 42.3594,
    lon: 19.2519,
    city: 'Podgorica',
    country: 'Montenegro'
  },
  {
    iata: 'TIA',
    name: 'Tirana International',
    label: 'Tirana International (TIA)',
    lat: 41.4147,
    lon: 19.7206,
    city: 'Tirana',
    country: 'Albania'
  },
  {
    iata: 'BEG',
    name: 'Belgrade Nikola Tesla',
    label: 'Belgrade Nikola Tesla (BEG)',
    lat: 44.8184,
    lon: 20.3091,
    city: 'Belgrade',
    country: 'Serbia'
  },
  {
    iata: 'KIV',
    name: 'Chișinău International',
    label: 'Chișinău International (KIV)',
    lat: 46.9278,
    lon: 28.9309,
    city: 'Chișinău',
    country: 'Moldova'
  },
  {
    iata: 'LWO',
    name: 'Lviv Danylo Halytskyi',
    label: 'Lviv Danylo Halytskyi (LWO)',
    lat: 49.8125,
    lon: 23.9561,
    city: 'Lviv',
    country: 'Ukraine'
  },
  {
    iata: 'ODS',
    name: 'Odessa International',
    label: 'Odessa International (ODS)',
    lat: 46.4268,
    lon: 30.6765,
    city: 'Odessa',
    country: 'Ukraine'
  },
  {
    iata: 'IEV',
    name: 'Kyiv Zhuliany International',
    label: 'Kyiv Zhuliany International (IEV)',
    lat: 50.4017,
    lon: 30.4497,
    city: 'Kyiv',
    country: 'Ukraine'
  }
]

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAmadeusToken(): Promise<string> {
  const now = Date.now()

  if (cachedToken && cachedToken.expiresAt - 60_000 > now) {
    return cachedToken.token // still valid
  }

  const form = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.AMADEUS_API_KEY!,
    client_secret: process.env.AMADEUS_API_SECRET!
  })

  const authResp = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form
  })

  if (!authResp.ok) {
    const err = await authResp.text()
    throw new Error(`Amadeus auth failed: ${err}`)
  }

  const { access_token, expires_in } = await authResp.json()
  cachedToken = { token: access_token, expiresAt: now + expires_in * 1000 }

  return access_token
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const lat = url.searchParams.get('lat')
  const lng = url.searchParams.get('lng')

  if (!lat || !lng || isNaN(+lat) || isNaN(+lng)) {
    return NextResponse.json({ error: 'Invalid lat/lng values' }, { status: 400 })
  }

  try {
    const token = await getAmadeusToken()

    const params = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      radius: '200',
      'page[limit]': '6'
    })

    const apiResp = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/airports?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const data = await apiResp.json()

    const airports = data.length ? data : fallback

    const sorted = airports
      .map(a => ({
        ...a,
        distKm: haversine(+lat, +lng, a.lat, a.lon) / 1000
      }))
      .filter(a => a.distKm <= 500)
      .sort((a, b) => a.distKm - b.distKm)
      .slice(0, 6)

    return NextResponse.json(sorted, { status: apiResp.status })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }

    throw err
  }
}
