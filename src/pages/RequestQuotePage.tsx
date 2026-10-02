import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { submitQuoteRequest, uploadFile } from '../lib/supabase/repository';
import { quoteRequestSchema, type QuoteRequestFormData } from '../lib/validations/quote';
import { CheckCircle2, Upload, AlertCircle, FileText, Send,  ShieldCheck } from 'lucide-react';

interface RequestQuotePageProps {
  onNavigate: (path: string) => void;
}

export const RequestQuotePage: React.FC<RequestQuotePageProps> = () => {
  const { settings } = useSite();
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState<QuoteRequestFormData>({
    full_name: '',
    phone: '',
    email: '',
    project_type: 'Commercial Storefront / Entrance',
    location: '',
    project_size: '',
    preferred_contact_method: 'phone',
    message: '',
    attachment_url: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Read URL query params for prefilled items (e.g. ?product=... or ?service=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const productParam = params.get('product');
      const serviceParam = params.get('service');
      const projectParam = params.get('project');

      if (productParam) {
        setFormData((prev) => ({
          ...prev,
          message: `Inquiring about specifications and pricing for: ${productParam}`
        }));
      } else if (serviceParam) {
        setFormData((prev) => ({
          ...prev,
          project_type: serviceParam,
          message: `Requesting consultation and quotation for ${serviceParam}`
        }));
      } else if (projectParam) {
        setFormData((prev) => ({
          ...prev,
          message: `Interested in architectural execution similar to project: ${projectParam}`
        }));
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validation = quoteRequestSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      let attachmentUrl = formData.attachment_url || '';
      if (selectedFile) {
        attachmentUrl = await uploadFile('quote-attachments', selectedFile);
      }

      await submitQuoteRequest({
        ...validation.data,
        attachment_url: attachmentUrl
      });

      setIsSuccess(true);
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        project_type: 'Commercial Storefront / Entrance',
        location: '',
        project_size: '',
        preferred_contact_method: 'phone',
        message: '',
        attachment_url: ''
      });
      setSelectedFile(null);
    } catch (err: any) {
      setErrorMessage('We encountered an error submitting your quote request. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0c0f12] min-h-screen text-neutral-100">
      <PageHeader
        label={t('quote.label', 'Project Estimating')}
        title={t('quote.title', 'Request an Architectural Quotation')}
        description={t('quote.desc', 'Submit your project drawings, window schedules, or estimated dimensions. Our engineering estimators calculate profile specifications, glass performance values, and pricing.')}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {isSuccess ? (
          <div className="p-10 sm:p-14 bg-[#14181e] border border-emerald-500/40 rounded-sm text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
              {t('quote.success.title', 'Thank you. Your request has been received.')}
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-lg mx-auto mb-6 leading-relaxed">
              {t('quote.success.desc', 'We will contact you soon. Our technical estimator is reviewing your specifications and will follow up via your preferred contact method.')}
            </p>
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded max-w-md mx-auto text-xs text-neutral-400 mb-8">
              {t('cta.directLine', 'Direct Inquiries')}: <span className="text-amber-400 font-semibold">{settings.phone}</span>
            </div>
            <button
              onClick={() => setIsSuccess(false)}
              className="px-6 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
            >
              {t('quote.success.submitAnother', 'Submit Another Quote Request')}
            </button>
          </div>
        ) : (
          <div className="bg-[#14181e] border border-neutral-800 rounded-sm p-6 sm:p-10 lg:p-12">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-800">
              <div>
                <h2 className="text-xl font-bold font-display text-white">
                  {t('quote.form.title', 'Technical Project Brief')}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {t('quote.form.subtitle', 'All fields marked with an asterisk (*) are required for accurate estimation.')}
                </p>
              </div>
              <ShieldCheck className="w-6 h-6 text-amber-400 hidden sm:block" />
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-800 rounded text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {t('quote.fullName', 'Full Name')} *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Solomon Desta"
                    className={`w-full bg-[#0c0f12] border ${
                      errors.full_name ? 'border-red-500' : 'border-neutral-800'
                    } rounded-sm px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400`}
                  />
                  {errors.full_name && <p className="mt-1 text-xs text-red-400">{errors.full_name}</p>}
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
                    } rounded-sm px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400`}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                </div>
              </div>

              {/* Row 2: Email & Preferred Contact Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {t('quote.email', 'Email Address')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. s.desta@example.com"
                    className={`w-full bg-[#0c0f12] border ${
                      errors.email ? 'border-red-500' : 'border-neutral-800'
                    } rounded-sm px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {t('quote.contactMethod', 'Preferred Contact Method')} *
                  </label>
                  <select
                    name="preferred_contact_method"
                    value={formData.preferred_contact_method}
                    onChange={handleChange}
                    className="w-full bg-[#0c0f12] border border-neutral-800 rounded-sm px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="phone">{t('quote.method.phone', 'Phone Call')}</option>
                    <option value="whatsapp">{t('quote.method.whatsapp', 'WhatsApp Message')}</option>
                    <option value="email">{t('quote.method.email', 'Email')}</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Project Type & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {t('quote.projectType', 'Project Type')} *
                  </label>
                  <select
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                    className="w-full bg-[#0c0f12] border border-neutral-800 rounded-sm px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Commercial Storefront / Entrance">{language === 'am' ? 'የንግድ ሕንፃ ፊት ለፊት / መግቢያ' : 'Commercial Storefront / Entrance'}</option>
                    <option value="Aluminum Doors & Windows">{language === 'am' ? 'የአልሙኒየም በሮች እና መስኮቶች' : 'Aluminum Doors & Windows'}</option>
                    <option value="Office Glass Partitions">{language === 'am' ? 'የቢሮ መስታወት መከፋፈያዎች' : 'Office Glass Partitions'}</option>
                    <option value="Curtain Wall System">{language === 'am' ? 'ከርተን ዎል (Curtain Wall) ሲስተም' : 'Curtain Wall System'}</option>
                    <option value="Residential Sliding Glass Doors">{language === 'am' ? 'የመኖሪያ ቤት ተንሸራታች በሮች' : 'Residential Sliding Glass Doors'}</option>
                    <option value="Glass Balustrades / Railings">{language === 'am' ? 'የመስታወት ባላስትሬድ / የእጅ መደገፊያ' : 'Glass Balustrades / Railings'}</option>
                    <option value="Custom Aluminum Fabrication">{language === 'am' ? 'ልዩ የአልሙኒየም ፋብሪኬሽን' : 'Custom Aluminum Fabrication'}</option>
                    <option value="Other Architectural Works">{language === 'am' ? 'ሌሎች የስነ-ህንፃ ስራዎች' : 'Other Architectural Works'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {t('quote.location', 'Project Location / Site Area')} *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bole Medhanialem, Addis Ababa"
                    className={`w-full bg-[#0c0f12] border ${
                      errors.location ? 'border-red-500' : 'border-neutral-800'
                    } rounded-sm px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400`}
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-400">{errors.location}</p>}
                </div>
              </div>

              {/* Row 4: Project Size / Scope */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {t('quote.size', 'Estimated Project Size / Opening Count')} *
                </label>
                <input
                  type="text"
                  name="project_size"
                  value={formData.project_size}
                  onChange={handleChange}
                  placeholder="e.g. Approx. 85 sqm of glass facade, or 12 casement windows and 2 entrance doors"
                  className={`w-full bg-[#0c0f12] border ${
                    errors.project_size ? 'border-red-500' : 'border-neutral-800'
                  } rounded-sm px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400`}
                />
                {errors.project_size && <p className="mt-1 text-xs text-red-400">{errors.project_size}</p>}
              </div>

              {/* Row 5: Detailed Specifications / Message */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {t('quote.specs', 'Project Description & Specifications')} *
                </label>
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Include details such as glass type (tempered, tinted, double-glazed), profile finish (anodized black, bronze, silver), or timeline constraints..."
                  className={`w-full bg-[#0c0f12] border ${
                    errors.message ? 'border-red-500' : 'border-neutral-800'
                  } rounded-sm p-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
              </div>

              {/* Row 6: Optional File Upload */}
              <div className="p-4 bg-[#0c0f12] border border-neutral-800 rounded-sm">
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  {t('quote.fileUpload', 'Optional Architectural Drawings / BoQ / Photo (PDF, DWG, PNG, JPG)')}
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer px-4 py-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-xs font-semibold text-neutral-200 rounded transition-colors flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('quote.chooseFile', 'Choose File')}</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.dwg"
                    />
                  </label>
                  {selectedFile ? (
                    <div className="flex items-center gap-2 text-xs text-amber-300">
                      <FileText className="w-4 h-4" />
                      <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500">No file selected yet</span>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded transition-colors flex items-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? t('quote.submitting', 'Submitting Quote Request...') : t('quote.submit', 'Submit Quote Request')}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
