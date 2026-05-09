import {
  GraduationCap,
  Cpu,
  Globe,
  Network,
  Mail,
  Receipt,
  Smartphone,
  Cog,
  Database,
  Layers,
  PenTool,
  ShieldCheck,
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { seedCatalog } from '../data/siteConfig.js';

const ICON_MAP = {
  GraduationCap,
  Cpu,
  Globe,
  Network,
  Mail,
  Receipt,
  Smartphone,
  Cog,
  Database,
  Layers,
  PenTool,
  ShieldCheck,
};

const COLOR_MAP = {
  sky: 'from-sky-500 to-sky-600',
  violet: 'from-violet-500 to-violet-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  rose: 'from-rose-500 to-rose-600',
  indigo: 'from-indigo-500 to-indigo-600',
  cyan: 'from-cyan-500 to-cyan-600',
  slate: 'from-slate-500 to-slate-600',
};

export default function Catalog() {
  const [items] = useLocalStorage('tp.catalog.v1', seedCatalog);

  return (
    <section id="catalog" className="section-padding bg-brand-50/40">
      <div className="container-app">
        <div className="mb-12">
          <span className="inline-block text-accent font-semibold uppercase tracking-widest text-xs">
            Catalog
          </span>
          <h2 className="section-title mt-2">Layanan yang Kami Tawarkan</h2>
          <p className="section-subtitle">
            Solusi digital end-to-end untuk membantu bisnis dan komunitas Anda
            bertumbuh. Hubungi kami untuk konsultasi gratis.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-brand-500">
            Belum ada layanan terdaftar.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((item) => {
              const Icon = ICON_MAP[item.icon] || Globe;
              const gradient = COLOR_MAP[item.color] || COLOR_MAP.sky;
              return (
                <article
                  key={item.id}
                  className="card-base p-6 group flex flex-col relative"
                >
                  {item.badge && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${gradient} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-brand-950 leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-600 leading-relaxed flex-1">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
