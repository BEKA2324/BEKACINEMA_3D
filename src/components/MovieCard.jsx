import React, { useEffect, useState } from 'react';
import { Play, Bookmark, Star, Edit3, Trash2 } from 'lucide-react';
import TrailerVideo from './TrailerVideo';

export default function MovieCard({ movie, isSaved, isAdmin, onSave, onPlay, onEdit, onDelete, previewsEnabled }) {
  const [hovered, setHovered] = useState(false);
  const [preview, setPreview] = useState(false);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!hovered || finished || !previewsEnabled || !movie.trailerId || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setTimeout(() => setPreview(true), 450);
    return () => clearTimeout(timer);
  }, [hovered, finished, previewsEnabled, movie.trailerId]);
  const stop = () => { setHovered(false); setPreview(false); setFinished(false); };
  return <article onMouseEnter={() => setHovered(true)} onMouseLeave={stop} onFocus={() => setHovered(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) stop(); }} className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-apple hover:shadow-apple-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
    <div className="relative h-64 overflow-hidden bg-slate-900">
      <img src={movie.poster} alt={movie.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      {preview && previewsEnabled && <TrailerVideo videoId={movie.trailerId} title={movie.title} preview onDone={() => { setPreview(false); setFinished(true); }} />}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/10 pointer-events-none" />
      <button type="button" aria-label={`${movie.title} — treylerni ochish`} onClick={onPlay} className="absolute inset-0 grid place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"><span className="grid place-items-center w-12 h-12 rounded-full bg-white/90 dark:bg-slate-900/90 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"><Play size={20} /></span></button>
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span className="flex items-center gap-1 bg-slate-900/75 text-white text-xs px-2.5 py-1 rounded-full"><Star size={12} className="fill-amber-400 text-amber-400" />{movie.rating}<span className="sr-only">BEKA tavsiyasi</span></span>
        <button type="button" onClick={onSave} aria-label={`${movie.title} — ${isSaved ? 'saqlanganlardan olib tashlash' : 'saqlash'}`} aria-pressed={isSaved} className={`pointer-events-auto w-9 h-9 rounded-full grid place-items-center ${isSaved ? 'bg-indigo-600 text-white' : 'bg-slate-900/75 text-white'}`}><Bookmark size={16} className={isSaved ? 'fill-current' : ''} /></button>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-[11px] text-white pointer-events-none"><span className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg">{movie.genre}</span><span>{preview ? 'Ovozsiz · 4 soniya' : movie.type === 'series' ? 'Serial' : 'Film'}</span></div>
    </div>
    <div className="p-5 space-y-2 flex-1"><p className="text-xs text-slate-400">{movie.year} · {movie.duration}</p><h3 className="font-display font-bold text-base"><button onClick={onPlay} className="text-left hover:text-indigo-600">{movie.title}</button></h3><p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{movie.description}</p></div>
    <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
      <button type="button" onClick={onPlay} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1.5"><Play size={14} /> Treylerni ko‘rish</button>
      <div className="flex gap-2">
        <button type="button" aria-label={`${movie.title} — 4 soniya preview`} disabled={!movie.trailerId} onClick={() => { setFinished(false); setPreview(value => !value); }} className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 disabled:opacity-40">4s preview</button>
        {isAdmin && <><button type="button" aria-label={`${movie.title} — tahrirlash`} onClick={onEdit}><Edit3 size={15} /></button><button type="button" aria-label={`${movie.title} — o‘chirish`} onClick={onDelete} className="text-rose-500"><Trash2 size={15} /></button></>}
      </div>
    </div>
  </article>;
}
