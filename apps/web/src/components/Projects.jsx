import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import ProjectCard, { ProjectGridStyles, ProjectSkeletonCard } from './ui/ProjectCard';
import ProjectLightboxModal from './ui/ProjectLightboxModal';
import { publicApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { getProjectsData } from '../data/projectsData';

export default function Projects() {
  const { lang, t } = useLanguage();
  const cachedProjects = publicApi.getCachedProjects?.() || [];
  const [featuredProjects, setFeaturedProjects] = useState(() => {
    if (Array.isArray(cachedProjects) && cachedProjects.length > 0) {
      return cachedProjects.slice(0, 4).map(p => ({
        ...p,
        title: lang === 'en' ? (p.titleEn || p.title) : p.title,
        category: lang === 'en' ? (p.categoryEn || p.category) : p.category,
        description: lang === 'en' ? (p.descriptionEn || p.description) : p.description,
      }));
    }
    return [];
  });
  const [loading, setLoading] = useState(featuredProjects.length === 0);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (featuredProjects.length === 0) {
      setLoading(true);
    }
    publicApi.getProjects()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const transformed = data.slice(0, 4).map(p => {
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
        } else if (featuredProjects.length === 0) {
          setFeaturedProjects(getProjectsData(lang).slice(0, 4));
        }
      })
      .catch(() => {
        if (featuredProjects.length === 0) {
          setFeaturedProjects(getProjectsData(lang).slice(0, 4));
        }
      })
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
          <div style={{ maxWidth: '850px' }}>
            <span className="section-tag">{t.projects.tag}</span>
            <h2
              style={{
                fontSize: 'clamp(2.1rem, 3.6vw, 2.9rem)',
                fontWeight: 800,
                color: 'var(--color-neutral-800)',
                lineHeight: 1.25,
              }}
            >
              {lang === 'en' ? 'Track Record of Projects' : 'Rekam Jejak Pekerjaan'}
            </h2>
          </div>

          <div>
            <Button to="/proyek" variant="primary" showArrow={true}>
              {t.projects.btnAll}
            </Button>
          </div>
        </div>

        {/* 4 Featured Projects (2x2 Grid) */}
        {loading ? (
          <div className="albion-projects-grid">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProjectSkeletonCard key={`home-skel-${idx}`} />
            ))}
          </div>
        ) : (
          <div className="albion-projects-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id || project.slug} proj={project} onClick={(p) => setSelectedProject(p)} />
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectLightboxModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
