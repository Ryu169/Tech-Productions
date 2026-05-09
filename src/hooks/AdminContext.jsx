import { createContext, useContext } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { siteConfig } from '../data/siteConfig.js';

const AdminContext = createContext({
  isAuthed: false,
  login: () => false,
  logout: () => {},
});

// Simple deterministic "token" derived from the password — not real security,
// just a marker that someone has typed the right password in this browser.
function expectedToken() {
  const p = siteConfig.adminPassword || '';
  let h = 0;
  for (let i = 0; i < p.length; i++) {
    h = ((h << 5) - h + p.charCodeAt(i)) | 0;
  }
  return `tp.${Math.abs(h).toString(36)}.${p.length}`;
}

export function AdminProvider({ children }) {
  const [token, setToken] = useLocalStorage('tp.admin.token', '');

  const isAuthed = token === expectedToken();

  const login = (password) => {
    if (password === siteConfig.adminPassword) {
      setToken(expectedToken());
      return true;
    }
    return false;
  };

  const logout = () => setToken('');

  return (
    <AdminContext.Provider value={{ isAuthed, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
