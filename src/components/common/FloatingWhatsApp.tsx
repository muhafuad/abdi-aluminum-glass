import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useSite();
  const { t } = useLanguage();

  const rawNumber = settings.whatsapp_number || settings.phone || '';
  const cleanNumber = rawNumber.replace(/[^0-9+]/g, '');

  const prefilledMessage = encodeURIComponent(t('whatsapp.prefill', 'Hello, I would like to request information about your aluminum and glass services.'));
  const whatsappUrl = cleanNumber && !cleanNumber.includes('Configure')
    ? `https://wa.me/${cleanNumber.replace('+', '')}?text=${prefilledMessage}`
    : '#contact';

  const handleClick = (e: React.MouseEvent) => {
    if (!cleanNumber || cleanNumber.includes('Configure')) {
      e.preventDefault();
      window.location.hash = '#contact';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target={whatsappUrl.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        onClick={handleClick}
        title={t('whatsapp.chat', 'WhatsApp')}
        aria-label="Chat on WhatsApp with Abdi Aluminum & Glass"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-3 rounded-full shadow-xl transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide pr-1">
          {t('whatsapp.chat', 'WhatsApp')}
        </span>
      </a>
    </div>
  );
};
