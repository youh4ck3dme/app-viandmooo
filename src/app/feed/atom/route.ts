import { blogPosts } from '@/lib/blog-posts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';

export async function GET() {
  const publishedPosts = blogPosts
    .filter(p => p.status === 'published' && p.visibility === 'public')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>VI&MO Blog - Sťahovanie v Bratislave</title>
  <subtitle>Kompletný blog o sťahovaní v Bratislave. Praktické tipy, návody a rady od profesionálov.</subtitle>
  <link href="${siteUrl}/feed/atom" rel="self" type="application/atom+xml"/>
  <link href="${siteUrl}/blog" rel="alternate" type="text/html"/>
  <id>${siteUrl}/feed/atom</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>VI&MO</name>
    <email>info@viandmo.com</email>
  </author>
  ${publishedPosts.map(post => {
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    const imageUrl = post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`;
    
    return `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${postUrl}" rel="alternate"/>
    <id>${post.guid || postUrl}</id>
    <published>${new Date(post.date).toISOString()}</published>
    <updated>${new Date(post.dateModified).toISOString()}</updated>
    <author>
      <name>${escapeXml(post.authorName || post.author)}</name>
    </author>
    <summary type="html">${escapeXml(post.excerpt || post.summary)}</summary>
    <content type="html">${escapeXml(post.content?.toString() || post.summary)}</content>
    <category term="${escapeXml(post.category)}"/>
    ${post.tags.map(tag => `<category term="${escapeXml(tag)}"/>`).join('\n    ')}
  </entry>`;
  }).join('')}
</feed>`;

  return new Response(atomFeed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

