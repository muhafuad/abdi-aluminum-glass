import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: { url: string; alt?: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close image viewer"
        className="absolute top-4 right-4 z-50 p-2 text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 rounded-md border border-neutral-800"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous image"
          className="absolute left-4 z-50 p-2 text-neutral-300 hover:text-white transition-colors bg-neutral-900/80 hover:bg-neutral-800 rounded-md border border-neutral-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <div
        className="relative max-h-[85vh] max-w-5xl flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.url}
          alt={current.alt || 'Architectural project detail'}
          referrerPolicy="no-referrer"
          className="max-h-[75vh] w-auto object-contain rounded-sm border border-neutral-800 shadow-2xl"
        />
        {current.alt && (
          <p className="mt-3 text-sm text-neutral-300 tracking-wide text-center">
            {current.alt}
          </p>
        )}
        {images.length > 1 && (
          <span className="mt-1 text-xs text-neutral-500 font-mono tabular-nums">
            {currentIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next image"
          className="absolute right-4 z-50 p-2 text-neutral-300 hover:text-white transition-colors bg-neutral-900/80 hover:bg-neutral-800 rounded-md border border-neutral-800"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
