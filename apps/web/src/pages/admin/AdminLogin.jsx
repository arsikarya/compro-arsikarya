import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from '../../lib/authClient';
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowLeft, FiShield, FiKey } from 'react-icons/fi';
import './AdminLogin.css';

export default function AdminLogin() {
    const navigate = useNavigate();

    // Step state: 'credentials' | 'otp'
    const [step, setStep] = useState('credentials');

    // Clean inputs: empty by default for security
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // OTP state
    const [otp, setOtp] = useState('');
    const [devOtp, setDevOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Loading & feedback
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

    // Step 1: Request OTP with Email & Password
    const handleRequestOtp = async (e) => {
        if (e) e.preventDefault();
        if (!email.trim() || !password) {
            setError('Email dan kata sandi wajib diisi');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const res = await authClient.requestOtp(email.trim(), password);
            setStep('otp');
            setDevOtp(res?.devOtp || '');
            setTimer(60);
            setCanResend(false);
            setSuccessMsg(res?.message || `Kode verifikasi telah dikirim ke ${email}`);
        } catch (err) {
            console.error('Request OTP error:', err);
            setError(err.message || 'Email atau kata sandi tidak valid');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        if (!otp || otp.trim().length < 6) {
            setError('Masukkan 6 digit kode OTP verifikasi');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authClient.verifyOtp(email.trim(), otp.trim());
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Verify OTP error:', err);
            setError(err.message || 'Kode verifikasi salah atau telah kedaluwarsa');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (!canResend || loading) return;
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const res = await authClient.resendOtp(email.trim());
            setDevOtp(res?.devOtp || '');
            setTimer(60);
            setCanResend(false);
            setSuccessMsg(`Kode baru telah dikirim ke ${email}`);
        } catch (err) {
            setError(err.message || 'Gagal mengirim ulang kode');
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
                        {step === 'otp' ? 'VERIFIKASI 2FA OTP' : 'PORTAL RESMI'}
                    </span>
                    <h2><strong>ARSI KARYA</strong></h2>
                    <p className="text-secondary">
                        {step === 'otp' 
                            ? `Masukkan kode yang dikirim ke ${email}` 
                            : 'Pusat Pengelolaan Konten & Administrasi CMS'}
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
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
                        {successMsg}
                    </div>
                )}

                {/* STEP 1: Email & Password Form */}
                {step === 'credentials' && (
                    <form onSubmit={handleRequestOtp} className="admin-login-form">
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
                                {loading ? 'Memeriksa & Mengirim OTP...' : 'Lanjut & Kirim Kode ke Email'}
                            </button>
                        </div>
                    </form>
                )}

                {/* STEP 2: 6-Digit OTP Form */}
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
                                    setOtp('');
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
