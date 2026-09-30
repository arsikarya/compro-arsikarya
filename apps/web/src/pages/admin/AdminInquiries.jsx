import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { FiEye, FiTrash2, FiSearch } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './AdminInquiries.css';

export const INQUIRY_STATUS_CONFIG = {
    new: {
        label: 'Baru',
        bg: '#eff6ff',
        color: '#1d4ed8',
        border: '#93c5fd',
        dot: '#3b82f6',
        badgeBg: '#dbeafe',
        desc: 'Pengajuan baru masuk, menunggu respon tim'
    },
    reviewing: {
        label: 'Ditinjau',
        bg: '#fffbeb',
        color: '#b45309',
        border: '#fde68a',
        dot: '#f59e0b',
        badgeBg: '#fef3c7',
        desc: 'Sedang ditinjau oleh tim arsitek / teknis'
    },
    contacted: {
        label: 'Sudah Dihubungi',
        bg: '#f5f3ff',
        color: '#6d28d9',
        border: '#ddd6fe',
        dot: '#8b5cf6',
        badgeBg: '#ede9fe',
        desc: 'Klien telah dihubungi via WhatsApp / telepon'
    },
    qualified: {
        label: 'Qualified',
        bg: '#f0fdfa',
        color: '#0f766e',
        border: '#99f6e4',
        dot: '#14b8a6',
        badgeBg: '#ccfbf1',
        desc: 'Kebutuhan valid & siap lanjut ke tahap berikutnya'
    },
    closed: {
        label: 'Selesai',
        bg: '#f0fdf4',
        color: '#15803d',
        border: '#86efac',
        dot: '#22c55e',
        badgeBg: '#dcfce7',
        desc: 'Konsultasi selesai atau deal tercapai'
    }
};

export default function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchInquiries = () => {
        setLoading(true);
        adminApi.getInquiries()
            .then(data => setInquiries(data || []))
            .catch(err => console.error('Failed to fetch inquiries:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus pengajuan dari "${name}"?`)) return;
        try {
            await adminApi.deleteInquiry(id);
            fetchInquiries();
        } catch (err) {
            alert('Gagal menghapus pengajuan: ' + err.message);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await adminApi.updateInquiryStatus(id, newStatus);
            fetchInquiries();
        } catch (err) {
            alert('Gagal mengubah status: ' + err.message);
        }
    };

    const filteredInquiries = inquiries.filter(item => {
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = !query || 
            item.nama?.toLowerCase().includes(query) ||
            item.whatsapp?.includes(query) ||
            (item.jenisKerjasama || item.jenisLayanan)?.toLowerCase().includes(query) ||
            item.jenisProyek?.toLowerCase().includes(query) ||
            item.lokasi?.toLowerCase().includes(query) ||
            item.pesan?.toLowerCase().includes(query);
        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>
                <p>Memuat pengajuan kerja sama...</p>
            </div>
        );
    }

    return (
        <div className="admin-inquiries-page">
            <div className="admin-page-header">
                <div>
                    <h3 className="page-heading">Pengajuan Kerja Sama (Leads)</h3>
                    <p className="page-subheading">Kelola pesan dan formulir pengajuan kerja sama dari pengunjung website.</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="filter-bar-card">
                <div className="search-wrap">
                    <FiSearch className="search-icon" />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Cari nama pengaju, nomor WhatsApp, jenis layanan, proyek, atau lokasi..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="status-tabs">
                    <button className={`tab-btn ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
                        Semua ({inquiries.length})
                    </button>
                    <button className={`tab-btn ${filterStatus === 'new' ? 'active' : ''}`} onClick={() => setFilterStatus('new')}>
                        <span className="tab-dot" style={{ backgroundColor: INQUIRY_STATUS_CONFIG.new.dot }} />
                        Baru ({inquiries.filter(i => i.status === 'new').length})
                    </button>
                    <button className={`tab-btn ${filterStatus === 'reviewing' ? 'active' : ''}`} onClick={() => setFilterStatus('reviewing')}>
                        <span className="tab-dot" style={{ backgroundColor: INQUIRY_STATUS_CONFIG.reviewing.dot }} />
                        Ditinjau ({inquiries.filter(i => i.status === 'reviewing').length})
                    </button>
                    <button className={`tab-btn ${filterStatus === 'contacted' ? 'active' : ''}`} onClick={() => setFilterStatus('contacted')}>
                        <span className="tab-dot" style={{ backgroundColor: INQUIRY_STATUS_CONFIG.contacted.dot }} />
                        Sudah Dihubungi ({inquiries.filter(i => i.status === 'contacted').length})
                    </button>
                    <button className={`tab-btn ${filterStatus === 'qualified' ? 'active' : ''}`} onClick={() => setFilterStatus('qualified')}>
                        <span className="tab-dot" style={{ backgroundColor: INQUIRY_STATUS_CONFIG.qualified.dot }} />
                        Qualified ({inquiries.filter(i => i.status === 'qualified').length})
                    </button>
                    <button className={`tab-btn ${filterStatus === 'closed' ? 'active' : ''}`} onClick={() => setFilterStatus('closed')}>
                        <span className="tab-dot" style={{ backgroundColor: INQUIRY_STATUS_CONFIG.closed.dot }} />
                        Selesai ({inquiries.filter(i => i.status === 'closed').length})
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="table-card">
                <table className="cms-table">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Nama Pengaju</th>
                            <th>WhatsApp</th>
                            <th>Jenis Layanan</th>
                            <th>Jenis Proyek</th>
                            <th>Lokasi Proyek</th>
                            <th>Status</th>
                            <th className="text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInquiries.length > 0 ? (
                            filteredInquiries.map((item) => {
                                const currentStatusMeta = INQUIRY_STATUS_CONFIG[item.status] || INQUIRY_STATUS_CONFIG.new;
                                const rawPhone = (item.whatsapp || '').replace(/[^0-9]/g, '');
                                const waUrl = `https://wa.me/${rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone}`;

                                return (
                                    <tr key={item.id}>
                                        <td className="text-secondary" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                                            {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="font-semibold" style={{ color: '#0f172a' }}>
                                            {item.nama}
                                        </td>
                                        <td>
                                            <a 
                                                href={waUrl} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="wa-link"
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                            >
                                                <FaWhatsapp size={15} style={{ color: '#059669', flexShrink: 0 }} />
                                                <span>{item.whatsapp}</span>
                                            </a>
                                        </td>
                                        <td>
                                            <span className="service-tag">
                                                {item.jenisKerjasama || item.jenisLayanan || '-'}
                                            </span>
                                        </td>
                                        <td className="text-secondary" style={{ fontWeight: 500 }}>
                                            {item.jenisProyek || '-'}
                                        </td>
                                        <td className="text-secondary" style={{ fontSize: '0.85rem' }}>
                                            {item.lokasi || '-'}
                                        </td>
                                        <td>
                                            {/* Colored Status Select Badge */}
                                            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                                <span 
                                                    style={{ 
                                                        position: 'absolute', 
                                                        left: '10px', 
                                                        width: '8px', 
                                                        height: '8px', 
                                                        borderRadius: '50%', 
                                                        backgroundColor: currentStatusMeta.dot, 
                                                        pointerEvents: 'none',
                                                        zIndex: 2 
                                                    }} 
                                                />
                                                <select 
                                                    value={item.status} 
                                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                    className="status-select-colored"
                                                    style={{
                                                        backgroundColor: currentStatusMeta.bg,
                                                        color: currentStatusMeta.color,
                                                        borderColor: currentStatusMeta.border,
                                                    }}
                                                >
                                                    <option value="new">Baru</option>
                                                    <option value="reviewing">Ditinjau</option>
                                                    <option value="contacted">Sudah Dihubungi</option>
                                                    <option value="qualified">Qualified</option>
                                                    <option value="closed">Selesai</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="action-buttons-wrap">
                                                <Link to={`/admin/inquiries/${item.id}`} className="btn-action-sm edit">
                                                    <FiEye size={14} />
                                                    <span>Detail</span>
                                                </Link>

                                                <button onClick={() => handleDelete(item.id, item.nama)} className="btn-action-sm delete" title="Hapus">
                                                    <FiTrash2 size={14} />
                                                    <span>Hapus</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="8" className="empty-table-cell">
                                    Tidak ada pengajuan kerja sama yang sesuai.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
