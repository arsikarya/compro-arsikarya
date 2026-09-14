import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOHead({
  title = "Arsi Karya — Membangun Tuntas, Unggul Dalam Kualitas",
  description = "Arsi Karya adalah perusahaan jasa konstruksi, design & build (arsitektur, interior, infrastruktur), renovasi, dan pengadaan barang terpercaya berbasis di Bandung, Jawa — Bali.",
  keywords = "konstruksi bandung, kontraktor bandung, design and build, arsitektur bandung, desain interior, renovasi rumah, pengadaan barang",
  canonicalUrl = "https://arsikarya.vercel.app",
  ogType = "website",
  schemaJson,
}) {
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "name": "Arsi Karya",
    "alternateName": "ARSI KARYA",
    "url": "https://arsikarya.vercel.app",
    "logo": "https://arsikarya.vercel.app/logo.png",
    "telephone": "+62-899-7932-802",
    "email": "arsikaryaunggul@gmail.com",
    "slogan": "Membangun Tuntas, Unggul Dalam Kualitas",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage",
      "addressLocality": "Kota Bandung",
      "addressRegion": "Jawa Barat",
      "countryAddress": "ID"
    },
    "sameAs": [
      "https://instagram.com/arsikarya.build"
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://arsikarya.vercel.app/logo.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaJson || defaultSchema)}
      </script>
    </Helmet>
  );
}
