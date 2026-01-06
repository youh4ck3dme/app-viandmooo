import { blogPosts } from '@/lib/blog-posts';
import { TagsCloud } from './TagsCloud';
import { CategoriesList } from './CategoriesList';
import { RecentPosts } from './RecentPosts';
import { PopularPosts } from './PopularPosts';
import { ArchiveWidget } from './ArchiveWidget';
import { Separator } from '@/components/ui/separator';
import { EmailSubscription } from '../EmailSubscription';

interface BlogSidebarProps {
  className?: string;
}

export function BlogSidebar({ className }: BlogSidebarProps) {
  const publishedPosts = blogPosts.filter(
    p => p.status === 'published' && p.visibility === 'public'
  );

  return (
    <aside className={className}>
      <div className="space-y-8">
        <CategoriesList posts={publishedPosts} />
        <Separator />
        <TagsCloud posts={publishedPosts} maxTags={15} />
        <Separator />
        <RecentPosts posts={publishedPosts} maxPosts={5} />
        <Separator />
        <PopularPosts posts={publishedPosts} maxPosts={5} />
        <Separator />
        <ArchiveWidget posts={publishedPosts} />
        <Separator />
        <EmailSubscription />
      </div>
    </aside>
  );
}

