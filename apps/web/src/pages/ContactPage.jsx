import React, { useState } from 'react';
import SectionTag from '../components/ui/SectionTag';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import HeroBanner from '../components/ui/HeroBanner';
import { publicApi } from '../lib/api';
import { getGeneralWaUrl } from '../utils/whatsapp';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaInstagram } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
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
  const [submitError, setSubmitError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

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
    setSubmitError('');

    try {
      await publicApi.submitInquiry({
        nama: formData.name.trim(),
        whatsapp: formData.phone.trim(),
        email: '-',
        jenisKerjasama: formData.cooperationType,
        jenisLayanan: formData.cooperationType,
        jenisProyek: formData.projectType,
        lokasi: formData.location.trim(),
        pesan: formData.message.trim(),
        sourcePage: '/kontak',
      });

      setSubmittedData({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        service: formData.cooperationType,
        project: formData.projectType,
      });

      setStatus('success');
    } catch (err) {
      console.error('API submission error:', err);
      setStatus('error');
      setSubmitError(
        lang === 'en'
          ? (err.message || 'Failed to submit inquiry. Please try again or contact us directly via WhatsApp.')
          : (err.message || 'Gagal mengirim pengajuan formulir. Silakan coba beberapa saat lagi atau hubungi via WhatsApp.')
      );
    }
  };

  const generalWaUrl = getGeneralWaUrl();

  return (
    <>
      <SEOHead
        title={lang === 'en' ? "Contact Arsi Karya — Construction & Home Contractor Bandung & Bali" : "Kontak & Konsultasi Bangun Rumah — Arsi Karya Bandung & Bali"}
        description={lang === 'en' ? "Consult your house construction, luxury villa, renovation, and architectural design project with Arsi Karya in Bandung and Bali. Fast response via WhatsApp." : "Konsultasikan kebutuhan bangun rumah, villa, renovasi, dan design & build Anda bersama tim ahli Arsi Karya Bandung & Bali. Respon cepat via WhatsApp."}
        keywords="kontak kontraktor bandung, konsultasi bangun rumah bandung, kontak kontraktor bali, biaya bangun rumah bandung, kontraktor arsi karya whatsapp"
      />

      {/* Dark Architectural Hero Banner */}
      <HeroBanner
        bgImage="/images/contact-hero.jpg"
        overlayOpacity={0.65}
        tag={t.contactPage?.heroTag || "KONTAK"}
        title={t.contactPage?.heroTitle || "Ajukan Kerja Sama"}
        subtitle={t.contactPage?.heroSubtitle || "Ceritakan kebutuhan proyek atau bentuk kerja sama yang ingin Anda diskusikan bersama Arsi Karya."}
      />

      {/* Main Content Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-neutral-0)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
            
            {/* Left Column: Direct Contact Info, Google Maps & WhatsApp */}
            <div>
              <h2>{t.contactPage?.officialTitle || 'Kontak Resmi'}</h2>

              {/* Google Maps Location Embed */}
              <div
                style={{
                  marginTop: '24px',
                  marginBottom: '28px',
                  borderRadius: 0,
                  border: '1px solid var(--color-neutral-200)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  height: '250px',
                  backgroundColor: '#f1f5f9',
                }}
              >
                <iframe
                  src="https://maps.google.com/maps?q=PT+Arsi+Karya+Unggul%2C+Jl.+Tulip+VII+No.21%2C+Rancabolang%2C+Kec.+Gedebage%2C+Kota+Bandung&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  title="Lokasi PT Arsi Karya Unggul di Google Maps"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* 2-Column Contact Info Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '24px 20px',
                  marginTop: '24px',
                }}
              >
                {/* 1. Alamat Kantor */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-100)',
                      color: 'var(--color-primary-300)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem',
                      flexShrink: 0,
                    }}
                  >
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{lang === 'en' ? 'Office Address' : 'Alamat Kantor'}</h4>
                    <a
                      href="https://maps.app.goo.gl/p3R2LS88sWNrNqGx7"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', lineHeight: 1.5, textDecoration: 'none', display: 'block' }}
                    >
                      {t.footer?.address || 'Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung.'}
                    </a>
                  </div>
                </div>

                {/* 2. WhatsApp / Telepon */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(37, 211, 102, 0.1)',
                      color: 'var(--color-whatsapp)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem',
                      flexShrink: 0,
                    }}
                  >
                    <FaWhatsapp />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{lang === 'en' ? 'WhatsApp / Phone' : 'WhatsApp / Telepon'}</h4>
                    <a
                      href={generalWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700)', textDecoration: 'none' }}
                    >
                      +62 899-7932-802
                    </a>
                  </div>
                </div>

                {/* 3. Email Resmi */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-100)',
                      color: 'var(--color-primary-300)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem',
                      flexShrink: 0,
                    }}
                  >
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{lang === 'en' ? 'Official Email' : 'Email Resmi'}</h4>
                    <a
                      href="mailto:arsikaryaunggul@gmail.com"
                      style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700)', textDecoration: 'none', wordBreak: 'break-all' }}
                    >
                      arsikaryaunggul@gmail.com
                    </a>
                  </div>
                </div>

                {/* 4. Instagram */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-100)',
                      color: 'var(--color-primary-300)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem',
                      flexShrink: 0,
                    }}
                  >
                    <FaInstagram />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Instagram</h4>
                    <a
                      href="https://instagram.com/arsikarya.build"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700)', textDecoration: 'none' }}
                    >
                      @arsikarya.build
                    </a>
                  </div>
                </div>
              {/* Contact Info Items without bottom WhatsApp button */}
              </div>
            </div>

            {/* Right Column: Simplified Cooperation Form / Success State */}
            <div
              style={{
                backgroundColor: 'var(--color-neutral-50)',
                padding: '40px',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-neutral-200)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '480px',
              }}
            >
              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '16px 0', animation: 'fadeIn 0.5s ease' }}>
                  <style>{`
                    @keyframes fadeIn {
                      from { opacity: 0; transform: translateY(14px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>

                  {/* Checklist Icon */}
                  <div
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      border: '2px solid #a7f3d0',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px auto',
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)',
                    }}
                  >
                    <FiCheck size={44} strokeWidth={2.5} />
                  </div>

                  {/* Success Title */}
                  <h3
                    style={{
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '12px',
                      lineHeight: 1.3,
                    }}
                  >
                    {lang === 'en' ? 'Inquiry Successfully Submitted!' : 'Pengajuan Berhasil Terkirim!'}
                  </h3>

                  {/* Professional & Reassuring Copywriting */}
                  <p
                    style={{
                      fontSize: '0.98rem',
                      color: 'var(--color-neutral-600)',
                      lineHeight: 1.7,
                      marginBottom: '26px',
                    }}
                  >
                    {lang === 'en'
                      ? `Thank you${submittedData?.name ? `, ${submittedData.name}` : ''}. Your cooperation proposal has been safely received by the Arsi Karya system. Our planning and engineering team will review your project details and get in touch with you via WhatsApp (${submittedData?.phone || ''}) within a maximum of 1×24 hours.`
                      : `Terima kasih${submittedData?.name ? `, Bapak/Ibu ${submittedData.name}` : ''}. Data formulir pengajuan kerja sama Anda telah berhasil kami terima dengan aman di sistem Arsi Karya. Tim representatif kami akan segera meninjau detail proyek Anda dan menghubungi Anda melalui WhatsApp (${submittedData?.phone || ''}) dalam waktu maksimal 1×24 jam.`}
                  </p>

                  {/* Submission Summary Badge */}
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      textAlign: 'left',
                      marginBottom: '24px',
                      fontSize: '0.88rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Jenis Layanan:</span>
                      <strong style={{ color: '#0f172a' }}>{submittedData?.service || '-'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Jenis Proyek:</span>
                      <strong style={{ color: '#0f172a' }}>{submittedData?.project || '-'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Status Pengajuan:</span>
                      <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                        Terkirim (Menunggu Respon Tim)
                      </span>
                    </div>
                  </div>

                  {/* Refresh Note */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '0.82rem',
                      color: '#64748b',
                    }}
                  >
                    💡 {lang === 'en'
                      ? 'Need to submit another inquiry? Please refresh this web page.'
                      : 'Perlu mengirimkan formulir pengajuan baru? Silakan muat ulang (refresh) halaman website ini.'}
                  </div>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>{t.contactPage?.formTitle || 'Formulir Pengajuan Kerja Sama'}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-400)', marginBottom: '24px' }}>
                    {t.contactPage?.formSubtitle || 'Silakan isi data kebutuhan proyek Anda di bawah ini untuk konsultasi cepat.'}
                  </p>

                  {submitError && (
                    <div
                      style={{
                        backgroundColor: '#fef2f2',
                        borderLeft: '4px solid #ef4444',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        color: '#991b1b',
                        fontSize: '0.88rem',
                      }}
                    >
                      {submitError}
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
                          'Renovation'
                        ] : [
                          'Perencanaan',
                          'Konstruksi',
                          'Design & Build',
                          'Renovasi'
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
                          'Swimming Pool / Pond',
                          'Other'
                        ] : [
                          'Rumah Hunian',
                          'Ruko/Komersial',
                          'Gedung Perkantoran',
                          'Landscape',
                          'Kolam Renang/Kolam Ikan',
                          'Lainnya'
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
                </>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
