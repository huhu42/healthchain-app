/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  env: {
    FLOW_NETWORK: process.env.FLOW_NETWORK || 'testnet',
    COINBASE_API_KEY: process.env.COINBASE_API_KEY,
    GRAPH_API_KEY: process.env.GRAPH_API_KEY,
    X402_ENDPOINT: process.env.X402_ENDPOINT,
  },
}

module.exports = nextConfig