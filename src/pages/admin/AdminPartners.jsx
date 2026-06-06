import { useRef, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  UploadCloud,
  ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from './AdminCatalog.jsx';
import Modal from '../../components/Modal.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { seedPartnerLogos } from '../../data/siteConfig.js';
import {
  compressImageFile,
  approxBytes,
  formatBytes,
} from '../../hooks/imageUtils.js';

const blank = {
  id: '',
  name: '',
  logo: '',
  url: '',
};

export default function AdminPartners() {
  const [items, setItems, storageError] = useLocalStorage(
    'tp.partners.v1',
    seedPartnerLogos
  );
  const [modal, setModal] = useState({ open: false, mode: 'create', draft: blank });

  const openCreate = () =>
    setModal({
      open: true,
      mode: 'create',
      draft: { ...blank, id: `partner-${Date.now()}` },
    });
  const openEdit = (item) =>
    setModal({
      open: true,
      mode: 'edit',
      draft: { ...blank, ...item },
    });

  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    const draft = modal.draft;
    if (!draft.logo) return;
    const normalizedDraft = {
      ...draft,
      name: draft.name.trim(),
      url: normalizeUrl(draft.url),
    };
    if (modal.mode === 'create') setItems((arr) => [normalizedDraft, ...arr]);
    else {
      setItems((arr) =>
        arr.map((item) => (item.id === normalizedDraft.id ? normalizedDraft : item))
      );
    }
    close();
  };

  const remove = (id) => {
    if (!confirm('Hapus logo mitra ini?')) return;
    setItems((arr) => arr.filter((it) => it.id !== id));
  };

  const reset = () => {
    if (!confirm('Reset daftar mitra ke kondisi awal?')) return;
    setItems(seedPartnerLogos);
  };

  return (
    <div>
      <PageHeader
        title="Mitra"
        subtitle={`${items.length} logo mitra tampil di atas section project.`}
        actions={
          <>
            <button onClick={reset} className="btn-ghost">
              <RotateCcw size={16} />
              Reset
            </button>
            <button onClick={openCreate} className="btn-primary !px-5 !py-2.5 text-sm">
              <Plus size={16} />
              Tambah Logo
            </button>
          </>
        }
      />

      {storageError && (
        <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <strong className="font-semibold">Gagal menyimpan logo.</strong> Storage
          browser hampir penuh. Coba gunakan file lebih kecil atau hapus beberapa logo.
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-brand-200 bg-white px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-500">
            <ImageIcon size={22} />
          </div>
          <h3 className="mt-4 text-base font-bold text-brand-950">
            Belum ada logo mitra
          </h3>
          <p className="mt-1 text-sm text-brand-600">
            Upload logo dari admin agar marquee mitra tampil di atas section project.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="card-base p-5">
              <div className="flex h-28 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 px-4">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.name || 'Logo mitra'}
                    className="max-h-14 w-auto max-w-full object-contain"
                  />
                ) : (
                  <ImageIcon size={36} className="text-brand-300" />
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-brand-950">
                    {item.name || 'Tanpa nama'}
                  </div>
                  <div className="mt-0.5 text-xs text-brand-500">Logo mitra</div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-dark"
                    >
                      Link aktif <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEdit(item)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-brand-100 px-2.5 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-200"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={close}
        title={modal.mode === 'create' ? 'Tambah Logo Mitra' : 'Edit Logo Mitra'}
        footer={
          <>
            <button onClick={close} className="btn-ghost">
              Batal
            </button>
            <button onClick={save} className="btn-primary !px-5 !py-2 text-sm">
              {modal.mode === 'create' ? 'Tambahkan' : 'Simpan'}
            </button>
          </>
        }
      >
        <PartnerForm
          draft={modal.draft}
          setDraft={(draft) => setModal((m) => ({ ...m, draft }))}
        />
      </Modal>
    </div>
  );
}

function normalizeUrl(value) {
  const url = value.trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function PartnerForm({ draft, setDraft }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const update = (key, value) => setDraft({ ...draft, [key]: value });

  const onFilePicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;

    setBusy(true);
    setStatus('Memproses logo…');
    try {
      const out = await compressImageFile(file, {
        maxWidth: 900,
        maxHeight: 360,
        quality: 0.9,
        mimeType: 'image/jpeg',
      });
      update('logo', out);
      setStatus(`Logo siap digunakan (${formatBytes(approxBytes(out))}).`);
    } catch (err) {
      console.error(err);
      setStatus('Gagal memproses logo. Coba file lain.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="label">Nama Mitra</label>
        <input
          className="input"
          placeholder="Contoh: PT Contoh Digital"
          value={draft.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>

      <div>
        <label className="label">Link Logo (Opsional)</label>
        <input
          className="input"
          placeholder="Contoh: https://namamitra.com"
          value={draft.url}
          onChange={(e) => update('url', e.target.value)}
        />
        <p className="mt-1.5 text-xs text-brand-500">
          Kosongkan jika logo tidak perlu bisa diklik.
        </p>
      </div>

      <div>
        <label className="label">Upload Logo</label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFilePicked}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-200 bg-brand-50 px-4 py-8 text-sm font-medium text-brand-700 transition hover:border-accent hover:bg-white disabled:opacity-60"
        >
          <UploadCloud size={18} />
          {busy ? 'Memproses…' : 'Pilih file logo'}
        </button>
        <p className="mt-2 text-xs text-brand-500">
          Gunakan logo dengan background transparan jika ada, agar hasil marquee lebih rapi.
        </p>
      </div>

      {draft.logo && (
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
          <div className="flex h-28 items-center justify-center">
            <img
              src={draft.logo}
              alt={draft.name || 'Preview logo'}
              className="max-h-16 w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}

      {status && (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-xs text-brand-600">
          {status}
        </div>
      )}
    </div>
  );
}
