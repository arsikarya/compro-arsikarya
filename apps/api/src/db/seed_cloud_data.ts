import 'dotenv/config';
import { db } from './index.js';
import { homePage, socialLinks } from './schema/home.js';
import { aboutPage } from './schema/about.js';
import { contactPage } from './schema/contact.js';
import { projects, projectBlocks } from './schema/project.js';
import { services } from './schema/services.js';
import { articles } from './schema/articles.js';
import { testimonials } from './schema/testimonials.js';
import { siteSettings } from './schema/siteSettings.js';
import { user } from './schema/auth.js';
import { auth } from '../lib/auth.js';
import { eq } from 'drizzle-orm';

// Helper to upload image to Cloudinary
async function uploadToCloudinary(imageUrl: string): Promise<string> {
    try {
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
        const arrayBuffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64}`;

        const params = new URLSearchParams();
        params.append('file', dataUri);
        params.append('upload_preset', 'arsikarya');

        const res = await fetch('https://api.cloudinary.com/v1_1/agsidj31/image/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        const data = await res.json();
        if (data.secure_url) {
            console.log(`  ✓ Cloudinary upload success: ${data.secure_url}`);
            return data.secure_url;
        } else {
            console.warn('  ⚠️ Cloudinary fallback to raw URL:', data);
            return imageUrl;
        }
    } catch (error: any) {
        console.warn(`  ⚠️ Cloudinary upload error for ${imageUrl}:`, error.message);
        return imageUrl;
    }
}

async function runSeed() {
    console.log('🚀 Starting full Cloudinary & Neon DB seeding with 10+ items per collection...');

    // 1. Admin Users
    console.log('\n--- 1. Super Admin Accounts ---');
    const adminEmails = ['webarsikarya@gmail.com', 'admin@admin.com'];
    for (const email of adminEmails) {
        try {
            await auth.api.signUpEmail({
                body: {
                    name: 'Arsi Karya Admin',
                    email,
                    password: 'admin123',
                },
            });
        } catch (e) {}
        await db.update(user)
            .set({ role: 'SUPER_ADMIN', status: 'active' })
            .where(eq(user.email, email));
        console.log(`  ✓ Admin configured: ${email}`);
    }

    // 2. Uploading Curated Cloudinary Images
    console.log('\n--- 2. Uploading Construction & Architecture Media to Cloudinary (agsidj31) ---');
    
    const rawImages: Record<string, string> = {
        proj1: 'https://picsum.photos/id/1076/1200/800',
        proj2: 'https://picsum.photos/id/1069/1200/800',
        proj3: 'https://picsum.photos/id/1070/1200/800',
        proj4: 'https://picsum.photos/id/1068/1200/800',
        proj5: 'https://picsum.photos/id/1071/1200/800',
        proj6: 'https://picsum.photos/id/1072/1200/800',
        proj7: 'https://picsum.photos/id/1073/1200/800',
        proj8: 'https://picsum.photos/id/1074/1200/800',
        proj9: 'https://picsum.photos/id/1075/1200/800',
        proj10: 'https://picsum.photos/id/1077/1200/800',
        proj11: 'https://picsum.photos/id/1078/1200/800',
        proj12: 'https://picsum.photos/id/1079/1200/800',
        
        art1: 'https://picsum.photos/id/1067/1200/700',
        art2: 'https://picsum.photos/id/1080/1200/700',
        art3: 'https://picsum.photos/id/1081/1200/700',
        art4: 'https://picsum.photos/id/1082/1200/700',
        art5: 'https://picsum.photos/id/1083/1200/700',
        art6: 'https://picsum.photos/id/1084/1200/700',
        art7: 'https://picsum.photos/id/1085/1200/700',
        art8: 'https://picsum.photos/id/1086/1200/700',
        art9: 'https://picsum.photos/id/1087/1200/700',
        art10: 'https://picsum.photos/id/1088/1200/700',
        art11: 'https://picsum.photos/id/1089/1200/700',
        art12: 'https://picsum.photos/id/1090/1200/700',

        avatar1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
        avatar2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
        avatar3: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop',
        avatar4: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop',
        avatar5: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop',
        avatar6: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop',
        avatar7: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop',
        avatar8: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop',
    };

    const uploaded: Record<string, string> = {};
    for (const [key, url] of Object.entries(rawImages)) {
        console.log(`Uploading ${key}...`);
        uploaded[key] = await uploadToCloudinary(url);
    }

    // 3. Seeding Projects (12 Items)
    console.log('\n--- 3. Seeding 12 Projects ---');
    await db.delete(projectBlocks);
    await db.delete(projects);

    const projectDataList = [
        {
            title: 'Pekerjaan Fasad ACP Gedung Kantor KPPN Pekalongan',
            slug: 'fasad-acp-kppn-pekalongan',
            category: 'Konstruksi',
            company: 'CV Aryasatya Jaya Konstruksi',
            location: 'KPPN Pekalongan, Jawa Tengah',
            year: '2024',
            clientContext: 'KPPN Pekalongan',
            arsiKaryaRole: 'Dikerjakan bersama entitas mitra CV Aryasatya Jaya Konstruksi.',
            description: 'Pekerjaan pemasangan Aluminium Composite Panel (ACP) dan peremajaan fasad gedung kantor KPPN Pekalongan untuk meningkatkan presisi estetika dan ketahanan cuaca.',
            scope: 'Panel ACP Presisi Tinggi, Struktur Rangka Holo Galvalum, Pengujian Ketahanan Cuaca',
            process: 'Pemasangan rangka galvalum, pemotongan panel ACP presisi, sealant waterproofing.',
            coverImageUrl: uploaded.proj1,
            gallery: [uploaded.proj1, uploaded.proj2, uploaded.proj3, uploaded.proj4],
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
            coverImageUrl: uploaded.proj2,
            gallery: [uploaded.proj2, uploaded.proj1, uploaded.proj3, uploaded.proj5],
            published: true,
            visibility: 'public',
            sortOrder: 1
        },
        {
            title: 'Pekerjaan Finishing Rumah Mr. Hyogi',
            slug: 'finishing-rumah-mr-hyogi',
            category: 'Renovasi',
            company: 'Arsi Karya',
            location: 'Bandung, Jawa — Bali',
            year: '2025',
            clientContext: 'Mr. Hyogi',
            arsiKaryaRole: 'Pelaksana Utama Pekerjaan Finishing Arsi Karya.',
            description: 'Pekerjaan tahap akhir finishing interior dan eksterior rumah hunian, mencakup pengecatan khusus, pemasangan lantai granit/parket, dan ceiling drywall.',
            scope: 'Finishing Cat Premium, Pemasangan Lantai Granit Precision, Detail Plafon Concealed Light',
            process: 'Pengecatan interior/eksterior, pemasangan granit tile, ceiling concealed light installation.',
            coverImageUrl: uploaded.proj3,
            gallery: [uploaded.proj3, uploaded.proj4, uploaded.proj5, uploaded.proj2],
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
            coverImageUrl: uploaded.proj4,
            gallery: [uploaded.proj4, uploaded.proj2, uploaded.proj1, uploaded.proj6],
            published: true,
            visibility: 'public',
            sortOrder: 3
        },
        {
            title: 'Pekerjaan Interior Ruang Pantry dan Rooftop KPPN Pekalongan',
            slug: 'interior-pantry-rooftop-kppn',
            category: 'Renovasi',
            company: 'PT Berka Semesta Guna Aksara',
            location: 'KPPN Pekalongan, Jawa Tengah',
            year: '2026',
            clientContext: 'KPPN Pekalongan',
            arsiKaryaRole: 'Dikerjakan bersama entitas mitra PT Berka Semesta Guna Aksara.',
            description: 'Penataan ulang area pantry instansi publik dan pengembangan area rooftop komunal menjadi ruang istirahat pegawai yang nyaman dan fungsional.',
            scope: 'Custom Kitchen Set Industrial, Lantai Outdoor Waterproofing, Kanopi Structural Steel',
            process: 'Pemasangan kitchen set HPL, penataan area rooftop outdoor, pemasangan kanopi baja.',
            coverImageUrl: uploaded.proj5,
            gallery: [uploaded.proj5, uploaded.proj3, uploaded.proj1, uploaded.proj4],
            published: true,
            visibility: 'public',
            sortOrder: 4
        },
        {
            title: 'Pemeliharaan Gedung & Treatment Ruang Kerja Tim HKT LLDIKTI Wilayah IV',
            slug: 'treatment-ruang-hkt-lldikti-iv',
            category: 'Renovasi',
            company: 'CV Aryasatya Jaya Konstruksi',
            location: 'LLDIKTI Wilayah IV, Bandung',
            year: '2024',
            clientContext: 'LLDIKTI Wilayah IV',
            arsiKaryaRole: 'Dikerjakan bersama entitas mitra CV Aryasatya Jaya Konstruksi.',
            description: 'Pekerjaan renovasi, pemeliharaan pencahayaan, peredam suara, serta penataan interior ruang kerja staf Hukum, Kepegawaian, dan Tata Usaha LLDIKTI Wilayah IV.',
            scope: 'Acoustic Wall Treatment, Lighting System Upgrade, Ergonomic Layout Arrangement',
            process: 'Pemasangan peredam suara dinding, perbaikan sistem pencahayaan LED, tata letak mebelair.',
            coverImageUrl: uploaded.proj6,
            gallery: [uploaded.proj6, uploaded.proj2, uploaded.proj4, uploaded.proj1],
            published: true,
            visibility: 'public',
            sortOrder: 5
        },
        {
            title: 'Renovasi Lapangan Tenis LLDIKTI Wilayah IV Bandung',
            slug: 'renovasi-lapangan-tenis-lldikti-iv',
            category: 'Konstruksi',
            company: 'CV Aryasatya Jaya Konstruksi',
            location: 'LLDIKTI Wilayah IV, Bandung',
            year: '2024',
            clientContext: 'LLDIKTI Wilayah IV',
            arsiKaryaRole: 'Dikerjakan bersama entitas mitra CV Aryasatya Jaya Konstruksi.',
            description: 'Pekerjaan perbaikan pelapisan permukaan (resurfacing) lapangan tenis, pengecatan linning standar pertandingan, dan sistem drainase lapangan.',
            scope: 'Flexipave Acrylic Resurfacing, Standard Match Marking Line, Drainage Flow Improvement',
            process: 'Pembersihan permukaan beton, pelapisan cat akrilik flexipave, pengecatan garis lapangan.',
            coverImageUrl: uploaded.proj7,
            gallery: [uploaded.proj7, uploaded.proj1, uploaded.proj3, uploaded.proj5],
            published: true,
            visibility: 'public',
            sortOrder: 6
        },
        {
            title: 'Pengadaan Mebelair & Interior Kantor LLDIKTI Wilayah IV Bandung',
            slug: 'pengadaan-mebelair-lldikti-iv',
            category: 'Renovasi',
            company: 'CV Aryasatya Jaya Konstruksi',
            location: 'LLDIKTI Wilayah IV, Bandung',
            year: '2024',
            clientContext: 'LLDIKTI Wilayah IV',
            arsiKaryaRole: 'Dikerjakan bersama entitas mitra CV Aryasatya Jaya Konstruksi.',
            description: 'Pengadaan meja kerja ergonomis, kursi manajerial, partisi akustik, dan kabinet arsip kantor pemerintah dengan standar mutu SNI.',
            scope: 'SNI Certified Office Furniture, Acoustic Workstation Partitions, Modular Storage Cabinets',
            process: 'Fabrikasi mebelair kantor, perakitan partisi akustik, instalasi di lokasi proyek.',
            coverImageUrl: uploaded.proj8,
            gallery: [uploaded.proj8, uploaded.proj2, uploaded.proj4, uploaded.proj6],
            published: true,
            visibility: 'public',
            sortOrder: 7
        },
        {
            title: 'Konstruksi Gudang Structural Steel & Mezzanin Pabrik Subang',
            slug: 'konstruksi-gudang-steel-subang',
            category: 'Konstruksi',
            company: 'Arsi Karya',
            location: 'Kawasan Industri Subang, Jawa Barat',
            year: '2025',
            clientContext: 'PT Logistik Subang Mandiri',
            arsiKaryaRole: 'General Contractor & Structural Steel Fabricator.',
            description: 'Pembangunan gudang logistik seluas 2.500 m2 menggunakan rangka baja WF presisi tingi dan lantai beton bertulang perkerasan heavy duty.',
            scope: 'Ereksi Rangka Baja WF 300, Lantai Beton K-350 Hardener, Insulasi Atap Bubble Foil',
            process: 'Fabrikasi baja workshop, perakitan baut mutu tinggi di lapangan, pengecoran lantai trowel.',
            coverImageUrl: uploaded.proj9,
            gallery: [uploaded.proj9, uploaded.proj10, uploaded.proj11],
            published: true,
            visibility: 'public',
            sortOrder: 8
        },
        {
            title: 'Renovasi Fasad Modern Ruko Komersial Dago Bandung',
            slug: 'renovasi-fasad-ruko-dago',
            category: 'Renovasi',
            company: 'Arsi Karya',
            location: 'Jalan Ir. H. Juanda (Dago), Bandung',
            year: '2025',
            clientContext: 'Ibu Maya Ratnasari',
            arsiKaryaRole: 'Main Contractor Renovasi Fasad Arsi Karya.',
            description: 'Peremajaan total fasad bangunan ruko komersial 3 lantai menggunakan paduan louvre kayu sintesis, kaca tempered frameless, dan pencahayaan aksen LED.',
            scope: 'Perkuatan Fasad Eksisting, Aluminium Louvre Wood Finish, Facade Architectural Lighting',
            process: 'Pembongkaran fasad lama, fabrikasi subframe besi, instalasi louvre dan lighting.',
            coverImageUrl: uploaded.proj10,
            gallery: [uploaded.proj10, uploaded.proj11, uploaded.proj12],
            published: true,
            visibility: 'public',
            sortOrder: 9
        },
        {
            title: 'Villa Eco-Lodge & Landscape Architecture Lembang',
            slug: 'villa-eco-lodge-lembang',
            category: 'Landscape',
            company: 'Arsi Karya',
            location: 'Lembang, Bandung Barat',
            year: '2026',
            clientContext: 'Dr. Ir. Anton Wijaya',
            arsiKaryaRole: 'Pelaksana Utama Design & Build & Lansekap Arsi Karya.',
            description: 'Pembangunan komersial resor villa ramah lingkungan berkonsep kontemporer organik yang menyatu secara harmonis dengan perbukitan dan lanskap alam Lembang.',
            scope: 'Struktur Kayu Sintetis Tahan Cuaca, Hardscape Batu Andesit, Penataan Vegetasi Lokal',
            process: 'Pengolahan kontur lahan berundak, pembangunan dek kayu outdoor, penanaman vegetasi.',
            coverImageUrl: uploaded.proj11,
            gallery: [uploaded.proj11, uploaded.proj12, uploaded.proj1],
            published: true,
            visibility: 'public',
            sortOrder: 10
        },
        {
            title: 'Pembangunan Residensial Cluster Minimalis Buah Batu',
            slug: 'residensial-cluster-buah-batu',
            category: 'Konstruksi',
            company: 'Arsi Karya',
            location: 'Buah Batu, Kota Bandung',
            year: '2025',
            clientContext: 'Pengembang Residensial',
            arsiKaryaRole: 'Kontraktor Pelaksana Utama Arsi Karya.',
            description: 'Pembangunan 12 unit rumah hunian 2 lantai berkonsep minimalis skandinavia dengan standar spesifikasi material SNI dan manajemen waktu terukur.',
            scope: 'Struktur Beton Bertulang K-300, Dinding Bata Merah Press, Atap Baja Ringan SNI',
            process: 'Pekerjaan pondasi cakar ayam, pengecoran kolom & balok, finishing dinding cat weatherproof.',
            coverImageUrl: uploaded.proj12,
            gallery: [uploaded.proj12, uploaded.proj1, uploaded.proj2],
            published: true,
            visibility: 'public',
            sortOrder: 11
        }
    ];

    for (const p of projectDataList) {
        await db.insert(projects).values(p);
    }

    // 4. Seeding Articles (12 Items)
    console.log('\n--- 4. Seeding 12 Articles ---');
    await db.delete(articles);

    const articleDataList = [
        {
            title: 'Cara Menentukan Kebutuhan Jasa Konstruksi untuk Proyek Anda',
            slug: 'cara-menentukan-kebutuhan-jasa-konstruksi',
            excerpt: 'Memulai proyek pembangunan membutuhkan pemahaman mendasar mengenai scope pekerjaan dan penentuan jenis kontraktor.',
            content: 'Memulai proyek pembangunan membutuhkan pemahaman mendasar mengenai scope pekerjaan dan penentuan jenis kontraktor. Dalam artikel ini, Arsi Karya membagikan panduan praktis untuk menganalisis kebutuhan ruang, penganggaran biaya, hingga pemilihan metode konstruksi terpadu.',
            category: 'Panduan Konstruksi',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art1,
            published: true
        },
        {
            title: 'Apa yang Perlu Disiapkan Sebelum Memulai Renovasi Rumah?',
            slug: 'apa-yang-perlu-disiapkan-sebelum-renovasi-rumah',
            excerpt: 'Renovasi rumah tanpa perencanaan matang sering memicu masalah kebocoran biaya dan waktu. Simak persiapan penting.',
            content: 'Renovasi rumah tanpa perencanaan matang sering memicu masalah kebocoran biaya dan waktu. Simak langkah persiapan penting mulai dari audit fisik bangunan, pembagian zonasi area kerja, hingga pemilihan material yang tahan lama.',
            category: 'Tips Renovasi',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art2,
            published: true
        },
        {
            title: 'Design & Build: Satu Alur dari Perencanaan hingga Pelaksanaan',
            slug: 'design-and-build-satu-alur-perencanaan-eksekusi',
            excerpt: 'Pelajari efisiensi biaya dan kemudahan kontrol proyek dalam satu komando terpadu perencanaan dan konstruksi.',
            content: 'Pelajari efisiensi biaya dan kemudahan kontrol proyek dalam satu komando terpadu perencanaan dan konstruksi. Metode Design & Build mengeliminasi potensi miskomunikasi antara arsitek dan kontraktor sehingga proyek selesai 100% presisi.',
            category: 'Inovasi Desain',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art3,
            published: true
        },
        {
            title: 'Keunggulan Fasad ACP (Aluminium Composite Panel) untuk Gedung Komersial',
            slug: 'keunggulan-fasad-acp-gedung-komersial',
            excerpt: 'Pemasangan ACP memberikan tampilan arsitektural modern sekaligus ketahanan cuaca ekstra pada gedung perkantoran.',
            content: 'Aluminium Composite Panel (ACP) menjadi pilihan favorit untuk fasad bangunan modern. Selain ringan dan fleksibel dibentuk, panel ACP memiliki daya tahan tinggi terhadap paparan sinar UV dan hujan asam di wilayah tropis.',
            category: 'Material & Eksterior',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art4,
            published: true
        },
        {
            title: 'Panduan Memilih Struktur Beton Bertulang vs Rangka Baja Structural',
            slug: 'panduan-struktur-beton-bertulang-vs-baja',
            excerpt: 'Setiap jenis struktur memiliki karakteristik beban dan efisiensi waktu yang berbeda sesuai fungsi bangunan.',
            content: 'Pemilihan struktur utama sangat menentukan keawetan dan biaya bangunan. Artikel ini mengulas perbandingan daya dukung beban, durasi pengerjaan, serta fleksibilitas tata ruang antara beton bertulang dan rangka baja WF.',
            category: 'Teknik Sipil',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art5,
            published: true
        },
        {
            title: 'Tips Menghitung Rencana Anggaran Biaya (RAB) Rumah Agar Bebas Overbudget',
            slug: 'tips-menghitung-rab-rumah-bebas-overbudget',
            excerpt: 'Menghindari pembengkakan biaya dengan perhitungan AHSP PUPR dan dana cadangan kontingensi yang terstruktur.',
            content: 'Perhitungan RAB yang akurat memerlukan rincian volume pekerjaan dan analisis harga satuan material yang tepat. Simak saran pakar estimator Arsi Karya dalam menyusun anggaran bangunan secara transparan.',
            category: 'Budget & Perencanaan',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art6,
            published: true
        },
        {
            title: 'Pentingnya Dokumen DED (Detailed Engineering Design) Sebelum Pembangunan',
            slug: 'pentingnya-dokumen-ded-sebelum-pembangunan',
            excerpt: 'Gambar DED presisi mencegah kesalahan teknis di lapangan dan mempermudah proses evaluasi tim tukang.',
            content: 'Dokumen DED mencakup gambar arsitektur, denah pembesian struktur, dan pembagian jalur titik listrik & air. Tanpa DED yang jelas, risiko deviasi fisik di lapangan akan jauh lebih besar.',
            category: 'Panduan Konstruksi',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art7,
            published: true
        },
        {
            title: 'Tren Arsitektur Modern Tropis: Sirkulasi Udara & Pencahayaan Alami',
            slug: 'tren-arsitektur-modern-tropis-sirkulasi-udara',
            excerpt: 'Menggabungkan bukaan inner courtyard dan kisi-kisi kayu untuk hunian sejuk hemat energi di Indonesia.',
            content: 'Konsep modern tropis merespons iklim panas humid dengan mengoptimalkan kisi-kisi angin dan bukaan atap tinggi. Hasilnya adalah hunian yang terang, sejuk alami, serta hemat penggunaan AC.',
            category: 'Inovasi Desain',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art8,
            published: true
        },
        {
            title: 'Langkah Pengurusan Izin Peruntukan Bangunan (PBG / IMB) di Kota Bandung',
            slug: 'langkah-pengurusan-pbg-imb-kota-bandung',
            excerpt: 'Persyaratan administratif dan teknis gambar arsitektur yang wajib disiapkan untuk izin PBG resmi.',
            content: 'Persetujuan Bangunan Gedung (PBG) menggantikan sistem IMB lama. Pelajari alur pendaftaran SIMBG, uji kelayakan teknis struktur, serta pengesahan gambar denah oleh arsitek berlisensi.',
            category: 'Legalitas & Perizinan',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art9,
            published: true
        },
        {
            title: 'Solusi Perkuatan Struktur & Waterproofing Rumah Usia Di Atas 10 Tahun',
            slug: 'solusi-perkuatan-struktur-waterproofing-rumah',
            excerpt: 'Metode injeksi beton epoxy dan membran waterproofing untuk mengatasi rembesan dinding dan retak rambut.',
            content: 'Bangunan tua membutuhkan peremajaan berkala pada lapisan kedap air dan perkuatan struktur kolom. Arsi Karya menguraikan langkah remediation teknis agar struktur kembali kokoh dan bebas bocor.',
            category: 'Tips Renovasi',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art10,
            published: true
        },
        {
            title: 'Desain Lansekap Taman Tropis & Hardscape Outdoor untuk Hunian Asri',
            slug: 'desain-lansekap-taman-tropis-hardscape',
            excerpt: 'Perpaduan batu alam andesit, dek kayu outdoor, dan sistem drainase resapan taman bebas becek.',
            content: 'Penataan area luar rumah tidak hanya mempercantik visual tetapi juga menyerap air hujan secara efektif. Pelajari pilihan jenis batu alam, pencahayaan taman hias, dan vegetasi penyaring polusi.',
            category: 'Material & Eksterior',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art11,
            published: true
        },
        {
            title: 'Standar Mutu Pengadaan Mebelair Kantor SNI untuk Efisiensi Kerja Staf',
            slug: 'standar-mutu-pengadaan-mebelair-kantor-sni',
            excerpt: 'Pemilihan meja kerja ergonomis dan partisi akustik yang tahan lama untuk fasilitas perkantoran.',
            content: 'Mebelair berkualitas meningkatkan kenyamanan dan produktivitas staf kantor. Arsi Karya membagikan standar pemilihan material HPL, rangka besi powder coating, dan busa cetak anti-kempes.',
            category: 'Interior & Perkantoran',
            author: 'Tim Arsi Karya',
            coverImageUrl: uploaded.art12,
            published: true
        }
    ];

    for (const a of articleDataList) {
        await db.insert(articles).values(a);
    }

    // 5. Seeding Testimonials (12 Items)
    console.log('\n--- 5. Seeding 12 Testimonials ---');
    await db.delete(testimonials);

    const testimonialDataList = [
        {
            clientName: 'Bpk. Erwan',
            clientRole: 'Pemilik Hunian "The Old Heritage"',
            quote: 'Kerja sama dengan Arsi Karya sangat memuaskan. Dari tahap perencanaan arsitektur hingga eksekusi kayu custom dan struktur beton, semuanya transparan dan tepat waktu.',
            projectName: 'Hunian Klasik Kolonial, Bandung',
            imageUrl: uploaded.avatar2,
            approved: true,
            published: true,
            sortOrder: 0
        },
        {
            clientName: 'Ibu Dewi',
            clientRole: 'Pemilik Hunian "The Verdant Pavilion"',
            quote: 'Sistem Design & Build Arsi Karya membuat saya tenang. Tidak ada biaya siluman dan koordinasi antara arsitek dengan kontraktor di lapangan berjalan sangat lancar.',
            projectName: 'Buah Batu Regensi, Bandung',
            imageUrl: uploaded.avatar1,
            approved: true,
            published: true,
            sortOrder: 1
        },
        {
            clientName: 'Bpk. Hyogi',
            clientRole: 'Pemilik Proyek Finishing Hunian',
            quote: 'Hasil pekerjaan finishing interior dan pengecatan sangat rapi. Pengawasan dari tim QC Arsi Karya benar-benar detail sampai ke bagian terpencil.',
            projectName: 'Finishing Rumah, Bandung',
            imageUrl: uploaded.avatar3,
            approved: true,
            published: true,
            sortOrder: 2
        },
        {
            clientName: 'Bpk. Rahmat Hidayat',
            clientRole: 'Pengelola Fasilitas KPPN Pekalongan',
            quote: 'Pemasangan fasad ACP gedung kantor kami selesai tepat jadwal dengan tingkat presisi tinggi. Komunikasi dan laporan progres mingguan dari tim Arsi Karya sangat profesional.',
            projectName: 'Fasad ACP KPPN Pekalongan',
            imageUrl: uploaded.avatar5,
            approved: true,
            published: true,
            sortOrder: 3
        },
        {
            clientName: 'Ibu Siska Amelia',
            clientRole: 'Ketua Tim HKT LLDIKTI Wilayah IV',
            quote: 'Renovasi ruang kerja dan treatment peredam suara kantor berjalan tanpa mengganggu aktivitas staf. Hasilnya sangat nyaman dan estetik.',
            projectName: 'Renovasi Ruang HKT LLDIKTI IV',
            imageUrl: uploaded.avatar4,
            approved: true,
            published: true,
            sortOrder: 4
        },
        {
            clientName: 'Bpk. Hendra Gunawan',
            clientRole: 'Direktur PT Logistik Subang Mandiri',
            quote: 'Pembangunan gudang rangka baja struktur presisi tinggi. Pondasi heavy duty dan pengerjaan konstruksi cepat sesuai kesepakatan kontrak.',
            projectName: 'Gudang Logistik Structural Steel, Subang',
            imageUrl: uploaded.avatar7,
            approved: true,
            published: true,
            sortOrder: 5
        },
        {
            clientName: 'Ibu Maya Ratnasari',
            clientRole: 'Pemilik Ruko Komersial Dago',
            quote: 'Renovasi fasad ruko membuat nilai sewa properti kami naik drastis. Desain arsitekturnya modern dan eksekusi lapangannya sangat bersih.',
            projectName: 'Fasad Ruko Komersial Dago, Bandung',
            imageUrl: uploaded.avatar6,
            approved: true,
            published: true,
            sortOrder: 6
        },
        {
            clientName: 'Bpk. Dr. Ir. Anton Wijaya',
            clientRole: 'Pemilik Villa Eco-Lodge Lembang',
            quote: 'Integrasi arsitektur villa dengan lanskap alam Lembang dikerjakan dengan sangat teliti. Material kayu sintetis dan outdoor deck kokoh tahan cuaca.',
            projectName: 'Villa & Landscape Resor Lembang',
            imageUrl: uploaded.avatar3,
            approved: true,
            published: true,
            sortOrder: 7
        },
        {
            clientName: 'Ibu Fitriani',
            clientRole: 'Pemilik Hunian Cluster Buah Batu',
            quote: 'Rumah impian 2 lantai kami dibangun dengan standar beton K-300 yang kokoh. Arsi Karya adalah rekomendasi terbaik untuk kontraktor hunian.',
            projectName: 'Cluster Residencia Buah Batu',
            imageUrl: uploaded.avatar8,
            approved: true,
            published: true,
            sortOrder: 8
        },
        {
            clientName: 'Bpk. Agus Setiawan',
            clientRole: 'Manajer Operasional Pabrik Tekstil',
            quote: 'Pekerjaan lantai perkerasan beton dan kanopi baja struktur diselesaikan tepat waktu sehingga pabrik kami bisa beroperasi sesuai target.',
            projectName: 'Pekerjaan Struktur Industri Rancaekek',
            imageUrl: uploaded.avatar2,
            approved: true,
            published: true,
            sortOrder: 9
        },
        {
            clientName: 'Ibu Dr. Ratna Juwita',
            clientRole: 'Pejabat Pembuat Komitmen Fasilitas Publik',
            quote: 'Renovasi fasilitas lapangan outdoor dan drainase dikerjakan dengan spesifikasi teknis SNI yang akurat. Laporan administrasi proyek lengkap.',
            projectName: 'Infrastruktur Outdoor LLDIKTI IV',
            imageUrl: uploaded.avatar4,
            approved: true,
            published: true,
            sortOrder: 10
        },
        {
            clientName: 'Bpk. Bambang Sutrisno',
            clientRole: 'Pemilik Residensial Bandung',
            quote: 'Pengalaman luar biasa menggunakan layanan Design & Build Arsi Karya. Biaya transparan dari awal hingga Berita Acara Serah Terima.',
            projectName: 'Hunian Residensial Bandung',
            imageUrl: uploaded.avatar5,
            approved: true,
            published: true,
            sortOrder: 11
        }
    ];

    for (const t of testimonialDataList) {
        await db.insert(testimonials).values(t);
    }

    // 6. Site Settings
    console.log('\n--- 6. Seeding Site Settings ---');
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

    console.log('\n✨ ALL DATA SEEDED SUCCESSFULLY! Cloudinary images & Neon DB are 100% updated with 10+ items per section!');
}

runSeed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
