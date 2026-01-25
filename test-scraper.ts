
import { scrapeVideoDetails, scrapeVideoList } from './lib/scraper/scraper';

async function test() {
  console.log('Testing video scraper...');

  try {
    console.log('Fetching video list to get a valid ID...');
    const list = await scrapeVideoList(1);

    if (!list.items || list.items.length === 0) {
      console.error('Failed to get video list');
      return;
    }

    const videoId = list.items[0].id;
    console.log(`Testing with video ID: ${videoId}`);

    const start = Date.now();
    const details = await scrapeVideoDetails(videoId);
    const duration = Date.now() - start;

    console.log(`Scraping took ${duration}ms`);

    if (!details) {
      console.error('Failed to get video details');
      return;
    }

    console.log('Video Details:', {
      title: details.title,
      streamsCount: details.streams.length,
      streamTypes: details.streams.map(s => s.type),
      qualities: details.streams.map(s => s.quality)
    });

    const m3u8Streams = details.streams.filter(s => s.type === 'm3u8' || s.url.includes('.m3u8'));
    if (m3u8Streams.length > 0) {
      console.error('FAIL: Found m3u8 streams!', m3u8Streams);
    } else {
      console.log('PASS: No m3u8 streams found.');
    }

    if (details.streams.length > 0) {
      console.log('PASS: Found mp4 streams.');
    } else {
      console.warn('WARN: No streams found (might be premium/restricted video).');
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
