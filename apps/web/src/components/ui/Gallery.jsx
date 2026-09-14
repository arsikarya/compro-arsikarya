import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from 'react-icons/fi';

export default function Gallery({ images = [], title = 'Dokumentasi Visual & Foto Lapangan' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!images || images.length === 0) return null;

  const currentImage = images[selectedIndex] || images[0];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ marginTop: '48px', marginBottom: '64px' }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-neutral-800)', margin: 0 }}>
            {title}
          </h3>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-neutral-400)' }}>
            {selectedIndex + 1} dari {images.length} Foto
          </span>
        </div>
      )}

      {/* Main Showcase Stage (Dribbble Style Preview Frame) */}
      <div 
        className="dribbble-showcase-stage"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(320px, 48vw, 520px)',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          border: '1px solid var(--color-neutral-200)',
          boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
          cursor: 'pointer',
        }}
        onClick={() => setLightboxOpen(true)}
      >
        <img 
          src={currentImage} 
          alt={`Foto Lapangan ${selectedIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Subtle Gradient Shadow Layer */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.25) 100%)',
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Floating Left Arrow Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Foto Sebelumnya"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              color: 'var(--color-neutral-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              opacity: isHovered ? 1 : 0.85,
              transition: 'all 0.25s ease',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = 'var(--color-primary-300)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
              e.currentTarget.style.color = 'var(--color-neutral-800)';
            }}
          >
            <FiChevronLeft />
          </button>
        )}

        {/* Floating Right Arrow Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Foto Selanjutnya"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              color: 'var(--color-neutral-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              opacity: isHovered ? 1 : 0.85,
              transition: 'all 0.25s ease',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = 'var(--color-primary-300)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
              e.currentTarget.style.color = 'var(--color-neutral-800)';
            }}
          >
            <FiChevronRight />
          </button>
        )}

        {/* Top Right Maximize Badge */}
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            padding: '8px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <FiMaximize2 />
          <span>Perbesar</span>
        </div>
      </div>

      {/* Dribbble Style Clickable Thumbnail Selector Strip */}
      {images.length > 1 && (
        <div 
          style={{ 
            display: 'flex', 
            gap: '16px', 
            marginTop: '8px', 
            overflowX: 'auto',
            padding: '12px 8px 20px 8px',
            margin: '8px -8px 0 -8px',
            scrollbarWidth: 'thin',
          }}
        >
          {images.map((img, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                style={{
                  width: '126px',
                  height: '80px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  padding: 0,
                  border: isActive ? '3px solid var(--color-primary-300)' : '2px solid transparent',
                  backgroundColor: 'var(--color-neutral-100)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  opacity: isActive ? 1 : 0.65,
                  transform: isActive ? 'translateY(-3px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 8px 22px rgba(0, 86, 151, 0.25)' : 'none',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.opacity = '0.65';
                }}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 15, 26, 0.95)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Tutup Preview"
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              color: '#ffffff',
              fontSize: '2rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <FiX />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Foto Sebelumnya"
                style={{
                  position: 'absolute',
                  left: '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#ffffff',
                  fontSize: '2rem',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <FiChevronLeft />
              </button>

              <button
                onClick={handleNext}
                aria-label="Foto Selanjutnya"
                style={{
                  position: 'absolute',
                  right: '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#ffffff',
                  fontSize: '2rem',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <FiChevronRight />
              </button>
            </>
          )}

          <img
            src={currentImage}
            alt="Preview Fullscreen"
            style={{ maxWidth: '92vw', maxHeight: '88vh', borderRadius: '12px', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
