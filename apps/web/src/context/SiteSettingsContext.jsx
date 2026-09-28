import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { publicApi } from '../lib/api';

const DEFAULT_SETTINGS = {
  companyName: 'Arsi Karya',
  tagline: 'Membangun Tuntas, Unggul Dalam Kualitas',
  phone: '+62 899-7932-802',
  whatsapp: '+62 899-7932-802',
  email: 'webarsikarya@gmail.com',
  address: 'Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung.',
  instagram: 'arsikarya.build',
  logoUrl: '',
  stat1Value: '100+',
  stat1Label: 'PROYEK SELESAI',
  stat2Value: '100%',
  stat2Label: 'KOMITMEN MUTU',
  stat3Value: '4',
  stat3Label: 'LAYANAN SPESIALIS',
  whatsappCtaText: 'Halo Arsi Karya, saya ingin berkonsultasi terkait kebutuhan proyek saya. Mohon informasi dan arahan mengenai langkah yang perlu saya siapkan.',
};

const SiteSettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: false,
  refreshSettings: () => {},
  getWaUrl: () => '',
});

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await publicApi.getSettings();
      if (data && typeof data === 'object') {
        setSettings((prev) => ({
          ...prev,
          ...data,
          stat1Value: data.stat1Value || prev.stat1Value,
          stat1Label: data.stat1Label || prev.stat1Label,
          stat2Value: data.stat2Value || prev.stat2Value,
          stat2Label: data.stat2Label || prev.stat2Label,
          stat3Value: data.stat3Value || prev.stat3Value,
          stat3Label: data.stat3Label || prev.stat3Label,
          whatsappCtaText: data.whatsappCtaText || prev.whatsappCtaText,
        }));
      }
    } catch (err) {
      console.warn('Using default site settings fallback:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getWaUrl = useCallback((customMsg) => {
    const rawNumber = settings.whatsapp || '+62 899-7932-802';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const message = customMsg || settings.whatsappCtaText || DEFAULT_SETTINGS.whatsappCtaText;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }, [settings.whatsapp, settings.whatsappCtaText]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, getWaUrl }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
