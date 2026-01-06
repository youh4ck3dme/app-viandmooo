import type { Metadata } from 'next';
import { blogPosts } from '@/lib/blog-posts';
import BlogPageClient from '../../BlogPageClient';
import { Pagination } from '@/components/blog/Pagination';
import { notFound } from 'next/navigation';

type Props = {
  params: { page: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const POSTS_PER_PAGE = 12;

export async function generateStaticParams() {
  const totalPages = Math.ceil(blogPosts.filter(p => p.status === 'published' && p.visibility === 'public').length / POSTS_PER_PAGE);
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parseInt(params.page);
  if (isNaN(page) || page < 1) {
    return { title: 'Stránka nenájdená' };
  }

  const totalPages = Math.ceil(blogPosts.filter(p => p.status === 'published' && p.visibility === 'public').length / POSTS_PER_PAGE);
  if (page > totalPages) {
    return { title: 'Stránka nenájdená' };
  }

  return {
    title: page === 1 ? 'Blog o Sťahovaní v Bratislave | VI&MO' : `Blog - Stránka ${page} | VI&MO`,
    description: `Blog o sťahovaní v Bratislave - Stránka ${page} z ${totalPages}. Praktické tipy, návody a rady od profesionálov.`,
    alternates: {
      canonical: page === 1 ? `${siteUrl}/blog` : `${siteUrl}/blog/page/${page}`,
    },
    robots: {
      index: page === 1 ? true : false,
      follow: true,
    },
  };
}

export default function BlogPagePaginated({ params }: Props) {
  const page = parseInt(params.page);
  if (isNaN(page) || page < 1) {
    notFound();
  }

  const publishedPosts = blogPosts
    .filter(p => p.status === 'published' && p.visibility === 'public')
    .sort((a, b) => {
      // Sticky posts first
      if (a.isSticky && !b.isSticky) return -1;
      if (!a.isSticky && b.isSticky) return 1;
      // Then by date
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE);
  
  if (page > totalPages) {
    notFound();
  }

  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = publishedPosts.slice(startIndex, endIndex);

  return (
    <>
      <BlogPageClient initialPosts={paginatedPosts} />
      <div className="container mx-auto px-4 pb-12">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/blog"
        />
      </div>
    </>
  );
}

