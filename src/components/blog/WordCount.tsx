import { cn } from '@/lib/utils';

interface WordCountProps {
  content: string | React.ReactNode;
  className?: string;
}

export function WordCount({ content, className }: WordCountProps) {
  const text = typeof content === 'string' 
    ? content 
    : content?.toString() || '';
  
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.replace(/\s/g, '').length;

  if (wordCount === 0) return null;

  return (
    <div className={cn("text-xs text-muted-foreground", className)}>
      <span>{wordCount.toLocaleString('sk-SK')} {wordCount === 1 ? 'slovo' : wordCount < 5 ? 'slová' : 'slov'}</span>
      <span className="mx-2">•</span>
      <span>{charCount.toLocaleString('sk-SK')} {charCount === 1 ? 'znak' : charCount < 5 ? 'znaky' : 'znakov'}</span>
    </div>
  );
}

