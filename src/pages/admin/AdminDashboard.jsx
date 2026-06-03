import { Link } from 'react-router-dom';
import {
  Boxes,
  FolderKanban,
  ListTodo,
  Handshake,
  ArrowRight,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import {
  seedCatalog,
  seedPartnerLogos,
  seedProjects,
  seedTasks,
  siteConfig,
} from '../../data/siteConfig.js';

export default function AdminDashboard() {
  const [catalog] = useLocalStorage('tp.catalog.v1', seedCatalog);
  const [projects] = useLocalStorage('tp.projects.v1', seedProjects);
  const [partners] = useLocalStorage('tp.partners.v1', seedPartnerLogos);
  const [tasks] = useLocalStorage('tp.tasks.v1', seedTasks);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = tasks.filter(
    (t) => t.status !== 'completed' && t.deadline && new Date(t.deadline) < today
  );
  const upcoming = tasks
    .filter((t) => t.status !== 'completed' && t.deadline)
    .slice()
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5);

  const cards = [
    {
      label: 'Layanan',
      count: catalog.length,
      icon: Boxes,
      to: '/admin/catalog',
      color: 'from-violet-500 to-violet-600',
    },
    {
      label: 'Proyek',
      count: projects.length,
      icon: FolderKanban,
      to: '/admin/projects',
      color: 'from-sky-500 to-sky-600',
    },
    {
      label: 'Mitra',
      count: partners.length,
      icon: Handshake,
      to: '/admin/partners',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Tasks Aktif',
      count: tasks.filter((t) => t.status !== 'completed').length,
      icon: ListTodo,
      to: '/admin/tasks',
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: 'Selesai',
      count: tasks.filter((t) => t.status === 'completed').length,
      icon: CheckCircle2,
      to: '/admin/tasks',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-brand-950">
          Selamat datang kembali 👋
        </h1>
        <p className="mt-1 text-sm text-brand-600">
          Ringkasan aktivitas di {siteConfig.brand.name}.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="card-base p-5 group"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${c.color} shadow-md`}
            >
              <c.icon size={20} />
            </div>
            <div className="mt-4 text-xs font-medium text-brand-500 uppercase tracking-wider">
              {c.label}
            </div>
            <div className="mt-0.5 text-3xl font-extrabold text-brand-950">
              {c.count}
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-2 transition-all">
              Kelola <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Two-column lower area */}
      <div className="mt-8 grid lg:grid-cols-2 gap-5">
        {/* Overdue alert */}
        <div className="card-base p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-500" />
            <h2 className="text-base font-bold text-brand-950">
              Task Terlewat ({overdue.length})
            </h2>
          </div>
          <p className="mt-1 text-xs text-brand-500">
            Task yang sudah melewati deadline dan belum selesai.
          </p>
          {overdue.length === 0 ? (
            <div className="mt-5 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              ✨ Tidak ada task yang terlewat. Mantap!
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {overdue.slice(0, 5).map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 bg-rose-50 border border-rose-100 rounded-xl"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-brand-950 truncate">
                      {t.projectName}
                    </div>
                    <div className="text-[11px] text-rose-600 font-medium">
                      Deadline: {formatDate(t.deadline)}
                    </div>
                  </div>
                  <Link
                    to="/admin/tasks"
                    className="text-xs font-semibold text-accent hover:text-accent-dark whitespace-nowrap"
                  >
                    Lihat →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming tasks */}
        <div className="card-base p-6">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-brand-500" />
            <h2 className="text-base font-bold text-brand-950">
              Deadline Terdekat
            </h2>
          </div>
          <p className="mt-1 text-xs text-brand-500">
            5 task dengan deadline paling dekat.
          </p>
          {upcoming.length === 0 ? (
            <div className="mt-5 text-sm text-brand-500 bg-brand-50 rounded-xl px-4 py-3">
              Tidak ada task aktif. Tambah task baru di halaman Tasks.
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {upcoming.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 bg-brand-50/70 border border-brand-100 rounded-xl"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-brand-950 truncate">
                      {t.projectName}
                    </div>
                    <div className="text-[11px] text-brand-600">
                      {t.location === 'onsite' ? 'On-site' : 'Online'} ·{' '}
                      {formatDate(t.deadline)}
                    </div>
                  </div>
                  <Link
                    to="/admin/tasks"
                    className="text-xs font-semibold text-accent hover:text-accent-dark whitespace-nowrap"
                  >
                    Lihat →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
