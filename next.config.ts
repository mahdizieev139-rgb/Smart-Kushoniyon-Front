import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Allow <Image> to load product/shop photos served by the backend (local dev
  // uploads on :4000) and any future S3/CDN host. Add production hosts here.
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/uploads/**' },
    ],
  },
};

// Wrap the config so next-intl can wire up message loading (src/i18n/request.ts).
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
