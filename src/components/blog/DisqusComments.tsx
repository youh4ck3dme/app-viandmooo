'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface DisqusCommentsProps {
  postSlug: string;
  postTitle: string;
  className?: string;
}

export function DisqusComments({ postSlug, postTitle, className }: DisqusCommentsProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Load Disqus script
    const script = document.createElement('script');
    script.src = 'https://viandmo.disqus.com/embed.js';
    script.setAttribute('data-timestamp', Date.now().toString());
    script.async = true;
    document.body.appendChild(script);

    // Reset Disqus when route changes
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function (this: any) {
          this.page.identifier = postSlug;
          this.page.url = `${window.location.origin}${pathname}`;
          this.page.title = postTitle;
        },
      });
    }

    return () => {
      // Cleanup
      const disqusScript = document.querySelector('script[src*="disqus.com"]');
      if (disqusScript) {
        disqusScript.remove();
      }
    };
  }, [postSlug, postTitle, pathname]);

  return (
    <div className={className} id="disqus_thread">
      <noscript>
        Prosím, povolte JavaScript pre zobrazenie{' '}
        <a href="https://disqus.com/?ref_noscript">komentárov powered by Disqus.</a>
      </noscript>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config: () => void;
      }) => void;
    };
  }
}

