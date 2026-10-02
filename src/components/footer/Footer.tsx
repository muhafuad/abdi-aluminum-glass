import React from 'react';
import { ArrowUpRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSite();
  const { language, t } = useLanguage();

  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandName = language === 'am' ? 'አብዲ አልሙኒየም እና መስታወት' : (settings.company_name || 'Abdi Aluminum & Glass');

  return (
    <footer className="bg-[#080a0c] border-t border-neutral-800/80 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-display tracking-tight">
              {brandName}
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              {t('brand.shortDesc')}
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleNav('/request-quote')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>{t('footer.proposal', 'Request Project Proposal')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-4">
              {t('footer.navigation', 'Navigation')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav.home', 'Home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/about')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav.about', 'About')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/products')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav.products', 'Products')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/services')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav.services', 'Services')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/projects')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav.projects', 'Projects')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/contact')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav.contact', 'Contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Architectural Capabilities */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-4">
              {t('footer.capabilities', 'Core Capabilities')}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-400">
              <li>{language === 'am' ? 'የአልሙኒየም ዎርክሾፕ ፋብሪኬሽን' : 'Precision Aluminum Workshop Fabrication'}</li>
              <li>{language === 'am' ? 'ቴምፐርድ እና ላሚኔትድ መስታወት' : 'Tempered & Laminated Safety Glazing'}</li>
              <li>{language === 'am' ? 'የከርተን ዎል (Curtain Wall) የሕንፃ ፊት' : 'Curtain Wall Stick & Window Wall Systems'}</li>
              <li>{language === 'am' ? 'የንግድ ድርጅት መግቢያ በሮች' : 'Heavy-Duty Commercial Pivot Doors'}</li>
              <li>{language === 'am' ? 'የቢሮ ድምፅ መከላከያ መስታወቶች' : 'Acoustic Office Glass Partitions'}</li>
              <li>{language === 'am' ? 'የአልሙኒየም ተንሸራታች መስኮቶችና በሮች' : 'Thermal Break Sliding Window Assemblies'}</li>
            </ul>
          </div>

          {/* Col 4: Configurable Business Coordinates */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-4">
              {t('footer.office', 'Business Office')}
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-neutral-300">
                  {settings.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-neutral-300 font-mono">
                  {settings.phone}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-neutral-300">
                  {settings.email}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-neutral-400 text-xs">
                  {settings.working_hours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} {brandName}. {t('footer.allRights', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('/contact')}
              className="hover:text-neutral-300 transition-colors"
            >
              {t('footer.inquiries', 'Inquiries')}
            </button>
            <button
              onClick={() => handleNav('/request-quote')}
              className="hover:text-neutral-300 transition-colors"
            >
              {t('footer.getQuote', 'Get a Quote')}
            </button>
            <button
              onClick={() => handleNav('/admin')}
              className="text-neutral-400 hover:text-amber-400 transition-colors"
            >
              {t('footer.admin', 'Admin Dashboard')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
