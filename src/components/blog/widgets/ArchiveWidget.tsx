import Link from 'next/link';
import type { BlogPost } from '@/lib/blog-posts';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchiveWidgetProps {
  posts: BlogPost[];
  className?: string;
}

export function ArchiveWidget({ posts, className }: ArchiveWidgetProps) {
  const archiveMap = new Map<string, number>();
  
  posts
    .filter(p => p.status === 'published' && p.visibility === 'public')
    .forEach(post => {
      const date = new Date(post.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
    });

  const sortedArchives = Array.from(archiveMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]));

  if (sortedArchives.length === 0) return null;

  const monthNames = [
    'január', 'február', 'marec', 'apríl', 'máj', 'jún',
    'júl', 'august', 'september', 'október', 'november', 'december'
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-headline text-primary font-semibold">
        Archív
      </h3>
      <ul className="space-y-2">
        {sortedArchives.map(([key, count]) => {
          const [year, month] = key.split('-');
          const monthName = monthNames[parseInt(month) - 1];
          
          return (
            <li key={key}>
              <Link
                href={`/blog/${year}/${month}`}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium capitalize">
                    {monthName} {year}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

