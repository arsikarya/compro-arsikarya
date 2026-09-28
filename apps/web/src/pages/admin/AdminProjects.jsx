import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import './AdminProjects.css';

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);

    const fetchProjects = () => {
        setLoading(true);
        adminApi.getProjects()
            .then(data => {
                setProjects(data || []);
                setIsOrderChanged(false);
            })
            .catch(err => console.error('Failed to fetch projects:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id, title) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${title}"?`)) return;
        try {
            await adminApi.deleteProject(id);
            fetchProjects();
        } catch (err) {
            alert('Gagal menghapus proyek: ' + err.message);
        }
    };

    const togglePublish = async (project) => {
        const newStatus = !project.published;
        if (newStatus && !project.coverImageUrl) {
            alert('⚠️ Gambar Sampul (Cover Image) wajib diunggah sebelum publikasi!');
            return;
        }
        try {
            await adminApi.updateProject(project.id, { published: newStatus });
            fetchProjects();
        } catch (err) {
            alert('Gagal mengubah status publikasi: ' + err.message);
        }
    };

    const moveProjectUp = (index) => {
        if (index === 0) return;
        const newProjects = [...projects];
        [newProjects[index - 1], newProjects[index]] = [newProjects[index], newProjects[index - 1]];
        setProjects(newProjects);
        setIsOrderChanged(true);
    };

    const moveProjectDown = (index) => {
        if (index === projects.length - 1) return;
        const newProjects = [...projects];
        [newProjects[index + 1], newProjects[index]] = [newProjects[index], newProjects[index + 1]];
        setProjects(newProjects);
        setIsOrderChanged(true);
    };

    const handleSaveOrder = async () => {
        setSavingOrder(true);
        try {
            await adminApi.reorderProjects(projects.map(p => p.id));
            setIsOrderChanged(false);
            alert('Urutan proyek berhasil disimpan!');
        } catch (err) {
            alert('Gagal menyimpan urutan: ' + err.message);
        } finally {
            setSavingOrder(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>
                <p>Memuat daftar proyek...</p>
            </div>
        );
    }

    return (
        <div className="admin-projects-page">
            <div className="admin-page-header">
                <div>
                    <h3 className="page-heading">Proyek Portofolio</h3>
                    <p className="page-subheading">Kelola proyek proyek konstruksi, fabrikasi, dan design & build Arsi Karya.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {isOrderChanged && (
                        <button className="btn-cms btn-cms-outline" onClick={handleSaveOrder} disabled={savingOrder}>
                            {savingOrder ? 'Menyimpan...' : 'Simpan Urutan'}
                        </button>
                    )}
                    <Link to="/admin/projects/new" className="btn-cms btn-cms-primary">
                        <FiPlus size={16} style={{ marginRight: '6px' }} />
                        Tambah Proyek
                    </Link>
                </div>
            </div>

            <div className="table-card">
                <table className="cms-table">
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Judul Proyek</th>
                            <th>Tipe / Kategori</th>
                            <th>Lokasi</th>
                            <th>Tahun</th>
                            <th>Status</th>
                            <th>Terakhir Diubah</th>
                            <th>Urutan</th>
                            <th className="text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length > 0 ? (
                            projects.map((project, index) => (
                                <tr key={project.id}>
                                    <td>
                                        {project.coverImageUrl ? (
                                            <img src={project.coverImageUrl} alt={project.title} className="table-thumb" />
                                        ) : (
                                            <div className="table-thumb-placeholder">No Cover</div>
                                        )}
                                    </td>
                                    <td className="font-semibold">{project.title}</td>
                                    <td className="text-secondary">{project.category || '-'}</td>
                                    <td className="text-secondary">{project.location || '-'}</td>
                                    <td className="text-secondary">{project.year || '-'}</td>
                                    <td>
                                        <span className={`status-pill ${project.published ? 'status-published' : 'status-draft'}`}>
                                            {project.published ? 'Terbit' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="text-secondary" style={{ fontSize: '0.82rem' }}>
                                        {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button onClick={() => moveProjectUp(index)} disabled={index === 0} className="btn-icon" title="Naikkan">
                                                <FiArrowUp size={14} />
                                            </button>
                                            <button onClick={() => moveProjectDown(index)} disabled={index === projects.length - 1} className="btn-icon" title="Turunkan">
                                                <FiArrowDown size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <div className="action-buttons-wrap">
                                            <button 
                                                onClick={() => togglePublish(project)} 
                                                className={`btn-action-sm ${project.published ? 'btn-unpublish' : 'btn-publish'}`}
                                                title={project.published ? 'Batalkan Publikasi' : 'Terbitkan'}
                                            >
                                                {project.published ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                                <span>{project.published ? 'Draft' : 'Terbitkan'}</span>
                                            </button>

                                            <Link to={`/admin/projects/${project.id}/edit`} className="btn-action-sm edit" title="Edit">
                                                <FiEdit size={14} />
                                                <span>Edit</span>
                                            </Link>

                                            <button onClick={() => handleDelete(project.id, project.title)} className="btn-action-sm delete" title="Hapus">
                                                <FiTrash2 size={14} />
                                                <span>Hapus</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="empty-table-cell">
                                    Belum ada proyek. Klik "Tambah Proyek" untuk membuat proyek baru.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
