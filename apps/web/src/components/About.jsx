import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import Button from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { lang, t } = useLanguage();

  const aboutImg1 = "https://assets-global.website-files.com/6175e5f51349efa3b3120baa/6181b49dad041b569acca334_about_1.jpg";
  const aboutImg2 = "https://assets-global.website-files.com/6175e5f51349efa3b3120baa/6181bc9593b65751777cb76b_about_a4.jpg";

  const keyPoints = lang === 'en' ? [
    'Precision Architecture & Structural Planning',
    'Efficient & Structured Construction Execution',
    'Material Quality Control & Safety Standards',
    'Transparent Progress & Maintenance Warranty',
  ] : [
    'Perencanaan Arsitektur & Struktur Presisi',
    'Eksekusi Konstruksi Efisien & Terstruktur',
    'Pengawasan Mutu Bahan & Standar Keselamatan',
    'Transparansi Progres & Garansi Pemeliharaan',
  ];

  return (
    <section id="about" className="section-padding" style={{ backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '60px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{t.about?.tag || 'TENTANG KAMI'}</span>

            <h2
              style={{
                fontSize: 'clamp(2.1rem, 3.4vw, 2.9rem)',
                fontWeight: 800,
                color: 'var(--color-text-main)',
                marginBottom: '20px',
                lineHeight: 1.25,
              }}
            >
              {t.about?.title || 'We create things that matter'}
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}
            >
              {t.about?.desc1 || 'Arsi Karya melayani jasa kontraktor umum, design & build, renovasi, dan pengadaan barang terpercaya berpusat di Bandung, Jawa — Bali.'}
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {keyPoints.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FiCheckCircle style={{ color: 'var(--color-primary-300)', fontSize: '1.2rem', flexShrink: 0 }} />
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {pt}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Visual Composite Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{ position: 'relative' }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              }}
            >
              <img
                src={aboutImg1}
                alt="Construction site"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Floating Badge / Second Image */}
            <div
              style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '240px',
                height: '200px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '6px solid #f5f5f5',
                boxShadow: '0 15px 30px rgba(0,86,151,0.2)',
                display: 'none',
              }}
              className="about-secondary-img"
            >
              <img
                src={aboutImg2}
                alt="Architect planning"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Floating Experience Box */}
            <div
              style={{
                position: 'absolute',
                top: '30px',
                right: '-20px',
                backgroundColor: 'var(--color-primary-300)',
                color: '#ffffff',
                padding: '20px 24px',
                borderRadius: '6px',
                boxShadow: '0 10px 25px rgba(0,86,151,0.3)',
              }}
            >
              <span style={{ fontSize: '2.2rem', fontWeight: 800, display: 'block', lineHeight: 1 }}>100%</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quality Guaranteed</span>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .about-secondary-img { display: block !important; }
        }
      `}</style>
    </section>
  );
}
