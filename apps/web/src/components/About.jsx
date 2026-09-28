import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function About() {
  const { lang } = useLanguage();
  const { settings } = useSiteSettings();

  const statsData = lang === 'en' ? [
    { value: settings?.stat1Value || '100+', label: 'COMPLETED PROJECTS' },
    { value: settings?.stat2Value || '100%', label: 'QUALITY COMMITMENT' },
    { value: settings?.stat3Value || '4', label: 'SPECIALIZED SERVICES' },
  ] : [
    { value: settings?.stat1Value || '100+', label: settings?.stat1Label || 'PROYEK SELESAI' },
    { value: settings?.stat2Value || '100%', label: settings?.stat2Label || 'KOMITMEN MUTU' },
    { value: settings?.stat3Value || '4', label: settings?.stat3Label || 'LAYANAN SPESIALIS' },
  ];

  return (
    <section
      id="about"
      style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: 'clamp(90px, 8vw, 130px) 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div className="container" style={{ width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(48px, 6vw, 96px)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Photo Showcase with Overlaid Blue Accent Blocks */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              position: 'relative',
              paddingTop: '28px',
              paddingBottom: '28px',
              paddingLeft: '28px',
              maxWidth: '520px',
              width: '100%',
              margin: '0 auto',
            }}
          >
            {/* Top-Left Blue Overlay Badge (1:1 Perfect Square) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '130px',
                height: '130px',
                backgroundColor: 'var(--color-primary-300, #005697)',
                zIndex: 4,
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 86, 151, 0.25)',
              }}
            >
              <img
                src="/images/logo-white-badge.png"
                alt="Arsi Karya Logo"
                style={{
                  width: '100%',
                  maxHeight: '72px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Main Architectural Photo Card */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 'clamp(420px, 34vw, 540px)',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
                zIndex: 2,
              }}
            >
              <img
                src="/images/about-showcase.jpg"
                alt="Tentang Arsi Karya"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* Bottom-Right Blue Accent Square Overlay (1:1 Perfect Square) */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: '-16px',
                width: '95px',
                height: '95px',
                backgroundColor: 'var(--color-primary-300, #005697)',
                zIndex: 3,
              }}
            />
          </motion.div>

          {/* Right Column: Text Blocks with Giant Watermark Numbers + Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Block 01 */}
            <div
              style={{
                position: 'relative',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '36px',
                marginBottom: '36px',
              }}
            >
              {/* Giant Watermark Number 01 */}
              <span
                style={{
                  position: 'absolute',
                  top: '-20px',
                  right: 0,
                  fontSize: 'clamp(4.5rem, 6.5vw, 6.2rem)',
                  fontWeight: 800,
                  color: 'rgba(0, 86, 151, 0.12)',
                  lineHeight: 1,
                  fontFamily: 'var(--font-heading)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                01
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ width: '28px', height: '2px', backgroundColor: 'var(--color-primary-300, #005697)' }} />
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#0f172a',
                    margin: 0,
                  }}
                >
                  {lang === 'en' ? 'BUILT AROUND YOUR NEEDS' : 'BUILT AROUND YOUR NEEDS'}
                </h3>
              </div>

              <p
                style={{
                  fontSize: '0.975rem',
                  color: '#475569',
                  lineHeight: 1.75,
                  margin: 0,
                  maxWidth: '540px',
                  fontWeight: 400,
                }}
              >
                {lang === 'en'
                  ? 'With the trust you give us, we will create spaces that truly represent your needs and desires. Every decision is carefully considered, from function and aesthetics to every detail that makes the space feel personal.'
                  : 'Dengan kepercayaan yang Anda berikan, kami akan mewujudkan ruang yang benar-benar merepresentasikan kebutuhan dan keinginan Anda. Setiap keputusan kami pertimbangkan dengan cermat, dari fungsi dan estetika hingga setiap detail yang menjadikan ruang tersebut terasa personal.'}
              </p>
            </div>

            {/* Block 02 */}
            <div
              style={{
                position: 'relative',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '36px',
                marginBottom: '32px',
              }}
            >
              {/* Giant Watermark Number 02 */}
              <span
                style={{
                  position: 'absolute',
                  top: '-20px',
                  right: 0,
                  fontSize: 'clamp(4.5rem, 6.5vw, 6.2rem)',
                  fontWeight: 800,
                  color: 'rgba(0, 86, 151, 0.12)',
                  lineHeight: 1,
                  fontFamily: 'var(--font-heading)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                02
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ width: '28px', height: '2px', backgroundColor: 'var(--color-primary-300, #005697)' }} />
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#0f172a',
                    margin: 0,
                  }}
                >
                  {lang === 'en' ? 'WHAT REMAINS, A LEGACY' : 'WHAT REMAINS, A LEGACY'}
                </h3>
              </div>

              <p
                style={{
                  fontSize: '0.975rem',
                  color: '#475569',
                  lineHeight: 1.75,
                  margin: 0,
                  maxWidth: '540px',
                  fontWeight: 400,
                }}
              >
                {lang === 'en'
                  ? 'We develop every space with thorough consideration, bringing function, form, material, and detail into a unified whole with purpose behind every decision. Not just something finished to be left behind, but a masterpiece to be used, inhabited, and become part of the story and life within it.'
                  : 'Setiap ruang kami kembangkan dengan penuh pertimbangan, serta menyatukan fungsi, bentuk, material, dan detail menjadi satu kesatuan yang memiliki alasan di balik setiap keputusannya. Bukan hanya sesuatu yang selesai untuk kemudian ditinggalkan, tetapi sebuah masterpiece yang kelak digunakan, dihuni, dan menjadi bagian dari cerita serta kehidupan yang mengisinya.'}
              </p>
            </div>

            {/* Bottom 3-Column Stats Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                alignItems: 'center',
                paddingTop: '8px',
              }}
            >
              {statsData.map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingRight: '12px',
                    borderRight: idx < statsData.length - 1 ? '1px solid #cbd5e1' : 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                      fontWeight: 800,
                      color: 'var(--color-primary-300, #005697)',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      marginBottom: '8px',
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      lineHeight: 1.35,
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
