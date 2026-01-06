'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewsCounterProps {
  slug: string;
  className?: string;
  showIcon?: boolean;
}

export function ViewsCounter({ slug, className, showIcon = true }: ViewsCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial views
    fetch(`/blog/${slug}/views?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        setViews(data.views || 0);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    // Increment views on mount (only once per session)
    const hasViewed = sessionStorage.getItem(`viewed-${slug}`);
    if (!hasViewed) {
      fetch(`/blog/${slug}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      })
        .then(res => res.json())
        .then(data => {
          setViews(data.views || 0);
          sessionStorage.setItem(`viewed-${slug}`, 'true');
        })
        .catch(() => {
          // Silent fail
        });
    }
  }, [slug]);

  if (isLoading || views === null) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
      {showIcon && <Eye className="w-4 h-4" aria-hidden="true" />}
      <span>{views.toLocaleString('sk-SK')} {views === 1 ? 'zobrazenie' : views < 5 ? 'zobrazenia' : 'zobrazení'}</span>
    </div>
  );
}

