import React from 'react';

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  label,
  title,
  description
}) => {
  return (
    <div className="relative py-16 sm:py-20 bg-[#0c0f12] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {label && (
          <div className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3">
            {label}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-display tracking-tight max-w-3xl text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
