import React from 'react';
import SectionTag from '../components/ui/SectionTag';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <>
      <SEOHead title="404 — Halaman Tidak Ditemukan | Arsi Karya" />
      <section
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-neutral-50)',
          paddingTop: 'calc(var(--header-height) + 40px)',
          paddingBottom: '80px',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '600px' }}>
          <SectionTag>ERROR 404</SectionTag>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '16px', color: 'var(--color-primary-300)' }}>
            404
          </h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Halaman Tidak Ditemukan</h2>
          <p style={{ color: 'var(--color-neutral-400)', lineHeight: 1.6, marginBottom: '32px' }}>
            Maaf, halaman yang Anda tuju tidak ditemukan atau telah dipindahkan. Silakan kembali ke Halaman Utama atau hubungi tim kami.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button to="/" variant="primary">
              Kembali ke Beranda
            </Button>
            <Button to="/kontak" variant="secondary">
              Hubungi Kontak
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
