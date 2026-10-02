import  { useState, useEffect } from 'react';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/navbar/Navbar';
import { Footer } from './components/footer/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ContactPage } from './pages/ContactPage';
import { RequestQuotePage } from './pages/RequestQuotePage';
import { AdminPage } from './pages/AdminPage';

export function AppContent() {
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && hash.startsWith('/')) return hash;
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath());

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && hash.startsWith('/')) {
        setCurrentPath(hash);
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    // Support both pushState and hash for deep link reliability
    try {
      window.history.pushState({}, '', path);
    } catch {
      window.location.hash = path;
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matching logic
  const renderRoute = () => {
    const cleanPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';

    if (cleanPath === '/' || cleanPath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (cleanPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (cleanPath === '/products') {
      return <ProductsPage onNavigate={navigate} />;
    }

    if (cleanPath.startsWith('/products/')) {
      const slug = cleanPath.replace('/products/', '');
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (cleanPath === '/services') {
      return <ServicesPage onNavigate={navigate} />;
    }

    if (cleanPath.startsWith('/services/')) {
      const slug = cleanPath.replace('/services/', '');
      return <ServiceDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (cleanPath === '/projects') {
      return <ProjectsPage onNavigate={navigate} />;
    }

    if (cleanPath.startsWith('/projects/')) {
      const slug = cleanPath.replace('/projects/', '');
      return <ProjectDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (cleanPath === '/contact') {
      return <ContactPage />;
    }

    if (cleanPath === '/request-quote') {
      return <RequestQuotePage onNavigate={navigate} />;
    }

    if (cleanPath === '/admin' || cleanPath.startsWith('/admin')) {
      return <AdminPage onNavigate={navigate} />;
    }

    // Default fallback to Homepage
    return <HomePage onNavigate={navigate} />;
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0f12] text-neutral-100 selection:bg-amber-500/30 selection:text-amber-200">
      {!isAdminRoute && (
        <Navbar currentPath={currentPath} onNavigate={navigate} />
      )}

      <main className="flex-1">
        {renderRoute()}
      </main>

      {!isAdminRoute && (
        <>
          <FloatingWhatsApp />
          <Footer onNavigate={navigate} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <SiteProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SiteProvider>
    </LanguageProvider>
  );
}
