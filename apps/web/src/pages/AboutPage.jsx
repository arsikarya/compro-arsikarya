import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/ui/SEOHead';
import HeroBanner from '../components/ui/HeroBanner';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

export default function AboutPage() {
  const { lang, t } = useLanguage();

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
    <>
      <SEOHead
        title={lang === 'en' ? "About Us — Arsi Karya" : "Tentang Kami — Arsi Karya"}
        description={lang === 'en' 
          ? "PT Arsi Karya Unggul profile: General construction, renovation, and Design & Build company in Bandung, Java — Bali." 
          : "Profil PT Arsi Karya Unggul: Perusahaan jasa kontraktor umum, renovasi, dan Design & Build di Bandung, Jawa — Bali."}
      />

      {/* Top Banner (Kept intact) */}
      <HeroBanner
        bgImage="/images/about-hero.jpg"
        overlayOpacity={0.65}
        tag={t.aboutPage?.heroTag || "TENTANG PERUSAHAAN"}
        title={t.aboutPage?.heroTitle || "Tentang Arsi Karya"}
        subtitle={t.aboutPage?.heroSubtitle || "“Membangun Tuntas, Unggul Dalam Kualitas”"}
      />

      {/* Main Content Section - White Background */}
      <section
        style={{
          backgroundColor: '#ffffff',
          color: '#0f172a',
          padding: 'clamp(60px, 8vw, 100px) 0',
          position: 'relative',
        }}
      >
        <div className="container" style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div
            className="about-50-50-grid"
            style={{
              gap: 'clamp(32px, 4vw, 56px)',
              alignItems: 'start',
            }}
          >
            {/* Left Column: 50% Width (3-Image Collage Grid) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  width: '100%',
                }}
              >
                {/* 1 Tall Vertical Image on Left (Construction Site) */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '480px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <img
                    src="/images/about_collage_1.jpg"
                    alt="PT. Arsi Karya Unggul Construction Process"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>

                {/* 2 Stacked Horizontal Images on Right */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {/* Top Right: Bathroom Interior */}
                  <div
                    style={{
                      flex: 1,
                      minHeight: '230px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <img
                      src="/images/about_collage_2.jpg"
                      alt="PT. Arsi Karya Unggul Bathroom Finishing"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                  {/* Bottom Right: Swimming Pool & Pergola */}
                  <div
                    style={{
                      flex: 1,
                      minHeight: '230px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <img
                      src="/images/about_collage_3.jpg"
                      alt="PT. Arsi Karya Unggul Pool & Landscape"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: 50% Width (Deskripsi, Visi, Misi & Stats) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '36px',
              }}
            >
              {/* Deskripsi Block (Unbolded) */}
              <div>
                <p
                  style={{
                    fontSize: '1.05rem',
                    color: '#334155',
                    lineHeight: 1.85,
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  {lang === 'en' ? (
                    <>
                      <strong>PT Arsi Karya Unggul</strong> operates in design and construction, with services covering planning, architectural design, renovation, to complete building construction. We develop every project by understanding client needs and character, ensuring every decision has clear consideration. Through structured processes, open communication, and responsible management, we create a building experience that provides peace of mind from start to project completion.
                    </>
                  ) : (
                    <>
                      <strong>PT Arsi Karya Unggul</strong> bergerak di bidang desain dan konstruksi, dengan layanan yang mencakup perencanaan, desain, renovasi, hingga pembangunan. Kami mengembangkan setiap proyek dengan memahami kebutuhan dan karakter klien, serta memastikan setiap keputusan memiliki pertimbangan yang jelas. Melalui proses yang terstruktur, komunikasi yang terbuka, dan pengelolaan yang bertanggung jawab, kami menciptakan pengalaman membangun yang memberikan rasa aman sejak awal hingga proyek selesai.
                    </>
                  )}
                </p>
              </div>

              {/* Visi Block (Unbolded) */}
              <div>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#0f172a',
                    marginBottom: '12px',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {lang === 'en' ? 'VISION' : 'VISI'}
                </h3>
                <p
                  style={{
                    fontSize: '1.05rem',
                    color: '#334155',
                    lineHeight: 1.8,
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  {lang === 'en' ? (
                    "To become a trusted contractor providing certainty and peace of mind for clients through every work process"
                  ) : (
                    "Menjadi kontraktor terpercaya yang memberikan kepastian dan rasa aman bagi klien melalui setiap proses pekerjaan"
                  )}
                </p>
              </div>

              {/* Misi Block (Unbolded) */}
              <div>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#0f172a',
                    marginBottom: '16px',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {lang === 'en' ? 'MISSION' : 'MISI'}
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {lang === 'en' ? (
                    <>
                      <li style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#005697', fontWeight: 800 }}>•</span>
                        <span>Apply transparency in costs, materials, and work progress.</span>
                      </li>
                      <li style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#005697', fontWeight: 800 }}>•</span>
                        <span>Maintain work quality according to standards and agreements.</span>
                      </li>
                      <li style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#005697', fontWeight: 800 }}>•</span>
                        <span>Provide certainty through clear planning and communication.</span>
                      </li>
                      <li style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#005697', fontWeight: 800 }}>•</span>
                        <span>Be responsible for work until complete handover.</span>
                      </li>
                      <li style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#005697', fontWeight: 800 }}>•</span>
                        <span>Build long-term relationships through trust and professional service.</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#005697', fontWeight: 800 }}>•</span>
                        <span>Menerapkan transparansi dalam biaya, material, dan progres pekerjaan.</span>
                      </li>
                      <li style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#005697', fontWeight: 800 }}>•</span>
                        <span>Menjaga kualitas pekerjaan sesuai standar dan kesepakatan.</span>
                      </li>
                      <li style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#005697', fontWeight: 800 }}>•</span>
                        <span>Memberikan kepastian melalui perencanaan dan komunikasi yang jelas.</span>
                      </li>
                      <li style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#005697', fontWeight: 800 }}>•</span>
                        <span>Bertanggung jawab terhadap pekerjaan hingga tuntas.</span>
                      </li>
                      <li style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#005697', fontWeight: 800 }}>•</span>
                        <span>Membangun hubungan jangka panjang melalui kepercayaan dan pelayanan yang profesional.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Stats Section below Visi Misi */}
              <div
                style={{
                  borderTop: '2px solid #e2e8f0',
                  paddingTop: '36px',
                  marginTop: '16px',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '24px',
                  }}
                >
                  {statsData.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        backgroundColor: '#f8fafc',
                        padding: '20px 24px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 'clamp(2.2rem, 3.2vw, 2.8rem)',
                          fontWeight: 800,
                          color: '#005697',
                          lineHeight: 1,
                          letterSpacing: '-0.02em',
                          marginBottom: '8px',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {stat.value}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          color: '#64748b',
                          textTransform: 'uppercase',
                        }}
                      >
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
