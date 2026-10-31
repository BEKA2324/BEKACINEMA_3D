import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Phone, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e) => {
    if (pending) return;
    e.preventDefault();
    setError('');

    if (phoneNumber.trim().length < 7) {
      setError("Iltimos, telefon raqamingizni to'g'ri kiriting.");
      return;
    }
    if (!email.includes('@')) {
      setError("Iltimos, to'g'ri email manzil kiriting.");
      return;
    }
    if (password.length < 4) {
      setError('Parol kamida 4 ta belgidan iborat bo‘lishi kerak.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Parol va tasdiqlash paroli bir-biriga mos kelmadi!');
      return;
    }

    setPending(true);
    try {
      await register({ phoneNumber, email, password });
      navigate('/', { replace: true });
    } catch (error) { setError(error.message); } finally { setPending(false); }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <div className="max-w-5xl w-full mx-auto flex flex-wrap gap-3 items-center justify-between">
        <ThemeToggle />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Asosiy sahifaga qaytish</span>
        </Link>

        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
            BEKA<span className="text-indigo-600 dark:text-indigo-400">CINEMA</span>
          </span>
        </Link>
      </div>

      {/* Centered Clean Register Card */}
      <main className="my-auto py-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-700/90 shadow-apple-lg p-7 sm:p-9">
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <Play className="w-5 h-5 fill-indigo-600 ml-0.5" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
              Ro'yxatdan o'tish
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Yangi hisob yaratish uchun ma'lumotlarni to'ldiring
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* 1. phoneNumber */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Telefon raqamingiz
              </label>
              <div className="input-shell">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="tel"
                  name="phoneNumber"
                  autoComplete="off"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="input-shell-field"
                />
              </div>
            </div>

            {/* 2. email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Email manzilingiz
              </label>
              <div className="input-shell">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="input-shell-field"
                />
              </div>
            </div>

            {/* 3. password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Parolingiz
              </label>
              <div className="input-shell">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-shell-field"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0"
                  aria-label="Parolni ko'rsatish"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 4. confirmPassword */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Parolni tasdiqlash
              </label>
              <div className="input-shell">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-shell-field"
                />
              </div>
            </div>

            <button
              type="submit" disabled={pending}
              className="w-full h-12 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all active:scale-[0.99] mt-2"
            >
              Ro'yxatdan o'tish
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Allaqachon hisobingiz bormi?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                Kirish
              </Link>
            </p>
          </div>
        </div>
      </main>

      <div className="text-center text-xs text-slate-400">
        © {new Date().getFullYear()} BEKACINEMA Platformasi
      </div>
    </div>
  );
}
