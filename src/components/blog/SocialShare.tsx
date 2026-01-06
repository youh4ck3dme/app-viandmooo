'use client';

import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Linkedin, Mail, Link2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  className?: string;
}

export function SocialShare({ url, title, description, className }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${fullUrl}`)}`,
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-2"
        aria-label="Zdieľať článok"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Zdieľať</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex items-center gap-2"
        aria-label="Zdieľať na Facebooku"
      >
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            window.open(shareLinks.facebook, '_blank', 'width=600,height=400');
          }}
        >
          <Facebook className="w-4 h-4" />
          <span className="hidden sm:inline">Facebook</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex items-center gap-2"
        aria-label="Zdieľať na Twitteri"
      >
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            window.open(shareLinks.twitter, '_blank', 'width=600,height=400');
          }}
        >
          <Twitter className="w-4 h-4" />
          <span className="hidden sm:inline">Twitter</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex items-center gap-2"
        aria-label="Zdieľať na LinkedIn"
      >
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            window.open(shareLinks.linkedin, '_blank', 'width=600,height=400');
          }}
        >
          <Linkedin className="w-4 h-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex items-center gap-2"
        aria-label="Poslať emailom"
      >
        <a href={shareLinks.email}>
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Email</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="flex items-center gap-2"
        aria-label="Kopírovať odkaz"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">Skopírované</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Kopírovať</span>
          </>
        )}
      </Button>
    </div>
  );
}

