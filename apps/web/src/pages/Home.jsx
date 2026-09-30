import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import HowWeWork from '../components/HowWeWork';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import News from '../components/News';
import CTA from '../components/CTA';
import SEOHead from '../components/ui/SEOHead';

export default function Home() {
  return (
    <>
      <SEOHead
        title="ARSI KARYA — Jasa Kontraktor & Bangun Rumah di Bandung & Bali"
        description="Arsi Karya adalah kontraktor jasa bangun rumah, villa, renovasi, dan design & build terpercaya di Bandung & Bali. Konsultasi rancang bangun bergaransi mutu."
        keywords="jasa bangun rumah bandung, kontraktor rumah bandung, jasa bangun rumah bali, kontraktor bali, jasa bangun villa bali, kontraktor rumah mewah bandung, jasa renovasi rumah bandung, arsitek bandung, design and build bandung, jasa konstruksi bandung, jasa konstruksi bali, kontraktor arsi karya, arsi karya unggul, arsitektur interior bandung bali"
        canonicalUrl="https://arsikarya.vercel.app/"
      />
      <Hero />
      <About />
      <Services />
      <HowWeWork />
      <Projects />
      <Testimonials />
      <News />
      <CTA />
    </>
  );
}
