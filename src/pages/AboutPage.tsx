import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { ShieldCheck, Ruler, CheckCircle, Award, Target, Users } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings } = useSite();
  const { language, t } = useLanguage();

  const brandName = language === 'am' ? 'አብዲ አልሙኒየም እና መስታወት' : (settings.company_name || 'Abdi Aluminum & Glass');

  const coreValues = [
    {
      icon: Ruler,
      title: t('about.val1.title', 'Precision Workmanship'),
      desc: t('about.val1.desc', 'Accurate miter cutting, pneumatic corner crimping, and tight assembly tolerances guarantee structural stability and weather resistance.')
    },
    {
      icon: ShieldCheck,
      title: t('about.val2.title', 'Material Integrity'),
      desc: t('about.val2.desc', 'We fabricate exclusively with certified architectural aluminum extrusions, tempered safety glass, and high-performance weather gaskets.')
    },
    {
      icon: Target,
      title: t('about.val3.title', 'Custom Engineering'),
      desc: t('about.val3.desc', 'Every project presents unique architectural demands. We adapt profiles, hardware, and glazing to suit specific wind loads, acoustics, and aesthetics.')
    },
    {
      icon: CheckCircle,
      title: t('about.val4.title', 'Certified Installation'),
      desc: t('about.val4.desc', 'Our on-site crews adhere to rigorous safety protocols and manufacturer fastening guidelines, ensuring long-term watertight performance.')
    },
    {
      icon: Users,
      title: t('about.val5.title', 'Customer Satisfaction'),
      desc: t('about.val5.desc', 'Clear communication, prompt site surveys, detailed quotations, and dedicated post-installation support on every commercial or residential job.')
    },
    {
      icon: Award,
      title: t('about.val6.title', 'Architectural Excellence'),
      desc: t('about.val6.desc', 'Transforming architectural concepts into enduring glass and aluminum installations that enhance daylight, thermal comfort, and modern beauty.')
    }
  ];

  return (
    <div className="bg-[#0c0f12] min-h-screen text-neutral-100">
      <PageHeader
        label={t('about.label', 'Company Profile')}
        title={t('about.title', 'Engineering Precision in Aluminum & Glass Architecture')}
        description={t('about.desc', 'Providing comprehensive fabrication, supply, and installation solutions for doors, windows, curtain walls, storefronts, and interior partitions.')}
      />

      {/* Main Philosophy & Background */}
      <section className="py-16 sm:py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                {t('about.commitment', 'Our Commitment')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-2 mb-6">
                {t('about.heading', 'Built With Precision. Engineered to Endure.')}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
                <p>
                  {language === 'am' ? (
                    t('about.p1')
                  ) : (
                    <>
                      At <strong className="text-white font-medium">{brandName}</strong>, {t('about.p1')}
                    </>
                  )}
                </p>
                <p>
                  {t('about.p2')}
                </p>
                <p>
                  {t('about.p3')}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('/request-quote')}
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
                >
                  {t('nav.requestQuote', 'Request a Quote')}
                </button>
                <button
                  onClick={() => onNavigate('/projects')}
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded transition-colors"
                >
                  {t('hero.cta.projects', 'Explore Our Projects')}
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-sm overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                <img
                  src="/src/assets/images/project_commercial_storefront_1790866938051.jpg"
                  alt="Architectural aluminum and glass installation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="py-16 sm:py-20 border-b border-neutral-800 bg-[#11151a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
              {t('about.commitment', 'Foundational Pillars')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-2">
              {t('about.pillarsTitle', 'Our Operating Standards')}
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              {t('about.pillarsDesc', 'Our workshop and on-site practices are governed by six core tenets of architectural craftsmanship.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-6 bg-[#161b22] border border-neutral-800/80 rounded-sm hover:border-neutral-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-sm bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-display mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
