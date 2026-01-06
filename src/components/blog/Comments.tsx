'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Comment {
  id: string;
  author: string;
  email: string;
  website?: string;
  content: string;
  date: string;
  parentId?: string;
  replies?: Comment[];
}

interface CommentsProps {
  postSlug: string;
  className?: string;
}

export function Comments({ postSlug, className }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    website: '',
    content: '',
    parentId: '',
  });

  useEffect(() => {
    // Load comments from localStorage (v produkcii by to bolo z API)
    const stored = localStorage.getItem(`comments-${postSlug}`);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch {
        setComments([]);
      }
    }
    setIsLoading(false);
  }, [postSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.email.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: formData.author,
      email: formData.email,
      content: formData.content,
      date: new Date().toISOString(),
      parentId: formData.parentId || undefined,
    };

    let updatedComments: Comment[];
    if (formData.parentId) {
      // Add as reply
      const addReply = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === formData.parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: addReply(comment.replies),
            };
          }
          return comment;
        });
      };
      updatedComments = addReply(comments);
    } else {
      updatedComments = [...comments, newComment];
    }

    setComments(updatedComments);
    localStorage.setItem(`comments-${postSlug}`, JSON.stringify(updatedComments));
    
    // Reset form
    setFormData({
      author: '',
      email: '',
      website: '',
      content: '',
      parentId: '',
    });
    setShowForm(false);
    setReplyTo(null);
    setIsSubmitting(false);
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyTo(commentId);
    setFormData(prev => ({ ...prev, parentId: commentId, content: `@${authorName} ` }));
    setShowForm(true);
  };

  const renderComment = (comment: Comment, depth: number = 0): React.ReactNode => {
    const initials = comment.author
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div key={comment.id} className={cn("space-y-4", depth > 0 && "ml-6 md:ml-12 mt-4")}>
        <Card className="border-l-4 border-l-primary/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex gap-4">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-foreground">{comment.author}</h4>
                  {comment.website && (
                    <a
                      href={comment.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      {comment.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  <time className="text-xs text-muted-foreground">
                    {new Date(comment.date).toLocaleDateString('sk-SK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
                <div className="prose prose-sm max-w-none text-foreground/90 mb-3">
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </div>
                {depth < 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReply(comment.id, comment.author)}
                    className="text-xs"
                  >
                    Odpovedať
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <section className={cn("mt-12 md:mt-16", className)} id="comments">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h2 className="text-2xl md:text-3xl font-headline text-primary">
          Komentáre ({comments.length})
        </h2>
      </div>

      {comments.length === 0 && !showForm ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Zatiaľ nie sú žiadne komentáre. Buďte prvý, kto napíše komentár!</p>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {comments.map(comment => renderComment(comment))}
        </div>
      )}

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <MessageSquare className="w-4 h-4 mr-2" />
          Pridať komentár
        </Button>
      ) : (
        <Card className="mt-8">
          <CardContent className="p-6">
            {replyTo && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Odpovedáte na komentár od {comments.find(c => c.id === replyTo)?.author}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplyTo(null);
                    setFormData(prev => ({ ...prev, parentId: '', content: '' }));
                  }}
                  className="mt-2 text-xs"
                >
                  Zrušiť odpoveď
                </Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="author" className="block text-sm font-medium mb-2">
                    Meno <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    required
                    placeholder="Vaše meno"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="vas@email.sk"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-2">
                  Webstránka (voliteľné)
                </label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://vas-web.sk"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                  Komentár <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={6}
                  placeholder="Napíšte svoj komentár..."
                  className="resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Odosielanie...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Odoslať komentár
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setReplyTo(null);
                    setFormData({
                      author: '',
                      email: '',
                      website: '',
                      content: '',
                      parentId: '',
                    });
                  }}
                >
                  Zrušiť
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

