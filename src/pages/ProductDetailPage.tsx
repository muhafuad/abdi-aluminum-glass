import React from 'react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { products } = useSite();
  const { t } = useLanguage();
  const product = products.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    return (
      <div className="bg-[#0c0f12] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold font-display text-white mb-2">{t('common.notFound', 'Product Not Found')}</h1>
        <p className="text-sm text-neutral-400 mb-6">{t('common.noResults', 'The architectural profile or system you requested is unavailable.')}</p>
        <button
          onClick={() => onNavigate('/products')}
          className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded"
        >
          {t('products.back', 'Return to Products Catalog')}
        </button>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="bg-[#0c0f12] min-h-screen text-neutral-100 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/products')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('products.back', 'Back to All Products')}</span>
        </button>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Main Visual */}
          <div className="bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden p-2">
            <div className="aspect-[4/3] bg-neutral-900 overflow-hidden rounded-sm">
              <img
                src={product.image_url}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details & Inquiries */}
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-2">
              {product.category}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white tracking-tight">
              {product.name}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Matrix */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mt-8 border border-neutral-800 rounded-sm overflow-hidden">
                <div className="bg-[#14181e] px-4 py-3 border-b border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-200">
                  {t('products.specs', 'Technical Specifications')}
                </div>
                <div className="divide-y divide-neutral-800/80 text-xs sm:text-sm">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 px-4 py-3 bg-[#101418]/60">
                      <span className="font-medium text-neutral-400">{key}</span>
                      <span className="col-span-2 text-neutral-200 font-mono text-xs">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate(`/request-quote?product=${encodeURIComponent(product.name)}`)}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-2 shadow-md"
              >
                <span>{t('products.requestQuote', 'Request Quotation for This System')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-5 py-3.5 text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded transition-colors"
              >
                {t('products.inquire', 'Inquire With Technical Team')}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-800">
            <h2 className="text-xl font-bold font-display text-white mb-6">
              {t('products.related', 'Related Systems in')} {product.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate(`/products/${rel.slug}`)}
                  className="group cursor-pointer bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden hover:border-neutral-700 transition-all p-4"
                >
                  <div className="aspect-[16/10] bg-neutral-900 overflow-hidden rounded-sm mb-3">
                    <img
                      src={rel.image_url}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-white font-display group-hover:text-amber-400 transition-colors line-clamp-1">
                    {rel.name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                    {rel.short_description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
