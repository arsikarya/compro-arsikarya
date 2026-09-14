import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { getGeneralWaUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const videoMp4 = "https://cdn.prod.website-files.com/6175e5f51349efa3b3120baa/6179fd5c38ec05cd8ff9df2b_background_video-transcode.mp4";
  const videoWebm = "https://cdn.prod.website-files.com/6175e5f51349efa3b3120baa/6179fd5c38ec05cd8ff9df2b_background_video-transcode.webm";

  const generalWaUrl = getGeneralWaUrl();

  const bottomNavItems = [
    {
      title: t.hero.item1,
      link: '/layanan/konstruksi',
    },
    {
      title: t.hero.item2,
      link: '/layanan/design-build',
    },
    {
      title: t.hero.item3,
      link: '/layanan/renovasi',
    },
  ];

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 'var(--header-height)',
        backgroundColor: 'var(--color-dark-bg, #222222)',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Background HTML5 Video */}
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
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.65) contrast(1.05)',
          }}
        >
          <source src={videoMp4} type="video/mp4" />
          <source src={videoWebm} type="video/webm" />
        </video>

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

      {/* Main Left-Aligned Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <div style={{ maxWidth: '900px' }}>
          {/* Main Title Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(2.4rem, 4.9vw, 4.3rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              textAlign: 'left',
            }}
          >
            {t.hero.titleLine1}<br />
            {t.hero.titleLine2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 1.35vw, 1.15rem)',
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: '780px',
              lineHeight: 1.6,
              margin: 0,
              fontWeight: 400,
              textAlign: 'left',
            }}
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '32px',
              flexWrap: 'wrap',
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

      {/* Bottom Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          paddingBottom: '40px',
        }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {bottomNavItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: '1px solid rgba(255, 255, 255, 0.4)',
                  paddingTop: '16px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderTopColor = 'var(--color-primary-300)';
                  e.currentTarget.style.color = 'var(--color-primary-200)';
                  const arrow = e.currentTarget.querySelector('.item-arrow');
                  if (arrow) arrow.style.transform = 'translate(3px, -3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderTopColor = 'rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.color = '#ffffff';
                  const arrow = e.currentTarget.querySelector('.item-arrow');
                  if (arrow) arrow.style.transform = 'translate(0, 0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.title}
                  </span>
                  <FiArrowUpRight
                    className="item-arrow"
                    style={{
                      fontSize: '1.4rem',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
