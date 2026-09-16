import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { publicApi } from '../../lib/api';
import './AdminLogin.css';

export default function AdminResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Token reset kata sandi tidak ditemukan pada URL');
            return;
        }
        if (password.length < 6) {
            setError('Kata sandi minimal 6 karakter');
            return;
        }
        if (password !== confirmPassword) {
            setError('Konfirmasi kata sandi tidak cocok');
            return;
        }

        setLoading(true);
        try {
            await publicApi.resetPassword?.(token, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin/login');
            }, 2500);
        } catch (err) {
            setError(err?.message || 'Gagal mereset kata sandi. Token mungkin sudah kadaluwarsa.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h2>Buat Kata Sandi Baru</h2>
                    <p>Masukkan kata sandi baru untuk akun Admin Arsi Karya</p>
                </div>

                {error && <div className="admin-login-error">{error}</div>}
                {success && (
                    <div style={{ padding: '12px', background: '#e6f4ea', color: '#137333', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>
                        ✓ Kata sandi berhasil diperbarui! Mengalihkan ke halaman login...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <label>Kata Sandi Baru</label>
                        <input
                            type="password"
                            placeholder="Minimal 6 karakter"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading || success}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Konfirmasi Kata Sandi Baru</label>
                        <input
                            type="password"
                            placeholder="Ulangi kata sandi baru"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading || success}
                            required
                        />
                    </div>

                    <button type="submit" className="admin-login-btn" disabled={loading || success}>
                        {loading ? 'Memproses...' : 'Simpan Kata Sandi Baru'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
                    <Link to="/admin/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
                        ← Batal & Kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
