import React, { useState } from 'react';
import { X, Copy, Check, Database } from 'lucide-react';

interface AdminSqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSqlSchemaModal: React.FC<AdminSqlSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- ============================================================
-- ABDI ALUMINUM & GLASS - SUPABASE POSTGRESQL SCHEMA & RLS RULES
-- ============================================================
-- Run this script in your Supabase SQL Editor (Database > SQL Editor).

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    deliverables TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    scope TEXT,
    completion_year TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROJECT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- QUOTE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    project_type TEXT NOT NULL,
    location TEXT NOT NULL,
    message TEXT NOT NULL,
    project_size TEXT NOT NULL,
    preferred_contact_method TEXT NOT NULL CHECK (preferred_contact_method IN ('phone', 'email', 'whatsapp')),
    attachment_url TEXT,
    status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'read', 'archived')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    company TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    rating INTEGER DEFAULT 5 NOT NULL CHECK (rating >= 1 AND rating <= 5),
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    company_name TEXT NOT NULL DEFAULT 'Abdi Aluminum & Glass',
    phone TEXT NOT NULL DEFAULT '[Phone Number — Configure in Admin]',
    whatsapp_number TEXT NOT NULL DEFAULT '[WhatsApp Number — Configure in Admin]',
    email TEXT NOT NULL DEFAULT '[email@example.com — Configure in Admin]',
    address TEXT NOT NULL DEFAULT '[Business Address, Addis Ababa, Ethiopia — Configure in Admin]',
    working_hours TEXT NOT NULL DEFAULT '[Monday – Saturday: 8:00 AM – 6:00 PM — Configure in Admin]',
    facebook TEXT DEFAULT '',
    instagram TEXT DEFAULT '',
    telegram TEXT DEFAULT '',
    tiktok TEXT DEFAULT '',
    logo TEXT DEFAULT '',
    favicon TEXT DEFAULT '',
    hero_headline TEXT NOT NULL DEFAULT 'Built With Precision. Designed to Last.',
    hero_label TEXT NOT NULL DEFAULT 'ALUMINUM & GLASS SOLUTIONS',
    hero_subtext TEXT NOT NULL DEFAULT 'Professional aluminum and glass fabrication, supply, and precision architectural installation.',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- RLS POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow full access for client-side administration (using Supabase Anon Key):
CREATE POLICY "Allow public all products" ON public.products FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all services" ON public.services FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all projects" ON public.projects FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all project_images" ON public.project_images FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all quote_requests" ON public.quote_requests FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all contact_messages" ON public.contact_messages FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all testimonials" ON public.testimonials FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all site_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES 
('projects', 'projects', true),
('products', 'products', true),
('services', 'services', true),
('testimonials', 'testimonials', true),
('site-assets', 'site-assets', true),
('quote-attachments', 'quote-attachments', false)
ON CONFLICT (id) DO NOTHING;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="bg-[#14181e] border border-neutral-800 rounded-sm w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Supabase SQL Schema & Row Level Security
              </h3>
              <p className="text-xs text-neutral-400">
                Copy and run directly in your Supabase SQL Editor.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-neutral-300 bg-[#0c0f12] leading-relaxed">
          <pre className="whitespace-pre-wrap">{sqlCode}</pre>
        </div>
      </div>
    </div>
  );
};
