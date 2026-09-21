import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const fallbackImages = [
  '/projects/project_1.jpg',
  '/projects/project_3.jpg',
  '/projects/project_5.jpg',
  '/projects/project_8.jpg',
  '/projects/gallery_1.jpg',
];

const mockTimes = ['09:30', '14:15', '10:00', '16:45', '11:20'];

function formatPublishDateTime(dateVal, idx = 0) {
  if (!dateVal) return `10 Mar 2026 • ${mockTimes[idx % mockTimes.length]}`;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  if (typeof dateVal === 'string' && dateVal.includes('-')) {
    const parts = dateVal.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      const month = months[monthIdx] || 'Mar';
      const timeStr = mockTimes[idx % mockTimes.length];
      return `${day} ${month} ${year} • ${timeStr}`;
    }
  }

  return `${dateVal} • ${mockTimes[idx % mockTimes.length]}`;
}

export function ArticleCard({ article, item, idx = 0 }) {
  const data = article || item;
  if (!data) return null;

  const image = data.thumbnail || data.image || data.coverImageUrl || fallbackImages[idx % fallbackImages.length];
  const category = (data.category || 'BERITA & ARTIKEL').toUpperCase();
  const title = data.title || '';
  const dateStr = data.date || data.publishedDate || data.createdAt || '2026-03-10';
  const formattedPublishDate = formatPublishDateTime(dateStr, idx);

  return (
    <Link
      to={`/artikel/${data.slug || data.id}`}
      className="article-card-link"
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
    >
      <div className="article-card-wrapper">
        <div className="article-img-container">
          <img
            src={image}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = fallbackImages[idx % fallbackImages.length];
            }}
            className="article-card-img"
          />
        </div>

        <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <span className="article-card-tag">
            {category}
          </span>

          <h3 className="article-card-title">
            {title}
          </h3>

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div className="article-card-divider" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-400)', fontWeight: 500 }}>
                {formattedPublishDate}
              </span>
              <FiArrowUpRight className="article-card-arrow" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ArticleGridStyles() {
  return (
    <style>{`
      .article-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 40px 32px;
        width: 100%;
      }

      .article-grid.cols-2 {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 1024px) {
        .article-grid,
        .article-grid.cols-2 {
          grid-template-columns: repeat(2, 1fr);
          gap: 32px 24px;
        }
      }

      @media (max-width: 640px) {
        .article-grid,
        .article-grid.cols-2 {
          grid-template-columns: 1fr;
          gap: 36px;
        }
      }

      .article-card-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .article-img-container {
        width: 100%;
        height: 260px;
        border-radius: 12px;
        overflow: hidden;
        background-color: #0f172a;
        position: relative;
      }

      .article-card-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .article-card-link:hover .article-card-img {
        transform: scale(1.06);
      }

      .article-card-tag {
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-primary-300);
        margin-bottom: 6px;
      }

      .article-card-title {
        font-family: var(--font-body);
        font-size: 1.25rem;
        font-weight: 800;
        -webkit-text-stroke: 0.4px currentColor;
        letter-spacing: -0.02em;
        color: #111111;
        line-height: 1.35;
        margin: 0;
        transition: color 0.25s ease;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .article-card-link:hover .article-card-title {
        color: var(--color-primary-300);
      }

      .article-card-divider {
        height: 1px;
        background-color: var(--color-neutral-200);
        width: 100%;
        transition: background-color 0.25s ease;
      }

      .article-card-link:hover .article-card-divider {
        background-color: var(--color-primary-300);
      }

      .article-card-arrow {
        font-size: 1.35rem;
        color: var(--color-neutral-700);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
      }

      .article-card-link:hover .article-card-arrow {
        color: var(--color-primary-300);
        transform: translate(3px, -3px);
      }
    `}</style>
  );
}

export default ArticleCard;
