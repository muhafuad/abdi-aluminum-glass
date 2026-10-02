import React from 'react';
import { Layers, Crosshair, Wrench, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TrustSection: React.FC = () => {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: Layers,
      title: t('trust.quality.title', 'Quality Materials'),
      description: t('trust.quality.desc', 'Architectural-grade 6063 aluminum alloys, tempered safety glass, and certified EPDM weather sealing systems.')
    },
    {
      icon: Crosshair,
      title: t('trust.precision.title', 'Precision Fabrication'),
      description: t('trust.precision.desc', 'Tight miter cuts, reinforced internal corner crimping, and precision milling for flawless fit and structural rigidity.')
    },
    {
      icon: Wrench,
      title: t('trust.installation.title', 'Professional Installation'),
      description: t('trust.installation.desc', 'Expert on-site rigging, laser-aligned fixing, and structural weatherproofing by specialized glazing technicians.')
    },
    {
      icon: Clock,
      title: t('trust.service.title', 'Reliable Service'),
      description: t('trust.service.desc', 'Responsive communication, clear project timelines, transparent documentation, and ongoing maintenance support.')
    }
  ];

  return (
    <section className="bg-[#11151a] border-b border-neutral-800 py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 bg-[#161b22] border border-neutral-800/80 rounded-sm hover:border-neutral-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-sm bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-white font-display tracking-tight mb-2">
                  {pillar.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
