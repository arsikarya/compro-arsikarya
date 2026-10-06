import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FaBuilding, 
  FaDraftingCompass, 
  FaTools, 
  FaShieldAlt, 
  FaTree
} from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import SEOHead from '../components/ui/SEOHead';
import FAQ from '../components/ui/FAQ';
import HeroBanner from '../components/ui/HeroBanner';
import ProjectCard, { ProjectGridStyles, ProjectSkeletonCard } from '../components/ui/ProjectCard';
import ProjectLightboxModal from '../components/ui/ProjectLightboxModal';
import CTA from '../components/CTA';
import { getServicesData, getSeoLandingServices } from '../data/servicesData';
import { getProjectsData } from '../data/projectsData';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { formatRichText } from '../lib/formatRichText';

const serviceImagesMap = {
  'perencanaan': '/projects/service_perencanaan.jpg',
  'konstruksi': '/projects/service_konstruksi.jpg',
  'design-build': '/projects/service_design_build.jpg',
  'renovasi': '/projects/service_renovasi.jpg',
  'landscape': '/projects/service_landscape.jpg',
};

export default function ServicesPage() {
  const { serviceSlug } = useParams();
  const { lang, t } = useLanguage();

  const cachedInitialServices = publicApi.getCachedServices?.() || [];
  const cachedInitialProjects = publicApi.getCachedProjects?.() || [];

  const [apiServices, setApiServices] = useState(cachedInitialServices);
  const [apiProjects, setApiProjects] = useState(() => {
    if (Array.isArray(cachedInitialProjects) && cachedInitialProjects.length > 0) {
      return cachedInitialProjects.map((item) => ({
        id: item.id,
        title: lang === 'en' ? (item.titleEn || item.title) : item.title,
        slug: item.slug,
        category: item.category || 'Design & Build',
        categoryEn: item.categoryEn || item.category,
        location: item.location || 'Bandung, Jawa Barat',
        client: item.clientName || item.client,
        year: item.year,
        thumbnail: item.coverImageUrl || item.thumbnail || '/projects/project_1.jpg',
        coverImageUrl: item.coverImageUrl || item.thumbnail || '/projects/project_1.jpg',
        description: lang === 'en' ? (item.descriptionEn || item.description) : item.description,
        scope: item.scope,
        process: item.process,
        features: item.features || [],
        gallery: item.gallery || [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    }
    return [];
  });

  const [loading, setLoading] = useState(cachedInitialServices.length === 0);
  const [projectsLoading, setProjectsLoading] = useState(cachedInitialProjects.length === 0);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    Promise.all([
      publicApi.getServices().catch((err) => {
        console.error('Failed to load services from API:', err);
        return [];
      }),
      publicApi.getProjects().catch((err) => {
        console.error('Failed to load projects from API:', err);
        return [];
      }),
    ])
      .then(([servicesData, projectsDataResponse]) => {
        if (Array.isArray(servicesData) && servicesData.length > 0) {
          setApiServices(servicesData);
        }
        if (Array.isArray(projectsDataResponse) && projectsDataResponse.length > 0) {
          const mapped = projectsDataResponse.map((item) => ({
            id: item.id,
            title: lang === 'en' ? (item.titleEn || item.title) : item.title,
            slug: item.slug,
            category: item.category || 'Design & Build',
            categoryEn: item.categoryEn || item.category,
            location: item.location || 'Bandung, Jawa Barat',
            client: item.clientName || item.client,
            year: item.year,
            thumbnail: item.coverImageUrl || item.thumbnail || '/projects/project_1.jpg',
            coverImageUrl: item.coverImageUrl || item.thumbnail || '/projects/project_1.jpg',
            description: lang === 'en' ? (item.descriptionEn || item.description) : item.description,
            scope: item.scope,
            process: item.process,
            features: item.features || [],
            gallery: item.gallery || [],
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }));
          setApiProjects(mapped);
        }
      })
      .finally(() => {
        setLoading(false);
        setProjectsLoading(false);
      });
  }, [lang]);

  const defaultServices = getServicesData(lang);
  const seoLandingServices = getSeoLandingServices(lang);
  const allDefaultServices = [...defaultServices, ...seoLandingServices];
  const staticProjects = getProjectsData(lang);
  // Only use static projects as last resort if fetch completely failed, NEVER while loading!
  const allProjects = apiProjects.length > 0 ? apiProjects : (!projectsLoading ? staticProjects : []);

  // Ensure all default services (including Landscape) are always present, merged with API data
  const allServices = allDefaultServices.map((defSvc) => {
    const matchApi = apiServices.find((a) => a.slug === defSvc.slug);
    if (matchApi) {
      return {
        ...defSvc,
        ...matchApi,
        title: matchApi.title || defSvc.title,
        shortDescription: matchApi.shortDescription || defSvc.shortDesc,
        description: matchApi.description || defSvc.fullDesc || defSvc.description,
        heroImageUrl: matchApi.heroImageUrl || defSvc.heroImageUrl || serviceImagesMap[defSvc.slug],
        faq: (Array.isArray(matchApi.faq) && matchApi.faq.length > 0) ? matchApi.faq : defSvc.faqs,
      };
    }
    return {
      ...defSvc,
      heroImageUrl: defSvc.heroImageUrl || serviceImagesMap[defSvc.slug],
    };
  });

  // Append any extra services added via CMS API that are not in default list
  apiServices.forEach((apiSvc) => {
    if (!allServices.some((s) => s.slug === apiSvc.slug)) {
      allServices.push({
        ...apiSvc,
        title: apiSvc.title,
        shortDescription: apiSvc.shortDescription,
        description: apiSvc.description,
        heroImageUrl: apiSvc.heroImageUrl || serviceImagesMap[apiSvc.slug] || '/projects/service_landscape.jpg',
      });
    }
  });

  // Single Service Detail Page (/layanan/:serviceSlug)
  if (serviceSlug) {
    const service = allServices.find((s) => s.slug === serviceSlug) || allDefaultServices.find((s) => s.slug === serviceSlug);

    if (service) {
      const cleanServiceTitle = (service.title || '').toLowerCase().trim();
      const cleanServiceSlug = (service.slug || '').toLowerCase().trim();
      const cleanServiceCat = (service.category || '').toLowerCase().trim();

      const serviceKeywords = [
        service.title,
        service.titleEn,
        service.slug ? service.slug.replace(/-/g, ' ') : '',
        service.category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 3 && !['dan', 'and', 'the', 'for', 'jasa'].includes(w));

      const isCategoryMatch = (p) => {
        const pCat = (p.category || '').toLowerCase().trim();
        const pCatEn = (p.categoryEn || '').toLowerCase().trim();
        if (!pCat && !pCatEn) return false;

        // 1. Direct equality or substring in category
        if (cleanServiceCat && (pCat === cleanServiceCat || pCat.includes(cleanServiceCat) || cleanServiceCat.includes(pCat))) {
          return true;
        }
        if (cleanServiceTitle && (pCat === cleanServiceTitle || cleanServiceTitle.includes(pCat) || pCat.includes(cleanServiceTitle))) {
          return true;
        }
        if (cleanServiceSlug && (pCat.includes(cleanServiceSlug) || cleanServiceSlug.includes(pCat))) {
          return true;
        }

        // 2. Keyword matching across categories and titles
        return serviceKeywords.some((kw) => pCat.includes(kw) || pCatEn.includes(kw));
      };

      const matchProjects = allProjects.filter(isCategoryMatch);
      const otherProjects = allProjects.filter(
        (p) => !matchProjects.some((m) => String(m.id || m.slug) === String(p.id || p.slug))
      );

      // Prioritas 1: Proyek yang cocok dengan kategori layanan.
      // Prioritas 2: Lengkapi dengan proyek terbaru lainnya agar selalu menampilkan 4 proyek.
      const relatedProjects = [...matchProjects, ...otherProjects].slice(0, 4);

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

      const faqsList = (service.faq && service.faq.length > 0) 
        ? service.faq 
        : (service.faqs && service.faqs.length > 0) 
          ? service.faqs 
          : defaultFaqs;

      const heroBg = service.heroImageUrl || serviceImagesMap[service.slug] || '/projects/project_1.jpg';
      const shortDescText = service.shortDescription || service.shortDesc;

      return (
        <>
          <SEOHead
            title={`${service.title} — Arsi Karya`}
            description={shortDescText || service.description}
          />

          {/* Dark Architectural Hero Banner */}
          <HeroBanner
            bgImage={heroBg}
            overlayOpacity={0.65}
            imageAlt={service.title}
            tag={lang === 'en' ? "SERVICE DETAILS" : "DETAIL LAYANAN"}
            title={service.title}
            subtitle={shortDescText}
          />

          <section className="section-padding" style={{ backgroundColor: '#ffffff', paddingTop: '48px' }}>
            <div className="container">
              
              {/* Clean Centered Document Container */}
              <div style={{ maxWidth: '840px', margin: '0 auto' }}>
                
                {/* Top Back Navigation */}
                <Link 
                  to="/layanan" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '36px', 
                    color: '#005697', 
                    fontWeight: 700, 
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  {lang === 'en' ? '← Back to Services' : '← Kembali ke Layanan'}
                </Link>

                {/* Clean Document Body Container */}
                <div className="wysiwyg-service-container rich-text-block">
                  <div 
                    className="wysiwyg-service-body" 
                    dangerouslySetInnerHTML={{ 
                      __html: formatRichText(
                        (lang === 'en' && service.fullDescEn) 
                          ? service.fullDescEn 
                          : (service.description || service.fullDesc || service.fullDescEn || shortDescText || '')
                      ) 
                    }} 
                  />
                </div>



                {/* FAQ Accordion */}
                <div style={{ marginBottom: '48px' }}>
                  <h3 style={{ 
                    fontFamily: 'var(--font-body)', 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    color: '#0f172a', 
                    marginTop: '36px',
                    marginBottom: '16px',
                    lineHeight: 1.4,
                    letterSpacing: '-0.01em'
                  }}>
                    {t.servicesPage?.faqTitle || 'Pertanyaan Sering Diajukan (FAQ)'}
                  </h3>
                  <FAQ items={faqsList} />
                </div>

              </div>

            </div>
          </section>

          {/* Related Projects */}
          {(projectsLoading || relatedProjects.length > 0) && (
            <section className="section-padding" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
              <div className="container">
                <ProjectGridStyles />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{lang === 'en' ? 'Related Projects' : 'Proyek Terkait'}</h2>
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
                  {projectsLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <ProjectSkeletonCard key={`rel-skel-${idx}`} />
                    ))
                  ) : (
                    relatedProjects.map((rp) => (
                      <ProjectCard key={rp.id || rp.slug} proj={rp} onClick={(p) => setSelectedProject(p)} />
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Bottom Albion CTA */}
          <CTA />

          {selectedProject && (
            <ProjectLightboxModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}

          <style>{`
            .wysiwyg-service-body {
              color: #334155;
              font-size: 1.05rem;
              line-height: 1.85;
              font-family: var(--font-body);
            }

            .wysiwyg-service-body h2 {
              font-size: clamp(1.4rem, 2.5vw, 1.8rem);
              font-weight: 800;
              color: #0f172a;
              margin-top: 32px;
              margin-bottom: 14px;
              letter-spacing: -0.01em;
              line-height: 1.3;
            }

            .wysiwyg-service-body h2:first-of-type {
              margin-top: 0;
            }

            .wysiwyg-service-body h3 {
              font-size: clamp(1.15rem, 2vw, 1.35rem);
              font-weight: 700;
              color: #0f172a;
              margin-top: 24px;
              margin-bottom: 12px;
            }

            .wysiwyg-service-body p {
              margin-bottom: 24px;
              color: #334155;
            }

            .wysiwyg-service-body ol,
            .wysiwyg-service-body ul {
              margin-bottom: 28px;
              padding-left: 24px;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .wysiwyg-service-body li {
              color: #334155;
              line-height: 1.7;
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
        title={lang === 'en' ? "Construction & Design-Build Services — Arsi Karya" : "Jasa Bangun Rumah & Konstruksi di Bandung & Bali — Arsi Karya"}
        description={lang === 'en' ? "Arsi Karya integrated services: Planning, Construction, Design & Build, Renovation, and Landscape in Bandung, Java — Bali." : "Layanan terpadu Arsi Karya: Jasa bangun rumah tinggal, villa, konstruksi, design & build, renovasi, dan arsitektur di Bandung & Bali."}
        keywords="jasa bangun rumah bandung, jasa bangun rumah bali, kontraktor rumah bandung, kontraktor bali, jasa bangun villa bali, jasa renovasi rumah bandung, jasa konstruksi bandung"
      />

      <HeroBanner
        bgImage="/projects/project_2.jpg"
        overlayOpacity={0.65}
        tag={lang === 'en' ? "OUR SERVICES" : "LAYANAN KAMI"}
        title={lang === 'en' ? "Construction & Architectural Solutions" : "Solusi Konstruksi & Perancangan"}
        subtitle={lang === 'en'
          ? "We combine technical engineering design expertise with structured physical execution to bring your projects to life in Bandung, Java — Bali."
          : "Kami memadukan keahlian perancangan teknis dengan eksekusi fisik terstruktur untuk mewujudkan proyek Anda di Bandung, Jawa — Bali."}
      />

      {/* Primary Services Grid (2 Cards Per Row) */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="services-directory-grid">
            {allServices.filter((s) => s.slug !== 'landscape').map((svc) => {
              const cardImage = svc.heroImageUrl || serviceImagesMap[svc.slug] || '/projects/project_1.jpg';
              const cardDesc = svc.shortDescription || svc.shortDesc;

              return (
                <Link
                  key={svc.id || svc.slug}
                  to={`/layanan/${svc.slug}`}
                  className="clean-service-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {/* Top Service Image */}
                  <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <img
                      src={cardImage}
                      alt={svc.title}
                      style={{
                        width: '100%',
                        height: '240px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* Card Text Area */}
                  <div style={{ padding: '20px 6px 6px 6px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', lineHeight: 1.3 }}>
                      {svc.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.65, marginBottom: '20px', flexGrow: 1 }}>
                      {cardDesc}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#005697', fontWeight: 700, fontSize: '0.9rem', marginTop: 'auto' }}>
                      <span>{lang === 'en' ? 'Learn More' : 'Selengkapnya'}</span>
                      <FiArrowRight />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .services-directory-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
        }

        @media (max-width: 768px) {
          .services-directory-grid {
            grid-template-columns: 1fr;
          }
        }

        .clean-service-card {
          background-color: #f8fafc;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .clean-service-card:hover {
          transform: translateY(-5px);
          border-color: #005697;
          box-shadow: 0 12px 32px rgba(0, 86, 151, 0.12);
        }
      `}</style>

      <CTA />
      {selectedProject && (
        <ProjectLightboxModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
