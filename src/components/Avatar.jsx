import React from 'react';
import { User } from 'lucide-react';

export default function Avatar({ src, className = '' }) {
  return src ? (
    <img src={src} alt="Profil rasmi" className={`rounded-full object-cover ${className}`} />
  ) : (
    <span aria-label="Profil rasmi yo‘q" className={`inline-flex items-center justify-center rounded-full bg-indigo-50 text-indigo-500 ${className}`}>
      <User className="w-1/2 h-1/2" />
    </span>
  );
}
