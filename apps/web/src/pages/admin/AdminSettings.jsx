import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import MediaPickerModal from '../../components/admin/MediaPickerModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FiSave, FiTrendingUp, FiMessageCircle, FiInfo } from 'react-icons/fi';

export default function AdminSettings() {
    const { refreshSettings } = useSiteSettings();

    // Company & Contact
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
    const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // 'logo' | 'social' | null

    // Dynamic Statistics (Homepage & About Us)
    const [stat1Value, setStat1Value] = useState('100+');
    const [stat1Label, setStat1Label] = useState('PROYEK SELESAI');
    const [stat2Value, setStat2Value] = useState('100%');
    const [stat2Label, setStat2Label] = useState('KOMITMEN MUTU');
    const [stat3Value, setStat3Value] = useState('4');
    const [stat3Label, setStat3Label] = useState('LAYANAN SPESIALIS');

    // Dynamic WhatsApp CTA Greeting
    const [whatsappCtaText, setWhatsappCtaText] = useState('Halo Arsi Karya, saya ingin berkonsultasi terkait kebutuhan proyek saya. Mohon informasi dan arahan mengenai langkah yang perlu saya siapkan.');

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
                    setStat1Value(data.stat1Value || '100+');
                    setStat1Label(data.stat1Label || 'PROYEK SELESAI');
                    setStat2Value(data.stat2Value || '100%');
                    setStat2Label(data.stat2Label || 'KOMITMEN MUTU');
                    setStat3Value(data.stat3Value || '4');
                    setStat3Label(data.stat3Label || 'LAYANAN SPESIALIS');
                    setWhatsappCtaText(data.whatsappCtaText || 'Halo Arsi Karya, saya ingin berkonsultasi terkait kebutuhan proyek saya. Mohon informasi dan arahan mengenai langkah yang perlu saya siapkan.');
                }
            })
            .catch(err => console.error('Failed to fetch settings:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        if (e) e.preventDefault();
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
            stat1Value,
            stat1Label,
            stat2Value,
            stat2Label,
            stat3Value,
            stat3Label,
            whatsappCtaText,
        };

        try {
            await adminApi.updateSettings(data);
            if (refreshSettings) await refreshSettings();
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
                    <p className="page-subheading">Kelola profil resmi Arsi Karya, statistik pencapaian, pesan CTA WhatsApp, dan kontak.</p>
                </div>
                <button onClick={handleSave} className="btn-cms btn-cms-primary" disabled={saving}>
                    <FiSave size={16} />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
                </button>
            </div>

            {message && <div className="alert-box success-alert">{message}</div>}
            {errorMsg && <div className="alert-box error-alert">{errorMsg}</div>}

            <form onSubmit={handleSave} className="editor-main-grid">
                <div className="editor-col-left">
                    {/* 1. Company Profile */}
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

                    {/* 2. Contact Credentials */}
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
                                <label className="form-label">Nomor WhatsApp Resmi (Tujuan Chat)</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={whatsapp} 
                                    onChange={(e) => setWhatsapp(e.target.value)} 
                                    placeholder="+62 899-7932-802"
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
                                    placeholder="arsikarya.build"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. WhatsApp CTA Greeting Customizer */}
                    <div className="form-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <FiMessageCircle size={18} color="#059669" />
                            <h4 className="panel-heading" style={{ margin: 0 }}>3. Teks Pesan WhatsApp Otomatis (CTA)</h4>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.5 }}>
                            Pesan ini otomatis muncul di layar WhatsApp calon klien ketika mereka mengklik tombol <strong>Konsultasi Sekarang</strong>, <strong>Hubungi Kami</strong>, atau ikon <strong>WhatsApp Mengambang</strong> di website.
                        </p>

                        <div className="form-group">
                            <label className="form-label">Isi Pesan WhatsApp</label>
                            <textarea 
                                className="form-input" 
                                rows="3" 
                                value={whatsappCtaText} 
                                onChange={(e) => setWhatsappCtaText(e.target.value)} 
                                placeholder="Contoh: Halo Arsi Karya, saya ingin berkonsultasi mengenai proyek pembangunan/renovasi saya..."
                            />
                        </div>

                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <FiInfo size={16} color="#15803d" style={{ marginTop: '2px', flexShrink: 0 }} />
                            <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.5 }}>
                                <strong>Simpel & Mudah:</strong> Cukup ketik kalimat biasa dalam bahasa Indonesia santun. Sistem otomatis menyesuaikan formatnya ke WhatsApp tanpa perlu bahasa pemrograman atau kode simbol khusus.
                            </div>
                        </div>
                    </div>

                    {/* 4. Dynamic Statistics Customizer */}
                    <div className="form-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <FiTrendingUp size={18} color="#2563eb" />
                            <h4 className="panel-heading" style={{ margin: 0 }}>4. Statistik & Pencapaian Perusahaan</h4>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
                            Ubah angka dan keterangan statistik di bawah ini. Perubahan akan <strong>otomatis tersinkronisasi</strong> pada bagian Tentang Arsi Karya di <strong>Halaman Utama (Beranda)</strong> dan <strong>Halaman Tentang Kami</strong>.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Stat 1 */}
                            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Statistik 1
                                </span>
                                <div className="form-row-2" style={{ marginTop: '8px' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Angka / Nilai</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={stat1Value} 
                                            onChange={(e) => setStat1Value(e.target.value)} 
                                            placeholder="100+"
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Keterangan / Label</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={stat1Label} 
                                            onChange={(e) => setStat1Label(e.target.value)} 
                                            placeholder="PROYEK SELESAI"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stat 2 */}
                            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Statistik 2
                                </span>
                                <div className="form-row-2" style={{ marginTop: '8px' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Angka / Nilai</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={stat2Value} 
                                            onChange={(e) => setStat2Value(e.target.value)} 
                                            placeholder="100%"
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Keterangan / Label</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={stat2Label} 
                                            onChange={(e) => setStat2Label(e.target.value)} 
                                            placeholder="KOMITMEN MUTU"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stat 3 */}
                            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Statistik 3
                                </span>
                                <div className="form-row-2" style={{ marginTop: '8px' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Angka / Nilai</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={stat3Value} 
                                            onChange={(e) => setStat3Value(e.target.value)} 
                                            placeholder="4"
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Keterangan / Label</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={stat3Label} 
                                            onChange={(e) => setStat3Label(e.target.value)} 
                                            placeholder="LAYANAN SPESIALIS"
                                        />
                                    </div>
                                </div>
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
                                <img src={logoUrl} alt="Logo" className="cover-img-preview" style={{ height: '90px', objectFit: 'contain', background: '#f8fafc', padding: '10px' }} />
                                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                    <button 
                                        type="button" 
                                        className="btn-cms btn-cms-outline" 
                                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                        onClick={() => setMediaPickerTarget('logo')}
                                    >
                                        Ganti dari Media
                                    </button>
                                    <CloudinaryUploadWidget onUploadSuccess={setLogoUrl} buttonText="Upload Baru" />
                                    <button type="button" className="btn-remove-cover" onClick={() => setLogoUrl('')} style={{ marginLeft: 'auto' }}>
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="cover-upload-placeholder" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <button 
                                        type="button" 
                                        className="btn-cms btn-cms-outline" 
                                        style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                                        onClick={() => setMediaPickerTarget('logo')}
                                    >
                                        Pilih dari Media Library
                                    </button>
                                    <CloudinaryUploadWidget onUploadSuccess={setLogoUrl} buttonText="Upload Logo" />
                                </div>
                                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Pilih dari Cloudinary atau unggah logo baru</span>
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
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <input type="url" className="form-input" value={socialImageUrl} onChange={(e) => setSocialImageUrl(e.target.value)} placeholder="URL Social Share..." style={{ flex: 1, minWidth: '200px' }} />
                                <button 
                                    type="button" 
                                    className="btn-cms btn-cms-outline" 
                                    style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                    onClick={() => setMediaPickerTarget('social')}
                                >
                                    Pilih Media
                                </button>
                                <CloudinaryUploadWidget onUploadSuccess={setSocialImageUrl} buttonText="Upload" />
                            </div>
                        </div>
                    </div>

                    {/* Action Card Save */}
                    <div className="form-panel" style={{ background: '#f8fafc', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>
                            Pastikan data sudah benar sebelum menyimpan perubahan ke seluruh website.
                        </p>
                        <button type="submit" className="btn-cms btn-cms-primary" style={{ width: '100%' }} disabled={saving}>
                            <FiSave size={16} />
                            <span>{saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
                        </button>
                    </div>
                </div>
            </form>

            <MediaPickerModal 
                isOpen={!!mediaPickerTarget}
                onClose={() => setMediaPickerTarget(null)}
                onSelect={(url) => {
                    if (mediaPickerTarget === 'logo') setLogoUrl(url);
                    if (mediaPickerTarget === 'social') setSocialImageUrl(url);
                }}
                title={mediaPickerTarget === 'logo' ? 'Pilih Logo Perusahaan' : 'Pilih Default Social Share Image'}
            />
        </div>
    );
}
