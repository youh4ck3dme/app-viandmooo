'use client';

import { useState } from 'react';
import { PasswordProtected } from '@/components/blog/PasswordProtected';
import type { BlogPost } from '@/lib/blog-posts';
import BlogPostContent from './BlogPostContent';

interface PasswordProtectedPostProps {
  post: BlogPost;
}

export function PasswordProtectedPost({ post }: PasswordProtectedPostProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check if already verified in this session
  if (typeof window !== 'undefined') {
    const verified = sessionStorage.getItem('post-password-verified');
    if (verified === 'true') {
      return <BlogPostContent post={post} />;
    }
  }

  if (isUnlocked) {
    return <BlogPostContent post={post} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <PasswordProtected onPasswordCorrect={() => setIsUnlocked(true)} />
    </div>
  );
}

