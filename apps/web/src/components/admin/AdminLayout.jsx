import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { authClient } from '../../lib/authClient';
import { 
    FiHome, 
    FiFolder, 
    FiBriefcase, 
    FiFileText, 
    FiMessageSquare, 
    FiInbox, 
    FiImage, 
    FiSettings, 
    FiUsers,
    FiLayers,
    FiLogOut, 
    FiMenu, 
    FiX,
    FiExternalLink
} from 'react-icons/fi';
import './AdminLayout.css';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        document.title = "Admin CMS — Arsi Karya";
        authClient.getSession()
            .then((data) => {
                if (!data || !data.session) {
                    navigate('/admin/login');
                } else {
                    setSession(data);
                }
            })
            .catch(() => navigate('/admin/login'))
            .finally(() => setLoading(false));
    }, [navigate]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        await authClient.signOut();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#fafafa' }}>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>Checking admin session...</p>
            </div>
        );
    }

    if (!session) return null;

    const isActive = (path) => {
        if (path === '/admin/dashboard' || path === '/admin') {
            return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/admin' || path === '/admin/dashboard') return 'Dashboard Operational';
        if (path.startsWith('/admin/projects')) return path.includes('/new') ? 'Tambah Proyek' : path.includes('/edit') ? 'Edit Proyek' : 'Kelola Proyek';
        if (path.startsWith('/admin/services')) return path.includes('/edit') ? 'Edit Layanan' : path.includes('/new') ? 'Tambah Layanan' : 'Kelola Layanan';
        if (path.startsWith('/admin/articles')) return path.includes('/new') ? 'Tulis Artikel' : path.includes('/edit') ? 'Edit Artikel' : 'Kelola Artikel';
        if (path.startsWith('/admin/testimonials')) return 'Kelola Testimoni';
        if (path.startsWith('/admin/inquiries')) return path.includes('/') && path !== '/admin/inquiries' ? 'Detail Pengajuan' : 'Pengajuan Kerja Sama';
        if (path.startsWith('/admin/media')) return 'Media Library';
        if (path.startsWith('/admin/settings')) return 'Pengaturan Website';
        return 'Admin CMS';
    };

    return (
        <div className="admin-layout">
            {/* Mobile Header / Drawer Toggle */}
            <header className="admin-mobile-bar">
                <div className="admin-brand-mobile">
                    <strong>ARSI KARYA</strong> CMS
                </div>
                <button 
                    className="admin-mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle Navigation"
                >
                    {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </header>

            {/* Sidebar Navigation */}
            <aside className={`admin-sidebar ${mobileOpen ? 'mobile-show' : ''}`} aria-label="Sidebar Navigation">
                <div className="admin-brand">
                    <Link to="/admin/dashboard">
                        <strong>ARSI KARYA</strong> CMS
                    </Link>
                    <span className="brand-badge">ADMIN</span>
                </div>

                <nav className="admin-nav">
                    <Link
                        to="/admin/dashboard"
                        className={`admin-nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                    >
                        <FiHome size={18} />
                        <span>Dashboard</span>
                    </Link>

                    <p className="admin-nav-heading">KONTEN</p>
                    <Link
                        to="/admin/content"
                        className={`admin-nav-link ${isActive('/admin/content') ? 'active' : ''}`}
                    >
                        <FiFolder size={18} />
                        <span>Semua Konten</span>
                    </Link>
                    <Link
                        to="/admin/projects"
                        className={`admin-nav-link ${isActive('/admin/projects') ? 'active' : ''}`}
                    >
                        <FiFolder size={18} />
                        <span>Proyek</span>
                    </Link>
                    <Link
                        to="/admin/services"
                        className={`admin-nav-link ${isActive('/admin/services') ? 'active' : ''}`}
                    >
                        <FiBriefcase size={18} />
                        <span>Layanan</span>
                    </Link>
                    <Link
                        to="/admin/articles"
                        className={`admin-nav-link ${isActive('/admin/articles') ? 'active' : ''}`}
                    >
                        <FiFileText size={18} />
                        <span>Artikel</span>
                    </Link>
                    <Link
                        to="/admin/testimonials"
                        className={`admin-nav-link ${isActive('/admin/testimonials') ? 'active' : ''}`}
                    >
                        <FiMessageSquare size={18} />
                        <span>Testimoni</span>
                    </Link>

                    <p className="admin-nav-heading">LEADS</p>
                    <Link
                        to="/admin/inquiries"
                        className={`admin-nav-link ${isActive('/admin/inquiries') ? 'active' : ''}`}
                    >
                        <FiInbox size={18} />
                        <span>Pengajuan Kerja Sama</span>
                    </Link>

                    <p className="admin-nav-heading">MEDIA</p>
                    <Link
                        to="/admin/media"
                        className={`admin-nav-link ${isActive('/admin/media') ? 'active' : ''}`}
                    >
                        <FiImage size={18} />
                        <span>Media</span>
                    </Link>

                    {/* Show Users management for SUPER_ADMIN */}
                    {(session?.user?.role === 'SUPER_ADMIN' || !session?.user?.role || session?.user?.role === 'SUPER_ADMIN') && (
                        <>
                            <p className="admin-nav-heading">PENGGUNA</p>
                            <Link
                                to="/admin/users"
                                className={`admin-nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                            >
                                <FiUsers size={18} />
                                <span>Kelola Users</span>
                            </Link>
                        </>
                    )}

                    <p className="admin-nav-heading">WEBSITE</p>
                    <Link
                        to="/admin/settings"
                        className={`admin-nav-link ${isActive('/admin/settings') ? 'active' : ''}`}
                    >
                        <FiSettings size={18} />
                        <span>Pengaturan</span>
                    </Link>

                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="admin-nav-link external-link"
                        style={{ marginTop: 'auto' }}
                    >
                        <FiExternalLink size={18} />
                        <span>Lihat Website</span>
                    </a>

                    <button
                        onClick={handleLogout}
                        className="admin-nav-link logout-btn"
                    >
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Mobile backdrop overlay */}
            {mobileOpen && (
                <div 
                    className="admin-sidebar-overlay" 
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="admin-main">
                <header className="admin-header">
                    <h2 className="admin-page-title">{getPageTitle()}</h2>
                    <div className="admin-profile">
                        <span className="admin-user-name">{session?.user?.name || session?.user?.email || 'Admin'}</span>
                        <span className="admin-avatar">{session?.user?.name?.[0]?.toUpperCase() || 'A'}</span>
                    </div>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
