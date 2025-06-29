import type { NextConfig } from 'next'

const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

if (!backend.startsWith('/') && !backend.startsWith('http://') && !backend.startsWith('https://')) {
  throw new Error(
    `NEXT_PUBLIC_BACKEND_URL must start with /, http:// or https:// — got "${backend}"`
  )
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`
      }
    ]
  }
}

export default nextConfig
