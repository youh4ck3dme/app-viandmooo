import { blogPosts } from '@/lib/blog-posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User, Clock, Tag } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { SocialShare } from '@/components/blog/SocialShare';
import { getRelatedPosts } from '@/lib/related-posts';
import { ViewsCounter } from '@/components/blog/ViewsCounter';
import { BlogSidebar } from '@/components/blog/widgets/BlogSidebar';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { getAuthorByName } from '@/lib/authors';
import { createImageObjectSchema } from '@/lib/image-sizes';
import { PostNavigation } from '@/components/blog/PostNavigation';
import { WordCount } from '@/components/blog/WordCount';
import { PrintButton } from '@/components/blog/PrintButton';
import { Comments } from '@/components/blog/Comments';
import { PasswordProtectedPost } from './PasswordProtectedPost';
import BlogPostContent from './BlogPostContent';

type Props = {
  params: { slug: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';

// Sort posts by date for navigation
const sortedByDate = blogPosts
  .filter(p => p.status === 'published' && p.visibility === 'public')
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Generovanie metadát pre každý článok
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post || post.status !== 'published' || post.visibility !== 'public') {
    return {
      title: 'Článok nenájdený | VI&MO Blog',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const imageUrl = post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`;
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const seoTitle = post.seoTitle || post.title;
  const seoDescription = post.seoDescription || post.summary;
  const author = getAuthorByName(post.authorName || post.author);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: post.keywords.join(', '),
    authors: [{ name: post.authorName || post.author }],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: postUrl,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.dateModified).toISOString(),
      authors: [post.authorName || post.author],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.image_alt,
          secureUrl: imageUrl.startsWith('https') ? imageUrl : imageUrl.replace('http://', 'https://'),
          type: 'image/jpeg',
        },
      ],
      siteName: 'VI&MO',
      locale: 'sk_SK',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
      creator: '@viandmo',
    },
    alternates: {
      canonical: postUrl,
      languages: {
        'sk': postUrl,
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
    other: {
      'article:published_time': new Date(post.date).toISOString(),
      'article:modified_time': new Date(post.dateModified).toISOString(),
      'article:author': post.authorName || post.author,
      'article:section': post.category,
      'article:tag': post.tags.join(','),
      'article:publisher': 'VI&MO',
    },
  };
}

// Generovanie statických ciest pre všetky články
export async function generateStaticParams() {
  return blogPosts
    .filter(p => p.status === 'published' && p.visibility === 'public')
    .map((post) => ({
      slug: post.slug,
    }));
}

const RelatedPosts = ({ currentPost }: { currentPost: typeof blogPosts[0] }) => {
  const related = getRelatedPosts(currentPost, blogPosts, 3);

  if (related.length === 0) return null;

  return (
    <aside className="mt-12 md:mt-16" aria-label="Súvisiace články">
      <h2 className="text-2xl md:text-3xl font-headline text-primary mb-6 md:mb-8">Prečítajte si tiež</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {related.map(post => (
          <Card key={post.slug} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border group">
            <Link href={`/blog/${post.slug}`} className="block" aria-label={`Prečítať článok: ${post.title}`}>
              <div className="relative h-48 md:h-56 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.image_alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
            </Link>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('sk-SK')}
                </time>
              </div>
              <h3 className="text-lg md:text-xl font-headline leading-snug mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.summary.substring(0, 120)}...
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </aside>
  );
};

export default async function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Handle password protected posts
  if (post.visibility === 'password') {
    return <PasswordProtectedPost post={post} />;
  }

  // Handle private posts (in production, check authentication)
  if (post.visibility === 'private') {
    // For now, show 404. In production, check if user is authenticated
    notFound();
  }

  const imageUrl = post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`;
  const author = getAuthorByName(post.authorName || post.author);

  // Prev/Next navigation v rámci celého blogu podľa dátumu
  const currentIndex = sortedByDate.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex < sortedByDate.length - 1 ? sortedByDate[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? sortedByDate[currentIndex - 1] : null;

  // Enhanced Structured Data with ImageObject
  const imageObject = createImageObjectSchema(imageUrl, post.image_alt, 1200, 630);
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: imageObject,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.dateModified).toISOString(),
    author: author ? {
      '@type': 'Person',
      name: author.name,
      url: author.url || `${siteUrl}/blog/autor/${author.slug}`,
      jobTitle: author.role,
      sameAs: author.socialLinks ? Object.values(author.socialLinks).filter(Boolean) : [],
    } : {
      '@type': 'Organization',
      name: post.author,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'VI&MO',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/viandmo_logo.png`,
        width: 600,
        height: 60,
      },
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.keywords.join(', '),
    wordCount: post.content?.toString().split(/\s+/).length || 0,
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: 'sk',
    isAccessibleForFree: true,
    mentions: post.tags.map(tag => ({
      '@type': 'Thing',
      name: tag,
    })),
    about: post.keywords.map(keyword => ({
      '@type': 'Thing',
      name: keyword,
    })),
  };

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: post.category, href: `/blog/kategoria/${slugify(post.category)}` },
    { label: post.title, href: `/blog/${post.slug}`, active: true },
  ];

  return (
    <>
      <ReadingProgress />
      <article className="py-8 md:py-12 lg:py-20 min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
            <div className="max-w-4xl">
              <Breadcrumbs items={breadcrumbItems} />

              {/* Header */}
              <header className="mb-8 md:mb-12 text-center">
                <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Link 
                    href={`/blog/kategoria/${slugify(post.category)}`}
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" aria-hidden="true" />
                    {post.category}
                  </Link>
                  <span aria-hidden="true">•</span>
                  <time dateTime={post.date} className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    {new Date(post.date).toLocaleDateString('sk-SK', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                  <span aria-hidden="true">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {post.readingTime} min čítania
                  </span>
                  <span aria-hidden="true">•</span>
                  <ViewsCounter slug={post.slug} />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline text-primary mb-4 md:mb-6 leading-tight">
                  {post.title}
                </h1>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 text-sm md:text-base text-muted-foreground">
                  <Link 
                    href={`/blog/autor/${(post.authorName || post.author).toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <User className="w-4 h-4" aria-hidden="true" />
                    <span>{post.authorName || post.author}</span>
                  </Link>
                  <div className="flex flex-wrap items-center gap-2">
                    <SocialShare
                      url={`/blog/${post.slug}`}
                      title={post.title}
                      description={post.summary}
                    />
                    <PrintButton />
                  </div>
                </div>
                <WordCount content={post.content} className="mt-4 text-center" />
              </header>

              {/* Main Image */}
              <div className="relative h-64 md:h-80 lg:h-96 w-full mb-8 md:mb-12 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={post.image}
                  alt={post.image_alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
                  quality={90}
                />
              </div>

              {/* Content */}
              <div className="prose prose-lg md:prose-xl max-w-none text-foreground/90 
                prose-h2:font-headline prose-h2:text-primary prose-h2:mt-8 prose-h2:mb-4
                prose-h3:font-headline prose-h3:text-primary prose-h3:mt-6 prose-h3:mb-3
                prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-primary hover:prose-a:text-primary/80 prose-a:font-medium
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-4 prose-ol:my-4
                prose-li:my-2">
                {post.content}
              </div>

              {/* Author Bio */}
              <AuthorBio authorName={post.authorName || post.author} className="mt-8 md:mt-12" />

              {/* Tags */}
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Tag className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground mr-2">Tagy:</span>
                  {post.tags.map(tag => (
                    <Link 
                      href={`/blog/tag/${slugify(tag)}`} 
                      key={tag}
                      className="bg-muted text-muted-foreground text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                      aria-label={`Zobraziť články s tagom ${tag}`}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Prev/Next navigácia */}
              <PostNavigation prevPost={prevPost} nextPost={nextPost} />

              {/* Comments */}
              <Comments postSlug={post.slug} />

              <RelatedPosts currentPost={post} />
            </div>
            
            {/* Sidebar with Table of Contents and Widgets */}
            <aside className="hidden lg:block space-y-8">
              <TableOfContents />
              <BlogSidebar />
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
