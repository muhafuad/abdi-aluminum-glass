import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrustSection } from '../components/home/TrustSection';
import { ServicesPreview } from '../components/home/ServicesPreview';
import { ProjectsShowcase } from '../components/home/ProjectsShowcase';
import { ProcessSection } from '../components/home/ProcessSection';
import { QuoteCTASection } from '../components/home/QuoteCTASection';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { Star, Quote } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { testimonials } = useSite();
  const { t } = useLanguage();

  return (
    <div className="bg-[#0c0f12] text-neutral-100 min-h-screen">
      <HeroSection onNavigate={onNavigate} />
      <TrustSection />
      <ServicesPreview onNavigate={onNavigate} />
      <ProjectsShowcase onNavigate={onNavigate} />
      <ProcessSection />

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 sm:py-24 bg-[#0c0f12] border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12 sm:mb-16">
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                {t('test.label', 'Client Trust & Verification')}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-display tracking-tight mt-2">
                {t('test.title', 'Feedback From Site Developers & Homeowners')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className="p-7 bg-[#14181e] border border-neutral-800 rounded-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed italic">
                      "{item.content}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white font-display">
                        {item.customer_name}
                      </h3>
                      <p className="text-[11px] text-neutral-400">{item.company}</p>
                    </div>
                    <Quote className="w-5 h-5 text-neutral-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuoteCTASection onNavigate={onNavigate} />
    </div>
  );
};
