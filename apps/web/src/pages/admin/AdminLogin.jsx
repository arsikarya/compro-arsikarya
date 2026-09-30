import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from '../../lib/authClient';
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowLeft, FiCheckCircle, FiShield, FiKey, FiRefreshCw } from 'react-icons/fi';
import './AdminLogin.css';

export default function AdminLogin() {
    const navigate = useNavigate();
    
    // Step state: 'credentials' | 'otp'
    const [step, setStep] = useState('credentials');
    
    // Credentials
    const [email, setEmail] = useState('webarsikarya@gmail.com');
    const [password, setPassword] = useState('Bandung123!');
    const [showPassword, setShowPassword] = useState(false);
    
    // OTP state
    const [otp, setOtp] = useState('');
    const [devOtp, setDevOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    
    // Loading & Feedback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Timer countdown for OTP resend
    useEffect(() => {
        let interval = null;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [step, timer]);

    // Handle Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const res = await authClient.requestOtp(email, password);
            setStep('otp');
            setDevOtp(res?.devOtp || '');
            setTimer(60);
            setCanResend(false);
            setSuccessMsg(res?.message || `Kode verifikasi telah dikirim ke ${email}`);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        if (!otp || otp.trim().length < 6) {
            setError('Masukkan 6 digit kode verifikasi');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authClient.verifyOtp(email, otp);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('OTP verification error:', err);
            setError(err.message || 'Kode verifikasi salah atau telah kedaluwarsa.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Resend OTP
    const handleResendOtp = async () => {
        if (!canResend || loading) return;
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const res = await authClient.resendOtp(email);
            setDevOtp(res?.devOtp || '');
            setTimer(60);
            setCanResend(false);
            setSuccessMsg(`Kode baru telah dikirimkan ke ${email}`);
        } catch (err) {
            setError(err.message || 'Gagal mengirim ulang kode verifikasi');
        } finally {
            setLoading(false);
        }
    };

    const handleFillDefaults = () => {
        setEmail('webarsikarya@gmail.com');
        setPassword('Bandung123!');
        setError('');
    };

    return (
        <div className="admin-login-layout">
            <div className="admin-login-card animate-fade-in">
                {/* Header */}
                <div className="admin-login-header">
                    <span className="admin-login-badge">
                        {step === 'otp' ? 'VERIFIKASI 2FA' : 'CMS PORTAL'}
                    </span>
                    <h2><strong>ARSI KARYA</strong></h2>
                    <p className="text-secondary">
                        {step === 'otp' 
                            ? 'Masukkan Kode Verifikasi Keamanan' 
                            : 'Pusat Pengelolaan Website & Konten Resmi'}
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="login-alert login-alert-error">
                        {error}
                    </div>
                )}

                {/* Success Banner */}
                {successMsg && (
                    <div className="login-dev-banner" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FiCheckCircle size={15} color="#16a34a" />
                            <span>{successMsg}</span>
                        </div>
                    </div>
                )}

                {/* Dev OTP Helper Banner if email not sent / dev mode */}
                {step === 'otp' && devOtp && (
                    <div className="login-dev-banner">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <FiKey size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <div>
                                <strong>Kode OTP Anda:</strong>{' '}
                                <code style={{ fontSize: '1.05rem', fontWeight: 800, background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', letterSpacing: '2px' }}>
                                    {devOtp}
                                </code>
                                <div style={{ fontSize: '0.76rem', color: '#065f46', marginTop: '4px' }}>
                                    (Pengiriman email gratis ke inbox Gmail aktif saat <code>SMTP_PASS</code> dikonfigurasi).
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 1: Credentials Form */}
                {step === 'credentials' && (
                    <form onSubmit={handleRequestOtp} className="admin-login-form">
                        <div className="login-form-group">
                            <label className="login-form-label">Email Akun Admin</label>
                            <div className="login-input-wrap">
                                <FiMail className="login-input-icon" size={18} />
                                <input 
                                    type="email" 
                                    className="login-input" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="webarsikarya@gmail.com" 
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
                                {loading ? 'Memeriksa Kredensial...' : 'Lanjut & Kirim Kode Verifikasi'}
                            </button>
                        </div>

                        {/* Helper Card with official credentials */}
                        <div className="login-help-card">
                            <div className="login-help-header">
                                <FiShield size={14} color="#059669" />
                                <span>Akun Admin Resmi:</span>
                            </div>
                            <div className="login-help-body">
                                <div>Email: <code>webarsikarya@gmail.com</code></div>
                                <div>Password: <code>Bandung123!</code></div>
                            </div>
                            <button 
                                type="button" 
                                onClick={handleFillDefaults} 
                                className="login-fill-btn"
                            >
                                Isi Otomatis Kredensial
                            </button>
                        </div>
                    </form>
                )}

                {/* STEP 2: OTP Verification Form */}
                {step === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="admin-login-form">
                        <div className="login-form-group" style={{ textAlign: 'center' }}>
                            <label className="login-form-label" style={{ display: 'block', marginBottom: '8px' }}>
                                Masukkan 6 Digit Kode OTP
                            </label>
                            <input 
                                type="text" 
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                className="login-otp-input" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                                placeholder="••••••" 
                                autoFocus
                                required 
                            />
                        </div>

                        <div className="login-actions">
                            <button 
                                type="submit" 
                                className="btn-login-submit" 
                                disabled={loading || otp.length < 6}
                            >
                                {loading ? 'Memverifikasi Kode...' : 'Verifikasi & Masuk ke Dashboard'}
                            </button>
                        </div>

                        <div className="login-resend-wrap">
                            <button 
                                type="button" 
                                className="btn-back-step"
                                onClick={() => {
                                    setStep('credentials');
                                    setError('');
                                    setSuccessMsg('');
                                }}
                            >
                                &larr; Ganti Email / Password
                            </button>

                            <button 
                                type="button" 
                                className="btn-resend-link"
                                onClick={handleResendOtp}
                                disabled={!canResend || loading}
                            >
                                {canResend ? (
                                    <span>Kirim Ulang Kode</span>
                                ) : (
                                    <span>Kirim ulang ({timer}s)</span>
                                )}
                            </button>
                        </div>
                    </form>
                )}

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
