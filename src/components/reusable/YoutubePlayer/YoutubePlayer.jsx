import React, { useEffect, useRef, useState } from 'react';


const SEEK_STEP = 10;

let apiPromise = null;
const loadYoutubeApi = () => {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous();
      resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error('Failed to load YouTube IFrame API'));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
};

const ERROR_TEXT = {
  2: 'Invalid video.',
  5: 'This video cannot be played on this device.',
  100: 'This video is unavailable.',
  101: 'This video cannot be played outside YouTube.',
  150: 'This video cannot be played outside YouTube.',
  152: 'This video cannot be played on this device.',
  153: 'This video cannot be played on this device.',
};

var APP_ORIGIN = (function () {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    if (window.location.origin.indexOf('http://') === 0 || window.location.origin.indexOf('https://') === 0) {
      return window.location.origin;
    }
  }
  return 'https://HelloMeghalaya.in';
})();

const YoutubePlayer = ({ videoId, title, onEnded, onExit }) => {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const onEndedRef = useRef(onEnded);
  const onExitRef = useRef(onExit);
  onEndedRef.current = onEnded;
  onExitRef.current = onExit;

  // Create / destroy the YouTube player with default YouTube UI
  useEffect(() => {
    if (!videoId) return undefined;
    let cancelled = false;
    setError('');
    setLoading(true);

    loadYoutubeApi()
      .then((YT) => {
        if (cancelled || !hostRef.current) return;
        const mount = document.createElement('div');
        hostRef.current.innerHTML = '';
        hostRef.current.appendChild(mount);

        playerRef.current = new YT.Player(mount, {
          width: '100%',
          height: '100%',
          videoId,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            autoplay: 1,
            controls: 1, // Default YouTube UI controls
            disablekb: 0,
            fs: 1,
            rel: 0,
            modestbranding: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: APP_ORIGIN,
            widget_referrer: APP_ORIGIN,
          },
          events: {
            onReady: (e) => {
              if (cancelled) return;
              setLoading(false);
              var iframe = e.target.getIframe && e.target.getIframe();
              if (iframe) {
                iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
                iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
              }
              try {
                e.target.unMute();
                e.target.setVolume(100);
                e.target.playVideo();
              } catch (err) { /* ignore */ }
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) {
                setLoading(false);
              } else if (e.data === YT.PlayerState.ENDED) {
                onEndedRef.current && onEndedRef.current();
              }
            },
            onError: (e) => {
              setLoading(false);
              setError(ERROR_TEXT[e.data] || 'Unable to play this video.');
              console.warn('YouTube player error:', e.data);
            },
          },
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setLoading(false);
        setError('Unable to load the video player. Please check your connection.');
        console.warn(err);
      });

    return () => {
      cancelled = true;
      try {
        playerRef.current && playerRef.current.destroy();
      } catch (e) { /* ignore */ }
      playerRef.current = null;
      if (hostRef.current) hostRef.current.innerHTML = '';
    };
  }, [videoId]);

  // Remote control key handling
  useEffect(() => {
    const onKeyDown = (event) => {
      const code = event.keyCode || event.which;
      const p = playerRef.current;

      // Handle Back / Exit immediately
      if (code === 413 || code === 461 || code === 10009 || code === 8 || code === 27) {
        event.preventDefault();
        onExitRef.current && onExitRef.current();
        return;
      }

      if (!p || typeof p.getPlayerState !== 'function') return;

      const seek = (delta) => {
        const dur = p.getDuration() || 0;
        let target = (p.getCurrentTime() || 0) + delta;
        if (target < 0) target = 0;
        if (dur && target > dur - 1) target = dur - 1;
        p.seekTo(target, true);
      };

      switch (code) {
        case 13:    // OK / Enter
        case 19:    // Pause (webOS)
        case 415:   // Play
        case 10252: // Play/Pause (Tizen)
          event.preventDefault();
          if (event.repeat) return;
          if (code === 415) {
            p.playVideo();
            return;
          }
          if (code === 19) {
            p.pauseVideo();
            return;
          }
          if (p.getPlayerState() === 1) {
            p.pauseVideo();
          } else {
            p.playVideo();
          }
          break;

        case 37:  // Left Arrow
        case 412: // Media Rewind
          event.preventDefault();
          seek(-SEEK_STEP);
          break;

        case 39:  // Right Arrow
        case 417: // Media Fast Forward
          event.preventDefault();
          seek(SEEK_STEP);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Default YouTube Player */}
      <div ref={hostRef} style={{ width: '100%', height: '100%' }} />

      {/* Loading Spinner */}
      {loading && !error ? (
        <div className="loader isLoading" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="loading" />
        </div>
      ) : null}

      {/* Error View */}
      {error ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center',
            padding: '0 120px',
            backgroundColor: 'rgba(0,0,0,0.85)',
          }}
        >
          {title ? <h1 style={{ fontSize: 40, marginBottom: 24 }}>{title}</h1> : null}
          <p style={{ fontSize: 30, opacity: 0.85 }}>{error}</p>
          <p style={{ fontSize: 24, opacity: 0.6, marginTop: 32 }}>Press Back to return</p>
        </div>
      ) : null}
    </div>
  );
};

export default YoutubePlayer;
