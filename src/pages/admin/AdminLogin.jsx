import { useState } from 'react';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/AdminContext.jsx';
import { siteConfig } from '../../data/siteConfig.js';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const ok = login(password);
      if (ok) {
        navigate('/admin', { replace: true });
      } else {
        setError('Password salah. Coba lagi.');
        setLoading(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 flex items-center justify-center p-6">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition"
        >
          <ArrowLeft size={16} />
          Kembali ke website
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl border border-white/10 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo-tp.png" alt="logo" className="h-10 w-auto" />
            <div>
              <div className="text-xs font-semibold text-accent uppercase tracking-widest">
                Admin Panel
              </div>
              <div className="text-lg font-bold text-brand-950">
                {siteConfig.brand.name}
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-brand-950">Masuk Admin</h1>
          <p className="mt-1.5 text-sm text-brand-600">
            Masukkan password admin untuk mengelola Catalog, Project, dan Tasks.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400"
                />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 disabled:opacity-60"
            >
              {loading ? 'Memverifikasi…' : 'Masuk'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-xs text-brand-500 bg-brand-50 border border-brand-100 rounded-xl px-3 py-2.5 leading-relaxed">
            <strong className="text-brand-700">Default password:</strong>{' '}
            <code className="font-mono">{siteConfig.adminPassword}</code>
            <div className="mt-1 text-brand-400">
              Ubah di <code className="font-mono">src/data/siteConfig.js</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
