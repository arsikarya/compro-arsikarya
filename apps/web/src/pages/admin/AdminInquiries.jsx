import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { FiEye, FiTrash2, FiSearch } from 'react-icons/fi';
import './AdminInquiries.css';

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
        const query = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
            item.nama?.toLowerCase().includes(query) ||
            item.email?.toLowerCase().includes(query) ||
            item.whatsapp?.includes(query) ||
            item.perusahaan?.toLowerCase().includes(query);
        return matchesStatus && matchesSearch;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'new': return <span className="status-pill status-new">Baru</span>;
            case 'reviewing': return <span className="status-pill status-reviewing">Ditinjau</span>;
            case 'contacted': return <span className="status-pill status-contacted">Sudah Dihubungi</span>;
            case 'qualified': return <span className="status-pill status-qualified">Qualified</span>;
            case 'closed': return <span className="status-pill status-closed">Selesai</span>;
            default: return <span className="status-pill">{status}</span>;
        }
    };

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
                        placeholder="Cari nama, perusahaan, WhatsApp, email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="status-tabs">
                    <button className={`tab-btn ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
                        Semua ({inquiries.length})
                    </button>
                    <button className={`tab-btn ${filterStatus === 'new' ? 'active' : ''}`} onClick={() => setFilterStatus('new')}>
                        Baru ({inquiries.filter(i => i.status === 'new').length})
                    </button>
                    <button className={`tab-btn ${filterStatus === 'reviewing' ? 'active' : ''}`} onClick={() => setFilterStatus('reviewing')}>
                        Ditinjau ({inquiries.filter(i => i.status === 'reviewing').length})
                    </button>
                    <button className={`tab-btn ${filterStatus === 'contacted' ? 'active' : ''}`} onClick={() => setFilterStatus('contacted')}>
                        Sudah Dihubungi ({inquiries.filter(i => i.status === 'contacted').length})
                    </button>
                    <button className={`tab-btn ${filterStatus === 'qualified' ? 'active' : ''}`} onClick={() => setFilterStatus('qualified')}>
                        Qualified ({inquiries.filter(i => i.status === 'qualified').length})
                    </button>
                    <button className={`tab-btn ${filterStatus === 'closed' ? 'active' : ''}`} onClick={() => setFilterStatus('closed')}>
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
                            <th>Perusahaan / Instansi</th>
                            <th>WhatsApp</th>
                            <th>Jenis Kerja Sama / Proyek</th>
                            <th>Status</th>
                            <th className="text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInquiries.length > 0 ? (
                            filteredInquiries.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-secondary" style={{ fontSize: '0.82rem' }}>
                                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="font-semibold">{item.nama}</td>
                                    <td className="text-secondary">{item.perusahaan || '-'}</td>
                                    <td>
                                        <a href={`https://wa.me/${item.whatsapp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="wa-link">
                                            {item.whatsapp}
                                        </a>
                                    </td>
                                    <td className="text-secondary">{item.jenisProyek || item.jenisKerjasama || '-'}</td>
                                    <td>
                                        <select 
                                            value={item.status} 
                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="new">Baru</option>
                                            <option value="reviewing">Ditinjau</option>
                                            <option value="contacted">Sudah Dihubungi</option>
                                            <option value="qualified">Qualified</option>
                                            <option value="closed">Selesai</option>
                                        </select>
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="empty-table-cell">
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
