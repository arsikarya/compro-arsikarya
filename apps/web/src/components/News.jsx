import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { getArticlesData } from '../data/articlesData';

export default function News() {
  const { lang, t } = useLanguage();
  const rawArticles = getArticlesData(lang);

  const [newsList, setNewsList] = useState(rawArticles);

  useEffect(() => {
    setNewsList(getArticlesData(lang));
  }, [lang]);

  useEffect(() => {
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
      .catch(() => {});
  }, [lang]);

  return (
    <section id="news" className="section-padding" style={{ backgroundColor: '#f5f5f5' }}>
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
                  e.currentTarget.style.borderTopColor = 'var(--color-primary)';
                  const arrow = e.currentTarget.querySelector('.article-arrow');
                  if (arrow) {
                    arrow.style.transform = 'translate(3px, -3px)';
                    arrow.style.color = 'var(--color-primary)';
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
                      WebkitTextStroke: '0.35px currentColor',
                      letterSpacing: '-0.02em',
                      color: 'var(--color-text-main)',
                      lineHeight: 1.3,
                    }}
                  >
                    {article.title}
                  </h3>
                  <FiArrowUpRight
                    className="article-arrow"
                    style={{
                      fontSize: '1.4rem',
                      color: '#94a3b8',
                      transition: 'all 0.25s ease',
                      flexShrink: 0,
                      marginLeft: '12px',
                    }}
                  />
                </div>

                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  {article.excerpt}
                </p>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
