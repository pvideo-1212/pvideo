
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateSitemap } from '@/lib/sitemap-generator';

export async function GET() {
  const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap-internal.xml');

  // Ensure sitemap exists or trigger generation
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.log('⚠️ Sitemap cache missing, generating now...');
    await generateSitemap(true);
  } else {
    // Trigger background update if stale (fire and forget)
    generateSitemap(false).catch(err => console.error('Background sitemap update failed:', err));
  }

  try {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');

    return new NextResponse(sitemapContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return new NextResponse('Error serving sitemap', { status: 500 });
  }
}
