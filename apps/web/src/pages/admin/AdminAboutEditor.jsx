import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FiSave, FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import './AdminProjectEditor.css';

export default function AdminAboutEditor() {
    const [bioDescription, setBioDescription] = useState('');
    const [tools, setTools] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        adminApi.getAbout()
            .then((data) => {
                if (data.page) {
                    setBioDescription(data.page.bioDescription || '');
                }
                setTools(data.tools || []);
                setExperiences(data.experiences || []);
                setLicenses(data.certifications || []); // Using certifications from API to match public API
                setActivities(data.galleryImages || []); // Using galleryImages to match public API
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

    // Tool helpers
    const addTool = () => setTools([...tools, { id: Date.now().toString(), name: '', iconCode: '' }]);
    const removeTool = (index) => setTools(tools.filter((_, i) => i !== index));
    const updateTool = (index, field, value) => {
        const updated = [...tools];
        updated[index] = { ...updated[index], [field]: value };
        setTools(updated);
    };

    // Experience helpers
    const addExperience = () => setExperiences([...experiences, {
        id: Date.now().toString(),
        logoUrl: '',
        title: '',
        company: '',
        dateStart: '',
        dateEnd: '',
        contractType: ''
    }]);
    const removeExperience = (index) => setExperiences(experiences.filter((_, i) => i !== index));
    const updateExperience = (index, field, value) => {
        const updated = [...experiences];
        updated[index] = { ...updated[index], [field]: value };
        setExperiences(updated);
    };

    // License helpers
    const addLicense = () => setLicenses([...licenses, {
        id: Date.now().toString(),
        logoUrl: '',
        title: '',
        issuer: '',
        dateStart: '',
        dateEnd: ''
    }]);
    const removeLicense = (index) => setLicenses(licenses.filter((_, i) => i !== index));
    const updateLicense = (index, field, value) => {
        const updated = [...licenses];
        updated[index] = { ...updated[index], [field]: value };
        setLicenses(updated);
    };

    // Activity helpers
    const addActivity = () => setActivities([...activities, { id: Date.now().toString(), imageUrl: '', caption: '' }]);
    const removeActivity = (index) => setActivities(activities.filter((_, i) => i !== index));
    const updateActivity = (index, field, value) => {
        const updated = [...activities];
        updated[index] = { ...updated[index], [field]: value };
        setActivities(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await adminApi.updateAbout({
                bioDescription,
                tools,
                experiences,
                certifications: licenses,
                galleryImages: activities
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
                    <h2 className="page-heading">Kelola Halaman Tentang Kami (About)</h2>
                    <p className="page-subheading">
                        Atur deskripsi perusahaan, ikon keahlian, riwayat pengalaman, lisensi sertifikasi, dan galeri aktivitas.
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
                {/* 1. Overview Description */}
                <div className="form-panel animate-fade-in">
                    <h3 className="panel-heading">Deskripsi Profil Perusahaan</h3>
                    <div className="form-group">
                        <label className="form-label">Deskripsi Tentang Kami (Mendukung HTML & Teks)</label>
                        <textarea
                            className="form-input"
                            rows={6}
                            value={bioDescription}
                            onChange={(e) => setBioDescription(e.target.value)}
                            placeholder="PT ARSI KARYA UNGGUL adalah perusahaan kontraktor umum..."
                        />
                    </div>
                </div>

                {/* 2. Tools & Skills */}
                <div className="form-panel animate-fade-in delay-100">
                    <h3 className="panel-heading">Alat, Keahlian & Teknologi</h3>
                    <p className="field-help" style={{ marginBottom: '16px' }}>
                        Gunakan kode ikon React-Icons (misal: 'SiFigma', 'FaWordpress', 'SiAutodesk', 'SiSketchup').
                    </p>
                    <div className="blocks-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {tools.map((tool, index) => (
                            <div key={tool.id || index} className="editor-block">
                                <div className="block-header">
                                    <span className="block-type-badge">Ikon #{index + 1}</span>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <button type="button" onClick={() => moveItemUp(tools, setTools, index)} disabled={index === 0} className="btn-icon" title="Pindah ke Atas">
                                            <FiArrowUp size={14} />
                                        </button>
                                        <button type="button" onClick={() => moveItemDown(tools, setTools, index)} disabled={index === tools.length - 1} className="btn-icon" title="Pindah ke Bawah">
                                            <FiArrowDown size={14} />
                                        </button>
                                        <button type="button" onClick={() => removeTool(index)} className="btn-icon text-danger" title="Hapus">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Nama Keahlian / Alat</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={tool.name || ''}
                                            onChange={(e) => updateTool(index, 'name', e.target.value)}
                                            placeholder="Contoh: Figma, AutoCAD"
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Kode React-Icon</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={tool.iconCode || ''}
                                            onChange={(e) => updateTool(index, 'iconCode', e.target.value)}
                                            placeholder="SiFigma"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addTool} className="btn-dashed">
                        <FiPlus size={16} />
                        <span>Tambah Ikon Alat / Keahlian</span>
                    </button>
                </div>

                {/* 3. Experience */}
                <div className="form-panel animate-fade-in delay-100">
                    <h3 className="panel-heading">Riwayat Pengalaman & Portofolio Kerja</h3>
                    <div className="blocks-list">
                        {experiences.map((exp, index) => (
                            <div key={exp.id || index} className="editor-block">
                                <div className="block-header">
                                    <span className="block-type-badge">Pengalaman #{index + 1}</span>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <button type="button" onClick={() => moveItemUp(experiences, setExperiences, index)} disabled={index === 0} className="btn-icon" title="Pindah ke Atas">
                                            <FiArrowUp size={14} />
                                        </button>
                                        <button type="button" onClick={() => moveItemDown(experiences, setExperiences, index)} disabled={index === experiences.length - 1} className="btn-icon" title="Pindah ke Bawah">
                                            <FiArrowDown size={14} />
                                        </button>
                                        <button type="button" onClick={() => removeExperience(index)} className="btn-icon text-danger" title="Hapus">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">URL Logo Perusahaan (Opsional)</label>
                                        <input
                                            type="url"
                                            className="form-input"
                                            value={exp.logoUrl || ''}
                                            onChange={(e) => updateExperience(index, 'logoUrl', e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Posisi / Jabatan</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={exp.title || exp.jobTitle || ''}
                                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                            placeholder="Contoh: General Contractor"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Nama Perusahaan / Klien</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={exp.company || ''}
                                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                            placeholder="PT. Arsi Karya Unggul"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tahun / Tanggal Mulai</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={exp.dateStart || ''}
                                            onChange={(e) => updateExperience(index, 'dateStart', e.target.value)}
                                            placeholder="Contoh: 2021"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tahun / Tanggal Selesai</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={exp.dateEnd || ''}
                                            onChange={(e) => updateExperience(index, 'dateEnd', e.target.value)}
                                            placeholder="Contoh: Sekarang / Present"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tipe Kontrak</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={exp.type || exp.contractType || ''}
                                            onChange={(e) => updateExperience(index, 'type', e.target.value)}
                                            placeholder="Contoh: Full-time / Project"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addExperience} className="btn-dashed">
                        <FiPlus size={16} />
                        <span>Tambah Pengalaman</span>
                    </button>
                </div>

                {/* 4. Licenses & Certifications */}
                <div className="form-panel animate-fade-in delay-200">
                    <h3 className="panel-heading">Lisensi & Sertifikasi</h3>
                    <div className="blocks-list">
                        {licenses.map((lic, index) => (
                            <div key={lic.id || index} className="editor-block">
                                <div className="block-header">
                                    <span className="block-type-badge">Sertifikasi #{index + 1}</span>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <button type="button" onClick={() => moveItemUp(licenses, setLicenses, index)} disabled={index === 0} className="btn-icon" title="Pindah ke Atas">
                                            <FiArrowUp size={14} />
                                        </button>
                                        <button type="button" onClick={() => moveItemDown(licenses, setLicenses, index)} disabled={index === licenses.length - 1} className="btn-icon" title="Pindah ke Bawah">
                                            <FiArrowDown size={14} />
                                        </button>
                                        <button type="button" onClick={() => removeLicense(index)} className="btn-icon text-danger" title="Hapus">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">URL Logo Instansi / Penerbit</label>
                                        <input
                                            type="url"
                                            className="form-input"
                                            value={lic.logoUrl || ''}
                                            onChange={(e) => updateLicense(index, 'logoUrl', e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Nama Sertifikasi / Lisensi</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={lic.title || lic.name || ''}
                                            onChange={(e) => updateLicense(index, 'title', e.target.value)}
                                            placeholder="Contoh: Sertifikasi Keahlian Konstruksi"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Organisasi / Lembaga Penerbit</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={lic.issuer || ''}
                                            onChange={(e) => updateLicense(index, 'issuer', e.target.value)}
                                            placeholder="Contoh: LPJK / BNSP"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tanggal Terbit</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={lic.dateStart || lic.issueDate || ''}
                                            onChange={(e) => updateLicense(index, 'dateStart', e.target.value)}
                                            placeholder="Contoh: Jan 2023"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tanggal Kedaluwarsa (Opsional)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={lic.dateEnd || ''}
                                            onChange={(e) => updateLicense(index, 'dateEnd', e.target.value)}
                                            placeholder="Contoh: Des 2026 / Seumur Hidup"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addLicense} className="btn-dashed">
                        <FiPlus size={16} />
                        <span>Tambah Lisensi & Sertifikasi</span>
                    </button>
                </div>

                {/* 5. Activity Gallery */}
                <div className="form-panel animate-fade-in delay-300">
                    <h3 className="panel-heading">Galeri Aktivitas</h3>
                    <p className="field-help" style={{ marginBottom: '16px' }}>
                        Foto-foto ini akan tampil pada slider/carousel galeri aktivitas di halaman Tentang Kami.
                    </p>
                    <div className="blocks-list">
                        {activities.map((act, index) => (
                            <div key={act.id || index} className="editor-block">
                                <div className="block-header">
                                    <span className="block-type-badge">Foto #{index + 1}</span>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <button type="button" onClick={() => moveItemUp(activities, setActivities, index)} disabled={index === 0} className="btn-icon" title="Pindah ke Atas">
                                            <FiArrowUp size={14} />
                                        </button>
                                        <button type="button" onClick={() => moveItemDown(activities, setActivities, index)} disabled={index === activities.length - 1} className="btn-icon" title="Pindah ke Bawah">
                                            <FiArrowDown size={14} />
                                        </button>
                                        <button type="button" onClick={() => removeActivity(index)} className="btn-icon text-danger" title="Hapus">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">URL Foto / Gambar</label>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            {act.imageUrl && (
                                                <img
                                                    src={act.imageUrl}
                                                    alt="Preview"
                                                    style={{ width: '60px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                                                />
                                            )}
                                            <input
                                                type="url"
                                                className="form-input"
                                                value={act.imageUrl || act.url || ''}
                                                onChange={(e) => updateActivity(index, 'imageUrl', e.target.value)}
                                                placeholder="https://..."
                                                style={{ flex: 1 }}
                                            />
                                            <CloudinaryUploadWidget onUploadSuccess={(url) => updateActivity(index, 'imageUrl', url)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addActivity} className="btn-dashed">
                        <FiPlus size={16} />
                        <span>Tambah Foto Galeri</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
