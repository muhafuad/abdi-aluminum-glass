export type QuoteStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "completed"
  | "rejected";
export type MessageStatus = "new" | "read" | "archived";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "superadmin";
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category:
    | "Aluminum Profiles"
    | "Glass"
    | "Aluminum Doors"
    | "Aluminum Windows"
    | "Glass Doors"
    | "Accessories & Hardware"
    | string;
  short_description: string;
  description: string;
  image_url: string;
  featured: boolean;
  is_active: boolean;
  sort_order: number;
  specifications?: Record<string, string>;
  created_at: string;
  updated_at: string;
  supabaseSynced?: boolean;
  supabaseError?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string;
  featured: boolean;
  is_active: boolean;
  sort_order: number;
  deliverables?: string[];
  created_at: string;
  updated_at: string;
  supabaseSynced?: boolean;
  supabaseError?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category:
    | "Residential"
    | "Commercial"
    | "Office"
    | "Storefront"
    | "Interior"
    | "Custom Projects"
    | string;
  location: string;
  short_description: string;
  description: string;
  cover_image: string;
  featured: boolean;
  is_published: boolean;
  scope?: string;
  completion_year?: string;
  created_at: string;
  updated_at: string;
  supabaseSynced?: boolean;
  supabaseError?: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  project_type: string;
  location: string;
  message: string;
  project_size: string;
  preferred_contact_method: "phone" | "email" | "whatsapp";
  attachment_url?: string;
  status: QuoteStatus;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  company: string;
  content: string;
  image_url?: string;
  rating: number;
  is_published: boolean;
  created_at: string;
}

export interface SiteSettings {
  company_name: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  working_hours: string;
  facebook: string;
  instagram: string;
  telegram: string;
  tiktok: string;
  logo: string;
  favicon: string;
  hero_headline: string;
  hero_label: string;
  hero_subtext: string;
}
