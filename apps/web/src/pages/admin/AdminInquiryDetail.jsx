import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FiArrowLeft, FiPhoneCall, FiCopy, FiCheckCircle, FiTrash2, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { INQUIRY_STATUS_CONFIG } from './AdminInquiries';
import './AdminInquiries.css';

const STATUS_KEYS = ['new', 'reviewing', 'contacted', 'qualified', 'closed'];

export default function AdminInquiryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const fetchInquiry = () => {
        setLoading(true);
        adminApi.getInquiry(id)
            .then(data => setInquiry(data))
            .catch(err => console.error('Failed to fetch inquiry:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchInquiry();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        try {
            await adminApi.updateInquiryStatus(id, newStatus);
            fetchInquiry();
        } catch (err) {
            alert('Gagal mengubah status: ' + err.message);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus pengajuan dari "${inquiry.nama}"?`)) return;
        try {
            await adminApi.deleteInquiry(id);
            navigate('/admin/inquiries');
        } catch (err) {
            alert('Gagal menghapus pengajuan: ' + err.message);
        }
    };

    const copyWhatsApp = () => {
        if (!inquiry?.whatsapp) return;
        navigator.clipboard.writeText(inquiry.whatsapp);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    if (loading) return <LoadingSpinner />;
    if (!inquiry) return <div style={{ padding: '60px 0', textAlign: 'center' }}>Pengajuan tidak ditemukan.</div>;

    const formattedPhone = (inquiry.whatsapp || '').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${formattedPhone?.startsWith('0') ? '62' + formattedPhone.slice(1) : formattedPhone}?text=Halo%20Bpk/Ibu%20${encodeURIComponent(inquiry.nama)},%20terima%20kasih%20telah%20menghubungi%20Arsi%20Karya.`;
    const currentStatusMeta = INQUIRY_STATUS_CONFIG[inquiry.status] || INQUIRY_STATUS_CONFIG.new;

    return (
        <div className="admin-inquiry-detail-page">
            <div className="editor-top-bar">
                <div className="top-bar-left" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <Link to="/admin/inquiries" className="btn-cms btn-cms-outline">
                        <FiArrowLeft size={16} style={{ marginRight: '6px' }} />
                        Kembali ke Daftar Pengajuan
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 className="editor-title" style={{ margin: 0 }}>Detail Pengajuan: {inquiry.nama}</h3>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            backgroundColor: currentStatusMeta.bg,
                            color: currentStatusMeta.color,
                            border: `1.5px solid ${currentStatusMeta.border}`
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: currentStatusMeta.dot }} />
                            {currentStatusMeta.label}
                        </span>
                    </div>
                </div>
                <div className="top-bar-actions">
                    <button onClick={handleDelete} className="btn-cms btn-action-sm delete" style={{ padding: '8px 14px' }}>
                        <FiTrash2 size={16} style={{ marginRight: '6px' }} />
                        Hapus Pengajuan
                    </button>
                </div>
            </div>

            <div className="inquiry-detail-grid">
                {/* Main Content */}
                <div className="detail-col-left">
                    <div className="form-panel">
                        <h4 className="panel-heading">Pesan & Kebutuhan Proyek</h4>
                        <div className="pesan-box">
                            {inquiry.pesan || 'Tidak ada catatan pesan tambahan.'}
                        </div>

                        <div className="inquiry-meta-grid">
                            <div className="meta-item">
                                <span className="meta-label">Jenis Layanan</span>
                                <span className="meta-val">{inquiry.jenisKerjasama || inquiry.jenisLayanan || '-'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Jenis Proyek</span>
                                <span className="meta-val">{inquiry.jenisProyek || '-'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Lokasi Proyek</span>
                                <span className="meta-val">{inquiry.lokasi || '-'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Waktu Masuk</span>
                                <span className="meta-val" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <FiClock size={14} style={{ color: '#64748b' }} />
                                    {new Date(inquiry.createdAt).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions & Contact Info */}
                <div className="detail-col-right">
                    {/* Client Quick Contact Card */}
                    <div className="form-panel">
                        <h4 className="panel-heading">Kontak Pengaju</h4>

                        <div className="client-info-block">
                            <h5 className="client-name">{inquiry.nama}</h5>
                            <span style={{ fontSize: '0.9rem', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                <FaWhatsapp size={16} /> {inquiry.whatsapp}
                            </span>
                        </div>

                        <div className="quick-actions-list">
                            <a href={waUrl} target="_blank" rel="noreferrer" className="btn-cms btn-wa-action">
                                <FiPhoneCall size={16} />
                                <span>Chat WhatsApp Langsung</span>
                            </a>

                            <button onClick={copyWhatsApp} className="btn-cms btn-cms-outline">
                                <FiCopy size={16} />
                                <span>{copied ? '✓ Nomor Berhasil Disalin!' : 'Salin Nomor WhatsApp'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Status Management Panel with Colorful Notices */}
                    <div className="form-panel">
                        <h4 className="panel-heading">Ubah Status Pengajuan</h4>
                        <p className="field-help" style={{ marginBottom: '12px' }}>Perbarui status untuk melacak alur follow-up tim Arsi Karya.</p>

                        <div className="status-button-grid">
                            {STATUS_KEYS.map((key) => {
                                const config = INQUIRY_STATUS_CONFIG[key];
                                const isActive = inquiry.status === key;
                                return (
                                    <button 
                                        key={key}
                                        type="button"
                                        onClick={() => handleStatusChange(key)} 
                                        className={`btn-status-card ${isActive ? 'active' : ''}`}
                                        style={{
                                            backgroundColor: isActive ? config.bg : '#ffffff',
                                            borderColor: isActive ? config.border : '#e2e8f0',
                                            borderWidth: isActive ? '2px' : '1px',
                                            boxShadow: isActive ? `0 0 0 1px ${config.border}` : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ 
                                                    width: '9px', 
                                                    height: '9px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: config.dot,
                                                    boxShadow: isActive ? `0 0 6px ${config.dot}` : 'none'
                                                }} />
                                                <span style={{ 
                                                    fontWeight: 700, 
                                                    fontSize: '0.88rem', 
                                                    color: isActive ? config.color : '#1e293b' 
                                                }}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <span style={{ 
                                                    display: 'inline-flex', 
                                                    alignItems: 'center', 
                                                    gap: '4px', 
                                                    fontSize: '0.78rem', 
                                                    fontWeight: 700, 
                                                    color: config.color 
                                                }}>
                                                    <FiCheckCircle size={15} /> Aktif
                                                </span>
                                            )}
                                        </div>
                                        <span style={{ 
                                            fontSize: '0.75rem', 
                                            color: isActive ? config.color : '#64748b', 
                                            marginTop: '4px', 
                                            display: 'block',
                                            opacity: isActive ? 0.95 : 0.8
                                        }}>
                                            {config.desc}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
