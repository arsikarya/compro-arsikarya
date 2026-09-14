import React from 'react';
import Breadcrumb from './Breadcrumb';
import SectionTag from './SectionTag';
import { optimizeImage } from '../../utils/optimizeImage';

/**
 * Reusable Dark Architectural Hero Banner
 */
export default function HeroBanner({
  bgImage,
  overlayOpacity = 0.65,
  breadcrumbItems = [],
  tag,
  title,
  subtitle,
  children,
  style = {},
  imageAlt = "Arsi Karya",
}) {
  const optimizedBg = optimizeImage(bgImage);

  return (
    <section
      style={{
        position: 'relative',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        paddingTop: 'calc(var(--header-height) + 48px)',
        paddingBottom: '72px',
        overflow: 'hidden',
        minHeight: '340px',
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
    >
      {/* Real Background Image */}
      {optimizedBg && (
        <img
          src={optimizedBg}
          alt={imageAlt}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 1,
          }}
          loading="eager"
        />
      )}

      {/* Dark Overlay Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: `rgba(10, 16, 26, ${overlayOpacity})`,
          backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 16, 26, 0.60) 50%, rgba(15, 23, 42, 0.85) 100%)',
          zIndex: 2,
        }}
      />

      {/* Content Container */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
        }}
      >
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <Breadcrumb items={breadcrumbItems} />
        )}

        {tag && <SectionTag light>{tag}</SectionTag>}

        {title && (
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2.0rem, 4.0vw, 3.4rem)',
              marginBottom: subtitle ? '16px' : '0px',
              lineHeight: 1.28,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
            }}
          >
            {title}
          </h1>
        )}

        {subtitle && (
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: 'var(--color-primary-200)',
              maxWidth: '960px',
              lineHeight: 1.6,
              margin: 0,
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}
