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
          src="https://res.cloudinary.com/agsidj31/image/upload/v1790752137/lphcajslykzx9wejnrkx.jpg"
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

      {/* Main Centered Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          paddingTop: '35px',
          paddingBottom: '70px',
          marginTop: '-15px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          {/* Main Title: ARSI KARYA (Kapital, Centered, Bold Garet) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(3rem, 5.5vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              textTransform: 'uppercase',
              marginBottom: '18px',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              textAlign: 'center',
            }}
          >
            ARSI KARYA
          </motion.h1>

          {/* Description Slogan: Membangun Tuntas, Unggul Dalam Kualitas! (Diperbesar Lebih Mantap, Manrope, Centered) */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)',
              fontWeight: 500,
              lineHeight: 1.35,
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '-0.01em',
              marginBottom: '38px',
              textShadow: '0 2px 16px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}
          >
            Membangun Tuntas, Unggul Dalam Kualitas!
          </motion.p>

          {/* Action CTA Buttons (Centered) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
