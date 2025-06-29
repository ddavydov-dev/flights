// lib/amadeus.ts
let cache: { token: string; exp: number } | null = null

export async function amadeusToken(): Promise<string> {
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
