import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchArticles = () => {
        setLoading(true);
        adminApi.getArticles()
            .then(data => setArticles(data || []))
            .catch(err => console.error('Failed to fetch articles:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (id, title) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) return;
        try {
            await adminApi.deleteArticle(id);
            fetchArticles();
        } catch (err) {
            alert('Gagal menghapus artikel: ' + err.message);
        }
    };

    const togglePublish = async (article) => {
        const newStatus = !article.published;
        if (newStatus && !article.coverImageUrl) {
            alert('❌ Gambar Sampul (Cover Image) wajib diunggah sebelum publikasi artikel!');
            return;
        }
        try {
            await adminApi.updateArticle(article.id, { published: newStatus });
            fetchArticles();
        } catch (err) {
            alert('Gagal mengubah status publikasi: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>
                <p>Memuat daftar artikel...</p>
            </div>
        );
    }

    return (
        <div className="admin-articles-page">
            <div className="admin-page-header">
                <div>
                    <h3 className="page-heading">Kelola Artikel & Berita</h3>
                    <p className="page-subheading">Edukasi material, tips konstruksi, budget & perencanaan, dan story proyek.</p>
                </div>
                <Link to="/admin/articles/new" className="btn-cms btn-cms-primary">
                    <FiPlus size={16} style={{ marginRight: '6px' }} />
                    Tulis Artikel Baru
                </Link>
            </div>

            <div className="table-card">
                <table className="cms-table">
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Judul Artikel</th>
                            <th>Kategori</th>
                            <th>Penulis</th>
                            <th>Status</th>
                            <th>Tanggal Terbit</th>
                            <th className="text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.length > 0 ? (
                            articles.map((article) => (
                                <tr key={article.id}>
                                    <td>
                                        {article.coverImageUrl ? (
                                            <img src={article.coverImageUrl} alt={article.title} className="table-thumb" />
                                        ) : (
                                            <div className="table-thumb-placeholder">No Cover</div>
                                        )}
                                    </td>
                                    <td className="font-semibold">{article.title}</td>
                                    <td>
                                        <span className="status-pill" style={{ background: '#f3f4f6', color: '#374151' }}>
                                            {article.category || 'Tips'}
                                        </span>
                                    </td>
                                    <td className="text-secondary">{article.author || 'Arsi Karya Team'}</td>
                                    <td>
                                        <span className={`status-pill ${article.published ? 'status-published' : 'status-draft'}`}>
                                            {article.published ? 'Terbit' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="text-secondary" style={{ fontSize: '0.82rem' }}>
                                        {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="text-right">
                                        <div className="action-buttons-wrap">
                                            <button 
                                                onClick={() => togglePublish(article)} 
                                                className={`btn-action-sm ${article.published ? 'btn-unpublish' : 'btn-publish'}`}
                                            >
                                                {article.published ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                                <span>{article.published ? 'Draft' : 'Terbitkan'}</span>
                                            </button>

                                            <Link to={`/admin/articles/${article.id}/edit`} className="btn-action-sm edit">
                                                <FiEdit size={14} />
                                                <span>Edit</span>
                                            </Link>

                                            <button onClick={() => handleDelete(article.id, article.title)} className="btn-action-sm delete" title="Hapus">
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
                                    Belum ada artikel. Klik "Tulis Artikel Baru" untuk membuat artikel baru.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
