import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-posts';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PostNavigationProps {
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
  className?: string;
}

export function PostNavigation({ prevPost, nextPost, className }: PostNavigationProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav 
      className={cn("mt-12 md:mt-16 grid gap-4 md:gap-6", prevPost && nextPost ? "md:grid-cols-2" : "md:grid-cols-1", className)}
      aria-label="Navigácia medzi článkami"
    >
      {prevPost && (
        <Link
          href={`/blog/${prevPost.slug}`}
          className="group"
          aria-label={`Predchádzajúci článok: ${prevPost.title}`}
        >
          <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <ChevronLeft className="w-4 h-4" />
                <span>Predchádzajúci článok</span>
              </div>
              <div className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={prevPost.image}
                    alt={prevPost.image_alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="80px"
                    loading="lazy"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-base md:text-lg font-headline font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {prevPost.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                    {prevPost.excerpt || prevPost.summary}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {nextPost && (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group"
          aria-label={`Ďalší článok: ${nextPost.title}`}
        >
          <Card className="h-full hover:shadow-lg transition-all duration-300 border-r-4 border-r-primary md:text-right">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                <span>Ďalší článok</span>
                <ChevronRight className="w-4 h-4" />
              </div>
              <div className="flex gap-4 md:flex-row-reverse">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={nextPost.image}
                    alt={nextPost.image_alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="80px"
                    loading="lazy"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-base md:text-lg font-headline font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {nextPost.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                    {nextPost.excerpt || nextPost.summary}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}
    </nav>
  );
}

