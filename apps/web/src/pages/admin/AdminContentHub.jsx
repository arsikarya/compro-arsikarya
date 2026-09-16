import { Link } from 'react-router-dom';
import { FiHome, FiInfo, FiBriefcase, FiUsers, FiFolder, FiMail, FiSettings } from 'react-icons/fi';

export default function AdminContentHub() {
    const sections = [
        {
            title: 'Halaman Utama (Home)',
            description: 'Kelola banner hero, headline, foto profil, dan tombol CTA utama di beranda.',
            path: '/admin/content/home',
            icon: FiHome,
            color: '#2563eb',
            bgColor: '#eff6ff',
        },
        {
            title: 'Tentang Kami (About)',
            description: 'Kelola profil perusahaan, visi, misi, sertifikasi, serta pencapaian Arsi Karya.',
            path: '/admin/content/about',
            icon: FiInfo,
            color: '#7c3aed',
            bgColor: '#f5f3ff',
        },
        {
            title: 'Layanan (Services)',
            description: 'Kelola daftar layanan utama (Konstruksi, Design & Build, Fabrikasi, Pengadaan Barang).',
            path: '/admin/services',
            icon: FiBriefcase,
            color: '#059669',
            bgColor: '#ecfdf5',
        },
        {
            title: 'Tim & Manajemen (Team)',
            description: 'Kelola profil anggota tim, posisi, foto profil, serta susunan manajemen.',
            path: '/admin/team',
            icon: FiUsers,
            color: '#d97706',
            bgColor: '#fffbeb',
        },
        {
            title: 'Proyek & Portfolio',
            description: 'Kelola portofolio pekerjaan, kategori proyek, lokasi, dan galeri foto.',
            path: '/admin/projects',
            icon: FiFolder,
            color: '#0284c7',
            bgColor: '#f0f9ff',
        },
        {
            title: 'Kontak & Lokasi (Contact)',
            description: 'Kelola nomor telepon, WhatsApp, email, alamat kantor, dan peta Google Maps.',
            path: '/admin/content/contact',
            icon: FiMail,
            color: '#dc2626',
            bgColor: '#fef2f2',
        },
        {
            title: 'Pengaturan Website & SEO',
            description: 'Kelola logo, nama perusahaan, footer copyright, dan SEO metadata default.',
            path: '/admin/settings',
            icon: FiSettings,
            color: '#4b5563',
            bgColor: '#f3f4f6',
        },
    ];

    return (
        <div style={{ padding: '0 0 40px 0' }}>
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>Kelola Konten Website</h3>
                <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                    Pilih bagian konten publik yang ingin Anda sunting secara langsung tanpa mengubah kodingan.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {sections.map((item, index) => {
                    const IconComp = item.icon;
                    return (
                        <div key={index} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'box-shadow 0.2s' }}>
                            <div>
                                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: item.bgColor, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                    <IconComp size={22} />
                                </div>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{item.title}</h4>
                                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.4' }}>{item.description}</p>
                            </div>
                            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Terintegrasi Neon DB</span>
                                <Link
                                    to={item.path}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: item.color, color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}
                                >
                                    Edit Konten →
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
