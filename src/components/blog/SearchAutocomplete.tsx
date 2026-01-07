'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { getSearchSuggestions } from '@/lib/search';
import { blogPosts } from '@/lib/blog-posts';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SearchAutocompleteProps {
  onSelect?: (query: string) => void;
  className?: string;
}

export function SearchAutocomplete({ onSelect, className }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const newSuggestions = getSearchSuggestions(query, blogPosts);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Hľadať v článkoch..."
          className="w-full pl-10 pr-4 py-2 h-11 md:h-12 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Hľadať v blog článkoch"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          className="absolute z-50 w-full mt-1 bg-card border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => {
            // Check if suggestion is a post title
            const post = blogPosts.find(p => p.title === suggestion);
            
            return post ? (
              <Link
                key={suggestion}
                href={`/blog/${post.slug}`}
                className={cn(
                  "block px-4 py-2 hover:bg-muted transition-colors",
                  selectedIndex === index && "bg-muted"
                )}
                role="option"
                aria-selected={selectedIndex === index}
                onClick={() => setShowSuggestions(false)}
              >
                <div className="font-medium text-sm">{suggestion}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {post.category} • {new Date(post.date).toLocaleDateString('sk-SK')}
                </div>
              </Link>
            ) : (
              <button
                key={suggestion}
                onClick={() => handleSelect(suggestion)}
                className={cn(
                  "w-full text-left px-4 py-2 hover:bg-muted transition-colors",
                  selectedIndex === index && "bg-muted"
                )}
                role="option"
                aria-selected={selectedIndex === index}
              >
                <div className="font-medium text-sm">{suggestion}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

