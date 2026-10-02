import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {Product, Service, Project, Testimonial, SiteSettings} from '../lib/types/database';
import {
  initializeLocalRepository,
  getSiteSettings,
  getProducts,
  getServices,
  getProjects,
  getTestimonials,
  updateSiteSettings as repoUpdateSiteSettings
} from '../lib/supabase/repository';

interface SiteContextType {
  settings: SiteSettings;
  products: Product[];
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<SiteSettings>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    company_name: 'Abdi Aluminum & Glass',
    phone: '[Phone Number — Configure in Admin]',
    whatsapp_number: '[WhatsApp Number — Configure in Admin]',
    email: '[email@example.com — Configure in Admin]',
    address: '[Business Address, Addis Ababa, Ethiopia — Configure in Admin]',
    working_hours: '[Monday – Saturday: 8:00 AM – 6:00 PM — Configure in Admin]',
    facebook: '',
    instagram: '',
    telegram: '',
    tiktok: '',
    logo: '',
    favicon: '',
    hero_headline: 'Built With Precision. Designed to Last.',
    hero_label: 'ALUMINUM & GLASS SOLUTIONS',
    hero_subtext: 'Professional aluminum and glass fabrication, supply, and precision architectural installation for commercial, residential, and corporate spaces.'
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      initializeLocalRepository();
      const [s, p, srv, prj, t] = await Promise.all([
        getSiteSettings(),
        getProducts(false),
        getServices(false),
        getProjects(false),
        getTestimonials(false)
      ]);
      setSettings(s);
      setProducts(p);
      setServices(srv);
      setProjects(prj);
      setTestimonials(t);
    } catch (err) {
      console.error('Failed to load site data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = await repoUpdateSiteSettings(newSettings);
    setSettings(updated);
    return updated;
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        products,
        services,
        projects,
        testimonials,
        isLoading,
        refreshData,
        updateSettings
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
