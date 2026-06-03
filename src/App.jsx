import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './hooks/AdminContext.jsx';

import PublicSite from './pages/PublicSite.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminCatalog from './pages/admin/AdminCatalog.jsx';
import AdminProjects from './pages/admin/AdminProjects.jsx';
import AdminTasks from './pages/admin/AdminTasks.jsx';
import AdminPartners from './pages/admin/AdminPartners.jsx';

function RequireAuth({ children }) {
  const { isAuthed } = useAdmin();
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return children;
}

function RedirectIfAuthed({ children }) {
  const { isAuthed } = useAdmin();
  if (isAuthed) return <Navigate to="/admin" replace />;
  return children;
}

// Router basename matches Vite's base — empty string in dev (BASE_URL = "/"),
// "/Tech-Productions" on GitHub Pages. Trailing slash must be stripped because
// react-router-dom v6 forbids a basename ending in "/".
const ROUTER_BASENAME = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export default function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <AdminProvider>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<PublicSite />} />

          {/* Admin login */}
          <Route
            path="/admin/login"
            element={
              <RedirectIfAuthed>
                <AdminLogin />
              </RedirectIfAuthed>
            }
          />

          {/* Admin protected routes */}
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="catalog" element={<AdminCatalog />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="tasks" element={<AdminTasks />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}
