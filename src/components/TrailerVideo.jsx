import React, { useEffect, useRef, useState } from 'react';
import { loadYouTube } from '../lib/youtube';

export default function TrailerVideo({ videoId, title, preview = false, onDone }) {
  const host = useRef(null);
  const done = useRef(onDone);
  done.current = onDone;
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    let cancelled = false, player, interval;
    const fallback = setTimeout(() => { if (!cancelled) { setStatus('error'); if (preview) done.current?.(); } }, 18000);
    setStatus('loading');
    loadYouTube().then(YT => {
      if (cancelled) return;
      const target = document.createElement('div');
      host.current.appendChild(target);
      player = new YT.Player(target, {
        host: 'https://www.youtube-nocookie.com', width: '100%', height: '100%', videoId,
        playerVars: { autoplay: 1, mute: preview ? 1 : 0, controls: preview ? 0 : 1, playsinline: 1, rel: 0, origin: window.location.origin, ...(preview ? { start: 0, end: 4, disablekb: 1 } : {}) },
        events: {
          onReady: event => {
            if (cancelled) return;
            const iframe = event.target.getIframe();
            iframe.title = `${title} — ${preview ? '4 soniyalik preview' : 'rasmiy treyler'}`;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            if (preview) event.target.mute();
            event.target.playVideo();
          },
          onStateChange: event => {
            if (cancelled) return;
            if (event.data === YT.PlayerState.PLAYING) {
              clearTimeout(fallback); setStatus('playing');
              if (preview && !interval) interval = setInterval(() => {
                if (player.getCurrentTime() >= 4) { clearInterval(interval); player.pauseVideo(); done.current?.(); }
              }, 100);
            }
            if (preview && event.data === YT.PlayerState.ENDED) done.current?.();
          },
          onAutoplayBlocked: () => { clearTimeout(fallback); if (preview) done.current?.(); else setStatus('ready'); },
          onError: () => { clearTimeout(fallback); if (!cancelled) { setStatus('error'); if (preview) done.current?.(); } },
        },
      });
    }).catch(() => { if (!cancelled) { setStatus('error'); if (preview) done.current?.(); } });
    return () => { cancelled = true; clearTimeout(fallback); clearInterval(interval); player?.destroy(); };
  }, [videoId, title, preview]);
  return <div className={`trailer-video ${preview ? 'trailer-preview' : ''}`} data-status={status}>
    <div ref={host} className="absolute inset-0" />
    {status === 'loading' && <span role="status" className="absolute bottom-3 left-3 text-xs rounded-full px-3 py-1 bg-black/70 text-white pointer-events-none">Video yuklanmoqda…</span>}
    {status === 'error' && !preview && <div role="alert" className="absolute inset-0 grid place-content-center gap-4 p-6 text-center bg-slate-950 text-white"><p>Treyler bu brauzerda ochilmadi.</p><a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="btn-primary bg-indigo-600">YouTube’da ochish ↗</a></div>}
  </div>;
}
