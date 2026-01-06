import Link from 'next/link';
import { slugify } from '@/lib/utils';
import type { BlogPost } from '@/lib/blog-posts';
import { FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoriesListProps {
  posts: BlogPost[];
  className?: string;
}

export function CategoriesList({ posts, className }: CategoriesListProps) {
  const categoryCounts = new Map<string, number>();
  
  posts.forEach(post => {
    categoryCounts.set(post.category, (categoryCounts.get(post.category) || 0) + 1);
  });

  const sortedCategories = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-headline text-primary font-semibold">
        Kategórie
      </h3>
      <ul className="space-y-2">
        {sortedCategories.map(([category, count]) => (
          <li key={category}>
            <Link
              href={`/blog/kategoria/${slugify(category)}`}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">{category}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

