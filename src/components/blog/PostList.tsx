import type { BlogPost } from '@/lib/blog-posts';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: BlogPost[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 md:py-16">
        <p className="text-muted-foreground text-sm md:text-base">
          Žiadne články sa nenašli.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
