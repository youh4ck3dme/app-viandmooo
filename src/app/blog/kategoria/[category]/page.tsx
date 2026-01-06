import { blogPosts } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/PostList';
import { slugify } from '@/lib/utils';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { Pagination } from '@/components/blog/Pagination';

type Props = {
  params: { category: string };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const POSTS_PER_PAGE = 12;

export async function generateStaticParams() {
  const categories = Array.from(new Set(blogPosts.map((p) => p.category)));
  return categories.map((category) => ({
    category: slugify(category),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryName = blogPosts.find(p => slugify(p.category) === params.category)?.category;

  if (!categoryName) {
    return { 
      title: 'Kategória nenájdená | VI&MO Blog',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const categoryPosts = blogPosts.filter(p => slugify(p.category) === params.category);
  const categoryUrl = `${siteUrl}/blog/kategoria/${params.category}`;

  return {
    title: `Články v kategórii: ${categoryName} | VI&MO Blog`,
    description: `Prehľad všetkých článkov a návodov v kategórii ${categoryName} na blogu VI&MO. Nájdite praktické tipy a rady o sťahovaní v Bratislave.`,
    keywords: [`${categoryName}`, 'sťahovanie Bratislava', 'blog', 'návody', 'tipy'],
    openGraph: {
      title: `Články v kategórii: ${categoryName} | VI&MO Blog`,
      description: `Prehľad všetkých článkov v kategórii ${categoryName} na blogu VI&MO.`,
      url: categoryUrl,
      type: 'website',
      siteName: 'VI&MO',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Články v kategórii: ${categoryName} | VI&MO`,
      description: `Prehľad všetkých článkov v kategórii ${categoryName}.`,
    },
    alternates: {
      canonical: categoryUrl,
      languages: {
        'sk': categoryUrl,
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

export default function CategoryPage({ params }: Props) {
  const { category } = params;
  const posts = blogPosts.filter(
    (post) => slugify(post.category) === category &&
             post.status === 'published' &&
             post.visibility === 'public'
  ).sort((a, b) => {
    if (a.isSticky && !b.isSticky) return -1;
    if (!a.isSticky && b.isSticky) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  if (posts.length === 0) {
    notFound();
  }

  const categoryName = posts[0].category;

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: `Kategória: ${categoryName}`, href: `/blog/kategoria/${category}`, active: true },
  ];

  // Structured Data pre kategóriu
  const categoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Články v kategórii: ${categoryName}`,
    description: `Prehľad všetkých článkov v kategórii ${categoryName}`,
    url: `${siteUrl}/blog/kategoria/${category}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      <div className="py-12 md:py-16 lg:py-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbItems} />
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline text-primary mb-4">
              Kategória: <span className="text-foreground">{categoryName}</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Zobrazuje sa {posts.length} {posts.length === 1 ? 'článok' : posts.length < 5 ? 'články' : 'článkov'} v tejto kategórii
            </p>
          </header>
          <PostList posts={posts.slice(0, POSTS_PER_PAGE)} />
          {Math.ceil(posts.length / POSTS_PER_PAGE) > 1 && (
            <Pagination
              currentPage={1}
              totalPages={Math.ceil(posts.length / POSTS_PER_PAGE)}
              baseUrl={`/blog/kategoria/${category}`}
            />
          )}
        </div>
      </div>
    </>
  );
}
