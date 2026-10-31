let pending;
export function loadYouTube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const timer = setTimeout(() => { pending = null; reject(new Error('YouTube javob bermadi.')); }, 15000);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer); previous?.(); resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => { clearTimeout(timer); pending = null; script.remove(); reject(new Error('YouTube ochilmadi.')); };
    document.head.appendChild(script);
  });
  return pending;
}
