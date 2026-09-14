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

  const servicesList = rawServices.map((s, idx) => ({
    num: `0${idx + 1}`,
    title: s.title,
    desc: s.shortDesc,
    fullDesc: s.fullDesc,
    icon: iconMap[s.slug] || <FiLayers style={{ fontSize: '1.4rem', color: '#1e293b' }} />,
    features: s.scopeList ? s.scopeList.slice(0, 3) : [],
    slug: s.slug,
  }));

  const [selectedService, setSelectedService] = useState(null);

  return (
    <section id="services" style={{ backgroundColor: '#f5f5f5', width: '100%', overflow: 'hidden' }}>
      {/* 1. 100% Full Viewport Width Dark Split Banner */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-dark-bg, #222222)',
          color: '#ffffff',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '0',
            width: '100%',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Full-bleed Architect Blueprint Photo with Smooth Dark Fade */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: '360px',
              overflow: 'hidden',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop"
              alt="Architect drafting blueprints"
              onError={(e) => {
                e.currentTarget.src = '/projects/project_1.jpg';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to left, #222222 0%, rgba(34, 34, 34, 0.85) 30%, rgba(34, 34, 34, 0) 65%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Right Column: Dark Text Content & CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              padding: 'clamp(48px, 6vw, 80px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <span className="section-tag section-tag-light">{t.servicesSection?.visionTag || 'VISI PERUSAHAAN'}</span>

            <h2
              style={{
                fontSize: 'clamp(2.25rem, 3.8vw, 3.3rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.25,
                marginBottom: '20px',
                letterSpacing: '-0.5px',
              }}
            >
              {t.servicesSection?.visionTitle || 'We know how to deliver your vision'}
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#cbd5e1',
                lineHeight: 1.7,
                marginBottom: '32px',
                maxWidth: '520px',
              }}
            >
              {t.servicesSection?.visionDesc || 'Arsi Karya menghadirkan layanan konstruksi terpadu dengan eksekusi amanah dan profesional di Bandung, Jawa — Bali.'}
            </p>

            <Button
              to="/layanan"
              variant="primary"
              showArrow={true}
              style={{
                backgroundColor: 'var(--color-primary-300)',
                color: '#ffffff',
                borderColor: 'var(--color-primary-300)',
                fontWeight: 700,
              }}
            >
              {t.servicesSection?.btnServices || 'Layanan Kami'}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 2. 100% Full Viewport Width 3-Photo Showcase Bar */}
      <div
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            width: '100%',
          }}
        >
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              style={{
                height: '360px',
                overflow: 'hidden',
                borderRadius: '4px',
              }}
            >
              <img
                src={img.url}
                alt={img.alt}
                onError={(e) => {
                  e.currentTarget.src = img.fallback;
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. 4-Column Services Grid */}
      <div id="services-list" style={{ backgroundColor: '#f5f5f5', color: 'var(--color-text-main)', padding: '96px 0' }}>
        <div className="container">
          <div style={{ maxWidth: '720px', marginBottom: '60px' }}>
            <span className="section-tag">{t.servicesSection?.expertiseTag || 'LAYANAN SPESIALIS'}</span>

            <h2
              style={{
                fontSize: 'clamp(2.1rem, 3.6vw, 2.9rem)',
                fontWeight: 800,
                color: 'var(--color-text-main)',
                lineHeight: 1.28,
              }}
            >
              {t.servicesSection?.expertiseTitle || 'We construct spaces where amazing things happen'}
            </h2>
          </div>

          <div className="home-services-grid">
            {servicesList.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '32px 28px',
                  borderRadius: '14px',
                  border: '1px solid var(--color-neutral-200)',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-300)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => setSelectedService(service)}
              >
                <div>
                  {/* Square Icon Badge */}
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      backgroundColor: 'var(--color-primary-100)',
                      color: 'var(--color-primary-300)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      marginBottom: '24px',
                    }}
                  >
                    {service.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-body)',
                      marginBottom: '12px',
                      color: 'var(--color-neutral-800)',
                      lineHeight: 1.3,
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.95rem',
                      color: 'var(--color-neutral-500)',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {service.desc}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--color-primary-300)',
                  }}
                >
                  <span>{lang === 'en' ? 'View Service Details' : 'Lihat Detail Layanan'}</span>
                  <FiArrowRight />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          .home-services-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 28px;
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
