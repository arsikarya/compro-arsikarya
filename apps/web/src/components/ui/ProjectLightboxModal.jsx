import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiMapPin, FiTag } from 'react-icons/fi';

export default function ProjectLightboxModal({ project, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = useMemo(() => {
    if (!project) return [];
    const list = [];
    const mainImg = project.coverImageUrl || project.thumbnail || project.image;
    if (mainImg) list.push(mainImg);

    if (Array.isArray(project.gallery)) {
      project.gallery.forEach((item) => {
        const url = typeof item === 'string' ? item : item?.url;
        if (url && !list.includes(url)) {
          list.push(url);
        }
      });
    }

    return list.length > 0 ? list : ['/projects/project_1.jpg'];
  }, [project]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  if (!project) return null;

  const currentImage = images[currentIndex] || images[0];
  const title = project.title || 'Proyek Arsi Karya';
  const location = project.location || project.city || 'Bandung, Jawa Barat';
  const category = project.category || project.categoryName || 'Konstruksi & Design';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px',
          boxSizing: 'border-box',
        }}
        onClick={onClose}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            width: '100%',
            maxWidth: '1280px',
            margin: '0 auto',
            color: '#ffffff',
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff', lineHeight: 1.3 }}>
              {title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FiMapPin style={{ color: '#38bdf8' }} /> {location}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FiTag style={{ color: '#38bdf8' }} /> {category}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {images.length > 1 && (
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#94a3b8', background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '20px' }}>
                {currentIndex + 1} / {images.length}
              </span>
            )}
            <button
              onClick={onClose}
              aria-label="Tutup"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.4rem',
                transition: 'background 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Center Main Carousel Display */}
        <div
          style={{
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '1280px',
            margin: '16px auto',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              aria-label="Gambar Sebelumnya"
              style={{
                position: 'absolute',
                left: '12px',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.6rem',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#005697';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.55)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiChevronLeft />
            </button>
          )}

          {/* Active Image */}
          <div
            style={{
              width: '100%',
              height: '100%',
              maxHeight: 'calc(100vh - 210px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              src={currentImage}
              alt={`${title} - Foto ${currentIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              aria-label="Gambar Selanjutnya"
              style={{
                position: 'absolute',
                right: '12px',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.6rem',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#005697';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.55)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiChevronRight />
            </button>
          )}
        </div>

        {/* Bottom Thumbnail Navigation Strip */}
        {images.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              overflowX: 'auto',
              padding: '10px 0 4px 0',
              maxWidth: '1280px',
              margin: '0 auto',
              width: '100%',
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  padding: 0,
                  border: currentIndex === idx ? '2px solid #38bdf8' : '2px solid transparent',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  opacity: currentIndex === idx ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  background: 'none',
                  flexShrink: 0,
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{
                    width: '64px',
                    height: '44px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
