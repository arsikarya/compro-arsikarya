import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';

import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ArticlesPage from './pages/ArticlesPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';

// Admin imports
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContentHub from './pages/admin/AdminContentHub';
import AdminHomeEditor from './pages/admin/AdminHomeEditor';
import AdminAboutEditor from './pages/admin/AdminAboutEditor';
import AdminContactEditor from './pages/admin/AdminContactEditor';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectEditor from './pages/admin/AdminProjectEditor';
import AdminServices from './pages/admin/AdminServices';
import AdminServiceEditor from './pages/admin/AdminServiceEditor';
import AdminTeam from './pages/admin/AdminTeam';
import AdminArticles from './pages/admin/AdminArticles';
import AdminArticleEditor from './pages/admin/AdminArticleEditor';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminInquiryDetail from './pages/admin/AdminInquiryDetail';
import AdminMedia from './pages/admin/AdminMedia';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="content" element={<AdminContentHub />} />
          <Route path="content/home" element={<AdminHomeEditor />} />
          <Route path="content/about" element={<AdminAboutEditor />} />
          <Route path="content/contact" element={<AdminContactEditor />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/new" element={<AdminProjectEditor />} />
          <Route path="projects/:id/edit" element={<AdminProjectEditor />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="services/new" element={<AdminServiceEditor />} />
          <Route path="services/:id/edit" element={<AdminServiceEditor />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="articles/new" element={<AdminArticleEditor />} />
          <Route path="articles/:id/edit" element={<AdminArticleEditor />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="inquiries/:id" element={<AdminInquiryDetail />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentang-kami" element={<AboutPage />} />
          <Route path="/layanan" element={<ServicesPage />} />
          <Route path="/layanan/:serviceSlug" element={<ServicesPage />} />
          <Route path="/proyek" element={<ProjectsPage />} />
          <Route path="/proyek/:projectSlug" element={<ProjectsPage />} />
          <Route path="/testimoni" element={<TestimonialsPage />} />
          <Route path="/artikel" element={<ArticlesPage />} />
          <Route path="/artikel/:articleSlug" element={<ArticlesPage />} />
          <Route path="/kontak" element={<ContactPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <MainLayout />
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}
