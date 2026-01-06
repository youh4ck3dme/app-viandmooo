import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
}

export function Pagination({ currentPage, totalPages, baseUrl, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl;
    return `${baseUrl}/page/${page}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav 
      className={cn("flex items-center justify-center gap-2 mt-8 md:mt-12", className)}
      aria-label="Stránkovanie"
    >
      {/* First Page */}
      {currentPage > 1 && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="hidden sm:flex"
          aria-label="Prvá stránka"
        >
          <Link href={getPageUrl(1)}>
            <ChevronsLeft className="w-4 h-4" />
          </Link>
        </Button>
      )}

      {/* Previous Page */}
      {currentPage > 1 && (
        <Button
          asChild
          variant="outline"
          size="sm"
          aria-label="Predchádzajúca stránka"
        >
          <Link href={getPageUrl(currentPage - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Predchádzajúca</span>
          </Link>
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            );
          }
          
          const pageNum = page as number;
          const isActive = pageNum === currentPage;
          
          return (
            <Button
              key={pageNum}
              asChild
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn(
                "min-w-[40px]",
                isActive && "pointer-events-none"
              )}
              aria-label={`Stránka ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Link href={getPageUrl(pageNum)}>
                {pageNum}
              </Link>
            </Button>
          );
        })}
      </div>

      {/* Next Page */}
      {currentPage < totalPages && (
        <Button
          asChild
          variant="outline"
          size="sm"
          aria-label="Ďalšia stránka"
        >
          <Link href={getPageUrl(currentPage + 1)}>
            <span className="hidden sm:inline">Ďalšia</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      )}

      {/* Last Page */}
      {currentPage < totalPages && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="hidden sm:flex"
          aria-label="Posledná stránka"
        >
          <Link href={getPageUrl(totalPages)}>
            <ChevronsRight className="w-4 h-4" />
          </Link>
        </Button>
      )}

      {/* Page Info */}
      <div className="hidden md:flex items-center gap-2 ml-4 text-sm text-muted-foreground">
        <span>
          Stránka {currentPage} z {totalPages}
        </span>
      </div>
    </nav>
  );
}

