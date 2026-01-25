import { scrapeVideoList } from './lib/scraper/scraper'

async function testScraper() {
  console.log('Testing scrapeVideoListFast(1)...')
  try {
    const result = await scrapeVideoList(1)
    console.log('Success!')
    console.log('Items found:', result.items.length)
    if (result.items.length > 0) {
      console.log('First item:', result.items[0])
    }
  } catch (error) {
    console.error('Scraper Failed:', error)
  }
}

testScraper()
