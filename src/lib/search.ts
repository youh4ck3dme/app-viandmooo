import type { BlogPost } from './blog-posts';

/**
 * Full-text search v blog posts
 */
export function searchPosts(query: string, posts: BlogPost[]): BlogPost[] {
  if (!query.trim()) {
    return posts;
  }

  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 0);

  if (searchTerms.length === 0) {
    return posts;
  }

  return posts
    .filter(post => {
      const searchableText = [
        post.title,
        post.summary,
        post.excerpt,
        post.content?.toString() || '',
        ...post.tags,
        ...post.keywords,
        post.category,
        post.author,
        post.authorName,
      ]
        .join(' ')
        .toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    })
    .map(post => {
      // Calculate relevance score
      const searchableText = [
        post.title,
        post.summary,
        post.excerpt,
        post.content?.toString() || '',
        ...post.tags,
        ...post.keywords,
        post.category,
      ]
        .join(' ')
        .toLowerCase();

      let score = 0;
      searchTerms.forEach(term => {
        // Title matches are most important
        if (post.title.toLowerCase().includes(term)) {
          score += 10;
        }
        // Summary/excerpt matches
        if (post.summary.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term)) {
          score += 5;
        }
        // Tag matches
        if (post.tags.some(tag => tag.toLowerCase().includes(term))) {
          score += 3;
        }
        // Keyword matches
        if (post.keywords.some(kw => kw.toLowerCase().includes(term))) {
          score += 2;
        }
        // Category matches
        if (post.category.toLowerCase().includes(term)) {
          score += 1;
        }
        // Content matches
        if (searchableText.includes(term)) {
          score += 1;
        }
      });

      return { post, score };
    })
    .sort((a, b) => {
      // Sticky posts first
      if (a.post.isSticky && !b.post.isSticky) return -1;
      if (!a.post.isSticky && b.post.isSticky) return 1;
      // Then by score
      if (b.score !== a.score) return b.score - a.score;
      // Then by date
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .map(item => item.post);
}

/**
 * Search suggestions based on query
 */
export function getSearchSuggestions(query: string, posts: BlogPost[]): string[] {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();

  posts.forEach(post => {
    // Title suggestions
    if (post.title.toLowerCase().includes(queryLower)) {
      suggestions.add(post.title);
    }
    // Tag suggestions
    post.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag);
      }
    });
    // Keyword suggestions
    post.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(queryLower)) {
        suggestions.add(keyword);
      }
    });
  });

  return Array.from(suggestions).slice(0, 5);
}

