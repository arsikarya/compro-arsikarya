import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FiSave, FiCheckCircle } from 'react-icons/fi';

export default function AdminSettings() {
    const [companyName, setCompanyName] = useState('Arsi Karya');
    const [tagline, setTagline] = useState('Membangun Tuntas, Unggul Dalam Kualitas');
    const [phone, setPhone] = useState('+62 899-7932-802');
    const [whatsapp, setWhatsapp] = useState('+62 899-7932-802');
    const [email, setEmail] = useState('webarsikarya@gmail.com');
    const [address, setAddress] = useState('Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung.');
    const [instagram, setInstagram] = useState('arsikarya.build');
    const [logoUrl, setLogoUrl] = useState('');
    const [seoTitle, setSeoTitle] = useState('Arsi Karya — Kontraktor & Design Build');
    const [seoDescription, setSeoDescription] = useState('Kontraktor spesialis Konstruksi, Design & Build, Fabrikasi, dan Pengadaan Barang.');
    const [socialImageUrl, setSocialImageUrl] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        adminApi.getSettings()
            .then(data => {
                if (data) {
                    setCompanyName(data.companyName || 'Arsi Karya');
                    setTagline(data.tagline || 'Membangun Tuntas, Unggul Dalam Kualitas');
                    setPhone(data.phone || '+62 899-7932-802');
                    setWhatsapp(data.whatsapp || '+62 899-7932-802');
                    setEmail(data.email || 'webarsikarya@gmail.com');
                    setAddress(data.address || 'Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung.');
                    setInstagram(data.instagram || 'arsikarya.build');
                    setLogoUrl(data.logoUrl || '');
                    setSeoTitle(data.seoTitle || 'Arsi Karya — Kontraktor & Design Build');
                    setSeoDescription(data.seoDescription || 'Kontraktor spesialis Konstruksi, Design & Build, Fabrikasi, dan Pengadaan Barang.');
                    setSocialImageUrl(data.socialImageUrl || '');
                }
            })
            .catch(err => console.error('Failed to fetch settings:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setErrorMsg('');

        const data = {
            companyName,
            tagline,
            phone,
            whatsapp,
            email,
            address,
            instagram,
            logoUrl,
            seoTitle,
            seoDescription,
            socialImageUrl,
        };

        try {
            await adminApi.updateSettings(data);
            setMessage('✅ Pengaturan website berhasil diperbarui!');
            setTimeout(() => setMessage(''), 4000);
        } catch (err) {
            setErrorMsg('❌ Gagal menyimpan pengaturan: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-settings-page">
            <div className="admin-page-header">
                <div>
                    <h3 className="page-heading">Pengaturan Website</h3>
                    <p className="page-subheading">Kelola profil resmi Arsi Karya, kontak, logo, dan default SEO.</p>
                </div>
                <button onClick={handleSave} className="btn-cms btn-cms-primary" disabled={saving}>
                    <FiSave size={16} style={{ marginRight: '6px' }} />
                    {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
            </div>

            {message && <div className="alert-box success-alert">{message}</div>}
            {errorMsg && <div className="alert-box error-alert">{errorMsg}</div>}

            <form onSubmit={handleSave} className="editor-main-grid">
                <div className="editor-col-left">
                    {/* Company Profile */}
                    <div className="form-panel">
                        <h4 className="panel-heading">1. Identitas Perusahaan</h4>

                        <div className="form-group">
                            <label className="form-label required">Nama Perusahaan</label>
                            <input 
                                type="text" 
                                className="form-input text-lg" 
                                value={companyName} 
                                onChange={(e) => setCompanyName(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Slogan / Tagline Perusahaan</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={tagline} 
                                onChange={(e) => setTagline(e.target.value)} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Alamat Kantor Resmi</label>
                            <textarea 
                                className="form-input" 
                                rows="3" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                            />
                        </div>
                    </div>

                    {/* Contact Credentials */}
                    <div className="form-panel">
                        <h4 className="panel-heading">2. Kontak Resmi & Media Sosial</h4>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-label">Nomor Telepon</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Nomor WhatsApp Resmi</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={whatsapp} 
                                    onChange={(e) => setWhatsapp(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-label">Email Perusahaan</label>
                                <input 
                                    type="email" 
                                    className="form-input" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Username Instagram</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={instagram} 
                                    onChange={(e) => setInstagram(e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="editor-col-right">
                    {/* Logo & Social Image */}
                    <div className="form-panel">
                        <h4 className="panel-heading">Logo Perusahaan</h4>
                        {logoUrl ? (
                            <div className="cover-preview-wrap">
                                <img src={logoUrl} alt="Logo" className="cover-img-preview" style={{ height: '100px', objectFit: 'contain', background: '#f8fafc', padding: '10px' }} />
                                <button type="button" className="btn-remove-cover" onClick={() => setLogoUrl('')}>Ganti Logo</button>
                            </div>
                        ) : (
                            <div className="cover-upload-placeholder">
                                <CloudinaryUploadWidget onUploadSuccess={setLogoUrl} />
                                <span style={{ marginTop: '8px', fontSize: '0.8rem', color: '#9ca3af' }}>Unggah Logo</span>
                            </div>
                        )}
                        <input type="url" className="form-input" style={{ marginTop: '10px' }} value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="URL Logo..." />
                    </div>

                    {/* Default SEO */}
                    <div className="form-panel">
                        <h4 className="panel-heading">Default SEO & Social Image</h4>

                        <div className="form-group">
                            <label className="form-label">Default SEO Title</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={seoTitle} 
                                onChange={(e) => setSeoTitle(e.target.value)} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Default SEO Description</label>
                            <textarea 
                                className="form-input" 
                                rows="3" 
                                value={seoDescription} 
                                onChange={(e) => setSeoDescription(e.target.value)} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Default Social Share Image (OG Image)</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input type="url" className="form-input" value={socialImageUrl} onChange={(e) => setSocialImageUrl(e.target.value)} placeholder="URL Social Share..." style={{ flex: 1 }} />
                                <CloudinaryUploadWidget onUploadSuccess={setSocialImageUrl} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
