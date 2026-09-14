import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

export function ProjectCard({ project, proj }) {
  const item = project || proj;
  if (!item) return null;

  const thumbnail = item.thumbnail || item.image || item.coverImageUrl || '/projects/project_1.jpg';
  const category = item.category || 'PORTOFOLIO';
  const title = item.title || '';
  const location = item.location ? item.location.split(',')[0] : (item.city || 'Bandung');
  const year = item.year || '2025';

  return (
    <Link
      to={`/proyek/${item.slug || item.id}`}
      className="albion-card-link"
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
    >
      <div className="albion-card-wrapper">
        <div className="albion-img-container">
          <img
            src={thumbnail}
            alt={title}
            onError={(e) => { e.currentTarget.src = '/projects/project_1.jpg'; }}
            className="albion-card-img"
          />
        </div>

        <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <span className="albion-card-tag">
            {category}
          </span>

          <h3 className="albion-card-title">
            {title}
          </h3>

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div className="albion-card-divider" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-400)', fontWeight: 500 }}>
                {location} • {year}
              </span>
              <FiArrowUpRight className="albion-card-arrow" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProjectGridStyles() {
  return (
    <style>{`
      .albion-projects-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 40px 32px;
        width: 100%;
      }

      .albion-projects-grid.cols-2 {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 1024px) {
        .albion-projects-grid,
        .albion-projects-grid.cols-2 {
          grid-template-columns: repeat(2, 1fr);
          gap: 32px 24px;
        }
      }

      @media (max-width: 640px) {
        .albion-projects-grid,
        .albion-projects-grid.cols-2 {
          grid-template-columns: 1fr;
          gap: 36px;
        }
      }

      .albion-card-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .albion-img-container {
        width: 100%;
        height: 260px;
        border-radius: 12px;
        overflow: hidden;
        background-color: #0f172a;
        position: relative;
      }

      .albion-card-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .albion-card-link:hover .albion-card-img {
        transform: scale(1.06);
      }

      .albion-card-tag {
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-primary-300);
        margin-bottom: 6px;
      }

      .albion-card-title {
        font-family: var(--font-body);
        font-size: 1.25rem;
        font-weight: 800;
        -webkit-text-stroke: 0.4px currentColor;
        letter-spacing: -0.02em;
        color: #111111;
        line-height: 1.3;
        margin: 0;
        transition: color 0.25s ease;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .albion-card-link:hover .albion-card-title {
        color: var(--color-primary-300);
      }

      .albion-card-divider {
        height: 1px;
        background-color: var(--color-neutral-200);
        width: 100%;
        transition: background-color 0.25s ease;
      }

      .albion-card-link:hover .albion-card-divider {
        background-color: var(--color-primary-300);
      }

      .albion-card-arrow {
        font-size: 1.35rem;
        color: var(--color-neutral-700);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
      }

      .albion-card-link:hover .albion-card-arrow {
        color: var(--color-primary-300);
        transform: translate(3px, -3px);
      }
    `}</style>
  );
}

export default ProjectCard;
