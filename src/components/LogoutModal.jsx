import Avatar from './Avatar';
import React, { useEffect } from 'react';
import { LogOut, X, Phone, Mail } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm, user }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-apple-lg p-6 sm:p-7 animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          aria-label="Yopish"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
            <LogOut className="w-6 h-6" />
          </div>

          <h3 className="font-display text-xl font-bold text-slate-900">
            Profildan chiqish
          </h3>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Haqiqatan ham shaxsiy hisobingizdan chiqmoqchimisiz?
          </p>
        </div>

        {user && (
          <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <Avatar src={user.avatar} className="w-11 h-11 rounded-full object-cover shrink-0" />
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold text-slate-900 truncate flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                {user.phoneNumber}
              </p>
              <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Ha, chiqish
          </button>
        </div>
      </div>
    </div>
  );
}
