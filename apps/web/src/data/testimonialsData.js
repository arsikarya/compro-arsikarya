export const testimonialsData = [
  {
    id: 1,
    name: 'Bpk. Erwan',
    nameEn: 'Mr. Erwan',
    role: 'Pemilik Hunian "The Old Heritage"',
    roleEn: 'Owner of "The Old Heritage" Residence',
    content: 'Kerja sama dengan Arsi Karya sangat memuaskan. Dari tahap perencanaan arsitektur hingga eksekusi kayu custom dan struktur beton, semuanya transparan dan tepat waktu.',
    contentEn: 'Working with Arsi Karya was extremely satisfying. From architectural planning to custom wood execution and concrete structure, everything was transparent and on time.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    project: 'Hunian Klasik Kolonial, Bandung'
  },
  {
    id: 2,
    name: 'Ibu Dewi',
    nameEn: 'Mrs. Dewi',
    role: 'Pemilik Hunian "The Verdant Pavilion"',
    roleEn: 'Owner of "The Verdant Pavilion" Residence',
    content: 'Sistem Design & Build Arsi Karya membuat saya tenang. Tidak ada biaya siluman dan koordinasi antara arsitek dengan kontraktor di lapangan berjalan sangat lancar.',
    contentEn: 'Arsi Karya\'s Design & Build system gave me complete peace of mind. There were no hidden costs and coordination between architects and site contractors went smoothly.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    project: 'Buah Batu Regensi, Bandung'
  },
  {
    id: 3,
    name: 'Bpk. Hyogi',
    nameEn: 'Mr. Hyogi',
    role: 'Pemilik Proyek Finishing Hunian',
    roleEn: 'Owner of Residential Finishing Project',
    content: 'Hasil pekerjaan finishing interior dan pengecatan sangat rapi. Pengawasan dari tim QC Arsi Karya benar-benar detail sampai ke bagian terpencil.',
    contentEn: 'Interior finishing and painting results were meticulous. The QC supervision from Arsi Karya\'s team was detailed down to every corner.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    project: 'Finishing Rumah, Bandung'
  }
];

export function getTestimonialsData(lang = 'id') {
  if (lang === 'en') {
    return testimonialsData.map(t => ({
      ...t,
      name: t.nameEn || t.name,
      role: t.roleEn || t.role,
      content: t.contentEn || t.content,
    }));
  }
  return testimonialsData;
}
