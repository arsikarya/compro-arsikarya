export const WA_NUMBER = "628997932802";

export const cleanWaNumber = (num) => {
  if (!num) return WA_NUMBER;
  return num.replace(/[^0-9]/g, '');
};

export const getGeneralWaUrl = (customMsg, customNumber) => {
  const num = cleanWaNumber(customNumber);
  const msg = customMsg || "Halo Arsi Karya, saya ingin berkonsultasi terkait kebutuhan proyek saya. Mohon informasi dan arahan mengenai langkah yang perlu saya siapkan.";
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
};

export const getServiceWaUrl = (serviceName = "Konstruksi", customNumber) => {
  const num = cleanWaNumber(customNumber);
  const msg = `Halo Arsi Karya, saya ingin berkonsultasi mengenai layanan ${serviceName}. Mohon informasi mengenai proses dan langkah selanjutnya.`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
};

export const getProjectWaUrl = (projectName = "Proyek", customNumber) => {
  const num = cleanWaNumber(customNumber);
  const msg = `Halo Arsi Karya, saya tertarik dengan proyek ${projectName} dan ingin mendiskusikan kebutuhan proyek serupa.`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
};
