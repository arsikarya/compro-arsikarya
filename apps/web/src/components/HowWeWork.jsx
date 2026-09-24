import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMessageSquare,
  FiMapPin,
  FiEdit3,
  FiTool,
  FiShield,
  FiCheckCircle,
} from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

export default function HowWeWork() {
  const { lang } = useLanguage();
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      number: '01',
      title: lang === 'en' ? 'Consultation' : 'Konsultasi',
      points: [
        'Brief & kebutuhan proyek',
        'Roadmap & skema kerja',
      ],
      icon: <FiMessageSquare />,
    },
    {
      number: '02',
      title: lang === 'en' ? 'Site Survey' : 'Site Survey',
      points: [
        'Hasil ukur & pemetaan lahan',
        'Analisis kondisi lokasi',
        'Acuan awal perencanaan',
      ],
      icon: <FiMapPin />,
    },
    {
      number: '03',
      title: lang === 'en' ? 'Design' : 'Desain',
      points: [
        'Konsep 2D & visual 3D',
        'Gambar kerja teknis',
        'Rencana Anggaran Biaya (RAB)',
        'Schedule Pelaksanaan',
      ],
      icon: <FiEdit3 />,
    },
    {
      number: '04',
      title: lang === 'en' ? 'Construction' : 'Pembangunan',
      points: [
        'Konstruksi fisik bangunan',
        'Laporan progres berkala',
        'Kontrol mutu & jadwal',
      ],
      icon: <FiTool />,
    },
    {
      number: '05',
      title: lang === 'en' ? 'Warranty Period' : 'Masa Garansi',
      points: [
        'Perbaikan pasca konstruksi',
        '& perawatan rutin*',
        'Layanan aftersales',
      ],
      icon: <FiShield />,
    },
    {
      number: '06',
      title: lang === 'en' ? 'Completed' : 'Selesai',
      points: [
        'Inspeksi akhir bersama',
        'Berita Acara Serah Terima (BAST)',
        'Penyerahan kunci & berkas final',
      ],
      icon: <FiCheckCircle />,
    },
  ];

  return (
    <section
      id="how-we-work"
      style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        padding: '96px 0',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Standard Site Container matching Navbar max-width */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px auto' }}>
          <span className="section-tag" style={{ justifyContent: 'center' }}>
            HOW WE WORK
          </span>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.25,
              marginBottom: '16px',
            }}
          >
            {lang === 'en' ? 'Our Construction Process' : 'Proses Konstruksi Kami'}
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#475569',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {lang === 'en'
              ? 'Our commitment to completing every construction work relies on systematic planning, execution & project control.'
              : 'Komitmen kami untuk menyelesaikan setiap karya konstruksi tidak terlepas dari perencanaan, pelaksanaan & pengendalian proyek yang sistematis.'}
          </p>
        </div>

        {/* Desktop 6-Step Alternating Horizontal Timeline (>= 1024px) */}
        <div className="desktop-timeline-wrapper">
          {/* Continuous Center Horizontal Line */}
          <div className="desktop-center-line" />

          <div className="desktop-steps-grid">
            {steps.map((step, idx) => {
              const isTop = idx % 2 === 0; // Steps 01, 03, 05 ABOVE line; 02, 04, 06 BELOW line
              const isActive = activeStep === idx;
              const isFirst = idx === 0;
              const isLast = idx === steps.length - 1;

              let cardAlignClass = 'card-align-center';
              if (isFirst) cardAlignClass = 'card-align-first';
              if (isLast) cardAlignClass = 'card-align-last';

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: isTop ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className="desktop-step-item"
                  onMouseEnter={() => setActiveStep(idx)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Top Area (Card if isTop, empty spacer if !isTop) */}
                  <div className="step-area top-area">
                    {isTop && (
                      <div className={`step-card ${cardAlignClass} ${isActive ? 'active-card' : ''}`}>
                        <div className="card-header">
                          <span className="card-step-num">{step.number}</span>
                          <h3 className="card-title">{step.title}</h3>
                        </div>
                        <ul className="card-points-list">
                          {step.points.map((pt, pIdx) => (
                            <li key={pIdx} className="card-point-item">
                              <span className="bullet-dot">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Centered Circle Node containing ONLY the Icon */}
                  <div className={`center-node ${isActive ? 'active-node' : ''}`}>
                    <div className="node-icon">{step.icon}</div>
                  </div>

                  {/* Bottom Area (Card if !isTop, empty spacer if isTop) */}
                  <div className="step-area bottom-area">
                    {!isTop && (
                      <div className={`step-card ${cardAlignClass} ${isActive ? 'active-card' : ''}`}>
                        <div className="card-header">
                          <span className="card-step-num">{step.number}</span>
                          <h3 className="card-title">{step.title}</h3>
                        </div>
                        <ul className="card-points-list">
                          {step.points.map((pt, pIdx) => (
                            <li key={pIdx} className="card-point-item">
                              <span className="bullet-dot">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet Vertical Timeline (< 1024px) */}
        <div className="mobile-timeline-wrapper">
          <div className="mobile-vertical-line" />
          <div className="mobile-steps-list">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="mobile-step-item"
              >
                <div className="mobile-node">
                  <span className="mobile-icon">{step.icon}</span>
                </div>
                <div className="mobile-card">
                  <div className="mobile-card-header">
                    <span className="mobile-step-num">{step.number}</span>
                    <h3 className="mobile-step-title">{step.title}</h3>
                  </div>
                  <ul className="card-points-list">
                    {step.points.map((pt, pIdx) => (
                      <li key={pIdx} className="card-point-item">
                        <span className="bullet-dot">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* Side Dot Matrix Grid Accents */
        #how-we-work::before {
          content: '';
          position: absolute;
          top: 60px;
          right: 4%;
          width: 90px;
          height: 90px;
          background-image: radial-gradient(rgba(0, 86, 151, 0.18) 1.5px, transparent 1.5px);
          background-size: 14px 14px;
          opacity: 0.75;
          pointer-events: none;
        }

        #how-we-work::after {
          content: '';
          position: absolute;
          bottom: 60px;
          left: 4%;
          width: 90px;
          height: 90px;
          background-image: radial-gradient(rgba(0, 86, 151, 0.18) 1.5px, transparent 1.5px);
          background-size: 14px 14px;
          opacity: 0.75;
          pointer-events: none;
        }

        /* Desktop Horizontal Alternating Layout */
        .desktop-timeline-wrapper {
          position: relative;
          width: 100%;
          min-height: 460px;
        }

        /* Continuous Horizontal Line at 50% vertical center */
        .desktop-center-line {
          position: absolute;
          top: 50%;
          left: 1.5%;
          right: 1.5%;
          height: 2px;
          background: rgba(0, 86, 151, 0.25);
          transform: translateY(-50%);
          z-index: 1;
        }

        .desktop-center-line::before,
        .desktop-center-line::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-primary-300, #005697);
          box-shadow: 0 0 8px rgba(0, 86, 151, 0.4);
          transform: translateY(-50%);
        }

        .desktop-center-line::before {
          left: -4px;
        }

        .desktop-center-line::after {
          right: -4px;
        }

        .desktop-steps-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0;
          position: relative;
          z-index: 2;
          height: 100%;
        }

        .desktop-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          position: relative;
        }

        .step-area {
          height: 200px;
          width: 100%;
          position: relative;
          display: flex;
        }

        .top-area {
          align-items: flex-end;
        }

        .bottom-area {
          align-items: flex-start;
        }

        /* Crisp Elevated Cards on White Background */
        .step-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px 20px;
          width: 255px;
          text-align: left;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.02);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          position: absolute;
          z-index: 10;
          cursor: pointer;
        }

        .top-area .step-card {
          bottom: 14px;
        }

        .bottom-area .step-card {
          top: 14px;
        }

        /* Alignment positions for wide cards */
        .card-align-center {
          left: 50%;
          transform: translateX(-50%);
        }

        .card-align-center:hover, .card-align-center.active-card {
          border-color: var(--color-primary-300, #005697);
          transform: translateX(-50%) translateY(-4px);
          box-shadow: 0 18px 36px rgba(0, 86, 151, 0.16);
          background: #ffffff;
        }

        .card-align-first {
          left: -10px;
          transform: none;
        }

        .card-align-first:hover, .card-align-first.active-card {
          border-color: var(--color-primary-300, #005697);
          transform: translateY(-4px);
          box-shadow: 0 18px 36px rgba(0, 86, 151, 0.16);
          background: #ffffff;
        }

        .card-align-last {
          right: -10px;
          left: auto;
          transform: none;
        }

        .card-align-last:hover, .card-align-last.active-card {
          border-color: var(--color-primary-300, #005697);
          transform: translateY(-4px);
          box-shadow: 0 18px 36px rgba(0, 86, 151, 0.16);
          background: #ffffff;
        }

        .card-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 10px;
        }

        .card-step-num {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-primary-300, #005697);
          letter-spacing: -0.01em;
          flex-shrink: 0;
          line-height: 1.25;
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          line-height: 1.25;
        }

        .card-points-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .card-point-item {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.48;
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }

        .bullet-dot {
          color: var(--color-primary-300, #005697);
          font-weight: 700;
          line-height: 1;
        }

        /* Solid Primary Blue Center Circle Nodes */
        .center-node {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--color-primary-300, #005697);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0, 86, 151, 0.28);
          transition: all 0.35s ease;
          z-index: 3;
          flex-shrink: 0;
        }

        .active-node, .desktop-step-item:hover .center-node {
          background: var(--color-primary-400, #003e6d);
          transform: scale(1.12);
          box-shadow: 0 8px 24px rgba(0, 86, 151, 0.42);
        }

        .node-icon {
          font-size: 1.35rem;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Mobile & Tablet Styles */
        .mobile-timeline-wrapper {
          display: none;
          position: relative;
          padding-left: 28px;
        }

        .mobile-vertical-line {
          position: absolute;
          left: 19px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(0, 86, 151, 0.25);
        }

        .mobile-steps-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .mobile-step-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .mobile-node {
          position: absolute;
          left: -28px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-primary-300, #005697);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(0, 86, 151, 0.25);
          font-size: 1.25rem;
          z-index: 2;
        }

        .mobile-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
          width: 100%;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
          margin-left: 20px;
        }

        .mobile-card-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 10px;
        }

        .mobile-step-num {
          font-weight: 800;
          color: var(--color-primary-300, #005697);
          font-size: 1.1rem;
          line-height: 1.25;
        }

        .mobile-step-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          line-height: 1.25;
        }

        @media (max-width: 1100px) {
          .step-card {
            width: 240px;
          }
        }

        @media (max-width: 1023px) {
          .desktop-timeline-wrapper {
            display: none;
          }
          .mobile-timeline-wrapper {
            display: block;
          }
        }
      `}</style>
    </section>
  );
}
