import Link from 'next/link';
import Image from 'next/image';
import { getAuthorByName } from '@/lib/authors';
import { Mail, Globe, Facebook, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthorBioProps {
  authorName: string;
  className?: string;
}

export function AuthorBio({ authorName, className }: AuthorBioProps) {
  const author = getAuthorByName(authorName);
  
  if (!author) return null;

  return (
    <div className={cn("border rounded-lg p-6 bg-card", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        {author.avatar && (
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 96px"
            />
          </div>
        )}
        <div className="flex-grow">
          <h3 className="text-lg font-headline text-primary mb-2">
            O autorovi
          </h3>
          <h4 className="text-xl font-semibold text-foreground mb-2">
            <Link 
              href={`/blog/autor/${author.slug}`}
              className="hover:text-primary transition-colors"
            >
              {author.name}
            </Link>
          </h4>
          {author.role && (
            <p className="text-sm text-muted-foreground mb-3">
              {author.role}
            </p>
          )}
          <p className="text-sm text-foreground/90 leading-relaxed mb-4">
            {author.bio}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {author.email && (
              <a 
                href={`mailto:${author.email}`}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-3 h-3" />
                Email
              </a>
            )}
            {author.url && (
              <a 
                href={author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="w-3 h-3" />
                Webstránka
              </a>
            )}
            {author.socialLinks?.facebook && (
              <a 
                href={author.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3 h-3" />
              </a>
            )}
            {author.socialLinks?.instagram && (
              <a 
                href={author.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3 h-3" />
              </a>
            )}
            {author.socialLinks?.linkedin && (
              <a 
                href={author.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3 h-3" />
              </a>
            )}
            <Link
              href={`/blog/autor/${author.slug}`}
              className="text-xs text-primary hover:underline font-medium"
            >
              Všetky články →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

