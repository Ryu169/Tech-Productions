import { useState } from 'react';
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
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Search,
} from 'lucide-react';
import Modal from '../../components/Modal.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { seedCatalog } from '../../data/siteConfig.js';

const ICON_MAP = {
  GraduationCap, Cpu, Globe, Network, Mail, Receipt, Smartphone, Cog,
  Database, Layers, PenTool, ShieldCheck,
};
const ICON_NAMES = Object.keys(ICON_MAP);

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
const COLOR_NAMES = Object.keys(COLOR_MAP);

const blank = {
  id: '',
  title: '',
  description: '',
  icon: 'Globe',
  color: 'sky',
  badge: '',
};

export default function AdminCatalog() {
  const [items, setItems] = useLocalStorage('tp.catalog.v1', seedCatalog);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'create', draft: blank });

  const filtered = items.filter((it) =>
    it.title.toLowerCase().includes(query.toLowerCase()) ||
    it.description.toLowerCase().includes(query.toLowerCase())
  );

  const openCreate = () =>
    setModal({ open: true, mode: 'create', draft: { ...blank, id: `svc-${Date.now()}` } });
  const openEdit = (item) =>
    setModal({ open: true, mode: 'edit', draft: { ...blank, ...item } });
  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    const d = modal.draft;
    if (!d.title.trim()) return;
    if (modal.mode === 'create') setItems((arr) => [...arr, d]);
    else setItems((arr) => arr.map((it) => (it.id === d.id ? d : it)));
    close();
  };

  const remove = (id) => {
    if (!confirm('Hapus layanan ini?')) return;
    setItems((arr) => arr.filter((it) => it.id !== id));
  };

  const reset = () => {
    if (!confirm('Reset catalog ke daftar default?')) return;
    setItems(seedCatalog);
  };

  return (
    <div>
      <PageHeader
        title="Catalog"
        subtitle={`${items.length} layanan terdaftar — kelola apa yang ditampilkan di halaman publik.`}
        actions={
          <>
            <button onClick={reset} className="btn-ghost">
              <RotateCcw size={16} />
              Reset
            </button>
            <button onClick={openCreate} className="btn-primary !px-5 !py-2.5 text-sm">
              <Plus size={16} />
              Tambah Layanan
            </button>
          </>
        }
      />

      <div className="mt-6 mb-5 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
        <input
          className="input pl-10"
          placeholder="Cari layanan…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const Icon = ICON_MAP[item.icon] || Globe;
            const gradient = COLOR_MAP[item.color] || COLOR_MAP.sky;
            return (
              <article key={item.id} className="card-base p-5 flex flex-col">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${gradient}`}
                  >
                    <Icon size={20} />
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-950 leading-snug">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-brand-600 leading-relaxed flex-1 line-clamp-3">
                  {item.description}
                </p>
                <div className="mt-4 pt-4 border-t border-brand-100 flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-brand-100 text-brand-700 hover:bg-brand-200 transition"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={close}
        title={modal.mode === 'create' ? 'Tambah Layanan' : 'Edit Layanan'}
        footer={
          <>
            <button onClick={close} className="btn-ghost">Batal</button>
            <button onClick={save} className="btn-primary !px-5 !py-2 text-sm">
              {modal.mode === 'create' ? 'Tambahkan' : 'Simpan'}
            </button>
          </>
        }
      >
        <CatalogForm draft={modal.draft} setDraft={(d) => setModal((m) => ({ ...m, draft: d }))} />
      </Modal>
    </div>
  );
}

function CatalogForm({ draft, setDraft }) {
  const update = (k, v) => setDraft({ ...draft, [k]: v });
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Judul Layanan</label>
        <input
          className="input"
          value={draft.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Misal: Buat Website"
        />
      </div>
      <div>
        <label className="label">Deskripsi</label>
        <textarea
          className="input min-h-[96px] resize-none"
          value={draft.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Deskripsi singkat tentang layanan ini"
        />
      </div>
      <div>
        <label className="label">Ikon</label>
        <div className="grid grid-cols-6 gap-2">
          {ICON_NAMES.map((name) => {
            const Icon = ICON_MAP[name];
            return (
              <button
                key={name}
                type="button"
                onClick={() => update('icon', name)}
                className={`aspect-square rounded-xl flex items-center justify-center transition ${
                  draft.icon === name
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                }`}
                title={name}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="label">Warna</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_NAMES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update('color', c)}
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${COLOR_MAP[c]} ring-offset-2 transition ${
                draft.color === c ? 'ring-2 ring-brand-950' : ''
              }`}
              title={c}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="label">Badge (opsional)</label>
        <input
          className="input"
          value={draft.badge || ''}
          onChange={(e) => update('badge', e.target.value)}
          placeholder="Misal: Coming Soon"
        />
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-brand-950">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-brand-600">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{actions}</div>
    </div>
  );
}

export function EmptyState({ query }) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-brand-100">
      <div className="text-brand-400">
        {query ? `Tidak ada hasil untuk "${query}"` : 'Belum ada data'}
      </div>
    </div>
  );
}
