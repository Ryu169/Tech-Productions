import { useState } from 'react';
import { ImageIcon, ExternalLink, Layers, Images } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { seedProjects, getProjectImages } from '../data/siteConfig.js';
import Lightbox from './Lightbox.jsx';

const TAG_COLOR = {
  emerald: 'bg-emerald-100 text-emerald-700',
  violet: 'bg-violet-100 text-violet-700',
  sky: 'bg-sky-100 text-sky-700',
  rose: 'bg-rose-100 text-rose-700',
  amber: 'bg-amber-100 text-amber-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  slate: 'bg-slate-100 text-slate-700',
};

export default function Projects() {
  const [items] = useLocalStorage('tp.projects.v1', seedProjects);
  const [box, setBox] = useState({ open: false, images: [], title: '', start: 0 });

  const openLightbox = (project, startIdx = 0) => {
    const imgs = getProjectImages(project);
    if (imgs.length === 0) return;
    setBox({ open: true, images: imgs, title: project.title, start: startIdx });
  };

  return (
    <section id="projects" className="section-padding">
      <div className="container-app">
        <div className="mb-12">
          <span className="inline-block text-accent font-semibold uppercase tracking-widest text-xs">
            Project
          </span>
          <h2 className="section-title mt-2">Karya & Studi Kasus</h2>
          <p className="section-subtitle">
            Pilihan proyek yang telah kami kerjakan — dari aplikasi web,
            WebGIS, sistem AI, hingga media visual. Klik gambar untuk melihat
            galeri lengkap.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-brand-500">
            Belum ada proyek terdaftar.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => {
              const imgs = getProjectImages(p);
              const cover = imgs[0];
              const hasGallery = imgs.length > 1;
              return (
                <article key={p.id} className="card-base overflow-hidden flex flex-col group">
                  <button
                    type="button"
                    onClick={() => openLightbox(p, 0)}
                    disabled={imgs.length === 0}
                    className="aspect-[16/10] bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300 relative overflow-hidden block w-full text-left disabled:cursor-default"
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-400">
                        <ImageIcon size={48} />
                      </div>
                    )}

                    {p.tag && (
                      <span
                        className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          TAG_COLOR[p.color] || TAG_COLOR.sky
                        }`}
                      >
                        {p.tag}
                      </span>
                    )}

                    {/* Gallery count badge */}
                    {hasGallery && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-950/70 text-white backdrop-blur-sm">
                        <Images size={12} />
                        {imgs.length}
                      </span>
                    )}

                    {/* Hover overlay hint */}
                    {imgs.length > 0 && (
                      <div className="absolute inset-0 bg-brand-950/0 group-hover:bg-brand-950/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="px-3 py-1.5 rounded-full bg-white/95 text-brand-950 text-xs font-semibold shadow-lg">
                          {hasGallery ? `Lihat Galeri (${imgs.length})` : 'Perbesar'}
                        </span>
                      </div>
                    )}
                  </button>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-brand-950 leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-brand-600 leading-relaxed flex-1">
                      {p.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-brand-100 flex items-center justify-between">
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark transition"
                        >
                          Lihat <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-brand-500">
                          <Layers size={14} /> Studi Kasus
                        </span>
                      )}

                      {hasGallery && (
                        <button
                          onClick={() => openLightbox(p, 0)}
                          className="text-xs font-semibold text-brand-600 hover:text-accent transition inline-flex items-center gap-1"
                        >
                          <Images size={13} />
                          {imgs.length} foto
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Lightbox
        open={box.open}
        onClose={() => setBox((b) => ({ ...b, open: false }))}
        images={box.images}
        title={box.title}
        startIndex={box.start}
      />
    </section>
  );
}
