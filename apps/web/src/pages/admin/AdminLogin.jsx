import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../../lib/authClient';
import './AdminLogin.css';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [isReset, setIsReset] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authClient.signIn(email, password);
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        alert('Password reset link has been sent to webarsikarya@gmail.com');
        setIsReset(false);
    };

    return (
        <div className="admin-login-layout">
            <div className="admin-login-card animate-fade-in">
                <div className="admin-login-header">
                    <h2><strong>ARSI KARYA</strong> CMS</h2>
                    <p className="text-secondary">Manage your company website</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(255,59,48,0.1)', color: '#ff3b30', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                {!isReset ? (
                    <form onSubmit={handleLogin} className="admin-login-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-input" placeholder="webarsikarya@gmail.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-input" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <div className="login-actions">
                            <button type="submit" className="btn-primary w-full text-center" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                            <button type="button" className="btn-link" onClick={() => setIsReset(true)}>
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="admin-login-form">
                        <p className="reset-desc">
                            Enter your email Address. We will send a reset link to your registered email (webarsikarya@gmail.com).
                        </p>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" className="form-input" placeholder="webarsikarya@gmail.com" required />
                        </div>

                        <div className="login-actions">
                            <button type="submit" className="btn-primary w-full text-center">Reset Password</button>
                            <button type="button" className="btn-link" onClick={() => setIsReset(false)}>
                                &larr; Back to Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
