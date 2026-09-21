import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { getGeneralWaUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'var(--header-height)',
        backgroundColor: 'var(--color-dark-bg, #222222)',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Background Image Banner */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <img
          src="/hero_banner.jpg"
          alt="Arsi Karya Hero Banner"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.7) contrast(1.05)',
          }}
        />

        {/* Gradient Dark Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(10, 13, 18, 0.4) 0%, rgba(10, 13, 18, 0.75) 100%)',
          }}
        />
      </div>

      {/* Main Left-Aligned Content (Centered Vertically) */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          paddingTop: '35px',
          paddingBottom: '70px',
          marginTop: '-15px',
        }}
      >
        <div style={{ maxWidth: 'clamp(920px, 68vw, 1360px)' }}>
          {/* Horizontal Line Tag "— ARSI KARYA" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '38px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '2px',
                backgroundColor: '#ffffff',
                borderRadius: '1px',
              }}
            />
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#ffffff',
              }}
            >
              ARSI KARYA
            </span>
          </motion.div>

          {/* Main Title Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.8rem, 4.8vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              marginBottom: '46px',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              textAlign: 'left',
            }}
          >
            {t.hero.titleLine1}<br />
            {t.hero.titleLine2}
          </motion.h1>

          {/* Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginTop: '8px',
            }}
          >
            <Button
              to="/proyek"
              variant="primary"
              style={{
                padding: '14px 28px',
                fontSize: '0.95rem',
                boxShadow: 'none',
              }}
            >
              {t.hero.btnProjects}
            </Button>

            <Button
              to="/layanan"
              variant="outline-light"
              style={{
                padding: '14px 28px',
                fontSize: '0.95rem',
              }}
            >
              {t.hero.btnServices}
            </Button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .desktop-hero-brand { display: none !important; }
        }
      `}</style>
    </section>
  );
}
