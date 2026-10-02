import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Globe } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useLanguage } from '../../context/LanguageContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { settings } = useSite();
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('nav.home', 'Home'), path: '/' },
    { label: t('nav.about', 'About'), path: '/about' },
    { label: t('nav.products', 'Products'), path: '/products' },
    { label: t('nav.services', 'Services'), path: '/services' },
    { label: t('nav.projects', 'Projects'), path: '/projects' },
    { label: t('nav.contact', 'Contact'), path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#0c0f12]/95 backdrop-blur-md border-neutral-800 shadow-lg shadow-black/20'
          : 'bg-[#0c0f12] border-neutral-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('/');
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-white font-display whitespace-nowrap hover:text-amber-400 transition-colors"
        >
          {language === 'am' ? 'አብዲ አልሙኒየም እና መስታወት' : (settings.company_name || 'Abdi Aluminum & Glass')}
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions + Language Toggle */}
        <div className="flex items-center gap-3">
          {/* Language Switcher Button */}
          <div className="flex items-center bg-[#161b22] border border-neutral-800 rounded p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded transition-colors ${
                language === 'en'
                  ? 'bg-neutral-800 text-amber-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <span className="text-neutral-700">|</span>
            <button
              onClick={() => setLanguage('am')}
              className={`px-2 py-1 rounded transition-colors ${
                language === 'am'
                  ? 'bg-neutral-800 text-amber-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="አማርኛ"
            >
              አማ
            </button>
          </div>

          <button
            onClick={() => handleNavClick('/request-quote')}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap shadow-sm"
          >
            <span>{t('nav.requestQuote', 'Request a Quote')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0f12] border-b border-neutral-800 px-5 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`text-left py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-amber-400 font-semibold' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="pt-3 border-t border-neutral-800/80 flex flex-col gap-2.5">
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  Language / ቋንቋ
                </span>
                <div className="flex items-center bg-[#161b22] border border-neutral-800 rounded p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      language === 'en'
                        ? 'bg-neutral-800 text-amber-400'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('am')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      language === 'am'
                        ? 'bg-neutral-800 text-amber-400'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    አማርኛ
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleNavClick('/request-quote')}
                className="w-full text-center py-2.5 px-4 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
              >
                {t('nav.requestQuote', 'Request a Quote')}
              </button>
              <button
                onClick={() => handleNavClick('/admin')}
                className="w-full text-center py-2 px-4 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                {t('nav.adminPortal', 'Admin Portal')}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
