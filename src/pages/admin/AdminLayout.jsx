import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  FolderKanban,
  ListTodo,
  Handshake,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAdmin } from '../../hooks/AdminContext.jsx';
import { siteConfig } from '../../data/siteConfig.js';
import { asset } from '../../hooks/asset.js';

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/catalog', label: 'Catalog', icon: Boxes },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/partners', label: 'Mitra', icon: Handshake },
  { to: '/admin/tasks', label: 'Tasks', icon: ListTodo },
];

export default function AdminLayout() {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    if (!confirm('Logout dari admin panel?')) return;
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-50/50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-brand-100 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-6 h-20 flex items-center gap-3 border-b border-brand-100">
          <img src={asset('logo-tp.png')} alt="logo" className="h-9 w-auto" />
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Admin
            </div>
            <div className="text-sm font-bold text-brand-950 truncate">
              {siteConfig.brand.name}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/30'
                    : 'text-brand-700 hover:bg-brand-50'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-brand-100 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition"
          >
            <ExternalLink size={16} />
            Lihat Website
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-brand-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-brand-100 px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-lg text-brand-700 hover:bg-brand-50"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <img src={asset('logo-tp.png')} alt="logo" className="h-7 w-auto" />
            <span className="text-sm font-semibold text-brand-950">
              Admin Panel
            </span>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
