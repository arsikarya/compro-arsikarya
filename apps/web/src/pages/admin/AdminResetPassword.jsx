import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { publicApi } from '../../lib/api';
import { FiLock, FiEye, FiEyeOff, FiArrowLeft, FiShield, FiCheckCircle } from 'react-icons/fi';
import './AdminLogin.css';

export default function AdminResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (!token) {
            setError('Token reset kata sandi tidak ditemukan pada tautan ini. Silakan minta tautan baru.');
            return;
        }

        if (password.length < 8) {
            setError('Kata sandi baru minimal harus 8 karakter');
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
            }, 2000);
        } catch (err) {
            console.error('Password reset error:', err);
            setError(err?.message || 'Gagal mereset kata sandi. Tautan mungkin telah kedaluwarsa.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-layout">
            <div className="admin-login-card animate-fade-in">
                {/* Header */}
                <div className="admin-login-header">
                    <span className="admin-login-badge">
                        <FiShield size={12} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                        PEMBARUAN KEAMANAN
                    </span>
                    <h2><strong>KATA SANDI BARU</strong></h2>
                    <p className="text-secondary">
                        Masukkan kata sandi baru untuk akun administrator Anda
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="login-alert login-alert-error">
                        {error}
                    </div>
                )}

                {/* Success Alert */}
                {success && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '14px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '18px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                            <FiCheckCircle size={18} color="#16a34a" />
                            <span>Kata Sandi Berhasil Diperbarui!</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#15803d' }}>
                            Mengalihkan Anda ke halaman login...
                        </p>
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="login-form-group">
                            <label className="login-form-label">Kata Sandi Baru</label>
                            <div className="login-input-wrap">
                                <FiLock className="login-input-icon" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="login-input"
                                    placeholder="Minimal 8 karakter"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    autoFocus
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                                >
                                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="login-form-group">
                            <label className="login-form-label">Konfirmasi Kata Sandi Baru</label>
                            <div className="login-input-wrap">
                                <FiLock className="login-input-icon" size={18} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="login-input"
                                    placeholder="Ulangi kata sandi baru"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                    title={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
                                >
                                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="login-actions">
                            <button
                                type="submit"
                                className="btn-login-submit"
                                disabled={loading || password.length < 8 || !confirmPassword}
                            >
                                {loading ? 'Menyimpan Kata Sandi...' : 'Simpan Kata Sandi Baru'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Footer link */}
                <div className="login-footer">
                    <Link to="/admin/login" className="login-back-link">
                        <FiArrowLeft size={14} />
                        <span>Batal & Kembali ke Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
