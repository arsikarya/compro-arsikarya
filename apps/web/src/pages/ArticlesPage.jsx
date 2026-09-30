import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import SectionTag from '../components/ui/SectionTag';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import HeroBanner from '../components/ui/HeroBanner';
import CTA from '../components/CTA';
import ArticleCard, { ArticleGridStyles } from '../components/ui/ArticleCard';
import { getArticlesData } from '../data/articlesData';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { formatRichText } from '../lib/formatRichText';

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
                dangerouslySetInnerHTML={{ __html: formatRichText(article.content) }}
              />
              {/* Related Articles Suggestions (ArticleCard style) */}
              {otherArticles.length > 0 && (
                <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid var(--color-neutral-200)' }}>
                  <SectionTag>{lang === 'en' ? 'RECOMMENDED READING' : 'REKOMENDASI BACAAN'}</SectionTag>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '32px', marginTop: '8px' }}>{t.articlesPage?.otherArticles || 'Artikel Lainnya'}</h3>
                  <ArticleGridStyles />
                  <div className="article-grid cols-2">
                    {otherArticles.slice(0, 2).map((oa, idx) => (
                      <ArticleCard key={oa.id} article={oa} idx={idx} />
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

            .medium-article-reader figure,
            .medium-article-reader .blog-media-block,
            .medium-article-reader .article-image-figure {
              margin: 36px auto;
              text-align: center;
              max-width: 100%;
            }

            .medium-article-reader figure img,
            .medium-article-reader .blog-media-block img,
            .medium-article-reader .article-image-figure img {
              max-width: 100%;
              height: auto;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
              display: block;
              margin: 0 auto;
            }

            .medium-article-reader figure figcaption,
            .medium-article-reader .blog-media-block figcaption,
            .medium-article-reader .article-image-figure figcaption {
              font-size: 0.9rem;
              color: var(--color-neutral-500, #64748b);
              margin-top: 10px;
              font-style: italic;
              text-align: center;
            }
          `}</style>
        </>
      );
    }
  }

  // Articles Directory View (/artikel)
  const dynamicCategories = Array.from(new Set(articlesList.map((a) => a.category))).filter(Boolean);
  const categories = [lang === 'en' ? 'All' : 'Semua', ...dynamicCategories];

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

          <ArticleGridStyles />
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid var(--color-primary-300)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div className="article-grid">
              {filtered.map((art, idx) => (
                <ArticleCard key={art.id} article={art} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
