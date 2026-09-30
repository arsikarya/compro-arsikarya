import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOHead({
  title = "ARSI KARYA — Jasa Kontraktor & Bangun Rumah di Bandung & Bali",
  description = "Arsi Karya adalah kontraktor jasa bangun rumah, villa, renovasi, dan design & build terpercaya di Bandung & Bali. Konsultasi rancang bangun bergaransi mutu.",
  keywords = "jasa bangun rumah bandung, kontraktor rumah bandung, jasa bangun rumah bali, kontraktor bali, jasa bangun villa bali, kontraktor rumah mewah bandung, jasa renovasi rumah bandung, arsitek bandung, design and build bandung, jasa konstruksi bandung, jasa konstruksi bali, kontraktor arsi karya, arsi karya unggul, arsitektur interior bandung bali",
  canonicalUrl = "https://arsikarya.vercel.app",
  ogType = "website",
  ogImage = "https://arsikarya.vercel.app/og-image.jpg",
  schemaJson,
}) {
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
    "name": "ARSI KARYA",
    "alternateName": ["Arsi Karya", "PT Arsi Karya Unggul", "Kontraktor Arsi Karya"],
    "url": "https://arsikarya.vercel.app",
    "logo": "https://arsikarya.vercel.app/logo.png",
    "image": ogImage,
    "telephone": "+62-899-7932-802",
    "email": "webarsikarya@gmail.com",
    "slogan": "Membangun Tuntas, Unggul Dalam Kualitas",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage",
      "addressLocality": "Kota Bandung",
      "addressRegion": "Jawa Barat",
      "postalCode": "40296",
      "addressCountry": "ID"
    },
    "areaServed": [
      { "@type": "City", "name": "Bandung" },
      { "@type": "AdministrativeArea", "name": "Jawa Barat" },
      { "@type": "AdministrativeArea", "name": "Bali" },
      { "@type": "City", "name": "Denpasar" },
      { "@type": "AdministrativeArea", "name": "Badung" }
    ],
    "sameAs": [
      "https://instagram.com/arsikarya.build",
      "https://tiktok.com/@arsikarya.build"
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="ARSI KARYA" />
      <meta property="og:locale" content="id_ID" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="576" />
      <meta property="og:image:alt" content={title} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaJson || defaultSchema)}
      </script>
    </Helmet>
  );
}
