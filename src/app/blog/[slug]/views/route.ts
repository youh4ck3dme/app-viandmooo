import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/views-counter';

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();
    
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug' },
        { status: 400 }
      );
    }

    const views = incrementViews(slug);
    
    return NextResponse.json({ views });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  
  if (!slug) {
    return NextResponse.json(
      { error: 'Slug is required' },
      { status: 400 }
    );
  }

  const { getViews } = await import('@/lib/views-counter');
  const views = getViews(slug);
  
  return NextResponse.json({ views });
}

