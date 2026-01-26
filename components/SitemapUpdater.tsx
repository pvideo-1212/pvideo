
'use client';

import { useEffect } from 'react';

export default function SitemapUpdater() {
  useEffect(() => {
    // Fire and forget - check if sitemap needs update
    // We use a small timeout to not affect initial page load performance
    const timer = setTimeout(() => {
      fetch('/api/internal/sitemap-check', { priority: 'low' }).catch(() => { });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
