import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Tv, Smartphone, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import ContactLinks from './ContactLinks';

export default function Footer() {
  return (
    <footer data-bee-section="footer" className="mt-24 bg-white/70 backdrop-blur-xl border-t border-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white shadow-sm">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">
                BEKA<span className="text-indigo-600">CINEMA</span>
              </span>
            </Link>

            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Har kayfiyatga bir hikoya. Filmlarni kashf eting, seriallarni tanlang va sevimlilaringizni bir joyda saqlang.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link to="/about" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-xs font-semibold text-indigo-600">BEKA tomonidan yaratilgan ↗</Link>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-700">
                <Tv className="w-3.5 h-3.5 text-indigo-600" />
                Filmlar va seriallar
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-700">
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                Har qanday ekranda
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Yangi kashfiyotlar
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Platforma bo'limlari
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-slate-600">
              <li>
                <Link to="/" className="hover:text-indigo-600 transition-colors">
                  Kino olami
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-600 transition-colors">
                  3D kutubxona · Biz haqimizda
                </Link>
              </li>
              <li>
                <Link to="/about#support" className="hover:text-indigo-600 transition-colors">
                  Qo‘llab-quvvatlash
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              BEKA bilan bog‘lanish
            </h4>
            <ContactLinks compact />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} BEKACINEMA. Har kayfiyatga bir hikoya.</p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Siz tanlagan hikoyalar
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Globe className="w-3.5 h-3.5" />
              O'zbekcha (UZ)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
