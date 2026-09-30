import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import MediaPickerModal from '../../components/admin/MediaPickerModal';
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiEye, FiEyeOff, FiVideo, FiAlertCircle } from 'react-icons/fi';
import './AdminTestimonials.css';

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form state
    const [clientName, setClientName] = useState('');
    const [clientRole, setClientRole] = useState('');
    const [quote, setQuote] = useState('');
    const [projectName, setProjectName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [approved, setApproved] = useState(true);
    const [published, setPublished] = useState(true);
    const [saving, setSaving] = useState(false);

    // Video Testimonial Settings state
    const [videoUrl, setVideoUrl] = useState('');
    const [savingVideo, setSavingVideo] = useState(false);
    const [videoMsg, setVideoMsg] = useState({ type: '', text: '' });

    const fetchTestimonials = () => {
        setLoading(true);
        adminApi.getTestimonials()
            .then(data => setTestimonials(data || []))
            .catch(err => console.error('Failed to fetch testimonials:', err))
            .finally(() => setLoading(false));
    };

    const fetchSettings = () => {
        adminApi.getSettings()
            .then(data => {
                if (data && typeof data.testimonialVideoUrl === 'string') {
                    setVideoUrl(data.testimonialVideoUrl);
                } else if (data && data.testimonialVideoUrl === null) {
                    setVideoUrl('');
                }
            })
            .catch(err => console.error('Failed to fetch settings:', err));
    };

    useEffect(() => {
        fetchTestimonials();
        fetchSettings();
    }, []);

    const handleSaveVideo = async (e) => {
        e?.preventDefault();
        setSavingVideo(true);
        setVideoMsg({ type: '', text: '' });
        try {
            const trimmed = videoUrl.trim();
            await adminApi.updateSettings({ testimonialVideoUrl: trimmed });
            setVideoMsg({
                type: 'success',
                text: trimmed 
                    ? '✅ Link video testimoni berhasil disimpan! Section video akan tampil di website.' 
                    : '✅ Link video berhasil dikosongkan. Section video testimoni di website kini disembunyikan.'
            });
            setTimeout(() => setVideoMsg({ type: '', text: '' }), 5000);
        } catch (err) {
            setVideoMsg({ type: 'error', text: 'Gagal menyimpan link video: ' + err.message });
        } finally {
            setSavingVideo(false);
        }
    };

    const getEmbedUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        const trimmed = url.trim();
        if (!trimmed) return null;
        if (trimmed.includes('youtube.com/embed/')) return trimmed;
        const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
        const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
        if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
        const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
        if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
        if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return `https://www.youtube.com/embed/${trimmed}`;
        return trimmed;
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setClientName(item.clientName || '');
            setClientRole(item.clientRole || '');
            setQuote(item.quote || '');
            setProjectName(item.projectName || '');
            setImageUrl(item.imageUrl || '');
            setApproved(item.approved !== undefined ? item.approved : true);
            setPublished(item.published !== undefined ? item.published : true);
        } else {
            setEditingItem(null);
            setClientName('');
            setClientRole('');
            setQuote('');
            setProjectName('');
            setImageUrl('');
            setApproved(true);
            setPublished(true);
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!clientName.trim() || !quote.trim()) {
            alert('Nama Klien dan Testimoni/Quote wajib diisi!');
            return;
        }

        setSaving(true);
        const data = {
            clientName,
            clientRole,
            quote,
            projectName,
            imageUrl,
            approved,
            published,
        };

        try {
            if (editingItem) {
                await adminApi.updateTestimonial(editingItem.id, data);
            } else {
                await adminApi.createTestimonial(data);
            }
            setShowModal(false);
            fetchTestimonials();
        } catch (err) {
            alert('Gagal menyimpan testimoni: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus testimoni dari "${name}"?`)) return;
        try {
            await adminApi.deleteTestimonial(id);
            fetchTestimonials();
        } catch (err) {
            alert('Gagal menghapus testimoni: ' + err.message);
        }
    };

    const toggleApproved = async (item) => {
        try {
            await adminApi.updateTestimonial(item.id, { approved: !item.approved });
            fetchTestimonials();
        } catch (err) {
            alert('Gagal mengubah status persetujuan: ' + err.message);
        }
    };

    const togglePublished = async (item) => {
        try {
            await adminApi.updateTestimonial(item.id, { published: !item.published });
            fetchTestimonials();
        } catch (err) {
            alert('Gagal mengubah status publikasi: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>
                <p>Memuat testimoni...</p>
            </div>
        );
    }

    return (
        <div className="admin-testimonials-page">
            <div className="admin-page-header">
                <div>
                    <h3 className="page-heading">Kelola Testimoni Klien</h3>
                    <p className="page-subheading">Ulasan dan kutipan pengalaman kerja sama asli dari klien Arsi Karya.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-cms btn-cms-primary">
                    <FiPlus size={16} style={{ marginRight: '6px' }} />
                    Tambah Testimoni
                </button>
            </div>

            {/* Video Testimonials Settings Section */}
            <div className="table-card" style={{ marginBottom: '28px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}>
                            <FiVideo />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
                                Video Testimoni (Halaman Frontend)
                            </h4>
                            <p style={{ margin: '2px 0 0 0', fontSize: '0.83rem', color: '#64748b' }}>
                                Link video YouTube untuk section "Cerita Nyata dari Klien Kami" di halaman Testimoni.
                            </p>
                        </div>
                    </div>

                    <div>
                        {videoUrl.trim() ? (
                            <span className="status-pill status-published" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                                Section Video Aktif
                            </span>
                        ) : (
                            <span className="status-pill status-draft" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }}></span>
                                Section Video Tersembunyi (Kosong)
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ 
                    backgroundColor: videoUrl.trim() ? '#f8fafc' : '#fffbeb', 
                    border: `1px solid ${videoUrl.trim() ? '#e2e8f0' : '#fef3c7'}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    fontSize: '0.85rem',
                    color: videoUrl.trim() ? '#475569' : '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <FiAlertCircle size={18} style={{ flexShrink: 0 }} />
                    <span>
                        <strong>Aturan Tampilan:</strong> Jika link video diisi, section video testimoni akan muncul di website. <strong>Jika link dikosongkan</strong>, seluruh section video testimoni otomatis akan disembunyikan/hilang dari website.
                    </span>
                </div>

                {videoMsg.text && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '0.88rem',
                        backgroundColor: videoMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                        color: videoMsg.type === 'success' ? '#065f46' : '#991b1b',
                        border: `1px solid ${videoMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
                    }}>
                        {videoMsg.text}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 320px' }}>
                            <input 
                                type="text"
                                className="form-input"
                                placeholder="Contoh: https://www.youtube.com/watch?v=sDBl71I37UM atau https://youtu.be/..."
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                                type="button"
                                onClick={handleSaveVideo}
                                disabled={savingVideo}
                                className="btn-cms btn-cms-primary"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {savingVideo ? 'Menyimpan...' : 'Simpan Link Video'}
                            </button>
                            {videoUrl && (
                                <button 
                                    type="button"
                                    onClick={() => setVideoUrl('')}
                                    className="btn-cms btn-cms-outline"
                                    title="Kosongkan link video agar section tersembunyi"
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    Kosongkan
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Live Preview if valid YouTube URL */}
                    {getEmbedUrl(videoUrl) ? (
                        <div style={{ marginTop: '8px' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                                Pratinjau Video Testimoni:
                            </p>
                            <div style={{
                                maxWidth: '440px',
                                position: 'relative',
                                paddingBottom: '247px',
                                height: 0,
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#000'
                            }}>
                                <iframe 
                                    src={getEmbedUrl(videoUrl)}
                                    title="Pratinjau Video Testimoni"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        border: 'none'
                                    }}
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="table-card">
                <table className="cms-table">
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Nama Klien</th>
                            <th>Jabatan / Perusahaan</th>
                            <th>Nama Proyek</th>
                            <th>Kutipan Testimoni</th>
                            <th>Disetujui</th>
                            <th>Terbit</th>
                            <th className="text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testimonials.length > 0 ? (
                            testimonials.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.clientName} className="table-avatar" />
                                        ) : (
                                            <div className="table-avatar-placeholder">
                                                {item.clientName?.[0]?.toUpperCase() || 'K'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="font-semibold">{item.clientName}</td>
                                    <td className="text-secondary">{item.clientRole || '-'}</td>
                                    <td className="text-secondary">{item.projectName || '-'}</td>
                                    <td className="text-secondary" style={{ maxWidth: '280px', fontSize: '0.82rem' }}>
                                        "{item.quote?.substring(0, 80)}..."
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => toggleApproved(item)}
                                            className={`status-pill ${item.approved ? 'status-published' : 'status-draft'}`}
                                            style={{ cursor: 'pointer', border: 'none' }}
                                        >
                                            {item.approved ? 'Disetujui' : 'Pending'}
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => togglePublished(item)}
                                            className={`status-pill ${item.published ? 'status-published' : 'status-draft'}`}
                                            style={{ cursor: 'pointer', border: 'none' }}
                                        >
                                            {item.published ? 'Terbit' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="text-right">
                                        <div className="action-buttons-wrap">
                                            <button onClick={() => handleOpenModal(item)} className="btn-action-sm edit">
                                                <FiEdit size={14} />
                                                <span>Edit</span>
                                            </button>

                                            <button onClick={() => handleDelete(item.id, item.clientName)} className="btn-action-sm delete" title="Hapus">
                                                <FiTrash2 size={14} />
                                                <span>Hapus</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="empty-table-cell">
                                    Belum ada testimoni. Klik "Tambah Testimoni" untuk memasukkan ulasan klien asli.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form Dialog */}
            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>{editingItem ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}</h4>
                            <button onClick={() => setShowModal(false)} className="btn-icon">&times;</button>
                        </div>
                        <form onSubmit={handleSave} className="modal-body">
                            <div className="form-group">
                                <label className="form-label required">Nama Klien</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={clientName} 
                                    onChange={(e) => setClientName(e.target.value)} 
                                    placeholder="Bpk. Hendra Gunawan"
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Jabatan / Instansi</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={clientRole} 
                                    onChange={(e) => setClientRole(e.target.value)} 
                                    placeholder="Director, PT Mitra Tekno" 
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Nama Proyek Terkait</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={projectName} 
                                    onChange={(e) => setProjectName(e.target.value)} 
                                    placeholder="Gudang Industri Karawang" 
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Kutipan Testimoni / Ulasan</label>
                                <textarea 
                                    className="form-input" 
                                    rows="4" 
                                    value={quote} 
                                    onChange={(e) => setQuote(e.target.value)} 
                                    placeholder="Tulis ulasan pengalaman kerja sama dengan Arsi Karya..."
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Foto Klien (Opsional)</label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {imageUrl && (
                                        <img 
                                            src={imageUrl} 
                                            alt="Preview" 
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} 
                                        />
                                    )}
                                    <input 
                                        type="url" 
                                        className="form-input" 
                                        value={imageUrl} 
                                        onChange={(e) => setImageUrl(e.target.value)} 
                                        placeholder="https://..." 
                                        style={{ flex: 1, minWidth: '200px' }}
                                    />
                                    <button 
                                        type="button" 
                                        className="btn-cms btn-cms-outline" 
                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                        onClick={() => setShowMediaPicker(true)}
                                    >
                                        Pilih dari Media
                                    </button>
                                    <CloudinaryUploadWidget onUploadSuccess={setImageUrl} buttonText="Upload Baru" />
                                </div>
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Status Persetujuan</label>
                                    <select className="form-input" value={approved ? 'true' : 'false'} onChange={(e) => setApproved(e.target.value === 'true')}>
                                        <option value="true">Disetujui (Approved)</option>
                                        <option value="false">Perlu Persetujuan (Pending)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Status Publikasi</label>
                                    <select className="form-input" value={published ? 'true' : 'false'} onChange={(e) => setPublished(e.target.value === 'true')}>
                                        <option value="true">Terbit (Published)</option>
                                        <option value="false">Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-cms btn-cms-outline">
                                    Batal
                                </button>
                                <button type="submit" className="btn-cms btn-cms-primary" disabled={saving}>
                                    {saving ? 'Menyimpan...' : 'Simpan Testimoni'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <MediaPickerModal 
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={(url) => setImageUrl(url)}
                title="Pilih Foto Klien Testimoni"
            />
        </div>
    );
}
