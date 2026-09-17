import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import SectionTag from '../components/ui/SectionTag';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import HeroBanner from '../components/ui/HeroBanner';
import CTA from '../components/CTA';
import { getArticlesData } from '../data/articlesData';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export function ArticleCard({ article }) {
  const { t } = useLanguage();
  if (!article) return null;

  return (
    <Link
      to={`/artikel/${article.slug}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div
        style={{
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          border: '1px solid var(--color-neutral-200)',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          height: '100%',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary-300)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div>
          <div style={{ height: '220px', backgroundColor: 'var(--color-neutral-200)', overflow: 'hidden' }}>
            <img 
              src={article.thumbnail || article.coverImageUrl || '/projects/project_2.jpg'} 
              alt={article.title} 
              onError={(e) => { e.currentTarget.src = '/projects/project_2.jpg'; }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-300)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              {article.category} • {article.date}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-body)', fontWeight: 800, WebkitTextStroke: '0.35px currentColor', letterSpacing: '-0.02em', marginBottom: '10px', lineHeight: 1.35, color: 'var(--color-neutral-800)' }}>
              {article.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-500)', lineHeight: 1.6 }}>{article.excerpt}</p>
          </div>
        </div>
        <div style={{ padding: '0 24px 24px 24px' }}>
          <Button variant="primary" style={{ pointerEvents: 'none', width: '100%' }}>
            {t.articlesPage?.readMore || 'Baca Selengkapnya →'}
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default function ArticlesPage() {
  const { articleSlug } = useParams();
  const { lang, t } = useLanguage();
  const staticArticles = getArticlesData(lang);

  const [articlesList, setArticlesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiSingleArticle, setApiSingleArticle] = useState(null);
  const [activeCat, setActiveCat] = useState(lang === 'en' ? 'All' : 'Semua');

  useEffect(() => {
    setActiveCat(lang === 'en' ? 'All' : 'Semua');
  }, [lang]);

  // Fetch all articles for directory view
  useEffect(() => {
    setLoading(true);
    publicApi.getArticles()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: lang === 'en' ? (item.titleEn || item.title) : item.title,
            category: item.category || 'Panduan Konstruksi',
            date: item.publishedDate 
              ? new Date(item.publishedDate).toISOString().split('T')[0] 
              : '2026-03-10',
            thumbnail: item.coverImageUrl || item.thumbnail || '/projects/project_2.jpg',
            coverImageUrl: item.coverImageUrl || item.thumbnail || '/projects/project_2.jpg',
            excerpt: lang === 'en' ? (item.excerptEn || item.excerpt) : item.excerpt,
            content: lang === 'en' ? (item.contentEn || item.content) : item.content,
            author: item.author || 'Arsi Karya Team',
          }));
          setArticlesList(mapped);
        } else {
          setArticlesList(staticArticles);
        }
      })
      .catch(() => {
        setArticlesList(staticArticles);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  // Fetch single article if articleSlug is present
  useEffect(() => {
    if (articleSlug) {
      publicApi.getArticle(articleSlug)
        .then((data) => {
          if (data) {
            setApiSingleArticle({
              id: data.id,
              slug: data.slug,
              title: lang === 'en' ? (data.titleEn || data.title) : data.title,
              category: data.category || 'Panduan Konstruksi',
              date: data.publishedDate 
                ? new Date(data.publishedDate).toISOString().split('T')[0] 
                : '2026-03-10',
              thumbnail: data.coverImageUrl || data.thumbnail || '/projects/project_2.jpg',
              coverImageUrl: data.coverImageUrl || data.thumbnail || '/projects/project_2.jpg',
              excerpt: lang === 'en' ? (data.excerptEn || data.excerpt) : data.excerpt,
              content: lang === 'en' ? (data.contentEn || data.content) : data.content,
              author: data.author || 'Arsi Karya Team',
            });
          }
        })
        .catch(() => {});
    }
  }, [articleSlug, lang]);

  // Single Article Reader View (/artikel/:slug)
  if (articleSlug) {
    const fallbackArticle = articlesList.find((a) => a.slug === articleSlug) || staticArticles.find((a) => a.slug === articleSlug);
    const article = apiSingleArticle || fallbackArticle;

    if (article) {
      const otherArticles = articlesList.filter((a) => a.id !== article.id);

      return (
        <>
          <SEOHead
            title={`${article.title} — Arsi Karya`}
            description={article.excerpt}
          />

          <HeroBanner
            bgImage={article.thumbnail || article.coverImageUrl}
            overlayOpacity={0.65}
            imageAlt={article.title}
            tag={article.category}
            title={article.title}
            subtitle={`${article.date}`}
          />

          <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)', paddingTop: '48px' }}>
            <div className="container" style={{ maxWidth: '780px' }}>
              
              {/* Back Navigation Link */}
              <Link 
                to="/artikel" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '28px', 
                  color: 'var(--color-primary-300)', 
                  fontWeight: 700, 
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}
              >
                {t.articleDetail?.backBtn || '← Kembali ke Artikel'}
              </Link>

              {/* Medium Editorial Content Block */}
              <div
                className="medium-article-reader"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              {/* Related Articles Suggestions (ArticleCard style) */}
              {otherArticles.length > 0 && (
                <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid var(--color-neutral-200)' }}>
                  <SectionTag>{lang === 'en' ? 'RECOMMENDED READING' : 'REKOMENDASI BACAAN'}</SectionTag>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '32px', marginTop: '8px' }}>{t.articlesPage?.otherArticles || 'Artikel Terkait Lainnya'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                    {otherArticles.slice(0, 2).map((oa) => (
                      <ArticleCard key={oa.id} article={oa} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </section>

          <CTA />

          <style>{`
            .medium-article-reader {
              font-size: 1.1rem;
              line-height: 1.9;
              color: var(--color-neutral-700, #334155);
              font-family: var(--font-body, system-ui, -apple-system, sans-serif);
            }

            .medium-article-reader p {
              margin-top: 0;
              margin-bottom: 28px;
              letter-spacing: -0.003em;
            }

            .medium-article-reader p.lead {
              font-size: 1.2rem;
              line-height: 1.85;
              color: var(--color-neutral-800);
              font-weight: 500;
              margin-bottom: 36px;
            }

            .medium-article-reader h2,
            .medium-article-reader h3 {
              font-family: var(--font-heading, sans-serif);
              font-weight: 800;
              color: var(--color-neutral-800, #0f172a);
              letter-spacing: -0.018em;
              line-height: 1.35;
              margin-top: 48px;
              margin-bottom: 20px;
              font-size: 1.55rem;
              padding-top: 8px;
            }

            .medium-article-reader h2:first-child,
            .medium-article-reader h3:first-child {
              margin-top: 0;
            }

            .medium-article-reader ul,
            .medium-article-reader ol {
              margin-top: 12px;
              margin-bottom: 32px;
              padding-left: 24px;
            }

            .medium-article-reader li {
              margin-bottom: 12px;
              line-height: 1.8;
              color: var(--color-neutral-700);
            }

            .medium-article-reader blockquote {
              border-left: 4px solid var(--color-primary-300, #005697);
              background-color: var(--color-primary-100, #e6f0fa);
              padding: 22px 28px;
              margin: 40px 0;
              border-radius: 0 12px 12px 0;
              font-size: 1.075rem;
              font-style: italic;
              color: var(--color-primary-400, #003e6d);
              line-height: 1.75;
            }

            .medium-article-reader strong {
              color: var(--color-neutral-800, #0f172a);
              font-weight: 700;
            }

            .medium-article-reader em {
              font-style: italic;
            }
          `}</style>
        </>
      );
    }
  }

  // Articles Directory View (/artikel)
  const staticCategories = lang === 'en' 
    ? ['All', 'Construction Guide', 'Renovation Tips', 'Design Innovation']
    : ['Semua', 'Panduan Konstruksi', 'Tips Renovasi', 'Inovasi Desain'];

  const dynamicCategories = Array.from(new Set(articlesList.map((a) => a.category))).filter(Boolean);
  const categories = Array.from(new Set([lang === 'en' ? 'All' : 'Semua', ...staticCategories.slice(1), ...dynamicCategories]));

  const filtered = (activeCat === 'Semua' || activeCat === 'All')
    ? articlesList
    : articlesList.filter((a) => a.category === activeCat);

  return (
    <>
      <SEOHead
        title={lang === 'en' ? "Articles & Insights — Arsi Karya" : "Artikel & Wawasan Konstruksi — Arsi Karya"}
        description={lang === 'en' ? "Guides, education, and insights on house renovation, contracting services, materials, and budgeting." : "Panduan, edukasi, dan informasi seputar renovasi rumah, jasa kontraktor, material bangunan, dan perencanaan budget."}
      />

      <HeroBanner
        bgImage="/projects/project_4.jpg"
        overlayOpacity={0.65}
        tag={t.articlesPage?.heroTag || "ARTIKEL & EDUKASI"}
        title={t.articlesPage?.heroTitle || "Wawasan & Edukasi Pembangunan"}
        subtitle={t.articlesPage?.heroSubtitle || "Informasi praktis seputar dunia konstruksi, tren arsitektur, dan tips perencanaan anggaran proyek."}
      />

      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)', minHeight: '400px' }}>
        <div className="container">
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeCat === cat ? '1px solid var(--color-primary-300)' : '1px solid var(--color-neutral-200)',
                  backgroundColor: activeCat === cat ? 'var(--color-primary-300)' : 'transparent',
                  color: activeCat === cat ? '#ffffff' : 'var(--color-neutral-600)',
                  transition: 'all 0.25s ease',
                  boxShadow: activeCat === cat ? '0 4px 14px rgba(0, 86, 151, 0.2)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid var(--color-primary-300)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div className="albion-articles-grid">
              {filtered.map((art) => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          )}
        </div>

        <style>{`
          .albion-articles-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
            width: 100%;
          }

          @media (max-width: 1024px) {
            .albion-articles-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 640px) {
            .albion-articles-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </section>
    </>
  );
}
