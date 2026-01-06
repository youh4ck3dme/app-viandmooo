import { blogPosts } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/PostList';
import { slugify } from '@/lib/utils';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { Pagination } from '@/components/blog/Pagination';

type Props = {
  params: { tag: string; page: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const POSTS_PER_PAGE = 12;

export async function generateStaticParams() {
  const tags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));
  const params: { tag: string; page: string }[] = [];
  
  tags.forEach(tag => {
    const tagSlug = slugify(tag);
    const tagPosts = blogPosts.filter(
      p => p.tags.some(t => slugify(t) === tagSlug) &&
           p.status === 'published' &&
           p.visibility === 'public'
    );
    const totalPages = Math.ceil(tagPosts.length / POSTS_PER_PAGE);
    
    for (let page = 1; page <= totalPages; page++) {
      params.push({ tag: tagSlug, page: page.toString() });
    }
  });
  
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parseInt(params.page);
  if (isNaN(page) || page < 1) {
    return { title: 'Stránka nenájdená' };
  }

  const tagName = blogPosts.flatMap(p => p.tags).find(t => slugify(t) === params.tag);
  if (!tagName) {
    return { title: 'Tag nenájdený' };
  }

  const tagPosts = blogPosts.filter(
    post => post.tags.some(t => slugify(t) === params.tag) &&
            post.status === 'published' &&
            post.visibility === 'public'
  );
  const totalPages = Math.ceil(tagPosts.length / POSTS_PER_PAGE);
  
  if (page > totalPages) {
    return { title: 'Stránka nenájdená' };
  }

  const tagUrl = `${siteUrl}/blog/tag/${params.tag}${page > 1 ? `/page/${page}` : ''}`;

  return {
    title: page === 1
      ? `Články s tagom: ${tagName} | VI&MO Blog`
      : `Články s tagom: ${tagName} - Stránka ${page} | VI&MO Blog`,
    description: `Zoznam všetkých článkov označených tagom #${tagName} na blogu VI&MO.`,
    alternates: {
      canonical: tagUrl,
    },
    robots: {
      index: page === 1 ? true : false,
      follow: true,
    },
  };
}

export default function TagPagePaginated({ params }: Props) {
  const page = parseInt(params.page);
  if (isNaN(page) || page < 1) {
    notFound();
  }

  const posts = blogPosts.filter(
    post => post.tags.some(t => slugify(t) === params.tag) &&
            post.status === 'published' &&
            post.visibility === 'public'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (posts.length === 0) {
    notFound();
  }
    
  const tagName = posts[0].tags.find(t => slugify(t) === params.tag) || params.tag;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  
  if (page > totalPages) {
    notFound();
  }

  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: `Tag: #${tagName}`, href: `/blog/tag/${params.tag}`, active: page === 1 },
  ];

  return (
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
        <PostList posts={paginatedPosts} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/blog/tag/${params.tag}`}
          />
        )}
      </div>
    </div>
  );
}

