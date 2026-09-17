import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function News() {
  const { lang, t } = useLanguage();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicApi.getArticles()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 3).map(a => ({
            id: a.id || a.slug,
            slug: a.slug,
            title: lang === 'en' ? (a.titleEn || a.title) : a.title,
            excerpt: lang === 'en' ? (a.excerptEn || a.excerpt || a.contentEn?.substring(0, 120) || '') : (a.excerpt || a.content?.substring(0, 120) || ''),
          }));
          setNewsList(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lang]);

  return (
    <section id="news" className="section-padding" style={{ backgroundColor: '#f5f5f5', minHeight: '380px' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '650px', marginBottom: '60px' }}>
          <span className="section-tag">{t.news?.tag || 'LATEST NEWS'}</span>

          <h2
            style={{
              fontSize: 'clamp(2.1rem, 3.6vw, 2.9rem)',
              fontWeight: 800,
              color: 'var(--color-text-main)',
              lineHeight: 1.28,
            }}
          >
            {t.news?.title || "It's an exciting time in the construction industry"}
          </h2>
        </div>

        {/* 3 Column Horizontal Articles */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid var(--color-primary-300)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '40px',
            }}
          >
            {newsList.map((article, idx) => (
              <Link
                key={article.id}
                to={`/artikel/${article.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderTop: '2px solid #e2e8f0',
                    paddingTop: '24px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderTopColor = 'var(--color-primary-300)';
                    const arrow = e.currentTarget.querySelector('.article-arrow');
                    if (arrow) {
                      arrow.style.transform = 'translate(3px, -3px)';
                      arrow.style.color = 'var(--color-primary-300)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderTopColor = '#e2e8f0';
                    const arrow = e.currentTarget.querySelector('.article-arrow');
                    if (arrow) {
                      arrow.style.transform = 'translate(0, 0)';
                      arrow.style.color = '#94a3b8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--color-neutral-800)',
                        lineHeight: 1.4,
                        margin: 0,
                      }}
                    >
                      {article.title}
                    </h3>
                    <FiArrowUpRight
                      className="article-arrow"
                      style={{
                        fontSize: '1.4rem',
                        color: '#94a3b8',
                        flexShrink: 0,
                        transition: 'all 0.25s ease',
                        marginLeft: '12px',
                        marginTop: '2px',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: '0.925rem',
                      color: 'var(--color-neutral-500)',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {article.excerpt}
                  </p>
                </motion.article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
