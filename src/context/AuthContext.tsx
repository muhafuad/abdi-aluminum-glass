import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase/client';
import type { AdminUser } from '../lib/types/database';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isSupabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN: AdminUser = {
  id: 'admin_demo_id',
  email: 'admin@abdi-aluminum.com',
  full_name: 'Abdi General Manager',
  role: 'superadmin',
  created_at: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    setIsSupabaseConfigured(Boolean(supabase));

    if (supabase) {
      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Admin',
            role: 'admin',
            created_at: session.user.created_at
          });
        } else {
          // Check local admin token
          const localAdmin = localStorage.getItem('abdi_admin_session');
          if (localAdmin) {
            try {
              setUser(JSON.parse(localAdmin));
            } catch {
              localStorage.removeItem('abdi_admin_session');
            }
          }
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Admin',
            role: 'admin',
            created_at: session.user.created_at
          });
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Offline / Local admin session check
      const localAdmin = localStorage.getItem('abdi_admin_session');
      if (localAdmin) {
        try {
          setUser(JSON.parse(localAdmin));
        } catch {
          localStorage.removeItem('abdi_admin_session');
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    const supabase = getSupabaseClient();
    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          // If Supabase authentication fails, return error
          return { success: false, error: error.message };
        }
        if (data.user) {
          const authedAdmin: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || 'Administrator',
            role: 'admin',
            created_at: data.user.created_at
          };
          setUser(authedAdmin);
          localStorage.setItem('abdi_admin_session', JSON.stringify(authedAdmin));
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Authentication error' };
      }
    }

    // Default admin validation or password checking for local/demo mode
    if (email) {
      const demoUser: AdminUser = {
        ...DEMO_ADMIN,
        email: email || DEMO_ADMIN.email
      };
      setUser(demoUser);
      localStorage.setItem('abdi_admin_session', JSON.stringify(demoUser));
      return { success: true };
    }

    return { success: false, error: 'Email is required' };
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    localStorage.removeItem('abdi_admin_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
