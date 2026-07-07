import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const appRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: appRoot,
  transpilePackages: ['@max/ui', '@max/tokens', '@max/config'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      // Google reviewer avatars (Places API authorAttribution.photoUri).
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      // Live Instagram feed (Graph API media_url/thumbnail_url) — proxied through
      // next/image so the browser never hotlinks Instagram's expiring CDN URLs directly.
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' },
      // CycleSoftware bike photos (Articledata V4 images[].url_large, e.g. cdn.cyclesoftware.nl).
      { protocol: 'https', hostname: 'cyclesoftware.nl' },
      { protocol: 'https', hostname: '*.cyclesoftware.nl' },
    ],
    // Placeholder scene/gallery assets are SVG until Nano Banana Pro assets land.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
