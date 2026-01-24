// Scraper Configuration

export const config = {
  baseUrl: 'https://spankbang.party',

  // URL patterns
  paths: {
    listing: '/new_videos/',  // Base listing - for page > 1, append {page}/
    video: '/{id}/video/',
    search: '/s/{query}/',  // Base search - page is appended as {page}/
    models: '/pornstars/',  // Model listing
    channels: '/channels/', // Channel listing
  },

  // Browser viewport
  viewport: {
    width: 1920,
    height: 1080,
  },

  // Rotating user agents for anti-detection
  userAgents: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  ],

  // Timeouts (reduced for faster response)
  timeout: {
    navigation: 15000,  // 15 seconds for initial page load
    scrape: 5000,       // 5 seconds for selector waits
  },

  // Cache duration in milliseconds (5 minutes - balanced for freshness & performance)
  cacheDuration: 5 * 60 * 1000,

  // Selectors for extraction
  selectors: {
    videoCard: '.video-item',
    titleLink: 'a[title][href*="/video/"]',
    thumbnail: 'a.thumb img',
    channel: 'a.truncate',
    pageTitle: 'h1',
    views: 'span.views',
    duration: '.vjs-duration-display',
    channelBy: '.channel-by a',
    categories: '.searches a[href^="/s/"]',
    tags: '.tags-info a, .video-tags a',
  },
}

// Get random user agent
export function getRandomUserAgent(): string {
  return config.userAgents[Math.floor(Math.random() * config.userAgents.length)]
}

// Build full URL
export function buildUrl(path: string, params?: Record<string, string>): string {
  let url = config.baseUrl + path
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, encodeURIComponent(value))
    })
  }
  return url
}
