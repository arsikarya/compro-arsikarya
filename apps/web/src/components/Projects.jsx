import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import ProjectCard, { ProjectGridStyles } from './ui/ProjectCard';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Projects() {
  const { lang, t } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicApi.getProjects()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const transformed = data.slice(0, 3).map(p => {
            if (lang === 'en') {
              return {
                ...p,
                title: p.titleEn || p.title,
                category: p.categoryEn || p.category,
                description: p.descriptionEn || p.description,
              };
            }
            return p;
          });
          setFeaturedProjects(transformed);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lang]);

  return (
    <section id="projects" className="section-padding" style={{ backgroundColor: '#f5f5f5', borderTop: '1px solid var(--color-neutral-200)', minHeight: '400px' }}>
      <ProjectGridStyles />
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '24px',
            marginBottom: '50px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span className="section-tag">{t.projects.tag}</span>
            <h2
              style={{
                fontSize: 'clamp(2.1rem, 3.6vw, 2.9rem)',
                fontWeight: 800,
                color: 'var(--color-neutral-800)',
                lineHeight: 1.28,
              }}
            >
              {t.projects.title}
            </h2>
          </div>

          <div>
            <Button to="/proyek" variant="primary">
              {t.projects.btnAll}
            </Button>
          </div>
        </div>

        {/* 3 Column Albion Image Cards Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid var(--color-primary-300)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div className="albion-projects-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id || project.slug} proj={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
