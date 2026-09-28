import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
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
    const [approved, setApproved] = useState(true);
    const [published, setPublished] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchTestimonials = () => {
        setLoading(true);
        adminApi.getTestimonials()
            .then(data => setTestimonials(data || []))
            .catch(err => console.error('Failed to fetch testimonials:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

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
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input 
                                        type="url" 
                                        className="form-input" 
                                        value={imageUrl} 
                                        onChange={(e) => setImageUrl(e.target.value)} 
                                        placeholder="https://..." 
                                        style={{ flex: 1 }}
                                    />
                                    <CloudinaryUploadWidget onUploadSuccess={setImageUrl} />
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
        </div>
    );
}
