import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { api } from '../api';
const Context = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const notify = (message, type = 'success') => {
    clearTimeout(timer.current); setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), 4500);
  };
  const clearSession = () => {
    localStorage.removeItem('cineva_token'); localStorage.removeItem('cineva_auth_user'); setUser(null);
  };
  useEffect(() => {
    let active = true;
    const unauthorized = () => { clearSession(); notify('Sessiya tugadi. Qayta kiring.', 'error'); };
    window.addEventListener('cineva:unauthorized', unauthorized);
    if (localStorage.getItem('cineva_token')) {
      api('/auth/me').then(value => { if (active) setUser(value); })
        .catch(() => { if (active) clearSession(); })
        .finally(() => { if (active) setLoading(false); });
    } else setLoading(false);
    return () => { active = false; window.removeEventListener('cineva:unauthorized', unauthorized); clearTimeout(timer.current); };
  }, []);
  const authenticate = async (route, body) => {
    const result = await api(`/auth/${route}`, { method: 'POST', body });
    localStorage.setItem('cineva_token', result.access_token); setUser(result.user);
    notify(route === 'register' ? 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz!' : 'Hisobingizga xush kelibsiz!');
    return result.user;
  };
  const logout = async () => {
    try { await api('/auth/logout', { method: 'POST' }); }
    catch (error) { notify(error.message, 'error'); throw error; }
    clearSession(); notify('Hisobingizdan chiqdingiz.');
  };
  const updateProfile = async body => {
    const result = await api('/auth/me', { method: 'PATCH', body });
    setUser(result); notify('Profil ma’lumotlari saqlandi.');
  };
  return <Context.Provider value={{ user, loading, login: (body, admin = false) => authenticate(admin ? 'admin/login' : 'login', body), register: body => authenticate('register', body), logout, updateProfile, notify }}>
    {children}
    {toast && <div role={toast.type === 'error' ? 'alert' : 'status'} className={`liquid-toast ${toast.type === 'error' ? 'liquid-toast-error' : ''}`}>
      <CheckCircle2 size={23} className="shrink-0" /><span className="flex-1 text-sm font-semibold">{toast.message}</span>
      <button type="button" onClick={() => setToast(null)} aria-label="Xabarni yopish"><X size={18} /></button>
    </div>}
  </Context.Provider>;
}
export function useAuth() { return useContext(Context); }
