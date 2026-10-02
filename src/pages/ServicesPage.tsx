import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { services, isLoading } = useSite();
  const { t } = useLanguage();

  return (
    <div className="bg-[#0c0f12] min-h-screen text-neutral-100">
      <PageHeader
        label={t('services.label', 'Fabrication & Installation Services')}
        title={t('services.title', 'Comprehensive Architectural Aluminum & Glazing Solutions')}
        description={t('services.desc', 'From in-house precision workshop cutting and pneumatic crimping to complex curtain wall envelopes and high-acoustic glass partitions.')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {isLoading ? (
          <div className="py-20 text-center text-neutral-500">
            {t('common.loading', 'Loading architectural services...')}
          </div>
        ) : (
          <div className="space-y-12">
            {services.map((service, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={service.id}
                  className="bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden p-6 sm:p-8 lg:p-10 hover:border-neutral-700 transition-colors"
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}>
                    {/* Visual Media Column */}
                    <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="aspect-[16/10] bg-neutral-900 overflow-hidden rounded-sm border border-neutral-800">
                        <img
                          src={service.image_url}
                          alt={service.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono font-semibold text-amber-400">
                          SERVICE 0{index + 1}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-white tracking-tight">
                        {service.name}
                      </h2>
                      <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Deliverables / Scope */}
                      {service.deliverables && service.deliverables.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-neutral-800/80">
                          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-3">
                            {t('services.deliverables', 'Key Deliverables & Capabilities')}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {service.deliverables.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-8 flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => onNavigate(`/services/${service.slug}`)}
                          className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <span>{t('services.explore', 'Detailed Scope & Methodology')}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onNavigate(`/request-quote?service=${encodeURIComponent(service.name)}`)}
                          className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
                        >
                          {t('services.requestProposal', 'Request Service Proposal')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
