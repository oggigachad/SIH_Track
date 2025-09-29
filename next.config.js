/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  experimental: {
    esmExternals: true
  },
  // Disable static optimization for pages that use context
  outputFileTracingRoot: undefined,
  
  // This prevents static optimization issues with client-only code
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  }
}

module.exports = nextConfig