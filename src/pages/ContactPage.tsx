import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { submitContactMessage } from '../lib/supabase/repository';
import { contactMessageSchema, type ContactMessageFormData } from '../lib/validations/contact';
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle, Send, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useSite();
  const { t } = useLanguage();

  const [formData, setFormData] = useState<ContactMessageFormData>({
    full_name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setFormData((prev: ContactMessageFormData) => ({
    ...prev,
    [name]: value,
  }));

  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage('');

  const result = contactMessageSchema.safeParse(formData);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach(
      (err ) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      }
    );

    setErrors(fieldErrors);
    return;
  }

  setIsSubmitting(true);

  try {
    await submitContactMessage(result.data);

    setIsSuccess(true);

    setFormData({
      full_name: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
    });
  } catch {
    setErrorMessage(
      'Failed to send message. Please try again or reach out directly by phone.'
    );
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="bg-[#0c0f12] min-h-screen text-neutral-100">
      <PageHeader
        label={t('contact.label', 'Direct Communication')}
        title={t('contact.title', 'Contact Our Workshop & Technical Team')}
        description={t('contact.desc', 'Whether you have an upcoming project blueprint, an existing site requiring assessment, or architectural profile questions, we are ready to assist.')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Configurable Business Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                {t('contact.channels.title', 'Direct Channels')}
              </span>
              <h2 className="text-2xl font-bold font-display text-white mt-1">
                {t('contact.channels.title', 'Office & Workshop Coordinates')}
              </h2>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                {t('contact.channels.desc', 'Reach out to schedule on-site measurements or visit our fabrication facility.')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-[#14181e] border border-neutral-800 rounded-sm flex items-start gap-4">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">{t('contact.office', 'Office & Workshop')}</h3>
                  <p className="mt-1 text-sm text-white">{settings.address}</p>
                </div>
              </div>

              <div className="p-5 bg-[#14181e] border border-neutral-800 rounded-sm flex items-start gap-4">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">{t('contact.telephone', 'Direct Telephone')}</h3>
                  <p className="mt-1 text-sm text-white">{settings.phone}</p>
                </div>
              </div>

              <div className="p-5 bg-[#14181e] border border-neutral-800 rounded-sm flex items-start gap-4">
                <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">{t('contact.whatsapp', 'WhatsApp Dispatch')}</h3>
                  <p className="mt-1 text-sm text-white">{settings.whatsapp_number}</p>
                </div>
              </div>

              <div className="p-5 bg-[#14181e] border border-neutral-800 rounded-sm flex items-start gap-4">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">{t('contact.email', 'Email Inquiries')}</h3>
                  <p className="mt-1 text-sm text-white">{settings.email}</p>
                </div>
              </div>

              <div className="p-5 bg-[#14181e] border border-neutral-800 rounded-sm flex items-start gap-4">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">{t('contact.hours', 'Operating Hours')}</h3>
                  <p className="mt-1 text-sm text-neutral-300">{settings.working_hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-[#14181e] border border-neutral-800 rounded-sm p-6 sm:p-8 lg:p-10">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white mb-2">
              {t('contact.form.title', 'Send a Message')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mb-8 leading-relaxed">
              {t('contact.form.desc', 'Fill out the details below and an Abdi Aluminum & Glass representative will follow up promptly.')}
            </p>

            {isSuccess ? (
              <div className="p-8 bg-neutral-900 border border-emerald-500/30 rounded-sm text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white font-display mb-2">
                  {t('contact.success.title', 'Thank You. Your Message Has Been Sent.')}
                </h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
                  {t('contact.success.desc', 'We have received your inquiry. Our team will review your message and contact you shortly.')}
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded"
                >
                  {t('contact.send', 'Send Another Inquiry')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="p-4 bg-red-950/40 border border-red-800 rounded text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      {t('quote.fullName', 'Full Name')} *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="e.g. Samuel Bekele"
                      className={`w-full bg-[#0c0f12] border ${
                        errors.full_name ? 'border-red-500' : 'border-neutral-800'
                      } rounded-sm px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors`}
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-xs text-red-400">{errors.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      {t('quote.phone', 'Phone Number')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +251 91 123 4567"
                      className={`w-full bg-[#0c0f12] border ${
                        errors.phone ? 'border-red-500' : 'border-neutral-800'
                      } rounded-sm px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      {t('quote.email', 'Email Address')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. name@example.com"
                      className={`w-full bg-[#0c0f12] border ${
                        errors.email ? 'border-red-500' : 'border-neutral-800'
                      } rounded-sm px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      {t('contact.subject', 'Subject')} *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Commercial glass partition inquiry"
                      className={`w-full bg-[#0c0f12] border ${
                        errors.subject ? 'border-red-500' : 'border-neutral-800'
                      } rounded-sm px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-400">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {t('contact.message', 'Your Message')} *
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your architectural inquiry or questions..."
                    className={`w-full bg-[#0c0f12] border ${
                      errors.message ? 'border-red-500' : 'border-neutral-800'
                    } rounded-sm p-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? t('contact.sending', 'Sending Message...') : t('contact.send', 'Send Message')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
