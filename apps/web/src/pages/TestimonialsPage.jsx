import React, { useState, useEffect } from 'react';
import SEOHead from '../components/ui/SEOHead';
import HeroBanner from '../components/ui/HeroBanner';
import { publicApi } from '../lib/api';
import { getTestimonialsData } from '../data/testimonialsData';
import { useLanguage } from '../context/LanguageContext';

export default function TestimonialsPage() {
  const { lang, t } = useLanguage();
  const rawList = getTestimonialsData(lang);
  const defaultItems = rawList.map(item => ({
    id: item.id,
    quote: item.content,
    clientName: item.name,
    clientRole: item.role,
    imageUrl: item.avatar,
  }));

  const [testimonials, setTestimonials] = useState(defaultItems);

  useEffect(() => {
    setTestimonials(defaultItems);
  }, [lang]);

  useEffect(() => {
    publicApi.getTestimonials()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => ({
            id: item.id,
            quote: lang === 'en' ? (item.contentEn || item.quote || item.content) : (item.quote || item.content),
            clientName: lang === 'en' ? (item.nameEn || item.clientName) : item.clientName,
            clientRole: lang === 'en' ? (item.roleEn || item.clientRole || item.projectName) : (item.clientRole || item.projectName || 'Klien Arsi Karya'),
            imageUrl: item.imageUrl || item.avatar || '/projects/project_2.jpg',
          }));
          setTestimonials(mapped);
        }
      })
      .catch(() => {});
  }, [lang]);

  return (
    <>
      <SEOHead
        title={lang === 'en' ? "Client Testimonials — Arsi Karya" : "Testimoni Klien — Arsi Karya"}
        description={lang === 'en' ? "Direct reviews and client testimonials on working with Arsi Karya." : "Ulasan dan testimoni langsung pengalaman klien bekerja sama dengan Arsi Karya."}
      />

      {/* Dark Architectural Hero Banner */}
      <HeroBanner
        bgImage="/projects/project_6.jpg"
        overlayOpacity={0.65}
        tag={t.testimonialsPage?.heroTag || "TESTIMONI KLIEN"}
        title={t.testimonialsPage?.heroTitle || "Pengalaman Bekerjasama"}
        subtitle={t.testimonialsPage?.heroSubtitle || "Kepuasan dan kepercayaan klien adalah tolok ukur utama keberhasilan pengerjaan proyek kami."}
      />

      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
        <div className="container">


          {/* Testimonial Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '32px',
            }}
          >
            {testimonials.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '16px',
                  border: '1px solid var(--color-neutral-200)',
                  padding: '32px',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'stretch',
                  gap: '24px',
                }}
              >
                {/* Left Side: Quote, Divider, Name, Profession */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      color: 'var(--color-neutral-600)',
                      margin: 0,
                    }}
                  >
                    "{item.quote}"
                  </p>

                  <div style={{ marginTop: '24px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '2px',
                        backgroundColor: '#c48b59',
                        marginBottom: '16px',
                      }}
                    />
                    <h4
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: 'var(--color-neutral-800)',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {item.clientName}
                    </h4>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-neutral-400)',
                        margin: 0,
                      }}
                    >
                      {item.clientRole || (lang === 'en' ? 'Arsi Karya Client' : 'Klien Arsi Karya')}
                    </p>
                  </div>
                </div>

                {/* Right Side: Photo */}
                <div
                  style={{
                    width: '180px',
                    minWidth: '180px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-neutral-100)',
                  }}
                >
                  <img
                    src={item.imageUrl || '/projects/project_2.jpg'}
                    alt={item.clientName}
                    onError={(e) => {
                      e.currentTarget.src = '/projects/project_2.jpg';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
