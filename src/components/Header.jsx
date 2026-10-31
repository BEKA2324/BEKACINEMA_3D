import Avatar from './Avatar';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Play,
  ChevronDown,
  LogOut,
  User,
  Bookmark,
  Plus,
  Phone,
  Mail,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';
import ProfileModal from './ProfileModal';

export default function Header({
  onOpenCreateModal,
  activeTab = 'all',
  setActiveTab,
  watchlistCount = 0,
}) {
  const { user, updateProfile, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleConfirmLogout = async () => {
    setLogoutModalOpen(false);
    setDropdownOpen(false);
    try { await logout(); navigate('/login', { replace: true }); } catch {}
  };

  const navItems = [
    { id: 'all', label: 'Asosiy sahifa' },
    { id: 'movie', label: 'Filmlar' },
    { id: 'series', label: 'Seriallar' },
    { id: 'watchlist', label: 'Saqlanganlar', badge: watchlistCount },
  ];

  return (
    <>
      <header className="cinema-header sticky top-0 z-40 border-b border-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 h-20 flex items-center justify-between gap-3">
          {/* 1. Left: Clean Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
            <span className="font-display font-bold text-base sm:text-xl tracking-tight text-slate-900">
              BEKA<span className="text-indigo-600">CINEMA</span>
            </span>
          </Link>

          {/* 2. Center: Spacious Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === '/' && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (location.pathname !== '/') navigate('/');
                    setActiveTab?.(item.id);
                  }}
                  className={`relative py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-600">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Right: Login / Register Buttons + Profile Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Always-visible Login & Register buttons in Header */}
            {!user && <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
              >
                <LogIn className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Kirish</span>
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span>Ro'yxatdan o'tish</span>
              </Link>
            </div>}

            {onOpenCreateModal && (
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/60 transition-colors"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Kino qo'shish</span>
              </button>
            )}

            {/* Profile Dropdown Trigger */}
            {user && (
              <div className="relative pl-1 border-l border-slate-200" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-xs"
                  aria-expanded={dropdownOpen}
                >
                  <Avatar src={user.avatar} className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100" />
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800">
                    {user.name || 'Profil'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180 text-slate-700' : ''
                    }`}
                  />
                </button>

                {/* Clean Profile Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border border-slate-200 shadow-apple-lg p-2 z-50 animate-modal">
                    {/* User Info Header */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} className="w-11 h-11 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          {user.name && <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>}
                          <p className="text-xs font-semibold text-slate-900 truncate flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{user.phoneNumber}</span>
                          </p>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{user.email}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Links */}
                    <div className="py-1.5 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl text-left text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Profil ma'lumotlari</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          if (location.pathname !== '/') navigate('/');
                          setActiveTab?.('watchlist');
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl text-left text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <Bookmark className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Saqlangan filmlar</span>
                        </span>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {watchlistCount}
                        </span>
                      </button>

                    </div>

                    {/* Logout Modal Trigger */}
                    <div className="pt-1.5 mt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          setLogoutModalOpen(true);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-medium text-sm flex items-center gap-3 transition-all"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>Profildan chiqish</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        user={user}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onSave={updateProfile}
      />
    </>
  );
}
