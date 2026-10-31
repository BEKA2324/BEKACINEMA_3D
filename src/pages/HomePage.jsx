import { api, publicPreview } from '../api';
import { useAuth } from '../context/AuthContext';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Play,
  Bookmark,
  Star,
  Plus,
  X,
  Sparkles,
  Film,
  Tv,
  Check,
  SlidersHorizontal,
  Clock,
  Image as ImageIcon,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomSelect from '../components/CustomSelect';
import ButterflyFlight from '../components/ButterflyFlight';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';

const GENRES = ['Barchasi', 'Jangovar', 'Fantastika', 'Triller', 'Drama', 'Sarguzasht', 'Animatsiya'];

const SORT_OPTIONS = [
  { value: 'rating', label: "Reyting bo'yicha (Yuqori)" },
  { value: 'year', label: "Yili bo'yicha (Yangi)" },
];

const TYPE_OPTIONS = [
  { value: 'movie', label: 'Film (Badiiy)' },
  { value: 'series', label: 'Serial (Ko‘p qismli)' },
];

export default function HomePage() {
  const { notify, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [movies, setMovies] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [saving, setSaving] = useState(false);
  const loadCatalog = async () => {
    setCatalogLoading(true); setCatalogError('');
    try { const [items, ids] = await Promise.all([api('/movies'), api('/watchlist')]); setMovies(items); setWatchlistIds(ids); }
    catch (error) { setCatalogError(error.message); }
    finally { setCatalogLoading(false); }
  };
  useEffect(() => { loadCatalog(); }, []);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'movie' | 'series' | 'watchlist'
  const [selectedGenre, setSelectedGenre] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [watchlistIds, setWatchlistIds] = useState([]);

  const [playingMovie, setPlayingMovie] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  useEffect(() => {
    if (!isFormOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = event => { if (event.key === 'Escape') setIsFormOpen(false); };
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', close); };
  }, [isFormOpen]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Fantastika',
    type: 'movie',
    rating: '9.0',
    year: '2026',
    duration: 'Film treyleri',
    quality: 'Rasmiy treyler',
    director: '',
    poster:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    trailerId: '',
    description: '',
  });

  const slides = movies.slice(0, 3);
  const activeSlide = slides[activeSlideIndex] || slides[0];

  const toggleWatchlist = async (id) => {
    try { setWatchlistIds(await api('/watchlist/' + id, { method: 'PUT' })); }
    catch (error) { notify(error.message, 'error'); }
  };

  const filteredMovies = useMemo(() => {
    return movies
      .filter((m) => {
        const matchesSearch =
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.director && m.director.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesGenre = selectedGenre === 'Barchasi' || m.genre === selectedGenre;
        const matchesTab =
          activeTab === 'all' ||
          (activeTab === 'movie' && m.type === 'movie') ||
          (activeTab === 'series' && m.type === 'series') ||
          (activeTab === 'watchlist' && watchlistIds.includes(m.id));
        return matchesSearch && matchesGenre && matchesTab;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
        return parseInt(b.year) - parseInt(a.year);
      });
  }, [movies, searchQuery, selectedGenre, activeTab, watchlistIds, sortBy]);

  const handleOpenCreate = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      genre: 'Fantastika',
      type: 'movie',
      rating: '9.1',
      year: '2026',
      duration: 'Film treyleri',
      quality: 'Rasmiy treyler',
      director: '',
      poster:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      trailerId: '',
      description: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      genre: movie.genre,
      type: movie.type || 'movie',
      rating: movie.rating,
      year: movie.year,
      duration: movie.duration,
      quality: movie.quality || '4K HDR',
      director: movie.director || '',
      poster: movie.poster,
      backdrop: movie.backdrop || '',
      trailerId: movie.trailerId || '',
      description: movie.description,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu filmni katalogdan o‘chirasizmi?')) return;
    try { await api('/movies/' + id, { method: 'DELETE' }); setMovies(prev => prev.filter(m => m.id !== id)); setWatchlistIds(prev => prev.filter(value => value !== id)); notify('Film o‘chirildi.'); }
    catch (error) { notify(error.message, 'error'); }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault(); if (saving) return; setSaving(true);
    try {
      const movie = await api(editingMovie ? '/movies/' + editingMovie.id : '/movies', { method: editingMovie ? 'PUT' : 'POST', body: formData });
      setMovies(prev => editingMovie ? prev.map(m => m.id === movie.id ? movie : m) : [movie, ...prev]);
      setIsFormOpen(false); notify('Film saqlandi.');
    } catch (error) { notify(error.message, 'error'); } finally { setSaving(false); }
  };

  return (
    <div className="cinema-page min-h-screen flex flex-col">
      <ButterflyFlight />
      <Header
        onOpenCreateModal={isAdmin ? handleOpenCreate : undefined}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlistIds.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6 space-y-10">
        {publicPreview && <p role="status" className="glass-panel rounded-2xl px-5 py-3 text-sm text-slate-600 dark:text-slate-300">Katalog va 3D kutubxona ochiq. Hisobga kirish, profil va saqlash xizmati tez orada.</p>}
        {/* Cinematic Hero Spotlight */}
        {activeSlide && <section data-bee-section="banner" className="relative rounded-[32px] overflow-hidden shadow-apple-lg border border-slate-200/80 dark:border-slate-700/80 min-h-[440px] sm:min-h-[500px] flex items-end">
          <img
            src={activeSlide.backdrop || activeSlide.poster}
            alt={activeSlide.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

          <div className="relative z-10 w-full p-6 sm:p-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-4 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  {activeSlide.subtitle || activeSlide.genre}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-600/80 backdrop-blur-md text-[11px] font-semibold">
                  {activeSlide.quality}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
                {activeSlide.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/80 font-medium">
                <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 shrink-0" />
                  <span>{activeSlide.rating} · BEKA tavsiyasi</span>
                </span>
                <span>•</span>
                <span>{activeSlide.year} yil</span>
                <span>•</span>
                <span>{activeSlide.duration}</span>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/15 text-white">
                  {activeSlide.genre}
                </span>
              </div>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed line-clamp-2 sm:line-clamp-3">
                {activeSlide.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPlayingMovie(activeSlide)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-indigo-50 text-slate-900 dark:text-slate-100 font-semibold text-sm shadow-lg transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-slate-900 dark:fill-slate-100 shrink-0" />
                  <span>Treylerni ko‘rish</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWatchlist(activeSlide.id)}
                  className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl backdrop-blur-md border font-semibold text-sm transition-all active:scale-95 ${
                    watchlistIds.includes(activeSlide.id)
                      ? 'bg-rose-600/90 border-rose-400 text-white'
                      : 'bg-white/15 hover:bg-white/25 border-white/25 text-white'
                  }`}
                >
                  {watchlistIds.includes(activeSlide.id) ? (
                    <>
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Saqlangan</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 shrink-0" />
                      <span>Ro'yxatga qo'shish</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Slide Switcher Thumbnails */}
            <div className="flex items-center gap-3 self-start lg:self-end bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/15">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  aria-label={`${slide.title} — bannerda ko‘rish`}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`relative rounded-xl overflow-hidden transition-all ${
                    activeSlideIndex === idx
                      ? 'w-28 h-16 ring-2 ring-white shadow-md'
                      : 'w-20 h-16 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={slide.backdrop || slide.poster}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/30" />
                  <span className="absolute bottom-1 left-2 right-2 text-[10px] font-bold text-white truncate text-left">
                    0{idx + 1}. {slide.title.split(':')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>}

        {catalogLoading && <p role="status">Katalog yuklanmoqda...</p>}
        {catalogError && <div role="alert" className="text-rose-600 dark:text-rose-400">{catalogError} <button onClick={loadCatalog}>Qayta urinish</button></div>}
        {/* Glass Filter & Search Bar */}
        <section data-bee-section="catalog" className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Genre Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={`h-11 px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center ${
                  selectedGenre === genre
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Search Input & Custom Select Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Perfectly Vertically-Centered Flex Search Input */}
            <div className="input-shell h-11 sm:w-64 bg-slate-100/80 dark:bg-slate-800/80">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Film, serial yoki rejissyor..."
                className="input-shell-field text-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Qidiruvni tozalash"
                  onClick={() => setSearchQuery('')}
                  className="flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Custom Select instead of base HTML <select> */}
            <div className="sm:w-56">
              <CustomSelect
                size="sm"
                icon={SlidersHorizontal}
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
              />
            </div>

            {isAdmin && <button
              type="button"
              onClick={handleOpenCreate}
              className="sm:hidden btn-primary bg-indigo-600 text-xs h-11"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Kino qo'shish</span>
            </button>}
          </div>
        </section>

        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {activeTab === 'watchlist'
                ? 'Saqlangan filmlar ro‘yxati'
                : activeTab === 'movie'
                ? 'Badiiy filmlar katalogi'
                : activeTab === 'series'
                ? 'Davomi bor hikoyalar'
                : 'Keyingi sevimli filmingiz shu yerda'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredMovies.length} ta hikoya. Tanlov esa sizdan.
            </p>
          </div>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
              Hech qanday film yoki serial topilmadi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Qidiruv so'zini o'zgartirib ko'ring yoki barcha janrlarni tanlang.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('Barchasi');
                setActiveTab('all');
              }}
              className="btn-primary bg-indigo-600 text-xs mt-2"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMovies.map(movie => <MovieCard key={movie.id} movie={movie} isSaved={watchlistIds.includes(movie.id)} isAdmin={isAdmin} previewsEnabled={!playingMovie && !isFormOpen}
              onSave={() => toggleWatchlist(movie.id)} onPlay={() => setPlayingMovie(movie)} onEdit={() => handleOpenEdit(movie)} onDelete={() => handleDelete(movie.id)} />)}
          </section>
        )}
      </main>

      {playingMovie && <TrailerModal movie={playingMovie} onClose={() => setPlayingMovie(null)} />}

      {/* Create / Edit Movie Modal with CustomSelect & Aligned Input Shells */}
      {isAdmin && isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            role="dialog" aria-modal="true" aria-label="Katalog boshqaruvi"
            className="w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-700/90 shadow-apple-lg p-6 sm:p-8 animate-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Katalog boshqaruvi
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {editingMovie ? 'Filmni tahrirlash' : "Yangi kino qo'shish"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Katalog formasini yopish"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center text-slate-500 dark:text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Film yoki serial nomi
                </label>
                <div className="input-shell">
                  <Film className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={formData.title}
                    aria-label="Film yoki serial nomi"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Masalan: Avatar: Olov va Kul"
                    className="input-shell-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Janr
                  </label>
                  <CustomSelect
                    value={formData.genre}
                    onChange={(val) => setFormData({ ...formData, genre: val })}
                    options={GENRES.filter((g) => g !== 'Barchasi')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Turi
                  </label>
                  <CustomSelect
                    value={formData.type}
                    onChange={(val) => setFormData({ ...formData, type: val })}
                    options={TYPE_OPTIONS}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    BEKA tavsiya bahosi
                  </label>
                  <div className="input-shell">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                    <input
                      type="text"
                      value={formData.rating}
                      aria-label="BEKA tavsiya bahosi"
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="input-shell-field"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Davomiyligi
                  </label>
                  <div className="input-shell">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={formData.duration}
                      aria-label="Davomiyligi"
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="2 soat 15 daq"
                      className="input-shell-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Poster rasm manzili (URL)
                  </label>
                  <div className="input-shell">
                    <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="url"
                      value={formData.poster}
                      aria-label="Poster manzili"
                      onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                      className="input-shell-field"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 space-y-2">Chiqqan yili<input aria-label="Chiqqan yili" type="number" min="1900" max="2100" required value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="input-modern w-full" /></label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 space-y-2">Rejissyor<input aria-label="Rejissyor" value={formData.director} onChange={e => setFormData({ ...formData, director: e.target.value })} className="input-modern w-full" /></label>
              </div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 space-y-2">YouTube treyler ID<input aria-label="YouTube treyler ID" placeholder="Masalan: TcMBFSGVi1c" pattern="[A-Za-z0-9_-]{11}" maxLength={11} value={formData.trailerId} onChange={e => setFormData({ ...formData, trailerId: e.target.value.trim() })} className="input-modern w-full" /></label>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Qisqacha mazmuni (Tavsif)
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  aria-label="Qisqacha mazmuni"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Film syujeti haqida qisqacha..."
                  className="textarea-modern"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn-secondary"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit" disabled={saving}
                  className="btn-primary bg-indigo-600 hover:bg-indigo-700"
                >
                  {saving ? 'Saqlanmoqda…' : editingMovie ? 'Saqlash' : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
