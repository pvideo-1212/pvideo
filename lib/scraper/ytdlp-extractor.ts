import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface YtdlpStream {
  url: string
  quality: string
  ext: string
  filesize?: number
  format_id?: string
}

// Path to yt-dlp executable - try standard path first, then local python path
// In Docker it should be just 'yt-dlp', locally it might be full path
const YTDLP_PATH = process.env.YTDLP_PATH || 'yt-dlp'

export async function extractStreams(videoUrl: string): Promise<YtdlpStream[]> {
  try {
    // --no-warnings: suppress warnings
    // -j: dump JSON
    // --no-playlist: only single video
    const cmd = `${YTDLP_PATH} -j --no-warnings --no-playlist "${videoUrl}"`

    // 30 second timeout
    const { stdout } = await execAsync(cmd, { timeout: 30000 })

    if (!stdout) return []

    const data = JSON.parse(stdout)

    // Sort formats
    if (!data.formats || !Array.isArray(data.formats)) {
      return []
    }

    const streams = data.formats
      .filter((f: any) => {
        // We want mp4 video files that have both video and audio (or are combined)
        // protocol 'https' is preferred
        return f.ext === 'mp4' && f.url && f.url.startsWith('http')
      })
      .map((f: any) => {
        let quality = 'auto'
        if (f.height) {
          if (f.height >= 2160) quality = '4K'
          else quality = `${f.height}p`
        }

        return {
          url: f.url,
          quality,
          ext: f.ext,
          filesize: f.filesize,
          format_id: f.format_id
        } as YtdlpStream
      })
      // Unique by quality (keeping highest bitrate/filesize for that quality)
      .reduce((acc: YtdlpStream[], current: YtdlpStream) => {
        const existing = acc.find(item => item.quality === current.quality)
        if (!existing) {
          acc.push(current)
        } else if ((current.filesize || 0) > (existing.filesize || 0)) {
          // Replace with better version of same quality
          Object.assign(existing, current)
        }
        return acc
      }, [])
      .sort((a: YtdlpStream, b: YtdlpStream) => {
        const getQ = (q: string) => q === '4K' ? 2160 : parseInt(q) || 0
        return getQ(b.quality) - getQ(a.quality)
      })

    return streams
  } catch (error) {
    console.error('[yt-dlp] Extraction failed:', error)
    return []
  }
}
