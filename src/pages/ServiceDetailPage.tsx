import React from 'react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, Clock, Hammer } from 'lucide-react';

interface ServiceDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, onNavigate }) => {
  const { services } = useSite();
  const { t } = useLanguage();
  const service = services.find((s) => s.slug === slug || s.id === slug);

  if (!service) {
    return (
      <div className="bg-[#0c0f12] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold font-display text-white mb-2">{t('common.notFound', 'Service Not Found')}</h1>
        <p className="text-sm text-neutral-400 mb-6">{t('common.noResults', 'The architectural service you requested is currently unavailable.')}</p>
        <button
          onClick={() => onNavigate('/services')}
          className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded"
        >
          {t('services.viewAll', 'Return to Services Catalog')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0f12] min-h-screen text-neutral-100 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('/services')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('services.viewAll', 'Back to All Services')}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-2 block">
              {t('services.label', 'Architectural Service Detail')}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              {service.name}
            </h1>
            <p className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed">
              {service.description}
            </p>

            {/* Scope / Deliverables list */}
            {service.deliverables && service.deliverables.length > 0 && (
              <div className="mt-10 p-6 sm:p-8 bg-[#14181e] border border-neutral-800 rounded-sm">
                <h2 className="text-base font-bold font-display text-white mb-4">
                  {t('services.deliverables', 'Scope of Works & Deliverables')}
                </h2>
                <div className="space-y-3">
                  {service.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Standard notes */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#14181e] border border-neutral-800 rounded-sm">
                <ShieldCheck className="w-5 h-5 text-amber-400 mb-2" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{t('trust.quality.title', 'Testing')}</h3>
                <p className="text-xs text-neutral-400">Watertightness & structural deflection verification.</p>
              </div>
              <div className="p-4 bg-[#14181e] border border-neutral-800 rounded-sm">
                <Hammer className="w-5 h-5 text-amber-400 mb-2" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{t('trust.precision.title', 'Precision')}</h3>
                <p className="text-xs text-neutral-400">High-tolerance miter and mechanical crimp joinery.</p>
              </div>
              <div className="p-4 bg-[#14181e] border border-neutral-800 rounded-sm">
                <Clock className="w-5 h-5 text-amber-400 mb-2" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{t('trust.installation.title', 'Handover')}</h3>
                <p className="text-xs text-neutral-400">Site cleanup, hardware balancing, and sign-off.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual and Quote CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-[4/3] bg-neutral-900 overflow-hidden rounded-sm border border-neutral-800">
              <img
                src={service.image_url}
                alt={service.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 bg-[#161b22] border border-neutral-800 rounded-sm">
              <h3 className="text-base font-bold font-display text-white mb-2">
                {t('services.needThis', 'Need this service for your project?')}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {t('services.needThisDesc', 'Our estimation engineers can calculate profile schedules, structural requirements, and provide a detailed price breakdown.')}
              </p>
              <button
                onClick={() => onNavigate(`/request-quote?service=${encodeURIComponent(service.name)}`)}
                className="w-full py-3 px-4 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{t('services.requestProposal', 'Request Quotation')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
