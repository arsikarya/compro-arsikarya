import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../lib/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Gallery from '../components/ui/Gallery';
import CTA from '../components/CTA';
import { getProjectsData } from '../data/projectsData';
import { useLanguage } from '../context/LanguageContext';
import './ProjectDetail.css';

export default function ProjectDetail() {
    const { slug } = useParams();
    const { lang, t } = useLanguage();
    const projectsData = getProjectsData(lang);

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        publicApi.getProject(slug)
            .then((data) => {
                if (data) setProject(data);
            })
            .catch(() => {
                const fallback = projectsData.find(p => p.slug === slug || p.id === slug);
                if (fallback) setProject(fallback);
            })
            .finally(() => setLoading(false));
    }, [slug, lang]);

    if (loading) return <LoadingSpinner />;

    const currentProject = project || projectsData.find(p => p.slug === slug || p.id === slug);

    if (!currentProject) {
        return (
            <div className="container" style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center' }}>
                <h2>{lang === 'en' ? 'Project Not Found' : 'Proyek Tidak Ditemukan'}</h2>
                <p className="text-secondary">{lang === 'en' ? 'The project you are looking for is unavailable.' : 'Proyek yang Anda cari tidak tersedia atau belum diterbitkan.'}</p>
                <Link to="/proyek" className="btn-base btn-primary" style={{ marginTop: '24px' }}>
                    {t.projectDetail?.backBtn || '← Kembali ke Proyek'}
                </Link>
            </div>
        );
    }

    const coverImg = currentProject.coverImageUrl || currentProject.thumbnail || '/projects/project_1.jpg';
    const galleryList = Array.isArray(currentProject.gallery) && currentProject.gallery.length > 0 
        ? currentProject.gallery.map(g => typeof g === 'string' ? g : g.url) 
        : [coverImg];

    const renderRichTextContent = () => {
        const raw = (lang === 'en' ? currentProject.descriptionEn : currentProject.description) || currentProject.description || '';
        const isHtml = /<[a-z][\s\S]*>/i.test(raw);

        if (isHtml) {
            return <div className="rich-text-block w-richtext" dangerouslySetInnerHTML={{ __html: raw }} />;
        }

        return (
            <div className="rich-text-block w-richtext">
                <p>{raw}</p>
                {currentProject.scope && (
                    <>
                        <h3>{lang === 'en' ? 'Technical Scope & Specifications' : 'Ruang Lingkup Teknis & Spesifikasi'}</h3>
                        <p>{lang === 'en' ? (currentProject.scopeEn || currentProject.scope) : currentProject.scope}</p>
                    </>
                )}
                {currentProject.process && (
                    <>
                        <h3>{lang === 'en' ? 'Execution Methodology & Work Stages' : 'Metodologi Eksekusi & Tahapan Pengerjaan'}</h3>
                        <p>{lang === 'en' ? (currentProject.processEn || currentProject.process) : currentProject.process}</p>
                    </>
                )}
                {currentProject.features && currentProject.features.length > 0 && (
                    <>
                        <h3>{t.projectDetail?.features || (lang === 'en' ? 'Key Advantages & Work Features' : 'Keunggulan & Fitur Utama Pekerjaan')}</h3>
                        <ul role="list">
                            {(lang === 'en' ? (currentProject.featuresEn || currentProject.features) : currentProject.features).map((feat, idx) => (
                                <li key={idx}>{feat}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Helmet>
                <title>{(lang === 'en' ? (currentProject.titleEn || currentProject.title) : currentProject.title)} — Arsi Karya</title>
                <meta name="description" content={currentProject.seoDescription || currentProject.description} />
            </Helmet>

            {/* Albion Top Cover Image (Full Width Banner) */}
            <div style={{ width: '100%', marginTop: '80px', overflow: 'hidden' }}>
                <img 
                    src={coverImg} 
                    alt={currentProject.title} 
                    style={{
                        width: '100%',
                        maxHeight: '520px',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />
            </div>

            <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)', paddingTop: '48px' }}>
                <div className="container" style={{ maxWidth: '980px' }}>
                    
                    {/* Top Back Navigation */}
                    <Link 
                        to="/proyek" 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            marginBottom: '24px', 
                            color: 'var(--color-primary-300)', 
                            fontWeight: 700, 
                            fontSize: '0.9rem',
                            textDecoration: 'none'
                        }}
                    >
                        {t.projectDetail?.backBtn || '← Kembali ke Proyek'}
                    </Link>

                    {/* Title Header */}
                    <div style={{ marginBottom: '32px' }}>
                        <h1 
                            style={{ 
                                fontSize: 'clamp(2.1rem, 3.8vw, 3.0rem)', 
                                fontWeight: 800, 
                                color: 'var(--color-neutral-700)', 
                                lineHeight: 1.28, 
                                marginTop: '8px',
                                letterSpacing: '-0.02em' 
                            }}
                        >
                            {lang === 'en' ? (currentProject.titleEn || currentProject.title) : currentProject.title}
                        </h1>
                    </div>

                    {/* Project Specification Metadata Panel */}
                    <div 
                        style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                            gap: '24px', 
                            backgroundColor: 'var(--color-neutral-50)', 
                            padding: '28px 32px', 
                            borderRadius: 'var(--radius-card)', 
                            border: '1px solid var(--color-neutral-200)',
                            marginBottom: '48px'
                        }}
                    >
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{t.projectDetail?.category || 'Jenis Proyek'}</span>
                            <div style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--color-neutral-700)', marginTop: '4px' }}>{(lang === 'en' ? (currentProject.categoryEn || currentProject.category) : currentProject.category) || '-'}</div>
                        </div>

                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{t.projectDetail?.location || 'Lokasi'}</span>
                            <div style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--color-neutral-700)', marginTop: '4px' }}>{currentProject.location || '-'}</div>
                        </div>

                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{t.projectDetail?.year || 'Tahun'}</span>
                            <div style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--color-neutral-700)', marginTop: '4px' }}>{currentProject.year || '-'}</div>
                        </div>

                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{lang === 'en' ? 'Client / Project Owner' : 'Pemberi Kerja / Klien'}</span>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-neutral-700)', marginTop: '4px' }}>
                                {currentProject.clientContext || currentProject.companyListed || currentProject.company || 'Arsi Karya'}
                            </div>
                        </div>

                        {(currentProject.arsiKaryaRole || currentProject.roleDisclosure) && (
                            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--color-neutral-200)', paddingTop: '16px', marginTop: '4px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-300)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>{t.projectDetail?.company || 'Peran Resmi Arsi Karya'}</span>
                                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-neutral-700)', marginTop: '4px' }}>
                                    {currentProject.arsiKaryaRole || currentProject.roleDisclosure}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Rich Text Editorial Block */}
                    {renderRichTextContent()}

                    {/* Gallery Component */}
                    {galleryList.length > 0 && (
                        <div style={{ marginTop: '48px', marginBottom: '60px' }}>
                            <Gallery images={galleryList} title={lang === 'en' ? 'Visual Documentation & Site Photos' : 'Dokumentasi Visual & Foto Lapangan'} />
                        </div>
                    )}
                </div>
            </section>

            {/* Albion CTA Section at bottom */}
            <CTA />
        </motion.div>
    );
}
