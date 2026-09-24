import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FiArrowLeft, FiAlertCircle, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function AdminServiceEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [description, setDescription] = useState('');
    const [faqList, setFaqList] = useState([]); // [{ question, answer }]
    const [heroImageUrl, setHeroImageUrl] = useState('');
    const [heroImageId, setHeroImageId] = useState('');
    const [published, setPublished] = useState(true);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isEditing) {
            adminApi.getService(id)
                .then((service) => {
                    setTitle(service.title || '');
                    setSlug(service.slug || '');
                    setShortDescription(service.shortDescription || '');
                    setDescription(service.description || '');
                    setFaqList(Array.isArray(service.faq) ? service.faq : []);
                    setHeroImageUrl(service.heroImageUrl || '');
                    setHeroImageId(service.heroImageId || '');
                    setPublished(service.published !== undefined ? service.published : true);
                    setSeoTitle(service.seoTitle || '');
                    setSeoDescription(service.seoDescription || '');
                })
                .catch(err => setErrorMsg('Gagal memuat detail layanan: ' + err.message))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const handleAddFaq = () => setFaqList([...faqList, { question: '', answer: '' }]);
    const handleRemoveFaq = (idx) => setFaqList(faqList.filter((_, i) => i !== idx));
    const handleUpdateFaq = (idx, field, value) => {
        const updated = [...faqList];
        updated[idx] = { ...updated[idx], [field]: value };
        setFaqList(updated);
    };

    const handleSave = async (isPub) => {
        const targetPublished = isPub !== undefined ? isPub : published;

        if (!title.trim()) {
            setErrorMsg('⚠️ Judul Layanan wajib diisi!');
            return;
        }

        if (targetPublished && !heroImageUrl.trim()) {
            if (!confirm('⚠️ Layanan ini belum memiliki Gambar (Hero Image). Apakah Anda yakin ingin menerbitkannya tanpa Gambar?')) {
                return;
            }
        }

        setSaving(true);
        setMessage('');
        setErrorMsg('');

        const data = {
            title,
            slug: slug.trim() || generateSlug(title),
            shortDescription,
            description,
            faq: faqList,
            heroImageUrl,
            heroImageId,
            published: targetPublished,
            seoTitle: seoTitle.trim() || title,
            seoDescription: seoDescription.trim() || shortDescription || description.substring(0, 160),
        };

        try {
            if (isEditing) {
                await adminApi.updateService(id, data);
                setMessage('✅ Layanan berhasil diperbarui!');
            } else {
                const created = await adminApi.createService(data);
                setMessage('✅ Layanan baru berhasil dibuat!');
                navigate(`/admin/services/${created.id}/edit`, { replace: true });
            }
            setTimeout(() => setMessage(''), 4000);
        } catch (err) {
            setErrorMsg('❌ Gagal menyimpan layanan: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-project-editor">
            <div className="editor-top-bar">
                <div className="top-bar-left">
                    <Link to="/admin/services" className="btn-cms btn-cms-outline">
                        <FiArrowLeft size={16} style={{ marginRight: '6px' }} />
                        Kembali ke Layanan
                    </Link>
                    <h3 className="editor-title">{isEditing ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h3>
                </div>
                <div className="top-bar-actions">
                    <button className="btn-cms btn-cms-outline" onClick={() => handleSave(false)} disabled={saving}>
                        Simpan Draft
                    </button>
                    <button className="btn-cms btn-cms-primary" onClick={() => handleSave(true)} disabled={saving}>
                        {saving ? 'Menyimpan...' : 'Simpan & Terbitkan'}
                    </button>
                </div>
            </div>

            {message && <div className="alert-box success-alert">{message}</div>}
            {errorMsg && <div className="alert-box error-alert">{errorMsg}</div>}

            {!heroImageUrl && (
                <div className="role-warning-callout" style={{ background: '#fffbe6', borderColor: '#ffe58f', color: '#873800' }}>
                    <div className="warning-icon"><FiAlertCircle size={24} color="#d46b08" /></div>
                    <div className="warning-content">
                        <strong>GAMBAR LAYANAN BELUM DIUNGGAH (RECOMMENDED):</strong>
                        <p>Unggah gambar berkualitas tinggi untuk digunakan pada kartu depan halaman Layanan dan banner header halaman Detail Layanan.</p>
                    </div>
                </div>
            )}

            <div className="editor-main-grid">
                <div className="editor-col-left">
                    {/* Basic Info */}
                    <div className="form-panel">
                        <h4 className="panel-heading">1. Informasi Layanan</h4>

                        <div className="form-group">
                            <label className="form-label required">Judul Layanan</label>
                            <input 
                                type="text" 
                                className="form-input text-lg" 
                                value={title} 
                                onChange={(e) => { setTitle(e.target.value); if (!isEditing) setSlug(generateSlug(e.target.value)); }}
                                placeholder="Contoh: Perencanaan"
                            />
                            <small className="field-help">Judul utama yang tampil pada Kartu Layanan dan Halaman Detail.</small>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Deskripsi Ringkas (Teks Kartu Layanan)</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={shortDescription} 
                                onChange={(e) => setShortDescription(e.target.value)}
                                placeholder="Ringkasan 1-2 kalimat untuk ditampilkan pada kartu di Halaman Layanan..."
                            />
                            <small className="field-help">Teks ini tampil di bawah judul pada Kartu Layanan depan.</small>
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                                <label className="form-label" style={{ margin: 0 }}>Penjelasan Lengkap Layanan (Halaman Detail)</label>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setDescription((prev) => prev + '\n<h2>Sub-Judul Layanan</h2>\n')} 
                                        className="btn-cms btn-cms-outline" 
                                        style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                                    >
                                        + Sub-Judul (H2)
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setDescription((prev) => prev + '\n<p>Tuliskan paragraf penjelasan di sini...</p>\n')} 
                                        className="btn-cms btn-cms-outline" 
                                        style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                                    >
                                        + Paragraf
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setDescription((prev) => prev + '\n<ol>\n  <li>Poin penjelasan 1</li>\n  <li>Poin penjelasan 2</li>\n</ol>\n')} 
                                        className="btn-cms btn-cms-outline" 
                                        style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                                    >
                                        + List Angka
                                    </button>
                                </div>
                            </div>
                            <textarea 
                                className="form-input" 
                                rows="14" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="<h2>Pengenalan Layanan</h2>&#10;<p>Tuliskan penjelasan detail mengenai layanan ini...</p>"
                                style={{ fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6 }}
                            />
                            <small className="field-help">Teks ini akan tampil bersih pada Halaman Detail Layanan. Gunakan tombol bantuan di atas untuk menambah Sub-Judul, Paragraf, atau List Angka.</small>
                        </div>
                    </div>

                    {/* FAQ Panel */}
                    <div className="form-panel">
                        <div className="panel-heading-row">
                            <h4 className="panel-heading" style={{ margin: 0 }}>2. Pertanyaan Sering Diajukan (FAQ)</h4>
                            <button type="button" onClick={handleAddFaq} className="btn-cms btn-cms-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                                <FiPlus size={14} style={{ marginRight: '4px' }} /> Tambah FAQ
                            </button>
                        </div>

                        {faqList.map((faq, idx) => (
                            <div key={idx} className="gallery-item-card" style={{ marginTop: '10px' }}>
                                <div className="gallery-item-inputs">
                                    <input 
                                        type="text" 
                                        className="form-input form-input-sm" 
                                        value={faq.question || ''} 
                                        onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                                        placeholder="Pertanyaan (misal: Berapa lama estimasi pengerjaan?)"
                                    />
                                    <textarea 
                                        className="form-input form-input-sm" 
                                        rows="2"
                                        value={faq.answer || ''} 
                                        onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                                        placeholder="Jawaban penjelasan..."
                                    />
                                </div>
                                <button type="button" onClick={() => handleRemoveFaq(idx)} className="btn-icon text-danger">
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="editor-col-right">
                    {/* Hero / Card Image */}
                    <div className="form-panel">
                        <h4 className="panel-heading">Gambar Layanan (Card & Banner)</h4>
                        <p className="field-help" style={{ marginBottom: '12px' }}>Gambar ini digunakan pada kartu Halaman Layanan dan Hero Banner Halaman Detail.</p>

                        {heroImageUrl ? (
                            <div className="cover-preview-wrap">
                                <img src={heroImageUrl} alt="Hero Preview" className="cover-img-preview" />
                                <button type="button" className="btn-remove-cover" onClick={() => setHeroImageUrl('')}>
                                    Ganti Gambar
                                </button>
                            </div>
                        ) : (
                            <div className="cover-upload-placeholder">
                                <CloudinaryUploadWidget onUploadSuccess={setHeroImageUrl} />
                                <span style={{ marginTop: '8px', fontSize: '0.8rem', color: '#9ca3af' }}>Unggah Gambar Layanan</span>
                            </div>
                        )}
                        <input 
                            type="url" 
                            className="form-input" 
                            style={{ marginTop: '12px' }}
                            value={heroImageUrl} 
                            onChange={(e) => setHeroImageUrl(e.target.value)} 
                            placeholder="atau paste URL gambar..." 
                        />
                    </div>

                    {/* Publish Settings */}
                    <div className="form-panel">
                        <h4 className="panel-heading">Status & URL</h4>

                        <div className="form-group">
                            <label className="form-label">URL Slug Layanan</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={slug} 
                                onChange={(e) => setSlug(e.target.value)} 
                            />
                            <small className="field-help">https://arsikarya.com/layanan/{slug || 'slug-layanan'}</small>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status Terbit</label>
                            <select 
                                className="form-input" 
                                value={published ? 'published' : 'draft'} 
                                onChange={(e) => setPublished(e.target.value === 'published')}
                            >
                                <option value="published">Terbit (Publik)</option>
                                <option value="draft">Draft (Disembunyikan)</option>
                            </select>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="form-panel">
                        <h4 className="panel-heading">SEO Metadata</h4>
                        
                        <div className="form-group">
                            <label className="form-label">SEO Title</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={seoTitle} 
                                onChange={(e) => setSeoTitle(e.target.value)} 
                                placeholder={title || 'Judul SEO'} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">SEO Description</label>
                            <textarea 
                                className="form-input" 
                                rows="3" 
                                value={seoDescription} 
                                onChange={(e) => setSeoDescription(e.target.value)} 
                                placeholder="Deskripsi meta untuk Google search..." 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
