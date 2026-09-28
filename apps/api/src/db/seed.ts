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
            shortDescription: 'Perencanaan hunian dan ruang yang dikembangkan berdasarkan kebutuhan, kondisi lokasi, serta karakter penggunanya.',
            description: '<p>Perencanaan hunian dan ruang yang dikembangkan berdasarkan kebutuhan, kondisi lokasi, serta karakter penggunanya. Setiap keputusan desain mempertimbangkan fungsi, kenyamanan, estetika, anggaran, hingga bagaimana desain tersebut nantinya diwujudkan.</p><p><strong>Rp 150.000 / m²</strong></p><h3>Output Perencanaan:</h3><ul><li>Konsep & Desain 3D</li><li>Gambar Kerja Lengkap:<ul><li>Arsitektur</li><li>Struktur</li><li>MEP (Mechanical, Electrical & Plumbing)</li></ul></li><li>Spesifikasi Teknis</li><li>BOQ & RAB</li><li>Time Schedule Pembangunan</li><li>Animasi</li><li>3x Revisi Mayor</li></ul><h3>Proses Perencanaan:</h3><p>Konsultasi → Site Survey → Moodboard → Pengembangan Desain → Final Output</p>',
            heroImageUrl: '/projects/service_perencanaan.jpg',
            scope: [
                'Konsep & Desain 3D',
                'Gambar Kerja Lengkap (Arsitektur, Struktur, MEP)',
                'Spesifikasi Teknis',
                'BOQ & RAB',
                'Time Schedule Pembangunan & Animasi'
            ],
            process: [
                { title: '1. Konsultasi & Site Survey', description: 'Diskusi awal dan survei lokasi lahan.' },
                { title: '2. Moodboard & Konsep 3D', description: 'Penyusunan referensi visual dan konsep desain.' },
                { title: '3. Pengembangan Desain & DED', description: 'Penyusunan gambar kerja detail dan analisis teknis.' },
                { title: '4. Final Output & RAB', description: 'Penyerahan seluruh dokumen perencanaan siap pakai.' }
            ],
            faq: [
                { question: "Apakah bisa menggunakan jasa desain saja tanpa pembangunan?", answer: "Bisa. Layanan perencanaan dapat digunakan secara terpisah tanpa harus melanjutkan pembangunan bersama Arsi Karya." },
                { question: "Bagaimana perhitungan luas untuk biaya desain?", answer: "Biaya dihitung berdasarkan luas area yang masuk dalam lingkup perencanaan, bukan berdasarkan luas tanah secara keseluruhan." },
                { question: "Apakah bisa mendesain bangunan yang sudah ada?", answer: "Bisa. Perencanaan dapat dilakukan untuk bangunan eksisting, baik untuk renovasi, pengembangan, maupun penataan ulang ruang." },
                { question: "Apakah desain menyesuaikan dengan budget pembangunan?", answer: "Ya. Anggaran pembangunan dapat ditentukan sejak awal sebagai salah satu acuan dalam pengembangan desain." },
                { question: "Apakah bisa menggunakan referensi desain yang saya punya?", answer: "Bisa. Referensi dari klien dapat digunakan untuk memahami preferensi gaya, kebutuhan, dan arah desain yang diinginkan." },
                { question: "Apakah desain dari Arsi Karya bisa dikerjakan oleh kontraktor lain?", answer: "Bisa. Seluruh output perencanaan dapat digunakan sebagai acuan pelaksanaan pembangunan oleh pihak lain." }
            ],
            published: true,
            sortOrder: 0
        },
        {
            title: 'Konstruksi (General Contractor)',
            slug: 'konstruksi',
            shortDescription: 'Kami menangani pelaksanaan pembangunan secara menyeluruh, dari persiapan hingga bangunan selesai dengan perhatian pada mutu, biaya, dan waktu.',
            description: '<p>Kami menangani pelaksanaan pembangunan secara menyeluruh, dari persiapan hingga bangunan selesai. Setiap pekerjaan dikelola berdasarkan desain dan spesifikasi yang telah disepakati, dengan perhatian pada mutu, biaya, waktu, serta detail pelaksanaan di lapangan.</p><p>Baik menggunakan desain Arsi Karya maupun desain dari pihak lain, kami memastikan setiap bagian pekerjaan diterjemahkan dan dikerjakan semaksimal mungkin sesuai rancangan.</p><h3>Sistem Pekerjaan</h3><p>Pekerjaan konstruksi disusun berdasarkan RAB yang terperinci, sehingga lingkup pekerjaan, spesifikasi, dan biaya dapat diketahui dengan jelas sejak awal.</p><h3>Lingkup Layanan:</h3><ul><li>Manajemen & koordinasi proyek</li><li>Pengadaan material</li><li>Koordinasi tenaga kerja & vendor</li><li>Pelaksanaan pekerjaan konstruksi</li><li>Quality Control</li><li>Monitoring progres & waktu</li><li>Dokumentasi pekerjaan</li></ul><h3>Dokumen & Laporan:</h3><ul><li>RAB & rekapitulasi pekerjaan</li><li>Time Schedule</li><li>Laporan progress pekerjaan</li><li>Dokumentasi progress</li><li>Berita Acara Serah Terima</li><li>As Built Drawing</li><li>Dokumen masa pemeliharaan & garansi</li></ul><h3>Proses Konstruksi:</h3><p>Persiapan → Mobilisasi → Pelaksanaan → Monitoring & QC → Finishing → Serah Terima → Masa Garansi</p>',
            heroImageUrl: '/projects/service_konstruksi.jpg',
            scope: [
                'Manajemen & Koordinasi Proyek',
                'Pengadaan Material Verified & Tenaga Kerja',
                'Pelaksanaan Konstruksi Fisik Bangunan',
                'Quality Control & Monitoring Progres',
                'Penyusunan Dokumen Laporan & Garansi'
            ],
            process: [
                { title: '1. Persiapan & Mobilisasi', description: 'Persiapan lahan, tim kerja, dan pengadaan alat.' },
                { title: '2. Pelaksanaan Konstruksi', description: 'Pengerjaan struktur, arsitektural, dan MEP.' },
                { title: '3. Monitoring & QC', description: 'Inspeksi kualitas berkala dan pelaporan progres.' },
                { title: '4. Finishing, BAST & Garansi', description: 'Pemeriksaan akhir, serah terima, dan pemeliharaan.' }
            ],
            faq: [
                { question: "Apakah bisa membangun menggunakan desain dari arsitek atau pihak lain?", answer: "Bisa. Kami dapat melaksanakan pembangunan berdasarkan gambar kerja dan spesifikasi yang disiapkan oleh pihak lain." },
                { question: "Bagaimana jika ada perubahan pekerjaan saat pembangunan berlangsung?", answer: "Setiap perubahan akan dikomunikasikan dan disepakati terlebih dahulu sebelum pekerjaan dilaksanakan, termasuk dampaknya terhadap biaya dan waktu." },
                { question: "Apakah material bisa ditentukan oleh klien?", answer: "Bisa. Spesifikasi dan pilihan material dapat disesuaikan dengan kebutuhan proyek selama memenuhi standar teknis yang telah disepakati." },
                { question: "Bagaimana cara mengetahui perkembangan pekerjaan?", answer: "Progress pekerjaan didokumentasikan dan dilaporkan secara berkala, sehingga klien dapat mengetahui perkembangan proyek tanpa harus selalu berada di lokasi." },
                { question: "Bagaimana jika pekerjaan tidak sesuai dengan desain?", answer: "Setiap pekerjaan melalui proses quality control untuk memastikan pelaksanaan mengikuti gambar kerja dan spesifikasi yang telah disepakati." },
                { question: "Apa yang terjadi setelah bangunan selesai?", answer: "Setelah pekerjaan selesai dilakukan pemeriksaan dan serah terima. Selanjutnya proyek memasuki masa pemeliharaan dan garansi sesuai ketentuan yang tercantum dalam kontrak." }
            ],
            published: true,
            sortOrder: 1
        },
        {
            title: 'Design & Build',
            slug: 'design-build',
            shortDescription: 'Satu layanan dari desain hingga pembangunan, ditangani oleh satu tim untuk koordinasi lebih praktis dan efisiensi total.',
            description: '<p>Satu layanan dari desain hingga pembangunan, ditangani oleh satu tim. Desain dikembangkan sesuai kebutuhan dan kondisi proyek, kemudian langsung diterjemahkan ke dalam pelaksanaan konstruksi.</p><p>Lebih praktis, lebih terkoordinasi, dan biaya desain menjadi pengurang nilai konstruksi apabila pembangunan dilanjutkan bersama Arsi Karya.</p><h3>Output:</h3><ul><li>Konsep & Desain 3D</li><li>Gambar Kerja</li><li>Spesifikasi Teknis</li><li>BOQ & RAB</li><li>Time Schedule</li><li>Animasi</li><li>3x Revisi Mayor</li><li>Pelaksanaan Konstruksi</li><li>Quality Control & Monitoring</li><li>Laporan & Dokumentasi Progress</li><li>As Built Drawing</li><li>Serah Terima & Garansi</li></ul><h3>Proses:</h3><p>Konsultasi → Site Survey → Kontrak → Desain → RAB → Pembangunan → Serah Terima</p>',
            heroImageUrl: '/projects/service_design_build.jpg',
            scope: [
                'Perencanaan Konsep Arsitektur & 3D Visual',
                'Penyusunan DED & Kalkulasi RAB Terperinci',
                'Pelaksanaan Pembangunan Fisik Satu Pintu',
                'Pengawasan QC Terpadu & Dokumentasi',
                'Serah Terima Kunci & Garansi Resmi'
            ],
            process: [
                { title: '1. Konsultasi & Site Survey', description: 'Diskusi kebutuhan dan survei kondisi lokasi.' },
                { title: '2. Kontrak & Pengembangan Desain', description: 'Pembuatan desain 3D dan kalkulasi RAB.' },
                { title: '3. Pelaksanaan Pembangunan', description: 'Eksekusi fisik oleh tim terpadu Arsi Karya.' },
                { title: '4. Serah Terima & Garansi', description: 'Pemeriksaan hasil dan serah terima garansi.' }
            ],
            faq: [
                { question: "Apakah biaya desain benar-benar gratis?", answer: "Biaya desain tetap dihitung dalam kontrak perencanaan, namun nilainya akan menjadi pengurang biaya konstruksi apabila pembangunan dilanjutkan bersama Arsi Karya." },
                { question: "Apakah harus langsung mengambil pembangunan setelah desain selesai?", answer: "Tidak. Kontrak perencanaan dan konstruksi dibuat secara terpisah, sehingga keputusan untuk melanjutkan pembangunan dapat dilakukan setelah desain dan RAB selesai." },
                { question: "Bagaimana jika setelah desain selesai saya tidak melanjutkan pembangunan?", answer: "Kontrak perencanaan tetap berlaku sesuai kesepakatan awal. Biaya perencanaan tidak menjadi pengurang apabila pembangunan tidak dilanjutkan bersama Arsi Karya." },
                { question: "Apa keuntungan menggunakan Design & Build dibandingkan menggunakan jasa desain dan kontraktor terpisah?", answer: "Desain dan pembangunan ditangani dalam satu tim, sehingga koordinasi lebih sederhana dan keputusan desain dapat langsung mempertimbangkan pelaksanaan, biaya, dan kondisi lapangan." },
                { question: "Apakah bisa menggunakan desain yang sudah saya miliki?", answer: "Bisa, namun layanan tersebut masuk ke dalam pekerjaan konstruksi. Arsi Karya tidak melakukan pengembangan desain, tetapi akan mengklarifikasi bagian yang belum jelas sebelum pekerjaan dilaksanakan." }
            ],
            published: true,
            sortOrder: 2
        },
        {
            title: 'Renovasi',
            slug: 'renovasi',
            shortDescription: 'Mengubah dan mengembangkan bangunan yang sudah ada sesuai kebutuhan baru, diawali survey dan pemahaman kondisi eksisting.',
            description: '<p>Mengubah dan mengembangkan bangunan yang sudah ada sesuai kebutuhan baru. Setiap pekerjaan diawali dengan survey dan pemahaman kondisi eksisting, sehingga lingkup pekerjaan dapat ditentukan dengan jelas sebelum renovasi dimulai.</p><h3>Lingkup Renovasi:</h3><ul><li>Renovasi Sebagian</li><li>Renovasi Menyeluruh</li><li>Penambahan & Pengembangan Ruang</li><li>Perubahan Fasad</li><li>Penataan Interior</li><li>Perencanaan & Desain Renovasi</li><li>Pelaksanaan Konstruksi</li></ul><h3>Dokumen & Laporan:</h3><ul><li>RAB & Rekapitulasi Pekerjaan</li><li>Time Schedule</li><li>Laporan Progress</li><li>Dokumentasi Progress</li><li>Berita Acara Serah Terima</li><li>As Built Drawing</li><li>Dokumen Masa Pemeliharaan & Garansi</li></ul><h3>Proses:</h3><p>Konsultasi → Site Survey → Analisis Kondisi Eksisting → Kontrak → RAB → Pelaksanaan → Serah Terima → Masa Garansi</p>',
            heroImageUrl: '/projects/service_renovasi.jpg',
            scope: [
                'Renovasi Sebagian & Renovasi Total',
                'Penambahan & Pengembangan Ruang / Fasad',
                'Penataan Interior & Perencanaan Desain',
                'Pelaksanaan Konstruksi & Maintenance',
                'Penyusunan RAB & Dokumen Pemeliharaan'
            ],
            process: [
                { title: '1. Konsultasi & Survey Eksisting', description: 'Pemeriksaan fisik kondisi struktur lama.' },
                { title: '2. Analisis & Penyusunan RAB', description: 'Penetapan lingkup renovasi dan estimasi biaya.' },
                { title: '3. Pelaksanaan Renovasi', description: 'Eksekusi fisik perbaikan dan pengembangan ruang.' },
                { title: '4. Serah Terima & Masa Garansi', description: 'Inspeksi hasil dan penyerahan masa garansi.' }
            ],
            faq: [
                { question: "Apakah harus sudah memiliki desain untuk renovasi?", answer: "Tidak. Jika belum memiliki desain, kami dapat membantu proses perencanaan dan desain sesuai kebutuhan renovasi." },
                { question: "Apakah renovasi harus dilakukan secara menyeluruh?", answer: "Tidak. Renovasi dapat dilakukan pada bagian tertentu sesuai kebutuhan dan kondisi bangunan." },
                { question: "Bagaimana menentukan bagian bangunan yang perlu direnovasi?", answer: "Kami melakukan survey kondisi eksisting terlebih dahulu untuk melihat kondisi bangunan dan menentukan lingkup pekerjaan yang diperlukan." },
                { question: "Apakah bisa menambah ruang atau lantai pada bangunan yang sudah ada?", answer: "Bisa, selama kondisi dan struktur bangunan memungkinkan untuk dikembangkan. Kelayakannya akan ditinjau melalui survey dan analisis kondisi eksisting." },
                { question: "Apakah rumah tetap bisa dihuni selama proses renovasi?", answer: "Tergantung pada lingkup dan tahapan pekerjaan. Hal ini dapat dibahas dan direncanakan sejak awal agar pekerjaan dapat disesuaikan dengan kondisi penghuni." },
                { question: "Apakah bisa menggunakan material atau bagian bangunan yang masih bagus?", answer: "Bisa. Bagian bangunan yang masih layak dapat dipertahankan sesuai hasil survey dan kesepakatan lingkup pekerjaan." },
                { question: "Apakah renovasi bisa dilakukan bertahap?", answer: "Bisa. Lingkup pekerjaan dapat disusun berdasarkan prioritas dan kebutuhan anggaran." }
            ],
            published: true,
            sortOrder: 3
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
        },
        {
            clientName: 'Bpk. Hendra',
            clientRole: 'Pemilik Proyek Perencanaan & Konstruksi',
            quote: 'Proses pengerjaan berjalan sangat terstruktur. Komunikasi tim lapangan dan laporan progres mingguan membuat kami sangat puas dengan hasil akhirnya.',
            projectName: 'Konstruksi & Perencanaan, Bandung',
            imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
            approved: true,
            published: true,
            sortOrder: 3
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
