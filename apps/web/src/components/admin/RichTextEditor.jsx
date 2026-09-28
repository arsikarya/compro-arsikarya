import React, { useState, useRef, useEffect } from 'react';
import { 
  FiBold, 
  FiItalic, 
  FiList, 
  FiCode, 
  FiEye, 
  FiRotateCcw,
  FiType
} from 'react-icons/fi';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const [mode, setMode] = useState('visual'); // 'visual' | 'html'
  const editorRef = useRef(null);

  // Sync initial or external value changes to contentEditable container
  useEffect(() => {
    if (editorRef.current && mode === 'visual') {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, mode]);

  const handleExecCommand = (command, arg = null) => {
    if (mode !== 'visual') return;
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div style={{
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      marginTop: '8px'
    }}>
      {/* Editor Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '6px',
        padding: '8px 12px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
      }}>
        {/* Formatting Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {mode === 'visual' && (
            <>
              <button
                type="button"
                onClick={() => handleExecCommand('bold')}
                title="Tebal (Bold)"
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#1e293b'
                }}
              >
                <FiBold size={14} /> <span>Tebal</span>
              </button>

              <button
                type="button"
                onClick={() => handleExecCommand('italic')}
                title="Miring (Italic)"
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.825rem',
                  color: '#1e293b'
                }}
              >
                <FiItalic size={14} /> <span>Miring</span>
              </button>

              <div style={{ width: '1px', height: '20px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

              <button
                type="button"
                onClick={() => handleExecCommand('formatBlock', 'H3')}
                title="Sub-Judul (H3)"
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              >
                <FiType size={14} /> <span>Sub-Judul (H3)</span>
              </button>

              <button
                type="button"
                onClick={() => handleExecCommand('formatBlock', 'P')}
                title="Paragraf Biasa"
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  color: '#475569'
                }}
              >
                Paragraf
              </button>

              <div style={{ width: '1px', height: '20px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

              <button
                type="button"
                onClick={() => handleExecCommand('insertUnorderedList')}
                title="List Poin (Bulleted List)"
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.825rem',
                  color: '#1e293b'
                }}
              >
                <FiList size={14} /> <span>List Poin</span>
              </button>

              <button
                type="button"
                onClick={() => handleExecCommand('insertOrderedList')}
                title="List Angka (Numbered List)"
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#1e293b'
                }}
              >
                1. List Angka
              </button>

              <button
                type="button"
                onClick={() => handleExecCommand('removeFormat')}
                title="Hapus Format"
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  color: '#64748b'
                }}
              >
                <FiRotateCcw size={13} />
              </button>
            </>
          )}
        </div>

        {/* Mode Switcher: Visual Editor vs Kode HTML */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#e2e8f0', borderRadius: '6px', padding: '2px' }}>
          <button
            type="button"
            onClick={() => setMode('visual')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: mode === 'visual' ? '#ffffff' : 'transparent',
              boxShadow: mode === 'visual' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: mode === 'visual' ? 700 : 500,
              color: mode === 'visual' ? '#005697' : '#64748b'
            }}
          >
            <FiEye size={13} /> <span>Tampilan Visual</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('html')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: mode === 'html' ? '#ffffff' : 'transparent',
              boxShadow: mode === 'html' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: mode === 'html' ? 700 : 500,
              color: mode === 'html' ? '#005697' : '#64748b'
            }}
          >
            <FiCode size={13} /> <span>Kode HTML</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {mode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          style={{
            minHeight: '260px',
            padding: '16px 20px',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.7,
            color: '#1e293b',
            overflowY: 'auto'
          }}
          data-placeholder={placeholder || 'Tuliskan penjelasan detail di sini...'}
        />
      ) : (
        <textarea
          className="form-input"
          rows="14"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Tuliskan kode HTML penjelasan di sini...'}
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 0,
            padding: '16px 20px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            outline: 'none'
          }}
        />
      )}

      {/* CSS Helper for WYSIWYG Editable Area */}
      <style>{`
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          cursor: text;
        }
        [contenteditable] h3 {
          font-family: var(--font-body);
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        [contenteditable] p {
          margin-bottom: 16px;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin-bottom: 16px;
          padding-left: 24px;
        }
        [contenteditable] li {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}
