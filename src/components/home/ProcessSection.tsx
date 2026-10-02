import React from 'react';
import { MessageSquareText, Compass, Hammer, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ProcessSection: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t('process.step1.title', 'Consultation'),
      subtitle: t('process.step1.subtitle', "Understand the customer's requirements"),
      desc: t('process.step1.desc', 'We review architectural blueprints, elevation schedules, aesthetic preferences, and budget parameters to recommend optimal profile systems and glazing specifications.'),
      icon: MessageSquareText
    },
    {
      num: '02',
      title: t('process.step2.title', 'Site Assessment'),
      subtitle: t('process.step2.subtitle', 'Evaluate measurements and project requirements'),
      desc: t('process.step2.desc', 'Our technical team visits the jobsite to verify structural openings, lintel tolerances, floor levels, deflection clearances, and installation access conditions.'),
      icon: Compass
    },
    {
      num: '03',
      title: t('process.step3.title', 'Fabrication'),
      subtitle: t('process.step3.subtitle', 'Prepare the aluminum and glass components'),
      desc: t('process.step3.desc', 'Components are cut with precision miter tolerances, pneumatically crimped, fitted with hardware, and sealed in our specialized fabrication facility.'),
      icon: Hammer
    },
    {
      num: '04',
      title: t('process.step4.title', 'Installation'),
      subtitle: t('process.step4.subtitle', 'Professionally install and complete the project'),
      desc: t('process.step4.desc', 'Certified installers rig and fix frames plumb and true, complete structural silicone weatherproofing, test lock hardware, and conduct final handover inspections.'),
      icon: CheckCircle2
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#0c0f12] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
            {t('process.label', 'Workmanship & Execution')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-display tracking-tight mt-2 text-balance">
            {t('process.title', 'Our 4-Stage Architectural Process')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 leading-relaxed">
            {t('process.desc', 'Every aluminum and glass project follows a rigorous, sequential quality control workflow to ensure structural integrity and enduring architectural beauty.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-6 sm:p-7 bg-[#14181d] border border-neutral-800 rounded-sm flex flex-col justify-between hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400/80">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
                      <Icon className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display tracking-tight mb-1">
                    {step.title}
                  </h3>
                  <div className="text-xs font-medium text-amber-300/90 mb-3">
                    {step.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
