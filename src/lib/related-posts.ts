import type { BlogPost } from './blog-posts';
import { slugify } from './utils';

/**
 * Vypočíta podobnosť medzi dvoma článkami na základe kategórie, tagov a keywords
 */
function calculateSimilarity(post1: BlogPost, post2: BlogPost): number {
  let score = 0;

  // Kategória má najvyššiu váhu
  if (post1.category === post2.category) {
    score += 3;
  }

  // Spoločné tagy
  const commonTags = post1.tags.filter(tag => post2.tags.includes(tag));
  score += commonTags.length * 2;

  // Spoločné keywords
  const commonKeywords = post1.keywords.filter(kw => post2.keywords.includes(kw));
  score += commonKeywords.length * 1.5;

  // Autor má menšiu váhu
  if (post1.author === post2.author || post1.authorName === post2.authorName) {
    score += 0.5;
  }

  return score;
}

/**
 * Nájde related posts pre daný článok
 */
export function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], limit: number = 3): BlogPost[] {
  // Filtrujeme len published a public posts, okrem aktuálneho
  const availablePosts = allPosts.filter(
    p => p.slug !== currentPost.slug &&
         p.status === 'published' &&
         p.visibility === 'public'
  );

  // Vypočítame podobnosť pre každý článok
  const postsWithSimilarity = availablePosts.map(post => ({
    post,
    similarity: calculateSimilarity(currentPost, post),
  }));

  // Zoradíme podľa podobnosti (najvyššia najprv)
  postsWithSimilarity.sort((a, b) => b.similarity - a.similarity);

  // Ak máme články s podobnosťou > 0, vrátime ich
  const related = postsWithSimilarity
    .filter(item => item.similarity > 0)
    .slice(0, limit)
    .map(item => item.post);

  // Ak nemáme dostatok related posts, doplníme najnovšími
  if (related.length < limit) {
    const remaining = limit - related.length;
    const recentPosts = availablePosts
      .filter(p => !related.some(r => r.slug === p.slug))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, remaining);
    
    return [...related, ...recentPosts];
  }

  return related;
}

/**
 * Nájde related posts v rámci kategórie
 */
export function getRelatedPostsByCategory(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  const categoryPosts = allPosts.filter(
    p => p.category === currentPost.category &&
         p.slug !== currentPost.slug &&
         p.status === 'published' &&
         p.visibility === 'public'
  );

  return categoryPosts
    .sort((a, b) => {
      // Sticky first
      if (a.isSticky && !b.isSticky) return -1;
      if (!a.isSticky && b.isSticky) return 1;
      // Then by date
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

/**
 * Nájde related posts podľa tagov
 */
export function getRelatedPostsByTags(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  const postsWithCommonTags = allPosts
    .filter(
      p => p.slug !== currentPost.slug &&
           p.status === 'published' &&
           p.visibility === 'public' &&
           p.tags.some(tag => currentPost.tags.includes(tag))
    )
    .map(post => ({
      post,
      commonTagsCount: post.tags.filter(tag => currentPost.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.commonTagsCount - a.commonTagsCount)
    .slice(0, limit)
    .map(item => item.post);

  return postsWithCommonTags;
}

