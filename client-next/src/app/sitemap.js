export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tohfabox25.vercel.app';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tohfabox25.onrender.com';

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-orders`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/app-info`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let productRoutes = [];
  try {
    const res = await fetch(`${apiUrl}/api/products?limit=500&isActive=true`, {
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const json = await res.json();
      const products = json.data || json.products || [];
      if (Array.isArray(products)) {
        productRoutes = products.map((p) => ({
          url: `${baseUrl}/products/${p._id || p.id}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.warn("Failed to fetch products for sitemap, returning static routes:", error.message);
  }

  return [...staticRoutes, ...productRoutes];
}

