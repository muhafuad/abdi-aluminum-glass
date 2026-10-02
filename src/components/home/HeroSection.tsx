import React from 'react';
import { ArrowUpRight, ShieldCheck, Ruler, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { useSite } from '../../context/SiteContext';
import { useLanguage } from '../../context/LanguageContext';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { settings } = useSite();
  const { language, t } = useLanguage();

  const label = language === 'am' ? t('hero.label') : (settings.hero_label || t('hero.label'));
  const headline = language === 'am' ? t('hero.headline') : (settings.hero_headline || t('hero.headline'));
  const subtext = language === 'am' ? t('hero.subtext') : (settings.hero_subtext || t('hero.subtext'));

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center bg-[#0c0f12] overflow-hidden border-b border-neutral-800">
      {/* Background Architectural Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_architectural_facade_1790866925385.jpg"
          alt="Architectural glass curtain wall and aluminum facade"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f12] via-[#0c0f12]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0f12] via-[#0c0f12]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl">
          {/* Hero Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-400 mb-4"
          >
            {label}
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.1] text-balance"
          >
            {headline}
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl"
          >
            {subtext}
          </motion.p>

          {/* CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => onNavigate('/request-quote')}
              className="px-6 py-3.5 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-2 whitespace-nowrap shadow-md"
            >
              <span>{t('hero.cta.quote', 'Request a Quote')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/projects')}
              className="px-6 py-3.5 text-sm font-semibold text-neutral-200 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 rounded transition-colors whitespace-nowrap"
            >
              {t('hero.cta.projects', 'Explore Our Projects')}
            </button>
          </motion.div>

          {/* Quiet Trust Anchors */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 pt-8 border-t border-neutral-800/80 grid grid-cols-3 gap-6 text-neutral-400 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium text-neutral-300">{t('hero.trust.specs', 'Engineered Specs')}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Ruler className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium text-neutral-300">{t('hero.trust.tolerances', 'Exact Tolerances')}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium text-neutral-300">{t('hero.trust.installation', 'Site Installation')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
