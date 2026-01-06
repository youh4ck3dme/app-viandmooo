'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasswordProtectedProps {
  onPasswordCorrect: () => void;
  className?: string;
}

export function PasswordProtected({ onPasswordCorrect, className }: PasswordProtectedProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // In production, this would check against the post's password from the database
  // For now, we'll use a simple check (in real app, this would be server-side)
  const correctPassword = 'viandmo2024'; // This should come from post data

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === correctPassword) {
      // Store in sessionStorage so user doesn't need to re-enter
      sessionStorage.setItem('post-password-verified', 'true');
      onPasswordCorrect();
    } else {
      setError('Nesprávne heslo. Skúste to znova.');
    }

    setIsLoading(false);
  };

  return (
    <div className={className}>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-primary" />
            <CardTitle>Chránený článok</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Tento článok je chránený heslom. Zadajte heslo pre zobrazenie obsahu.
          </p>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Heslo
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Zadajte heslo"
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Kontrolujem...' : 'Odomknúť článok'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

