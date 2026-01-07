import { blogPosts } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/PostList';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { Pagination } from '@/components/blog/Pagination';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

type Props = {
  params: { year: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const POSTS_PER_PAGE = 12;

export async function generateStaticParams() {
  const years = new Set<number>();
  blogPosts.forEach(post => {
    const year = new Date(post.date).getFullYear();
    years.add(year);
  });
  
  return Array.from(years).map(year => ({
    year: year.toString(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const year = parseInt(params.year);
  
  if (isNaN(year)) {
    return { 
      title: 'Archív nenájdený | VI&MO Blog',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const posts = blogPosts.filter(post => {
    const postYear = new Date(post.date).getFullYear();
    return postYear === year &&
           post.status === 'published' &&
           post.visibility === 'public';
  });

  if (posts.length === 0) {
    return { 
      title: 'Archív nenájdený | VI&MO Blog',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const archiveUrl = `${siteUrl}/blog/archiv/${year}`;

  return {
    title: `Blog Archív - ${year} | VI&MO`,
    description: `Prehľad všetkých článkov publikovaných v roku ${year} na blogu VI&MO.`,
    keywords: [`blog ${year}`, 'archív', 'články'],
    openGraph: {
      title: `Blog Archív - ${year} | VI&MO`,
      description: `Prehľad všetkých článkov publikovaných v roku ${year}.`,
      url: archiveUrl,
      type: 'website',
      siteName: 'VI&MO',
    },
    twitter: {
      card: 'summary',
      title: `Blog Archív - ${year} | VI&MO`,
      description: `Prehľad všetkých článkov publikovaných v roku ${year}.`,
    },
    alternates: {
      canonical: archiveUrl,
      languages: {
        'sk': archiveUrl,
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
}

export default function YearArchivePage({ params }: Props) {
  const year = parseInt(params.year);
  
  if (isNaN(year)) {
    notFound();
  }

  const allPosts = blogPosts.filter(post => {
    const postYear = new Date(post.date).getFullYear();
    return postYear === year &&
           post.status === 'published' &&
           post.visibility === 'public';
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allPosts.length === 0) {
    notFound();
  }

  // Group posts by month
  const postsByMonth = new Map<number, typeof allPosts>();
  allPosts.forEach(post => {
    const month = new Date(post.date).getMonth() + 1;
    if (!postsByMonth.has(month)) {
      postsByMonth.set(month, []);
    }
    postsByMonth.get(month)!.push(post);
  });

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const currentPage = 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: `${year}`, href: `/blog/archiv/${year}`, active: true },
  ];

  const monthNames = [
    'január', 'február', 'marec', 'apríl', 'máj', 'jún',
    'júl', 'august', 'september', 'október', 'november', 'december'
  ];

  // Structured Data pre archív
  const archiveJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Blog Archív - ${year}`,
    description: `Prehľad všetkých článkov publikovaných v roku ${year}`,
    url: `${siteUrl}/blog/archiv/${year}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allPosts.length,
      itemListElement: allPosts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          url: `${siteUrl}/blog/${post.slug}`,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(archiveJsonLd) }}
      />
      <div className="py-12 md:py-16 lg:py-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbItems} />
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline text-primary mb-4">
              Archív: <span className="text-foreground">{year}</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mb-6">
              Zobrazuje sa {allPosts.length} {allPosts.length === 1 ? 'článok' : allPosts.length < 5 ? 'články' : 'článkov'} z tohto roku
            </p>
            
            {/* Monthly Archive Links */}
            <div className="flex flex-wrap gap-2">
              {Array.from(postsByMonth.keys())
                .sort((a, b) => b - a)
                .map(month => (
                  <Link
                    key={month}
                    href={`/blog/archiv/${year}/${String(month).padStart(2, '0')}`}
                    className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    {monthNames[month - 1]} ({postsByMonth.get(month)!.length})
                  </Link>
                ))}
            </div>
          </header>
          {paginatedPosts.length > 0 ? (
            <>
              <PostList posts={paginatedPosts} />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/blog/archiv/${year}`}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">V tomto roku neboli publikované žiadne články.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

