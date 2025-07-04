const TOKEN_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token'
const clientId = process.env.AMADEUS_CLIENT_ID ?? ''
const clientSecret = process.env.AMADEUS_CLIENT_SECRET ?? ''

let accessToken = ''
let expiresAt = 0

export async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  if (accessToken && now < expiresAt - 30) return accessToken

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret
  })

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token request failed (${res.status}): ${text}`)
  }

  const json: { access_token: string; expires_in: number } = await res.json()
  accessToken = json.access_token
  expiresAt = now + json.expires_in
  return accessToken
}

export async function amadeusGet<T>(
  path: string,
  params: Record<string, string | number>
): Promise<T> {
  const token = await getAccessToken()
  const qs = new URLSearchParams(params as Record<string, string>).toString()
  const url = `https://test.api.amadeus.com${path}?${qs}`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return res.json()
}

export async function amadeusPost<T>(path: string, payload: unknown): Promise<T> {
  const token = await getAccessToken()
  const url = `https://test.api.amadeus.com${path}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  return res.json()
}
