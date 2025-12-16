// Comprehensive SEO data for adult entertainment site
// Keywords organized by category for maximum search visibility

export const SITE_NAME = 'Pornhub'
export const SITE_URL = 'https://www.pornhub.com'
export const SITE_DESCRIPTION = 'Watch free porn videos at Pornhub. The world\'s leading free porn site. Choose from millions of hardcore videos that stream quickly and in high quality.'

// Primary keywords - most searched terms
export const PRIMARY_KEYWORDS = [
  'free porn',
  'porn videos',
  'sex videos',
  'pornhub',
  'free sex',
  'xxx videos',
  'adult videos',
  'porn movies',
  'free porn videos',
  'hd porn',
  'full porn movies',
  'porn tube',
  'sex tube',
  'xxx tube',
  'adult tube',
]

// Category keywords - organized by popular categories
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  popular: [
    'amateur porn', 'milf porn', 'teen porn', 'lesbian porn', 'anal porn',
    'asian porn', 'latina porn', 'ebony porn', 'blonde porn', 'brunette porn',
    'big tits', 'big ass', 'pov porn', 'creampie', 'blowjob videos',
  ],
  amateur: [
    'homemade porn', 'amateur sex', 'real amateur', 'verified amateur',
    'amateur couple', 'amateur teen', 'amateur milf', 'amateur wife',
  ],
  milf: [
    'hot milf', 'milf sex', 'mature porn', 'mom porn', 'cougar porn',
    'milf seduction', 'milf threesome', 'step mom porn',
  ],
  teen: [
    'teen sex', 'young porn', '18+ teen', 'college porn', 'teen amateur',
    'petite teen', 'teen pov', 'teen blonde',
  ],
  lesbian: [
    'lesbian sex', 'girl on girl', 'lesbian threesome', 'lesbian milf',
    'lesbian teen', 'lesbian massage', 'lesbian strapon',
  ],
  anal: [
    'anal sex', 'first anal', 'anal creampie', 'double penetration',
    'anal teen', 'anal milf', 'rough anal', 'anal compilation',
  ],
  asian: [
    'japanese porn', 'korean porn', 'chinese porn', 'thai porn',
    'asian milf', 'asian teen', 'asian massage', 'jav',
  ],
  ebony: [
    'black porn', 'ebony sex', 'black teen', 'ebony milf',
    'bbc', 'interracial', 'ebony amateur',
  ],
  blonde: [
    'blonde sex', 'hot blonde', 'blonde teen', 'blonde milf',
    'blonde pov', 'blonde threesome',
  ],
  brunette: [
    'brunette sex', 'hot brunette', 'brunette teen', 'brunette milf',
    'brunette pov', 'brunette amateur',
  ],
  threesome: [
    'mmf threesome', 'ffm threesome', 'group sex', 'orgy',
    'gangbang', 'double penetration', 'dp',
  ],
  hd: [
    '4k porn', 'hd sex', 'full hd porn', 'ultra hd', '1080p porn',
    'high quality porn', 'hd videos',
  ],
  pov: [
    'pov sex', 'pov blowjob', 'pov anal', 'virtual sex',
    'pov teen', 'pov milf', 'gonzo porn',
  ],
}

// Long-tail keywords for better organic reach
export const LONG_TAIL_KEYWORDS = [
  'free porn videos online',
  'watch porn videos for free',
  'best free porn site',
  'free hd porn videos',
  'free porn movies full length',
  'amateur porn videos free',
  'homemade sex videos',
  'free milf porn videos',
  'watch sex videos online',
  'streaming porn videos',
  'mobile porn videos',
  'porn videos download',
  'new porn videos',
  'trending porn videos',
  'most viewed porn videos',
  'popular porn videos',
  'top rated porn videos',
  'recommended porn videos',
  'porn videos near me',
  'local porn videos',
]

// Related search terms
export const RELATED_SEARCHES = [
  'xvideos', 'xnxx', 'redtube', 'youporn', 'tube8',
  'xhamster', 'spankbang', 'eporner', 'thumbzilla',
  'free xxx', 'adult entertainment', 'adult content',
  'nsfw videos', 'mature content', 'explicit videos',
]

// Trending keywords (updated dynamically in real app)
export const TRENDING_KEYWORDS = [
  'viral porn', 'trending sex videos', 'popular today',
  'most watched', 'top rated today', 'new releases',
  'verified models', 'premium porn free', 'exclusive content',
]

// Generate meta keywords string
export function generateMetaKeywords(category?: string): string {
  const keywords = [...PRIMARY_KEYWORDS]

  if (category && CATEGORY_KEYWORDS[category.toLowerCase()]) {
    keywords.push(...CATEGORY_KEYWORDS[category.toLowerCase()])
  }

  keywords.push(...LONG_TAIL_KEYWORDS.slice(0, 10))
  keywords.push(...TRENDING_KEYWORDS.slice(0, 5))

  return keywords.slice(0, 50).join(', ')
}

// Generate page title
export function generatePageTitle(pageType: string, value?: string): string {
  switch (pageType) {
    case 'home':
      return 'Pornhub - Free Porn Videos & Sex Movies'
    case 'category':
      return `${value || 'Category'} Porn Videos - Free ${value || ''} Sex Movies | Pornhub`
    case 'video':
      return `${value || 'Video'} - Free Porn Video | Pornhub`
    case 'pornstar':
      return `${value || 'Pornstar'} Porn Videos - Free ${value || ''} Sex Movies | Pornhub`
    case 'search':
      return `${value || 'Search'} - Porn Video Search Results | Pornhub`
    default:
      return 'Pornhub - Free Porn Videos & Sex Movies'
  }
}

// Generate meta description
export function generateMetaDescription(pageType: string, value?: string): string {
  switch (pageType) {
    case 'home':
      return 'Watch free porn videos at Pornhub. The world\'s leading free porn site. Choose from millions of hardcore videos that stream quickly and in high quality.'
    case 'category':
      return `Watch free ${value?.toLowerCase() || ''} porn videos on Pornhub. The best ${value?.toLowerCase() || ''} sex movies featuring hot ${value?.toLowerCase() || ''} content. Stream or download in HD.`
    case 'video':
      return `Watch ${value || 'this video'} for free on Pornhub. Stream this hot porn video in HD quality. New videos added daily.`
    case 'pornstar':
      return `Watch all ${value || ''} porn videos for free on Pornhub. See ${value || 'this pornstar'} in hot sex scenes, blowjobs, anal, and more.`
    case 'search':
      return `Search results for "${value || ''}" on Pornhub. Find the best ${value || ''} porn videos and watch for free.`
    default:
      return SITE_DESCRIPTION
  }
}

// Schema.org structured data for videos
export function generateVideoSchema(video: {
  title: string
  description?: string
  thumbnail?: string
  duration?: string
  uploadDate?: string
  views?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description || video.title,
    thumbnailUrl: video.thumbnail || '',
    duration: video.duration ? `PT${video.duration.replace(':', 'M')}S` : undefined,
    uploadDate: video.uploadDate || new Date().toISOString(),
    interactionStatistic: video.views ? {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/WatchAction',
      userInteractionCount: parseInt(video.views.replace(/[^0-9]/g, '')) || 0,
    } : undefined,
    contentRating: 'adult only',
  }
}

// Schema.org structured data for website
export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

// Schema.org structured data for organization
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    'https://twitter.com/pornhub',
    'https://instagram.com/pornhub',
  ],
}

// Popular searches for homepage
export const POPULAR_SEARCHES = [
  'milf', 'teen', 'lesbian', 'anal', 'amateur', 'asian', 'ebony',
  'blonde', 'brunette', 'big tits', 'big ass', 'pov', 'creampie',
  'threesome', 'blowjob', 'hardcore', 'massage', 'stepmom', 'stepsister',
  'college', 'mature', 'hd', '4k', 'romantic', 'rough', 'bbc',
  'interracial', 'latina', 'japanese', 'korean', 'indian', 'european',
]

// Tags cloud for SEO footer
export const SEO_TAGS = [
  'Free Porn', 'Sex Videos', 'XXX Movies', 'HD Porn', 'Amateur Porn',
  'Homemade Sex', 'MILF Porn', 'Teen Porn', 'Lesbian Sex', 'Anal Videos',
  'Asian Porn', 'Latina Porn', 'Ebony Porn', 'Blonde Porn', 'Brunette Porn',
  'Big Tits', 'Big Ass', 'POV Porn', 'Creampie Videos', 'Blowjob Porn',
  'Threesome Videos', 'Gangbang Porn', 'Massage Porn', 'Romantic Sex',
  'Rough Sex', 'BDSM Videos', 'Fetish Porn', 'Cosplay Porn', 'Hentai',
  'Virtual Reality Porn', 'VR Sex', '4K Ultra HD', 'Full Movies', 'New Porn',
  'Trending Videos', 'Most Viewed', 'Top Rated', 'Verified Models', 'Premium',
]

// Countries for geo-targeting
export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Netherlands', 'Brazil', 'Mexico', 'India',
  'Japan', 'South Korea', 'Philippines', 'Thailand', 'Indonesia', 'Russia',
  'Poland', 'Czech Republic', 'Hungary', 'Sweden', 'Norway', 'Denmark',
  'Finland', 'Belgium', 'Austria', 'Switzerland', 'Portugal', 'Ireland',
]

// Languages for internationalization
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
]
