import type { Metadata } from 'next';
import { blogPosts } from '@/lib/blog-posts';
import BlogPageClient from './BlogPageClient';
import { Pagination } from '@/components/blog/Pagination';
import { BlogSidebar } from '@/components/blog/widgets/BlogSidebar';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: 'Blog o Sťahovaní v Bratislave | Tipy, Návody a Rady | VI&MO',
  description: 'Kompletný blog o sťahovaní v Bratislave. Praktické tipy, návody a rady od profesionálov. Zistite, ako sa správne pripraviť na sťahovanie, čo všetko potrebujete a ako si vybrať najlepšiu sťahovaciu službu.',
  keywords: ['blog sťahovanie Bratislava', 'tipy sťahovanie', 'návod sťahovanie', 'rady sťahovanie', 'sťahovanie blog'],
  openGraph: {
    title: 'Blog o Sťahovaní v Bratislave | Tipy, Návody a Rady | VI&MO',
    description: 'Kompletný blog o sťahovaní v Bratislave. Praktické tipy, návody a rady od profesionálov so sťahovaním.',
    url: `${siteUrl}/blog`,
    type: 'website',
    siteName: 'VI&MO',
    images: [
      {
        url: `${siteUrl}/images/blog-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'Blog o sťahovaní v Bratislave - VI&MO',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog o Sťahovaní v Bratislave | VI&MO',
    description: 'Kompletný blog o sťahovaní v Bratislave. Praktické tipy, návody a rady od profesionálov.',
    images: [`${siteUrl}/images/blog-hero.jpg`],
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
    languages: {
      'sk': `${siteUrl}/blog`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Structured data pre blog
const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'VI&MO Blog - Sťahovanie v Bratislave',
  description: 'Kompletný blog o sťahovaní v Bratislave. Praktické tipy, návody a rady od profesionálov.',
  url: `${siteUrl}/blog`,
  publisher: {
    '@type': 'Organization',
    name: 'VI&MO',
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/viandmo_logo.png`,
    },
  },
  blogPost: blogPosts
    .filter(p => p.status === 'published' && p.visibility === 'public')
    .map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: new Date(post.date).toISOString(),
      dateModified: new Date(post.dateModified).toISOString(),
      author: {
        '@type': 'Organization',
        name: post.author,
      },
      image: post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`,
    })),
};

export default function BlogPage() {
  const publishedPosts = blogPosts
    .filter(p => p.status === 'published' && p.visibility === 'public')
    .sort((a, b) => {
      if (a.isSticky && !b.isSticky) return -1;
      if (!a.isSticky && b.isSticky) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE);
  const firstPagePosts = publishedPosts.slice(0, POSTS_PER_PAGE);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 lg:gap-12">
          <div>
            <BlogPageClient initialPosts={firstPagePosts} />
            {totalPages > 1 && (
              <div className="pb-12">
                <Pagination
                  currentPage={1}
                  totalPages={totalPages}
                  baseUrl="/blog"
                />
              </div>
            )}
          </div>
          <aside className="hidden lg:block">
            <BlogSidebar />
          </aside>
        </div>
      </div>
    </>
  );
}
