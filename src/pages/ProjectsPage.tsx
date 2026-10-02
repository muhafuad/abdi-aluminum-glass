import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUpRight, MapPin, Calendar } from 'lucide-react';

interface ProjectsPageProps {
  onNavigate: (path: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const { projects, isLoading } = useSite();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { key: 'All', label: t('cat.all', 'All') },
    { key: 'Residential', label: t('cat.residential', 'Residential') },
    { key: 'Commercial', label: t('cat.commercial', 'Commercial') },
    { key: 'Office', label: t('cat.office', 'Office') },
    { key: 'Storefront', label: t('cat.storefront', 'Storefront') },
    { key: 'Interior', label: t('cat.interior', 'Interior') },
    { key: 'Custom Projects', label: t('cat.custom', 'Custom Projects') }
  ];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="bg-[#0c0f12] min-h-screen text-neutral-100">
      <PageHeader
        label={t('projects.label', 'Architectural Portfolio')}
        title={t('projects.title', 'Completed Facades, Glazing & Custom Metalwork')}
        description={t('projects.desc', 'A curated survey of precision aluminum fabrication, commercial storefront entrances, structural curtain walls, and contemporary residential sliding door installations.')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Category Tabs (Segmented Buttons - functional) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 border-b border-neutral-800 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-[#161b22] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-neutral-500">
            {t('common.loading', 'Loading architectural portfolio...')}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-[#14181e] border border-neutral-800 rounded-sm my-8">
            <p className="text-neutral-400 text-sm">{t('common.noResults', 'No projects currently listed in this category.')}</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 text-xs font-semibold text-amber-400 hover:underline"
            >
              {t('cat.all', 'View All Projects')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onNavigate(`/projects/${project.slug}`)}
                className="group cursor-pointer bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm border border-neutral-800 text-[11px] font-medium text-amber-300">
                      {project.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{project.location}</span>
                      </div>
                      {project.completion_year && (
                        <>
                          <span className="text-neutral-600">·</span>
                          <div className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-neutral-500 shrink-0" />
                            <span>{project.completion_year}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                      {project.short_description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs font-semibold text-neutral-300 group-hover:text-amber-400 transition-colors">
                  <span>{t('projects.viewCaseStudy', 'View Case Study & Gallery')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
