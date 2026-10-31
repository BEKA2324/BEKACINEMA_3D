import React from 'react';
import { Instagram, Send, Phone, Github, ArrowUpRight } from 'lucide-react';

const contacts = [
  { label: 'Instagram', value: '@beka_winnn', href: 'https://www.instagram.com/beka_winnn/', Icon: Instagram },
  { label: 'Telegram', value: '@BEKA_XX1', href: 'https://t.me/BEKA_XX1', Icon: Send },
  { label: 'Telefon', value: '+998 97 628 99 11', href: 'tel:+998976289911', Icon: Phone },
  { label: 'GitHub', value: 'BEKA2324', href: 'https://github.com/BEKA2324', Icon: Github },
];

export default function ContactLinks({ compact = false }) {
  return <div className={`grid gap-3 ${compact ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
    {contacts.map(({ label, value, href, Icon }) => <a
      key={label} href={href} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}
      className="contact-glass flex items-center gap-3 rounded-2xl p-4 min-w-0 group"
    >
      <span className="grid place-items-center w-9 h-9 shrink-0 rounded-xl bg-indigo-100/60 text-indigo-600"><Icon size={17} /></span>
      <span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span><span className="block text-xs font-semibold text-slate-800 break-words mt-1">{value}</span></span>
      <ArrowUpRight size={14} className="shrink-0 text-indigo-400 group-hover:text-indigo-600" />
    </a>)}
  </div>;
}
