import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from '../../lib/authClient';
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowLeft, FiShield } from 'react-icons/fi';
import './AdminLogin.css';

export default function AdminLogin() {
    const navigate = useNavigate();

    // Clean inputs: empty by default for security
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Feedback & state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!email.trim() || !password) {
            setError('Email dan password wajib diisi');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authClient.signIn(email.trim(), password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Email atau kata sandi tidak valid');
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
                        PORTAL RESMI
                    </span>
                    <h2><strong>ARSI KARYA</strong></h2>
                    <p className="text-secondary">
                        Pusat Pengelolaan Konten & Administrasi CMS
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="login-alert login-alert-error">
                        {error}
                    </div>
                )}

                {/* Secure Login Form */}
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="login-form-group">
                        <label className="login-form-label">Email Administrator</label>
                        <div className="login-input-wrap">
                            <FiMail className="login-input-icon" size={18} />
                            <input 
                                type="email" 
                                className="login-input" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="nama@email.com" 
                                autoComplete="username"
                                autoFocus
                                required 
                            />
                        </div>
                    </div>

                    <div className="login-form-group">
                        <label className="login-form-label">Kata Sandi</label>
                        <div className="login-input-wrap">
                            <FiLock className="login-input-icon" size={18} />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                className="login-input" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••" 
                                autoComplete="current-password"
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

                    <div className="login-actions">
                        <button 
                            type="submit" 
                            className="btn-login-submit" 
                            disabled={loading || !email.trim() || !password}
                        >
                            {loading ? 'Memverifikasi Kredensial...' : 'Masuk ke Dashboard'}
                        </button>
                    </div>
                </form>

                {/* Footer link */}
                <div className="login-footer">
                    <Link to="/" className="login-back-link">
                        <FiArrowLeft size={14} />
                        <span>Kembali ke Website Utama</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
