import { blogPosts } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/PostList';
import { slugify } from '@/lib/utils';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { Pagination } from '@/components/blog/Pagination';

type Props = {
  params: { tag: string };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const POSTS_PER_PAGE = 12;

export async function generateStaticParams() {
  const tags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));
  return tags.map((tag) => ({
    tag: slugify(tag),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tagName = blogPosts.flatMap(p => p.tags).find(t => slugify(t) === params.tag);

  if (!tagName) {
    return { 
      title: 'Tag nenájdený | VI&MO Blog',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const tagPosts = blogPosts.filter(post => post.tags.some(t => slugify(t) === params.tag));
  const tagUrl = `${siteUrl}/blog/tag/${params.tag}`;

  return {
    title: `Články s tagom: ${tagName} | VI&MO Blog`,
    description: `Zoznam všetkých článkov označených tagom #${tagName} na blogu VI&MO. Nájdite praktické tipy a rady o sťahovaní v Bratislave.`,
    keywords: [tagName, 'sťahovanie Bratislava', 'blog', 'návody', 'tipy'],
    openGraph: {
      title: `Články s tagom: ${tagName} | VI&MO Blog`,
      description: `Zoznam všetkých článkov označených tagom #${tagName} na blogu VI&MO.`,
      url: tagUrl,
      type: 'website',
      siteName: 'VI&MO',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Články s tagom: ${tagName} | VI&MO`,
      description: `Zoznam všetkých článkov označených tagom #${tagName}.`,
    },
    alternates: {
      canonical: tagUrl,
      languages: {
        'sk': tagUrl,
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

export default function TagPage({ params }: Props) {
  const { tag } = params;
  const posts = blogPosts.filter(
    (post) => post.tags.some(t => slugify(t) === tag) &&
             post.status === 'published' &&
             post.visibility === 'public'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (posts.length === 0) {
    notFound();
  }
    
  const tagName = posts[0].tags.find(t => slugify(t) === tag) || tag;

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: `Tag: #${tagName}`, href: `/blog/tag/${tag}`, active: true },
  ];

  // Structured Data pre tag
  const tagJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Články s tagom: ${tagName}`,
    description: `Zoznam všetkých článkov označených tagom #${tagName}`,
    url: `${siteUrl}/blog/tag/${tag}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tagJsonLd) }}
      />
      <div className="py-12 md:py-16 lg:py-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbItems} />
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline text-primary mb-4">
              Tag: <span className="text-foreground">#{tagName}</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Zobrazuje sa {posts.length} {posts.length === 1 ? 'článok' : posts.length < 5 ? 'články' : 'článkov'} s týmto tagom
            </p>
          </header>
          <PostList posts={posts.slice(0, POSTS_PER_PAGE)} />
          {Math.ceil(posts.length / POSTS_PER_PAGE) > 1 && (
            <Pagination
              currentPage={1}
              totalPages={Math.ceil(posts.length / POSTS_PER_PAGE)}
              baseUrl={`/blog/tag/${tag}`}
            />
          )}
        </div>
      </div>
    </>
  );
}
