import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, User, Camera, Trash2 } from 'lucide-react';
import Avatar from './Avatar';

export default function ProfileModal({ isOpen, onClose, user, onSave }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [reading, setReading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setError('');
      setPhoneNumber(user.phoneNumber || '');
      setEmail(user.email || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('JPG, PNG yoki WebP rasm tanlang.'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Rasm hajmi 5 MB dan oshmasin.'); return;
    }
    setReading(true);
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 256;
      const size = Math.min(bitmap.width, bitmap.height);
      canvas.getContext('2d').drawImage(bitmap, (bitmap.width - size) / 2, (bitmap.height - size) / 2, size, size, 0, 0, 256, 256);
      bitmap.close();
      setAvatar(canvas.toDataURL('image/webp', 0.85));
    } catch { setError('Rasmni ochib bo‘lmadi. Boshqa rasm tanlang.'); }
    finally { setReading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending || reading) return;
    if (!name.trim()) { setError('Ismingizni kiriting.'); return; }
    setError(''); setPending(true);
    try { await onSave({ phoneNumber, email, name: name.trim(), avatar }); onClose(); } catch (error) { setError(error.message); } finally { setPending(false); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog" aria-modal="true" aria-label="Profil ma'lumotlari"
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-apple-lg p-6 sm:p-7 animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-display text-lg font-bold text-slate-900">
            Profil ma'lumotlari
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
          <fieldset disabled={pending || reading} className="flex items-center gap-4">
            <Avatar src={avatar} className="w-20 h-20 shrink-0 ring-4 ring-indigo-50" />
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 cursor-pointer">
                <Camera className="w-4 h-4" /> {reading ? 'Yuklanmoqda...' : 'Rasm tanlash'}
                <input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Profil rasmini tanlash" onChange={handleImage} className="sr-only" />
              </label>
              {avatar && <button type="button" onClick={() => setAvatar('')} className="flex items-center gap-2 text-xs text-rose-600"><Trash2 className="w-3.5 h-3.5" /> Rasmni olib tashlash</button>}
              <p className="text-xs text-slate-400">JPG, PNG, WebP · 5 MB gacha</p>
            </div>
          </fieldset>
          <div>
            <label htmlFor="profile-name" className="block text-xs font-semibold text-slate-700 mb-2">Ismingiz</label>
            <div className="input-shell">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <input id="profile-name" name="name" required maxLength={80} value={name} onChange={e => setName(e.target.value)} className="input-shell-field" placeholder="Ismingizni kiriting" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Telefon raqamingiz
            </label>
            <div className="input-shell">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-shell-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Email manzilingiz
            </label>
            <div className="input-shell">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-shell-field"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Bekor qilish
            </button>
            <button
              type="submit" disabled={pending || reading}
              className="btn-primary bg-indigo-600 hover:bg-indigo-700"
            >
              {pending ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
