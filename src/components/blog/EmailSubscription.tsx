'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailSubscriptionProps {
  className?: string;
}

export function EmailSubscription({ className }: EmailSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setIsLoading(true);
    
    // TODO: Integrate with email service (Mailchimp, SendGrid, etc.)
    // For now, just simulate success
    setTimeout(() => {
      setSubscribed(true);
      setIsLoading(false);
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => setSubscribed(false), 5000);
    }, 1000);
  };

  return (
    <div className={cn("border rounded-lg p-6 bg-card", className)}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-headline text-primary font-semibold mb-2">
            Odoberať novinky
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Prihláste sa na odber noviniek a získajte najnovšie články a tipy priamo do vašej schránky.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Check className="w-4 h-4" />
              <span>Ďakujeme za prihlásenie!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Váš email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow"
                required
                aria-label="Email pre odber noviniek"
              />
              <Button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="whitespace-nowrap"
              >
                {isLoading ? 'Odosielanie...' : 'Prihlásiť sa'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

