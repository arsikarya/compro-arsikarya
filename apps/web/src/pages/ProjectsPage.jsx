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
  const projectsData = getProjectsData(lang);

  const [activeCategory, setActiveCategory] = useState(lang === 'en' ? 'All' : 'Semua');
  const [apiProject, setApiProject] = useState(null);
  const [loading, setLoading] = useState(Boolean(projectSlug));

  useEffect(() => {
    setActiveCategory(lang === 'en' ? 'All' : 'Semua');
  }, [lang]);

  useEffect(() => {
    if (projectSlug) {
      setLoading(true);
      publicApi.getProject(projectSlug)
        .then((data) => {
          if (data) setApiProject(data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [projectSlug]);

  // Single Project Detail View (/proyek/:slug)
  if (projectSlug) {
    const fallbackProject = projectsData.find((p) => p.slug === projectSlug);
    const project = apiProject || fallbackProject;

    if (project) {
      const sameCategory = projectsData.filter((p) => p.id !== project.id && p.category === project.category);
      const otherProjects = projectsData.filter((p) => p.id !== project.id && p.category !== project.category);
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

          {/* Albion Top Cover Image (Full Width Banner) */}
          <div style={{ width: '100%', marginTop: '80px', overflow: 'hidden' }}>
            <img 
              src={coverImg} 
              alt={project.title} 
              style={{
                width: '100%',
                maxHeight: '520px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>

          <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)', paddingTop: '48px' }}>
            <div className="container" style={{ maxWidth: '980px' }}>
              
              {/* Top Back Navigation */}
              <Link 
                to="/proyek" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '24px', 
                  color: 'var(--color-primary-300)', 
                  fontWeight: 700, 
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}
              >
                {t.projectDetail?.backBtn || '← Kembali ke Proyek'}
              </Link>

              {/* Title Header */}
              <div style={{ marginBottom: '32px' }}>
                <h1 
                  style={{ 
                    fontSize: 'clamp(2.1rem, 3.8vw, 3.0rem)', 
                    fontWeight: 800, 
                    color: 'var(--color-neutral-700)', 
                    lineHeight: 1.28, 
                    marginTop: '8px',
                    letterSpacing: '-0.02em' 
                  }}
                >
                  {project.title}
                </h1>
              </div>

              {/* Project Specification Metadata Panel */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '24px', 
                  backgroundColor: 'var(--color-neutral-50)', 
                  padding: '28px 32px', 
                  borderRadius: 'var(--radius-card)', 
                  border: '1px solid var(--color-neutral-200)',
                  marginBottom: '48px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{t.projectDetail?.category || 'Jenis Proyek'}</span>
                  <div style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--color-neutral-700)', marginTop: '4px' }}>{project.category || '-'}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{t.projectDetail?.location || 'Lokasi'}</span>
                  <div style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--color-neutral-700)', marginTop: '4px' }}>{project.location || '-'}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{t.projectDetail?.year || 'Tahun'}</span>
                  <div style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--color-neutral-700)', marginTop: '4px' }}>{project.year || '-'}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{lang === 'en' ? 'Client / Project Owner' : 'Pemberi Kerja / Klien'}</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-neutral-700)', marginTop: '4px' }}>
                    {project.clientContext || project.companyListed || project.company || 'Arsi Karya'}
                  </div>
                </div>

                {(project.arsiKaryaRole || project.roleDisclosure) && (
                  <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--color-neutral-200)', paddingTop: '16px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-300)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>{t.projectDetail?.company || 'Peran Resmi Arsi Karya'}</span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-neutral-700)', marginTop: '4px' }}>
                      {project.arsiKaryaRole || project.roleDisclosure}
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
  const categories = lang === 'en' 
    ? ['All', 'Design & Build', 'Facade & Exterior', 'Finishing & Interior', 'Construction & Maintenance', 'Infrastructure']
    : ['Semua', 'Design & Build', 'Fasad & Eksterior', 'Finishing & Interior', 'Konstruksi & Maintenance', 'Infrastruktur'];

  const filteredProjects = (activeCategory === 'Semua' || activeCategory === 'All')
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory || (lang === 'en' && p.categoryEn === activeCategory));

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

      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)' }}>
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
          <div className="albion-projects-grid">
            {filteredProjects.map((proj) => (
              <ProjectCard key={proj.id} proj={proj} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
