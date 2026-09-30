import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiLayers, FiCompass, FiCpu, FiPackage, FiArrowRight } from 'react-icons/fi';
import Button from './ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { getServicesData } from '../data/servicesData';

export default function Services() {
  const { lang, t } = useLanguage();
  const rawServices = getServicesData(lang);

  const iconMap = {
    perencanaan: <FiCompass style={{ fontSize: '1.4rem', color: '#1e293b' }} />,
    konstruksi: <FiLayers style={{ fontSize: '1.4rem', color: '#1e293b' }} />,
    'design-build': <FiCpu style={{ fontSize: '1.4rem', color: '#1e293b' }} />,
    renovasi: <FiLayers style={{ fontSize: '1.4rem', color: '#1e293b' }} />,
    landscape: <FiPackage style={{ fontSize: '1.4rem', color: '#1e293b' }} />,
  };

  const galleryImages = [
    { 
      url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop", 
      fallback: "/projects/project_8.jpg",
      alt: "Konstruksi Steel Fabrication 1" 
    },
    { 
      url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1200&auto=format&fit=crop", 
      fallback: "/projects/gallery_1.jpg",
      alt: "Building Construction 2" 
    },
    { 
      url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop", 
      fallback: "/projects/gallery_3.jpg",
      alt: "Architectural Finishing 3" 
    },
  ];

  const serviceImageMap = {
    'perencanaan': '/projects/service_perencanaan.jpg',
    'konstruksi': '/projects/service_konstruksi.jpg',
    'design-build': '/projects/service_design_build.jpg',
    'renovasi': '/projects/service_renovasi.jpg',
    'landscape': '/projects/service_landscape.jpg',
  };

  const displayTitleMap = {
    'perencanaan': lang === 'en' ? 'Architecture & Planning' : 'Perencanaan',
    'konstruksi': lang === 'en' ? 'Construction' : 'Konstruksi',
    'design-build': 'Design & Build',
    'renovasi': lang === 'en' ? 'Renovation' : 'Renovasi',
    'landscape': 'Landscape',
  };

  const allowedSlugs = ['perencanaan', 'konstruksi', 'design-build', 'renovasi'];

  const servicesList = rawServices
    .filter((s) => allowedSlugs.includes(s.slug))
    .map((s, idx) => ({
      num: `0${idx + 1}`,
      title: s.title,
      cardTitle: displayTitleMap[s.slug] || s.title,
      desc: s.shortDesc,
      fullDesc: s.fullDesc,
      image: s.heroImageUrl || serviceImageMap[s.slug] || '/projects/project_1.jpg',
      icon: iconMap[s.slug] || <FiLayers style={{ fontSize: '1.4rem', color: '#1e293b' }} />,
      features: s.scopeList ? s.scopeList.slice(0, 3) : [],
      slug: s.slug,
    }));

  const [selectedService, setSelectedService] = useState(null);

  return (
    <section id="services" style={{ backgroundColor: '#f5f5f5', width: '100%', overflow: 'hidden' }}>
      {/* 4-Column Services Grid */}
      <div id="services-list" style={{ backgroundColor: '#f5f5f5', color: 'var(--color-text-main)', padding: '96px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '24px',
              marginBottom: '50px',
            }}
          >
            <div style={{ maxWidth: '850px' }}>
              <span className="section-tag">OUR SERVICES</span>

              <h2
                style={{
                  fontSize: 'clamp(2.1rem, 3.6vw, 2.9rem)',
                  fontWeight: 800,
                  color: 'var(--color-text-main)',
                  lineHeight: 1.25,
                }}
              >
                {lang === 'en' ? (
                  <>
                    Building More Directional,<br />
                    Higher Quality Results
                  </>
                ) : (
                  <>
                    Membangun Lebih Terarah,<br />
                    Hasil Lebih Berkualitas
                  </>
                )}
              </h2>
            </div>

            <div>
              <Button to="/layanan" variant="primary" showArrow={true}>
                {lang === 'en' ? 'Our Services' : 'Layanan Kami'}
              </Button>
            </div>
          </div>

          <div className="home-services-grid">
            {servicesList.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                style={{
                  position: 'relative',
                  height: 'clamp(380px, 26vw, 420px)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), boxShadow 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 18px 36px rgba(0,0,0,0.16)';
                  const img = e.currentTarget.querySelector('.service-card-img');
                  if (img) img.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                  const img = e.currentTarget.querySelector('.service-card-img');
                  if (img) img.style.transform = 'scale(1)';
                }}
                onClick={() => setSelectedService(service)}
              >
                {/* Background Photo */}
                <img
                  className="service-card-img"
                  src={service.image}
                  alt={service.cardTitle}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                {/* Rich Logo Blue Gradient Overlay (Up to 50% height) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0, 50, 95, 0.98) 0%, rgba(0, 86, 151, 0.82) 22%, rgba(0, 86, 151, 0.35) 38%, rgba(0, 86, 151, 0) 50%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Card Text Content (Bottom Left) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px 20px 20px 20px',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      fontSize: 'clamp(1.25rem, 1.8vw, 1.55rem)',
                      fontWeight: 700,
                      color: '#ffffff',
                      fontFamily: 'var(--font-body)',
                      marginBottom: '8px',
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em',
                      WebkitTextStroke: '0',
                    }}
                  >
                    {service.cardTitle}
                  </div>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.88)',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.55,
                      margin: 0,
                      fontWeight: 400,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          .home-services-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            width: 100%;
          }

          @media (max-width: 1024px) {
            .home-services-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 640px) {
            .home-services-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(12, 16, 21, 0.8)',
              backdropFilter: 'blur(6px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#f5f5f5',
                color: 'var(--color-text-main)',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '100%',
                padding: '40px',
                position: 'relative',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              }}
            >
              <button
                onClick={() => setSelectedService(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '1.4rem',
                  color: 'var(--color-text-main)',
                }}
              >
                <FiX />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f0f4f8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedService.icon}
                </div>
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>{selectedService.title}</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
                {selectedService.fullDesc}
              </p>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>{lang === 'en' ? 'Main Scope:' : 'Scope Utama:'}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {selectedService.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiCheck style={{ color: 'var(--color-primary-300)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{f}</span>
                  </div>
                ))}
              </div>

              <Button
                to={`/layanan/${selectedService.slug}`}
                onClick={() => setSelectedService(null)}
                variant="primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {lang === 'en' ? 'View Service Details' : 'Lihat Detail Layanan'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
