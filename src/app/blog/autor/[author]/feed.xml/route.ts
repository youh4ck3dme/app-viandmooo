import { blogPosts } from '@/lib/blog-posts';
import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';

export async function GET(
  request: Request,
  { params }: { params: { author: string } }
) {
  const authorPosts = blogPosts.filter(
    p => (p.authorName || p.author).toLowerCase().replace(/\s+/g, '-') === params.author &&
         p.status === 'published' &&
         p.visibility === 'public'
  );

  if (authorPosts.length === 0) {
    return new NextResponse('Author not found', { status: 404 });
  }

  const authorName = authorPosts[0].authorName || authorPosts[0].author;

  const items = authorPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(
      (post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${siteUrl}/blog/${post.slug}</link>
        <guid isPermaLink="false">${post.guid}</guid>
        <description><![CDATA[${post.excerpt || post.summary}]]></description>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <author>${post.authorName || post.author}</author>
        <category><![CDATA[${post.category}]]></category>
        ${post.tags.map((tag) => `<category><![CDATA[${tag}]]></category>`).join('\n')}
      </item>
    `
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[VI&MO Blog - Autor: ${authorName}]]></title>
    <link>${siteUrl}/blog/autor/${params.author}</link>
    <description><![CDATA[Články autora ${authorName} na blogu VI&MO]]></description>
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

