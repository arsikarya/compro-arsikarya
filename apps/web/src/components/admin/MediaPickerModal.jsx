import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import { FiX, FiSearch, FiCheck, FiImage, FiUploadCloud } from 'react-icons/fi';
import './MediaPickerModal.css';

export default function MediaPickerModal({ isOpen, onClose, onSelect, title = "Pilih Gambar dari Media Library" }) {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUrl, setSelectedUrl] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

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
    };

    const handleConfirm = () => {
        if (selectedUrl && onSelect) {
            onSelect(selectedUrl, selectedItem);
            onClose();
        }
    };

    const handleUploadSuccess = (url, result) => {
        loadMedia();
        if (onSelect) {
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
                            <p>Pilih gambar yang sudah ada di Cloudinary atau unggah gambar baru</p>
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
                                            onSelect(item.url, item);
                                            onClose();
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

                {/* Footer */}
                <div className="media-picker-footer">
                    <div className="media-picker-selected-info">
                        {selectedItem ? (
                            <span>Terpilih: <strong>{selectedItem.publicId?.split('/').pop()}</strong></span>
                        ) : (
                            <span style={{ color: '#9ca3af' }}>Pilih satu gambar dari galeri di atas</span>
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
                            Gunakan Gambar Ini
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
