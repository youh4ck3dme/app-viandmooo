import { blogPosts } from '@/lib/blog-posts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';

export async function GET() {
  const publishedPosts = blogPosts
    .filter(p => p.status === 'published' && p.visibility === 'public')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  const rdfFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns="http://purl.org/rss/1.0/">
  <channel rdf:about="${siteUrl}/feed/rdf">
    <title>VI&MO Blog - Sťahovanie v Bratislave</title>
    <link>${siteUrl}/blog</link>
    <description>Kompletný blog o sťahovaní v Bratislave. Praktické tipy, návody a rady od profesionálov.</description>
    <dc:language>sk</dc:language>
    <dc:creator>info@viandmo.com</dc:creator>
    <dc:date>${new Date().toISOString()}</dc:date>
    <items>
      <rdf:Seq>
        ${publishedPosts.map(post => `
        <rdf:li rdf:resource="${siteUrl}/blog/${post.slug}"/>`).join('')}
      </rdf:Seq>
    </items>
  </channel>
  ${publishedPosts.map(post => {
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    
    return `
  <item rdf:about="${postUrl}">
    <title>${escapeXml(post.title)}</title>
    <link>${postUrl}</link>
    <description>${escapeXml(post.excerpt || post.summary)}</description>
    <dc:creator>${escapeXml(post.authorName || post.author)}</dc:creator>
    <dc:date>${new Date(post.date).toISOString()}</dc:date>
    <dc:subject>${escapeXml(post.category)}</dc:subject>
  </item>`;
  }).join('')}
</rdf:RDF>`;

  return new Response(rdfFeed, {
    headers: {
      'Content-Type': 'application/rdf+xml; charset=utf-8',
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

