import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import './AdminServices.css';

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchServices = () => {
        setLoading(true);
        adminApi.getServices()
            .then(data => setServices(data || []))
            .catch(err => console.error('Failed to fetch services:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id, title) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus layanan "${title}"?`)) return;
        try {
            await adminApi.deleteService(id);
            fetchServices();
        } catch (err) {
            alert('Gagal menghapus layanan: ' + err.message);
        }
    };

    const togglePublish = async (service) => {
        const newStatus = !service.published;
        if (newStatus && !service.heroImageUrl) {
            alert('⚠️ Peringatan: Layanan ini belum memiliki Hero Image! Disarankan menambahkan gambar sebelum publikasi.');
        }
        try {
            await adminApi.updateService(service.id, { published: newStatus });
            fetchServices();
        } catch (err) {
            alert('Gagal mengubah status publikasi: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>
                <p>Memuat daftar layanan...</p>
            </div>
        );
    }

    return (
        <div className="admin-services-page">
            <div className="admin-page-header">
                <div>
                    <h3 className="page-heading">Kelola Layanan Resmi</h3>
                    <p className="page-subheading">Konstruksi, Design & Build, Fabrikasi, Pengadaan Barang</p>
                </div>
                <Link to="/admin/services/new" className="btn-cms btn-cms-primary">
                    <FiPlus size={16} style={{ marginRight: '6px' }} />
                    Tambah Layanan
                </Link>
            </div>

            <div className="table-card">
                <table className="cms-table">
                    <thead>
                        <tr>
                            <th>Hero Image</th>
                            <th>Judul Layanan</th>
                            <th>Slug</th>
                            <th>Deskripsi Ringkas</th>
                            <th>Status</th>
                            <th className="text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length > 0 ? (
                            services.map((service) => (
                                <tr key={service.id}>
                                    <td>
                                        {service.heroImageUrl ? (
                                            <img src={service.heroImageUrl} alt={service.title} className="table-thumb" />
                                        ) : (
                                            <div className="table-thumb-placeholder warning-placeholder" title="Hero Image Belum Ada">
                                                <FiAlertCircle size={14} color="#d97706" />
                                                <span>No Hero</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="font-semibold">{service.title}</td>
                                    <td className="text-secondary">{service.slug}</td>
                                    <td className="text-secondary" style={{ maxWidth: '280px', fontSize: '0.82rem' }}>
                                        {service.shortDescription || service.description?.substring(0, 80) || '-'}
                                    </td>
                                    <td>
                                        <span className={`status-pill ${service.published ? 'status-published' : 'status-draft'}`}>
                                            {service.published ? 'Terbit' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="action-buttons-wrap">
                                            <button 
                                                onClick={() => togglePublish(service)} 
                                                className={`btn-action-sm ${service.published ? 'btn-unpublish' : 'btn-publish'}`}
                                            >
                                                {service.published ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                                <span>{service.published ? 'Draft' : 'Terbitkan'}</span>
                                            </button>

                                            <Link to={`/admin/services/${service.id}/edit`} className="btn-action-sm edit">
                                                <FiEdit size={14} />
                                                <span>Edit</span>
                                            </Link>

                                            <button onClick={() => handleDelete(service.id, service.title)} className="btn-action-sm delete" title="Hapus">
                                                <FiTrash2 size={14} />
                                                <span>Hapus</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-table-cell">
                                    Belum ada layanan. Klik "Tambah Layanan" untuk membuat layanan baru.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
