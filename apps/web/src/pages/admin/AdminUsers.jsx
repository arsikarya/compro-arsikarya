import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import { FiUserPlus, FiEdit2, FiKey, FiTrash2, FiShield, FiUserCheck, FiUserX } from 'react-icons/fi';
import './AdminProjects.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    // Form inputs
    const [selectedUser, setSelectedUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ADMIN');
    const [status, setStatus] = useState('active');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminApi.getUsers?.() || [];
            setUsers(data);
        } catch (err) {
            setError(err?.message || 'Gagal memuat daftar pengguna. Fitur ini khusus Super Admin.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await adminApi.createUser?.({ name, email, password, role, status });
            setSuccessMessage(`User ${name} berhasil ditambahkan!`);
            setShowAddModal(false);
            resetForm();
            loadUsers();
        } catch (err) {
            setError(err?.message || 'Gagal membuat user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        setSubmitting(true);
        setError('');
        try {
            await adminApi.updateUserRoleOrStatus?.(selectedUser.id, { name, role, status });
            setSuccessMessage(`Pengaturan user ${name} berhasil diperbarui!`);
            setShowEditModal(false);
            resetForm();
            loadUsers();
        } catch (err) {
            setError(err?.message || 'Gagal memperbarui user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        setSubmitting(true);
        setError('');
        try {
            await adminApi.resetUserPassword?.(selectedUser.id, password);
            setSuccessMessage(`Kata sandi user ${selectedUser.name} berhasil direset!`);
            setShowResetModal(false);
            resetForm();
        } catch (err) {
            setError(err?.message || 'Gagal mereset kata sandi');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userItem) => {
        if (!window.confirm(`Apakah Anda yakin ingin menghapus user ${userItem.name} (${userItem.email})?`)) {
            return;
        }
        setError('');
        try {
            await adminApi.deleteUser?.(userItem.id);
            setSuccessMessage(`User ${userItem.name} berhasil dihapus.`);
            loadUsers();
        } catch (err) {
            setError(err?.message || 'Gagal menghapus user.');
        }
    };

    const openEditModal = (userItem) => {
        setSelectedUser(userItem);
        setName(userItem.name);
        setEmail(userItem.email);
        setRole(userItem.role);
        setStatus(userItem.status);
        setShowEditModal(true);
    };

    const openResetModal = (userItem) => {
        setSelectedUser(userItem);
        setPassword('');
        setShowResetModal(true);
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRole('ADMIN');
        setStatus('active');
        setSelectedUser(null);
    };

    if (loading) {
        return <div style={{ padding: '24px', color: '#666' }}>Memuat daftar pengguna...</div>;
    }

    return (
        <div style={{ padding: '0 0 40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>Manajemen Pengguna & Peran</h3>
                    <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                        Kelola akun pengguna, peran Super Admin / Admin, dan hak akses pengguna CMS.
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                    <FiUserPlus size={18} /> Tambah User
                </button>
            </div>

            {error && <div className="admin-login-error" style={{ marginBottom: '16px' }}>{error}</div>}
            {successMessage && (
                <div style={{ padding: '12px 16px', background: '#e6f4ea', color: '#137333', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '16px' }}>
                    {successMessage}
                </div>
            )}

            {/* Users Table */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nama Pengguna</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Email</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Peran (Role)</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Terakhir Diberbarui</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: u.role === 'SUPER_ADMIN' ? '#dbeafe' : '#f3f4f6', color: u.role === 'SUPER_ADMIN' ? '#1d4ed8' : '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                                            {u.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        {u.name}
                                    </div>
                                </td>
                                <td style={{ padding: '14px 16px', color: '#4b5563' }}>{u.email}</td>
                                <td style={{ padding: '14px 16px' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: u.role === 'SUPER_ADMIN' ? '#eff6ff' : '#f3f4f6', color: u.role === 'SUPER_ADMIN' ? '#1d4ed8' : '#374151', border: u.role === 'SUPER_ADMIN' ? '1px solid #bfdbfe' : '1px solid #e5e7eb' }}>
                                        <FiShield size={12} /> {u.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : 'ADMIN'}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: u.status === 'active' ? '#ecfdf5' : '#fef2f2', color: u.status === 'active' ? '#047857' : '#b91c1c' }}>
                                        {u.status === 'active' ? <FiUserCheck size={12} /> : <FiUserX size={12} />}
                                        {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '0.8rem' }}>
                                    {new Date(u.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                                        <button
                                            onClick={() => openEditModal(u)}
                                            style={{ padding: '6px 10px', background: '#f3f4f6', border: 'none', borderRadius: '6px', color: '#374151', cursor: 'pointer', fontSize: '0.8rem' }}
                                            title="Edit Peran/Status"
                                        >
                                            <FiEdit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => openResetModal(u)}
                                            style={{ padding: '6px 10px', background: '#eff6ff', border: 'none', borderRadius: '6px', color: '#2563eb', cursor: 'pointer', fontSize: '0.8rem' }}
                                            title="Reset Kata Sandi"
                                        >
                                            <FiKey size={14} /> Reset Pass
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(u)}
                                            style={{ padding: '6px 10px', background: '#fef2f2', border: 'none', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem' }}
                                            title="Hapus User"
                                        >
                                            <FiTrash2 size={14} /> Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Add User */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '450px', padding: '24px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Tambah User Baru</h4>
                        <form onSubmit={handleAddUser}>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Nama Lengkap</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Alamat Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Kata Sandi Awal</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Peran (Role)</label>
                                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                                    <option value="ADMIN">ADMIN (Kelola konten & media)</option>
                                    <option value="SUPER_ADMIN">SUPER ADMIN (Akses penuh & kelola user)</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Status Akun</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
                                <button type="submit" disabled={submitting} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>{submitting ? 'Menyimpan...' : 'Simpan User'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit User */}
            {showEditModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '450px', padding: '24px', borderRadius: '12px' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Edit User: {selectedUser?.email}</h4>
                        <form onSubmit={handleUpdateUser}>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Nama Lengkap</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Peran (Role)</label>
                                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="SUPER_ADMIN">SUPER ADMIN</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Status Akun</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
                                <button type="submit" disabled={submitting} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>{submitting ? 'Menyimpan...' : 'Perbarui'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Reset Password */}
            {showResetModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '450px', padding: '24px', borderRadius: '12px' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Reset Kata Sandi User: {selectedUser?.name}</h4>
                        <form onSubmit={handleResetPassword}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Kata Sandi Baru</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan kata sandi baru" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowResetModal(false)} style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
                                <button type="submit" disabled={submitting} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>{submitting ? 'Memproses...' : 'Reset Kata Sandi'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
