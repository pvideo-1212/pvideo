
import { NextResponse } from 'next/server';
import { generateSitemap } from '@/lib/sitemap-generator';

export async function GET() {
  // Trigger generation in background without awaiting key logic if possible, 
  // or await it since it has a fast cooldown check.
  // The cooldown check is synchronous and fast (fs.statSync), so awaiting is fine.
  try {
    await generateSitemap(false); // false = respect cooldown
    return NextResponse.json({ status: 'checked' });
  } catch (error) {
    console.error('Sitemap trigger error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
