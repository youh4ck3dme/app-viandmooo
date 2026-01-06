'use client';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className="flex items-center gap-2"
      aria-label="Tlačiť článok"
    >
      <Printer className="w-4 h-4" />
      <span className="hidden sm:inline">Tlačiť</span>
    </Button>
  );
}

