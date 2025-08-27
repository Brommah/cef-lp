/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Enforce ESLint in CI and production builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Fail builds on type errors
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.prod.website-files.com' },
      { protocol: 'https', hostname: 'cdn.ddcdragon.com' },
    ],
  },
  async headers() {
    return [
      // Long-cache immutable assets
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Basic CSP; expand as needed for analytics/fonts
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: https://cdn.prod.website-files.com https://cdn.ddcdragon.com",
              "script-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'self'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'geolocation=()',
              'microphone=()',
              'payment=()'
            ].join(', '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
