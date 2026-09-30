import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function CTA() {
  const { t } = useLanguage();
  const { getWaUrl } = useSiteSettings();
  const ctaPhoto = "https://res.cloudinary.com/agsidj31/image/upload/v1790752119/fldk6jvb3ovzf3xocadw.jpg";
  const generalWaUrl = getWaUrl();

  return (
    <section id="contact" className="cta-section-container" style={{ backgroundColor: 'var(--color-dark-bg, #222222)', padding: '0', width: '100%', overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          alignItems: 'stretch',
          gap: '0',
          width: '100%',
        }}
      >
        {/* Left Column: Full-height Industrial Blueprint Photo */}
        <div className="cta-left-image-wrap" style={{ minHeight: '340px', height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
          <img
            src={ctaPhoto}
            alt="Engineering blueprint & hardhat workspace"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
        </div>

        {/* Right Column: Brand Blue Accent Block */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="cta-right-text-wrap"
          style={{
            backgroundColor: 'var(--color-primary-300)',
            color: '#ffffff',
            padding: '44px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            boxSizing: 'border-box',
          }}
        >
          <span className="section-tag section-tag-light">{t.cta?.tag || 'CONTACT US'}</span>

          <h2
            style={{
              fontSize: 'clamp(1.9rem, 2.8vw, 2.75rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.25,
              marginBottom: '24px',
              letterSpacing: '-0.5px',
            }}
          >
            Got Something in Mind?<br />
            Hit Us Up
          </h2>

          <Button
            href={generalWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-light"
            showArrow={true}
            style={{ padding: '14px 32px', fontSize: '0.95rem' }}
          >
            {t.nav?.ctaConsultation || 'Konsultasi Gratis'}
          </Button>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .cta-section-container {
            height: 420px !important;
            max-height: 420px !important;
          }
          .cta-left-image-wrap,
          .cta-right-text-wrap {
            height: 420px !important;
            max-height: 420px !important;
          }
        }
      `}</style>
    </section>
  );
}
