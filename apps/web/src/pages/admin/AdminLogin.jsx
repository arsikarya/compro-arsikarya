import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../../lib/authClient';
import './AdminLogin.css';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDirectLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            await authClient.signIn('admin@admin.com', 'admin123');
            navigate('/admin/dashboard');
        } catch {
            navigate('/admin/dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-layout">
            <div className="admin-login-card animate-fade-in" style={{ textAlign: 'center' }}>
                <div className="admin-login-header" style={{ marginBottom: '24px' }}>
                    <h2><strong>ARSI KARYA</strong> CMS</h2>
                    <p className="text-secondary">Kelola Website & Konten Perusahaan</p>
                </div>

                <div style={{ margin: '20px 0 28px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                        Mode akses langsung diaktifkan. Klik tombol di bawah ini untuk langsung masuk ke Dashboard CMS tanpa perlu memasukkan password.
                    </p>
                </div>

                <form onSubmit={handleDirectLogin} className="admin-login-form">
                    <div className="login-actions">
                        <button 
                            type="submit" 
                            className="btn-primary w-full text-center" 
                            disabled={loading}
                            style={{ 
                                padding: '14px 20px', 
                                fontSize: '1rem', 
                                fontWeight: 600, 
                                cursor: 'pointer',
                                background: '#0284c7',
                                borderRadius: '8px'
                            }}
                        >
                            {loading ? 'Memproses Akses...' : '🚀 Langsung Masuk Ke CMS Admin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
