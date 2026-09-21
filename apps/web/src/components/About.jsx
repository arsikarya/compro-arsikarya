import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { lang } = useLanguage();

  const statsData = lang === 'en' ? [
    { value: '100+', label: 'COMPLETED PROJECTS' },
    { value: '100%', label: 'QUALITY COMMITMENT' },
    { value: '5', label: 'SPECIALIZED SERVICES' },
  ] : [
    { value: '100+', label: 'PROYEK SELESAI' },
    { value: '100%', label: 'KOMITMEN MUTU' },
    { value: '5', label: 'LAYANAN SPESIALIS' },
  ];

  return (
    <section
      id="about"
      style={{
        backgroundColor: '#f4f6f9',
        color: '#0f172a',
        padding: 'clamp(140px, 10vw, 200px) 0',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'clamp(60px, 7vw, 110px)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Full Logo & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Full Brand Logo Image (Centered & Prominent) */}
            <div
              style={{
                marginBottom: '48px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <img
                src="/images/logo-full.png"
                alt="PT. Arsi Karya Unggul Logo"
                style={{
                  maxHeight: '268px',
                  maxWidth: '415px',
                  width: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </div>

            {/* Stats Grid at Bottom of Left Column */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                borderTop: '2px solid #cbd5e1',
                paddingTop: '36px',
              }}
            >
              {statsData.map((stat, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: 'clamp(2.3rem, 3.4vw, 3.2rem)',
                      fontWeight: 800,
                      color: '#005697',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      marginBottom: '10px',
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontSize: '0.775rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: '#64748b',
                      textTransform: 'uppercase',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Paragraph Blocks */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '52px',
            }}
          >
            {/* Block 1 */}
            <div>
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#0f172a',
                  marginBottom: '16px',
                }}
              >
                {lang === 'en' ? 'BUILT AROUND YOUR NEEDS' : 'BUILT AROUND YOUR NEEDS'}
              </h3>
              <p
                style={{
                  fontSize: '1.075rem',
                  color: '#475569',
                  lineHeight: 1.85,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {lang === 'en'
                  ? 'With the trust you give us, we will create spaces that truly represent your needs and desires. Every decision is carefully considered, from function and aesthetics to every detail that makes the space feel personal.'
                  : 'Dengan kepercayaan yang Anda berikan, kami akan mewujudkan ruang yang benar-benar merepresentasikan kebutuhan dan keinginan Anda. Setiap keputusan kami pertimbangkan dengan cermat, dari fungsi dan estetika hingga setiap detail yang menjadikan ruang tersebut terasa personal.'}
              </p>
            </div>

            {/* Block 2 */}
            <div>
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#0f172a',
                  marginBottom: '16px',
                }}
              >
                {lang === 'en' ? 'WHAT REMAINS, A LEGACY' : 'WHAT REMAINS, A LEGACY'}
              </h3>
              <p
                style={{
                  fontSize: '1.075rem',
                  color: '#475569',
                  lineHeight: 1.85,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {lang === 'en'
                  ? 'We develop every space with thorough consideration, bringing function, form, material, and detail into a unified whole with purpose behind every decision. Not just something finished to be left behind, but a masterpiece to be used, inhabited, and become part of the story and life within it.'
                  : 'Setiap ruang kami kembangkan dengan penuh pertimbangan, serta menyatukan fungsi, bentuk, material, dan detail menjadi satu kesatuan yang memiliki alasan di balik setiap keputusannya. Bukan hanya sesuatu yang selesai untuk kemudian ditinggalkan, tetapi sebuah masterpiece yang kelak digunakan, dihuni, dan menjadi bagian dari cerita serta kehidupan yang mengisinya.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
