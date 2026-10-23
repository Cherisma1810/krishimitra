import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, LogOut, User as UserIcon, LayoutDashboard, Globe } from 'lucide-react';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-emerald-400" />
              <span className="font-bold text-xl tracking-tight text-white">
                {t.appName}
              </span>
            </Link>
            <span className="hidden md:inline-block text-xs bg-emerald-800 text-emerald-200 border border-emerald-700 px-2.5 py-0.5 rounded-full font-semibold">
              {t.tagline}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Toggle Button */}
            <div className="flex items-center bg-emerald-950/80 border border-emerald-700/80 rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => toggleLanguage('te')}
                className={`px-2.5 py-1 rounded transition ${
                  lang === 'te' 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => toggleLanguage('en')}
                className={`px-2.5 py-1 rounded transition ${
                  lang === 'en' 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-3 py-1.5 rounded-md text-sm font-semibold transition border border-emerald-700"
                >
                  <LayoutDashboard className="h-4 w-4 text-emerald-300" />
                  <span>{t.dashboard}</span>
                </Link>
                {user && (
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-emerald-100 bg-emerald-950 px-3 py-1 rounded-md border border-emerald-800">
                    <UserIcon className="h-4 w-4 text-emerald-400" />
                    <span>{user.full_name}</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-800/80 hover:bg-red-700 px-3 py-1.5 rounded-md text-sm transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t.logout}</span>
                </button>
              </>
            ) : (
              <div className="space-x-2 text-sm">
                <Link to="/login" className="hover:text-emerald-200 font-medium px-2 py-1">
                  {t.login}
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md font-semibold shadow transition"
                >
                  {t.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}