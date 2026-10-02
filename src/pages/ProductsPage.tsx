import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUpRight, Search } from 'lucide-react';

interface ProductsPageProps {
  onNavigate: (path: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
  const { products, isLoading } = useSite();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'All', label: t('cat.all', 'All') },
    { key: 'Aluminum Profiles', label: t('cat.profiles', 'Aluminum Profiles') },
    { key: 'Glass', label: t('cat.glass', 'Glass') },
    { key: 'Aluminum Doors', label: t('cat.doors', 'Aluminum Doors') },
    { key: 'Aluminum Windows', label: t('cat.windows', 'Aluminum Windows') },
    { key: 'Glass Doors', label: t('cat.glassDoors', 'Glass Doors') },
    { key: 'Accessories & Hardware', label: t('cat.hardware', 'Accessories & Hardware') }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#0c0f12] min-h-screen text-neutral-100">
      <PageHeader
        label={t('products.label', 'Architectural Inventory')}
        title={t('products.title', 'Aluminum Profiles, Glazing & Engineered Systems')}
        description={t('products.desc', 'Premium-grade architectural materials and assembled units tailored for commercial facades, structural windows, and luxury interior partitions.')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Controls: Search & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          {/* Functional Category Filter (Segmented Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-amber-400 text-neutral-950 font-bold'
                    : 'bg-[#161b22] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder={t('products.searchPlaceholder', 'Search products...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14181e] border border-neutral-800 rounded-sm pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-neutral-500">
            {t('common.loading', 'Loading architectural products...')}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#14181e] border border-neutral-800/80 rounded-sm my-8">
            <p className="text-neutral-400 text-sm">{t('common.noResults', 'No products found matching your filter criteria.')}</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-semibold text-amber-400 hover:underline"
            >
              {t('cat.all', 'All')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onNavigate(`/products/${product.slug}`)}
                className="group cursor-pointer bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 backdrop-blur-sm border border-neutral-800 text-[11px] font-medium text-amber-300">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                      {product.short_description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs font-semibold text-neutral-300 group-hover:text-amber-400 transition-colors">
                  <span>{t('products.specs', 'Technical Specifications')}</span>
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
