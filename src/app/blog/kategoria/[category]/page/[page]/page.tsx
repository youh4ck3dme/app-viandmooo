import { blogPosts } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/PostList';
import { slugify } from '@/lib/utils';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { Pagination } from '@/components/blog/Pagination';

type Props = {
  params: { category: string; page: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const POSTS_PER_PAGE = 12;

export async function generateStaticParams() {
  const categories = Array.from(new Set(blogPosts.map((p) => p.category)));
  const params: { category: string; page: string }[] = [];
  
  categories.forEach(category => {
    const categorySlug = slugify(category);
    const categoryPosts = blogPosts.filter(
      p => slugify(p.category) === categorySlug &&
           p.status === 'published' &&
           p.visibility === 'public'
    );
    const totalPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);
    
    for (let page = 1; page <= totalPages; page++) {
      params.push({ category: categorySlug, page: page.toString() });
    }
  });
  
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parseInt(params.page);
  if (isNaN(page) || page < 1) {
    return { title: 'Stránka nenájdená' };
  }

  const categoryName = blogPosts.find(p => slugify(p.category) === params.category)?.category;
  if (!categoryName) {
    return { title: 'Kategória nenájdená' };
  }

  const categoryPosts = blogPosts.filter(
    p => slugify(p.category) === params.category &&
         p.status === 'published' &&
         p.visibility === 'public'
  );
  const totalPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);
  
  if (page > totalPages) {
    return { title: 'Stránka nenájdená' };
  }

  const categoryUrl = `${siteUrl}/blog/kategoria/${params.category}${page > 1 ? `/page/${page}` : ''}`;

  return {
    title: page === 1 
      ? `Články v kategórii: ${categoryName} | VI&MO Blog`
      : `Články v kategórii: ${categoryName} - Stránka ${page} | VI&MO Blog`,
    description: `Prehľad všetkých článkov v kategórii ${categoryName} na blogu VI&MO.`,
    alternates: {
      canonical: categoryUrl,
    },
    robots: {
      index: page === 1 ? true : false,
      follow: true,
    },
  };
}

export default function CategoryPagePaginated({ params }: Props) {
  const page = parseInt(params.page);
  if (isNaN(page) || page < 1) {
    notFound();
  }

  const posts = blogPosts.filter(
    post => slugify(post.category) === params.category &&
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
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  
  if (page > totalPages) {
    notFound();
  }

  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: `Kategória: ${categoryName}`, href: `/blog/kategoria/${params.category}`, active: page === 1 },
  ];

  return (
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
        <PostList posts={paginatedPosts} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/blog/kategoria/${params.category}`}
          />
        )}
      </div>
    </div>
  );
}

