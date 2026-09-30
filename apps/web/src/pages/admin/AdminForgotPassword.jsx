import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicApi } from '../../lib/api';
import { FiMail, FiArrowLeft, FiShield, FiCheckCircle, FiKey } from 'react-icons/fi';
import './AdminLogin.css';

export default function AdminForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setMessage('');
        setResetToken('');

        if (!email.trim()) {
            setError('Masukkan alamat email administrator');
            return;
        }

        setLoading(true);
        try {
            const res = await publicApi.requestPasswordReset?.(email.trim());
            setMessage(res?.message || `Tautan reset kata sandi telah diproses untuk ${email.trim()}`);
            if (res?.token) {
                setResetToken(res.token);
            }
        } catch (err) {
            console.error('Password reset request error:', err);
            setError(err?.message || 'Gagal mengirim permintaan pemulihan kata sandi');
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
                        PEMULIHAN AKUN
                    </span>
                    <h2><strong>LUPA KATA SANDI</strong></h2>
                    <p className="text-secondary">
                        Masukkan email terdaftar untuk menerima tautan pembuatan kata sandi baru
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="login-alert login-alert-error">
                        {error}
                    </div>
                )}

                {/* Success Alert */}
                {message && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '18px', lineHeight: 1.5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '4px' }}>
                            <FiCheckCircle size={16} color="#16a34a" />
                            <span>Permintaan Berhasil</span>
                        </div>
                        {message}
                        
                        {/* Direct Continue Button if token is returned */}
                        {resetToken && (
                            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #dcfce7' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/admin/reset-password?token=${resetToken}`)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        background: '#15803d',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    <FiKey size={14} />
                                    <span>Lanjut Buat Kata Sandi Baru Sekarang &rarr;</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {!resetToken && (
                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="login-form-group">
                            <label className="login-form-label">Email Administrator</label>
                            <div className="login-input-wrap">
                                <FiMail className="login-input-icon" size={18} />
                                <input
                                    type="email"
                                    className="login-input"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-actions">
                            <button
                                type="submit"
                                className="btn-login-submit"
                                disabled={loading || !email.trim()}
                            >
                                {loading ? 'Memproses Permintaan...' : 'Kirim Tautan Pemulihan'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Footer link */}
                <div className="login-footer">
                    <Link to="/admin/login" className="login-back-link">
                        <FiArrowLeft size={14} />
                        <span>Kembali ke Halaman Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
