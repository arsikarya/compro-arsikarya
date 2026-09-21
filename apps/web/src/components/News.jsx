import React, { useState, useEffect } from 'react';
import ArticleCard, { ArticleGridStyles } from './ui/ArticleCard';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { getArticlesData } from '../data/articlesData';

export default function News() {
  const { lang, t } = useLanguage();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicApi.getArticles()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 3).map((a, idx) => ({
            id: a.id || a.slug,
            slug: a.slug,
            title: lang === 'en' ? (a.titleEn || a.title) : a.title,
            category: a.category || 'BERITA & ARTIKEL',
            author: a.author || 'Arsi Karya',
            date: a.date || '2025',
            thumbnail: a.thumbnail || a.image || a.coverImageUrl,
          }));
          setNewsList(mapped);
        } else {
          setNewsList(getArticlesData(lang).slice(0, 3));
        }
      })
      .catch(() => {
        setNewsList(getArticlesData(lang).slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, [lang]);

  return (
    <section id="news" className="section-padding" style={{ backgroundColor: '#f5f5f5', minHeight: '380px' }}>
      <ArticleGridStyles />
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '850px', marginBottom: '60px' }}>
          <span className="section-tag">{t.news?.tag || 'LATEST NEWS'}</span>

          <h2
            style={{
              fontSize: 'clamp(2.1rem, 3.6vw, 2.9rem)',
              fontWeight: 800,
              color: 'var(--color-text-main)',
              lineHeight: 1.25,
            }}
          >
            {lang === 'en' ? (
              <>
                It's an exciting time in the<br />
                construction industry
              </>
            ) : (
              <>
                Kabar Terkini Dunia<br />
                Konstruksi & Arsitektur
              </>
            )}
          </h2>
        </div>

        {/* 3 Column Article Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid var(--color-primary-300)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div className="article-grid">
            {newsList.map((article, idx) => (
              <ArticleCard key={article.id || idx} article={article} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
