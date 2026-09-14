import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import Button from './ui/Button';
import { getGeneralWaUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const location = useLocation();
  const { lang, toggleLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const progress = Math.min(1, Math.max(0, currentScroll / 120));
      setScrollProgress(progress);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const generalWaUrl = getGeneralWaUrl();

  const isHomePage = location.pathname === '/';
  const effectiveProgress = isHomePage ? scrollProgress : 1;

  // Color Interpolation Helper
  const navR = Math.round(255 - effectiveProgress * (255 - 34));
  const navG = Math.round(255 - effectiveProgress * (255 - 34));
  const navB = Math.round(255 - effectiveProgress * (255 - 34));
  const navTextColor = `rgb(${navR}, ${navG}, ${navB})`;

  const activeR = Math.round(255 - effectiveProgress * (255 - 0));
  const activeG = Math.round(255 - effectiveProgress * (255 - 86));
  const activeB = Math.round(255 - effectiveProgress * (255 - 151));
  const activeTextColor = `rgb(${activeR}, ${activeG}, ${activeB})`;

  const bgOpacity = (effectiveProgress * 0.96).toFixed(3);
  const backdropBlur = (effectiveProgress * 12).toFixed(1);
  const borderOpacity = (effectiveProgress * 0.08).toFixed(3);
  const shadowOpacity = (effectiveProgress * 0.06).toFixed(3);

  // Exact 5 Primary Services in Navbar
  const navLinks = [
    { name: t.nav.home, to: '/' },
    { name: t.nav.about, to: '/tentang-kami' },
    {
      name: t.nav.services,
      to: '/layanan',
      hasDropdown: true,
      subItems: [
        { name: lang === 'en' ? 'Architecture & Planning' : 'Perencanaan', to: '/layanan/perencanaan' },
        { name: lang === 'en' ? 'General Construction' : 'Konstruksi', to: '/layanan/konstruksi' },
        { name: 'Design & Build', to: '/layanan/design-build' },
        { name: lang === 'en' ? 'Renovation' : 'Renovasi', to: '/layanan/renovasi' },
        { name: lang === 'en' ? 'Landscape & Garden' : 'Landscape', to: '/layanan/landscape' },
      ],
    },
    { name: t.nav.projects, to: '/proyek' },
    { name: t.nav.testimonials, to: '/testimoni' },
    { name: t.nav.articles, to: '/artikel' },
    { name: t.nav.contact, to: '/kontak' },
  ];

  return (
    <header
      className="navbar-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: '80px',
        backgroundColor: `rgba(245, 245, 245, ${bgOpacity})`,
        backdropFilter: scrollProgress > 0 ? `blur(${backdropBlur}px) saturate(180%)` : 'none',
        WebkitBackdropFilter: scrollProgress > 0 ? `blur(${backdropBlur}px) saturate(180%)` : 'none',
        borderBottom: `1px solid rgba(0, 0, 0, ${borderOpacity})`,
        boxShadow: `0 4px 20px rgba(0, 0, 0, ${shadowOpacity})`,
        transition: 'background-color 0.1s linear, backdrop-filter 0.1s linear',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/logo.png"
            alt="Arsi Karya Logo"
            style={{
              height: '36px',
              objectFit: 'contain',
              filter:
                effectiveProgress < 1
                  ? `brightness(${effectiveProgress.toFixed(2)}) invert(${(1 - effectiveProgress).toFixed(2)})`
                  : 'none',
              transition: 'filter 0.1s linear',
            }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link, idx) => (
            <div
              key={idx}
              style={{ position: 'relative', height: '80px', display: 'flex', alignItems: 'center' }}
              onMouseEnter={() => link.hasDropdown && setActiveDropdown(true)}
              onMouseLeave={() => link.hasDropdown && setActiveDropdown(false)}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? 'active-nav-item' : ''}`
                }
                style={({ isActive }) => ({
                  position: 'relative',
                  fontSize: '0.925rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? activeTextColor : navTextColor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '12px 0',
                  letterSpacing: '0.01em',
                  transition: 'color 0.1s linear',
                })}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {link.hasDropdown && (
                      <FiChevronDown
                        style={{
                          fontSize: '0.9rem',
                          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: activeDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Seamless Dropdown (No Hover Gap Bug) */}
              {link.hasDropdown && activeDropdown && (
                <div
                  className="dropdown-menu-anim"
                  style={{
                    position: 'absolute',
                    top: '72px',
                    left: '-16px',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
                    borderRadius: '12px',
                    padding: '10px 0',
                    minWidth: '240px',
                    border: '1px solid var(--color-neutral-200)',
                    zIndex: 1010,
                  }}
                  onMouseEnter={() => setActiveDropdown(true)}
                  onMouseLeave={() => setActiveDropdown(false)}
                >
                  {link.subItems.map((sub, sIdx) => (
                    <Link
                      key={sIdx}
                      to={sub.to}
                      style={{
                        display: 'block',
                        padding: '10px 20px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--color-neutral-600)',
                        transition: 'background 0.2s ease, color 0.2s ease, padding-left 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary-100)';
                        e.currentTarget.style.color = 'var(--color-primary-300)';
                        e.currentTarget.style.paddingLeft = '24px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-neutral-600)';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right CTA, Social Icons & Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Simple & Minimal Language Switcher (Left of Instagram logo) */}
          <button
            onClick={toggleLang}
            title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            aria-label="Toggle Language"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '20px',
              border: `1px solid ${effectiveProgress < 1 ? 'rgba(255, 255, 255, 0.35)' : 'var(--color-neutral-300)'}`,
              backgroundColor: 'transparent',
              color: navTextColor,
              fontSize: '0.775rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.04em',
              boxShadow: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = effectiveProgress < 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>{lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
          </button>

          {/* Social Links */}
          <div
            className="header-socials"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginRight: '2px',
            }}
          >
            <a
              href="https://instagram.com/arsikarya.build"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Arsi Karya"
              style={{
                color: navTextColor,
                fontSize: '1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.1s linear, transform 0.2s ease',
                padding: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FaInstagram />
            </a>

            <a
              href="https://tiktok.com/@arsikarya.build"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Arsi Karya"
              style={{
                color: navTextColor,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.1s linear, transform 0.2s ease',
                padding: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FaTiktok />
            </a>
          </div>

          <Button
            href={generalWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className="desktop-cta"
            style={{
              padding: '11px 22px',
              fontSize: '0.9rem',
              boxShadow: 'none',
            }}
          >
            {t.nav.ctaConsultation}
          </Button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: 'none',
              fontSize: '1.8rem',
              color: navTextColor,
              padding: '4px',
              transition: 'color 0.1s linear',
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid var(--color-neutral-200)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
            zIndex: 999,
            animation: 'mobileDrawerSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-neutral-400)' }}>BAHASA / LANGUAGE</span>
            <button
              onClick={toggleLang}
              style={{
                padding: '4px 12px',
                borderRadius: '16px',
                border: '1px solid var(--color-neutral-200)',
                backgroundColor: 'var(--color-neutral-100)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--color-neutral-800)',
              }}
            >
              {lang === 'id' ? '🇮🇩 ID (Ubah ke EN)' : '🇬🇧 EN (Switch to ID)'}
            </button>
          </div>

          {navLinks.map((link, idx) => (
            <div key={idx}>
              <Link
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-neutral-700)',
                  display: 'block',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--color-neutral-100)',
                }}
              >
                {link.name}
              </Link>
              {link.hasDropdown && (
                <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {link.subItems.map((sub, sIdx) => (
                    <Link
                      key={sIdx}
                      to={sub.to}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-neutral-600)',
                        padding: '4px 0',
                      }}
                    >
                      • {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button
            href={generalWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            onClick={() => setMobileMenuOpen(false)}
            style={{ marginTop: '16px', justifyContent: 'center', width: '100%' }}
          >
            {t.nav.ctaConsultation}
          </Button>
        </div>
      )}

      <style>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .dropdown-menu-anim {
          animation: dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes mobileDrawerSlideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 991px) {
          .desktop-nav { display: none !important; }
          .header-socials { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
