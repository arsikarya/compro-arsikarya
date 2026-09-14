import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import ProjectCard, { ProjectGridStyles } from './ui/ProjectCard';
import { getProjectsData } from '../data/projectsData';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Projects() {
  const { lang, t } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState(getProjectsData(lang).slice(0, 3));

  useEffect(() => {
    setFeaturedProjects(getProjectsData(lang).slice(0, 3));
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
      .catch(() => {});
  }, [lang]);

  return (
    <section id="projects" className="section-padding" style={{ backgroundColor: '#f5f5f5', borderTop: '1px solid var(--color-neutral-200)' }}>
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
        <div className="albion-projects-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id || project.slug} proj={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
