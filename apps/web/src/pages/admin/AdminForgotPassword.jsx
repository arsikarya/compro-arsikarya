import { useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../lib/api';
import './AdminLogin.css';

export default function AdminForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [devUrl, setDevUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setDevUrl('');
        if (!email) {
            setError('Masukkan alamat email Anda');
            return;
        }

        setLoading(true);
        try {
            const res = await publicApi.requestPasswordReset?.(email);
            setMessage(res?.message || 'Instruksi reset kata sandi telah dikirimkan jika email terdaftar.');
            if (res?.devResetUrl) {
                setDevUrl(res.devResetUrl);
            }
        } catch (err) {
            setError(err?.message || 'Gagal mengirim instruksi reset kata sandi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h2>Lupa Kata Sandi</h2>
                    <p>Masukkan email terdaftar untuk menerima tautan reset kata sandi</p>
                </div>

                {error && <div className="admin-login-error">{error}</div>}
                {message && <div style={{ padding: '12px', background: '#e6f4ea', color: '#137333', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>{message}</div>}
                {devUrl && (
                    <div style={{ padding: '12px', background: '#fff8e1', color: '#b78103', borderRadius: '6px', fontSize: '0.8rem', wordBreak: 'break-all', marginBottom: '16px' }}>
                        <strong>Dev Link:</strong> <a href={devUrl}>{devUrl}</a>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <label>Alamat Email Admin</label>
                        <input
                            type="email"
                            placeholder="webarsikarya@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
                    <Link to="/admin/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
                        ← Kembali ke Halaman Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
