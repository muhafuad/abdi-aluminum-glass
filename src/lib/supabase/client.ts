import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Retrieve config from env or localStorage
export function getSupabaseCredentials() {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

  const savedUrl =
    typeof window !== "undefined"
      ? (localStorage.getItem("abdi_supabase_url") || "").trim()
      : "";
  const savedKey =
    typeof window !== "undefined"
      ? (localStorage.getItem("abdi_supabase_key") || "").trim()
      : "";

  const url = savedUrl || envUrl;
  const key = savedKey || envKey;

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith("http") &&
    !url.includes("your-project") &&
    !key.includes("your-supabase-anon-key"),
  );

  return {
    url,
    key,
    isConfigured,
    source: savedUrl ? "localStorage" : envUrl ? "env" : "none",
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (e) {
      console.warn("Failed to initialize Supabase client:", e);
      return null;
    }
  }
  return supabaseInstance;
}

export function updateSupabaseCredentials(url: string, key: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("abdi_supabase_url", url.trim());
    localStorage.setItem("abdi_supabase_key", key.trim());
  }
  supabaseInstance = null; // reset client to re-instantiate on next get
  return getSupabaseClient();
}

export function clearSupabaseCredentials() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("abdi_supabase_url");
    localStorage.removeItem("abdi_supabase_key");
  }
  supabaseInstance = null;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  tablesFound?: string[];
  missingTables?: string[];
}

// Real live ping and diagnostics
export async function testSupabaseConnection(
  customUrl?: string,
  customKey?: string,
): Promise<ConnectionTestResult> {
  const { url: defaultUrl, key: defaultKey } = getSupabaseCredentials();
  const url = (customUrl || defaultUrl).trim();
  const key = (customKey || defaultKey).trim();

  if (!url || !key) {
    return {
      success: false,
      message: "Both Supabase URL and Anon Key are required.",
    };
  }

  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    return {
      success: false,
      message: "Supabase URL must start with https://",
    };
  }

  const startTime = Date.now();
  try {
    const testClient = createClient(url, key);

    // Test rest query on site_settings or products
    const { error: settingsError } = await testClient
      .from("site_settings")
      .select("id")
      .limit(1);
    const latencyMs = Date.now() - startTime;

    if (settingsError) {
      // Check if it's an authentication error or missing table error
      if (
        settingsError.code === "PGRST301" ||
        settingsError.message?.toLowerCase().includes("jwt") ||
        settingsError.message?.toLowerCase().includes("apikey")
      ) {
        return {
          success: false,
          message: `Authentication Failed: ${settingsError.message}. Please check your Anon Key.`,
          latencyMs,
        };
      }

      if (
        settingsError.code === "42P01" ||
        settingsError.message?.toLowerCase().includes("relation") ||
        settingsError.message?.toLowerCase().includes("does not exist")
      ) {
        return {
          success: true,
          message: `Connected successfully (${latencyMs}ms), but the database tables have not been created yet. Please execute the SQL schema in Supabase SQL Editor.`,
          latencyMs,
          missingTables: [
            "site_settings",
            "products",
            "services",
            "projects",
            "quote_requests",
            "contact_messages",
          ],
        };
      }

      return {
        success: false,
        message: `Connection Error: ${settingsError.message}`,
        latencyMs,
      };
    }

    // Check key tables
    const expectedTables = [
      "products",
      "services",
      "projects",
      "quote_requests",
      "contact_messages",
      "testimonials",
      "site_settings",
    ];
    const tablesFound: string[] = [];
    const missingTables: string[] = [];

    await Promise.all(
      expectedTables.map(async (table) => {
        const { error } = await testClient.from(table).select("id").limit(1);
        if (!error) {
          tablesFound.push(table);
        } else {
          missingTables.push(table);
        }
      }),
    );

    return {
      success: true,
      message: `Connected to Supabase live database successfully in ${latencyMs}ms!`,
      latencyMs,
      tablesFound,
      missingTables,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to connect to Supabase endpoint.",
    };
  }
}
