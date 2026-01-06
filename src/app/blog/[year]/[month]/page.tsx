import { blogPosts } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/PostList';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { Pagination } from '@/components/blog/Pagination';

type Props = {
  params: { year: string; month: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const POSTS_PER_PAGE = 12;

export async function generateStaticParams() {
  const dates = new Set<string>();
  blogPosts.forEach(post => {
    const date = new Date(post.date);
    dates.add(`${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`);
  });
  
  return Array.from(dates).map(date => {
    const [year, month] = date.split('/');
    return { year, month };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const year = parseInt(params.year);
  const month = parseInt(params.month);
  
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return { 
      title: 'Archív nenájdený | VI&MO Blog',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const monthNames = [
    'január', 'február', 'marec', 'apríl', 'máj', 'jún',
    'júl', 'august', 'september', 'október', 'november', 'december'
  ];

  const posts = blogPosts.filter(post => {
    const postDate = new Date(post.date);
    return postDate.getFullYear() === year &&
           postDate.getMonth() + 1 === month &&
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

  const archiveUrl = `${siteUrl}/blog/${year}/${String(month).padStart(2, '0')}`;
  const monthName = monthNames[month - 1];

  return {
    title: `Blog Archív - ${monthName} ${year} | VI&MO`,
    description: `Prehľad všetkých článkov publikovaných v ${monthName} ${year} na blogu VI&MO.`,
    keywords: [`blog ${year}`, `blog ${monthName}`, 'archív', 'články'],
    openGraph: {
      title: `Blog Archív - ${monthName} ${year} | VI&MO`,
      description: `Prehľad všetkých článkov publikovaných v ${monthName} ${year}.`,
      url: archiveUrl,
      type: 'website',
      siteName: 'VI&MO',
    },
    twitter: {
      card: 'summary',
      title: `Blog Archív - ${monthName} ${year} | VI&MO`,
      description: `Prehľad všetkých článkov publikovaných v ${monthName} ${year}.`,
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

export default function ArchivePage({ params }: Props) {
  const year = parseInt(params.year);
  const month = parseInt(params.month);
  
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    notFound();
  }

  const monthNames = [
    'január', 'február', 'marec', 'apríl', 'máj', 'jún',
    'júl', 'august', 'september', 'október', 'november', 'december'
  ];

  const allPosts = blogPosts.filter(post => {
    const postDate = new Date(post.date);
    return postDate.getFullYear() === year &&
           postDate.getMonth() + 1 === month &&
           post.status === 'published' &&
           post.visibility === 'public';
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allPosts.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const currentPage = 1; // TODO: Add pagination support
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  const monthName = monthNames[month - 1];
  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: `${year}`, href: `/blog/${year}` },
    { label: `${monthName}`, href: `/blog/${year}/${String(month).padStart(2, '0')}`, active: true },
  ];

  // Structured Data pre archív
  const archiveJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Blog Archív - ${monthName} ${year}`,
    description: `Prehľad všetkých článkov publikovaných v ${monthName} ${year}`,
    url: `${siteUrl}/blog/${year}/${String(month).padStart(2, '0')}`,
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
              Archív: <span className="text-foreground">{monthName} {year}</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Zobrazuje sa {allPosts.length} {allPosts.length === 1 ? 'článok' : allPosts.length < 5 ? 'články' : 'článkov'} z tohto obdobia
            </p>
          </header>
          {paginatedPosts.length > 0 ? (
            <>
              <PostList posts={paginatedPosts} />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/blog/${year}/${String(month).padStart(2, '0')}`}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">V tomto období neboli publikované žiadne články.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

