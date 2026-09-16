import 'dotenv/config';
import { db } from './index.js';
import { homePage, socialLinks } from './schema/home.js';
import { aboutPage, aboutTools, experiences, certifications, galleryImages } from './schema/about.js';
import { contactPage } from './schema/contact.js';
import { projects, projectBlocks } from './schema/project.js';
import { services } from './schema/services.js';
import { articles } from './schema/articles.js';
import { testimonials } from './schema/testimonials.js';
import { siteSettings } from './schema/siteSettings.js';
import { user } from './schema/auth.js';
import { auth } from '../lib/auth.js';
import { eq } from 'drizzle-orm';

async function seed() {
    console.log('🌱 Seeding database with official ARSI KARYA company data...');

    // ==================== 1. Create Super Admin accounts ====================
    console.log('  → Setting up Admin accounts...');
    const adminEmails = ['admin@admin.com', 'webarsikarya@gmail.com'];

    for (const email of adminEmails) {
        try {
            await auth.api.signUpEmail({
                body: {
                    name: email === 'webarsikarya@gmail.com' ? 'Arsi Karya Admin' : 'Super Admin',
                    email,
                    password: 'admin123',
                },
            });
            console.log(`  ✓ Admin user created: ${email}`);
        } catch (error: any) {
            console.log(`  ✓ Admin user check done for: ${email}`);
        }

        await db.update(user)
            .set({ role: 'SUPER_ADMIN', status: 'active' })
            .where(eq(user.email, email));
    }

    // ==================== 3. Home Page ====================
    console.log('  → Seeding home page...');
    await db.delete(socialLinks);
    await db.delete(homePage);

    await db.insert(homePage).values([
        {
            profileImageUrl: '/hero_banner.jpg',
            heroHeadline: 'Mitra Kontraktor & Design Build Terpercaya di Bandung, Jawa — Bali',
            ctaText: 'Konsultasi Proyek Bersama Arsi Karya',
            ctaUrl: 'https://wa.me/628997932802?text=Halo%20Arsi%20Karya!%20Saya%20ingin%20konsultasi%20mengenai%20proyek.'
        }
    ]);

    await db.insert(socialLinks).values([
        { name: 'Instagram', url: 'https://instagram.com/arsikarya.build', sortOrder: 0 },
        { name: 'WhatsApp', url: 'https://wa.me/628997932802', sortOrder: 1 }
    ]);

    // ==================== 4. About Page ====================
    console.log('  → Seeding about page...');
    await db.delete(galleryImages);
    await db.delete(certifications);
    await db.delete(experiences);
    await db.delete(aboutTools);
    await db.delete(aboutPage);

    await db.insert(aboutPage).values([
        {
            bioDescription: 'PT ARSI KARYA UNGGUL adalah perusahaan kontraktor umum, spesialis Design & Build, perancangan arsitektur, dan pengadaan barang berkualitas tinggi yang berdomisili di Bandung.'
        }
    ]);

    // ==================== 5. Contact Page ====================
    console.log('  → Seeding contact page...');
    await db.delete(contactPage);
    await db.insert(contactPage).values([
        {
            whatsappNumber: '628997932802',
            email: 'webarsikarya@gmail.com',
            phone: '+62 899-7932-802',
            location: 'Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung',
            defaultMessage: 'Halo Arsi Karya! Saya berminat untuk konsultasi proyek pembangunan/renovasi.'
        }
    ]);

    // ==================== 6. Services ====================
    console.log('  → Seeding services...');
    await db.delete(services);
    await db.insert(services).values([
        {
            title: 'Perencanaan (Architecture & Engineering)',
            slug: 'perencanaan',
            shortDescription: 'Perancangan arsitektur, perhitungan struktur teknik, dan penyusunan gambar kerja DED presisi.',
            description: 'Arsi Karya menyediakan jasa perencanaan arsitektur dan teknik profesional. Kami menyusun sketsa konsep, desain 3D photorealistic, analisis struktur, gambar kerja detail (DED), hingga Rencana Anggaran Biaya (RAB) yang presisi dan efisien.',
            scope: [
                'Perancangan Konsep & Visualisasi 3D Photorealistic',
                'Penyusunan Gambar Kerja Detail (DED)',
                'Perhitungan Analisis Struktur Teknik & MEP',
                'Penyusunan Rencana Anggaran Biaya (RAB)',
                'Pengurusan Dokumen Perizinan (PBG / IMB)'
            ],
            process: [
                { title: '1. Konsultasi Kebutuhan & Survey Lahan', description: 'Diskusi mendalam mengenai kebutuhan fungsi ruang dan pengukuran lokasi.' },
                { title: '2. Pemodelan Sketsa 3D & Layout Ruang', description: 'Penyusunan tata letak denah 2D dan visualisasi 3D.' },
                { title: '3. Perhitungan Struktur & Detail MEP', description: 'Analisis teknis beban bangunan dan instalasi kelistrikan/air.' },
                { title: '4. Penyerahan Dokumen DED & RAB Fix', description: 'Penyerahan cetak buku gambar teknis siap pakai.' }
            ],
            faq: [
                { question: 'Apakah gambar perencanaan sudah siap untuk acuan tukang/kontraktor?', answer: 'Ya, dokumen DED kami mencakup gambar arsitektur, struktur, hingga MEP terperinci.' }
            ],
            published: true,
            sortOrder: 0
        },
        {
            title: 'Konstruksi (General Contractor)',
            slug: 'konstruksi',
            shortDescription: 'Jasa kontraktor umum untuk pembangunan rumah, gedung perkantoran, dan komersial dengan alur terstruktur.',
            description: 'Arsi Karya melayani jasa kontraktor umum profesional. Kami mengelola seluruh tahapan pembangunan mulai dari persiapan lahan, struktur bawah, struktur atas, hingga penutupan atap dan pekerjaan arsitektural secara disiplin dan transparan.',
            scope: [
                'Pekerjaan Persiapan Lahan & Dewatering',
                'Pekerjaan Struktur Bawah (Fondasi Tiang Pancang / Bored Pile / Footplat)',
                'Pekerjaan Struktur Atas (Beton Bertulang / Rangka Baja Structural)',
                'Pekerjaan Arsitektural & Dinding Pasangan',
                'Instalasi Mekanikal, Elektrikal & Plumbing (MEP)'
            ],
            process: [
                { title: '1. Survey & Analisis Lahan', description: 'Pemeriksaan kondisi tanah dan pengukuran lahan.' },
                { title: '2. Penyusunan RAB & Jadwal S-Curve', description: 'Perhitungan estimasi biaya terperinci dan jadwal pengerjaan.' },
                { title: '3. Mobilisasi & Eksekusi Fisik', description: 'Pengiriman tim ahli, alat berat, dan material verified.' },
                { title: '4. Inspeksi QC & Serah Terima (BAST)', description: 'Pemeriksaan mutu ketat dan penyerahan Garansi Pemeliharaan.' }
            ],
            faq: [
                { question: 'Bagaimana sistem pembayaran pekerjaan konstruksi?', answer: 'Pembayaran dilakukan secara bertahap (termin) sesuai persentase progres fisik lapangan.' }
            ],
            published: true,
            sortOrder: 1
        },
        {
            title: 'Design & Build',
            slug: 'design-build',
            shortDescription: 'Layanan terintegrasi satu pintu meliputi Arsitektur, Desain Interior, dan Eksekusi Konstruksi.',
            description: 'Metode Design & Build memangkas ketidaksesuaian antara gambar arsitek dan pelaksanaan di lapangan. Kami menyatukan perancang arsitektur, desainer interior, dan tim eksekusi lapangan dalam satu komando terpadu di Arsi Karya.',
            scope: [
                'Perencanaan Arsitektur & Fasad 3D Photorealistic',
                'Perhitungan Analisis Struktur Teknik',
                'Desain Interior & Layout Pencahayaan',
                'Penyusunan Gambar Kerja DED',
                'Pembangunan Fisik Terintegrasi'
            ],
            process: [
                { title: '1. Brainstorming Concept & Moodboard', description: 'Memahami gaya arsitektur dan preferensi material klien.' },
                { title: '2. Pengembangan Desain 3D & RAB Fix', description: 'Visualisasi 3D mendalam dan penetapan batas anggaran pasti.' },
                { title: '3. Pengurusan IMB / PBG Lingkungan', description: 'Penyusunan kelengkapan gambar teknis perizinan.' },
                { title: '4. Eksekusi Lapangan Single Point of Contact', description: 'Pengawasan tunggal dari desainer dan kontraktor internal Arsi Karya.' }
            ],
            faq: [
                { question: 'Apa keuntungan metode Design & Build?', answer: 'Menghemat waktu koordinasi, mencegah revisi desain tak terwujud, dan memastikan estimasi biaya tetap terkendali.' }
            ],
            published: true,
            sortOrder: 2
        },
        {
            title: 'Renovasi (Renovation & Rejuvenation)',
            slug: 'renovasi',
            shortDescription: 'Jasa renovasi rumah dan bangunan komersial, perkuatan struktur, dan peremajaan fasad.',
            description: 'Arsi Karya melayani jasa renovasi rumah hunian dan bangunan komersial dengan perencanaan terstruktur untuk menghindari pembengkakan biaya dan cacat konstruksi.',
            scope: [
                'Renovasi Total & Pembongkaran Terstruktur',
                'Perkuatan Struktur & Perbaikan Bocor Damp',
                'Peremajaan Fasad Arsitektural Modern',
                'Pekerjaan Interior & Replacement Plafon / Lantai'
            ],
            process: [
                { title: '1. Inspeksi Kerusakan & Survey', description: 'Pemeriksaan detail kondisi struktur eksisting.' },
                { title: '2. Rencana Kerja Renovasi & RAB', description: 'Penyusunan anggaran dan jadwal pengerjaan.' },
                { title: '3. Eksekusi Lapangan & Barikade Area', description: 'Pekerjaan fisik terisolasi bersih dan aman.' },
                { title: '4. Finishing & Pembersihan Total', description: 'Serah terima kondisi bersih dan siap huni.' }
            ],
            faq: [
                { question: 'Apakah bisa melakukan renovasi parsial?', answer: 'Bisa, kami melayani renovasi skala kecil hingga renovasi total rumah.' }
            ],
            published: true,
            sortOrder: 3
        },
        {
            title: 'Landscape (Landscape & Garden)',
            slug: 'landscape',
            shortDescription: 'Perencanaan arsitektur lansekap, hardscape outdoor, kolam renang, dan desain taman.',
            description: 'Layanan perancangan dan pembangunan lansekap yang menyatukan vegetasi asri, teras outdoor, kolam renang, dan kolam hias secara estetis.',
            scope: [
                'Desain Lansekap 3D Tropis & Zen Garden',
                'Pembangunan Hardscape Teras & Batu Alam',
                'Pembangunan Kolam Renang & Kolam Ikan Koi',
                'Instalasi Automatic Garden Lighting & Irrigation'
            ],
            process: [
                { title: '1. Concept & Planting Scheme', description: 'Pemilihan jenis tanaman hias dan tata letak hardscape.' },
                { title: '2. Pekerjaan Tanah & Drainase', description: 'Pengolahan tanah subur dan instalasi drainase.' },
                { title: '3. Eksekusi Hardscape & Planting', description: 'Pemasangan batu alam, kolam, dan vegetasi.' },
                { title: '4. Maintenance Initial Stage', description: 'Perawatan awal pertumbuhan tanaman.' }
            ],
            faq: [
                { question: 'Apakah Arsi Karya melayani pembuatan kolam renang / ikan?', answer: 'Ya, kami berpengalaman mengerjakan kolam renang pribadi dan kolam koi dengan sirkulasi air teruji.' }
            ],
            published: true,
            sortOrder: 4
        }
    ]);

    // ==================== 7. Projects ====================
    console.log('  → Seeding projects...');
    await db.delete(projectBlocks);
    await db.delete(projects);

    const arsiKaryaProjects = [
        {
            title: 'Pekerjaan Fasad ACP Gedung Kantor KPPN Pekalongan',
            slug: 'fasad-acp-kppn-pekalongan',
            category: 'Fasad & Eksterior',
            company: 'CV Aryasatya Jaya Konstruksi',
            location: 'KPPN Pekalongan, Jawa Tengah',
            year: '2024',
            clientContext: 'KPPN Pekalongan',
            arsiKaryaRole: 'Dikerjakan bersama entitas mitra CV Aryasatya Jaya Konstruksi.',
            description: 'Pekerjaan pemasangan Aluminium Composite Panel (ACP) dan peremajaan fasad gedung kantor KPPN Pekalongan untuk meningkatkan presisi estetika dan ketahanan cuaca.',
            scope: 'Panel ACP Presisi Tinggi, Struktur Rangka Holo Galvalum, Pengujian Ketahanan Cuaca',
            process: 'Pemasangan rangka galvalum, pemotongan panel ACP presisi, sealant waterproofing.',
            coverImageUrl: '/projects/project_1.jpg',
            gallery: ['/projects/project_1.jpg', '/projects/project_2.jpg', '/projects/project_3.jpg', '/projects/project_4.jpg'],
            published: true,
            visibility: 'public',
            sortOrder: 0
        },
        {
            title: 'The Old Heritage Rumah Hunian Mr. Erwan',
            slug: 'the-old-heritage-mr-erwan',
            category: 'Design & Build',
            company: 'Arsi Karya',
            location: 'Bandung, Jawa — Bali',
            year: '2025',
            clientContext: 'Mr. Erwan',
            arsiKaryaRole: 'Pelaksana Utama Design & Build Arsi Karya.',
            description: 'Pembangunan rumah hunian mewah bernuansa arsitektur klasik kolonial kontemporer dengan perpaduan material kayu berkualitas tinggi dan struktur beton bertulang.',
            scope: 'Arsitektur Classic Editorial, Detail Ornamen Kayu Custom, Pencahayaan Alami Optimal',
            process: 'Perencanaan desain arsitektur, pondasi beton bertulang, pekerjaan kayu interior custom.',
            coverImageUrl: '/projects/project_2.jpg',
            gallery: ['/projects/project_2.jpg', '/projects/project_1.jpg', '/projects/project_3.jpg', '/projects/project_5.jpg'],
            published: true,
            visibility: 'public',
            sortOrder: 1
        },
        {
            title: 'Pekerjaan Finishing Rumah Mr. Hyogi',
            slug: 'finishing-rumah-mr-hyogi',
            category: 'Finishing & Interior',
            company: 'Arsi Karya',
            location: 'Bandung, Jawa — Bali',
            year: '2025',
            clientContext: 'Mr. Hyogi',
            arsiKaryaRole: 'Pelaksana Utama Pekerjaan Finishing Arsi Karya.',
            description: 'Pekerjaan tahap akhir finishing interior dan eksterior rumah hunian, mencakup pengecatan khusus, pemasangan lantai granit/parket, dan ceiling drywall.',
            scope: 'Finishing Cat Premium, Pemasangan Lantai Granit Precision, Detail Plafon Concealed Light',
            process: 'Pengecatan interior/eksterior, pemasangan granit tile, ceiling concealed light installation.',
            coverImageUrl: '/projects/project_3.jpg',
            gallery: ['/projects/project_3.jpg', '/projects/project_4.jpg', '/projects/project_5.jpg', '/projects/project_2.jpg'],
            published: true,
            visibility: 'public',
            sortOrder: 2
        },
        {
            title: 'The Verdant Pavilion Rumah Hunian Ibu Dewi',
            slug: 'the-verdant-pavilion-ibu-dewi',
            category: 'Design & Build',
            company: 'Arsi Karya',
            location: 'Buah Batu Regensi, Bandung',
            year: '2025',
            clientContext: 'Ibu Dewi',
            arsiKaryaRole: 'Pelaksana Utama Design & Build Arsi Karya.',
            description: 'Desain dan pembangunan rumah pavilion modern tropis yang mengutamakan bukaan sirkulasi udara alami dan integrasi taman dalam hunian.',
            scope: 'Modern Tropical Architecture, Integrasi Inner Courtyard, Material Ramah Lingkungan',
            process: 'Perancangan lansekap indoor, struktur beton ekspos, instalasi pencahayaan alami.',
            coverImageUrl: '/projects/project_4.jpg',
            gallery: ['/projects/project_4.jpg', '/projects/project_2.jpg', '/projects/project_1.jpg', '/projects/project_6.jpg'],
            published: true,
            visibility: 'public',
            sortOrder: 3
        },
        {
            title: 'Pekerjaan Interior Ruang Pantry dan Rooftop KPPN Pekalongan',
            slug: 'interior-pantry-rooftop-kppn',
            category: 'Interior & Renovasi',
            company: 'PT Berka Semesta Guna Aksara',
            location: 'KPPN Pekalongan, Jawa Tengah',
            year: '2026',
            clientContext: 'KPPN Pekalongan',
            arsiKaryaRole: 'Dikerjakan bersama entitas mitra PT Berka Semesta Guna Aksara.',
            description: 'Penataan ulang area pantry instansi publik dan pengembangan area rooftop komunal menjadi ruang istirahat pegawai yang nyaman dan fungsional.',
            scope: 'Custom Kitchen Set Industrial, Lantai Outdoor Waterproofing, Kanopi Structural Steel',
            process: 'Pemasangan kitchen set HPL, penataan area rooftop outdoor, pemasangan kanopi baja.',
            coverImageUrl: '/projects/project_5.jpg',
            gallery: ['/projects/project_5.jpg', '/projects/project_3.jpg', '/projects/project_1.jpg', '/projects/project_4.jpg'],
            published: true,
            visibility: 'public',
            sortOrder: 4
        },
        {
            title: 'Pemeliharaan Gedung & Treatment Ruang Kerja Tim HKT LLDIKTI Wilayah IV',
            slug: 'treatment-ruang-hkt-lldikti-iv',
            category: 'Renovasi & Pemeliharaan',
            company: 'CV Aryasatya Jaya Konstruksi',
            location: 'LLDIKTI Wilayah IV, Bandung',
            year: '2024',
            clientContext: 'LLDIKTI Wilayah IV',
            arsiKaryaRole: 'Dikerjakan bersama entitas mitra CV Aryasatya Jaya Konstruksi.',
            description: 'Pekerjaan renovasi, pemeliharaan pencahayaan, peredam suara, serta penataan interior ruang kerja staf Hukum, Kepegawaian, dan Tata Usaha LLDIKTI Wilayah IV.',
            scope: 'Acoustic Wall Treatment, Lighting System Upgrade, Ergonomic Layout Arrangement',
            process: 'Pemasangan peredam suara dinding, perbaikan sistem pencahayaan LED, tata letak mebelair.',
            coverImageUrl: '/projects/project_6.jpg',
            gallery: ['/projects/project_6.jpg', '/projects/project_2.jpg', '/projects/project_4.jpg', '/projects/project_1.jpg'],
            published: true,
            visibility: 'public',
            sortOrder: 5
        },
        {
            title: 'Renovasi Lapangan Tenis LLDIKTI Wilayah IV Bandung',
            slug: 'renovasi-lapangan-tenis-lldikti-iv',
            category: 'Infrastruktur & Outdoor',
            company: 'CV Aryasatya Jaya Konstruksi',
            location: 'LLDIKTI Wilayah IV, Bandung',
            year: '2024',
            clientContext: 'LLDIKTI Wilayah IV',
            arsiKaryaRole: 'Dikerjakan bersama entitas mitra CV Aryasatya Jaya Konstruksi.',
            description: 'Pekerjaan perbaikan pelapisan permukaan (resurfacing) lapangan tenis, pengecatan linning standar pertandingan, dan sistem drainase lapangan.',
            scope: 'Flexipave Acrylic Resurfacing, Standard Match Marking Line, Drainage Flow Improvement',
            process: 'Pembersihan permukaan beton, pelapisan cat akrilik flexipave, pengecatan garis lapangan.',
            coverImageUrl: '/projects/project_7.jpg',
            gallery: ['/projects/project_7.jpg', '/projects/project_1.jpg', '/projects/project_3.jpg', '/projects/project_5.jpg'],
            published: true,
            visibility: 'public',
            sortOrder: 6
        },
        {
            title: 'Pengadaan Mebelair & Interior Kantor LLDIKTI Wilayah IV Bandung',
            slug: 'pengadaan-mebelair-lldikti-iv',
            category: 'Pengadaan Barang & Interior',
            company: 'CV Aryasatya Jaya Konstruksi',
            location: 'LLDIKTI Wilayah IV, Bandung',
            year: '2024',
            clientContext: 'LLDIKTI Wilayah IV',
            arsiKaryaRole: 'Dikerjakan bersama entitas mitra CV Aryasatya Jaya Konstruksi.',
            description: 'Pengadaan meja kerja ergonomis, kursi manajerial, partisi akustik, dan kabinet arsip kantor pemerintah dengan standar mutu SNI.',
            scope: 'SNI Certified Office Furniture, Acoustic Workstation Partitions, Modular Storage Cabinets',
            process: 'Fabrikasi mebelair kantor, perakitan partisi akustik, instalasi di lokasi proyek.',
            coverImageUrl: '/projects/project_8.jpg',
            gallery: ['/projects/project_8.jpg', '/projects/project_2.jpg', '/projects/project_4.jpg', '/projects/project_6.jpg'],
            published: true,
            visibility: 'public',
            sortOrder: 7
        }
    ];

    for (const p of arsiKaryaProjects) {
        await db.insert(projects).values(p);
    }

    // ==================== 8. Articles ====================
    console.log('  → Seeding articles...');
    await db.delete(articles);
    await db.insert(articles).values([
        {
            title: 'Cara Menentukan Kebutuhan Jasa Konstruksi untuk Proyek Anda',
            slug: 'cara-menentukan-kebutuhan-jasa-konstruksi',
            excerpt: 'Memulai proyek pembangunan membutuhkan pemahaman mendasar mengenai scope pekerjaan dan penentuan jenis kontraktor.',
            content: 'Memulai proyek pembangunan membutuhkan pemahaman mendasar mengenai scope pekerjaan dan penentuan jenis kontraktor. Dalam artikel ini, Arsi Karya membagikan panduan praktis untuk menganalisis kebutuhan ruang, penganggaran biaya, hingga pemilihan metode konstruksi terpadu.',
            category: 'Panduan Konstruksi',
            author: 'Tim Arsi Karya',
            coverImageUrl: '/projects/project_1.jpg',
            published: true
        },
        {
            title: 'Apa yang Perlu Disiapkan Sebelum Memulai Renovasi Rumah?',
            slug: 'apa-yang-perlu-disiapkan-sebelum-renovasi-rumah',
            excerpt: 'Renovasi rumah tanpa perencanaan matang sering memicu masalah kebocoran biaya dan waktu. Simak persiapan penting.',
            content: 'Renovasi rumah tanpa perencanaan matang sering memicu masalah kebocoran biaya dan waktu. Simak langkah persiapan penting mulai dari audit fisik bangunan, pembagian zonasi area kerja, hingga pemilihan material yang tahan lama.',
            category: 'Tips Renovasi',
            author: 'Tim Arsi Karya',
            coverImageUrl: '/projects/project_3.jpg',
            published: true
        },
        {
            title: 'Design & Build: Satu Alur dari Perencanaan hingga Pelaksanaan',
            slug: 'design-and-build-satu-alur-perencanaan-eksekusi',
            excerpt: 'Pelajari efisiensi biaya dan kemudahan kontrol proyek dalam satu komando terpadu perencanaan dan konstruksi.',
            content: 'Pelajari efisiensi biaya dan kemudahan kontrol proyek dalam satu komando terpadu perencanaan dan konstruksi. Metode Design & Build mengeliminasi potensi miskomunikasi antara arsitek dan kontraktor sehingga proyek selesai 100% presisi.',
            category: 'Inovasi Desain',
            author: 'Tim Arsi Karya',
            coverImageUrl: '/projects/project_2.jpg',
            published: true
        }
    ]);

    // ==================== 9. Testimonials ====================
    console.log('  → Seeding testimonials...');
    await db.delete(testimonials);
    await db.insert(testimonials).values([
        {
            clientName: 'Bpk. Erwan',
            clientRole: 'Pemilik Hunian "The Old Heritage"',
            quote: 'Kerja sama dengan Arsi Karya sangat memuaskan. Dari tahap perencanaan arsitektur hingga eksekusi kayu custom dan struktur beton, semuanya transparan dan tepat waktu.',
            projectName: 'Hunian Klasik Kolonial, Bandung',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            approved: true,
            published: true,
            sortOrder: 0
        },
        {
            clientName: 'Ibu Dewi',
            clientRole: 'Pemilik Hunian "The Verdant Pavilion"',
            quote: 'Sistem Design & Build Arsi Karya membuat saya tenang. Tidak ada biaya siluman dan koordinasi antara arsitek dengan kontraktor di lapangan berjalan sangat lancar.',
            projectName: 'Buah Batu Regensi, Bandung',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            approved: true,
            published: true,
            sortOrder: 1
        },
        {
            clientName: 'Bpk. Hyogi',
            clientRole: 'Pemilik Proyek Finishing Hunian',
            quote: 'Hasil pekerjaan finishing interior dan pengecatan sangat rapi. Pengawasan dari tim QC Arsi Karya benar-benar detail sampai ke bagian terpencil.',
            projectName: 'Finishing Rumah, Bandung',
            imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
            approved: true,
            published: true,
            sortOrder: 2
        }
    ]);

    // ==================== 10. Site Settings ====================
    console.log('  → Seeding site settings...');
    await db.delete(siteSettings);
    await db.insert(siteSettings).values([
        {
            companyName: 'Arsi Karya',
            tagline: 'Membangun Tuntas, Unggul Dalam Kualitas',
            phone: '+62 899-7932-802',
            whatsapp: '+62 899-7932-802',
            email: 'webarsikarya@gmail.com',
            address: 'Bumi Adipura, Jl. Tulip VII No. 21, Rancabolang, Gedebage, Kota Bandung.',
            instagram: 'arsikarya.build',
            seoTitle: 'Arsi Karya — Kontraktor & Design Build',
            seoDescription: 'Kontraktor spesialis Konstruksi, Design & Build, Fabrikasi, dan Pengadaan Barang.'
        }
    ]);

    console.log('✅ Seeding completed successfully with official ARSI KARYA data!');
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
