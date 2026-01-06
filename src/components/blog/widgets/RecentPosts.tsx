import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/blog-posts';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentPostsProps {
  posts: BlogPost[];
  maxPosts?: number;
  className?: string;
}

export function RecentPosts({ posts, maxPosts = 5, className }: RecentPostsProps) {
  const recentPosts = posts
    .filter(p => p.status === 'published' && p.visibility === 'public')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxPosts);

  if (recentPosts.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-headline text-primary font-semibold">
        Najnovšie články
      </h3>
      <ul className="space-y-4">
        {recentPosts.map(post => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="flex gap-3 group hover:text-primary transition-colors"
            >
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.image_alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="80px"
                  loading="lazy"
                />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="text-sm font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('sk-SK', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

