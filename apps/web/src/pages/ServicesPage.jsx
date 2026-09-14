import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FaBuilding, 
  FaDraftingCompass, 
  FaTools, 
  FaShieldAlt, 
  FaTree,
  FaWhatsapp 
} from 'react-icons/fa';
import { FiArrowRight, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import SectionTag from '../components/ui/SectionTag';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import FAQ from '../components/ui/FAQ';
import HeroBanner from '../components/ui/HeroBanner';
import ProjectCard, { ProjectGridStyles } from '../components/ui/ProjectCard';
import CTA from '../components/CTA';
import { getServicesData, getSeoLandingServices } from '../data/servicesData';
import { getProjectsData } from '../data/projectsData';
import { getServiceWaUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

const serviceImagesMap = {
  'perencanaan': '/projects/project_3.jpg',
  'konstruksi': '/projects/project_1.jpg',
  'design-build': '/projects/project_2.jpg',
  'renovasi': '/projects/project_4.jpg',
  'landscape': '/projects/project_5.jpg',
};

const iconMap = {
  'perencanaan': <FaDraftingCompass />,
  'konstruksi': <FaBuilding />,
  'design-build': <FaShieldAlt />,
  'renovasi': <FaTools />,
  'landscape': <FaTree />,
};

export default function ServicesPage() {
  const { serviceSlug } = useParams();
  const { lang, t } = useLanguage();

  const servicesData = getServicesData(lang);
  const seoLandingServices = getSeoLandingServices(lang);
  const projectsData = getProjectsData(lang);
  const allServices = [...servicesData, ...seoLandingServices];

  // Single Service Detail Page (/layanan/:serviceSlug)
  if (serviceSlug) {
    const service = allServices.find((s) => s.slug === serviceSlug);

    if (service) {
      const matchProjects = projectsData.filter((p) =>
        p.category.toLowerCase().includes(service.title.split(' ')[0].toLowerCase()) ||
        p.title.toLowerCase().includes(service.slug.split('-')[0])
      );
      const otherProjects = projectsData.filter((p) => !matchProjects.some((m) => m.id === p.id));
      const relatedProjects = [...matchProjects, ...otherProjects].slice(0, 3);

      const defaultFaqs = lang === 'en' ? [
        {
          question: "How do we initiate a consultation?",
          answer: "You can reach us via WhatsApp or submit a cooperation request. Our team will schedule an initial site survey and prepare an indicative budget."
        },
        {
          question: "How is the estimated work cost determined?",
          answer: service.pricingNotice || "Cost depends on scope of work, material specs, location, and site conditions."
        },
        {
          question: "Is there a warranty for the completed work?",
          answer: "Yes, every handover is accompanied by an official maintenance retention warranty from Arsi Karya."
        }
      ] : [
        {
          question: "Bagaimana alur awal pengajuan konsultasi?",
          answer: "Anda dapat menghubungi kami via WhatsApp atau pengajuan kerja sama. Tim kami akan melakukan penjadwalan survey lokasi awal dan pembuatan indikatif RAB."
        },
        {
          question: "Bagaimana penentuan perkiraan biaya pekerjaan?",
          answer: service.pricingNotice || "Biaya bergantung pada lingkup pekerjaan, spesifikasi material, lokasi, dan kondisi proyek."
        },
        {
          question: "Apakah ada garansi hasil pekerjaan?",
          answer: "Ya, setiap serah terima pekerjaan dilengkapi dengan masa retensi garansi pemeliharaan resmi dari Arsi Karya."
        }
      ];

      const faqsList = service.faqs && service.faqs.length > 0 ? service.faqs : defaultFaqs;
      const serviceWaUrl = getServiceWaUrl(service.title);

      return (
        <>
          <SEOHead
            title={`${service.title} — Arsi Karya`}
            description={service.shortDesc || service.fullDesc}
          />

          {/* Dark Architectural Hero Banner */}
          <HeroBanner
            bgImage={serviceImagesMap[service.slug] || '/projects/project_1.jpg'}
            overlayOpacity={0.65}
            imageAlt={service.title}
            tag={lang === 'en' ? "SERVICE DETAILS" : "DETAIL LAYANAN"}
            title={service.title}
            subtitle={service.shortDesc}
          />

          <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)', paddingTop: '48px' }}>
            <div className="container">
              
              {/* Template-Block Two-Column Layout */}
              <div className="service-detail-grid">
                
                {/* Left Column: Sticky Navigation & Action Sidebar */}
                <div>
                  <div className="service-sidebar-sticky">
                    
                    {/* Card 1: Direct WhatsApp Consultation CTA */}
                    <div 
                      style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '32px 28px', 
                        borderRadius: '14px', 
                        border: '1px solid var(--color-neutral-200)', 
                        boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                        marginBottom: '28px'
                      }}
                    >
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-neutral-800)', marginBottom: '8px' }}>
                        {lang === 'en' ? 'Service Consultation' : 'Konsultasi Layanan'}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-500)', lineHeight: 1.6, marginBottom: '24px' }}>
                        {lang === 'en' ? 'Discuss your project needs directly with Arsi Karya technical team.' : 'Diskusikan kebutuhan proyek Anda langsung dengan tim teknis Arsi Karya.'}
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button
                          href={serviceWaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="whatsapp"
                          style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', borderRadius: '8px' }}
                        >
                          {lang === 'en' ? 'Chat Via WhatsApp' : 'Chat Via WhatsApp'}
                        </Button>
                      </div>
                    </div>

                    {/* Card 2: Quick Service Directory Navigation */}
                    <div 
                      style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '28px', 
                        borderRadius: '14px', 
                        border: '1px solid var(--color-neutral-200)' 
                      }}
                    >
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-neutral-800)', marginBottom: '20px' }}>
                        {lang === 'en' ? 'Services List' : 'Daftar Layanan'}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {servicesData.map((s) => {
                          const isActive = s.slug === service.slug;
                          return (
                            <Link
                              key={s.slug}
                              to={`/layanan/${s.slug}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: isActive ? 700 : 600,
                                textDecoration: 'none',
                                backgroundColor: isActive ? 'var(--color-primary-300)' : 'transparent',
                                color: isActive ? '#ffffff' : 'var(--color-neutral-700)',
                                border: isActive ? '1px solid var(--color-primary-300)' : '1px solid var(--color-neutral-200)',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <span>{s.title.split('(')[0]}</span>
                              <FiChevronRight style={{ opacity: isActive ? 1 : 0.4 }} />
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Column: Main Detailed Content */}
                <div style={{ minWidth: 0 }}>
                  
                  {/* Top Back Navigation */}
                  <Link 
                    to="/layanan" 
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
                    {lang === 'en' ? '← Back to Services' : '← Kembali ke Layanan'}
                  </Link>

                  {/* Service Overview & Detailed Description */}
                  <div style={{ marginBottom: '44px' }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--color-neutral-800)', marginTop: '8px' }}>
                      {lang === 'en' ? 'Service Characteristics & Approach' : 'Karakteristik & Penanganan Pekerjaan'}
                    </h2>
                  </div>

                  {/* Customer Need / Problem Callout Box */}
                  {service.problemStatement && (
                    <div 
                      style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '32px', 
                        borderRadius: '12px', 
                        marginBottom: '44px', 
                        border: '1px solid var(--color-neutral-200)',
                        borderLeft: '4px solid var(--color-primary-300)' 
                      }}
                    >
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-400)', marginBottom: '8px', fontWeight: 800 }}>
                        {lang === 'en' ? 'Field Problem Solution' : 'Solusi Atas Masalah Lapangan'}
                      </h3>
                      <p style={{ fontSize: '0.975rem', color: 'var(--color-neutral-700)', lineHeight: 1.65, margin: 0 }}>
                        {service.problemStatement}
                      </p>
                    </div>
                  )}

                  {/* Scope of Service Deliverables */}
                  {service.scopeList && service.scopeList.length > 0 && (
                    <div style={{ marginBottom: '48px' }}>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>
                        {t.servicesPage?.scopeTitle || 'Lingkup Deliverables Layanan'}
                      </h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                        {service.scopeList.map((sc, idx) => (
                          <div
                            key={idx}
                            style={{
                              backgroundColor: '#f5f5f5',
                              padding: '18px 20px',
                              borderRadius: '10px',
                              border: '1px solid var(--color-neutral-200)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                            }}
                          >
                            <FiCheckCircle style={{ color: 'var(--color-primary-300)', fontSize: '1.25rem', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--color-neutral-800)' }}>
                              {sc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Target Audience / Suitability */}
                  {service.targetAudience && (
                    <div 
                      style={{ 
                        marginBottom: '48px', 
                        backgroundColor: '#f5f5f5', 
                        padding: '32px', 
                        borderRadius: '12px', 
                        border: '1px solid var(--color-neutral-200)' 
                      }}
                    >
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', fontWeight: 800 }}>{lang === 'en' ? 'Target Client' : 'Peruntukan Klien'}</h3>
                      <p style={{ fontSize: '0.95rem', color: 'var(--color-neutral-600)', lineHeight: 1.65, margin: 0 }}>
                        {service.targetAudience}
                      </p>
                    </div>
                  )}

                  {/* Process Timeline (4 Numbered Steps) */}
                  {service.processSteps && (
                    <div style={{ marginBottom: '48px' }}>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>
                        {t.servicesPage?.processTitle || 'Metodologi & Tahapan Pelaksanaan'}
                      </h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        {service.processSteps.map((st, idx) => (
                          <div
                            key={idx}
                            style={{
                              backgroundColor: '#f5f5f5',
                              padding: '24px',
                              borderRadius: '12px',
                              border: '1px solid var(--color-neutral-200)',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                              position: 'relative',
                            }}
                          >
                            <div 
                              style={{ 
                                fontSize: '1.6rem', 
                                fontWeight: 800, 
                                color: 'var(--color-primary-300)', 
                                marginBottom: '12px',
                                fontFamily: 'var(--font-heading)',
                              }}
                            >
                              0{idx + 1}
                            </div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-neutral-800)', marginBottom: '8px' }}>
                              {st.title.replace(/^\d+\.\s*/, '')}
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)', lineHeight: 1.55, margin: 0 }}>
                              {st.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Methods & Verified Materials */}
                  {service.methodsMaterials && (
                    <div style={{ marginBottom: '48px' }}>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px' }}>
                        {t.servicesPage?.materialsTitle || 'Metode Kerja & Material Verified'}
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {service.methodsMaterials.map((mm, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '12px', 
                              padding: '14px 20px', 
                              backgroundColor: '#f5f5f5', 
                              borderRadius: '8px', 
                              border: '1px solid var(--color-neutral-200)',
                              fontSize: '0.925rem',
                              fontWeight: 600,
                              color: 'var(--color-neutral-700)',
                            }}
                          >
                            <FiCheckCircle style={{ color: 'var(--color-primary-300)', flexShrink: 0 }} />
                            <span>{mm}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Notice */}
                  <div 
                    style={{ 
                      backgroundColor: 'var(--color-primary-100)', 
                      padding: '24px 28px', 
                      borderRadius: '12px', 
                      marginBottom: '48px', 
                      border: 'none' 
                    }}
                  >
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-400)' }}>{t.servicesPage?.noticeTitle || 'Catatan Anggaran Biaya:'}</strong>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-700)', margin: '4px 0 0 0' }}>
                      {service.pricingNotice || "Biaya bergantung pada lingkup pekerjaan, spesifikasi material, lokasi, dan kondisi proyek."}
                    </p>
                  </div>

                  {/* FAQ Accordion */}
                  <div style={{ marginBottom: '48px' }}>
                    <h2 style={{ marginBottom: '24px', fontSize: '1.8rem', fontWeight: 800 }}>{t.servicesPage?.faqTitle || 'Pertanyaan Sering Diajukan (FAQ)'}</h2>
                    <FAQ items={faqsList} />
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <section className="section-padding" style={{ backgroundColor: '#f5f5f5', borderTop: '1px solid var(--color-neutral-200)' }}>
              <div className="container">
                <ProjectGridStyles />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-neutral-800)', margin: 0 }}>{lang === 'en' ? 'Related Projects' : 'Proyek Terkait'}</h2>
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
                <div className="albion-projects-grid">
                  {relatedProjects.slice(0, 3).map((rp) => (
                    <ProjectCard key={rp.id} proj={rp} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Bottom Albion CTA */}
          <CTA />

          <style>{`
            .service-detail-grid {
              display: grid;
              grid-template-columns: 340px minmax(0, 1fr);
              gap: 48px;
            }

            @media (max-width: 991px) {
              .service-detail-grid {
                grid-template-columns: 1fr;
                gap: 40px;
              }
            }

            .service-sidebar-sticky {
              position: static;
            }
          `}</style>
        </>
      );
    }
  }

  // Overview Services Directory Page (/layanan)
  return (
    <>
      <SEOHead
        title={lang === 'en' ? "Construction & Design-Build Services — Arsi Karya" : "Layanan Jasa Konstruksi & Design-Build — Arsi Karya"}
        description={lang === 'en' ? "Arsi Karya integrated services: Planning, Construction, Design & Build, Renovation, and Landscape in Bandung, Java — Bali." : "Layanan terpadu Arsi Karya: Perencanaan, Konstruksi, Design & Build, Renovasi, dan Landscape di Bandung, Jawa — Bali."}
      />

      <HeroBanner
        bgImage="/projects/project_2.jpg"
        overlayOpacity={0.65}
        tag={t.servicesPage?.heroTag || "LAYANAN KAMI"}
        title={t.servicesPage?.heroTitle || "Layanan Konstruksi & Perancangan"}
        subtitle={t.servicesPage?.heroSubtitle || "Solusi Terpadu dari Konsep Arsitektur Hingga Realisasi Pembangunan Fisik"}
      />

      {/* 5 Core Primary Services */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px auto' }}>
            <SectionTag>{lang === 'en' ? 'MAIN SERVICES' : 'LAYANAN UTAMA'}</SectionTag>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'var(--color-neutral-800)' }}>
              {lang === 'en' ? 'Integrated Construction & Architectural Solutions' : 'Solusi Konstruksi & Perancangan Terintegrasi'}
            </h2>
            <p style={{ color: 'var(--color-neutral-500)', marginTop: '12px', fontSize: '1rem', lineHeight: 1.65 }}>
              {lang === 'en' ? 'We combine technical engineering design expertise with structured physical execution to bring your projects to life in Bandung, Java — Bali.' : 'Kami memadukan keahlian perancangan teknis dengan eksekusi fisik terstruktur untuk mewujudkan proyek Anda di Bandung, Jawa — Bali.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {servicesData.map((svc) => (
              <Link
                key={svc.id}
                to={`/layanan/${svc.slug}`}
                className="buildscape-service-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div>
                  {/* Icon Badge Container */}
                  <div className="buildscape-icon-badge">
                    {iconMap[svc.slug] || <FaBuilding />}
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-body)', color: 'var(--color-neutral-800)', marginBottom: '12px', marginTop: '20px' }}>
                    {svc.title}
                  </h3>
                  
                  <p style={{ fontSize: '0.95rem', color: 'var(--color-neutral-500)', lineHeight: 1.65, marginBottom: '24px' }}>
                    {svc.shortDesc || svc.fullDesc.substring(0, 110) + '...'}
                  </p>

                  {/* Key Scope Highlights */}
                  {svc.scopeList && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                      {svc.scopeList.slice(0, 3).map((sc, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--color-neutral-700)', fontWeight: 600 }}>
                          <FiCheckCircle style={{ color: 'var(--color-primary-300)', flexShrink: 0 }} />
                          <span>{sc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="buildscape-card-action">
                  <span>{lang === 'en' ? 'View Service Details' : 'Lihat Detail Layanan'}</span>
                  <FiArrowRight className="buildscape-action-arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized SEO Sub-Landing Services */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-50)', borderTop: '1px solid var(--color-neutral-200)' }}>
        <div className="container">
          
          <div style={{ marginBottom: '44px' }}>
            <SectionTag>{lang === 'en' ? 'OTHER SPECIALTIES' : 'SPESIALISASI LAINNYA'}</SectionTag>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--color-neutral-800)' }}>
              {lang === 'en' ? 'Specific Work & Sub-Specializations' : 'Pekerjaan Spesifik & Sub-Spesialisasi'}
            </h2>
            <p style={{ color: 'var(--color-neutral-500)', marginTop: '8px', fontSize: '0.975rem' }}>
              {lang === 'en' ? 'Handling specialized tasks with technical expertise and maintenance warranty.' : 'Penanganan pekerjaan khusus dengan keahlian teknis dan jaminan garansi.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {seoLandingServices.map((s, idx) => (
              <Link
                key={idx}
                to={`/layanan/${s.slug}`}
                className="subservice-card-link"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                  <div className="subservice-icon-badge">
                    {iconMap[s.slug] || <FaTools />}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-body)', color: 'var(--color-neutral-800)', margin: 0, lineHeight: 1.3 }}>
                    {lang === 'en' ? (s.titleEn || s.title) : s.title}
                  </h3>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  {lang === 'en' ? (s.shortDescEn || s.shortDesc) : s.shortDesc}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-neutral-200)', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-300)', fontWeight: 700 }}>
                    {lang === 'en' ? 'Specification Details' : 'Detail Spesifikasi'}
                  </span>
                  <FiArrowRight style={{ color: 'var(--color-neutral-700)', fontSize: '1.1rem' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <style>{`
          .buildscape-service-card {
            background-color: #f5f5f5;
            padding: 36px 30px;
            border-radius: 14px;
            border: 1px solid var(--color-neutral-200);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
          }

          .buildscape-service-card:hover {
            transform: translateY(-5px);
            border-color: var(--color-primary-300);
            box-shadow: 0 12px 36px rgba(0,0,0,0.06);
          }

          .buildscape-icon-badge {
            width: 58px;
            height: 58px;
            border-radius: 12px;
            background-color: var(--color-primary-100);
            color: var(--color-primary-300);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          .buildscape-service-card:hover .buildscape-icon-badge {
            background-color: var(--color-primary-300);
            color: #ffffff;
          }

          .buildscape-card-action {
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 14px 20px;
            background-color: transparent;
            border: 1px solid var(--color-neutral-200);
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--color-neutral-700);
            transition: all 0.25s ease;
          }

          .buildscape-service-card:hover .buildscape-card-action {
            background-color: var(--color-primary-300);
            border-color: var(--color-primary-300);
            color: #ffffff;
          }

          .buildscape-action-arrow {
            font-size: 1.1rem;
            transition: transform 0.25s ease;
          }

          .buildscape-service-card:hover .buildscape-action-arrow {
            transform: translateX(4px);
          }

          .subservice-card-link {
            background-color: #f5f5f5;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid var(--color-neutral-200);
            text-decoration: none;
            display: flex;
            flex-direction: column;
            transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          }

          .subservice-card-link:hover {
            transform: translateY(-3px);
            border-color: var(--color-primary-300);
            box-shadow: 0 8px 24px rgba(0,0,0,0.04);
          }

          .subservice-icon-badge {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            background-color: var(--color-primary-100);
            color: var(--color-primary-300);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            flex-shrink: 0;
          }
        `}</style>
      </section>
    </>
  );
}
