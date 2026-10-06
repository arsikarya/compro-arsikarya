import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

export function ProjectCard({ project, proj, onClick }) {
  const item = project || proj;
  if (!item) return null;

  const thumbnail = item.coverImageUrl || item.thumbnail || item.image || '/projects/project_1.jpg';
  const title = item.title || '';
  const location = item.location || item.city || 'Bandung, Jawa Barat';
  const category = item.category || item.categoryName || item.serviceName || item.scope || (item.features && item.features.length > 0 ? item.features[0] : 'Konstruksi & Design');

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="albion-card-link"
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%', cursor: 'pointer' }}
    >
      <div className="albion-card-wrapper horizontal-project-card">
        {/* Left Side: Photo (40% width) */}
        <div className="albion-img-container horizontal-project-img-wrapper">
          <img
            src={thumbnail}
            alt={title}
            onError={(e) => { e.currentTarget.src = '/projects/project_1.jpg'; }}
            className="albion-card-img horizontal-project-img"
          />
        </div>

        {/* Right Side: Details Content (60% width) */}
        <div className="horizontal-project-content">
          <div>
            {/* Title */}
            <h3 className="albion-card-title horizontal-title">
              {title}
            </h3>

            {/* Meta Block: Lokasi & Kategori Pekerjaan */}
            <div className="horizontal-meta-block">
              <div className="meta-item">
                <span className="meta-label">Lokasi</span>
                <span className="meta-value">{location}</span>
              </div>
              <div className="meta-item" style={{ marginTop: '10px' }}>
                <span className="meta-label">Kategori Pekerjaan</span>
                <span className="meta-value">{category}</span>
              </div>
            </div>
          </div>

          {/* Bottom CTA Link with Chevron Right */}
          <div className="horizontal-cta-link">
            <span>Lihat Proyek</span>
            <FiChevronRight className="horizontal-card-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectGridStyles() {
  return (
    <style>{`
      /* 2 Cards Per Row Grid Layout */
      .albion-projects-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 32px 28px;
        width: 100%;
      }

      .albion-projects-grid.cols-3 {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 900px) {
        .albion-projects-grid,
        .albion-projects-grid.cols-3 {
          grid-template-columns: 1fr;
          gap: 24px;
        }
      }

      /* Horizontal Minimalist Card Wrapper (No Shadow) */
      .horizontal-project-card {
        display: flex;
        flex-direction: row;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        overflow: hidden;
        height: 257.86px;
        min-height: 257.86px;
        max-height: 257.86px;
        box-shadow: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .albion-card-link:hover .horizontal-project-card {
        border-color: var(--color-primary-300, #005697);
        transform: translateY(-2px);
        box-shadow: none;
      }

      /* Image Column */
      .horizontal-project-img-wrapper {
        width: 40%;
        min-width: 40%;
        max-width: 40%;
        height: 100%;
        overflow: hidden;
        position: relative;
        background-color: #0f172a;
      }

      .horizontal-project-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .albion-card-link:hover .horizontal-project-img {
        transform: scale(1.05);
      }

      /* Details Column */
      .horizontal-project-content {
        width: 60%;
        height: 100%;
        padding: 24px 24px 22px 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
      }

      .horizontal-title {
        font-family: var(--font-body);
        font-size: 1.25rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.35;
        margin: 0 0 16px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.25s ease;
      }

      .albion-card-link:hover .horizontal-title {
        color: var(--color-primary-300, #005697);
      }

      .horizontal-meta-block {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-bottom: 16px;
      }

      .meta-item {
        display: flex;
        flex-direction: column;
      }

      .meta-label {
        font-size: 0.78rem;
        color: #94a3b8;
        font-weight: 600;
        margin-bottom: 2px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .meta-value {
        font-size: 0.88rem;
        color: #1e293b;
        font-weight: 600;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .horizontal-cta-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--color-primary-300, #005697);
        transition: transform 0.25s ease;
        margin-top: auto;
      }

      .horizontal-card-arrow {
        font-size: 1.05rem;
        transition: transform 0.3s ease;
        display: inline-flex;
        align-items: center;
      }

      .albion-card-link:hover .horizontal-card-arrow {
        transform: translateX(4px);
      }

      @media (max-width: 640px) {
        .horizontal-project-card {
          flex-direction: column;
          height: auto;
          min-height: auto;
          max-height: none;
        }

        .horizontal-project-img-wrapper {
          width: 100%;
          min-width: 100%;
          max-width: 100%;
          height: 200px;
          min-height: 200px;
          position: relative;
        }

        .horizontal-project-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .horizontal-project-content {
          width: 100%;
          height: auto;
          padding: 20px;
        }
      }
    `}</style>
  );
}

export default ProjectCard;
