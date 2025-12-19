import { NextRequest } from 'next/server'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  if (!id) {
    return new Response('Video ID required', { status: 400 })
  }

  // Create a custom player page that loads via iframe
  // This HTML will be served from our domain, so no X-Frame-Options issues
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Video Player</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    
    .player-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .video-frame {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    
    .loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #0d0d0d 100%);
      z-index: 10;
      transition: opacity 0.5s;
    }
    
    .loading.hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 144, 0, 0.3);
      border-top-color: #FF9000;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .loading p {
      color: #888;
      margin-top: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
    }
    
    .error-state {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #0d0d0d 100%);
      z-index: 20;
      padding: 20px;
      text-align: center;
    }
    
    .error-state.show {
      display: flex;
    }
    
    .error-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #FF9000 0%, #FF6000 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .error-icon svg {
      width: 40px;
      height: 40px;
      fill: #fff;
    }
    
    .error-state h3 {
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 20px;
      margin-bottom: 10px;
    }
    
    .error-state p {
      color: #888;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      margin-bottom: 24px;
      max-width: 320px;
      line-height: 1.5;
    }
    
    .vpn-steps {
      background: rgba(255, 144, 0, 0.1);
      border: 1px solid rgba(255, 144, 0, 0.3);
      border-radius: 12px;
      padding: 16px 20px;
      max-width: 340px;
      text-align: left;
      margin-bottom: 20px;
    }
    
    .vpn-steps h4 {
      color: #FF9000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      margin-bottom: 12px;
    }
    
    .vpn-steps ol {
      color: #ccc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      padding-left: 20px;
      line-height: 1.8;
    }
    
    .retry-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: linear-gradient(135deg, #FF9000 0%, #FF6000 100%);
      color: #000;
      text-decoration: none;
      border-radius: 50px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-weight: 600;
      font-size: 16px;
      border: none;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .retry-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 144, 0, 0.4);
    }
  </style>
</head>
<body>
  <div class="player-wrapper">
    <div class="loading" id="loading">
      <div class="spinner"></div>
      <p>Loading video player...</p>
    </div>
    
    <div class="error-state" id="error">
      <div class="error-icon">
        <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
      </div>
      <h3>VPN Required</h3>
      <p>This video requires a VPN to play in your region.</p>
      
      <div class="vpn-steps">
        <h4>How to watch:</h4>
        <ol>
          <li>Install a VPN browser extension</li>
          <li>Connect to USA, UK, or EU server</li>
          <li>Click the refresh button below</li>
        </ol>
      </div>
      
      <button class="retry-btn" onclick="location.reload()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
        Refresh After VPN
      </button>
    </div>
    
    <iframe 
      id="player"
      class="video-frame" 
      src="https://www.eporner.com/embed/${id}/"
      allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      sandbox="allow-scripts allow-same-origin"
    ></iframe>
  </div>
  
  <script>
    const frame = document.getElementById('player');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    
    let loadTimeout;
    
    // Set a timeout for loading
    loadTimeout = setTimeout(() => {
      loading.classList.add('hidden');
      error.classList.add('show');
    }, 8000);
    
    frame.onload = function() {
      clearTimeout(loadTimeout);
      setTimeout(() => {
        loading.classList.add('hidden');
      }, 500);
    };
    
    frame.onerror = function() {
      clearTimeout(loadTimeout);
      loading.classList.add('hidden');
      error.classList.add('show');
    };
  </script>
</body>
</html>
  `

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
