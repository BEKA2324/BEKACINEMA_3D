import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Pause, Play, X, Move3d, MousePointer2 } from 'lucide-react';
import ModelViewer from './ModelViewer';

const models = [
  { id: 'hummingbird', name: 'Kolibri', file: 'hummingbird__rigged_6_animations_open_bill.glb', tag: 'Tabiat · Qushlar', description: 'Havoda muallaq turadigan nafis qush. Tez qanot qoqishi va rangli patlarini yaqindan ko‘ring.', color: 'model-preview-hummingbird' },
  { id: 'phoenix', name: 'Feniks', file: 'phoenix_bird.glb', tag: 'Afsona · Fantastika', description: 'Afsonaviy qushning yorqin patlari va keng qanotlari bilan sehrli parvozini tomosha qiling.', color: 'model-preview-phoenix' },
  { id: 'bee', name: 'Demon ari', file: 'demon_bee_full_texture.glb', tag: 'Tabiat · Fantastika', description: 'Kuchli qanotlar, mayda detallar va jonli parvoz animatsiyasi.', color: 'model-preview-bee' },
  { id: 'butterfly', name: 'Fantastik kapalak', file: 'fantasy_butterfly_animation.glb', tag: 'Tabiat · Sehrli olam', description: 'Yorqin qanotlar va yengil harakatlar. Bosh sahifamizdagi uchuvchi kapalak.', color: 'model-preview-butterfly' },
];

export default function ModelLibrary() {
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const dialog = useRef(null);
  useEffect(() => {
    if (!selected) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = overflow; };
  }, [selected]);

  return <section id="models" className="space-y-6 scroll-mt-6" aria-label="3D animatsiyalar kutubxonasi">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-display text-2xl font-bold">Modellarni kashf eting</h2>
      <span className="contact-glass rounded-full px-4 py-2 text-xs font-semibold text-indigo-600">{models.length} ta jonli model</span>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      {models.map(model => <article key={model.id} className="glass-panel rounded-[28px] overflow-hidden">
        <div className={`relative ${model.color}`}>
          <span className="absolute top-5 left-5 z-10 text-[10px] font-bold tracking-widest uppercase text-indigo-500 pointer-events-none">Animatsiyali · GLB</span>
          <ModelViewer file={model.file} name={model.name} playing={!selected && playing} />
        </div>
        <div className="p-6 space-y-3 border-t border-white/70">
          <p className="text-xs text-indigo-500 font-medium">{model.tag}</p>
          <h3 className="font-display text-xl font-bold">{model.name}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{model.description}</p>
          <button type="button" onClick={() => setSelected(model)} className="btn-primary bg-indigo-600 w-full sm:w-auto"><Maximize2 size={16} /> {model.name} — ko‘rish</button>
        </div>
      </article>)}
    </div>
    {selected && <dialog ref={dialog} className="model-dialog" aria-labelledby="model-dialog-title" onCancel={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
      <div className="glass-panel rounded-[28px] overflow-hidden">
        <div className="flex items-center justify-between gap-4 p-5 border-b border-white/80">
          <div><p className="text-[10px] uppercase tracking-widest text-indigo-500">3D ko‘rish oynasi</p><h2 id="model-dialog-title" className="font-display text-lg font-bold">{selected.name}</h2></div>
          <button autoFocus className="btn-secondary !p-2" aria-label="Model oynasini yopish" onClick={() => setSelected(null)}><X size={20} /></button>
        </div>
        <div className={selected.color}><ModelViewer file={selected.file} name={selected.name} interactive playing={playing} /></div>
        <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/80">
          <p className="flex items-center gap-2 text-xs text-slate-500"><MousePointer2 size={15} /> Surib aylantiring · g‘ildirak yoki ikki barmoq bilan yaqinlashtiring</p>
          <button className="btn-secondary" onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? 'Animatsiyani to‘xtatish' : 'Animatsiyani yoqish'}</button>
        </div>
      </div>
    </dialog>}
    <p className="flex items-center gap-2 text-xs text-slate-500"><Move3d size={15} /> Modelni oching va uni har tomondan tomosha qiling.</p>
  </section>;
}
