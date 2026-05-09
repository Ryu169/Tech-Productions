import { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Calendar,
  Wifi,
  MapPin,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import Modal from '../../components/Modal.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { seedTasks } from '../../data/siteConfig.js';
import { PageHeader, EmptyState } from './AdminCatalog.jsx';

const STATUS_META = {
  todo: { label: 'To Do', icon: Circle, cls: 'bg-brand-100 text-brand-700' },
  in_progress: { label: 'In Progress', icon: Clock, cls: 'bg-sky-100 text-sky-700' },
  completed: { label: 'Completed', icon: CheckCircle2, cls: 'bg-emerald-100 text-emerald-700' },
};
const STATUS_KEYS = Object.keys(STATUS_META);

const LOCATION_META = {
  online: { label: 'Online', icon: Wifi, cls: 'bg-violet-100 text-violet-700' },
  onsite: { label: 'On-site', icon: MapPin, cls: 'bg-amber-100 text-amber-700' },
};

const blank = {
  id: '',
  projectName: '',
  deadline: '',
  clientNote: '',
  location: 'online',
  status: 'todo',
  createdAt: '',
};

export default function AdminTasks() {
  const [items, setItems] = useLocalStorage('tp.tasks.v1', seedTasks);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState({ open: false, mode: 'create', draft: blank });

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: items.length,
      todo: items.filter((t) => t.status === 'todo').length,
      inProgress: items.filter((t) => t.status === 'in_progress').length,
      done: items.filter((t) => t.status === 'completed').length,
      overdue: items.filter(
        (t) => t.status !== 'completed' && t.deadline && new Date(t.deadline) < today
      ).length,
    };
  }, [items]);

  const filtered = items
    .filter((t) => {
      if (filter !== 'all' && t.status !== filter) return false;
      const q = query.toLowerCase();
      return (
        !q ||
        t.projectName.toLowerCase().includes(q) ||
        (t.clientNote || '').toLowerCase().includes(q)
      );
    })
    .slice()
    .sort((a, b) => {
      // Sort: not completed first, then by deadline asc
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (b.status === 'completed' && a.status !== 'completed') return -1;
      return (a.deadline || '').localeCompare(b.deadline || '');
    });

  const openCreate = () =>
    setModal({
      open: true,
      mode: 'create',
      draft: { ...blank, id: `tsk-${Date.now()}`, createdAt: new Date().toISOString() },
    });
  const openEdit = (item) =>
    setModal({ open: true, mode: 'edit', draft: { ...blank, ...item } });
  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    const d = modal.draft;
    if (!d.projectName.trim()) return;
    if (modal.mode === 'create') setItems((arr) => [d, ...arr]);
    else setItems((arr) => arr.map((it) => (it.id === d.id ? d : it)));
    close();
  };

  const updateStatus = (id, status) => {
    setItems((arr) => arr.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const remove = (id) => {
    if (!confirm('Hapus task ini?')) return;
    setItems((arr) => arr.filter((it) => it.id !== id));
  };

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Pekerjaan proyek yang sedang Anda tangani — kelola deadline, catatan klien, dan lokasi pengerjaan."
        actions={
          <button onClick={openCreate} className="btn-primary !px-5 !py-2.5 text-sm">
            <Plus size={16} />
            Tambah Task
          </button>
        }
      />

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total" value={stats.total} tone="brand" />
        <StatCard label="To Do" value={stats.todo} tone="slate" />
        <StatCard label="In Progress" value={stats.inProgress} tone="sky" />
        <StatCard label="Completed" value={stats.done} tone="emerald" />
        <StatCard label="Overdue" value={stats.overdue} tone="rose" icon={AlertTriangle} />
      </div>

      {/* Filters */}
      <div className="mt-6 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
          <input
            className="input pl-10"
            placeholder="Cari project atau catatan klien…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-white border border-brand-100 rounded-xl p-1">
          {[['all', 'Semua'], ['todo', 'To Do'], ['in_progress', 'Berjalan'], ['completed', 'Selesai']].map(([k, lbl]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === k ? 'bg-accent text-white shadow' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="bg-white rounded-2xl border border-brand-100 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 text-brand-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Project</th>
                  <th className="text-left px-3 py-3 font-semibold">Deadline</th>
                  <th className="text-left px-3 py-3 font-semibold">Lokasi</th>
                  <th className="text-left px-3 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {filtered.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    onEdit={() => openEdit(t)}
                    onDelete={() => remove(t.id)}
                    onStatusChange={(s) => updateStatus(t.id, s)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-brand-100">
            {filtered.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onEdit={() => openEdit(t)}
                onDelete={() => remove(t.id)}
                onStatusChange={(s) => updateStatus(t.id, s)}
              />
            ))}
          </div>
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={close}
        title={modal.mode === 'create' ? 'Tambah Task' : 'Edit Task'}
        footer={
          <>
            <button onClick={close} className="btn-ghost">Batal</button>
            <button onClick={save} className="btn-primary !px-5 !py-2 text-sm">
              {modal.mode === 'create' ? 'Tambahkan' : 'Simpan'}
            </button>
          </>
        }
      >
        <TaskForm draft={modal.draft} setDraft={(d) => setModal((m) => ({ ...m, draft: d }))} />
      </Modal>
    </div>
  );
}

function StatCard({ label, value, tone = 'brand', icon: Icon }) {
  const toneCls = {
    brand: 'bg-brand-50 text-brand-700 border-brand-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
  }[tone];
  return (
    <div className={`rounded-xl border ${toneCls} px-4 py-3.5`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium opacity-80">{label}</span>
        {Icon && <Icon size={14} />}
      </div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function TaskRow({ task, onEdit, onDelete, onStatusChange }) {
  const status = STATUS_META[task.status] || STATUS_META.todo;
  const loc = LOCATION_META[task.location] || LOCATION_META.online;
  const StatusIcon = status.icon;
  const LocIcon = loc.icon;
  const overdue = isOverdue(task);

  return (
    <tr className="hover:bg-brand-50/50 transition">
      <td className="px-5 py-4 align-top">
        <div className="font-semibold text-brand-950">{task.projectName}</div>
        {task.clientNote && (
          <div className="mt-1 text-xs text-brand-600 leading-relaxed line-clamp-2 max-w-md">
            <span className="font-medium text-brand-500">Catatan: </span>
            {task.clientNote}
          </div>
        )}
      </td>
      <td className="px-3 py-4 align-top whitespace-nowrap">
        {task.deadline ? (
          <div className="inline-flex items-center gap-1.5 text-xs">
            <Calendar size={13} className={overdue ? 'text-rose-500' : 'text-brand-400'} />
            <span className={overdue ? 'text-rose-600 font-semibold' : 'text-brand-700'}>
              {formatDate(task.deadline)}
            </span>
          </div>
        ) : (
          <span className="text-xs text-brand-400">—</span>
        )}
      </td>
      <td className="px-3 py-4 align-top">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${loc.cls}`}
        >
          <LocIcon size={12} />
          {loc.label}
        </span>
      </td>
      <td className="px-3 py-4 align-top">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`text-[11px] font-semibold px-2 py-1 rounded-full ${status.cls} cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30`}
        >
          {STATUS_KEYS.map((k) => (
            <option key={k} value={k}>
              {STATUS_META[k].label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-5 py-4 align-top text-right">
        <div className="inline-flex gap-1.5">
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-brand-100 text-brand-700 hover:bg-brand-200 transition"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const status = STATUS_META[task.status] || STATUS_META.todo;
  const loc = LOCATION_META[task.location] || LOCATION_META.online;
  const LocIcon = loc.icon;
  const overdue = isOverdue(task);

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-brand-950">{task.projectName}</div>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`text-[10px] font-semibold px-2 py-1 rounded-full ${status.cls} cursor-pointer flex-shrink-0`}
        >
          {STATUS_KEYS.map((k) => (
            <option key={k} value={k}>{STATUS_META[k].label}</option>
          ))}
        </select>
      </div>
      {task.clientNote && (
        <div className="mt-2 text-xs text-brand-600 leading-relaxed">
          <span className="font-medium text-brand-500">Catatan: </span>
          {task.clientNote}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
        {task.deadline && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
              overdue ? 'bg-rose-100 text-rose-700' : 'bg-brand-100 text-brand-700'
            }`}
          >
            <Calendar size={11} />
            {formatDate(task.deadline)}
          </span>
        )}
        <span
          className={`inline-flex items-center gap-1 font-semibold px-2 py-1 rounded-full ${loc.cls}`}
        >
          <LocIcon size={11} />
          {loc.label}
        </span>
      </div>
      <div className="mt-3 flex justify-end gap-1.5">
        <button
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-brand-100 text-brand-700 hover:bg-brand-200 transition"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

function TaskForm({ draft, setDraft }) {
  const update = (k, v) => setDraft({ ...draft, [k]: v });
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Nama Project</label>
        <input
          className="input"
          value={draft.projectName}
          onChange={(e) => update('projectName', e.target.value)}
          placeholder="Misal: Website CV Andalan Jaya"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Deadline</label>
          <input
            type="date"
            className="input"
            value={draft.deadline || ''}
            onChange={(e) => update('deadline', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={draft.status}
            onChange={(e) => update('status', e.target.value)}
          >
            {STATUS_KEYS.map((k) => (
              <option key={k} value={k}>{STATUS_META[k].label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Tempat Pengerjaan</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(LOCATION_META).map(([key, m]) => {
            const Icon = m.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => update('location', key)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
                  draft.location === key
                    ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                    : 'bg-white text-brand-700 border-brand-200 hover:border-brand-300'
                }`}
              >
                <Icon size={16} />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="label">Catatan dari Klien</label>
        <textarea
          className="input min-h-[110px] resize-none"
          value={draft.clientNote}
          onChange={(e) => update('clientNote', e.target.value)}
          placeholder="Misal: Klien minta revisi warna jadi lebih earthy. Jadwal meeting Senin."
        />
      </div>
    </div>
  );
}

function isOverdue(task) {
  if (!task.deadline || task.status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.deadline) < today;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
