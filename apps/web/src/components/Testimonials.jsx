import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Testimonials() {
  const { lang, t } = useLanguage();
  const bgImg = "https://assets-global.website-files.com/6175e5f51349efa3b3120baa/617c967a42c0beed800a8b23_contact.jpg";

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    publicApi.getTestimonials()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => ({
            quote: lang === 'en' ? (item.contentEn || item.quote || item.content) : item.quote || item.content,
            author: item.clientName?.toUpperCase() || (lang === 'en' ? 'ARSI KARYA CLIENT' : 'KLIEN ARSI KARYA'),
            company: item.clientRole || item.projectName || 'Arsi Karya Project',
          }));
          setTestimonials(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lang]);

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = testimonials[currentIndex] || null;

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '520px',
        width: '100%',
        backgroundColor: 'var(--color-dark-bg, #222222)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background Image Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.45,
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(12, 16, 21, 0.85) 0%, rgba(12, 16, 21, 0.5) 100%)',
          zIndex: 2,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '100px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '60px',
            alignItems: 'center',
          }}
        >
          {/* Empty Left Column */}
          <div style={{ display: 'none' }} className="desktop-spacer" />

          {/* Right Column Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{ maxWidth: '620px', marginLeft: 'auto', width: '100%' }}
          >
            <span className="section-tag section-tag-light">{t.testimonialsSection?.tag || 'TESTIMONI'}</span>

            <h2
              style={{
                fontSize: 'clamp(2.25rem, 3.8vw, 3.3rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '36px',
              }}
            >
              {t.testimonialsSection?.title || 'What clients say about working with us'}
            </h2>

            {loading ? (
              <div style={{ display: 'flex', minHeight: '180px', alignItems: 'center' }}>
                <div className="spinner" style={{ width: '36px', height: '36px', border: '3px solid rgba(255,255,255,0.2)', borderTop: '3px solid #ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : activeTestimonial ? (
              <>
                <div style={{ minHeight: '160px', position: 'relative' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <blockquote
                        style={{
                          fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                          lineHeight: 1.6,
                          color: '#e2e8f0',
                          fontStyle: 'italic',
                          margin: '0 0 28px 0',
                          fontWeight: 400,
                        }}
                      >
                        "{activeTestimonial.quote}"
                      </blockquote>

                      <div>
                        <h4
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            letterSpacing: '1px',
                            color: '#ffffff',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {activeTestimonial.author}
                        </h4>
                        <p
                          style={{
                            fontSize: '0.85rem',
                            color: '#94a3b8',
                            margin: 0,
                            letterSpacing: '0.5px',
                          }}
                        >
                          {activeTestimonial.company}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Arrows */}
                {testimonials.length > 1 && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '36px' }}>
                    <button
                      onClick={handlePrev}
                      aria-label="Previous testimonial"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary-300)';
                        e.currentTarget.style.borderColor = 'var(--color-primary-300)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                      }}
                    >
                      <FiChevronLeft style={{ fontSize: '1.25rem' }} />
                    </button>

                    <button
                      onClick={handleNext}
                      aria-label="Next testimonial"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary-300)';
                        e.currentTarget.style.borderColor = 'var(--color-primary-300)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                      }}
                    >
                      <FiChevronRight style={{ fontSize: '1.25rem' }} />
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
