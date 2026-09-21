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
      desc:
        lang === 'en'
          ? 'Understand project needs, desires, and goals to determine the right direction from the start.'
          : 'Memahami kebutuhan, keinginan, dan tujuan proyek untuk menentukan arah yang tepat sejak awal.',
      icon: <FiMessageSquare />,
    },
    {
      number: '02',
      title: lang === 'en' ? 'Site Survey' : 'Site Survey',
      desc:
        lang === 'en'
          ? 'Review location conditions and characteristics directly as a basis for determining planning steps.'
          : 'Meninjau kondisi dan karakteristik lokasi secara langsung sebagai dasar dalam menentukan langkah perencanaan.',
      icon: <FiMapPin />,
    },
    {
      number: '03',
      title: lang === 'en' ? 'Design' : 'Desain',
      desc:
        lang === 'en'
          ? 'Develop concept and project needs into focused, functional design with consideration to every detail.'
          : 'Mengembangkan konsep dan kebutuhan proyek menjadi desain yang terarah, fungsional, dan memiliki pertimbangan pada setiap detail.',
      icon: <FiEdit3 />,
    },
    {
      number: '04',
      title: lang === 'en' ? 'Construction' : 'Pembangunan',
      desc:
        lang === 'en'
          ? 'Realize design into construction work with focused management, paying attention to quality, cost, and time.'
          : 'Mewujudkan desain ke dalam pekerjaan konstruksi dengan pengelolaan yang terarah, memperhatikan mutu, biaya, dan waktu.',
      icon: <FiTool />,
    },
    {
      number: '05',
      title: lang === 'en' ? 'Warranty Period' : 'Masa Garansi',
      desc:
        lang === 'en'
          ? 'Ensure work results remain maintained after project completion through maintenance period & warranty.'
          : 'Memastikan hasil pekerjaan tetap terjaga setelah proyek selesai melalui masa pemeliharaan dan garansi sesuai ketentuan.',
      icon: <FiShield />,
    },
    {
      number: '06',
      title: lang === 'en' ? 'Completed' : 'Selesai',
      desc:
        lang === 'en'
          ? 'Hand over final project results after all work and inspections are completed according to agreed scope.'
          : 'Menyerahkan hasil akhir proyek setelah seluruh pekerjaan dan pemeriksaan diselesaikan sesuai lingkup yang telah disepakati.',
      icon: <FiCheckCircle />,
    },
  ];

  return (
    <section
      id="how-we-work"
      style={{
        backgroundColor: '#ffffff',
        padding: '96px 0',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Standard Site Container matching Navbar max-width */}
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 112px auto' }}>
          <span className="section-tag" style={{ justifyContent: 'center' }}>
            HOW WE WORK
          </span>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              color: 'var(--color-text-main)',
              lineHeight: 1.25,
              marginBottom: '16px',
            }}
          >
            {lang === 'en' ? 'Our Construction Process' : 'Proses Konstruksi Kami'}
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--color-text-muted)',
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
                        <div className="card-step-num">{step.number}</div>
                        <h3 className="card-title">{step.title}</h3>
                        <p className="card-desc">{step.desc}</p>
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
                        <div className="card-step-num">{step.number}</div>
                        <h3 className="card-title">{step.title}</h3>
                        <p className="card-desc">{step.desc}</p>
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
                    <span className="mobile-step-num">{step.number} —</span>
                    <h3 className="mobile-step-title">{step.title}</h3>
                  </div>
                  <p className="mobile-step-desc">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* Desktop Horizontal Alternating Layout */
        .desktop-timeline-wrapper {
          position: relative;
          width: 100%;
          height: 380px;
        }

        /* Continuous Horizontal Line at 50% vertical center */
        .desktop-center-line {
          position: absolute;
          top: 50%;
          left: 2%;
          right: 2%;
          height: 2px;
          background: #cbd5e1;
          transform: translateY(-50%);
          z-index: 1;
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

        /* Top & Bottom Areas are each 161px tall. Center Node is 58px tall (161 + 29 = 190px center midpoint of 380px!) */
        .step-area {
          height: 161px;
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

        /* Wide Cards overlapping adjacent empty column spaces (245px wide) */
        .step-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 16px;
          width: 245px;
          text-align: center;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          position: absolute;
          z-index: 10;
          cursor: pointer;
        }

        .top-area .step-card {
          bottom: 12px;
        }

        .bottom-area .step-card {
          top: 12px;
        }

        /* Alignment positions for wide cards */
        .card-align-center {
          left: 50%;
          transform: translateX(-50%);
        }

        .card-align-center:hover, .card-align-center.active-card {
          border-color: var(--color-primary-300, #005697);
          transform: translateX(-50%) translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 86, 151, 0.14);
        }

        .card-align-first {
          left: -10px;
          transform: none;
        }

        .card-align-first:hover, .card-align-first.active-card {
          border-color: var(--color-primary-300, #005697);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 86, 151, 0.14);
        }

        .card-align-last {
          right: -10px;
          left: auto;
          transform: none;
        }

        .card-align-last:hover, .card-align-last.active-card {
          border-color: var(--color-primary-300, #005697);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 86, 151, 0.14);
        }

        .card-step-num {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-primary-300, #005697);
          margin-bottom: 2px;
          letter-spacing: -0.01em;
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-main, #1e293b);
          margin-bottom: 4px;
          line-height: 1.25;
        }

        .card-desc {
          font-size: 0.81rem;
          color: var(--color-text-muted, #64748b);
          line-height: 1.48;
          margin: 0;
        }

        /* Centered Circle Node containing ONLY the Icon */
        .center-node {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          transition: all 0.35s ease;
          z-index: 3;
          flex-shrink: 0;
        }

        .active-node, .desktop-step-item:hover .center-node {
          background: #ffffff;
          border-color: var(--color-primary-300, #005697);
          transform: scale(1.08);
          box-shadow: 0 8px 24px rgba(0, 86, 151, 0.22);
        }

        .node-icon {
          font-size: 1.35rem;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .active-node .node-icon, .desktop-step-item:hover .node-icon {
          color: var(--color-primary-300, #005697);
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
          background: linear-gradient(180deg, var(--color-primary-300, #005697) 0%, #cbd5e1 100%);
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
          background: #ffffff;
          border: 2px solid var(--color-primary-300, #005697);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary-300, #005697);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
          font-size: 1.25rem;
          z-index: 2;
        }

        .mobile-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px 20px;
          width: 100%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          margin-left: 20px;
        }

        .mobile-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .mobile-step-num {
          font-weight: 800;
          color: var(--color-primary-300, #005697);
          font-size: 0.95rem;
        }

        .mobile-step-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-main, #1e293b);
          margin: 0;
        }

        .mobile-step-desc {
          font-size: 0.875rem;
          color: var(--color-text-muted, #64748b);
          line-height: 1.55;
          margin: 0;
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
