'use client';

import { useState } from 'react';
import { blogPosts } from '@/lib/blog-posts';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessagesSquare, Search, Calendar, FolderOpen, Clock } from 'lucide-react';
import imageData from '@/lib/placeholder-images.json';
import { Input } from '@/components/ui/input';
import { PostList } from '@/components/blog/PostList';
import { slugify } from '@/lib/utils';
import { SearchAutocomplete } from '@/components/blog/SearchAutocomplete';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { searchPosts } from '@/lib/search';
import type { BlogPost } from '@/lib/blog-posts';

interface BlogPageClientProps {
  initialPosts?: BlogPost[];
}

export default function BlogPageClient({ initialPosts }: BlogPageClientProps = {}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const sortedPosts = blogPosts
    .filter(p => p.status === 'published' && p.visibility === 'public')
    .sort((a, b) => {
      // Sticky posts first
      if (a.isSticky && !b.isSticky) return -1;
      if (!a.isSticky && b.isSticky) return 1;
      // Then by date
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const filteredPosts = searchTerm.trim()
    ? searchPosts(searchTerm, initialPosts || sortedPosts)
    : (initialPosts || sortedPosts);
  
  const displayPosts = filteredPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    post.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const allCategories = [...new Set(blogPosts.map(p => p.category))];
  const allTags = [...new Set(blogPosts.flatMap(p => p.tags))];

  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      router.push('/blog');
    } else {
      router.push(`/blog/kategoria/${slugify(value)}`);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src={imageData.blogHero.src}
          alt="Blog o sťahovaní v Bratislave - praktické tipy a návody od profesionálov VI&MO"
          fill
          priority
          className="object-cover object-center brightness-[0.4]"
          sizes="100vw"
          quality={90}
        />
        <div className="relative z-10 p-4 md:p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline leading-tight text-white drop-shadow-2xl mb-4 md:mb-6">
            Blog o Sťahovaní
          </h1>
          <p className="mt-4 text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-white/90 drop-shadow-lg px-4">
            Praktické tipy, kompletné návody a odborné rady pre vaše sťahovanie v Bratislave. Zistite všetko, čo potrebujete vedieť od profesionálov s viac ako 7 ročnými skúsenosťami.
          </p>
        </div>
      </section>

      {/* Blog Archive Header */}
      <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative w-full md:w-auto md:flex-grow max-w-md">
              <SearchAutocomplete
                onSelect={(query) => setSearchTerm(query)}
                className="w-full"
              />
            </div>
            <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto'>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full md:w-[200px] h-11 md:h-12">
                  <SelectValue placeholder="Všetky kategórie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky kategórie</SelectItem>
                  {allCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button asChild className="h-11 md:h-12 w-full sm:w-auto">
                <Link href="/contact" aria-label="Kontaktovať nás pre recenziu">
                  <MessagesSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">Kontaktovať nás</span>
                  <span className="sm:hidden">Kontakt</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {displayPosts.length > 0 ? (
            <>
              <div className="mb-8 md:mb-12">
                <p className="text-sm md:text-base text-muted-foreground">
                  {searchTerm.trim() ? (
                    <>Nájdených {displayPosts.length} {displayPosts.length === 1 ? 'článok' : displayPosts.length < 5 ? 'články' : 'článkov'} pre &quot;{searchTerm}&quot;</>
                  ) : (
                    <>Zobrazuje sa {displayPosts.length} {displayPosts.length === 1 ? 'článok' : displayPosts.length < 5 ? 'články' : 'článkov'}</>
                  )}
                </p>
              </div>
              <PostList posts={displayPosts} />
            </>
          ) : (
            <div className="text-center py-16 md:py-24">
              <Search className="mx-auto h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-4" aria-hidden="true" />
              <h3 className="mt-4 text-xl md:text-2xl font-semibold text-foreground">Nenašli sa žiadne články</h3>
              <p className="mt-2 text-muted-foreground text-sm md:text-base">Skúste zmeniť hľadaný výraz alebo vybrať inú kategóriu.</p>
              <Button 
                asChild 
                variant="outline" 
                className="mt-6"
                onClick={() => setSearchTerm('')}
              >
                <Link href="/blog">Zobraziť všetky články</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-muted/30 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-headline text-primary mb-4">
            Potrebujete pomoc so sťahovaním?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm md:text-base">
            Kontaktujte nás ešte dnes a získajte nezáväznú cenovú ponuku šitú na mieru vašim potrebám.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/contact">Získať cenovú ponuku</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

