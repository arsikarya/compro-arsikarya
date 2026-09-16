import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { FiFolder, FiFileText, FiMessageSquare, FiInbox, FiArrowRight, FiCheckCircle, FiClock, FiEye } from 'react-icons/fi';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [data, logs] = await Promise.all([
                adminApi.getStats(),
                adminApi.getActivityLogs?.().catch(() => [])
            ]);
            setStats(data);
            setActivityLogs(logs || []);
        } catch (err) {
            console.error('Failed to load stats:', err);
            setError(err.message || 'Gagal memuat statistik dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>
                <p>Memuat statistik operasional...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-box">
                <p>{error}</p>
                <button onClick={fetchStats} className="btn-outline" style={{ marginTop: '12px' }}>Coba Lagi</button>
            </div>
        );
    }

    const { projects, articles, testimonials, inquiries, recentInquiries, recentProjects } = stats || {};

    const getInquiryStatusBadge = (status) => {
        switch (status) {
            case 'new': return <span className="status-pill status-new">Baru</span>;
            case 'reviewing': return <span className="status-pill status-reviewing">Ditinjau</span>;
            case 'contacted': return <span className="status-pill status-contacted">Sudah Dihubungi</span>;
            case 'qualified': return <span className="status-pill status-qualified">Qualified</span>;
            case 'closed': return <span className="status-pill status-closed">Selesai</span>;
            default: return <span className="status-pill">{status}</span>;
        }
    };

    return (
        <div className="admin-dashboard-view">
            {/* Quick Action Top Bar */}
            <div className="dashboard-welcome">
                <div>
                    <h3 className="welcome-heading">Selamat Datang di Admin Panel Arsi Karya</h3>
                    <p className="welcome-text">Ringkasan status operasional website dan leads pengajuan kerja sama terkini.</p>
                </div>
                <div className="welcome-actions">
                    <Link to="/admin/projects/new" className="btn-cms btn-cms-primary">
                        + Tambah Proyek
                    </Link>
                    <Link to="/admin/articles/new" className="btn-cms btn-cms-outline">
                        + Tulis Artikel
                    </Link>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="stats-grid">
                {/* Projects Card */}
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-icon icon-projects"><FiFolder /></span>
                        <Link to="/admin/projects" className="stat-link">Kelola &rarr;</Link>
                    </div>
                    <div className="stat-card-body">
                        <span className="stat-number">{projects?.total || 0}</span>
                        <span className="stat-label">Total Proyek</span>
                    </div>
                    <div className="stat-card-footer">
                        <span><strong>{projects?.published || 0}</strong> Terbit</span>
                        <span>•</span>
                        <span><strong>{projects?.drafts || 0}</strong> Draft</span>
                    </div>
                </div>

                {/* Articles Card */}
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-icon icon-articles"><FiFileText /></span>
                        <Link to="/admin/articles" className="stat-link">Kelola &rarr;</Link>
                    </div>
                    <div className="stat-card-body">
                        <span className="stat-number">{articles?.total || 0}</span>
                        <span className="stat-label">Total Artikel</span>
                    </div>
                    <div className="stat-card-footer">
                        <span><strong>{articles?.published || 0}</strong> Terbit</span>
                        <span>•</span>
                        <span><strong>{articles?.drafts || 0}</strong> Draft</span>
                    </div>
                </div>

                {/* Testimonials Card */}
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-icon icon-testimonials"><FiMessageSquare /></span>
                        <Link to="/admin/testimonials" className="stat-link">Kelola &rarr;</Link>
                    </div>
                    <div className="stat-card-body">
                        <span className="stat-number">{testimonials?.total || 0}</span>
                        <span className="stat-label">Total Testimoni</span>
                    </div>
                    <div className="stat-card-footer">
                        <span><strong>{testimonials?.published || 0}</strong> Publik</span>
                        <span>•</span>
                        <span><strong>{testimonials?.pending || 0}</strong> Perlu Persetujuan</span>
                    </div>
                </div>

                {/* Inquiries Card */}
                <div className="stat-card highlight">
                    <div className="stat-card-header">
                        <span className="stat-icon icon-inquiries"><FiInbox /></span>
                        <Link to="/admin/inquiries" className="stat-link">Lihat Semua &rarr;</Link>
                    </div>
                    <div className="stat-card-body">
                        <span className="stat-number">{inquiries?.new || 0}</span>
                        <span className="stat-label">Pengajuan Baru (Belum Ditinjau)</span>
                    </div>
                    <div className="stat-card-footer">
                        <span>Total: <strong>{inquiries?.total || 0}</strong> Leads</span>
                    </div>
                </div>
            </div>

            {/* Inquiry Status Breakdown */}
            <div className="inquiry-status-row">
                <div className="status-box">
                    <span className="status-count">{inquiries?.new || 0}</span>
                    <span className="status-title">Baru</span>
                </div>
                <div className="status-box">
                    <span className="status-count">{inquiries?.reviewing || 0}</span>
                    <span className="status-title">Ditinjau</span>
                </div>
                <div className="status-box">
                    <span className="status-count">{inquiries?.contacted || 0}</span>
                    <span className="status-title">Sudah Dihubungi</span>
                </div>
                <div className="status-box">
                    <span className="status-count">{inquiries?.qualified || 0}</span>
                    <span className="status-title">Qualified</span>
                </div>
                <div className="status-box">
                    <span className="status-count">{inquiries?.closed || 0}</span>
                    <span className="status-title">Selesai</span>
                </div>
            </div>

            {/* Content Tables Section */}
            <div className="dashboard-grid">
                {/* Recent Inquiries */}
                <div className="dashboard-panel">
                    <div className="panel-header">
                        <h4>Pengajuan Kerja Sama Terbaru</h4>
                        <Link to="/admin/inquiries" className="panel-link">Lihat Semua</Link>
                    </div>
                    <div className="panel-table-wrap">
                        <table className="panel-table">
                            <thead>
                                <tr>
                                    <th>Nama</th>
                                    <th>WhatsApp</th>
                                    <th>Jenis Proyek</th>
                                    <th>Status</th>
                                    <th className="text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentInquiries && recentInquiries.length > 0 ? (
                                    recentInquiries.map((inq) => (
                                        <tr key={inq.id}>
                                            <td className="font-semibold">{inq.nama}</td>
                                            <td>{inq.whatsapp}</td>
                                            <td>{inq.jenisProyek || inq.jenisKerjasama || '-'}</td>
                                            <td>{getInquiryStatusBadge(inq.status)}</td>
                                            <td className="text-right">
                                                <Link to={`/admin/inquiries/${inq.id}`} className="btn-table-action">
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="empty-table-cell">Belum ada pengajuan kerja sama.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="dashboard-panel">
                    <div className="panel-header">
                        <h4>Proyek Portofolio Terbaru</h4>
                        <Link to="/admin/projects" className="panel-link">Lihat Semua</Link>
                    </div>
                    <div className="panel-table-wrap">
                        <table className="panel-table">
                            <thead>
                                <tr>
                                    <th>Judul Proyek</th>
                                    <th>Kategori</th>
                                    <th>Status</th>
                                    <th className="text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentProjects && recentProjects.length > 0 ? (
                                    recentProjects.map((p) => (
                                        <tr key={p.id}>
                                            <td className="font-semibold">{p.title}</td>
                                            <td>{p.category || '-'}</td>
                                            <td>
                                                <span className={`status-pill ${p.published ? 'status-published' : 'status-draft'}`}>
                                                    {p.published ? 'Terbit' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <Link to={`/admin/projects/${p.id}/edit`} className="btn-table-action">
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="empty-table-cell">Belum ada proyek.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Activity Logs Feed */}
            {activityLogs && activityLogs.length > 0 && (
                <div style={{ marginTop: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>Aktivitas Admin Terbaru</h4>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Real-time Audit Log</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {activityLogs.slice(0, 8).map((log) => (
                            <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                                <div>
                                    <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.85rem' }}>{log.userName}</span>
                                    <span style={{ margin: '0 8px', color: '#9ca3af' }}>•</span>
                                    <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>{log.details || log.action}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                    {new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
