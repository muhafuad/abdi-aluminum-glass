import { getSupabaseClient } from "./client";
import {
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
  INITIAL_PROJECT_IMAGES,
  INITIAL_QUOTE_REQUESTS,
  INITIAL_CONTACT_MESSAGES,
  INITIAL_TESTIMONIALS,
  INITIAL_SITE_SETTINGS,
} from "./seedData";
import type {
  Product,
  Service,
  Project,
  ProjectImage,
  QuoteRequest,
  ContactMessage,
  Testimonial,
  SiteSettings,
  QuoteStatus,
  MessageStatus,
} from "../../lib/types/database";

export const STORAGE_KEYS = {
  PRODUCTS: "abdi_db_products",
  SERVICES: "abdi_db_services",
  PROJECTS: "abdi_db_projects",
  PROJECT_IMAGES: "abdi_db_project_images",
  QUOTE_REQUESTS: "abdi_db_quote_requests",
  CONTACT_MESSAGES: "abdi_db_contact_messages",
  TESTIMONIALS: "abdi_db_testimonials",
  SETTINGS: "abdi_db_settings",
};

// UUID Validator for PostgreSQL compatibility
export function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
}

// Generate RFC4122 v4 UUID
export function generateUuid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Robust slug generator that handles English, Amharic, numbers, and symbols without producing empty strings
export function generateSlug(text: string, prefix = "item"): string {
  const clean = (text || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  if (clean && clean.length >= 2) return clean;

  // Handle Amharic Ge'ez script or non-ASCII by hashing & timestamping
  const hash = Array.from(text || "")
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
    .toString(36);
  const time = Date.now().toString(36);
  return `${prefix}-${time}-${hash || Math.random().toString(36).substring(2, 6)}`;
}

export function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// Ensure initial seed in localStorage if missing
export function initializeLocalRepository() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS))
    setLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES))
    setLocal(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS))
    setLocal(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  if (!localStorage.getItem(STORAGE_KEYS.PROJECT_IMAGES))
    setLocal(STORAGE_KEYS.PROJECT_IMAGES, INITIAL_PROJECT_IMAGES);
  if (!localStorage.getItem(STORAGE_KEYS.QUOTE_REQUESTS))
    setLocal(STORAGE_KEYS.QUOTE_REQUESTS, INITIAL_QUOTE_REQUESTS);
  if (!localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES))
    setLocal(STORAGE_KEYS.CONTACT_MESSAGES, INITIAL_CONTACT_MESSAGES);
  if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS))
    setLocal(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS))
    setLocal(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
}

// ----------------- SITE SETTINGS -----------------
export async function getSiteSettings(): Promise<SiteSettings> {
  const localSettings = getLocal<SiteSettings>(
    STORAGE_KEYS.SETTINGS,
    INITIAL_SITE_SETTINGS,
  );
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (!error && data) {
        setLocal(STORAGE_KEYS.SETTINGS, data as SiteSettings);
        return data as SiteSettings;
      }
    } catch (e) {
      console.warn("Supabase site_settings fetch error, using local:", e);
    }
  }
  return localSettings;
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated = { ...current, ...settings };
  setLocal(STORAGE_KEYS.SETTINGS, updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from("site_settings")
        .upsert({ id: 1, ...updated, updated_at: new Date().toISOString() });
    } catch (e) {
      console.warn("Supabase site_settings update error:", e);
    }
  }
  return updated;
}

// ----------------- PRODUCTS -----------------
export async function getProducts(includeInactive = false): Promise<Product[]> {
  const localProducts = getLocal<Product[]>(
    STORAGE_KEYS.PRODUCTS,
    INITIAL_PRODUCTS,
  );
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!includeInactive) {
        query = query.eq("is_active", true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const remoteList = data as Product[];
        const remoteSlugs = new Set(remoteList.map((p) => p.slug));
        const remoteIds = new Set(remoteList.map((p) => p.id));

        // Intelligent merge: keep any local products not yet synced into remote
        const merged = [...remoteList];
        for (const lp of localProducts) {
          if (!remoteSlugs.has(lp.slug) && !remoteIds.has(lp.id)) {
            if (includeInactive || lp.is_active) {
              merged.push(lp);
            }
          }
        }
        setLocal(STORAGE_KEYS.PRODUCTS, merged);
        return merged;
      } else if (error) {
        console.warn(
          "Supabase products fetch warning, using local dataset:",
          error.message,
        );
      }
    } catch (e) {
      console.warn("Supabase products fetch exception, using local:", e);
    }
  }

  return includeInactive
    ? localProducts
    : localProducts.filter((p) => p.is_active);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts(true);
  return products.find((p) => p.slug === slug) || null;
}

export async function saveProduct(
  product: Partial<Product> & { name: string },
): Promise<Product> {
  const all = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const now = new Date().toISOString();

  const id =
    product.id && isValidUuid(product.id)
      ? product.id
      : product.id || generateUuid();
  const slug = product.slug || generateSlug(product.name, "product");

  let saved: Product;
  const existingIdx = all.findIndex(
    (p) => (product.id && p.id === product.id) || (slug && p.slug === slug),
  );

  if (existingIdx !== -1) {
    saved = {
      ...all[existingIdx],
      ...product,
      id: all[existingIdx].id || id,
      slug,
      name: product.name.trim(),
      updated_at: now,
    };
    all[existingIdx] = saved;
  } else {
    saved = {
      id,
      name: product.name.trim(),
      slug,
      category: product.category || "Aluminum Profiles",
      short_description: product.short_description || "",
      description: product.description || "",
      image_url:
        product.image_url ||
        "/src/assets/images/product_aluminum_profile_fabrication_1790866959417.jpg",
      featured: product.featured ?? false,
      is_active: product.is_active ?? true,
      sort_order: product.sort_order ?? all.length + 1,
      specifications: product.specifications || {},
      created_at: product.created_at || now,
      updated_at: now,
    };
    all.push(saved);
  }

  // 1. Immediately store in localStorage so public website and Admin render it right away
  setLocal(STORAGE_KEYS.PRODUCTS, all);

  // 2. Synchronize to Supabase if connected
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const payload: Record<string, any> = {
        name: saved.name,
        slug: saved.slug,
        category: saved.category,
        short_description: saved.short_description,
        description: saved.description,
        image_url: saved.image_url,
        featured: saved.featured,
        is_active: saved.is_active,
        sort_order: saved.sort_order,
        specifications: saved.specifications,
        updated_at: saved.updated_at,
      };
      if (isValidUuid(saved.id)) {
        payload.id = saved.id;
      }

      const { data, error } = await supabase
        .from("products")
        .upsert(payload, { onConflict: "slug" })
        .select()
        .single();

      if (error) {
        console.warn(
          "Supabase product upsert error (saved locally):",
          error.message,
        );
        saved.supabaseSynced = false;
        saved.supabaseError = error.message;
      } else {
        saved.supabaseSynced = true;
        saved.supabaseError = undefined;
        if (data?.id && data.id !== saved.id) {
          saved.id = data.id;
          const currentAll = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, all);
          const i = currentAll.findIndex((p) => p.slug === saved.slug);
          if (i !== -1) {
            currentAll[i] = saved;
            setLocal(STORAGE_KEYS.PRODUCTS, currentAll);
          }
        }
      }
    } catch (e: any) {
      console.warn("Supabase product save exception (saved locally):", e);
      saved.supabaseSynced = false;
      saved.supabaseError = e.message || "Network exception saving to Supabase";
    }
  }

  return saved;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const all = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const target = all.find((p) => p.id === id);
  const filtered = all.filter((p) => p.id !== id);
  setLocal(STORAGE_KEYS.PRODUCTS, filtered);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      if (isValidUuid(id)) {
        await supabase.from("products").delete().eq("id", id);
      } else if (target?.slug) {
        await supabase.from("products").delete().eq("slug", target.slug);
      }
    } catch (e) {
      console.warn("Supabase product delete error:", e);
    }
  }
  return true;
}

// ----------------- SERVICES -----------------
export async function getServices(includeInactive = false): Promise<Service[]> {
  const localServices = getLocal<Service[]>(
    STORAGE_KEYS.SERVICES,
    INITIAL_SERVICES,
  );
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!includeInactive) {
        query = query.eq("is_active", true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const remoteList = data as Service[];
        const remoteSlugs = new Set(remoteList.map((s) => s.slug));
        const remoteIds = new Set(remoteList.map((s) => s.id));

        const merged = [...remoteList];
        for (const ls of localServices) {
          if (!remoteSlugs.has(ls.slug) && !remoteIds.has(ls.id)) {
            if (includeInactive || ls.is_active) {
              merged.push(ls);
            }
          }
        }
        setLocal(STORAGE_KEYS.SERVICES, merged);
        return merged;
      } else if (error) {
        console.warn(
          "Supabase services fetch warning, using local dataset:",
          error.message,
        );
      }
    } catch (e) {
      console.warn("Supabase services fetch error, using local:", e);
    }
  }

  return includeInactive
    ? localServices
    : localServices.filter((s) => s.is_active);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices(true);
  return services.find((s) => s.slug === slug) || null;
}

export async function saveService(
  service: Partial<Service> & { name: string },
): Promise<Service> {
  const all = getLocal<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  const now = new Date().toISOString();

  const id =
    service.id && isValidUuid(service.id)
      ? service.id
      : service.id || generateUuid();
  const slug = service.slug || generateSlug(service.name, "service");

  let saved: Service;
  const existingIdx = all.findIndex(
    (s) => (service.id && s.id === service.id) || (slug && s.slug === slug),
  );

  if (existingIdx !== -1) {
    saved = {
      ...all[existingIdx],
      ...service,
      id: all[existingIdx].id || id,
      slug,
      name: service.name.trim(),
      updated_at: now,
    };
    all[existingIdx] = saved;
  } else {
    saved = {
      id,
      name: service.name.trim(),
      slug,
      short_description: service.short_description || "",
      description: service.description || "",
      image_url:
        service.image_url ||
        "/src/assets/images/service_glass_partition_office_1790866970041.jpg",
      featured: service.featured ?? false,
      is_active: service.is_active ?? true,
      sort_order: service.sort_order ?? all.length + 1,
      deliverables: service.deliverables || [],
      created_at: service.created_at || now,
      updated_at: now,
    };
    all.push(saved);
  }

  setLocal(STORAGE_KEYS.SERVICES, all);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const payload: Record<string, any> = {
        name: saved.name,
        slug: saved.slug,
        short_description: saved.short_description,
        description: saved.description,
        image_url: saved.image_url,
        featured: saved.featured,
        is_active: saved.is_active,
        sort_order: saved.sort_order,
        deliverables: saved.deliverables,
        updated_at: saved.updated_at,
      };
      if (isValidUuid(saved.id)) {
        payload.id = saved.id;
      }

      const { data, error } = await supabase
        .from("services")
        .upsert(payload, { onConflict: "slug" })
        .select()
        .single();

      if (error) {
        console.warn("Supabase service upsert error:", error.message);
        saved.supabaseSynced = false;
        saved.supabaseError = error.message;
      } else {
        saved.supabaseSynced = true;
        saved.supabaseError = undefined;
        if (data?.id && data.id !== saved.id) {
          saved.id = data.id;
          const currentAll = getLocal<Service[]>(STORAGE_KEYS.SERVICES, all);
          const i = currentAll.findIndex((s) => s.slug === saved.slug);
          if (i !== -1) {
            currentAll[i] = saved;
            setLocal(STORAGE_KEYS.SERVICES, currentAll);
          }
        }
      }
    } catch (e: any) {
      console.warn("Supabase service save error:", e);
      saved.supabaseSynced = false;
      saved.supabaseError = e.message;
    }
  }

  return saved;
}

export async function deleteService(id: string): Promise<boolean> {
  const all = getLocal<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  const target = all.find((s) => s.id === id);
  const filtered = all.filter((s) => s.id !== id);
  setLocal(STORAGE_KEYS.SERVICES, filtered);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      if (isValidUuid(id)) {
        await supabase.from("services").delete().eq("id", id);
      } else if (target?.slug) {
        await supabase.from("services").delete().eq("slug", target.slug);
      }
    } catch (e) {
      console.warn("Supabase service delete error:", e);
    }
  }
  return true;
}

// ----------------- PROJECTS -----------------
export async function getProjects(
  includeUnpublished = false,
): Promise<Project[]> {
  const localProjects = getLocal<Project[]>(
    STORAGE_KEYS.PROJECTS,
    INITIAL_PROJECTS,
  );
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (!includeUnpublished) {
        query = query.eq("is_published", true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const remoteList = data as Project[];
        const remoteSlugs = new Set(remoteList.map((p) => p.slug));
        const remoteIds = new Set(remoteList.map((p) => p.id));

        // Intelligent merge: keep any locally added projects so they display immediately
        const merged = [...remoteList];
        for (const lp of localProjects) {
          if (!remoteSlugs.has(lp.slug) && !remoteIds.has(lp.id)) {
            if (includeUnpublished || lp.is_published) {
              merged.push(lp);
            }
          }
        }
        setLocal(STORAGE_KEYS.PROJECTS, merged);
        return merged;
      } else if (error) {
        console.warn(
          "Supabase projects fetch warning, using local dataset:",
          error.message,
        );
      }
    } catch (e) {
      console.warn("Supabase projects fetch error, using local:", e);
    }
  }

  return includeUnpublished
    ? localProjects
    : localProjects.filter((p) => p.is_published);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects(true);
  return projects.find((p) => p.slug === slug) || null;
}

export async function getProjectImages(
  projectId: string,
): Promise<ProjectImage[]> {
  const supabase = getSupabaseClient();
  if (supabase && isValidUuid(projectId)) {
    try {
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) return data as ProjectImage[];
    } catch (e) {
      console.warn("Supabase project_images fetch error, using local:", e);
    }
  }
  const all = getLocal<ProjectImage[]>(
    STORAGE_KEYS.PROJECT_IMAGES,
    INITIAL_PROJECT_IMAGES,
  );
  return all
    .filter((img) => img.project_id === projectId)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveProject(
  project: Partial<Project> & { title: string },
  galleryImages?: string[],
): Promise<Project> {
  const all = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const now = new Date().toISOString();

  const id =
    project.id && isValidUuid(project.id)
      ? project.id
      : project.id || generateUuid();
  const slug = project.slug || generateSlug(project.title, "project");

  let saved: Project;
  const existingIdx = all.findIndex(
    (p) => (project.id && p.id === project.id) || (slug && p.slug === slug),
  );

  if (existingIdx !== -1) {
    saved = {
      ...all[existingIdx],
      ...project,
      id: all[existingIdx].id || id,
      slug,
      title: project.title.trim(),
      updated_at: now,
    };
    all[existingIdx] = saved;
  } else {
    saved = {
      id,
      title: project.title.trim(),
      slug,
      category: project.category || "Commercial",
      location: project.location || "Addis Ababa",
      short_description: project.short_description || "",
      description: project.description || "",
      cover_image:
        project.cover_image ||
        "/src/assets/images/project_commercial_storefront_1790866938051.jpg",
      featured: project.featured ?? false,
      is_published: project.is_published ?? true,
      scope: project.scope || "",
      completion_year: project.completion_year || "2025",
      created_at: project.created_at || now,
      updated_at: now,
    };
    all.push(saved);
  }

  // 1. Immediately store in localStorage so public website and Admin render it right away
  setLocal(STORAGE_KEYS.PROJECTS, all);

  // Handle gallery images locally
  if (galleryImages && galleryImages.length > 0) {
    const allImages = getLocal<ProjectImage[]>(
      STORAGE_KEYS.PROJECT_IMAGES,
      INITIAL_PROJECT_IMAGES,
    );
    const otherImages = allImages.filter((img) => img.project_id !== saved.id);
    const newImages: ProjectImage[] = galleryImages.map((url, i) => ({
      id: generateUuid(),
      project_id: saved.id,
      image_url: url,
      alt_text: `${saved.title} gallery view ${i + 1}`,
      sort_order: i + 1,
      created_at: now,
    }));
    setLocal(STORAGE_KEYS.PROJECT_IMAGES, [...otherImages, ...newImages]);
  }

  // 2. Synchronize to Supabase if connected
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const payload: Record<string, any> = {
        title: saved.title,
        slug: saved.slug,
        category: saved.category,
        location: saved.location,
        short_description: saved.short_description,
        description: saved.description,
        cover_image: saved.cover_image,
        featured: saved.featured,
        is_published: saved.is_published,
        scope: saved.scope,
        completion_year: saved.completion_year,
        updated_at: saved.updated_at,
      };
      if (isValidUuid(saved.id)) {
        payload.id = saved.id;
      }

      const { data, error } = await supabase
        .from("projects")
        .upsert(payload, { onConflict: "slug" })
        .select()
        .single();

      if (error) {
        console.warn(
          "Supabase project upsert error (saved locally):",
          error.message,
        );
        saved.supabaseSynced = false;
        saved.supabaseError = error.message;
      } else {
        saved.supabaseSynced = true;
        saved.supabaseError = undefined;
        if (data?.id && data.id !== saved.id) {
          saved.id = data.id;
          const currentAll = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, all);
          const i = currentAll.findIndex((p) => p.slug === saved.slug);
          if (i !== -1) {
            currentAll[i] = saved;
            setLocal(STORAGE_KEYS.PROJECTS, currentAll);
          }
        }

        // Insert gallery images into Supabase if provided
        if (
          galleryImages &&
          galleryImages.length > 0 &&
          isValidUuid(saved.id)
        ) {
          const imgPayload = galleryImages.map((url, i) => ({
            id: generateUuid(),
            project_id: saved.id,
            image_url: url,
            alt_text: `${saved.title} gallery view ${i + 1}`,
            sort_order: i + 1,
          }));
          await supabase.from("project_images").insert(imgPayload);
        }
      }
    } catch (e: any) {
      console.warn("Supabase project save error (saved locally):", e);
      saved.supabaseSynced = false;
      saved.supabaseError = e.message;
    }
  }

  return saved;
}

export async function deleteProject(id: string): Promise<boolean> {
  const all = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const target = all.find((p) => p.id === id);
  setLocal(
    STORAGE_KEYS.PROJECTS,
    all.filter((p) => p.id !== id),
  );

  const allImages = getLocal<ProjectImage[]>(
    STORAGE_KEYS.PROJECT_IMAGES,
    INITIAL_PROJECT_IMAGES,
  );
  setLocal(
    STORAGE_KEYS.PROJECT_IMAGES,
    allImages.filter((img) => img.project_id !== id),
  );

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      if (isValidUuid(id)) {
        await supabase.from("projects").delete().eq("id", id);
      } else if (target?.slug) {
        await supabase.from("projects").delete().eq("slug", target.slug);
      }
    } catch (e) {
      console.warn("Supabase project delete error:", e);
    }
  }
  return true;
}

// ----------------- QUOTE REQUESTS -----------------
export async function submitQuoteRequest(
  data: Omit<QuoteRequest, "id" | "status" | "created_at">,
): Promise<QuoteRequest> {
  const id = generateUuid();
  const newQuote: QuoteRequest = {
    ...data,
    id,
    status: "new",
    created_at: new Date().toISOString(),
  };

  // 1. Immediately store in local repository so Admin and counters see it instantly
  const all = getLocal<QuoteRequest[]>(
    STORAGE_KEYS.QUOTE_REQUESTS,
    INITIAL_QUOTE_REQUESTS,
  );
  const updated = [newQuote, ...all.filter((q) => q.id !== id)];
  setLocal(STORAGE_KEYS.QUOTE_REQUESTS, updated);

  // 2. Synchronize to Supabase if connected
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const payload: Record<string, any> = {
        id,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        project_type: data.project_type,
        location: data.location,
        message: data.message,
        project_size: data.project_size,
        preferred_contact_method: data.preferred_contact_method,
        attachment_url: data.attachment_url || null,
        status: "new",
      };
      const { error } = await supabase.from("quote_requests").insert(payload);
      if (error) {
        console.warn(
          "Supabase quote request insert error (saved locally):",
          error.message,
        );
      }
    } catch (e) {
      console.warn("Supabase quote request insert exception:", e);
    }
  }

  return newQuote;
}

export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  const localQuotes = getLocal<QuoteRequest[]>(
    STORAGE_KEYS.QUOTE_REQUESTS,
    INITIAL_QUOTE_REQUESTS,
  );
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const remoteList = data as QuoteRequest[];
        const remoteIds = new Set(remoteList.map((q) => q.id));

        // Intelligent merge: Retain all local requests that aren't present in remote
        const merged = [...remoteList];
        for (const lq of localQuotes) {
          if (!remoteIds.has(lq.id)) {
            const match = remoteList.find(
              (r) =>
                r.email === lq.email &&
                Math.abs(
                  new Date(r.created_at).getTime() -
                    new Date(lq.created_at).getTime(),
                ) < 60000,
            );
            if (!match) {
              merged.push(lq);
            }
          }
        }
        merged.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setLocal(STORAGE_KEYS.QUOTE_REQUESTS, merged);
        return merged;
      } else if (error) {
        console.warn(
          "Supabase quote_requests fetch warning (using local storage):",
          error.message,
        );
      }
    } catch (e) {
      console.warn("Supabase quote_requests fetch exception, using local:", e);
    }
  }

  return localQuotes;
}

export async function updateQuoteStatus(
  id: string,
  status: QuoteStatus,
): Promise<boolean> {
  const all = getLocal<QuoteRequest[]>(
    STORAGE_KEYS.QUOTE_REQUESTS,
    INITIAL_QUOTE_REQUESTS,
  );
  const target = all.find((q) => q.id === id);
  if (target) {
    target.status = status;
    setLocal(STORAGE_KEYS.QUOTE_REQUESTS, all);
  }

  const supabase = getSupabaseClient();
  if (supabase && isValidUuid(id)) {
    try {
      await supabase.from("quote_requests").update({ status }).eq("id", id);
    } catch (e) {
      console.warn("Supabase quote status update error:", e);
    }
  }
  return true;
}

export async function deleteQuoteRequest(id: string): Promise<boolean> {
  const all = getLocal<QuoteRequest[]>(
    STORAGE_KEYS.QUOTE_REQUESTS,
    INITIAL_QUOTE_REQUESTS,
  );
  setLocal(
    STORAGE_KEYS.QUOTE_REQUESTS,
    all.filter((q) => q.id !== id),
  );

  const supabase = getSupabaseClient();
  if (supabase && isValidUuid(id)) {
    try {
      await supabase.from("quote_requests").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase quote delete error:", e);
    }
  }
  return true;
}

// ----------------- CONTACT MESSAGES -----------------
export async function submitContactMessage(
  data: Omit<ContactMessage, "id" | "status" | "created_at">,
): Promise<ContactMessage> {
  const id = generateUuid();
  const newMessage: ContactMessage = {
    ...data,
    id,
    status: "new",
    created_at: new Date().toISOString(),
  };

  const all = getLocal<ContactMessage[]>(
    STORAGE_KEYS.CONTACT_MESSAGES,
    INITIAL_CONTACT_MESSAGES,
  );
  const updated = [newMessage, ...all.filter((m) => m.id !== id)];
  setLocal(STORAGE_KEYS.CONTACT_MESSAGES, updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const payload: Record<string, any> = {
        id,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: "new",
      };
      const { error } = await supabase.from("contact_messages").insert(payload);
      if (error) {
        console.warn(
          "Supabase contact message insert error (saved locally):",
          error.message,
        );
      }
    } catch (e) {
      console.warn("Supabase contact message insert exception:", e);
    }
  }

  return newMessage;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const localMessages = getLocal<ContactMessage[]>(
    STORAGE_KEYS.CONTACT_MESSAGES,
    INITIAL_CONTACT_MESSAGES,
  );
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const remoteList = data as ContactMessage[];
        const remoteIds = new Set(remoteList.map((m) => m.id));

        const merged = [...remoteList];
        for (const lm of localMessages) {
          if (!remoteIds.has(lm.id)) {
            const match = remoteList.find(
              (r) =>
                r.email === lm.email &&
                Math.abs(
                  new Date(r.created_at).getTime() -
                    new Date(lm.created_at).getTime(),
                ) < 60000,
            );
            if (!match) {
              merged.push(lm);
            }
          }
        }
        merged.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setLocal(STORAGE_KEYS.CONTACT_MESSAGES, merged);
        return merged;
      } else if (error) {
        console.warn(
          "Supabase contact_messages fetch warning (using local storage):",
          error.message,
        );
      }
    } catch (e) {
      console.warn("Supabase contact_messages fetch error, using local:", e);
    }
  }

  return localMessages;
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus,
): Promise<boolean> {
  const all = getLocal<ContactMessage[]>(
    STORAGE_KEYS.CONTACT_MESSAGES,
    INITIAL_CONTACT_MESSAGES,
  );
  const target = all.find((m) => m.id === id);
  if (target) {
    target.status = status;
    setLocal(STORAGE_KEYS.CONTACT_MESSAGES, all);
  }

  const supabase = getSupabaseClient();
  if (supabase && isValidUuid(id)) {
    try {
      await supabase.from("contact_messages").update({ status }).eq("id", id);
    } catch (e) {
      console.warn("Supabase message status update error:", e);
    }
  }
  return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const all = getLocal<ContactMessage[]>(
    STORAGE_KEYS.CONTACT_MESSAGES,
    INITIAL_CONTACT_MESSAGES,
  );
  setLocal(
    STORAGE_KEYS.CONTACT_MESSAGES,
    all.filter((m) => m.id !== id),
  );

  const supabase = getSupabaseClient();
  if (supabase && isValidUuid(id)) {
    try {
      await supabase.from("contact_messages").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase message delete error:", e);
    }
  }
  return true;
}

// ----------------- TESTIMONIALS -----------------
export async function getTestimonials(
  includeUnpublished = false,
): Promise<Testimonial[]> {
  const localTestimonials = getLocal<Testimonial[]>(
    STORAGE_KEYS.TESTIMONIALS,
    INITIAL_TESTIMONIALS,
  );
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (!includeUnpublished) {
        query = query.eq("is_published", true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const remoteList = data as Testimonial[];
        const remoteIds = new Set(remoteList.map((t) => t.id));

        const merged = [...remoteList];
        for (const lt of localTestimonials) {
          if (!remoteIds.has(lt.id)) {
            if (includeUnpublished || lt.is_published) {
              merged.push(lt);
            }
          }
        }
        setLocal(STORAGE_KEYS.TESTIMONIALS, merged);
        return merged;
      } else if (error) {
        console.warn(
          "Supabase testimonials fetch warning, using local dataset:",
          error.message,
        );
      }
    } catch (e) {
      console.warn("Supabase testimonials fetch error, using local:", e);
    }
  }

  return includeUnpublished
    ? localTestimonials
    : localTestimonials.filter((t) => t.is_published);
}

export async function saveTestimonial(
  testimonial: Partial<Testimonial> & {
    customer_name: string;
    content: string;
  },
): Promise<Testimonial> {
  const all = getLocal<Testimonial[]>(
    STORAGE_KEYS.TESTIMONIALS,
    INITIAL_TESTIMONIALS,
  );
  const now = new Date().toISOString();
  const id =
    testimonial.id && isValidUuid(testimonial.id)
      ? testimonial.id
      : testimonial.id || generateUuid();

  let saved: Testimonial;
  const existingIdx = all.findIndex((t) => t.id === id);

  if (existingIdx !== -1) {
    saved = {
      ...all[existingIdx],
      ...testimonial,
      id: all[existingIdx].id || id,
    };
    all[existingIdx] = saved;
  } else {
    saved = {
      id,
      customer_name: testimonial.customer_name,
      company: testimonial.company || "",
      content: testimonial.content,
      image_url: testimonial.image_url || "",
      rating: testimonial.rating ?? 5,
      is_published: testimonial.is_published ?? true,
      created_at: now,
    };
    all.push(saved);
  }

  setLocal(STORAGE_KEYS.TESTIMONIALS, all);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const payload: Record<string, any> = {
        customer_name: saved.customer_name,
        company: saved.company,
        content: saved.content,
        image_url: saved.image_url,
        rating: saved.rating,
        is_published: saved.is_published,
      };
      if (isValidUuid(saved.id)) {
        payload.id = saved.id;
      }
      await supabase.from("testimonials").upsert(payload);
    } catch (e) {
      console.warn("Supabase testimonial save error:", e);
    }
  }
  return saved;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const all = getLocal<Testimonial[]>(
    STORAGE_KEYS.TESTIMONIALS,
    INITIAL_TESTIMONIALS,
  );
  setLocal(
    STORAGE_KEYS.TESTIMONIALS,
    all.filter((t) => t.id !== id),
  );

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      if (isValidUuid(id)) {
        await supabase.from("testimonials").delete().eq("id", id);
      }
    } catch (e) {
      console.warn("Supabase testimonial delete error:", e);
    }
  }
  return true;
}

// ----------------- STORAGE / UPLOAD -----------------
export async function uploadFile(bucket: string, file: File): Promise<string> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);
        return publicUrlData.publicUrl;
      }
    } catch (e) {
      console.warn(`Supabase storage upload failed for bucket ${bucket}:`, e);
    }
  }

  // Fallback to local Data URL for immediate preview and testing
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}

// ----------------- SYNC & SEED TO SUPABASE -----------------
export async function getSupabaseTableStats(): Promise<
  Record<string, number | "error" | "missing">
> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};

  const tables = [
    "products",
    "services",
    "projects",
    "quote_requests",
    "contact_messages",
    "testimonials",
    "site_settings",
  ];
  const stats: Record<string, number | "error" | "missing"> = {};

  await Promise.all(
    tables.map(async (tbl) => {
      try {
        const { count, error } = await supabase
          .from(tbl)
          .select("*", { count: "exact", head: true });
        if (error) {
          if (error.code === "42P01") {
            stats[tbl] = "missing";
          } else {
            stats[tbl] = "error";
          }
        } else {
          stats[tbl] = count ?? 0;
        }
      } catch {
        stats[tbl] = "error";
      }
    }),
  );

  return stats;
}

export async function seedSupabaseDatabase(): Promise<{
  success: boolean;
  message: string;
  seededCount: number;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message:
        "Supabase client is not connected. Please enter your Supabase URL and Anon Key first.",
      seededCount: 0,
    };
  }

  let totalSeeded = 0;
  const errors: string[] = [];

  // 1. Site Settings
  try {
    const settings = getLocal<SiteSettings>(
      STORAGE_KEYS.SETTINGS,
      INITIAL_SITE_SETTINGS,
    );
    const { error: sError } = await supabase
      .from("site_settings")
      .upsert({ id: 1, ...settings });
    if (sError) errors.push(`site_settings: ${sError.message}`);
    else totalSeeded++;
  } catch (e: any) {
    errors.push(`site_settings: ${e.message}`);
  }

  // 2. Products
  try {
    const products = getLocal<Product[]>(
      STORAGE_KEYS.PRODUCTS,
      INITIAL_PRODUCTS,
    );
    const productPayloads = products.map((p) => {
      const payload: Record<string, any> = {
        name: p.name,
        slug: p.slug || generateSlug(p.name, "product"),
        category: p.category,
        short_description: p.short_description,
        description: p.description,
        image_url: p.image_url,
        featured: p.featured,
        is_active: p.is_active,
        sort_order: p.sort_order,
        specifications: p.specifications,
      };
      if (isValidUuid(p.id)) payload.id = p.id;
      return payload;
    });

    const { error: pError } = await supabase
      .from("products")
      .upsert(productPayloads, { onConflict: "slug" });
    if (pError) errors.push(`products: ${pError.message}`);
    else totalSeeded += products.length;
  } catch (e: any) {
    errors.push(`products: ${e.message}`);
  }

  // 3. Services
  try {
    const services = getLocal<Service[]>(
      STORAGE_KEYS.SERVICES,
      INITIAL_SERVICES,
    );
    const servicePayloads = services.map((s) => {
      const payload: Record<string, any> = {
        name: s.name,
        slug: s.slug || generateSlug(s.name, "service"),
        short_description: s.short_description,
        description: s.description,
        image_url: s.image_url,
        featured: s.featured,
        is_active: s.is_active,
        sort_order: s.sort_order,
        deliverables: s.deliverables,
      };
      if (isValidUuid(s.id)) payload.id = s.id;
      return payload;
    });

    const { error: srvError } = await supabase
      .from("services")
      .upsert(servicePayloads, { onConflict: "slug" });
    if (srvError) errors.push(`services: ${srvError.message}`);
    else totalSeeded += services.length;
  } catch (e: any) {
    errors.push(`services: ${e.message}`);
  }

  // 4. Projects
  try {
    const projects = getLocal<Project[]>(
      STORAGE_KEYS.PROJECTS,
      INITIAL_PROJECTS,
    );
    const projectPayloads = projects.map((p) => {
      const payload: Record<string, any> = {
        title: p.title,
        slug: p.slug || generateSlug(p.title, "project"),
        category: p.category,
        location: p.location,
        short_description: p.short_description,
        description: p.description,
        cover_image: p.cover_image,
        featured: p.featured,
        is_published: p.is_published,
        scope: p.scope,
        completion_year: p.completion_year,
      };
      if (isValidUuid(p.id)) payload.id = p.id;
      return payload;
    });

    const { error: prjError } = await supabase
      .from("projects")
      .upsert(projectPayloads, { onConflict: "slug" });
    if (prjError) errors.push(`projects: ${prjError.message}`);
    else totalSeeded += projects.length;
  } catch (e: any) {
    errors.push(`projects: ${e.message}`);
  }

  // 5. Testimonials
  try {
    const testimonials = getLocal<Testimonial[]>(
      STORAGE_KEYS.TESTIMONIALS,
      INITIAL_TESTIMONIALS,
    );
    const testimonialPayloads = testimonials.map((t) => {
      const payload: Record<string, any> = {
        customer_name: t.customer_name,
        company: t.company,
        content: t.content,
        image_url: t.image_url,
        rating: t.rating,
        is_published: t.is_published,
      };
      if (isValidUuid(t.id)) payload.id = t.id;
      return payload;
    });

    const { error: tError } = await supabase
      .from("testimonials")
      .upsert(testimonialPayloads);
    if (tError) errors.push(`testimonials: ${tError.message}`);
    else totalSeeded += testimonials.length;
  } catch (e: any) {
    errors.push(`testimonials: ${e.message}`);
  }

  // 6. Quote Requests (seed if remote table is empty)
  try {
    const quotes = getLocal<QuoteRequest[]>(
      STORAGE_KEYS.QUOTE_REQUESTS,
      INITIAL_QUOTE_REQUESTS,
    );
    const quotePayloads = quotes.map((q) => {
      const payload: Record<string, any> = {
        full_name: q.full_name,
        phone: q.phone,
        email: q.email,
        project_type: q.project_type,
        location: q.location,
        message: q.message,
        project_size: q.project_size,
        preferred_contact_method: q.preferred_contact_method,
        attachment_url: q.attachment_url || null,
        status: q.status,
      };
      if (isValidUuid(q.id)) payload.id = q.id;
      return payload;
    });
    const { error: qError } = await supabase
      .from("quote_requests")
      .upsert(quotePayloads);
    if (!qError) totalSeeded += quotes.length;
  } catch (e: any) {
    // Non-fatal for initial seed
  }

  if (errors.length > 0) {
    return {
      success: false,
      message: `Encountered issues: ${errors.join(", ")}. Please make sure your Supabase schema and RLS policies are applied.`,
      seededCount: totalSeeded,
    };
  }

  return {
    success: true,
    message: `Successfully synchronized and seeded ${totalSeeded} items to your live Supabase database!`,
    seededCount: totalSeeded,
  };
}
