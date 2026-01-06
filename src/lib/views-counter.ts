// Simple in-memory views counter
// V produkcii by to malo byť v databáze alebo externom servise

const viewsMap = new Map<string, number>();

export function incrementViews(slug: string): number {
  const current = viewsMap.get(slug) || 0;
  const newCount = current + 1;
  viewsMap.set(slug, newCount);
  return newCount;
}

export function getViews(slug: string): number {
  return viewsMap.get(slug) || 0;
}

export function setViews(slug: string, count: number): void {
  viewsMap.set(slug, count);
}

// Simulácia views pre existujúce články
export function initializeViews(slugs: string[]): void {
  slugs.forEach(slug => {
    if (!viewsMap.has(slug)) {
      // Simulované views medzi 50 a 500
      viewsMap.set(slug, Math.floor(Math.random() * 450) + 50);
    }
  });
}

