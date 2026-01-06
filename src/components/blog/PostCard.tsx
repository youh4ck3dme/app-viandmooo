import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, FolderOpen, Clock } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-posts';
import { slugify } from '@/lib/utils';

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-card border h-full group">
      <Link 
        href={`/blog/${post.slug}`} 
        className="block relative"
        aria-label={`Prečítať článok: ${post.title}`}
      >
        <div className="relative h-56 md:h-64 w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.image_alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={85}
          />
        </div>
      </Link>
      <CardHeader className="flex-grow">
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" aria-hidden="true" />
            <time dateTime={post.date} className="whitespace-nowrap">
              {new Date(post.date).toLocaleDateString('sk-SK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </time>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderOpen className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" aria-hidden="true" />
            <Link 
              href={`/blog/kategoria/${slugify(post.category)}`} 
              className="hover:text-primary transition-colors whitespace-nowrap"
              aria-label={`Zobraziť články v kategórii ${post.category}`}
            >
              {post.category}
            </Link>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">{post.readingTime} min</span>
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-headline leading-snug mb-2">
          <Link 
            href={`/blog/${post.slug}`} 
            className="hover:text-primary transition-colors line-clamp-2"
          >
            {post.title}
          </Link>
        </h2>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm md:text-base text-muted-foreground line-clamp-3 leading-relaxed">
          {post.summary}
        </p>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          asChild 
          variant="link" 
          className="p-0 h-auto text-primary font-semibold group/button"
          aria-label={`Prečítať viac o: ${post.title}`}
        >
          <Link href={`/blog/${post.slug}`} className="flex items-center gap-2">
            <span>Čítať viac</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/button:translate-x-1" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
