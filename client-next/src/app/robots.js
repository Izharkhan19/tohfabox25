export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tohfabox25.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/cart',
          '/checkout',
          '/orders',
          '/orders/*',
          '/wishlist',
          '/reset-password',
          '/reset-password/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

