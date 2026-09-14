import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang Kami',
      services: 'Layanan',
      projects: 'Proyek',
      testimonials: 'Testimoni',
      articles: 'Artikel',
      contact: 'Kontak',
      ctaConsultation: 'Konsultasi Gratis',
    },
    servicesMenu: {
      perencanaan: 'Perencanaan',
      konstruksi: 'Konstruksi',
      designBuild: 'Design & Build',
      renovasi: 'Renovasi',
      landscape: 'Landscape',
    },
    hero: {
      titleLine1: 'Membangun Tuntas,',
      titleLine2: 'Unggul Dalam Kualitas',
      subtitle: 'Proses yang terstruktur, komunikasi yang jelas, dan kualitas yang terjaga untuk mewujudkan proyek Anda dengan lebih tenang dan terarah.',
      btnProjects: 'Lihat Proyek',
      btnServices: 'Layanan Kami',
      item1: 'KONSTRUKSI',
      item2: 'DESIGN & BUILD',
      item3: 'RENOVASI',
    },
    projects: {
      tag: 'PORTOFOLIO UNGGULAN',
      title: 'Rekam Jejak Pekerjaan Konstruksi & Design',
      btnAll: 'Lihat Semua Proyek',
      viewDetail: 'Lihat Detail',
    },
    servicesSection: {
      visionTag: 'VISI PERUSAHAAN',
      visionTitle: 'We know how to deliver your vision',
      visionDesc: 'Arsi Karya menghadirkan layanan konstruksi terpadu dengan eksekusi amanah dan profesional di Bandung, Jawa — Bali.',
      btnServices: 'Layanan Kami',
      expertiseTag: 'LAYANAN SPESIALIS',
      expertiseTitle: 'We construct spaces where amazing things happen',
      learnMore: 'Pelajari Lebih Lanjut',
    },
    about: {
      tag: 'TENTANG KAMI',
      title: 'We create things that matter',
      desc1: 'ARSI KARYA adalah perusahaan jasa konstruksi, renovasi, dan Design & Build berkedudukan di Bandung, Jawa — Bali yang berfokus pada alur kerja terstruktur, eksekusi efisien, pengendalian mutu material, komunikasi jelas, dan kontrol proyek yang konsisten.',
      desc2: 'Kami memadukan kemampuan kompetensi teknis konstruksi dengan kepekaan desain arsitektural untuk memberikan hasil akhir yang kokoh, fungsional, dan bernilai tinggi bagi klien.',
      stat1Num: '100+',
      stat1Text: 'Proyek Selesai',
      stat2Num: '100%',
      stat2Text: 'Komitmen Mutu',
    },
    standards: {
      tag: '— MENGAPA KAMI',
      title: 'We conduct all business with the highest standards',
      desc: 'Setiap proyek dikelola dengan transparansi biaya, ketepatan waktu, dan pemenuhan standar kualifikasi teknis bangunan yang presisi.',
      btnMore: 'PELAJARI LEBIH LANJUT',
    },
    stats: {
      tag: 'SIAPA KAMI',
      title: 'Membangun dengan proses yang terstruktur & terukur',
      desc: 'Arsi Karya memadukan manajemen konstruksi presisi dengan eksekusi efisien. Setiap proyek dikendalikan secara transparan untuk menghasilkan bangunan yang berkualitas dan tahan lama.',
    },
    testimonialsSection: {
      tag: 'TESTIMONI',
      title: 'Apa Kata Klien Kami',
      viewAll: 'Lihat Seluruh Testimoni',
    },
    news: {
      tag: 'LATEST NEWS',
      title: "It's an exciting time in the construction industry",
    },
    cta: {
      tag: 'CONTACT US',
      title: 'Ready to work together?',
      button: 'HUBUNGI KAMI',
    },
    faq: {
      tag: 'PERTANYAAN UMUM',
      title: 'Pertanyaan yang Sering Diajukan',
    },
    footer: {
      companyName: 'ARSI KARYA',
      companyTagline: '“Membangun Tuntas, Unggul Dalam Kualitas”',
      desc: 'Perusahaan jasa konstruksi, design & build, renovasi, dan pengadaan barang terpercaya berpusat di Bandung, Jawa — Bali.',
      address: 'Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung.',
      navTitle: 'NAVIGASI UTAMA',
      servicesTitle: 'LAYANAN KAMI',
      rights: 'All rights reserved.',
    },
    aboutPage: {
      heroTag: 'TENTANG PERUSAHAAN',
      heroTitle: 'Tentang Arsi Karya',
      heroSubtitle: 'Membangun Tuntas, Unggul Dalam Kualitas',
      profileTag: 'PROFIL PERUSAHAAN',
      profileTitle: 'Komitmen Profesionalisme dalam Dunia Konstruksi',
      profileBody1: 'ARSI KARYA adalah perusahaan jasa konstruksi, renovasi, dan Design & Build berkedudukan di Bandung, Jawa — Bali yang berfokus pada alur kerja terstruktur, eksekusi efisien, pengendalian mutu material, komunikasi jelas, dan kontrol proyek yang konsisten.',
      profileBody2: 'Kami memadukan kemampuan kompetensi teknis konstruksi dengan kepekaan desain arsitektural untuk memberikan hasil akhir yang kokoh, fungsional, dan bernilai tinggi bagi klien instansi pemerintah, swasta, maupun perorangan.',
      visiMisiTag: 'VISI & MISI',
      visiTag: 'VISI UTAMA',
      visiTitle: 'Menjadi Pelaksana Konstruksi & Design & Build Pilihan Utama di Bandung, Jawa — Bali',
      visiBody: 'Kami bertekad menjadi entitas jasa konstruksi dan perancangan terdepan yang diakui atas keunggulan kualitas fisik, transparansi manajemen, serta kepekaan arsitektural bernilai tinggi bagi setiap pemilik hunian dan pengembang proyek.',
      misiTag: 'MISI PERUSAHAAN',
      misi1Title: 'Eksekusi Fisik Berstandar Tinggi & Mutu Material Teruji',
      misi1Desc: 'Menjamin setiap tahapan pembangunan menggunakan spesifikasi material terbaik serta pengawasan teknis presisi.',
      misi2Title: 'Manajemen Transparan, Tepat Waktu & Sesuai Anggaran',
      misi2Desc: 'Mengelola alokasi biaya dan jadwal proyek secara terstruktur tanpa pembengkakan dana tak terduga.',
      misi3Title: 'Layanan Terpadu Perencanaan Hingga Serah Terima Kunci',
      misi3Desc: 'Memberikan kenyamanan penuh bagi klien melalui sistem komando tunggal perancangan hingga konstruksi selesai.',
    },
    servicesPage: {
      heroTag: 'LAYANAN KAMI',
      heroTitle: 'Layanan Konstruksi & Perancangan',
      heroSubtitle: 'Solusi Terpadu dari Konsep Arsitektur Hingga Realisasi Pembangunan Fisik',
      consultBtn: 'Konsultasikan Layanan Ini',
      scopeTitle: 'Cakupan Pekerjaan',
      processTitle: 'Tahapan Proses Kerja',
      materialsTitle: 'Metode & Standar Material',
      faqTitle: 'Pertanyaan Sering Diajukan',
      noticeTitle: 'Catatan Biaya & Estimasi',
    },
    projectsPage: {
      heroTag: 'REKAM JEJAK',
      heroTitle: 'Portofolio Proyek',
      heroSubtitle: 'Dokumentasi Karya Pekerjaan Konstruksi, Renovasi, dan Design & Build Arsi Karya',
      filterAll: 'Semua Proyek',
      viewDetail: 'Lihat Detail Proyek',
    },
    projectDetail: {
      backBtn: '← Kembali ke Proyek',
      location: 'Lokasi Proyek',
      year: 'Tahun Pelaksanaan',
      category: 'Kategori Pekerjaan',
      company: 'Entitas Pelaksana',
      features: 'Fitur Utama Pekerjaan',
      consultCta: 'Konsultasikan Proyek Serupa',
    },
    contactPage: {
      heroTag: 'KONTAK',
      heroTitle: 'Ajukan Kerja Sama',
      heroSubtitle: 'Ceritakan kebutuhan proyek atau bentuk kerja sama yang ingin Anda diskusikan bersama Arsi Karya.',
      officialTitle: 'Kontak Resmi',
      formTitle: 'Formulir Pengajuan Kerja Sama',
      formSubtitle: 'Silakan isi data kebutuhan proyek Anda di bawah ini untuk konsultasi cepat.',
      formName: 'Nama Lengkap',
      formWa: 'Nomor WhatsApp',
      formServiceType: 'Jenis Layanan',
      formProjectType: 'Jenis Proyek',
      formLocation: 'Lokasi Proyek',
      formMessage: 'Pesan / Deskripsi Proyek',
      formSubmit: 'Kirim Pengajuan',
      submitSuccess: 'Pengajuan Anda Berhasil Terkirim! Tim Arsi Karya akan segera menghubungi Anda.',
    },
    articlesPage: {
      heroTag: 'EDUKASI & INFORMASI',
      heroTitle: 'Artikel & Publikasi',
      heroSubtitle: 'Informasi & Panduan Praktis Seputar Dunia Konstruksi, Renovasi, dan Desain Arsitektur',
      searchPlaceholder: 'Cari artikel...',
      readMore: 'Baca Selengkapnya →',
      otherArticles: 'Artikel Lainnya',
    },
    articleDetail: {
      backBtn: '← Kembali ke Artikel',
      publishedOn: 'Diterbitkan pada',
    },
    testimonialsPage: {
      heroTag: 'KEPERCAYAAN KLIEN',
      heroTitle: 'Testimoni Klien',
      heroSubtitle: 'Kepercayaan dan Kepuasan Pemilik Proyek atas Hasil Kerja Arsi Karya',
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      projects: 'Projects',
      testimonials: 'Testimonials',
      articles: 'Articles',
      contact: 'Contact',
      ctaConsultation: 'Free Consultation',
    },
    servicesMenu: {
      perencanaan: 'Architecture & Planning',
      konstruksi: 'General Construction',
      designBuild: 'Design & Build',
      renovasi: 'Renovation',
      landscape: 'Landscape & Garden',
    },
    hero: {
      titleLine1: 'Building Thoroughly,',
      titleLine2: 'Superior in Quality',
      subtitle: 'Structured processes, clear communication, and uncompromised quality to realize your project smoothly and reliably.',
      btnProjects: 'View Projects',
      btnServices: 'Our Services',
      item1: 'CONSTRUCTION',
      item2: 'DESIGN & BUILD',
      item3: 'RENOVATION',
    },
    projects: {
      tag: 'FEATURED PORTFOLIO',
      title: 'Track Record of Construction & Design',
      btnAll: 'View All Projects',
      viewDetail: 'View Details',
    },
    servicesSection: {
      visionTag: 'COMPANY VISION',
      visionTitle: 'We know how to deliver your vision',
      visionDesc: 'Arsi Karya delivers integrated construction services with trustworthy and professional execution in Bandung, Java — Bali.',
      btnServices: 'Our Services',
      expertiseTag: 'OUR EXPERTISE',
      expertiseTitle: 'We construct spaces where amazing things happen',
      learnMore: 'Learn More',
    },
    about: {
      tag: 'ABOUT US',
      title: 'We create things that matter',
      desc1: 'ARSI KARYA is a general construction, renovation, and Design & Build firm based in Bandung, Java — Bali focusing on structured workflows, efficient execution, material quality control, clear communication, and consistent project management.',
      desc2: 'We combine technical construction competence with architectural sensitivity to deliver durable, functional, and high-value results for public, corporate, and private clients.',
      stat1Num: '100+',
      stat1Text: 'Projects Completed',
      stat2Num: '100%',
      stat2Text: 'Quality Commitment',
    },
    standards: {
      tag: '— WHY US',
      title: 'We conduct all business with the highest standards',
      desc: 'Every project is managed with cost transparency, schedule precision, and strict technical building standard compliance.',
      btnMore: 'LEARN MORE',
    },
    stats: {
      tag: 'WHO WE ARE',
      title: 'Building with a structured & measurable process',
      desc: 'Arsi Karya blends precision construction management with efficient execution. Every project is transparently controlled to deliver durable, top-quality structures.',
    },
    testimonialsSection: {
      tag: 'TESTIMONIALS',
      title: 'What Our Clients Say',
      viewAll: 'View All Testimonials',
    },
    news: {
      tag: 'LATEST NEWS',
      title: "It's an exciting time in the construction industry",
    },
    cta: {
      tag: 'CONTACT US',
      title: 'Ready to work together?',
      button: 'CONTACT US',
    },
    faq: {
      tag: 'FREQUENTLY ASKED QUESTIONS',
      title: 'Common Questions & Answers',
    },
    footer: {
      companyName: 'ARSI KARYA',
      companyTagline: '“Building Thoroughly, Superior in Quality”',
      desc: 'Trusted construction, design & build, renovation, and procurement firm based in Bandung, Java — Bali.',
      address: 'Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Bandung City.',
      navTitle: 'MAIN NAVIGATION',
      servicesTitle: 'OUR SERVICES',
      rights: 'All rights reserved.',
    },
    aboutPage: {
      heroTag: 'ABOUT OUR COMPANY',
      heroTitle: 'About Arsi Karya',
      heroSubtitle: 'Building Thoroughly, Superior in Quality',
      profileTag: 'COMPANY PROFILE',
      profileTitle: 'Commitment to Professionalism in Construction',
      profileBody1: 'ARSI KARYA is a general construction, renovation, and Design & Build company based in Bandung, Java — Bali focusing on structured workflows, efficient execution, material quality control, clear communication, and consistent project governance.',
      profileBody2: 'We combine technical construction competence with architectural design sensitivity to deliver sturdy, functional, and high-value results for public, corporate, and private clients.',
      visiMisiTag: 'VISION & MISSION',
      visiTag: 'MAIN VISION',
      visiTitle: 'To Be the Premier Construction & Design & Build Partner in Bandung, Java — Bali',
      visiBody: 'We strive to be the leading construction and architectural entity recognized for physical quality excellence, management transparency, and high-value design aesthetic for every home owner and developer.',
      misiTag: 'COMPANY MISSION',
      misi1Title: 'High-Standard Physical Execution & Tested Material Quality',
      misi1Desc: 'Ensuring every stage of construction uses top-grade material specifications and precision technical supervision.',
      misi2Title: 'Transparent, On-Time & On-Budget Project Governance',
      misi2Desc: 'Managing cost allocations and project schedules systematically without unexpected budget overruns.',
      misi3Title: 'Integrated Turnkey Service from Planning to Handover',
      misi3Desc: 'Providing complete peace of mind for clients through a single unified command from design to finished construction.',
    },
    servicesPage: {
      heroTag: 'OUR SERVICES',
      heroTitle: 'Construction & Architectural Services',
      heroSubtitle: 'Integrated Solutions from Architectural Concept to Physical Construction Realization',
      consultBtn: 'Consult This Service',
      scopeTitle: 'Scope of Work',
      processTitle: 'Process & Work Stages',
      materialsTitle: 'Methods & Material Standards',
      faqTitle: 'Frequently Asked Questions',
      noticeTitle: 'Pricing & Estimation Notice',
    },
    projectsPage: {
      heroTag: 'TRACK RECORD',
      heroTitle: 'Project Portfolio',
      heroSubtitle: 'Documentation of Construction, Renovation, and Design & Build Projects by Arsi Karya',
      filterAll: 'All Projects',
      viewDetail: 'View Project Details',
    },
    projectDetail: {
      backBtn: '← Back to Projects',
      location: 'Project Location',
      year: 'Execution Year',
      category: 'Work Category',
      company: 'Executing Entity',
      features: 'Key Features of Work',
      consultCta: 'Consult Similar Project',
    },
    contactPage: {
      heroTag: 'CONTACT',
      heroTitle: 'Submit Project Inquiry',
      heroSubtitle: 'Tell us about your project requirements or cooperation forms you wish to discuss with Arsi Karya.',
      officialTitle: 'Official Contact',
      formTitle: 'Cooperation Request Form',
      formSubtitle: 'Please fill out your project details below for a prompt consultation.',
      formName: 'Full Name',
      formWa: 'WhatsApp Number',
      formServiceType: 'Service Type',
      formProjectType: 'Project Type',
      formLocation: 'Project Location',
      formMessage: 'Message / Project Description',
      formSubmit: 'Submit Inquiry',
      submitSuccess: 'Your Request Has Been Successfully Sent! Arsi Karya team will contact you shortly.',
    },
    articlesPage: {
      heroTag: 'INSIGHTS & EDUCATION',
      heroTitle: 'Articles & Insights',
      heroSubtitle: 'Practical Information & Guides on Construction, Renovation, and Architectural Design',
      searchPlaceholder: 'Search articles...',
      readMore: 'Read Full Article →',
      otherArticles: 'Other Articles',
    },
    articleDetail: {
      backBtn: '← Back to Articles',
      publishedOn: 'Published on',
    },
    testimonialsPage: {
      heroTag: 'CLIENT TRUST',
      heroTitle: 'Client Testimonials',
      heroSubtitle: 'Trust and Satisfaction of Project Owners on Arsi Karya\'s Work',
    }
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('arsi_karya_lang') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('arsi_karya_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const t = translations[lang] || translations.id;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
