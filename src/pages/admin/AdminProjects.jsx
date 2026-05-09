import { useState, useRef } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  ImageIcon,
  Search,
  ExternalLink,
  Images,
  GripVertical,
  X,
  UploadCloud,
} from 'lucide-react';
import Modal from '../../components/Modal.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { seedProjects, getProjectImages } from '../../data/siteConfig.js';
import { PageHeader, EmptyState } from './AdminCatalog.jsx';
import {
  compressImageFile,
  approxBytes,
  formatBytes,
} from '../../hooks/imageUtils.js';

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
const COLOR_NAMES = Object.keys(TAG_COLOR);

const blank = {
  id: '',
  title: '',
  description: '',
  images: [],
  tag: '',
  color: 'sky',
  url: '',
};

export default function AdminProjects() {
  const [items, setItems, storageError] = useLocalStorage(
    'tp.projects.v1',
    seedProjects
  );
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'create', draft: blank });

  const filtered = items.filter((p) =>
    `${p.title} ${p.description} ${p.tag}`.toLowerCase().includes(query.toLowerCase())
  );

  const openCreate = () =>
    setModal({ open: true, mode: 'create', draft: { ...blank, id: `prj-${Date.now()}` } });
  const openEdit = (item) =>
    setModal({
      open: true,
      mode: 'edit',
      // Migrate legacy single-image projects on edit so they keep working
      draft: {
        ...blank,
        ...item,
        images:
          Array.isArray(item.images) && item.images.length
            ? item.images
            : item.image
            ? [item.image]
            : [],
      },
    });
  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    const d = modal.draft;
    if (!d.title.trim()) return;
    if (modal.mode === 'create') setItems((arr) => [d, ...arr]);
    else setItems((arr) => arr.map((it) => (it.id === d.id ? d : it)));
    close();
  };

  const remove = (id) => {
    if (!confirm('Hapus proyek ini?')) return;
    setItems((arr) => arr.filter((it) => it.id !== id));
  };

  const reset = () => {
    if (!confirm('Reset proyek ke daftar default?')) return;
    setItems(seedProjects);
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${items.length} proyek dipublikasikan di halaman publik.`}
        actions={
          <>
            <button onClick={reset} className="btn-ghost">
              <RotateCcw size={16} />
              Reset
            </button>
            <button onClick={openCreate} className="btn-primary !px-5 !py-2.5 text-sm">
              <Plus size={16} />
              Tambah Proyek
            </button>
          </>
        }
      />

      {storageError && (
        <div className="mt-5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          <strong className="font-semibold">Gagal menyimpan ke localStorage.</strong>{' '}
          Browser mencapai limit penyimpanan (~5 MB). Hapus beberapa foto, kompres
          lebih kecil, atau hapus project lama.{' '}
          <span className="text-rose-600 font-mono text-[11px]">
            ({String(storageError.name || 'Error')})
          </span>
        </div>
      )}

      <div className="mt-6 mb-5 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
        <input
          className="input pl-10"
          placeholder="Cari proyek…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const imgs = getProjectImages(p);
            const cover = imgs[0];
            return (
            <article key={p.id} className="card-base overflow-hidden flex flex-col">
              <div className="aspect-[16/10] bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300 relative overflow-hidden">
                {cover ? (
                  <img
                    src={cover}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-400">
                    <ImageIcon size={42} />
                  </div>
                )}
                {p.tag && (
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      TAG_COLOR[p.color] || TAG_COLOR.sky
                    }`}
                  >
                    {p.tag}
                  </span>
                )}
                {imgs.length > 1 && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-950/70 text-white backdrop-blur-sm">
                    <Images size={11} />
                    {imgs.length}
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-base font-bold text-brand-950 leading-snug">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-xs text-brand-600 leading-relaxed flex-1 line-clamp-3">
                  {p.description}
                </p>

                <div className="mt-3 pt-3 border-t border-brand-100 flex items-center justify-between gap-2">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-accent hover:text-accent-dark inline-flex items-center gap-1"
                    >
                      Live <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-[10px] text-brand-400">no URL</span>
                  )}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEdit(p)}
                      className="inline-flex items-center justify-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-brand-100 text-brand-700 hover:bg-brand-200 transition"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="inline-flex items-center justify-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={close}
        title={modal.mode === 'create' ? 'Tambah Proyek' : 'Edit Proyek'}
        footer={
          <>
            <button onClick={close} className="btn-ghost">Batal</button>
            <button onClick={save} className="btn-primary !px-5 !py-2 text-sm">
              {modal.mode === 'create' ? 'Tambahkan' : 'Simpan'}
            </button>
          </>
        }
      >
        <ProjectForm draft={modal.draft} setDraft={(d) => setModal((m) => ({ ...m, draft: d }))} />
      </Modal>
    </div>
  );
}

function ProjectForm({ draft, setDraft }) {
  const update = (k, v) => setDraft({ ...draft, [k]: v });
  const images = Array.isArray(draft.images) ? draft.images : [];
  const setImages = (next) => update('images', next);

  const fileInputRef = useRef(null);
  const [urlInput, setUrlInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [reorderFrom, setReorderFrom] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(''); // info/error message

  const totalBytes = images.reduce((sum, src) => sum + approxBytes(src), 0);

  const readFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length === 0) return;
    setBusy(true);
    setStatus(`Mengompres ${files.length} foto…`);

    try {
      const compressed = [];
      for (const file of files) {
        const out = await compressImageFile(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
        });
        compressed.push(out);
      }

      const next = [...images, ...compressed];

      // Soft warning if total payload looks risky for localStorage
      const projected = next.reduce((s, src) => s + approxBytes(src), 0);
      if (projected > 4 * 1024 * 1024) {
        setStatus(
          `${files.length} foto ditambahkan — total galeri ${formatBytes(
            projected
          )}. Mendekati limit localStorage (5 MB). Pertimbangkan kurangi jumlah foto.`
        );
      } else {
        setStatus(
          `${files.length} foto ditambahkan (total ${formatBytes(projected)}).`
        );
      }
      setImages(next);
    } catch (err) {
      console.error(err);
      setStatus('Gagal memproses foto. Coba foto lain atau ukuran lebih kecil.');
    } finally {
      setBusy(false);
    }
  };

  const onFilePicked = (e) => {
    readFiles(e.target.files);
    e.target.value = '';
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    await readFiles(e.dataTransfer.files);
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    setImages([...images, u]);
    setUrlInput('');
  };

  const removeAt = (idx) => setImages(images.filter((_, i) => i !== idx));

  // Reorder via drag-and-drop on thumbnails
  const onItemDragStart = (i) => setReorderFrom(i);
  const onItemDragOver = (e) => e.preventDefault();
  const onItemDrop = (i) => {
    if (reorderFrom === null || reorderFrom === i) return;
    const next = images.slice();
    const [moved] = next.splice(reorderFrom, 1);
    next.splice(i, 0, moved);
    setImages(next);
    setReorderFrom(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Judul Proyek</label>
        <input
          className="input"
          value={draft.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Misal: WebGIS Pemetaan Wilayah"
        />
      </div>
      <div>
        <label className="label">Deskripsi Singkat</label>
        <textarea
          className="input min-h-[88px] resize-none"
          value={draft.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Apa yang dikerjakan dan untuk siapa"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Tag</label>
          <input
            className="input"
            value={draft.tag}
            onChange={(e) => update('tag', e.target.value)}
            placeholder="Web App"
          />
        </div>
        <div>
          <label className="label">URL Live (opsional)</label>
          <input
            className="input"
            value={draft.url}
            onChange={(e) => update('url', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
      <div>
        <label className="label">Warna Tag</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_NAMES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update('color', c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                TAG_COLOR[c]
              } ${draft.color === c ? 'ring-2 ring-brand-950' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-image gallery */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label !mb-0">
            Gambar Galeri{' '}
            <span className="text-brand-400 font-normal">
              ({images.length} foto)
            </span>
          </label>
          <span className="text-[11px] text-brand-400">
            Foto pertama jadi cover
          </span>
        </div>

        {/* Drop zone */}
        <button
          type="button"
          onClick={() => !busy && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          disabled={busy}
          className={`w-full flex flex-col items-center justify-center gap-2 px-4 py-7 rounded-xl border-2 border-dashed transition ${
            busy
              ? 'border-brand-200 bg-brand-50/30 cursor-wait'
              : dragOver
              ? 'border-accent bg-accent/5'
              : 'border-brand-200 bg-brand-50/50 hover:border-brand-300'
          }`}
        >
          <UploadCloud
            size={24}
            className={busy ? 'text-brand-300 animate-pulse' : 'text-brand-400'}
          />
          <div className="text-sm font-medium text-brand-700">
            {busy ? 'Memproses foto…' : 'Klik untuk pilih atau drag & drop foto'}
          </div>
          <div className="text-[11px] text-brand-400">
            Foto otomatis dikompres ke 1600px JPG · bisa banyak sekaligus
          </div>
        </button>

        {status && (
          <div
            className={`mt-2 text-xs px-3 py-2 rounded-lg ${
              status.toLowerCase().includes('gagal') ||
              status.toLowerCase().includes('limit')
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {status}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFilePicked}
          className="hidden"
        />

        {/* URL adder */}
        <div className="mt-3 flex gap-2">
          <input
            type="url"
            className="input"
            placeholder="…atau tempel URL gambar"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addUrl();
              }
            }}
          />
          <button
            type="button"
            onClick={addUrl}
            disabled={!urlInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-brand-100 text-brand-700 text-sm font-medium hover:bg-brand-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Tambah
          </button>
        </div>

        {/* Thumbnail grid (drag-and-drop reorder) */}
        {images.length > 0 && (
          <>
            <div className="mt-3 flex items-center justify-between text-[11px] text-brand-500">
              <span>Drag thumbnail untuk reorder</span>
              <span>
                Total ≈ <strong className="text-brand-700">{formatBytes(totalBytes)}</strong>
              </span>
            </div>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {images.map((src, i) => (
              <div
                key={`${i}-${src.slice(0, 30)}`}
                draggable
                onDragStart={() => onItemDragStart(i)}
                onDragOver={onItemDragOver}
                onDrop={() => onItemDrop(i)}
                className="relative aspect-square rounded-xl overflow-hidden border border-brand-200 bg-brand-50 group cursor-move"
              >
                <img
                  src={src}
                  alt={`img ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[9px] font-bold uppercase tracking-wider bg-accent text-white px-1.5 py-0.5 rounded">
                    Cover
                  </span>
                )}
                <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="w-6 h-6 rounded-md bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition"
                    title="Hapus"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="absolute bottom-1 left-1 right-1 flex items-center gap-1 text-[10px] font-semibold text-white bg-brand-950/60 backdrop-blur-sm px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                  <GripVertical size={10} />
                  Drag untuk reorder
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
