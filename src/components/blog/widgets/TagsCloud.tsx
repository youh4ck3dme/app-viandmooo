import Link from 'next/link';
import { slugify } from '@/lib/utils';
import type { BlogPost } from '@/lib/blog-posts';
import { cn } from '@/lib/utils';

interface TagsCloudProps {
  posts: BlogPost[];
  maxTags?: number;
  className?: string;
}

export function TagsCloud({ posts, maxTags = 20, className }: TagsCloudProps) {
  const tagCounts = new Map<string, number>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags);

  if (sortedTags.length === 0) return null;

  const maxCount = sortedTags[0][1];
  const minCount = sortedTags[sortedTags.length - 1][1];
  const range = maxCount - minCount || 1;

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-headline text-primary font-semibold">
        Tagy
      </h3>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map(([tag, count]) => {
          const size = minCount + (count - minCount) / range;
          const fontSize = Math.max(0.75, Math.min(1.5, 0.75 + (size - minCount) / range * 0.75));
          
          return (
            <Link
              key={tag}
              href={`/blog/tag/${slugify(tag)}`}
              className={cn(
                "px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200",
                "text-sm font-medium"
              )}
              style={{ fontSize: `${fontSize}rem` }}
              aria-label={`Zobraziť články s tagom ${tag} (${count})`}
            >
              #{tag} <span className="text-xs opacity-70">({count})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

