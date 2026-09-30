import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import { FiImage, FiCopy, FiTrash2, FiSearch, FiExternalLink, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import './AdminMedia.css';

export default function AdminMedia() {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState('all'); // 'all' | 'used' | 'unused'
    const [copiedId, setCopiedId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [deletingAllUnused, setDeletingAllUnused] = useState(false);

    const fetchMedia = () => {
        setLoading(true);
        adminApi.getMedia()
            .then(data => setMediaItems(data || []))
            .catch(err => console.error('Failed to fetch media:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUploadSuccess = async () => {
        // CloudinaryUploadWidget already auto-registers to DB!
        // We just re-fetch to show the newly added asset.
        fetchMedia();
    };

    const handleSyncCloudinary = async () => {
        try {
            setSyncing(true);
            const res = await adminApi.syncCloudinary();
            alert(`✓ Berhasil menarik ${res.syncedCount} gambar langsung dari Cloudinary!`);
            fetchMedia();
        } catch (err) {
            alert('⚠️ ' + (err.message || 'Gagal sinkronisasi dengan Cloudinary'));
        } finally {
            setSyncing(false);
        }
    };

    const handleCopyUrl = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (item) => {
        const isUsed = item.inUse && item.usedBy?.length > 0;
        let confirmMsg = `Hapus gambar "${item.publicId?.split('/').pop() || item.publicId}" dari website?`;
        
        if (isUsed) {
            confirmMsg = `⚠️ PERINGATAN: Gambar ini sedang DIGUNAKAN oleh:\n\n• ${item.usedBy.join('\n• ')}\n\nApakah Anda tetap ingin menghapusnya secara paksa? (Gambar pada item terkait tidak akan tampil lagi)`;
        } else {
            confirmMsg = `Gambar "${item.publicId?.split('/').pop() || item.publicId}" TIDAK SEDANG DIGUNAKAN di website.\n\nApakah Anda yakin ingin menghapusnya?`;
        }

        if (!window.confirm(confirmMsg)) return;

        try {
            setDeletingId(item.id);
            await adminApi.deleteMedia(item.id, isUsed);
            fetchMedia();
        } catch (err) {
            alert('⚠️ Gagal menghapus media: ' + (err.message || err));
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteAllUnused = async () => {
        if (!window.confirm(`Hapus semua ${unusedCount} gambar yang tidak digunakan dari website dan Cloudinary? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }
        try {
            setDeletingAllUnused(true);
            const res = await adminApi.deleteUnusedMedia();
            alert(`✓ Berhasil membersihkan ${res.deletedCount} gambar yang tidak digunakan.`);
            fetchMedia();
        } catch (err) {
            alert('⚠️ Gagal membersihkan media tidak terpakai: ' + (err.message || err));
        } finally {
            setDeletingAllUnused(false);
        }
    };

    // Filter by tab and search
    const filteredMedia = mediaItems.filter(item => {
        // Tab filter
        if (filterTab === 'used' && !item.inUse) return false;
        if (filterTab === 'unused' && item.inUse) return false;

        // Search query filter
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            item.publicId?.toLowerCase().includes(query) ||
            item.altText?.toLowerCase().includes(query) ||
            item.url?.toLowerCase().includes(query) ||
            item.format?.toLowerCase().includes(query) ||
            item.usedBy?.some(u => u.toLowerCase().includes(query))
        );
    });

    const formatBytes = (bytes) => {
        if (!bytes) return '-';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const usedCount = mediaItems.filter(m => m.inUse).length;
    const unusedCount = mediaItems.filter(m => !m.inUse).length;

    if (loading && mediaItems.length === 0) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>
                <p>Memuat media library Cloudinary...</p>
            </div>
        );
    }

    return (
        <div className="admin-media-page">
            <div className="admin-page-header admin-media-header">
                <div className="admin-media-header-left">
                    <h3 className="page-heading">Media Library (Cloudinary)</h3>
                    <p className="page-subheading">
                        Semua berkas gambar tersimpan di Cloudinary CDN. Anda dapat memilih, menyalin URL, atau menghapus gambar yang tidak terpakai secara langsung.
                    </p>
                </div>
                <div className="admin-media-header-actions">
                    <button 
                        type="button" 
                        className="btn-cms btn-cms-outline"
                        onClick={handleSyncCloudinary}
                        disabled={syncing}
                        title="Tarik semua gambar langsung dari akun Cloudinary agsidj31"
                    >
                        <FiRefreshCw size={14} className={syncing ? 'spin-icon' : ''} style={{ marginRight: '6px' }} />
                        <span>{syncing ? 'Menyinkronkan...' : 'Sinkronkan Cloudinary'}</span>
                    </button>
                    <CloudinaryUploadWidget 
                        buttonText="Unggah Gambar Baru" 
                        className="btn-cms btn-cms-primary"
                        onUploadSuccess={handleUploadSuccess} 
                    />
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="media-filter-bar">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="media-tabs">
                        <button 
                            className={`media-tab-btn ${filterTab === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterTab('all')}
                        >
                            Semua Media ({mediaItems.length})
                        </button>
                        <button 
                            className={`media-tab-btn ${filterTab === 'used' ? 'active' : ''}`}
                            onClick={() => setFilterTab('used')}
                        >
                            <FiCheckCircle size={14} style={{ marginRight: '6px', color: '#10b981' }} />
                            Digunakan ({usedCount})
                        </button>
                        <button 
                            className={`media-tab-btn ${filterTab === 'unused' ? 'active' : ''}`}
                            onClick={() => setFilterTab('unused')}
                        >
                            <FiAlertCircle size={14} style={{ marginRight: '6px', color: '#f59e0b' }} />
                            Tidak Terpakai ({unusedCount})
                        </button>
                    </div>

                    {filterTab === 'unused' && unusedCount > 0 && (
                        <button 
                            type="button" 
                            className="btn-cms btn-cms-danger"
                            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                            onClick={handleDeleteAllUnused}
                            disabled={deletingAllUnused}
                        >
                            <FiTrash2 size={13} style={{ marginRight: '6px' }} />
                            {deletingAllUnused ? 'Membersihkan...' : `Hapus Semua Tidak Terpakai (${unusedCount})`}
                        </button>
                    )}
                </div>

                <div className="search-wrap">
                    <FiSearch className="search-icon" />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Cari nama file, format, proyek pemakai..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Media Grid */}
            {filteredMedia.length > 0 ? (
                <div className="media-grid">
                    {filteredMedia.map((item) => {
                        const filename = item.publicId?.split('/').pop() || item.publicId;
                        return (
                            <div key={item.id} className="media-card">
                                <div className="media-thumb-container">
                                    <img src={item.url} alt={item.altText || filename} className="media-img" loading="lazy" />
                                    
                                    {/* Status Badge */}
                                    <div className="media-status-badge-wrap">
                                        {item.inUse ? (
                                            <span className="media-badge in-use" title={item.usedBy?.join('\n')}>
                                                <FiCheckCircle size={11} /> Digunakan
                                            </span>
                                        ) : (
                                            <span className="media-badge unused" title="Aman untuk dihapus">
                                                Tidak Terpakai
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Overlay */}
                                    <div className="media-overlay-actions">
                                        <button 
                                            type="button"
                                            onClick={() => handleCopyUrl(item.url, item.id)} 
                                            className="btn-overlay"
                                            title="Salin URL Gambar"
                                        >
                                            <FiCopy size={14} />
                                            <span>{copiedId === item.id ? 'Tersalin!' : 'Salin URL'}</span>
                                        </button>
                                        <a 
                                            href={item.url} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="btn-overlay"
                                            title="Buka Gambar Asli (Ukuran Penuh)"
                                        >
                                            <FiExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>

                                <div className="media-card-info">
                                    <span className="media-public-id" title={item.publicId}>
                                        {filename}
                                    </span>
                                    <div className="media-meta-row">
                                        <span className="media-ext">{item.format?.toUpperCase() || 'IMG'}</span>
                                        <span>•</span>
                                        <span>{item.width && item.height ? `${item.width}x${item.height}` : '-'}</span>
                                        <span>•</span>
                                        <span>{formatBytes(item.bytes)}</span>
                                    </div>

                                    {/* Usage details */}
                                    {item.inUse && item.usedBy?.length > 0 && (
                                        <div className="media-used-by" title={item.usedBy.join(', ')}>
                                            Dipakai di: {item.usedBy[0]}{item.usedBy.length > 1 ? ` (+${item.usedBy.length - 1})` : ''}
                                        </div>
                                    )}

                                    <button 
                                        type="button"
                                        disabled={deletingId === item.id}
                                        onClick={() => handleDelete(item)} 
                                        className={`btn-delete-media ${item.inUse ? 'btn-delete-warning' : 'btn-delete-safe'}`}
                                        title={item.inUse ? 'Hapus media (peringatan: sedang dipakai)' : 'Hapus berkas tidak terpakai'}
                                    >
                                        <FiTrash2 size={13} style={{ marginRight: '4px' }} />
                                        {deletingId === item.id ? 'Menghapus...' : (item.inUse ? 'Hapus (Dipakai)' : 'Hapus Media')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-gallery-box" style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <FiImage size={40} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                    <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>Tidak ada gambar yang sesuai</p>
                    <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
                        {searchQuery ? `Tidak ada media yang cocok dengan kata kunci "${searchQuery}"` : 'Belum ada media di tab ini.'}
                    </p>
                </div>
            )}
        </div>
    );
}
