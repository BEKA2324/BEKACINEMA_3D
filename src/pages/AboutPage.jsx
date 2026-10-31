import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Bookmark, Film, Sparkles } from 'lucide-react';
import ModelLibrary from '../components/ModelLibrary';
import Footer from '../components/Footer';
import ContactLinks from '../components/ContactLinks';
import ThemeToggle from '../components/ThemeToggle';

export default function AboutPage() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [hash]);

  return <div className="cinema-page min-h-screen">
    <header className="cinema-header border-b border-white/80 dark:border-slate-700/80">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-wrap items-center justify-between gap-4" aria-label="Sahifa navigatsiyasi">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">BEKA<span className="text-indigo-600 dark:text-indigo-400">CINEMA</span></Link>
        <div className="flex items-center gap-4"><ThemeToggle /><Link to="/" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600"><ArrowLeft size={16} /> Kino olamiga qaytish</Link></div>
      </nav>
    </header>
    <main className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20 space-y-12">
      <section data-bee-section="banner" className="space-y-8">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400"><Sparkles size={15} /> BEKA · Interaktiv olam</p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-tight">3D animatsiyalar<br /><span className="text-indigo-600 dark:text-indigo-400">kutubxonasi.</span></h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">Tasavvurga jon bering. Kolibri, feniks, ari va kapalakni yaqindan ko‘ring, aylantiring va har bir detalini kashf eting. BEKACINEMA ichidagi kichik ijodiy olam — BEKA tomonidan.</p>
          <a href="#models" className="btn-primary bg-indigo-600">Modellarni ko‘rish <ArrowUpRight size={16} /></a>
        </div>
      </section>
      <ModelLibrary />
      <section data-bee-section="catalog" className="grid sm:grid-cols-3 gap-4" aria-label="Loyiha haqida">
        {[
          [Film, 'Yangi hikoyalar', 'Turli janrdagi filmlar va seriallarni bir joydan toping.'],
          [Bookmark, 'O‘z tanlovingiz', 'Yoqtirgan filmlaringizni shaxsiy ro‘yxatingizga qo‘shing.'],
          [Sparkles, 'BEKA ijodi', 'Kino, dizayn va interaktiv tajribaga bo‘lgan qiziqishdan tug‘ilgan loyiha.'],
        ].map(([Icon, title, text]) => <article key={title} className="glass-panel rounded-3xl p-6 space-y-3"><Icon className="text-indigo-500 dark:text-indigo-400" size={24} /><h2 className="font-display text-lg font-semibold">{title}</h2><p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{text}</p></article>)}
      </section>
      <section id="support" className="glass-panel rounded-[32px] p-6 sm:p-10 scroll-mt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Qo‘llab-quvvatlash</p>
        <h2 className="font-display text-2xl sm:text-3xl font-bold mt-3">Yordam kerakmi?</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 mb-6">Savol, taklif yoki hamkorlik uchun BEKA bilan bog‘laning.</p>
        <ContactLinks />
        <div className="mt-6 space-y-3">
          {[
            ['Hisobimga qanday kiraman?', 'Kirish sahifasida ro‘yxatdan o‘tgan telefon raqamingiz va parolingizni kiriting. Yangi bo‘lsangiz, avval hisob yarating.'],
            ['Filmni qanday saqlayman?', 'Film kartasidagi saqlash belgisini bosing. Uni “Saqlanganlar” bo‘limidan topasiz.'],
            ['Profilimni qanday o‘zgartiraman?', 'Profil menyusidan “Profil ma’lumotlari”ni oching. Ism, rasm va aloqa ma’lumotlarini yangilab, “Saqlash”ni bosing.'],
          ].map(([question, answer]) => <details key={question} className="rounded-2xl bg-white/55 dark:bg-slate-800/55 border border-white/80 dark:border-slate-700/80 p-4"><summary className="cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-200">{question}</summary><p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-3">{answer}</p></details>)}
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
