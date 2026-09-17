import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FiArrowLeft, FiAlertTriangle, FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiBold, FiItalic, FiList, FiLink } from 'react-icons/fi';
import './AdminProjectEditor.css';

export default function AdminProjectEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Konstruksi');
    const [slug, setSlug] = useState('');
    const [location, setLocation] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [clientContext, setClientContext] = useState('');
    const [arsiKaryaRole, setArsiKaryaRole] = useState('');
    const [description, setDescription] = useState('');
    const [scope, setScope] = useState('');
    const [process, setProcess] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [coverImageId, setCoverImageId] = useState('');
    const [gallery, setGallery] = useState([]); // [{ url, alt }]
    const [published, setPublished] = useState(true);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const textareaRef = useRef(null);

    // Rich Text insertion helpers for structured project editorial content
    const insertFormatting = (prefix, suffix = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = description.substring(start, end);
        const replacement = `${prefix}${selected}${suffix}`;
        const newContent = description.substring(0, start) + replacement + description.substring(end);
        setDescription(newContent);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 50);
    };

    useEffect(() => {
        if (isEditing) {
            adminApi.getProject(id)
                .then((project) => {
                    setTitle(project.title || '');
                    setCategory(project.category || 'Konstruksi');
                    setSlug(project.slug || '');
                    setLocation(project.location || '');
                    setYear(project.year || '');
                    setClientContext(project.clientContext || project.company || '');
                    setArsiKaryaRole(project.arsiKaryaRole || '');
                    setDescription(project.description || '');
                    setScope(project.scope || '');
                    setProcess(project.process || '');
                    setCoverImageUrl(project.coverImageUrl || '');
                    setCoverImageId(project.coverImageId || '');
                    setGallery(Array.isArray(project.gallery) ? project.gallery : []);
                    setPublished(project.published !== undefined ? project.published : (project.visibility === 'public'));
                    setSeoTitle(project.seoTitle || '');
                    setSeoDescription(project.seoDescription || '');
                })
                .catch(err => setErrorMsg('Gagal memuat detail proyek: ' + err.message))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const handleAddGalleryImage = (url) => {
        setGallery([...gallery, { url, alt: title || 'Gambar Galeri Proyek' }]);
    };

    const handleRemoveGalleryImage = (index) => {
        setGallery(gallery.filter((_, i) => i !== index));
    };

    const handleGalleryAltChange = (index, alt) => {
        const updated = [...gallery];
        updated[index] = { ...updated[index], alt };
        setGallery(updated);
    };

    const moveGalleryUp = (index) => {
        if (index === 0) return;
        const newGallery = [...gallery];
        [newGallery[index - 1], newGallery[index]] = [newGallery[index], newGallery[index - 1]];
        setGallery(newGallery);
    };

    const moveGalleryDown = (index) => {
        if (index === gallery.length - 1) return;
        const newGallery = [...gallery];
        [newGallery[index + 1], newGallery[index]] = [newGallery[index], newGallery[index + 1]];
        setGallery(newGallery);
    };

    const handleSave = async (isPub) => {
        const targetPublished = isPub !== undefined ? isPub : published;

        if (!title.trim()) {
            setErrorMsg('⚠️ Judul Proyek wajib diisi!');
            return;
        }

        if (targetPublished && !coverImageUrl.trim()) {
            setErrorMsg('❌ Aturan Wajib: Gambar Sampul (Cover Image) harus diunggah sebelum menerbitkan proyek!');
            return;
        }

        setSaving(true);
        setMessage('');
        setErrorMsg('');

        const finalSlug = slug.trim() || generateSlug(title);

        const data = {
            title,
            category,
            slug: finalSlug,
            location,
            year,
            clientContext,
            company: clientContext, // fallback
            arsiKaryaRole,
            description,
            scope,
            process,
            coverImageUrl,
            coverImageId,
            gallery,
            published: targetPublished,
            visibility: targetPublished ? 'public' : 'draft',
            seoTitle: seoTitle.trim() || title,
            seoDescription: seoDescription.trim() || description.substring(0, 160),
        };

        try {
            if (isEditing) {
                await adminApi.updateProject(id, data);
                setMessage('✅ Proyek berhasil diperbarui!');
            } else {
                const created = await adminApi.createProject(data);
                setMessage('✅ Proyek baru berhasil dibuat!');
                navigate(`/admin/projects/${created.id}/edit`, { replace: true });
            }
            setTimeout(() => setMessage(''), 4000);
        } catch (err) {
            setErrorMsg('❌ Gagal menyimpan proyek: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-project-editor">
            {/* Header Navigation */}
            <div className="editor-top-bar">
                <div className="top-bar-left">
                    <Link to="/admin/projects" className="btn-cms btn-cms-outline">
                        <FiArrowLeft size={16} style={{ marginRight: '6px' }} />
                        Kembali ke Daftar Proyek
                    </Link>
                    <h3 className="editor-title">{isEditing ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h3>
                </div>
                <div className="top-bar-actions">
                    <button className="btn-cms btn-cms-outline" onClick={() => handleSave(false)} disabled={saving}>
                        Simpan Draft
                    </button>
                    <button className="btn-cms btn-cms-primary" onClick={() => handleSave(true)} disabled={saving}>
                        {saving ? 'Menyimpan...' : published ? 'Simpan & Terbitkan' : 'Terbitkan Proyek'}
                    </button>
                </div>
            </div>

            {/* Notification messages */}
            {message && <div className="alert-box success-alert">{message}</div>}
            {errorMsg && <div className="alert-box error-alert">{errorMsg}</div>}

            <div className="editor-main-grid">
                {/* Left Column — Core Form */}
                <div className="editor-col-left">
                    {/* Basic Info Panel */}
                    <div className="form-panel">
                        <h4 className="panel-heading">1. Informasi Utama Proyek</h4>
                        
                        <div className="form-group">
                            <label className="form-label required">Judul Proyek</label>
                            <input 
                                type="text" 
                                className="form-input text-lg" 
                                value={title} 
                                onChange={(e) => { setTitle(e.target.value); if (!isEditing) setSlug(generateSlug(e.target.value)); }}
                                placeholder="Contoh: Pembangunan Gudang Logistik Subang"
                                required
                            />
                        </div>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-label required">Kategori / Jenis Proyek</label>
                                <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="Perencanaan">Perencanaan</option>
                                    <option value="Konstruksi">Konstruksi</option>
                                    <option value="Design & Build">Design & Build</option>
                                    <option value="Renovasi">Renovasi</option>
                                    <option value="Landscape">Landscape</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tahun Selesai / Berlangsung</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={year} 
                                    onChange={(e) => setYear(e.target.value)}
                                    placeholder="2024"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Lokasi Proyek</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Contoh: Bandung, Jawa Barat"
                            />
                        </div>
                    </div>

                    {/* Role & Client Context Panel */}
                    <div className="form-panel">
                        <h4 className="panel-heading">2. Konteks Klien & Peran Arsi Karya</h4>
                        
                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-label">Client / Main Contractor Context</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={clientContext} 
                                    onChange={(e) => setClientContext(e.target.value)}
                                    placeholder="Nama Klien Utama / Main Contractor"
                                />
                                <small className="field-help">Pihak pememberi kerja atau kontraktor utama proyek.</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label highlight-label">Arsi Karya Role (Peran Eksplisit)</label>
                                <input 
                                    type="text" 
                                    className="form-input highlight-input" 
                                    value={arsiKaryaRole} 
                                    onChange={(e) => setArsiKaryaRole(e.target.value)}
                                    placeholder="Contoh: Kontraktor Utama / Specialist Steel Fabrication"
                                />
                                <small className="field-help">Peran resmi Arsi Karya pada pekerjaan ini.</small>
                            </div>
                        </div>
                    </div>

                    {/* Project Description & Rich Text Content */}
                    <div className="form-panel">
                        <h4 className="panel-heading">3. Konten Detail Proyek</h4>
                        <p className="field-help" style={{ marginBottom: '10px' }}>Gunakan formatting bar di bawah untuk menyusun deskripsi dan konten detail proyek.</p>

                        {/* Rich Editorial Toolbar */}
                        <div className="editorial-toolbar" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', background: '#f3f4f6', padding: '8px 12px', borderRadius: '6px', flexWrap: 'wrap' }}>
                            <button type="button" onClick={() => insertFormatting('<h2>', '</h2>')} className="tool-btn" title="Heading 2" style={{ padding: '4px 10px', fontWeight: 'bold' }}>H2</button>
                            <button type="button" onClick={() => insertFormatting('<h3>', '</h3>')} className="tool-btn" title="Heading 3" style={{ padding: '4px 10px', fontWeight: 'bold' }}>H3</button>
                            <span className="tool-divider" style={{ width: '1px', height: '18px', background: '#d1d5db', margin: '0 4px' }} />
                            <button type="button" onClick={() => insertFormatting('<strong>', '</strong>')} className="tool-btn" title="Tebal" style={{ padding: '4px 8px' }}><FiBold size={14} /></button>
                            <button type="button" onClick={() => insertFormatting('<em>', '</em>')} className="tool-btn" title="Miring" style={{ padding: '4px 8px' }}><FiItalic size={14} /></button>
                            <span className="tool-divider" style={{ width: '1px', height: '18px', background: '#d1d5db', margin: '0 4px' }} />
                            <button type="button" onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')} className="tool-btn" title="Daftar" style={{ padding: '4px 8px' }}><FiList size={14} /></button>
                            <button type="button" onClick={() => insertFormatting('<blockquote>', '</blockquote>')} className="tool-btn" title="Kutipan" style={{ padding: '4px 8px', fontSize: '0.85rem' }}>Kutipan</button>
                            <button type="button" onClick={() => insertFormatting('<a href="https://">', '</a>')} className="tool-btn" title="Link" style={{ padding: '4px 8px' }}><FiLink size={14} /></button>
                            <span className="tool-divider" style={{ width: '1px', height: '18px', background: '#d1d5db', margin: '0 4px' }} />
                            <CloudinaryUploadWidget onUploadSuccess={(url) => insertFormatting(`<figure className="w-richtext-figure"><div><img src="${url}" alt="${title || 'Foto Proyek'}" loading="lazy" /></div></figure>\n`)} />
                        </div>

                        <textarea 
                            ref={textareaRef}
                            className="form-input editorial-textarea" 
                            rows="14" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tuliskan cerita proyek, latar belakang, tantangan, dan metode eksekusi di sini..."
                        />

                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label className="form-label">Lingkup Pekerjaan Spesifik (Scope)</label>
                            <textarea 
                                className="form-input" 
                                rows="3" 
                                value={scope} 
                                onChange={(e) => setScope(e.target.value)}
                                placeholder="Misal: Pekerjaan Tanah, Pekerjaan Struktur Baja, Pekerjaan Dinding Sandwich Panel..."
                            />
                        </div>
                    </div>

                    {/* Gallery Images Panel */}
                    <div className="form-panel">
                        <div className="panel-heading-row">
                            <h4 className="panel-heading" style={{ margin: 0 }}>4. Galeri Foto Proyek</h4>
                            <CloudinaryUploadWidget onUploadSuccess={handleAddGalleryImage} />
                        </div>
                        <p className="field-help" style={{ marginBottom: '16px' }}>Unggah multiple foto hasil akhir pekerjaan atau dokumentasi lapangan.</p>

                        {gallery.length > 0 ? (
                            <div className="gallery-list">
                                {gallery.map((item, idx) => (
                                    <div key={idx} className="gallery-item-card">
                                        <img src={item.url} alt={item.alt || 'Galeri'} className="gallery-preview-img" />
                                        <div className="gallery-item-inputs">
                                            <input 
                                                type="text" 
                                                className="form-input form-input-sm" 
                                                value={item.alt || ''} 
                                                onChange={(e) => handleGalleryAltChange(idx, e.target.value)}
                                                placeholder="Alt text / Deskripsi Foto"
                                            />
                                            <span className="gallery-url-text">{item.url}</span>
                                        </div>
                                        <div className="gallery-item-actions">
                                            <button type="button" onClick={() => moveGalleryUp(idx)} disabled={idx === 0} className="btn-icon" title="Naikkan">
                                                <FiArrowUp size={14} />
                                            </button>
                                            <button type="button" onClick={() => moveGalleryDown(idx)} disabled={idx === gallery.length - 1} className="btn-icon" title="Turunkan">
                                                <FiArrowDown size={14} />
                                            </button>
                                            <button type="button" onClick={() => handleRemoveGalleryImage(idx)} className="btn-icon text-danger" title="Hapus Gambar">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-gallery-box">
                                Belum ada foto galeri ditambahkan. Klik tombol upload di atas untuk menambahkan.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column — Sidebar Media & Publish & SEO */}
                <div className="editor-col-right">
                    {/* Cover Image Box */}
                    <div className="form-panel">
                        <h4 className="panel-heading required">Gambar Sampul (Cover Image)</h4>
                        <p className="field-help" style={{ marginBottom: '12px' }}>Wajib diunggah sebelum proyek dapat diterbitkan secara publik.</p>
                        
                        {coverImageUrl ? (
                            <div className="cover-preview-wrap">
                                <img src={coverImageUrl} alt="Cover Preview" className="cover-img-preview" />
                                <button type="button" className="btn-remove-cover" onClick={() => setCoverImageUrl('')}>
                                    Ganti Cover
                                </button>
                            </div>
                        ) : (
                            <div className="cover-upload-placeholder">
                                <CloudinaryUploadWidget onUploadSuccess={setCoverImageUrl} />
                                <span style={{ marginTop: '8px', fontSize: '0.8rem', color: '#9ca3af' }}>Pilih atau Unggah Cover Image</span>
                            </div>
                        )}
                        <input 
                            type="url" 
                            className="form-input" 
                            style={{ marginTop: '12px' }}
                            value={coverImageUrl} 
                            onChange={(e) => setCoverImageUrl(e.target.value)} 
                            placeholder="atau paste URL gambar langsung..." 
                        />
                    </div>

                    {/* Status & Publication */}
                    <div className="form-panel">
                        <h4 className="panel-heading">Status Publikasi</h4>
                        
                        <div className="form-group">
                            <label className="form-label">URL Slug Proyek</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={slug} 
                                onChange={(e) => setSlug(e.target.value)} 
                            />
                            <small className="field-help">https://arsikarya.com/proyek/{slug || 'slug-proyek'}</small>
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

                    {/* SEO Settings */}
                    <div className="form-panel">
                        <h4 className="panel-heading">Pengaturan SEO (Opsional)</h4>
                        
                        <div className="form-group">
                            <label className="form-label">SEO Title</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={seoTitle} 
                                onChange={(e) => setSeoTitle(e.target.value)} 
                                placeholder={title || 'Judul Halaman SEO'} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">SEO Description</label>
                            <textarea 
                                className="form-input" 
                                rows="3" 
                                value={seoDescription} 
                                onChange={(e) => setSeoDescription(e.target.value)} 
                                placeholder="Deskripsi meta ringkas untuk Google search..." 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
