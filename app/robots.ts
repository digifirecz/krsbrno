import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://krsbrno.cz';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/login', '/forgot-password', '/reset-password'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
