import React from 'react';
import SectionTag from '../components/ui/SectionTag';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import HeroBanner from '../components/ui/HeroBanner';
import { FiCheckCircle, FiTarget, FiCompass, FiShield, FiAward, FiEye } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { lang, t } = useLanguage();

  const visiMisiPoints = lang === 'en' ? [
    {
      title: "Quality Standards & Precision",
      desc: "Prioritizing precise material specifications, measured engineering analysis, and strict QC supervision at every construction stage.",
      icon: <FiCheckCircle style={{ color: 'var(--color-primary-300)', fontSize: '1.25rem' }} />
    },
    {
      title: "Transparency & Integrity",
      desc: "Presenting honest, structured Bill of Quantities (RAB) and delivering transparent periodic progress reports.",
      icon: <FiShield style={{ color: 'var(--color-primary-300)', fontSize: '1.25rem' }} />
    },
    {
      title: "Design Innovation & Functionality",
      desc: "Combining modern architectural aesthetics with practical space functionality to create long-term investment value.",
      icon: <FiCompass style={{ color: 'var(--color-primary-300)', fontSize: '1.25rem' }} />
    },
    {
      title: "Safety & Post-Handover Warranty",
      desc: "Ensuring site work safety and providing official maintenance warranty after Handover (BAST).",
      icon: <FiAward style={{ color: 'var(--color-primary-300)', fontSize: '1.25rem' }} />
    }
  ] : [
    {
      title: "Standar Mutu & Presisi",
      desc: "Mengedepankan ketepatan spesifikasi bahan, analisis teknik terukur, dan pengawasan QC ketat di setiap tahap pembangunan.",
      icon: <FiCheckCircle style={{ color: 'var(--color-primary-300)', fontSize: '1.25rem' }} />
    },
    {
      title: "Transparansi & Kejujuran",
      desc: "Menyajikan Rencana Anggaran Biaya (RAB) yang terstruktur, jujur, serta memberikan laporan progres berkala yang transparan.",
      icon: <FiShield style={{ color: 'var(--color-primary-300)', fontSize: '1.25rem' }} />
    },
    {
      title: "Inovasi Desain & Fungsionalitas",
      desc: "Memadukan estetika arsitektur modern dengan kepraktisan fungsi ruang untuk menciptakan nilai investasi jangka panjang.",
      icon: <FiCompass style={{ color: 'var(--color-primary-300)', fontSize: '1.25rem' }} />
    },
    {
      title: "Keamanan & Garansi Purna Kerja",
      desc: "Menjamin keselamatan kerja di lapangan serta memberikan garansi pemeliharaan resmi pasca Berita Acara Serah Terima (BAST).",
      icon: <FiAward style={{ color: 'var(--color-primary-300)', fontSize: '1.25rem' }} />
    }
  ];

  return (
    <>
      <SEOHead
        title={lang === 'en' ? "About Us — Arsi Karya" : "Tentang Kami — Arsi Karya"}
        description={lang === 'en' ? "Arsi Karya Profile: General construction, renovation, and Design & Build company in Bandung, Java — Bali focused on structured workflows and tested quality." : "Profil Arsi Karya: Perusahaan jasa kontraktor umum, renovasi, dan Design & Build di Bandung, Jawa — Bali berfokus pada alur terstruktur dan kualitas teruji."}
      />

      {/* Dark Architectural Hero Banner */}
      <HeroBanner
        bgImage="/projects/project_2.jpg"
        overlayOpacity={0.65}
        tag={t.aboutPage?.heroTag || "TENTANG PERUSAHAAN"}
        title={t.aboutPage?.heroTitle || "Tentang Arsi Karya"}
        subtitle={t.aboutPage?.heroSubtitle || "“Membangun Tuntas, Unggul Dalam Kualitas”"}
      />

      {/* Company Positioning & Profile */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <SectionTag>{t.aboutPage?.profileTag || 'PROFIL PERUSAHAAN'}</SectionTag>
              <h2>{t.aboutPage?.profileTitle || 'Komitmen Profesionalisme dalam Dunia Konstruksi'}</h2>
              <p style={{ marginTop: '20px', lineHeight: 1.7, color: 'var(--color-neutral-500)' }}>
                {t.aboutPage?.profileBody1 || 'ARSI KARYA adalah perusahaan jasa konstruksi...'}
              </p>
              <p style={{ marginTop: '16px', lineHeight: 1.7, color: 'var(--color-neutral-500)' }}>
                {t.aboutPage?.profileBody2 || 'Kami memadukan kemampuan kompetensi teknis...'}
              </p>

              <div style={{ marginTop: '32px' }}>
                <Button to="/kontak" variant="primary">
                  {lang === 'en' ? 'Consult With Us' : 'Konsultasi Bersama Kami'}
                </Button>
              </div>
            </div>

            <div>
              {/* Architectural Visual Feature Banner */}
              <div style={{ height: '240px', borderRadius: 'var(--radius-card)', overflow: 'hidden', marginBottom: '24px', position: 'relative', border: '1px solid var(--color-neutral-200)' }}>
                <img src="/projects/project_3.jpg" alt="Arsi Karya Office & Projects" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '16px 20px', color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>
                  {lang === 'en' ? 'Arsi Karya Building & Projects' : 'Gedung & Proyek Arsi Karya'}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--color-neutral-50)', padding: '32px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-neutral-200)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--color-primary-300)' }}>{lang === 'en' ? 'Company Identity' : 'Identitas Perusahaan'}</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.925rem' }}>
                  <li>
                    <strong style={{ color: 'var(--color-neutral-700)' }}>{lang === 'en' ? 'Brand Name:' : 'Brand Dagang:'}</strong><br />
                    ARSI KARYA
                  </li>
                  <li>
                    <strong style={{ color: 'var(--color-neutral-700)' }}>{lang === 'en' ? 'Main Slogan:' : 'Slogan Utama:'}</strong><br />
                    {lang === 'en' ? '“Building Thoroughly, Superior in Quality”' : '“Membangun Tuntas, Unggul Dalam Kualitas”'}
                  </li>
                  <li>
                    <strong style={{ color: 'var(--color-neutral-700)' }}>{lang === 'en' ? 'Operational Region:' : 'Wilayah Operasional:'}</strong><br />
                    Bandung, Java — Bali
                  </li>
                  <li>
                    <strong style={{ color: 'var(--color-neutral-700)' }}>{lang === 'en' ? 'Office Address:' : 'Alamat Kantor:'}</strong><br />
                    Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Bandung.
                  </li>
                  <li>
                    <strong style={{ color: 'var(--color-neutral-700)' }}>{lang === 'en' ? 'Core Services:' : 'Layanan Utama:'}</strong><br />
                    {lang === 'en' ? 'Planning, Construction, Design & Build, Renovation, Landscape' : 'Perencanaan, Konstruksi, Design & Build, Renovasi, Landscape'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aesthetic Visi & Misi Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-50)', borderTop: '1px solid var(--color-neutral-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px auto' }}>
            <SectionTag>{t.aboutPage?.visiMisiTag || 'VISI & MISI'}</SectionTag>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--color-neutral-800)' }}>
              {lang === 'en' ? 'Commitment Foundation & Future Direction' : 'Landasan Komitmen & Arah Masa Depan'}
            </h2>
            <p style={{ color: 'var(--color-neutral-400)', marginTop: '14px', fontSize: '1.05rem', lineHeight: 1.6 }}>
              {lang === 'en' ? 'To be a trusted construction and design partner delivering sturdy, aesthetic, efficient, and sustainable projects.' : 'Menjadi mitra konstruksi dan perancangan terpercaya yang menghadirkan karya fisik kokoh, estetis, efisien, dan berkelanjutan.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'stretch' }}>
            {/* Left Card: VISI PERUSAHAAN */}
            <div
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-neutral-200)',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                <img
                  src="/projects/project_4.jpg"
                  alt="Arsi Karya Visi Feature"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,86,151,0.85) 0%, rgba(0,86,151,0.2) 100%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '24px',
                    color: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiEye style={{ fontSize: '1.8rem' }} />
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>{t.aboutPage?.visiTag || 'VISI UTAMA'}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '36px 32px 40px 32px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, WebkitTextStroke: '0.35px currentColor', letterSpacing: '-0.02em', fontFamily: 'var(--font-body)', color: 'var(--color-neutral-800)', marginBottom: '16px', lineHeight: 1.3 }}>
                  {t.aboutPage?.visiTitle || 'Menjadi Pelaksana Konstruksi...'}
                </h3>
                <p style={{ color: 'var(--color-neutral-500)', lineHeight: 1.7, fontSize: '0.975rem' }}>
                  {t.aboutPage?.visiBody || 'Kami bertekad menjadi entitas...'}
                </p>
              </div>
            </div>

            {/* Right Card: MISI PERUSAHAAN List */}
            <div
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-neutral-200)',
                padding: '36px 32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                  <FiTarget />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-body)', color: 'var(--color-neutral-800)', letterSpacing: '0.04em' }}>
                  {t.aboutPage?.misiTag || 'MISI PERUSAHAAN'}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {visiMisiPoints.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-body)', color: 'var(--color-neutral-800)', marginBottom: '4px' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-500)', lineHeight: 1.5 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
