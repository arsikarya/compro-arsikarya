import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function FAQ({ items = [] }) {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-neutral-200)',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
          >
            <button
              onClick={() => toggle(idx)}
              style={{
                width: '100%',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--color-neutral-700)',
              }}
            >
              <span>{item.question}</span>
              <FiChevronDown
                style={{
                  fontSize: '1.2rem',
                  color: 'var(--color-primary-300)',
                  transition: 'transform 0.25s ease',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  flexShrink: 0,
                  marginLeft: '16px',
                }}
              />
            </button>

            {isOpen && (
              <div
                style={{
                  padding: '0 24px 24px 24px',
                  fontSize: '0.95rem',
                  color: 'var(--color-neutral-500)',
                  lineHeight: 1.6,
                  borderTop: '1px solid var(--color-neutral-100)',
                  paddingTop: '16px',
                }}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
