import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
    FiArrowLeft, 
    FiBold, 
    FiItalic, 
    FiList, 
    FiCheckSquare, 
    FiLink, 
    FiImage, 
    FiType 
} from 'react-icons/fi';
import './AdminArticleEditor.css';

const ARTICLE_CATEGORIES = [
    'Layanan',
    'Renovasi',
    'Material',
    'Desain',
    'Konstruksi',
    'Budget & Perencanaan',
    'Project Story',
    'Tips'
];

import RichTextEditor from '../../components/admin/RichTextEditor';

export default function AdminArticleEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [coverImageId, setCoverImageId] = useState('');
    const [category, setCategory] = useState('Tips');
    const [author, setAuthor] = useState('Arsi Karya Team');
    const [publishedDate, setPublishedDate] = useState(new Date().toISOString().substring(0, 10));
    const [published, setPublished] = useState(false);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const textareaRef = useRef(null);

    useEffect(() => {
        if (isEditing) {
            adminApi.getArticle(id)
                .then((article) => {
                    setTitle(article.title || '');
                    setSlug(article.slug || '');
                    setExcerpt(article.excerpt || '');
                    setContent(article.content || '');
                    setCoverImageUrl(article.coverImageUrl || '');
                    setCoverImageId(article.coverImageId || '');
                    setCategory(article.category || 'Tips');
                    setAuthor(article.author || 'Arsi Karya Team');
                    setPublishedDate(article.publishedDate ? new Date(article.publishedDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10));
                    setPublished(article.published || false);
                    setSeoTitle(article.seoTitle || '');
                    setSeoDescription(article.seoDescription || '');
                })
                .catch(err => setErrorMsg('Gagal memuat artikel: ' + err.message))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Rich Text insertion helpers for structured editorial content
    const insertFormatting = (prefix, suffix = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.substring(start, end);
        const replacement = `${prefix}${selected}${suffix}`;
        const newContent = content.substring(0, start) + replacement + content.substring(end);
        setContent(newContent);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 50);
    };

    const handleSave = async (isPub) => {
        const targetPublished = isPub !== undefined ? isPub : published;

        if (!title.trim()) {
            setErrorMsg('⚠️ Judul Artikel wajib diisi!');
            return;
        }

        if (targetPublished && !coverImageUrl.trim()) {
            setErrorMsg('❌ Aturan Wajib: Gambar Sampul (Cover Image) wajib diunggah sebelum publikasi artikel!');
            return;
        }

        setSaving(true);
        setMessage('');
        setErrorMsg('');

        const data = {
            title,
            slug: slug.trim() || generateSlug(title),
            excerpt,
            content,
            coverImageUrl,
            coverImageId,
            category,
            author,
            publishedDate: new Date(publishedDate),
            published: targetPublished,
            seoTitle: seoTitle.trim() || title,
            seoDescription: seoDescription.trim() || excerpt || content.substring(0, 160),
        };

        try {
            if (isEditing) {
                await adminApi.updateArticle(id, data);
                setMessage('✅ Artikel berhasil diperbarui!');
            } else {
                const created = await adminApi.createArticle(data);
                setMessage('✅ Artikel baru berhasil dibuat!');
                navigate(`/admin/articles/${created.id}/edit`, { replace: true });
            }
            setTimeout(() => setMessage(''), 4000);
        } catch (err) {
            setErrorMsg('❌ Gagal menyimpan artikel: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-project-editor">
            <div className="editor-top-bar">
                <div className="top-bar-left">
                    <Link to="/admin/articles" className="btn-cms btn-cms-outline">
                        <FiArrowLeft size={16} style={{ marginRight: '6px' }} />
                        Kembali ke Artikel
                    </Link>
                    <h3 className="editor-title">{isEditing ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h3>
                </div>
                <div className="top-bar-actions">
                    <button className="btn-cms btn-cms-outline" onClick={() => handleSave(false)} disabled={saving}>
                        Simpan Draft
                    </button>
                    <button className="btn-cms btn-cms-primary" onClick={() => handleSave(true)} disabled={saving}>
                        {saving ? 'Menyimpan...' : published ? 'Simpan & Terbitkan' : 'Terbitkan Artikel'}
                    </button>
                </div>
            </div>

            {message && <div className="alert-box success-alert">{message}</div>}
            {errorMsg && <div className="alert-box error-alert">{errorMsg}</div>}

            <div className="editor-main-grid">
                {/* Left Column — Editorial Editor */}
                <div className="editor-col-left">
                    <div className="form-panel">
                        <h4 className="panel-heading">1. Judul & Ringkasan Artikel</h4>

                        <div className="form-group">
                            <label className="form-label required">Judul Artikel</label>
                            <input 
                                type="text" 
                                className="form-input text-lg" 
                                value={title} 
                                onChange={(e) => { setTitle(e.target.value); if (!isEditing) setSlug(generateSlug(e.target.value)); }}
                                placeholder="Contoh: 5 Tips Memilih Material Struktur Steel Frame Berkualitas"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Ringkasan / Excerpt</label>
                            <textarea 
                                className="form-input" 
                                rows="3" 
                                value={excerpt} 
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Ringkasan singkat artikel untuk kartu cuplikan berita..."
                            />
                        </div>
                    </div>

                    {/* Editorial Content Editor */}
                    <div className="form-panel">
                        <h4 className="panel-heading">2. Isi Konten Artikel</h4>
                        <p className="field-help" style={{ marginBottom: '10px' }}>Tuliskan artikel secara langsung menggunakan editor visual WYSIWYG di bawah ini.</p>

                        <RichTextEditor 
                            value={content} 
                            onChange={(html) => setContent(html)}
                            placeholder="Tuliskan isi artikel Anda di sini..."
                        />
                    </div>
                </div>

                {/* Right Column — Media & Taxonomy */}
                <div className="editor-col-right">
                    {/* Cover Image Box */}
                    <div className="form-panel">
                        <h4 className="panel-heading required">Gambar Sampul (Cover Image)</h4>
                        <p className="field-help" style={{ marginBottom: '12px' }}>Wajib diunggah sebelum artikel dapat diterbitkan secara publik.</p>

                        {coverImageUrl ? (
                            <div className="cover-preview-wrap">
                                <img src={coverImageUrl} alt="Cover Preview" className="cover-img-preview" />
                                <button type="button" className="btn-remove-cover" onClick={() => setCoverImageUrl('')}>
                                    Ganti Gambar Sampul
                                </button>
                            </div>
                        ) : (
                            <div className="cover-upload-placeholder">
                                <CloudinaryUploadWidget onUploadSuccess={setCoverImageUrl} />
                                <span style={{ marginTop: '8px', fontSize: '0.8rem', color: '#9ca3af' }}>Unggah Cover Image</span>
                            </div>
                        )}
                        <input 
                            type="url" 
                            className="form-input" 
                            style={{ marginTop: '12px' }}
                            value={coverImageUrl} 
                            onChange={(e) => setCoverImageUrl(e.target.value)} 
                            placeholder="atau paste URL gambar..." 
                        />
                    </div>

                    {/* Metadata & Taxonomy */}
                    <div className="form-panel">
                        <h4 className="panel-heading">Kategori & Penulis</h4>

                        <div className="form-group">
                            <label className="form-label">Kategori Artikel</label>
                            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                                {ARTICLE_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Penulis</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={author} 
                                onChange={(e) => setAuthor(e.target.value)} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tanggal Publikasi</label>
                            <input 
                                type="date" 
                                className="form-input" 
                                value={publishedDate} 
                                onChange={(e) => setPublishedDate(e.target.value)} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">URL Slug Artikel</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={slug} 
                                onChange={(e) => setSlug(e.target.value)} 
                            />
                            <small className="field-help">https://arsikarya.com/artikel/{slug || 'slug-artikel'}</small>
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="form-panel">
                        <h4 className="panel-heading">Pengaturan SEO Metadata</h4>
                        
                        <div className="form-group">
                            <label className="form-label">SEO Title</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={seoTitle} 
                                onChange={(e) => setSeoTitle(e.target.value)} 
                                placeholder={title || 'Judul SEO Artikel'} 
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
