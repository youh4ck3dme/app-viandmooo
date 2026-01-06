import { NextResponse } from 'next/server';
import { blogPosts } from '@/lib/blog-posts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const siteTitle = 'VI&MO Blog - Sťahovanie v Bratislave';
const siteDescription =
  'Kompletný blog o sťahovaní v Bratislave. Praktické tipy, návody a rady od profesionálov.';

export const revalidate = 60 * 60; // 1 hodina

export async function GET() {
  const items = blogPosts
    .filter((p) => p.status === 'published' && p.visibility === 'public')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(
      (post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${siteUrl}/blog/${post.slug}</link>
        <guid isPermaLink="false">${post.guid}</guid>
        <description><![CDATA[${post.excerpt || post.summary}]]></description>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <category><![CDATA[${post.category}]]></category>
        ${post.tags
          .map((tag) => `<category><![CDATA[${tag}]]></category>`)
          .join('\n')}
      </item>
    `
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${siteTitle}]]></title>
    <link>${siteUrl}/blog</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>sk</language>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=3600',
    },
  });
}

