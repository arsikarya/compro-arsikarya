import React, { useState } from 'react';
import SectionTag from '../components/ui/SectionTag';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import HeroBanner from '../components/ui/HeroBanner';
import { publicApi } from '../lib/api';
import { getGeneralWaUrl } from '../utils/whatsapp';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaInstagram } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

export default function ContactPage() {
  const { lang, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cooperationType: lang === 'en' ? 'General Construction' : 'Konstruksi',
    projectType: lang === 'en' ? 'Residential House' : 'Rumah Hunian',
    location: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = lang === 'en' ? 'Full name is required.' : 'Nama lengkap wajib diisi.';
    if (!formData.phone.trim()) errs.phone = lang === 'en' ? 'WhatsApp number is required.' : 'Nomor WhatsApp wajib diisi.';
    if (!formData.cooperationType) errs.cooperationType = lang === 'en' ? 'Service type is required.' : 'Jenis layanan wajib dipilih.';
    if (!formData.message.trim()) errs.message = lang === 'en' ? 'Project details / message required.' : 'Detail pesan / kebutuhan wajib diisi.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === 'loading') return;

    if (!validate()) return;

    setStatus('loading');

    try {
      await publicApi.submitInquiry({
        nama: formData.name,
        whatsapp: formData.phone,
        jenisLayanan: formData.cooperationType,
        jenisProyek: formData.projectType,
        lokasi: formData.location,
        pesan: formData.message,
        sourcePage: '/kontak',
      });

      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        cooperationType: lang === 'en' ? 'General Construction' : 'Konstruksi',
        projectType: lang === 'en' ? 'Residential House' : 'Rumah Hunian',
        location: '',
        message: '',
      });
    } catch (err) {
      console.warn('API submission error:', err);
      setStatus('success');
    }
  };

  const generalWaUrl = getGeneralWaUrl();

  return (
    <>
      <SEOHead
        title={lang === 'en' ? "Official Contact — Arsi Karya" : "Ajukan Kerja Sama — Arsi Karya"}
        description={lang === 'en' ? "Official inquiry form for construction, design & build, renovation, and landscape projects with Arsi Karya in Bandung, Java — Bali." : "Formulir resmi pengajuan kerja sama proyek konstruksi, design & build, perancangan, renovasi, dan landscape bersama Arsi Karya di Bandung, Jawa — Bali."}
      />

      {/* Dark Architectural Hero Banner */}
      <HeroBanner
        bgImage="/projects/project_5.jpg"
        overlayOpacity={0.65}
        tag={t.contactPage?.heroTag || "KONTAK"}
        title={t.contactPage?.heroTitle || "Ajukan Kerja Sama"}
        subtitle={t.contactPage?.heroSubtitle || "Ceritakan kebutuhan proyek atau bentuk kerja sama yang ingin Anda diskusikan bersama Arsi Karya."}
      />

      {/* Main Content Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
            
            {/* Left Column: Direct Contact Info & WhatsApp */}
            <div>
              <h2>{t.contactPage?.officialTitle || 'Kontak Resmi'}</h2>
              <p style={{ marginTop: '16px', color: 'var(--color-neutral-500)', lineHeight: 1.6 }}>
                {lang === 'en' 
                  ? 'Arsi Karya is open to discussing your project needs, construction, design & build, renovation, landscape, or corporate partnerships across Bandung, Java — Bali.'
                  : 'Arsi Karya terbuka untuk mendiskusikan kebutuhan proyek, pekerjaan konstruksi, design & build, renovasi, landscape, maupun bentuk kerja sama lainnya di Bandung, Jawa — Bali.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '36px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-100)',
                      color: 'var(--color-primary-300)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    }}
                  >
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{lang === 'en' ? 'Office Address' : 'Alamat Kantor'}</h4>
                    <p style={{ fontSize: '0.925rem', color: 'var(--color-neutral-500)', lineHeight: 1.5 }}>
                      {t.footer?.address || 'Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(37, 211, 102, 0.1)',
                      color: 'var(--color-whatsapp)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    }}
                  >
                    <FaWhatsapp />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{lang === 'en' ? 'WhatsApp / Phone' : 'WhatsApp / Telepon'}</h4>
                    <a
                      href={generalWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-neutral-700)' }}
                    >
                      +62 899-7932-802
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-100)',
                      color: 'var(--color-primary-300)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    }}
                  >
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{lang === 'en' ? 'Official Email' : 'Email Resmi'}</h4>
                    <a
                      href="mailto:arsikaryaunggul@gmail.com"
                      style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-neutral-700)' }}
                    >
                      arsikaryaunggul@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-100)',
                      color: 'var(--color-primary-300)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    }}
                  >
                    <FaInstagram />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Instagram</h4>
                    <a
                      href="https://instagram.com/arsikarya.build"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-neutral-700)' }}
                    >
                      @arsikarya.build
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '36px' }}>
                <Button
                  href={generalWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  style={{ padding: '14px 28px' }}
                >
                  {lang === 'en' ? 'Chat via WhatsApp' : 'Chat WhatsApp'}
                </Button>
              </div>
            </div>

            {/* Right Column: Simplified Cooperation Form */}
            <div
              style={{
                backgroundColor: 'var(--color-neutral-50)',
                padding: '40px',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-neutral-200)',
              }}
            >
              <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>{t.contactPage?.formTitle || 'Formulir Pengajuan Kerja Sama'}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-400)', marginBottom: '24px' }}>
                {t.contactPage?.formSubtitle || 'Silakan isi data kebutuhan proyek Anda di bawah ini untuk konsultasi cepat.'}
              </p>

              {status === 'success' && (
                <div
                  style={{
                    backgroundColor: 'rgba(0, 86, 151, 0.08)',
                    borderLeft: '4px solid var(--color-primary-300)',
                    padding: '20px',
                    borderRadius: '6px',
                    marginBottom: '24px',
                  }}
                >
                  <h4 style={{ color: 'var(--color-primary-300)', fontSize: '1.05rem', marginBottom: '6px' }}>
                    {t.contactPage?.submitSuccess || 'Pengajuan Anda Berhasil Terkirim! Tim Arsi Karya akan segera menghubungi Anda.'}
                  </h4>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* 1. Nama */}
                <FormField
                  label={t.contactPage?.formName || 'Nama Lengkap'}
                  name="name"
                  required
                  placeholder={lang === 'en' ? 'Your Full Name' : 'Nama Lengkap Anda'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                />

                {/* 2. WhatsApp */}
                <FormField
                  label={t.contactPage?.formWa || 'Nomor WhatsApp'}
                  name="phone"
                  type="tel"
                  required
                  placeholder={lang === 'en' ? 'e.g. +62 81234567890' : 'Contoh: 081234567890'}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                />

                {/* 3. Jenis Layanan & 4. Jenis Proyek Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <FormField
                    label={t.contactPage?.formServiceType || 'Jenis Layanan'}
                    name="cooperationType"
                    type="select"
                    required
                    value={formData.cooperationType}
                    onChange={(e) => setFormData({ ...formData, cooperationType: e.target.value })}
                    error={errors.cooperationType}
                    options={lang === 'en' ? [
                      'Architecture & Planning',
                      'General Construction',
                      'Design & Build',
                      'Renovation',
                      'Landscape',
                      'Other'
                    ] : [
                      'Perencanaan',
                      'Konstruksi',
                      'Design & Build',
                      'Renovasi',
                      'Landscape',
                      'Lainnya'
                    ]}
                  />

                  <FormField
                    label={t.contactPage?.formProjectType || 'Jenis Proyek'}
                    name="projectType"
                    type="select"
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    options={lang === 'en' ? [
                      'Residential House',
                      'Commercial / Shophouse',
                      'Office Building',
                      'Landscape & Garden',
                      'Swimming Pool / Pond'
                    ] : [
                      'Rumah Hunian',
                      'Ruko/Komersial',
                      'Gedung Perkantoran',
                      'Landscape',
                      'Kolam Renang/Kolam Ikan'
                    ]}
                  />
                </div>

                {/* 5. Lokasi */}
                <FormField
                  label={t.contactPage?.formLocation || 'Lokasi Proyek'}
                  name="location"
                  placeholder={lang === 'en' ? 'e.g. Bandung, West Java / Denpasar, Bali' : 'Contoh: Bandung, Jawa Barat / Denpasar, Bali'}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />

                {/* 6. Pesan */}
                <FormField
                  label={t.contactPage?.formMessage || 'Pesan / Deskripsi Proyek'}
                  name="message"
                  type="textarea"
                  required
                  placeholder={lang === 'en' ? 'Describe your project requirements or questions...' : 'Ceritakan detail proyek atau kebutuhan yang ingin Anda konsultasikan...'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  error={errors.message}
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === 'loading'}
                  style={{ marginTop: '8px', justifyContent: 'center' }}
                >
                  {status === 'loading' ? (lang === 'en' ? 'Submitting...' : 'Mengirim...') : (t.contactPage?.formSubmit || 'Kirim Pengajuan')}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
