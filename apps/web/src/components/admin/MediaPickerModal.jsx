import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import { FiX, FiSearch, FiCheck, FiImage, FiUploadCloud } from 'react-icons/fi';
import './MediaPickerModal.css';

export default function MediaPickerModal({ 
    isOpen, 
    onClose, 
    onSelect, 
    title = "Pilih Gambar dari Media Library",
    subtitle = "Pilih gambar yang sudah ada di Cloudinary atau unggah gambar baru",
    allowCaption = false,
    confirmText = "Gunakan Gambar Ini"
}) {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUrl, setSelectedUrl] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [caption, setCaption] = useState('');
    const [altText, setAltText] = useState('');
    const [directUrl, setDirectUrl] = useState('');

    const loadMedia = () => {
        setLoading(true);
        adminApi.getMedia()
            .then(data => setMediaItems(data || []))
            .catch(err => console.error('Gagal memuat media:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (isOpen) {
            loadMedia();
            setSelectedUrl('');
            setSelectedItem(null);
            setSearchQuery('');
            setCaption('');
            setAltText('');
            setDirectUrl('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredMedia = mediaItems.filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            item.publicId?.toLowerCase().includes(q) ||
            item.altText?.toLowerCase().includes(q) ||
            item.url?.toLowerCase().includes(q) ||
            item.format?.toLowerCase().includes(q)
        );
    });

    const handleItemClick = (item) => {
        setSelectedUrl(item.url);
        setSelectedItem(item);
        if (item.altText && !altText) {
            setAltText(item.altText);
        }
    };

    const handleConfirm = () => {
        if (selectedUrl && onSelect) {
            onSelect(selectedUrl, {
                ...(selectedItem || {}),
                caption: caption.trim(),
                altText: (altText || caption || selectedItem?.publicId?.split('/')?.pop() || 'Foto').trim()
            });
            onClose();
        }
    };

    const handleUploadSuccess = (url, result) => {
        loadMedia();
        if (allowCaption) {
            setSelectedUrl(url);
            setSelectedItem(result?.info || { url });
        } else if (onSelect) {
            onSelect(url, result?.info);
            onClose();
        }
    };

    return (
        <div className="media-picker-backdrop" onClick={onClose}>
            <div className="media-picker-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="media-picker-header">
                    <div className="media-picker-title-area">
                        <FiImage className="media-picker-icon" />
                        <div>
                            <h4>{title}</h4>
                            <p>{subtitle}</p>
                        </div>
                    </div>
                    <button className="btn-close-modal" onClick={onClose} aria-label="Tutup modal">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="media-picker-toolbar">
                    <div className="media-picker-search">
                        <FiSearch className="picker-search-icon" />
                        <input
                            type="text"
                            placeholder="Cari nama gambar, format, ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="media-picker-upload">
                        <CloudinaryUploadWidget 
                            buttonText="Unggah Baru" 
                            className="btn-picker-upload"
                            onUploadSuccess={handleUploadSuccess}
                        />
                    </div>
                </div>

                {/* Direct Image URL Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 24px',
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    fontSize: '0.8rem'
                }}>
                    <span style={{ color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Atau Masukkan URL Gambar:</span>
                    <input 
                        type="url"
                        placeholder="https://example.com/foto.jpg..."
                        value={directUrl}
                        onChange={(e) => {
                            const val = e.target.value;
                            setDirectUrl(val);
                            setSelectedUrl(val);
                            setSelectedItem(val ? { url: val, publicId: val.split('/').pop() } : null);
                        }}
                        style={{
                            flex: 1,
                            padding: '6px 12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Content Body */}
                <div className="media-picker-body">
                    {loading ? (
                        <div className="media-picker-loading">
                            <p>Memuat aset media Cloudinary...</p>
                        </div>
                    ) : filteredMedia.length > 0 ? (
                        <div className="media-picker-grid">
                            {filteredMedia.map((item) => {
                                const isSelected = selectedUrl === item.url;
                                const filename = item.publicId?.split('/').pop() || 'Gambar';
                                return (
                                    <div
                                        key={item.id || item.publicId}
                                        className={`media-picker-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleItemClick(item)}
                                        onDoubleClick={() => {
                                            if (onSelect) {
                                                onSelect(item.url, {
                                                    ...item,
                                                    caption: caption.trim(),
                                                    altText: (altText || caption || item.publicId?.split('/')?.pop() || 'Foto').trim()
                                                });
                                                onClose();
                                            }
                                        }}
                                        title="Klik untuk memilih, klik 2x untuk langsung gunakan"
                                    >
                                        <div className="media-picker-thumb">
                                            <img src={item.url} alt={filename} loading="lazy" />
                                            {isSelected && (
                                                <div className="picker-selected-badge">
                                                    <FiCheck size={18} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="media-picker-meta">
                                            <span className="picker-filename">{filename}</span>
                                            <span className="picker-dims">
                                                {item.format?.toUpperCase()} {item.width && item.height ? `• ${item.width}x${item.height}` : ''}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="media-picker-empty">
                            <FiUploadCloud size={40} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                            <p>Tidak ada media yang cocok dengan pencarian.</p>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                Silakan gunakan tombol "Unggah Baru" di atas untuk menambahkan gambar.
                            </p>
                        </div>
                    )}
                </div>

                {/* Optional Caption & Alt-text Box */}
                {allowCaption && selectedUrl && (
                    <div style={{
                        padding: '12px 24px',
                        backgroundColor: '#f0fdf4',
                        borderTop: '1px solid #bbf7d0',
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: '1 1 260px' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#166534', marginBottom: '4px' }}>
                                Keterangan Foto / Caption (Opsional — Tampil di bawah gambar)
                            </label>
                            <input 
                                type="text"
                                placeholder="Contoh: Proses perakitan struktur baja proyek..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '6px 12px',
                                    border: '1px solid #86efac',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    backgroundColor: '#ffffff'
                                }}
                            />
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#166534', marginBottom: '4px' }}>
                                Alt-Text / SEO (Opsional)
                            </label>
                            <input 
                                type="text"
                                placeholder="Deskripsi untuk pembaca layar..."
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '6px 12px',
                                    border: '1px solid #86efac',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    backgroundColor: '#ffffff'
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="media-picker-footer">
                    <div className="media-picker-selected-info">
                        {selectedItem ? (
                            <span>Terpilih: <strong>{selectedItem.publicId?.split('/').pop() || selectedUrl}</strong></span>
                        ) : (
                            <span style={{ color: '#9ca3af' }}>Pilih satu gambar dari galeri di atas atau unggah gambar baru</span>
                        )}
                    </div>
                    <div className="media-picker-actions">
                        <button type="button" className="btn-picker-cancel" onClick={onClose}>
                            Batal
                        </button>
                        <button
                            type="button"
                            className="btn-picker-confirm"
                            disabled={!selectedUrl}
                            onClick={handleConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
