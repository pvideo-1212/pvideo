
import fs from 'fs';
import path from 'path';
import { scrapeVideoList, scrapeModels, scrapeChannels } from './scraper/scraper';

const BASE_URL = 'https://pornhub1.fun';
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap-internal.xml');
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

export async function generateSitemap(force: boolean = false) {
  // Check if sitemap exists and is fresh
  if (!force && fs.existsSync(SITEMAP_PATH)) {
    const stats = fs.statSync(SITEMAP_PATH);
    const now = new Date().getTime();
    const lastModified = stats.mtime.getTime();

    if (now - lastModified < COOLDOWN_MS) {
      console.log('⏳ Sitemap is fresh, skipping generation.');
      return;
    }
  }

  console.log('🚀 Starting sitemap generation...');

  const staticRoutes = [
    { url: BASE_URL, changeFreq: 'always', priority: 1.0 },
    { url: `${BASE_URL}/categories`, changeFreq: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/models`, changeFreq: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/channels`, changeFreq: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFreq: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, changeFreq: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, changeFreq: 'monthly', priority: 0.3 },
  ];

  let dynamicRoutes: string[] = [];

  try {
    const [videosConfig, modelsConfig, channelsConfig] = await Promise.all([
      scrapeVideoList(1),
      scrapeModels(1),
      scrapeChannels(1),
    ]);

    const videoRoutes = (videosConfig?.items || [])
      .filter((v: any) => v.id)
      .map((v: any) => `
  <url>
    <loc>${BASE_URL}/video/${v.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`);

    const modelRoutes = (modelsConfig?.items || [])
      .filter((m: any) => m.id)
      .map((m: any) => `
  <url>
    <loc>${BASE_URL}/models/${m.id}${m.slug ? `?slug=${m.slug}` : ''}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`);

    const channelRoutes = (channelsConfig?.items || [])
      .filter((c: any) => c.id)
      .map((c: any) => `
  <url>
    <loc>${BASE_URL}/channels/${c.id}${c.slug ? `?slug=${c.slug}` : ''}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`);

    dynamicRoutes = [...videoRoutes, ...modelRoutes, ...channelRoutes];

    console.log(`✅ Fetched ${videoRoutes.length} videos`);
    console.log(`✅ Fetched ${modelRoutes.length} models`);
    console.log(`✅ Fetched ${channelRoutes.length} channels`);

  } catch (error) {
    console.error('❌ Error scraping dynamic content:', error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes.map(route => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changeFreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
  `).join('')}
  ${dynamicRoutes.join('')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf-8');
  console.log(`🎉 Sitemap successfully generated at: ${SITEMAP_PATH}`);
}
