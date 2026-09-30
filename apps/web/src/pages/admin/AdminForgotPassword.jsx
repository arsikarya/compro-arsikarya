import { useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../lib/api';
import { FiMail, FiArrowLeft, FiShield, FiCheckCircle } from 'react-icons/fi';
import './AdminLogin.css';

export default function AdminForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail) {
            setError('Masukkan alamat email administrator');
            return;
        }

        setLoading(true);
        try {
            await publicApi.requestPasswordReset?.(cleanEmail);
            setSubmitted(true);
            setSubmittedEmail(cleanEmail);
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
                        {submitted
                            ? 'Instruksi pemulihan telah dikirimkan ke email Anda'
                            : 'Masukkan email terdaftar untuk menerima tautan pemulihan kata sandi'}
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="login-alert login-alert-error">
                        {error}
                    </div>
                )}

                {/* Success View (Email Sent Confirmation Only - No Direct Reset Bypass) */}
                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '10px 0 10px 0' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            margin: '0 auto 16px auto',
                            borderRadius: '50%',
                            background: '#ecfdf5',
                            border: '2px solid #a7f3d0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#059669'
                        }}>
                            <FiMail size={28} />
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
                            Tautan Terkirim ke Email
                        </h3>
                        
                        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                            Tautan pemulihan kata sandi telah dikirim ke:<br />
                            <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{submittedEmail}</strong>
                        </p>

                        <div style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '14px 16px',
                            fontSize: '0.82rem',
                            color: '#64748b',
                            lineHeight: 1.6,
                            textAlign: 'left',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                                <FiCheckCircle size={15} color="#10b981" />
                                <span>Petunjuk Keamanan:</span>
                            </div>
                            1. Buka kotak masuk (inbox) atau folder spam pada email Anda.<br />
                            2. Klik tombol tautan <em>"Atur Ulang Kata Sandi Sekarang"</em> di dalam email.<br />
                            3. Tautan hanya dapat digunakan satu kali dan berlaku selama 1 jam demi keamanan akun Anda.
                        </div>

                        <Link
                            to="/admin/login"
                            className="btn-login-submit"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                width: '100%',
                                marginBottom: '14px'
                            }}
                        >
                            <FiArrowLeft size={16} />
                            <span>Kembali ke Halaman Login</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setSubmitted(false);
                                setEmail('');
                                setError('');
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#64748b',
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                padding: '6px 12px',
                                textDecoration: 'underline'
                            }}
                        >
                            Kirim ulang atau gunakan email lain
                        </button>
                    </div>
                ) : (
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

                        {/* Footer link */}
                        <div className="login-footer" style={{ marginTop: '18px' }}>
                            <Link to="/admin/login" className="login-back-link">
                                <FiArrowLeft size={14} />
                                <span>Kembali ke Halaman Login</span>
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
