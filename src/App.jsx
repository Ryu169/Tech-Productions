import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './hooks/AdminContext.jsx';

import PublicSite from './pages/PublicSite.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminCatalog from './pages/admin/AdminCatalog.jsx';
import AdminProjects from './pages/admin/AdminProjects.jsx';
import AdminTasks from './pages/admin/AdminTasks.jsx';

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

export default function App() {
  return (
    <BrowserRouter>
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
            <Route path="tasks" element={<AdminTasks />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}
