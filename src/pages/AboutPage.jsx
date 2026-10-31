import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Bookmark, Film, Sparkles } from 'lucide-react';
import CinemaBee from '../components/CinemaBee';
import Footer from '../components/Footer';
import ContactLinks from '../components/ContactLinks';

export default function AboutPage() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [hash]);

  return <div className="cinema-page min-h-screen">
    <header className="cinema-header border-b border-white/80">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-wrap items-center justify-between gap-4" aria-label="Sahifa navigatsiyasi">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">BEKA<span className="text-indigo-600">CINEMA</span></Link>
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"><ArrowLeft size={16} /> Kino olamiga qaytish</Link>
      </nav>
    </header>
    <main className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20 space-y-12">
      <section data-bee-section="banner" className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-indigo-600"><Sparkles size={15} /> Biz haqimizda</p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-tight">Kino birlashtiradi.<br /><span className="text-indigo-600">Hikoyalar ilhom beradi.</span></h1>
          <p className="text-slate-500 leading-relaxed max-w-lg">BEKACINEMA — BEKA tomonidan yaratilgan kino va seriallar olami. Bu yerda yangi hikoyalarni kashf etasiz va sevimli filmlaringizni keyinroq topish uchun saqlab qo‘yasiz.</p>
          <Link to="/" className="btn-primary bg-indigo-600">Katalogni ochish <ArrowUpRight size={16} /></Link>
        </div>
        <div className="about-bee-panel glass-panel rounded-[32px] relative overflow-hidden">
          <div className="absolute left-6 top-6 text-xs font-semibold text-indigo-500">BEKACINEMA · 3D HAMROH</div>
          <CinemaBee embedded />
          <p className="relative text-center text-xs text-slate-500 px-6 pb-6">Sichqonchani harakatlantiring — hamrohimiz sizga qaraydi.</p>
        </div>
      </section>
      <section data-bee-section="catalog" className="grid sm:grid-cols-3 gap-4" aria-label="Loyiha haqida">
        {[
          [Film, 'Yangi hikoyalar', 'Turli janrdagi filmlar va seriallarni bir joydan toping.'],
          [Bookmark, 'O‘z tanlovingiz', 'Yoqtirgan filmlaringizni shaxsiy ro‘yxatingizga qo‘shing.'],
          [Sparkles, 'BEKA ijodi', 'Kino, dizayn va interaktiv tajribaga bo‘lgan qiziqishdan tug‘ilgan loyiha.'],
        ].map(([Icon, title, text]) => <article key={title} className="glass-panel rounded-3xl p-6 space-y-3"><Icon className="text-indigo-500" size={24} /><h2 className="font-display text-lg font-semibold">{title}</h2><p className="text-sm text-slate-500 leading-relaxed">{text}</p></article>)}
      </section>
      <section id="support" className="glass-panel rounded-[32px] p-6 sm:p-10 scroll-mt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Qo‘llab-quvvatlash</p>
        <h2 className="font-display text-2xl sm:text-3xl font-bold mt-3">Yordam kerakmi?</h2>
        <p className="text-sm text-slate-500 mt-3 mb-6">Savol, taklif yoki hamkorlik uchun BEKA bilan bog‘laning.</p>
        <ContactLinks />
        <div className="mt-6 space-y-3">
          {[
            ['Hisobimga qanday kiraman?', 'Kirish sahifasida ro‘yxatdan o‘tgan telefon raqamingiz va parolingizni kiriting. Yangi bo‘lsangiz, avval hisob yarating.'],
            ['Filmni qanday saqlayman?', 'Film kartasidagi saqlash belgisini bosing. Uni “Saqlanganlar” bo‘limidan topasiz.'],
            ['Profilimni qanday o‘zgartiraman?', 'Profil menyusidan “Profil ma’lumotlari”ni oching. Ism, rasm va aloqa ma’lumotlarini yangilab, “Saqlash”ni bosing.'],
          ].map(([question, answer]) => <details key={question} className="rounded-2xl bg-white/55 border border-white/80 p-4"><summary className="cursor-pointer text-sm font-semibold text-slate-700">{question}</summary><p className="text-sm text-slate-500 leading-relaxed mt-3">{answer}</p></details>)}
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
