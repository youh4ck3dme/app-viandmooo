import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blog-posts';
import { slugify } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';

  // Statické trasy
  const staticRoutes = [
    '/',
    '/about',
    '/contact',
    '/blog',
    '/privacy-policy',
    '/stahovanie-bytov-bratislava',
    '/stahovanie-klavirov',
    '/vypratavanie-a-likvidacia',
  ].map((slug) => ({
    url: `${siteUrl}${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: slug === '/' ? 1.0 : 0.8,
  }));

  // Trasy pre blogové články (len published a public)
  const blogRoutes = blogPosts
    .filter(p => p.status === 'published' && p.visibility === 'public')
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.dateModified).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: post.isSticky ? 0.9 : 0.7,
    }));

  // Unikátne kategórie a tagy
  const categories = [...new Set(blogPosts.map((p) => p.category))];
  const tags = [...new Set(blogPosts.flatMap((p) => p.tags))];

  // Trasy pre kategórie
  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/blog/kategoria/${slugify(category)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Trasy pre tagy
  const tagRoutes = tags.map((tag) => ({
    url: `${siteUrl}/blog/tag/${slugify(tag)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // Trasy pre autorov
  const authors = [...new Set(blogPosts.map(p => p.authorName || p.author))];
  const authorRoutes = authors.map((author) => ({
    url: `${siteUrl}/blog/autor/${author.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Trasy pre dátumové archívy
  const archiveDates = new Set<string>();
  blogPosts.forEach(post => {
    const date = new Date(post.date);
    archiveDates.add(`${date.getFullYear()}`);
    archiveDates.add(`${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`);
  });

  const archiveRoutes = Array.from(archiveDates).map((date) => {
    const parts = date.split('/');
    const url = parts.length === 1 
      ? `${siteUrl}/blog/${parts[0]}`
      : `${siteUrl}/blog/${parts[0]}/${parts[1]}`;
    
    return {
      url,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    };
  });

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...categoryRoutes,
    ...tagRoutes,
    ...authorRoutes,
    ...archiveRoutes,
  ];
}
