import { blogPosts } from '@/lib/blog-posts';
import { slugify } from '@/lib/utils';
import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  const tagName = blogPosts.flatMap(p => p.tags).find(t => slugify(t) === params.tag);
  
  if (!tagName) {
    return new NextResponse('Tag not found', { status: 404 });
  }

  const items = blogPosts
    .filter(
      (p) => p.tags.some(t => slugify(t) === params.tag) &&
             p.status === 'published' &&
             p.visibility === 'public'
    )
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
        ${post.tags.map((tag) => `<category><![CDATA[${tag}]]></category>`).join('\n')}
      </item>
    `
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[VI&MO Blog - Tag: ${tagName}]]></title>
    <link>${siteUrl}/blog/tag/${params.tag}</link>
    <description><![CDATA[Články s tagom ${tagName} na blogu VI&MO]]></description>
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

