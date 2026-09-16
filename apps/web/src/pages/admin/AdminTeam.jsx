import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import { FiPlus, FiEdit2, FiTrash2, FiUserCheck, FiUserX, FiCheckCircle } from 'react-icons/fi';
import './AdminProjects.css';

export default function AdminTeam() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [bio, setBio] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminApi.getTeam?.() || [];
            setTeam(data);
        } catch (err) {
            setError(err?.message || 'Gagal memuat tim');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingMember(null);
        setName('');
        setPosition('');
        setBio('');
        setProfileImageUrl('');
        setIsActive(true);
        setShowModal(true);
    };

    const openEditModal = (member) => {
        setEditingMember(member);
        setName(member.name);
        setPosition(member.position);
        setBio(member.bio || '');
        setProfileImageUrl(member.profileImageUrl || '');
        setIsActive(member.isActive ?? true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');

        const payload = {
            name,
            position,
            bio,
            profileImageUrl,
            isActive,
        };

        try {
            if (editingMember) {
                await adminApi.updateTeamMember?.(editingMember.id, payload);
                setMessage('Anggota tim berhasil diperbarui!');
            } else {
                await adminApi.createTeamMember?.(payload);
                setMessage('Anggota tim baru berhasil ditambahkan!');
            }
            setShowModal(false);
            loadTeam();
        } catch (err) {
            setError(err?.message || 'Gagal menyimpan data anggota tim');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, memberName) => {
        if (!window.confirm(`Hapus anggota tim ${memberName}?`)) return;
        setError('');
        try {
            await adminApi.deleteTeamMember?.(id);
            setMessage(`Anggota tim ${memberName} berhasil dihapus.`);
            loadTeam();
        } catch (err) {
            setError(err?.message || 'Gagal menghapus anggota tim');
        }
    };

    if (loading) return <div style={{ padding: '24px', color: '#666' }}>Memuat data tim...</div>;

    return (
        <div style={{ padding: '0 0 40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>Kelola Tim & Manajemen</h3>
                    <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                        Atur susunan tim profesional dan jajaran manajemen Arsi Karya yang tampil di website.
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                    <FiPlus size={18} /> Tambah Anggota Tim
                </button>
            </div>

            {error && <div className="admin-login-error" style={{ marginBottom: '16px' }}>{error}</div>}
            {message && (
                <div style={{ padding: '12px 16px', background: '#e6f4ea', color: '#137333', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiCheckCircle size={18} /> {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {team.map((m) => (
                    <div key={m.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '200px', background: '#f3f4f6', position: 'relative' }}>
                            {m.profileImageUrl ? (
                                <img src={m.profileImageUrl} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontWeight: 600 }}>
                                    Tanpa Foto
                                </div>
                            )}
                            <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: m.isActive ? '#ecfdf5' : '#fef2f2', color: m.isActive ? '#047857' : '#b91c1c' }}>
                                {m.isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </div>
                        <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{m.name}</h4>
                                <p style={{ margin: '0 0 10px 0', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}>{m.position}</p>
                                {m.bio && <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem', lineHeight: '1.4' }}>{m.bio}</p>}
                            </div>
                            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button onClick={() => openEditModal(m)} style={{ padding: '6px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', color: '#374151', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <FiEdit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(m.id, m.name)} style={{ padding: '6px 12px', background: '#fef2f2', border: 'none', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <FiTrash2 size={14} /> Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '500px', padding: '24px', borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>{editingMember ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}</h4>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Nama Lengkap</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Jabatan / Posisi</label>
                                <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Contoh: Lead Architect" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Bio / Deskripsi Singkat</label>
                                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Foto Profil (URL / Upload)</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input type="text" value={profileImageUrl} onChange={(e) => setProfileImageUrl(e.target.value)} placeholder="https://res.cloudinary.com/..." style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                                    <CloudinaryUploadWidget onUploadSuccess={(url) => setProfileImageUrl(url)} buttonText="Upload" />
                                </div>
                                {profileImageUrl && (
                                    <div style={{ marginTop: '8px' }}>
                                        <img src={profileImageUrl} alt="Preview" style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>
                            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" id="isActiveCheck" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                                <label htmlFor="isActiveCheck" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Tampilkan di Website Publik</label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
                                <button type="submit" disabled={submitting} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>{submitting ? 'Menyimpan...' : 'Simpan'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
