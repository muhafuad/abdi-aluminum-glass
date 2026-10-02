import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useLanguage } from '../../context/LanguageContext';

interface ServicesPreviewProps {
  onNavigate: (path: string) => void;
}

export const ServicesPreview: React.FC<ServicesPreviewProps> = ({ onNavigate }) => {
  const { services } = useSite();
  const { t } = useLanguage();
  const displayServices = services.slice(0, 6);

  return (
    <section className="py-20 sm:py-24 bg-[#0c0f12] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
              {t('services.label', 'Architectural Expertise')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-display tracking-tight mt-2 text-balance">
              {t('services.title', 'Engineered Aluminum & Glass Services')}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-400 leading-relaxed">
              {t('services.desc', 'From in-house precision fabrication to specialized site glazing, our certified architectural teams deliver turnkey solutions for complex building specifications.')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('/services')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap self-start md:self-end"
          >
            <span>{t('services.viewAll', 'View All Services')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service, index) => (
            <div
              key={service.id}
              onClick={() => onNavigate(`/services/${service.slug}`)}
              className="group cursor-pointer bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden hover:border-neutral-700 transition-all duration-200 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                <img
                  src={service.image_url}
                  alt={service.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 backdrop-blur-sm border border-neutral-800 text-[11px] font-mono text-amber-400 tabular-nums">
                  0{index + 1}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors mb-2">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2">
                    {service.short_description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-neutral-400 group-hover:text-amber-400 transition-colors">
                  <span>{t('services.explore', 'Explore Service Specs')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
