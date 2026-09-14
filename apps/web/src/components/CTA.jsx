import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { getGeneralWaUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

export default function CTA() {
  const { t } = useLanguage();
  const ctaPhoto = "/projects/project_8.jpg";
  const generalWaUrl = getGeneralWaUrl();

  return (
    <section id="contact" style={{ backgroundColor: 'var(--color-dark-bg, #222222)', padding: '0', width: '100%', overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '0',
          width: '100%',
        }}
      >
        {/* Left Column: Full-height Industrial Construction Photo (100% Full-Bleed) */}
        <div style={{ height: '380px', position: 'relative', overflow: 'hidden' }}>
          <img
            src={ctaPhoto}
            alt="Industrial construction structure"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* Right Column: Brand Blue Accent Block (Full-Bleed matching Albion Reference) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            backgroundColor: 'var(--color-primary-300)',
            color: '#ffffff',
            padding: 'clamp(48px, 6vw, 80px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <span className="section-tag section-tag-light">{t.cta?.tag || 'CONTACT US'}</span>

          <h2
            style={{
              fontSize: 'clamp(2.1rem, 3.6vw, 3.0rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.28,
              marginBottom: '32px',
              letterSpacing: '-0.5px',
            }}
          >
            {t.cta?.title || 'Ready to work together?'}
          </h2>

          <Button
            href={generalWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-light"
            showArrow={true}
            style={{ padding: '16px 36px', fontSize: '1rem' }}
          >
            {t.nav?.ctaConsultation || 'Konsultasi Gratis'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
