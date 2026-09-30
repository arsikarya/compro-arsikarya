import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FiSave } from 'react-icons/fi';
import './AdminProjectEditor.css';

export default function AdminContactEditor() {
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [defaultMessage, setDefaultMessage] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        adminApi.getContact()
            .then((data) => {
                if (data) {
                    setWhatsappNumber(data.whatsappNumber || '');
                    setDefaultMessage(data.defaultMessage || '');
                    setEmail(data.email || 'webarsikarya@gmail.com');
                    setPhone(data.phone || '');
                    setLocation(data.location || '');
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await adminApi.updateContact({ whatsappNumber, defaultMessage, email, phone, location });
            setMessage('✅ Perubahan berhasil disimpan!');
            setTimeout(() => setMessage(''), 3500);
        } catch (err) {
            setMessage('❌ Gagal menyimpan: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-project-editor">
            {/* Header Navigation */}
            <div className="admin-page-header">
                <div>
                    <h2 className="page-heading">Kelola Halaman Kontak (Contact)</h2>
                    <p className="page-subheading">
                        Atur informasi kontak resmi, nomor telepon, alamat kantor, serta integrasi pesan WhatsApp.
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
                {/* Contact Information Panel */}
                <div className="form-panel animate-fade-in">
                    <h3 className="panel-heading">Informasi Kontak Resmi</h3>
                    <p className="field-help" style={{ marginBottom: '20px' }}>
                        Detail kontak yang ditampilkan pada halaman kontak publik dan footer website.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Alamat Email Resmi</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="webarsikarya@gmail.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nomor Telepon Kantor (Tampilan)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+62 899-7932-802"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Alamat / Lokasi Kantor</label>
                        <input
                            type="text"
                            className="form-input"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung."
                        />
                    </div>
                </div>

                {/* WhatsApp Integration Panel */}
                <div className="form-panel animate-fade-in delay-100">
                    <h3 className="panel-heading">Integrasi Pesan WhatsApp Otomatis</h3>
                    
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label">Nomor WhatsApp Tujuan</label>
                        <input
                            type="text"
                            className="form-input"
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value)}
                            placeholder="Contoh: 628997932802 (Gunakan kode negara tanpa tanda '+')"
                        />
                        <span className="field-help">Masukkan angka saja termasuk kode negara (contoh 628...). Jangan gunakan tanda tambah (+) atau spasi.</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Pesan Standar WhatsApp (Template Pesan Awal)</label>
                        <textarea
                            className="form-input"
                            rows={5}
                            value={defaultMessage}
                            onChange={(e) => setDefaultMessage(e.target.value)}
                            placeholder="Halo Arsi Karya, saya ingin berkonsultasi mengenai proyek..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
