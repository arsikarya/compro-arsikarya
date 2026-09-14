import React from 'react';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  error,
  options = [],
  rows = 4,
}) {
  const cleanLabel = label ? label.replace(/\s*\*+\s*$/, '').trim() : '';

  const inputStyle = {
    width: '100%',
    padding: type === 'select' ? '12px 40px 12px 16px' : '12px 16px',
    borderRadius: 'var(--radius-control, 8px)',
    border: error ? '1px solid #e11d48' : '1px solid var(--color-neutral-200, #cbd5e1)',
    fontSize: '0.925rem',
    backgroundColor: '#f5f5f5',
    color: 'var(--color-neutral-700, #334155)',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label htmlFor={name} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>
          {cleanLabel} {required && <span style={{ color: '#e11d48', marginLeft: '3px', fontWeight: 'bold' }}>*</span>}
        </label>
      )}

      {type === 'select' ? (
        <div style={{ position: 'relative', width: '100%' }}>
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            style={{
              ...inputStyle,
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '16px 16px',
              cursor: 'pointer',
            }}
          >
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
          </select>
        </div>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows}
          style={inputStyle}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}

      {error && <span style={{ fontSize: '0.8rem', color: '#e11d48', fontWeight: 500 }}>{error}</span>}
    </div>
  );
}
