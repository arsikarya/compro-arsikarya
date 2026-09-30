import React, { useState, useEffect } from 'react';
import SEOHead from '../components/ui/SEOHead';
import HeroBanner from '../components/ui/HeroBanner';
import CTA from '../components/CTA';
import { publicApi } from '../lib/api';
import { getTestimonialsData } from '../data/testimonialsData';
import { useLanguage } from '../context/LanguageContext';

function getYouTubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.includes('youtube.com/embed/')) {
    const match = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : trimmed;
  }

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  return trimmed;
}

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

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');

  // Fetch site settings for dynamic video testimonial link
  useEffect(() => {
    publicApi.getSettings()
      .then((data) => {
        if (data && typeof data.testimonialVideoUrl === 'string') {
          setVideoUrl(data.testimonialVideoUrl);
        } else {
          setVideoUrl('');
        }
      })
      .catch(() => {
        setVideoUrl('');
      });
  }, []);

  useEffect(() => {
    setLoading(true);
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

          const combined = [...mapped];
          defaultItems.forEach((d) => {
            if (combined.length < 4 && !combined.some((c) => c.clientName === d.clientName)) {
              combined.push(d);
            }
          });
          setTestimonials(combined);
        } else {
          setTestimonials(defaultItems);
        }
      })
      .catch(() => {
        setTestimonials(defaultItems);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  // Limit testimonials to maximum 4 items
  const displayedTestimonials = testimonials.slice(0, 4);

  // Dynamic Video Testimonial Embed URL (hidden completely if empty or invalid)
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const showVideoSection = Boolean(embedUrl);

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
        tag={t.testimonialsPage?.heroTag || "KEPERCAYAAN KLIEN"}
        title={t.testimonialsPage?.heroTitle || "Testimoni Klien"}
        subtitle={t.testimonialsPage?.heroSubtitle || "Kepercayaan dan Kepuasan Pemilik Proyek atas Hasil Kerja Arsi Karya"}
      />

      {/* Testimonial Cards Section (Max 4 items) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-50)', minHeight: '350px' }}>
        <div className="container">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid var(--color-primary-300)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            /* Testimonial Cards Grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
                gap: '32px',
              }}
            >
              {displayedTestimonials.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
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
          )}
        </div>
      </section>

      {/* Video Testimonials YouTube Section - Only rendered if video link is filled and valid */}
      {showVideoSection && (
        <section className="section-padding" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--color-neutral-200)' }}>
          <div className="container" style={{ maxWidth: '960px', textAlign: 'center' }}>
            {/* Centered Line Accent & Tag */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '2px', backgroundColor: 'var(--color-primary-300)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary-300)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {lang === 'en' ? 'VIDEO TESTIMONIAL' : 'VIDEO TESTIMONI'}
              </span>
            </div>

            {/* Section Title (Solid Black Text) */}
            <h2
              style={{
                fontSize: 'clamp(2.1rem, 3.6vw, 2.8rem)',
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 16px 0',
                lineHeight: 1.25,
              }}
            >
              {lang === 'en' ? 'Real Stories from Our Clients' : 'Cerita Nyata dari Klien Kami'}
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--color-neutral-600)',
                maxWidth: '680px',
                margin: '0 auto 44px auto',
                lineHeight: 1.65,
              }}
            >
              {lang === 'en' 
                ? 'Hear directly about their experience working with Arsi Karya, from planning to final results.' 
                : 'Dengarkan langsung pengalaman mereka bekerja sama dengan Arsi Karya, mulai dari proses perencanaan hingga hasil akhir.'}
            </p>

            {/* YouTube Video Player */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
                height: 0,
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
                border: '1px solid #e2e8f0',
                backgroundColor: '#0f172a',
              }}
            >
              <iframe
                src={embedUrl}
                title="Video Testimoni Arsi Karya"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
