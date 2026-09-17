import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import SectionTag from '../components/ui/SectionTag';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Gallery from '../components/ui/Gallery';
import HeroBanner from '../components/ui/HeroBanner';
import ProjectCard, { ProjectGridStyles as AlbionGridStyles } from '../components/ui/ProjectCard';
import CTA from '../components/CTA';
import { getProjectsData } from '../data/projectsData';
import { getProjectWaUrl } from '../utils/whatsapp';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectsPage() {
  const { projectSlug } = useParams();
  const { lang, t } = useLanguage();
  const staticProjects = getProjectsData(lang);

  const [activeCategory, setActiveCategory] = useState(lang === 'en' ? 'All' : 'Semua');
  const [apiProject, setApiProject] = useState(null);
  const [apiProjectsList, setApiProjectsList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(Boolean(projectSlug));

  useEffect(() => {
    setActiveCategory(lang === 'en' ? 'All' : 'Semua');
  }, [lang]);

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

  // Fetch single project detail if projectSlug is present
  useEffect(() => {
    if (projectSlug) {
      setDetailLoading(true);
      publicApi.getProject(projectSlug)
        .then((data) => {
          if (data) setApiProject(data);
        })
        .catch(() => {})
        .finally(() => setDetailLoading(false));
    }
  }, [projectSlug, lang]);

  // Single Project Detail View (/proyek/:slug)
  if (projectSlug) {
    const fallbackProject = staticProjects.find((p) => p.slug === projectSlug);
    const project = apiProject || fallbackProject;

    if (detailLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid var(--color-primary-300)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    if (project) {
      const sameCategory = apiProjectsList.filter((p) => p.id !== project.id && p.category === project.category);
      const otherProjects = apiProjectsList.filter((p) => p.id !== project.id && p.category !== project.category);
      const relatedProjects = [...sameCategory, ...otherProjects].slice(0, 3);

      const coverImg = project.coverImageUrl || project.thumbnail || '/projects/project_1.jpg';
      const galleryList = Array.isArray(project.gallery) && project.gallery.length > 0 
        ? project.gallery.map(g => typeof g === 'string' ? g : g.url) 
        : [coverImg];

      const renderRichTextContent = () => {
        const raw = project.description || '';
        const isHtml = /<[a-z][\s\S]*>/i.test(raw);

        if (isHtml) {
          return <div className="rich-text-block w-richtext" dangerouslySetInnerHTML={{ __html: raw }} />;
        }

        return (
          <div className="rich-text-block w-richtext">
            <p>{raw}</p>
            {project.scope && (
              <>
                <h3>{lang === 'en' ? 'Technical Scope & Specifications' : 'Ruang Lingkup Teknis & Spesifikasi'}</h3>
                <p>{project.scope}</p>
              </>
            )}
            {project.process && (
              <>
                <h3>{lang === 'en' ? 'Execution Methodology & Work Stages' : 'Metodologi Eksekusi & Tahapan Pengerjaan'}</h3>
                <p>{project.process}</p>
              </>
            )}
            {project.features && project.features.length > 0 && (
              <>
                <h3>{t.projectDetail?.features || (lang === 'en' ? 'Key Advantages & Work Features' : 'Keunggulan & Fitur Utama Pekerjaan')}</h3>
                <ul role="list">
                  {project.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        );
      };

      return (
        <>
          <SEOHead
            title={`${project.title} — Arsi Karya`}
            description={project.seoDescription || project.description}
          />
          <AlbionGridStyles />

          <HeroBanner
            bgImage={coverImg}
            overlayOpacity={0.65}
            imageAlt={project.title}
            tag={project.category}
            title={project.title}
            subtitle={project.client ? `${t.projectDetail?.clientLabel || 'Klien'}: ${project.client} • ${project.year || ''}` : ''}
          />

          <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)', paddingTop: '48px' }}>
            <div className="container" style={{ maxWidth: '880px' }}>
              
              {/* Back Navigation Link */}
              <Link 
                to="/proyek" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '28px', 
                  color: 'var(--color-primary-300)', 
                  fontWeight: 700, 
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}
              >
                {t.projectDetail?.backBtn || '← Kembali ke Portofolio'}
              </Link>

              {/* Project Meta Cards Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {project.category && (
                  <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                      {t.projectDetail?.categoryLabel || 'Kategori Pekerjaan'}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-neutral-800)' }}>
                      {project.category}
                    </div>
                  </div>
                )}
                {project.client && (
                  <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                      {t.projectDetail?.clientLabel || 'Klien Proyek'}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-neutral-800)' }}>
                      {project.client}
                    </div>
                  </div>
                )}
                {project.location && (
                  <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                      {t.projectDetail?.locationLabel || 'Lokasi Pekerjaan'}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-neutral-800)' }}>
                      {project.location}
                    </div>
                  </div>
                )}
              </div>

              {/* Rich Text Editorial Block */}
              {renderRichTextContent()}

              {/* Gallery Component */}
              {galleryList.length > 0 && (
                <div style={{ marginTop: '48px', marginBottom: '60px' }}>
                  <Gallery images={galleryList} title={lang === 'en' ? 'Visual Documentation & Site Photos' : 'Dokumentasi Visual & Foto Lapangan'} />
                </div>
              )}

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div style={{ marginTop: '64px', borderTop: '1px solid var(--color-neutral-200)', paddingTop: '48px' }}>
                  <AlbionGridStyles />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-neutral-800)', margin: 0 }}>
                      {lang === 'en' ? 'Related Projects' : 'Proyek Terkait'}
                    </h2>
                    <Link
                      to="/proyek"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--color-primary-300)',
                        backgroundColor: 'transparent',
                        border: '1.5px solid var(--color-primary-300)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'none',
                      }}
                    >
                      <span>{lang === 'en' ? 'More Projects' : 'Proyek Lainnya'}</span>
                      <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
                    </Link>
                  </div>
                  <div className={`albion-projects-grid ${relatedProjects.slice(0, 2).length === 2 ? 'cols-2' : ''}`}>
                    {relatedProjects.slice(0, 2).map((rp) => (
                      <ProjectCard key={rp.id} proj={rp} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* Albion CTA Banner Section at bottom */}
          <CTA />
        </>
      );
    }
  }

  // Filter Categories Overview (/proyek)
  const staticCategories = lang === 'en' 
    ? ['All', 'Design & Build', 'Facade & Exterior', 'Finishing & Interior', 'Construction & Maintenance', 'Infrastructure']
    : ['Semua', 'Design & Build', 'Fasad & Eksterior', 'Finishing & Interior', 'Konstruksi & Maintenance', 'Infrastruktur'];

  const dynamicCategories = Array.from(new Set(apiProjectsList.map((p) => p.category))).filter(Boolean);
  const categories = Array.from(new Set([lang === 'en' ? 'All' : 'Semua', ...staticCategories.slice(1), ...dynamicCategories]));

  const filteredProjects = (activeCategory === 'Semua' || activeCategory === 'All')
    ? apiProjectsList
    : apiProjectsList.filter((p) => p.category === activeCategory || (lang === 'en' && p.categoryEn === activeCategory));

  return (
    <>
      <SEOHead
        title={lang === 'en' ? "Verified Project Portfolio — Arsi Karya" : "Portofolio Proyek Terverifikasi — Arsi Karya"}
        description={lang === 'en' ? "Arsi Karya track record of construction, ACP facade, residential houses, interior, and road paving projects." : "Daftar rekam jejak pekerjaan proyek Arsi Karya di bidang konstruksi, fasad ACP, rumah hunian, interior, dan pengaspalan jalan."}
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
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '52px' }}>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeCategory === cat ? '1px solid var(--color-primary-300)' : '1px solid var(--color-neutral-200)',
                  backgroundColor: activeCategory === cat ? 'var(--color-primary-300)' : 'transparent',
                  color: activeCategory === cat ? '#ffffff' : 'var(--color-neutral-600)',
                  transition: 'all 0.25s ease',
                  boxShadow: activeCategory === cat ? '0 4px 14px rgba(0, 86, 151, 0.2)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Albion 3-Column Projects Grid */}
          {listLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid var(--color-primary-300)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div className="albion-projects-grid">
              {filteredProjects.map((proj) => (
                <ProjectCard key={proj.id} proj={proj} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
