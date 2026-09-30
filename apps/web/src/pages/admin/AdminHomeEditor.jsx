import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FiSave, FiPlus, FiArrowUp, FiArrowDown, FiTrash2 } from 'react-icons/fi';
import './AdminProjectEditor.css';

export default function AdminHomeEditor() {
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [heroHeadline, setHeroHeadline] = useState('');
    const [ctaText, setCtaText] = useState('');
    const [ctaUrl, setCtaUrl] = useState('');
    const [socials, setSocials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        adminApi.getHome()
            .then((data) => {
                if (data.page) {
                    setProfileImageUrl(data.page.profileImageUrl || '');
                    setHeroHeadline(data.page.heroHeadline || '');
                    setCtaText(data.page.ctaText || '');
                    setCtaUrl(data.page.ctaUrl || '');
                }
                setSocials(data.socials || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const moveItemUp = (arr, setArr, index) => {
        if (index === 0) return;
        const newArr = [...arr];
        [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
        setArr(newArr);
    };

    const moveItemDown = (arr, setArr, index) => {
        if (index === arr.length - 1) return;
        const newArr = [...arr];
        [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
        setArr(newArr);
    };

    const addSocial = () => setSocials([...socials, { id: Date.now().toString(), name: '', url: '' }]);
    const removeSocial = (index) => setSocials(socials.filter((_, i) => i !== index));
    const updateSocial = (index, field, value) => {
        const updated = [...socials];
        updated[index] = { ...updated[index], [field]: value };
        setSocials(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await adminApi.updateHome({
                profileImageUrl,
                heroHeadline,
                ctaText,
                ctaUrl,
                socials
            });
            setMessage('✅ Perubahan berhasil disimpan!');
            setTimeout(() => setMessage(''), 3500);
        } catch (err) {
            setMessage('❌ Gagal menyimpan: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="admin-project-editor">
            {/* Header Navigation */}
            <div className="admin-page-header">
                <div>
                    <h2 className="page-heading">Kelola Halaman Beranda (Home)</h2>
                    <p className="page-subheading">
                        Atur foto profil hero, headline pengantar, tombol ajakan (CTA), serta tautan media sosial resmi.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {message && (
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: message.startsWith('✅') ? '#059669' : '#dc2626' }}>
                            {message}
                        </span>
                    )}
                    <button className="btn-cms btn-cms-primary" onClick={handleSave} disabled={saving}>
                        <FiSave size={16} />
                        <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Hero Profile Panel */}
                <div className="form-panel animate-fade-in">
                    <h3 className="panel-heading">Hero Banner & Pengantar</h3>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label">Foto / Gambar Profil Hero</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {profileImageUrl && (
                                <img
                                    src={profileImageUrl}
                                    alt="Profile preview"
                                    style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #e5e7eb' }}
                                />
                            )}
                            <input
                                type="url"
                                className="form-input"
                                value={profileImageUrl}
                                onChange={(e) => setProfileImageUrl(e.target.value)}
                                placeholder="https://..."
                                style={{ flex: 1 }}
                            />
                            <CloudinaryUploadWidget onUploadSuccess={setProfileImageUrl} />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label">Headline Hero (Mendukung Format HTML)</label>
                        <textarea
                            className="form-input text-lg"
                            rows={3}
                            value={heroHeadline}
                            onChange={(e) => setHeroHeadline(e.target.value)}
                            placeholder="Membangun Tuntas, Unggul Dalam Kualitas..."
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Teks Tombol Aksi (CTA)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={ctaText}
                                onChange={(e) => setCtaText(e.target.value)}
                                placeholder="Konsultasi Sekarang"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tautan Tujuan CTA</label>
                            <input
                                type="text"
                                className="form-input"
                                value={ctaUrl}
                                onChange={(e) => setCtaUrl(e.target.value)}
                                placeholder="/contact"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Links Panel */}
                <div className="form-panel animate-fade-in delay-100">
                    <h3 className="panel-heading">Tautan Media Sosial Resmi</h3>
                    <p className="field-help" style={{ marginBottom: '16px' }}>
                        Tautan media sosial yang tampil di bawah section hero beranda.
                    </p>
                    <div className="blocks-list">
                        {socials.map((social, index) => (
                            <div key={social.id || index} className="editor-block">
                                <div className="block-header">
                                    <span className="block-type-badge">Media Sosial #{index + 1}</span>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <button type="button" onClick={() => moveItemUp(socials, setSocials, index)} disabled={index === 0} className="btn-icon" title="Pindah ke Atas">
                                            <FiArrowUp size={14} />
                                        </button>
                                        <button type="button" onClick={() => moveItemDown(socials, setSocials, index)} disabled={index === socials.length - 1} className="btn-icon" title="Pindah ke Bawah">
                                            <FiArrowDown size={14} />
                                        </button>
                                        <button type="button" onClick={() => removeSocial(index)} className="btn-icon text-danger" title="Hapus">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Nama Platform (atau Kode React-Icon)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={social.name || ''}
                                            onChange={(e) => updateSocial(index, 'name', e.target.value)}
                                            placeholder="Contoh: Instagram atau SiInstagram"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">URL Tujuan</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={social.url || ''}
                                            onChange={(e) => updateSocial(index, 'url', e.target.value)}
                                            placeholder="https://instagram.com/arsikarya.build"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addSocial} className="btn-dashed">
                        <FiPlus size={16} />
                        <span>Tambah Tautan Media Sosial</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
