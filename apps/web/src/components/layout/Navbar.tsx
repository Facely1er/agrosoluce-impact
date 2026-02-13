import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home, UsersRound, Briefcase, User, Shield, Menu, X, Globe, Info, Handshake, Sun, Moon, Activity, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { useTheme } from '@/lib/theme/ThemeProvider';
import type { Language } from '@/lib/i18n/translations';

export default function Navbar() {
  const location = useLocation();
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isActivePath = (path: string) => location.pathname.startsWith(path);

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  const navLinks: Array<{
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    exact: boolean;
    secondary?: boolean;
  }> = [
    // PRIMARY NAVIGATION (Always visible)
    { to: '/', icon: Home, label: t.nav.home, exact: true },
    { to: '/directory', icon: UsersRound, label: t.nav.cooperatives, exact: false },
    { to: '/health-impact', icon: Activity, label: t.nav.healthImpact, exact: false },
    { to: '/vrac', icon: TrendingUp, label: t.nav.healthIntelligence, exact: false },
    { to: '/analytics', icon: BarChart3, label: t.nav.analytics, exact: false },
    { to: '/about', icon: Info, label: t.nav.about, exact: false },
    
    // SECONDARY NAVIGATION (Dropdown menu)
    { to: '/buyer', icon: Briefcase, label: t.nav.buyers, exact: false, secondary: true },
    { to: '/partners', icon: Handshake, label: t.nav.partners, exact: false, secondary: true },
    { to: '/monitoring', icon: Shield, label: t.nav.complianceTools, exact: false, secondary: true },
    { to: '/pilot', icon: Target, label: t.nav.pilotPrograms, exact: false, secondary: true },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
          >
            <img 
              src="/agrosoluce.png" 
              alt="AgroSoluce Logo" 
              className="h-14 w-auto transition-transform group-hover:scale-105"
            />
            <div>
              <h2 className="text-primary-600 dark:text-primary-400 font-bold text-lg leading-tight">AgroSoluce™</h2>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight">{t.footer.sourceIntelligence}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{t.footer.byErmits}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.filter(link => !link.secondary).map(({ to, icon: Icon, label, exact }) => {
              const active = exact ? isActive(to) : isActivePath(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
            
            {/* Secondary menu dropdown */}
            <div className="relative group ml-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                <UsersRound className="h-4 w-4" />
                <span>{t.nav.more}</span>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {navLinks.filter(link => link.secondary).map(({ to, icon: Icon, label, exact }) => {
                  const active = exact ? isActive(to) : isActivePath(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Theme Toggle */}
            <div className="relative ml-2">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {/* Language Switcher */}
            <div className="relative ml-2">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                aria-label="Change language"
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase font-semibold">{language}</span>
              </button>
              
              {langMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                    <button
                      onClick={() => toggleLanguage('en')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        language === 'en' ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/30' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => toggleLanguage('fr')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        language === 'fr' ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/30' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      🇫🇷 Français
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            {/* Primary Links */}
            <div className="px-2 py-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">{t.nav.main}</div>
              {navLinks.filter(link => !link.secondary).map(({ to, icon: Icon, label, exact }) => {
                const active = exact ? isActive(to) : isActivePath(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Secondary Links */}
            <div className="px-2 py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">{t.nav.more}</div>
              {navLinks.filter(link => link.secondary).map(({ to, icon: Icon, label, exact }) => {
                const active = exact ? isActive(to) : isActivePath(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile Theme Toggle */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span>{t.nav.theme}</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'light' ? 'Dark' : 'Light'}
                </button>
              </div>
            </div>
            
            {/* Mobile Language Switcher */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="h-4 w-4" />
                <span>{t.nav.language}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-primary-600 dark:bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => toggleLanguage('fr')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    language === 'fr'
                      ? 'bg-primary-600 dark:bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  🇫🇷 FR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

