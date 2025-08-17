// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_VALHALLA_URL: process.env.NEXT_PUBLIC_VALHALLA_URL || 'https://valhalla1.openstreetmap.de/route',
    NEXT_PUBLIC_USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API || 'false',
    NEXT_PUBLIC_DEBUG_ROUTING: process.env.NEXT_PUBLIC_DEBUG_ROUTING || 'false',
  },

  // Image optimization
  images: {
    domains: [
      'tile.openstreetmap.org',
      'a.tile.openstreetmap.org',
      'b.tile.openstreetmap.org',
      'c.tile.openstreetmap.org',
    ],
  },

  // Webpack configuration for Leaflet and routing libraries
  webpack: (config: { resolve: { fallback: any; alias: any; }; }, { isServer }: any) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };

      // Alias for any potential module resolution issues
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  },

  // Headers for CORS and external API access
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      {
        // Security headers
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Rewrites for potential API proxying (if needed for CORS)
  async rewrites() {
    return [
      // Proxy for Valhalla API if CORS becomes an issue
      {
        source: '/api/routing/:path*',
        destination: `${process.env.NEXT_PUBLIC_VALHALLA_URL || 'https://valhalla1.openstreetmap.de/route'}/:path*`,
      },
      // Proxy for backend API if needed
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/:path*`,
      },
    ];
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Output configuration
  output: 'standalone',

  // Performance optimizations
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Compress responses
  compress: true,

  // Power optimizations
  poweredByHeader: false,

  // Generate ETags
  generateEtags: true,

  // Custom page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Trailing slash configuration
  trailingSlash: false,

  // Asset prefix for CDN
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.example.com' : '',

  // Custom build directory
  // distDir: 'build',

  // TypeScript configuration
  typescript: {
    // Ignore type errors during build (not recommended for production)
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Ignore ESLint errors during build (not recommended for production)
    ignoreDuringBuilds: false,
    // Directories to run ESLint on
    dirs: ['pages', 'components', 'lib', 'src', 'app'],
  },

  // Source maps
  productionBrowserSourceMaps: process.env.NODE_ENV !== 'production',

  // Bundle analyzer (uncomment to analyze bundle)
  // ...(process.env.ANALYZE === 'true' && {
  //   webpack: (config: any) => {
  //     const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  //     config.plugins.push(
  //       new BundleAnalyzerPlugin({
  //         analyzerMode: 'static',
  //         openAnalyzer: false,
  //       })
  //     );
  //     return config;
  //   },
  // }),
};

module.exports = nextConfig;