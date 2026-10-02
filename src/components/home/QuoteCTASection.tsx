import React from 'react';
import { ArrowUpRight, Phone, MessageSquare } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useLanguage } from '../../context/LanguageContext';

interface QuoteCTASectionProps {
  onNavigate: (path: string) => void;
}

export const QuoteCTASection: React.FC<QuoteCTASectionProps> = ({ onNavigate }) => {
  const { settings } = useSite();
  const { t } = useLanguage();

  return (
    <section className="py-20 sm:py-24 bg-[#11151a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 sm:p-12 lg:p-16 bg-[#161b22] border border-neutral-800 rounded-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
              {t('cta.label', 'Direct Fabrication & Installation')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-display tracking-tight mt-2 text-balance">
              {t('cta.title', 'Have an Architectural Drawing or Project Specification?')}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              {t('cta.desc', 'Send us your architectural elevations, window schedules, or site measurements. Our estimators will prepare a comprehensive quotation with profile specifications, glass performance data, and lead times.')}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/request-quote')}
                className="px-6 py-3.5 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-2 shadow-md whitespace-nowrap"
              >
                <span>{t('cta.submit', 'Submit Quote Request')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-6 py-3.5 text-sm font-semibold text-neutral-200 hover:text-white bg-neutral-900 border border-neutral-700/80 rounded transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>{t('cta.contact', 'Contact Office')}</span>
              </button>
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-800/80 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{t('cta.directLine', 'Direct Inquiries')}: {settings.phone}</span>
              </div>
              <span className="text-neutral-600 hidden sm:inline">|</span>
              <span>{t('cta.responseTime', 'Response within 24 business hours')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
