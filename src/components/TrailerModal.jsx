import React, { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import TrailerVideo from './TrailerVideo';

export default function TrailerModal({ movie, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={dialog} className="trailer-dialog" aria-labelledby="trailer-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="bg-slate-950 text-white rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-5"><div><p className="text-xs text-indigo-300">Rasmiy treyler · {movie.year}</p><h2 id="trailer-title" className="font-display text-xl font-bold">{movie.title}</h2></div><button autoFocus type="button" aria-label="Treylerni yopish" onClick={onClose} className="p-2 rounded-full bg-white/10"><X size={20} /></button></div>
      <div className="aspect-video bg-black relative">{movie.trailerId ? <TrailerVideo videoId={movie.trailerId} title={movie.title} /> : <p className="p-8 text-center">Bu filmga hali treyler qo‘shilmagan.</p>}</div>
      <div className="p-5 space-y-4"><p className="text-sm text-slate-300 leading-relaxed">{movie.description}</p><div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400"><span>To‘liq film emas — rasmiy reklama treyleri.</span>{movie.trailerId && <a href={`https://www.youtube.com/watch?v=${movie.trailerId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-300">YouTube’da ochish <ExternalLink size={14} /></a>}</div></div>
    </div>
  </dialog>;
}
