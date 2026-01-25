import { extractStreams } from './lib/scraper/ytdlp-extractor'

async function test() {
  console.log('Testing extraction...')
  const streams = await extractStreams('https://www.eporner.com/video-5q8lfjAqiqL/')
  console.log('Found streams:', streams.length)
  console.log(JSON.stringify(streams, null, 2))
}

test().catch(console.error)
