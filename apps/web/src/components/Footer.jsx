import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Footer() {
  const { lang, t } = useLanguage();
  const { settings, getWaUrl } = useSiteSettings();

  const address = settings?.address || 'Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung.';
  const email = settings?.email || 'arsikaryaunggul@gmail.com';
  const whatsapp = settings?.whatsapp || '+62 899-7932-802';
  const instagram = settings?.instagram || 'arsikarya.build';
  const companyName = settings?.companyName || 'ARSI KARYA';
  const tagline = settings?.tagline || 'Membangun Tuntas, Unggul Dalam Kualitas';
  const waUrl = getWaUrl();

  return (
    <footer style={{ backgroundColor: 'var(--color-dark-bg, #222222)', color: '#A8A8A3', paddingTop: '48px', paddingBottom: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            marginBottom: '32px',
          }}
        >
          {/* Column 1: Brand Logo & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', gridColumn: 'span 2' }}>
            <Link to="/" style={{ display: 'inline-block' }}>
              <img
                src={settings?.logoUrl || "/logo.png"}
                alt="Arsi Karya Logo"
                style={{ height: '38px', objectFit: 'contain' }}
              />
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: '#D9D9D5', maxWidth: '495px', margin: 0 }}>
              <strong style={{ color: '#FFFFFF' }}>{companyName}</strong><br />
              “{tagline}”<br />
              {t.footer?.desc || 'Perusahaan jasa konstruksi, design & build, renovasi, dan pengadaan barang terpercaya berpusat di Bandung, Jawa — Bali.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#D9D9D5', marginTop: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <FaMapMarkerAlt style={{ color: 'var(--color-primary-200)', marginTop: '3px', flexShrink: 0 }} />
                <a
                  href="https://maps.app.goo.gl/p3R2LS88sWNrNqGx7"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#D9D9D5', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D9D9D5')}
                >
                  {address}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaWhatsapp style={{ color: 'var(--color-whatsapp)', flexShrink: 0 }} />
                <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#D9D9D5' }}>{whatsapp}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaEnvelope style={{ color: 'var(--color-primary-200)', flexShrink: 0 }} />
                <a href={`mailto:${email}`} style={{ color: '#D9D9D5' }}>{email}</a>
              </div>
            </div>
          </div>

          {/* Column 2: NAVIGASI UTAMA */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-body)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
              {t.footer?.navTitle || 'NAVIGASI UTAMA'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
              {[
                { name: t.nav?.home || 'Beranda', to: '/' },
                { name: t.nav?.about || 'Tentang Kami', to: '/tentang-kami' },
                { name: t.nav?.services || 'Layanan Utama', to: '/layanan' },
                { name: t.nav?.projects || 'Portofolio Proyek', to: '/proyek' },
                { name: t.nav?.testimonials || 'Testimoni Klien', to: '/testimoni' },
                { name: t.nav?.articles || 'Artikel & Edukasi', to: '/artikel' },
                { name: t.nav?.contact || 'Kontak & Konsultasi', to: '/kontak' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    style={{ fontSize: '0.85rem', color: '#A8A8A3', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#A8A8A3')}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: LAYANAN SPESIALIS */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-body)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
              {t.footer?.servicesTitle || 'LAYANAN KAMI'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
              {[
                { name: t.servicesMenu?.perencanaan || 'Perencanaan', to: '/layanan/perencanaan' },
                { name: t.servicesMenu?.konstruksi || 'Konstruksi', to: '/layanan/konstruksi' },
                { name: t.servicesMenu?.designBuild || 'Design & Build', to: '/layanan/design-build' },
                { name: t.servicesMenu?.renovasi || 'Renovasi', to: '/layanan/renovasi' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    style={{ fontSize: '0.85rem', color: '#A8A8A3', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#A8A8A3')}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.825rem',
            color: '#6B6B67',
          }}
        >
          <div>
            © 2026 <strong style={{ color: '#FFFFFF' }}>ARSI KARYA</strong>. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a
              href="https://instagram.com/arsikarya.build"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#A8A8A3', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#A8A8A3')}
            >
              <FaInstagram /> <span style={{ fontSize: '0.825rem' }}>arsikarya.build</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
