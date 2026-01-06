import { blogPosts } from '@/lib/blog-posts';
import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';

export async function GET(
  request: Request,
  { params }: { params: { year: string; month: string } }
) {
  const year = parseInt(params.year);
  const month = parseInt(params.month);
  
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return new NextResponse('Invalid date', { status: 400 });
  }

  const monthNames = [
    'január', 'február', 'marec', 'apríl', 'máj', 'jún',
    'júl', 'august', 'september', 'október', 'november', 'december'
  ];

  const items = blogPosts
    .filter(post => {
      const postDate = new Date(post.date);
      return postDate.getFullYear() === year &&
             postDate.getMonth() + 1 === month &&
             post.status === 'published' &&
             post.visibility === 'public';
    })
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

  const monthName = monthNames[month - 1];

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[VI&MO Blog - Archív: ${monthName} ${year}]]></title>
    <link>${siteUrl}/blog/${year}/${String(month).padStart(2, '0')}</link>
    <description><![CDATA[Články publikované v ${monthName} ${year} na blogu VI&MO]]></description>
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

