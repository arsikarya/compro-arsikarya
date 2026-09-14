import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import News from '../components/News';
import CTA from '../components/CTA';
import SEOHead from '../components/ui/SEOHead';

export default function Home() {
  return (
    <>
      <SEOHead
        title="Arsi Karya — Membangun Tuntas, Unggul Dalam Kualitas"
        description="Arsi Karya adalah perusahaan jasa konstruksi, design & build (arsitektur & interior), renovasi, dan pengadaan barang terpercaya di Bandung, Jawa — Bali."
      />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Projects />
      <Testimonials />
      <News />
      <CTA />
    </>
  );
}
