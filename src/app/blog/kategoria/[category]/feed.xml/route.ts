import { blogPosts } from '@/lib/blog-posts';
import { slugify } from '@/lib/utils';
import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  const categoryName = blogPosts.find(p => slugify(p.category) === params.category)?.category;
  
  if (!categoryName) {
    return new NextResponse('Category not found', { status: 404 });
  }

  const items = blogPosts
    .filter(
      (p) => slugify(p.category) === params.category &&
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
    <title><![CDATA[VI&MO Blog - ${categoryName}]]></title>
    <link>${siteUrl}/blog/kategoria/${params.category}</link>
    <description><![CDATA[Články v kategórii ${categoryName} na blogu VI&MO]]></description>
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

