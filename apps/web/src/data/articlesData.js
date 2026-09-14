export const articlesData = [
  {
    id: "cara-menentukan-kebutuhan-jasa-konstruksi",
    slug: "cara-menentukan-kebutuhan-jasa-konstruksi",
    title: 'Cara Menentukan Kebutuhan Jasa Konstruksi untuk Proyek Anda',
    titleEn: 'How to Determine Construction Service Requirements for Your Project',
    excerpt: 'Memulai proyek pembangunan membutuhkan pemahaman mendasar mengenai scope pekerjaan dan penentuan jenis kontraktor.',
    excerptEn: 'Starting a construction project requires a fundamental understanding of scope of work and choosing the right contractor.',
    content: 'Memulai proyek pembangunan membutuhkan pemahaman mendasar mengenai scope pekerjaan dan penentuan jenis kontraktor. Dalam artikel ini, Arsi Karya membagikan panduan praktis untuk menganalisis kebutuhan ruang, penganggaran biaya, hingga pemilihan metode konstruksi terpadu.',
    contentEn: 'Starting a construction project requires a fundamental understanding of scope of work and choosing the right contractor. In this article, Arsi Karya shares practical guides for analyzing spatial needs, budgeting, and selecting integrated construction methods.',
    date: '2026-03-10',
    author: 'Tim Arsi Karya',
    authorEn: 'Arsi Karya Team',
    category: 'Panduan Konstruksi',
    categoryEn: 'Construction Guide'
  },
  {
    id: "apa-yang-perlu-disiapkan-sebelum-renovasi-rumah",
    slug: "apa-yang-perlu-disiapkan-sebelum-renovasi-rumah",
    title: 'Apa yang Perlu Disiapkan Sebelum Memulai Renovasi Rumah?',
    titleEn: 'What to Prepare Before Starting a House Renovation?',
    excerpt: 'Renovasi rumah tanpa perencanaan matang sering memicu masalah kebocoran biaya dan waktu. Simak persiapan penting.',
    excerptEn: 'Home renovation without proper planning often leads to budget overruns and delays. Read essential preparations.',
    content: 'Renovasi rumah tanpa perencanaan matang sering memicu masalah kebocoran biaya dan waktu. Simak langkah persiapan penting mulai dari audit fisik bangunan, pembagian zonasi area kerja, hingga pemilihan material yang tahan lama.',
    contentEn: 'Home renovation without proper planning often leads to budget overruns and delays. Read essential preparation steps from physical building audits and work zoning to selecting long-lasting materials.',
    date: '2026-03-05',
    author: 'Tim Arsi Karya',
    authorEn: 'Arsi Karya Team',
    category: 'Tips Renovasi',
    categoryEn: 'Renovation Tips'
  },
  {
    id: "design-and-build-satu-alur-perencanaan-eksekusi",
    slug: "design-and-build-satu-alur-perencanaan-eksekusi",
    title: 'Design & Build: Satu Alur dari Perencanaan hingga Pelaksanaan',
    titleEn: 'Design & Build: One Unified Workflow from Planning to Execution',
    excerpt: 'Pelajari efisiensi biaya dan kemudahan kontrol proyek dalam satu komando terpadu perencanaan dan konstruksi.',
    excerptEn: 'Learn about cost efficiency and project control under a single unified architectural & construction command.',
    content: 'Pelajari efisiensi biaya dan kemudahan kontrol proyek dalam satu komando terpadu perencanaan dan konstruksi. Metode Design & Build mengeliminasi potensi miskomunikasi antara arsitek dan kontraktor sehingga proyek selesai 100% presisi.',
    contentEn: 'Learn about cost efficiency and project control under a single unified architectural & construction command. Design & Build eliminates miscommunication between architects and contractors ensuring 100% precision.',
    date: '2026-02-28',
    author: 'Tim Arsi Karya',
    authorEn: 'Arsi Karya Team',
    category: 'Inovasi Desain',
    categoryEn: 'Design Innovation'
  }
];

export function getArticlesData(lang = 'id') {
  if (lang === 'en') {
    return articlesData.map(a => ({
      ...a,
      title: a.titleEn || a.title,
      excerpt: a.excerptEn || a.excerpt,
      content: a.contentEn || a.content,
      author: a.authorEn || a.author,
      category: a.categoryEn || a.category,
    }));
  }
  return articlesData;
}
