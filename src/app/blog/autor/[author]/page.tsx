import { blogPosts } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/PostList';
import { getAuthorBySlug } from '@/lib/authors';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { Pagination } from '@/components/blog/Pagination';
import Image from 'next/image';
import { Calendar, Mail, Globe, Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: { author: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const POSTS_PER_PAGE = 12;

export async function generateStaticParams() {
  const authors = [...new Set(blogPosts.map(p => p.authorName || p.author))];
  return authors.map(author => ({
    author: author.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = getAuthorBySlug(params.author);
  
  if (!author) {
    return { 
      title: 'Autor nenájdený | VI&MO Blog',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const authorPosts = blogPosts.filter(
    p => (p.authorName || p.author).toLowerCase().replace(/\s+/g, '-') === params.author &&
         p.status === 'published' && p.visibility === 'public'
  );

  const authorUrl = `${siteUrl}/blog/autor/${params.author}`;

  return {
    title: `Články autora: ${author.name} | VI&MO Blog`,
    description: `${author.bio} Prehľad všetkých článkov autora ${author.name} na blogu VI&MO.`,
    keywords: [author.name, 'blog', 'články', 'autor'],
    openGraph: {
      title: `Články autora: ${author.name} | VI&MO Blog`,
      description: author.bio,
      url: authorUrl,
      type: 'profile',
      siteName: 'VI&MO',
    },
    twitter: {
      card: 'summary',
      title: `Články autora: ${author.name} | VI&MO`,
      description: author.bio,
    },
    alternates: {
      canonical: authorUrl,
      languages: {
        'sk': authorUrl,
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

export default function AuthorPage({ params }: Props) {
  const author = getAuthorBySlug(params.author);
  
  if (!author) {
    notFound();
  }

  const allAuthorPosts = blogPosts.filter(
    p => (p.authorName || p.author).toLowerCase().replace(/\s+/g, '-') === params.author &&
         p.status === 'published' && p.visibility === 'public'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(allAuthorPosts.length / POSTS_PER_PAGE);
  const currentPage = 1; // TODO: Add pagination support
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = allAuthorPosts.slice(startIndex, endIndex);

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: `Autor: ${author.name}`, href: `/blog/autor/${params.author}`, active: true },
  ];

  // Structured Data pre autora
  const authorJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `Články autora: ${author.name}`,
    description: author.bio,
    url: `${siteUrl}/blog/autor/${params.author}`,
    mainEntity: {
      '@type': 'Person',
      name: author.name,
      description: author.bio,
      url: author.url || `${siteUrl}/blog/autor/${params.author}`,
      email: author.email,
      jobTitle: author.role,
      sameAs: author.socialLinks ? Object.values(author.socialLinks).filter(Boolean) : [],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
      />
      <div className="py-12 md:py-16 lg:py-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Author Header */}
          <header className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              {author.avatar && (
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary/20 flex-shrink-0">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline text-primary mb-4">
                  {author.name}
                </h1>
                {author.role && (
                  <p className="text-lg md:text-xl text-muted-foreground mb-4">
                    {author.role}
                  </p>
                )}
                <p className="text-base md:text-lg text-foreground/90 mb-6 leading-relaxed">
                  {author.bio}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                  {author.email && (
                    <a 
                      href={`mailto:${author.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {author.email}
                    </a>
                  )}
                  {author.url && (
                    <a 
                      href={author.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Webstránka
                    </a>
                  )}
                  {author.socialLinks?.facebook && (
                    <a 
                      href={author.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {author.socialLinks?.instagram && (
                    <a 
                      href={author.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {author.socialLinks?.linkedin && (
                    <a 
                      href={author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Author Posts */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-headline text-primary mb-2">
              Články ({allAuthorPosts.length})
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Všetky články od {author.name}
            </p>
          </div>

          {paginatedPosts.length > 0 ? (
            <>
              <PostList posts={paginatedPosts} />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/blog/autor/${params.author}`}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tento autor zatiaľ nemá žiadne publikované články.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

