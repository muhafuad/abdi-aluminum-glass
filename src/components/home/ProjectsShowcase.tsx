import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectsShowcaseProps {
  onNavigate: (path: string) => void;
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ onNavigate }) => {
  const { projects } = useSite();
  const { t } = useLanguage();
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  return (
    <section className="py-20 sm:py-24 bg-[#11151a] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
              {t('projects.label', 'Portfolio of Completed Works')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-display tracking-tight mt-2 text-balance">
              {t('projects.title', 'Precision Architectural Installations')}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-400 leading-relaxed">
              {t('projects.desc', 'Explore our completed commercial facades, high-end residential sliding systems, and corporate glass partition installations.')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('/projects')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap self-start md:self-end"
          >
            <span>{t('projects.viewAll', 'Explore Full Portfolio')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onNavigate(`/projects/${project.slug}`)}
              className="group cursor-pointer bg-[#161b22] border border-neutral-800 rounded-sm overflow-hidden hover:border-neutral-700 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                <img
                  src={project.cover_image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm border border-neutral-800 text-[11px] font-medium text-amber-300">
                  {project.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-2.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{project.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-neutral-300 group-hover:text-amber-400 transition-colors">
                  <span>{t('projects.viewCaseStudy', 'View Case Study & Gallery')}</span>
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
