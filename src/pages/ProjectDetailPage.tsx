import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { getProjectImages } from '../lib/supabase/repository';
import type { ProjectImage } from '../lib/types/database';
import { Lightbox } from '../components/ui/Lightbox';
import { ArrowLeft, ArrowUpRight, MapPin, Calendar, Layers, Maximize2 } from 'lucide-react';

interface ProjectDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, onNavigate }) => {
  const { projects } = useSite();
  const { t } = useLanguage();
  const project = projects.find((p) => p.slug === slug || p.id === slug);

  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (project?.id) {
      getProjectImages(project.id).then(setGalleryImages);
    }
  }, [project?.id]);

  if (!project) {
    return (
      <div className="bg-[#0c0f12] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold font-display text-white mb-2">{t('common.notFound', 'Project Not Found')}</h1>
        <p className="text-sm text-neutral-400 mb-6">{t('common.noResults', 'The architectural case study you requested could not be located.')}</p>
        <button
          onClick={() => onNavigate('/projects')}
          className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded"
        >
          {t('projects.viewAll', 'Return to Projects Portfolio')}
        </button>
      </div>
    );
  }

  // Combine cover image + gallery images for Lightbox
  const allImages = [
    { url: project.cover_image, alt: `${project.title} - Primary Elevation` },
    ...galleryImages.map((img) => ({ url: img.image_url, alt: img.alt_text || project.title }))
  ];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="bg-[#0c0f12] min-h-screen text-neutral-100 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('/projects')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('projects.viewAll', 'Back to All Projects')}</span>
        </button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
              <span className="text-amber-400 font-semibold uppercase tracking-wider">
                {project.category}
              </span>
              <span className="text-neutral-600">/</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                {project.location}
              </span>
              {project.completion_year && (
                <>
                  <span className="text-neutral-600">/</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    {project.completion_year}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight text-balance">
              {project.title}
            </h1>
            <p className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#14181e] border border-neutral-800 rounded-sm p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              {t('projects.scope', 'Project Specification')}
            </h2>
            <div className="divide-y divide-neutral-800/80 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400">{t('cat.all', 'Classification')}</span>
                <span className="text-white font-medium">{project.category}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400">{t('quote.location', 'Site Location')}</span>
                <span className="text-white font-medium">{project.location}</span>
              </div>
              {project.completion_year && (
                <div className="py-2.5 flex justify-between">
                  <span className="text-neutral-400">{t('projects.year', 'Year Completed')}</span>
                  <span className="text-white font-mono">{project.completion_year}</span>
                </div>
              )}
              {project.scope && (
                <div className="py-2.5 flex flex-col gap-1">
                  <span className="text-neutral-400">{t('projects.scope', 'Scope of Work')}</span>
                  <span className="text-neutral-200">{project.scope}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate(`/request-quote?project=${encodeURIComponent(project.title)}`)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{t('projects.requestSimilar', 'Request Quote for Similar Scope')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Primary Cover Image with Lightbox Trigger */}
        <div
          onClick={() => handleOpenLightbox(0)}
          className="group relative aspect-[16/9] bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800 cursor-pointer shadow-2xl mb-8"
        >
          <img
            src={project.cover_image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="px-4 py-2 bg-black/80 backdrop-blur-sm border border-neutral-700 text-xs font-semibold text-white rounded flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              {t('projects.fullscreen', 'View Fullscreen Gallery')}
            </span>
          </div>
        </div>

        {/* Additional Gallery Grid */}
        {galleryImages.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg font-bold font-display text-white">
                {t('projects.views', 'Detailed Views & Architectural Elevations')} ({galleryImages.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => handleOpenLightbox(idx + 1)}
                  className="group relative aspect-[4/3] bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800 cursor-pointer"
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || `${project.title} detail`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accessible Lightbox Component */}
      <Lightbox
        images={allImages}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % allImages.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
      />
    </div>
  );
};
