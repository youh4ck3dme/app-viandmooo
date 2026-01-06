'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector?: string;
  className?: string;
}

export function TableOfContents({ contentSelector = 'article', className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const content = document.querySelector(contentSelector);
    if (!content) return;

    const headingElements = content.querySelectorAll('h2, h3, h4');
    const headingList: Heading[] = [];

    headingElements.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || '';
      
      if (!heading.id && id) {
        heading.id = id;
      }

      headingList.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      });
    });

    setHeadings(headingList);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => {
      headingElements.forEach((heading) => observer.unobserve(heading));
    };
  }, [contentSelector]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav 
      className={cn(
        "sticky top-24 self-start bg-card border rounded-lg p-4 md:p-6 max-h-[calc(100vh-8rem)] overflow-y-auto",
        className
      )}
      aria-label="Obsah článku"
    >
      <h2 className="text-lg font-headline text-primary mb-4 font-semibold">
        Obsah článku
      </h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              "text-sm transition-colors",
              heading.level === 2 && "font-medium",
              heading.level === 3 && "ml-4 text-muted-foreground",
              heading.level === 4 && "ml-8 text-muted-foreground text-xs",
              activeId === heading.id && "text-primary font-semibold"
            )}
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={cn(
                "flex items-start gap-2 text-left hover:text-primary transition-colors w-full",
                activeId === heading.id && "text-primary"
              )}
            >
              {heading.level > 2 && (
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
              )}
              <span className="line-clamp-2">{heading.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

