import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SEOHead from '../components/ui/SEOHead';
import HeroBanner from '../components/ui/HeroBanner';
import ProjectCard, { ProjectGridStyles as AlbionGridStyles } from '../components/ui/ProjectCard';
import ProjectLightboxModal from '../components/ui/ProjectLightboxModal';
import CTA from '../components/CTA';
import { getProjectsData } from '../data/projectsData';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectsPage() {
  const { projectSlug } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const staticProjects = getProjectsData(lang);

  const [activeCategory, setActiveCategory] = useState(lang === 'en' ? 'All' : 'Semua');
  const [apiProjectsList, setApiProjectsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    setActiveCategory(lang === 'en' ? 'All' : 'Semua');
  }, [lang]);

  // Fetch active services to dynamically build category filter tabs
  useEffect(() => {
    publicApi.getServices()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServicesList(data);
        }
      })
      .catch((err) => console.error('Gagal memuat layanan:', err));
  }, []);

  // Fetch list of projects from DB
  useEffect(() => {
    setListLoading(true);
    publicApi.getProjects()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            title: lang === 'en' ? (item.titleEn || item.title) : item.title,
            slug: item.slug,
            category: item.category || 'Design & Build',
            categoryEn: item.categoryEn || item.category,
            location: item.location,
            client: item.clientName || item.client,
            year: item.year,
            thumbnail: item.coverImageUrl || item.thumbnail || '/projects/project_1.jpg',
            coverImageUrl: item.coverImageUrl || item.thumbnail || '/projects/project_1.jpg',
            description: lang === 'en' ? (item.descriptionEn || item.description) : item.description,
            scope: item.scope,
            process: item.process,
            features: item.features || [],
            gallery: item.gallery || [],
          }));
          setApiProjectsList(mapped);
        } else {
          setApiProjectsList(staticProjects);
        }
      })
      .catch(() => {
        setApiProjectsList(staticProjects);
      })
      .finally(() => setListLoading(false));
  }, [lang]);

  // Open modal if projectSlug in URL
  useEffect(() => {
    if (projectSlug) {
      const list = apiProjectsList.length > 0 ? apiProjectsList : staticProjects;
      const found = list.find((p) => p.slug === projectSlug || String(p.id) === String(projectSlug));
      if (found) {
        setSelectedProject(found);
      } else {
        publicApi.getProject(projectSlug)
          .then((data) => {
            if (data) setSelectedProject(data);
          })
          .catch(() => {});
      }
    }
  }, [projectSlug, apiProjectsList]);

  const handleCloseModal = () => {
    setSelectedProject(null);
    if (projectSlug) {
      navigate('/proyek', { replace: true });
    }
  };

  // Dynamic categories derived from services
  const defaultServices = [
    { title: 'Perencanaan', titleEn: 'Planning & Design' },
    { title: 'Konstruksi', titleEn: 'Construction' },
    { title: 'Design & Build', titleEn: 'Design & Build' },
    { title: 'Renovasi', titleEn: 'Renovation' }
  ];

  const activeServices = servicesList.length > 0 ? servicesList : defaultServices;

  const categories = [
    lang === 'en' ? 'All' : 'Semua',
    ...activeServices.map(s => (lang === 'en' ? (s.titleEn || s.title) : s.title))
  ];

  const filteredProjects = (activeCategory === 'Semua' || activeCategory === 'All')
    ? apiProjectsList
    : apiProjectsList.filter((p) => {
        const cat = (p.category || '').toLowerCase().trim();
        const active = activeCategory.toLowerCase().trim();
        const matchingSvc = activeServices.find(s => 
          (s.title && s.title.toLowerCase().trim() === active) ||
          (s.titleEn && s.titleEn.toLowerCase().trim() === active)
        );
        if (matchingSvc) {
          return cat === matchingSvc.title.toLowerCase().trim() || 
                 (matchingSvc.titleEn && cat === matchingSvc.titleEn.toLowerCase().trim());
        }
        return cat === active;
      });

  return (
    <>
      <SEOHead
        title={lang === 'en' ? "Verified Project Portfolio — Arsi Karya" : "Portofolio Bangun Rumah & Konstruksi — Arsi Karya Bandung & Bali"}
        description={lang === 'en' ? "Arsi Karya track record of residential houses, luxury villas, facade, interior, and construction projects in Bandung and Bali." : "Daftar rekam jejak pekerjaan proyek bangun rumah hunian, villa mewah, fasad, interior, dan konstruksi Arsi Karya di Bandung dan Bali."}
        keywords="portofolio bangun rumah bandung, portofolio kontraktor bali, proyek rumah mewah bandung, kontraktor arsi karya"
      />
      <AlbionGridStyles />

      <HeroBanner
        bgImage="/projects/project_1.jpg"
        overlayOpacity={0.65}
        tag={t.projectsPage?.heroTag || "PORTOFOLIO PROYEK"}
        title={t.projectsPage?.heroTitle || "Rekam Jejak Pekerjaan"}
        subtitle={t.projectsPage?.heroSubtitle || "Pengalaman proyek nyata dengan keterbukaan entitas pelaksana dan penanganan mutu profesional."}
      />

      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)', minHeight: '400px' }}>
        <div className="container">
          {/* Albion Projects Grid */}
          {listLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid var(--color-primary-300)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div className="albion-projects-grid">
              {apiProjectsList.map((proj) => (
                <ProjectCard key={proj.id} proj={proj} onClick={(p) => setSelectedProject(p)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTA />

      {selectedProject && (
        <ProjectLightboxModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
