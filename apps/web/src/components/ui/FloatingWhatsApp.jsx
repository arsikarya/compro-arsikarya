import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function FloatingWhatsApp() {
  const { getWaUrl } = useSiteSettings();
  const waUrl = getWaUrl();

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Konsultasi via WhatsApp"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        backgroundColor: 'var(--color-whatsapp)',
        color: '#ffffff',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, background-color 0.2s ease',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.5)';
        e.currentTarget.style.backgroundColor = 'var(--color-whatsapp-dark)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.35)';
        e.currentTarget.style.backgroundColor = 'var(--color-whatsapp)';
      }}
    >
      <FaWhatsapp />
    </a>
  );
}
