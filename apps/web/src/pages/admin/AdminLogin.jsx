import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from '../../lib/authClient';
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import './AdminLogin.css';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@admin.com');
    const [password, setPassword] = useState('admin123');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authClient.signIn(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError('Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.');
        } finally {
            setLoading(false);
        }
    };

    const handleFillDefaults = () => {
        setEmail('admin@admin.com');
        setPassword('admin123');
        setError('');
    };

    return (
        <div className="admin-login-layout">
            <div className="admin-login-card animate-fade-in">
                <div className="admin-login-header">
                    <span className="admin-login-badge">CMS PORTAL</span>
                    <h2><strong>ARSI KARYA</strong></h2>
                    <p className="text-secondary">Pusat Pengelolaan Website & Konten Resmi</p>
                </div>

                {error && (
                    <div className="login-alert login-alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="login-form-group">
                        <label className="login-form-label">Email Akun Admin</label>
                        <div className="login-input-wrap">
                            <FiMail className="login-input-icon" size={18} />
                            <input 
                                type="email" 
                                className="login-input" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="admin@admin.com" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="login-form-group">
                        <label className="login-form-label">Password Admin</label>
                        <div className="login-input-wrap">
                            <FiLock className="login-input-icon" size={18} />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                className="login-input" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••" 
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
                            disabled={loading}
                        >
                            {loading ? 'Memproses Masuk...' : 'Masuk ke Dashboard'}
                        </button>
                    </div>
                </form>

                {/* Helper Card for Client */}
                <div className="login-help-card">
                    <div className="login-help-header">
                        <FiCheckCircle size={14} color="#059669" />
                        <span>Kredensial Login Default:</span>
                    </div>
                    <div className="login-help-body">
                        <div>Email: <code>admin@admin.com</code></div>
                        <div>Password: <code>admin123</code></div>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleFillDefaults} 
                        className="login-fill-btn"
                    >
                        Isi Otomatis Kredensial
                    </button>
                </div>

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
