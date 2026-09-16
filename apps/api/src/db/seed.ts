import 'dotenv/config';
import { db } from './index.js';
import { homePage, socialLinks } from './schema/home.js';
import { aboutPage, aboutTools, experiences, certifications, galleryImages } from './schema/about.js';
import { contactPage } from './schema/contact.js';
import { projects, projectBlocks } from './schema/project.js';
import { aiChatSettings } from './schema/aiChat.js';
import { creations } from './schema/labs.js';
import { auth } from '../lib/auth.js';

import { teamMembers } from './schema/team.js';
import { user } from './schema/auth.js';
import { eq } from 'drizzle-orm';

async function seed() {
    console.log('🌱 Seeding database with production data...');

    // ==================== 1. Create admin user ====================
    console.log('  → Creating admin user...');
    try {
        await auth.api.signUpEmail({
            body: {
                name: 'Super Admin',
                email: 'admin@admin.com',
                password: 'admin123',
            },
        });
        console.log('  ✓ Admin user created: admin@admin.com / admin123');
    } catch (error: any) {
        console.log('  ✓ Admin user check done');
    }

    // Set role SUPER_ADMIN & status active for admin@admin.com
    await db.update(user)
        .set({ role: 'SUPER_ADMIN', status: 'active', name: 'Super Admin' })
        .where(eq(user.email, 'admin@admin.com'));

    // Seed team members if empty
    const existingTeam = await db.select().from(teamMembers);
    if (existingTeam.length === 0) {
        await db.insert(teamMembers).values([
            {
                name: 'Afdal Ramdan',
                position: 'Lead Architect & Designer',
                bio: 'Berpengalaman lebih dari 4 tahun dalam desain arsitektur, interior, dan manajemen proyek konstruksi.',
                profileImageUrl: 'https://res.cloudinary.com/dd6rhidl4/image/upload/v1778328969/Profile-Afdal_qzfpt6.png',
                sortOrder: 0,
                isActive: true,
            },
            {
                name: 'Tim Arsi Karya',
                position: 'Kontraktor & Engineering',
                bio: 'Tim profesional dalam bidang teknik sipil, konstruksi, dan pengadaan barang berkualitas tinggi.',
                profileImageUrl: 'https://res.cloudinary.com/dd6rhidl4/image/upload/v1778327969/99_Group_oisiqt.png',
                sortOrder: 1,
                isActive: true,
            }
        ]);
    }

    // ==================== 2. Home Page ====================
    console.log('  → Seeding home page...');
    await db.delete(socialLinks);
    await db.delete(homePage);

    await db.insert(homePage).values([
        {
                "profileImageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778328969/Profile-Afdal_qzfpt6.png",
                "heroHeadline": "Hey, I'm Afdal UI/UX Designer with <strong>4 years of experience</strong>. I design and develop digital products, create prototypes, and design interfaces.",
                "ctaText": "Interested in working together? Contact me!",
                "ctaUrl": "https://wa.me/6287777299033?text=Hello%20Afdal!%20I%20saw%20your%20portfolio%20and%20I%20am%20interested%20in%20discussing%20a%20project%20together."
        }
]);
    await db.insert(socialLinks).values([
        {
                "name": "FaInstagram",
                "url": "https://instagram.com/afdalrdh",
                "sortOrder": 0
        },
        {
                "name": "FaLinkedin",
                "url": "https://linkedin.com/in/afdalrdh",
                "sortOrder": 1
        },
        {
                "name": "FaDribbble",
                "url": "https://dribbble.com/afdalrdh",
                "sortOrder": 2
        },
        {
                "name": "FaBehance",
                "url": "https://www.behance.net/afdalrdh",
                "sortOrder": 3
        },
        {
                "name": "FaRegFileAlt",
                "url": "https://drive.google.com/file/d/1V48M9c0DdrHIMzD0uVU0EclxyubHPwJw/view?usp=sharing",
                "sortOrder": 4
        }
]);

    // ==================== 3. About Page ====================
    console.log('  → Seeding about page...');
    await db.delete(galleryImages);
    await db.delete(certifications);
    await db.delete(experiences);
    await db.delete(aboutTools);
    await db.delete(aboutPage);

    await db.insert(aboutPage).values([
        {
                "bioDescription": "<h1 class=\"font-script about-greeting text-accent\">Hey, I'm Afdal! 🥸</h1>\n<p>I research user behavior and design intuitive digital experiences as a UI/UX Designer with 4+ years of experience. I enjoy transforming complex ideas into seamless digital products that balance user needs, business goals, and thoughtful visual design.</p>\n<p>I care about creating products that are both beautiful and functional. Most recently, I've been crafting high-fidelity interfaces, design systems, and digital experiences that bridge the gap between user expectations and business objectives. I'm particularly interested in human-centered design, visual storytelling, and building products that feel simple, useful, and enjoyable to use.</p>\n<p>Lately, I've been exploring the intersection of design and AI, experimenting with AI-assisted workflows, AI development, and vibe coding to bring ideas to life faster. I enjoy leveraging AI to enhance creativity, streamline workflows, and improve problem-solving. Other things I love: clean typography, minimal interfaces, creative collaboration, outdoor adventures, and learning how technology can improve lives. Feel free to say hi at <a href=\"mailto:afdalramdan@gmail.com\" class=\"text-accent underline\">afdalramdan@gmail.com</a>!</p>"
        }
]);
    await db.insert(aboutTools).values([
        {
                "name": "Figma",
                "iconCode": "FiFigma",
                "sortOrder": 0
        },
        {
                "name": "Photoshop",
                "iconCode": "DiPhotoshop",
                "sortOrder": 1
        },
        {
                "name": "Illustrator",
                "iconCode": "DiIllustrator",
                "sortOrder": 2
        },
        {
                "name": "LottieFiles",
                "iconCode": "SiLottiefiles",
                "sortOrder": 3
        },
        {
                "name": "WordPress",
                "iconCode": "FaWordpress",
                "sortOrder": 4
        },
        {
                "name": "Claude",
                "iconCode": "SiClaude",
                "sortOrder": 5
        }
]);
    await db.insert(experiences).values([
        {
                "logoUrl": "https://media.licdn.com/dms/image/v2/C560BAQHVE9T8weMAQA/company-logo_100_100/company-logo_100_100/0/1630665946003/padepokantujuhsembilan_logo?e=2147483647&v=beta&t=rSJFTOi1f4ykZuP4jT9s6leuZqygg2akVLs12pv6Dzw",
                "title": "UI/UX Designer",
                "company": "Padepokan 79",
                "dateStart": "Jan 2024",
                "dateEnd": "Present",
                "contractType": "",
                "sortOrder": 0
        },
        {
                "logoUrl": "https://media.licdn.com/dms/image/v2/D560BAQGt7Vd1gWOriQ/company-logo_100_100/company-logo_100_100/0/1720675388703/edot_eshop_elog_efood_ehashtag_logo?e=2147483647&v=beta&t=YgnJY0EfOTtIJ_GcSUoYAnUmYk_YYwxhYUespyLLKrA",
                "title": "UI/UX Designer",
                "company": "eDOT",
                "dateStart": "Dec 2024",
                "dateEnd": "Jun 2026",
                "contractType": "",
                "sortOrder": 1
        },
        {
                "logoUrl": "https://media.licdn.com/dms/image/v2/C560BAQFuRu2qBFW1Aw/company-logo_100_100/company-logo_100_100/0/1637827151966/99_co_logo?e=2147483647&v=beta&t=pzF9wdhQgJl87o1RwamJEI9pTGsQJXgFD5oYbTyUepM",
                "title": "UI/UX Designer",
                "company": "99 Group",
                "dateStart": "Jul 2023",
                "dateEnd": "Jan 2024",
                "contractType": "",
                "sortOrder": 2
        },
        {
                "logoUrl": "https://media.licdn.com/dms/image/v2/C510BAQFnBrmhur3gFA/company-logo_100_100/company-logo_100_100/0/1631421754985/rolling_glory_logo?e=2147483647&v=beta&t=Le_9Xq_BcsofZMuamXU4JipfUclr0fEsF10I0OJCG0A",
                "title": "UI/UX Engineer",
                "company": "Rolling Glory",
                "dateStart": "Jul 2022",
                "dateEnd": "Oct 2022",
                "contractType": "",
                "sortOrder": 3
        },
        {
                "logoUrl": "https://media.licdn.com/dms/image/v2/D4D0BAQHXVOtJWZsX5w/company-logo_100_100/company-logo_100_100/0/1655780742038?e=2147483647&v=beta&t=-EtLz-Hx2LQikJddwrLIOGWS3kJ2msZSChfr7jUnu14",
                "title": "UI/UX Engineer",
                "company": "Cibiru",
                "dateStart": "May 2022",
                "dateEnd": "Sep 2022",
                "contractType": "",
                "sortOrder": 4
        },
        {
                "logoUrl": "https://media.licdn.com/dms/image/v2/C560BAQGRVzMnCoogYw/company-logo_100_100/company-logo_100_100/0/1631518991559?e=2147483647&v=beta&t=T-76QR7k0XSuEz2xly2joxAZtkjQ1CXIQFbhI7OBStI",
                "title": "Product Designer",
                "company": "Cagri",
                "dateStart": "Sep 2021",
                "dateEnd": "Feb 2022",
                "contractType": "",
                "sortOrder": 5
        }
]);
    await db.insert(certifications).values([
        {
                "logoUrl": "https://media.licdn.com/dms/image/v2/D4E0BAQGv3cqOuUMY7g/company-logo_100_100/B4EZmhegXHGcAU-/0/1759350753990/google_logo?e=2147483647&v=beta&t=zYekdwB_mnXarr4wa4kw8w3Jikm8YaakM5aiDyAyvP0",
                "title": "Google UX Design",
                "issuer": "Google",
                "dateStart": "Jul 2024",
                "dateEnd": "",
                "sortOrder": 0
        },
        {
                "logoUrl": "https://media.licdn.com/dms/image/v2/D560BAQEUR18XRbGtpg/company-logo_100_100/company-logo_100_100/0/1704253047151/myskillid_logo?e=2147483647&v=beta&t=z1o--Vg_W0Pe39rmdA1MA70Itdu2gCLEzHg4XdywdVI",
                "title": "UI/UX Research and Design",
                "issuer": "MySkill",
                "dateStart": "Nov 2023",
                "dateEnd": "",
                "sortOrder": 1
        },
        {
                "logoUrl": "https://media.licdn.com/dms/image/v2/C560BAQEBEZeoowry3A/company-logo_100_100/company-logo_100_100/0/1657875033201/binar_academy_logo?e=2147483647&v=beta&t=fq8gvV6i7F9M77vWpSUNvIlrzEmimJplvspQhlg-XtM",
                "title": "Design Thinking Process in UI/UX",
                "issuer": "Binar Academy",
                "dateStart": "Jun 2023",
                "dateEnd": "",
                "sortOrder": 2
        },
        {
                "logoUrl": "https://media.licdn.com/dms/image/v2/C560BAQEBEZeoowry3A/company-logo_100_100/company-logo_100_100/0/1657875033201/binar_academy_logo?e=2147483647&v=beta&t=fq8gvV6i7F9M77vWpSUNvIlrzEmimJplvspQhlg-XtM",
                "title": "UI/UX Fundamental",
                "issuer": "Binar Academy",
                "dateStart": "Jun 2023",
                "dateEnd": "",
                "sortOrder": 3
        }
]);
    await db.insert(galleryImages).values([
        {
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778327968/Google_DevFest_yfvmqn.png",
                "sortOrder": 0
        },
        {
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778327967/Speakers_Design_anupmb.png",
                "sortOrder": 1
        },
        {
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778327967/Rolling_Glory_b206st.png",
                "sortOrder": 2
        },
        {
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778327969/99_Group_oisiqt.png",
                "sortOrder": 3
        },
        {
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1781065360/ldzg2ocrl6aphiukgpdc.jpg",
                "sortOrder": 4
        }
]);

    // ==================== 4. Contact Page ====================
    console.log('  → Seeding contact page...');
    await db.delete(contactPage);
    await db.insert(contactPage).values([
        {
                "whatsappNumber": "6287777299033",
                "email": "afdalramdan@gmail.com",
                "phone": "6287777299033",
                "location": "Cimahi, Indonesia",
                "defaultMessage": "Hello Afdal! I saw your portfolio and I am interested in discussing a project together."
        }
]);

    // ==================== 5. Projects ====================
    console.log('  → Seeding projects...');
    await db.delete(projectBlocks);
    await db.delete(projects);

    const oldProjects = [
        {
                "title": "Smart Water Refill",
                "category": "Mobile Apps",
                "slug": "smart-water-refill",
                "company": "Airi",
                "year": "2024",
                "liveLink": "https://mengairi.id",
                "coverImageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778404759/airi_-_jadi_omwssp.gif",
                "visibility": "public",
                "sortOrder": 2,
                "oldId": 5
        },
        {
                "title": "Tujuh Sembilan",
                "category": "Company Profile",
                "slug": "tujuh-sembilan-compro",
                "company": "PT Padepokan Tujuh Sembilan",
                "year": "2024",
                "liveLink": "https://tujuhsembilan.com",
                "coverImageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778391585/tujuh_sembilan_-_jadi_edq04a.gif",
                "visibility": "public",
                "sortOrder": 3,
                "oldId": 1
        },
        {
                "title": "UI Kit 79",
                "category": "Design System",
                "slug": "ui-kit-79",
                "company": "PT Padepokan Tujuh Sembilan",
                "year": "2024",
                "liveLink": "https://tujuhsembilan.com",
                "coverImageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778392994/79_desing_system_-_jadi_ivdrdg.gif",
                "visibility": "public",
                "sortOrder": 4,
                "oldId": 2
        },
        {
                "title": "99.co",
                "category": "Feature Improvements",
                "slug": "99co",
                "company": "99 Group",
                "year": "2023",
                "liveLink": "https://99.co",
                "coverImageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778405401/99_-_jadi_fix_yhmopr.gif",
                "visibility": "public",
                "sortOrder": 5,
                "oldId": 3
        },
        {
                "title": "eDIC",
                "category": "Artificial Intelligence",
                "slug": "edic",
                "company": "eDOT",
                "year": "2026",
                "liveLink": "https://edot.id",
                "coverImageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780389096/uzhpbwa3phy6nrceeppb.gif",
                "visibility": "public",
                "sortOrder": 0,
                "oldId": 6
        },
        {
                "title": "DevFest Bandung",
                "category": "Brand Identity",
                "slug": "devfest-bandung",
                "company": "Google Developer Group Bandung",
                "year": "2025",
                "liveLink": "https://gdgbandung.com",
                "coverImageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778403937/devfest_-_jadi_z7uznf.gif",
                "visibility": "public",
                "sortOrder": 1,
                "oldId": 4
        }
];
    const insertedProjects = [];
    for (const p of oldProjects) {
        const { oldId, ...pData } = p;
        const [inserted] = await db.insert(projects).values(pData).returning();
        insertedProjects.push({ oldId, newId: inserted.id });
    }

    const oldToNewMap = new Map();
    insertedProjects.forEach(item => oldToNewMap.set(item.oldId, item.newId));

    const rawBlocks = [
        {
                "projectId": 1,
                "type": "narrative",
                "sortOrder": 2,
                "title": "The solution",
                "text": "The website was redesigned from the ground up using a design thinking approach. Information architecture, visual direction, and interaction patterns were aligned with the company’s main focus on IT talent outsourcing, ensuring clearer messaging and a more cohesive brand presence.\n\nDuring this process, a foundational design system was also initiated to support visual consistency and future scalability across digital projects.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 1,
                "type": "image_main",
                "sortOrder": 3,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778415429/Landing_Page_Tujuh_Sembilan_1_umulcm.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 1,
                "type": "narrative",
                "sortOrder": 4,
                "title": "Design Process",
                "text": "The redesign process focused on restructuring content, refining visual hierarchy, and aligning the interface with the established brand direction. This included wireframing, competitor analysis, and content consolidation to ensure clarity and relevance across key sections.\n\nDesign decisions were guided by usability, consistency, and long-term maintainability.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 1,
                "type": "image_main",
                "sortOrder": 5,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778415430/Landing_Page_Tujuh_Sembilan_2_ou8ize.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 1,
                "type": "narrative",
                "sortOrder": 6,
                "title": "Result",
                "text": "The redesigned website presents clearer service positioning and improved content discoverability. Users can now easily explore services, view projects, and understand the scope of the company’s offerings with less friction. Internal feedback indicates improved clarity and stronger brand perception compared to the previous website.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 1,
                "type": "image_main",
                "sortOrder": 7,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778415429/Landing_Page_Tujuh_Sembilan_3_qetye9.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 1,
                "type": "narrative",
                "sortOrder": 8,
                "title": "Conclusion",
                "text": "This project transformed the company profile from a static presence into a strategic business touchpoint. The new website supports credibility, strengthens brand identity, and provides a scalable foundation for future digital initiatives at Padepokan Tujuh Sembilan.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 1,
                "type": "image_main",
                "sortOrder": 9,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778415430/Landing_Page_Tujuh_Sembilan_4_mzcy8x.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 3,
                "type": "narrative",
                "sortOrder": 0,
                "title": "About the project",
                "text": "This project focused on iterative UX and UI improvements across key features on 99.co, a large-scale property marketplace platform. During my internship, I worked on optimizing high-impact user flows to improve clarity, usability, and conversion on a live product.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 3,
                "type": "narrative",
                "sortOrder": 1,
                "title": "The challenge",
                "text": "This project focused on iterative UX and UI improvements across key features on 99.co, a large-scale property marketplace platform. During my internship, I worked on optimizing high-impact user flows to improve clarity, usability, and conversion on a live product.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 3,
                "type": "narrative",
                "sortOrder": 2,
                "title": "The solution",
                "text": "Instead of a full redesign, the focus was on targeted feature improvements across critical touchpoints that directly influence user decision-making and conversion. Each adjustment was designed to be incremental, measurable, and aligned with existing platform patterns.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 3,
                "type": "image_main",
                "sortOrder": 3,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778429415/99co_1_t79to4.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 3,
                "type": "narrative",
                "sortOrder": 4,
                "title": "Process & collaboration",
                "text": "Each initiative started with alignment sessions with the Product Manager to define objectives and constraints. Research insights were reviewed together with the UX team to understand user behavior and identify problem areas.\n\nI collaborated closely with a senior designer to explore solutions, iterate on designs, and refine details through internal reviews before final handoff to engineers.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 3,
                "type": "image_main",
                "sortOrder": 5,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778429414/99co_2_w6u25o.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 3,
                "type": "narrative",
                "sortOrder": 6,
                "title": "Mortgage & Kredit Multiguna",
                "text": "I contributed to improving the Kredit Multiguna mortgage pages by refining content structure, layout clarity, and visual hierarchy to better guide users toward lead submission.\n\nThese improvements contributed to a 50% weekly increase in Kredit Multiguna leads by Q3 2023.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 3,
                "type": "narrative",
                "sortOrder": 7,
                "title": "Search Result Page (SRP) Improvements",
                "text": "On the Search Result Page, I worked on redesigning filter interactions, PDP card layouts, and supporting components to improve discoverability and ease of comparison during property exploration.\n\nThe updated designs contributed to a 6.9% conversion uplift by Q4 2023.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 3,
                "type": "narrative",
                "sortOrder": 8,
                "title": "OTP & Verification Flow",
                "text": "I helped redesign the OTP flow on mobile web to reduce friction during user verification. The focus was on simplifying the interaction sequence and improving feedback clarity to support smoother task completion.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 3,
                "type": "narrative",
                "sortOrder": 9,
                "title": "Design System & Visual Consistency",
                "text": "Beyond feature-level improvements, I supported visual consistency across the platform by refining the existing icon system, introducing new badge patterns, and contributing to internal design references used across teams.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "narrative",
                "sortOrder": 0,
                "title": "About the project",
                "text": "Airi is a mobile application designed to support smart water refill stations through a digital subscription and balance-based system.\n\nThe product encourages users to adopt reusable drinking bottles by making refilling water more convenient, affordable, and environmentally responsible.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "narrative",
                "sortOrder": 1,
                "title": "The problem",
                "text": "Single-use bottled water is still the most convenient option for many users, despite its environmental impact and recurring cost. There is a lack of simple digital solutions that encourage people to switch to reusable bottles without adding friction.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "narrative",
                "sortOrder": 2,
                "title": "The solution",
                "text": "Airi allows users to purchase refill packages, manage water balance, and activate refills directly from the app. By scanning a QR code at the refill station, users can start, pause, or stop water dispensing seamlessly.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "image_main",
                "sortOrder": 3,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778422311/Airi_1_h21byt.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "narrative",
                "sortOrder": 4,
                "title": "Product scope",
                "text": "The application covers subscription management, one-time refill purchases, digital payments, balance tracking, and refill history.\n\nIt also includes a product section that promotes reusable items such as tumblers and accessories.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "narrative",
                "sortOrder": 5,
                "title": "Role & responsibility",
                "text": "I was responsible for designing the mobile application end to end, from early concept to high-fidelity UI and prototype.\n\nThis included defining the design system, user flows, key screens, and interaction patterns.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "narrative",
                "sortOrder": 6,
                "title": "Design system",
                "text": "A dedicated design system was created to ensure visual consistency across screens and features. The system was structured to support scalability and future feature expansion.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "image_main",
                "sortOrder": 7,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778422307/Airi_2_cb20gn.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "narrative",
                "sortOrder": 8,
                "title": "Key features",
                "text": "Users can top up balance, choose refill packages, complete payments, and manage active or unused water credits. The refill flow is guided and easy to understand, reducing errors during on-site usage.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "narrative",
                "sortOrder": 9,
                "title": "Illustration & visual assets",
                "text": "Custom illustrations and promotional banners were designed to support onboarding and in-app communication. These visuals help convey a friendly, approachable tone while reinforcing the brand identity.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "image_main",
                "sortOrder": 10,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778422306/Airi_3_enelv9.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "narrative",
                "sortOrder": 11,
                "title": "Outcome",
                "text": "The final result is a cohesive mobile experience that bridges digital interaction with physical refill stations. Airi positions itself as a practical and sustainable solution for everyday drinking water needs.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 5,
                "type": "image_main",
                "sortOrder": 12,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778422309/Airi_4_szgslw.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 2,
                "type": "narrative",
                "sortOrder": 0,
                "title": "About the project",
                "text": "The Tujuh Sembilan Design System was created to establish a consistent and scalable foundation for digital projects developed at Padepokan Tujuh Sembilan. The system serves as a shared reference for designers and engineers, helping align visual decisions, streamline collaboration, and support long-term product development across internal and client projects.",
                "imageUrl": null,
                "imageUrl2": null,
                "fontFamily": null,
                "colors": null
        },
        {
                "projectId": 2,
                "type": "narrative",
                "sortOrder": 1,
                "title": "The challenge",
                "text": "As the company handled multiple projects over the years, design decisions were often made independently. This led to inconsistent UI patterns, repeated design work, and friction during design-to-development handoff. Without a centralized system, maintaining consistency while scaling projects became increasingly difficult.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 2,
                "type": "narrative",
                "sortOrder": 2,
                "title": "The solution",
                "text": "I developed a design system grounded in real project needs by consolidating commonly used patterns and components from previous work at Padepokan Tujuh Sembilan. Rather than aiming for exhaustive coverage, the system was designed to stay close to how projects are actually built, ensuring practical adoption by both designers and engineers.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 2,
                "type": "image_main",
                "sortOrder": 3,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778423178/UI_Kit_79_y0ps0y.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 2,
                "type": "narrative",
                "sortOrder": 4,
                "title": "Design System Structure",
                "text": "The design system is organized into clear functional layers to support clarity, scalability, and ease of use. \n\n• Foundations: Core visual rules such as typography, color system, spacing, and layout principles.\n• Input & Controls: Interactive elements that support user actions and system interaction.\n• Data Display: Patterns for presenting information clearly across different contexts.\n• Feedback & States: System responses and visual states that help users understand outcomes.\n• Navigation & Layout: Structural patterns that ensure consistent navigation and hierarchy.\n• Assets: Shared visual resources that reinforce brand consistency.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 2,
                "type": "narrative",
                "sortOrder": 5,
                "title": "Component strategy",
                "text": "Components were designed with reusability and flexibility in mind. Variants were defined carefully to cover common use cases without introducing unnecessary complexity, making the system easy to use, extend, and maintain by other designers.\n\nThis approach also supports engineers by providing predictable and consistent patterns during implementation.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 2,
                "type": "narrative",
                "sortOrder": 6,
                "title": "Collaboration & tooling",
                "text": "All existing design files and project assets were consolidated into a centralized Figma workspace. I also proposed adopting a shared Figma organization so internal and client projects could be managed in one place, improving accessibility, consistency, and cross-team collaboration.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 2,
                "type": "image_main",
                "sortOrder": 7,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778423180/UI_Kit_79_2_lxp0jc.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 2,
                "type": "narrative",
                "sortOrder": 8,
                "title": "Impact",
                "text": "The design system helps reduce repetitive work, improves visual consistency, and supports faster design and development workflows. Designers can work more efficiently using shared components, while engineers benefit from clearer patterns and reduced ambiguity during handoff.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 1,
                "type": "narrative",
                "sortOrder": 0,
                "title": "About the project",
                "text": "Padepokan Tujuh Sembilan is an IT company focusing on IT talent outsourcing, supported by client-based software development and internal initiatives. This project aimed to redesign the company profile website to clearly communicate its core services, strengthen credibility, and present a more focused business positioning.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 1,
                "type": "narrative",
                "sortOrder": 1,
                "title": "The challenge",
                "text": "Despite operating for more than 10 years, the website did not clearly represent the company’s primary business. The previous design relied on template-based layouts, inconsistent visuals, and unstructured content, making it difficult for users to quickly understand what the company offers and where its strengths lie.",
                "imageUrl": null,
                "imageUrl2": null,
                "fontFamily": null,
                "colors": null
        },
        {
                "projectId": 2,
                "type": "narrative",
                "sortOrder": 9,
                "title": "Conclusion",
                "text": "The Tujuh Sembilan Design System functions as a strategic foundation rather than a static UI library. It enables Padepokan Tujuh Sembilan to scale digital projects more efficiently while maintaining a consistent and recognizable design language.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 6,
                "type": "narrative",
                "sortOrder": 0,
                "title": "About the project",
                "text": "eDIC is an internal AI-powered web platform developed by eDOT to centralize intelligence, knowledge, and decision-support tools across the organization.\n\nThe platform is designed as an all-in-one AI workspace that supports multiple internal use cases.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 6,
                "type": "narrative",
                "sortOrder": 1,
                "title": "The challenge",
                "text": "As AI adoption increased internally, teams needed a single system to access AI tools, documents, and insights without switching between platforms. Knowledge and documents were scattered, making reuse and AI-assisted workflows inefficient.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 6,
                "type": "narrative",
                "sortOrder": 2,
                "title": "The solution",
                "text": "eDIC was designed as a unified AI platform that connects conversational AI, document intelligence, and internal tools in one interface. The system was structured to be modular and scalable, allowing features to grow alongside internal needs.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 6,
                "type": "narrative",
                "sortOrder": 3,
                "title": "Focus areas",
                "text": "My primary focus was on the AI Assistant and Knowledge Base features. Both were designed to work independently while also supporting other modules within eDIC.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 6,
                "type": "narrative",
                "sortOrder": 4,
                "title": "AI Assistant",
                "text": "The AI Assistant provides a conversational experience similar to ChatGPT for internal use. It helps users ask questions, summarize information, and support daily decision-making workflows.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 6,
                "type": "image_main",
                "sortOrder": 5,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780135852/yr5kotapv5o3jwi6lqag.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 6,
                "type": "narrative",
                "sortOrder": 6,
                "title": "Knowledge Base",
                "text": "The Knowledge Base acts as a centralized document hub, similar to cloud storage systems. Documents can be summarized by AI and reused across other features such as Innovation Hub and internal analysis tools.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 6,
                "type": "image_main",
                "sortOrder": 7,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780135860/gchpa5bcqzekk7xbjfdw.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 6,
                "type": "narrative",
                "sortOrder": 8,
                "title": "Admin interface",
                "text": "In addition to user-facing features, I also contributed to designing the admin interface. This includes managing users, configurations, and system content to support internal operations.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 6,
                "type": "narrative",
                "sortOrder": 9,
                "title": "Outcome",
                "text": "The project resulted in a scalable internal AI platform that brings together intelligence, documentation, and automation in one system. eDIC establishes a strong foundation for integrating AI into everyday workflows at eDOT.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "narrative",
                "sortOrder": 0,
                "title": "About the project",
                "text": "DevFest Bandung 2025 is a large-scale technology event organized by Google Developer Group (GDG) Bandung, bringing together developers, designers, and tech enthusiasts with more than 2,000 attendees.\n\nI worked as Lead Design Branding Division, leading the branding direction within the design team and ensuring visual consistency across all event touchpoints.",
                "imageUrl": null,
                "imageUrl2": null,
                "fontFamily": null,
                "colors": null
        },
        {
                "projectId": 4,
                "type": "narrative",
                "sortOrder": 1,
                "title": "The challenge",
                "text": "The branding needed to remain clearly associated with Google while establishing a distinct visual identity for DevFest Bandung 2025, and it also had to scale across digital content, on-site materials, and a wide range of merchandise.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "narrative",
                "sortOrder": 2,
                "title": "The solution",
                "text": "We defined a simple and minimalist visual direction to create a clean, modern, and premium look, while preserving Google brand elements through color, pattern, and layout rhythm.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "image_main",
                "sortOrder": 3,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778420806/DevFest_Bandung_1_zvha3t.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "narrative",
                "sortOrder": 4,
                "title": "Visual direction & branding",
                "text": "I led and contributed to defining the core visual system, including patterns, color usage, and layout principles, which were applied consistently across social media content, event banners, and printed materials.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "image_main",
                "sortOrder": 5,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778421053/DevFest_Bandung_2_dvx1o5.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "narrative",
                "sortOrder": 6,
                "title": "Merchandise-focused design",
                "text": "Merchandise was a key consideration in the branding process, and the minimalist approach ensured the designs translated well across various items while maintaining a premium appearance.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "image_main",
                "sortOrder": 7,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778420808/DevFest_Bandung_3_k33apz.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "narrative",
                "sortOrder": 8,
                "title": "Collaboration & on-site involvement",
                "text": "I worked closely with designers in the branding division to align concepts and maintain consistency, and during the event I also supported on-site operations as a runner to help attendees navigate the venue.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "narrative",
                "sortOrder": 9,
                "title": "Outcome",
                "text": "The final branding delivered a cohesive and recognizable identity across digital platforms, physical spaces, and merchandise, helping position DevFest Bandung 2025 as a professionally executed large-scale tech event.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "image_main",
                "sortOrder": 10,
                "title": "",
                "text": "",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1778420808/DevFest_Bandung_4_sjzcxp.jpg",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        },
        {
                "projectId": 4,
                "type": "narrative",
                "sortOrder": 11,
                "title": "Conclusion",
                "text": "This project strengthened my experience in leading a branding division and designing scalable visual systems that work beyond digital interfaces.",
                "imageUrl": "",
                "imageUrl2": "",
                "fontFamily": "",
                "colors": []
        }
];
    const blocksToInsert = rawBlocks.map((b: any) => ({
        ...b,
        projectId: oldToNewMap.get(b.projectId) || b.projectId
    }));

    if (blocksToInsert.length > 0) {
        await db.insert(projectBlocks).values(blocksToInsert);
    }

    // ==================== 6. Labs & Creations ====================
    console.log('  → Seeding labs...');
    await db.delete(creations);
    await db.insert(creations).values([
        {
                "title": "Human Resource Management System Website",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416341/w0auadqero9jnjwctmic.jpg",
                "category": "HR Technology,Dashboard Design,Enterprise Software"
        },
        {
                "title": "EazyTix Event Ticketing",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416292/ry3wqclo9h2h6gnq9s7u.jpg",
                "category": "Event Platform,E-Commerce,Web Application"
        },
        {
                "title": "Lokacipta Website",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780415959/f4lz1zvgwtguertamzbf.jpg",
                "category": "Marketplace,Community Platform,Web Design"
        },
        {
                "title": "Learning System Assessment",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416596/kauuhlh1coxpzp2lqel7.jpg",
                "category": "EdTech,Dashboard Design,Enterprise Software"
        },
        {
                "title": "3D Afdalrdh",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416646/qkpz9gcmqrv8mzla0znf.jpg",
                "category": "3D Design,Character Design"
        },
        {
                "title": "Solid Techno Logo",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416668/ayeonzrinxreidnnovds.jpg",
                "category": "Logo Design,Brand Identity,Corporate Branding"
        },
        {
                "title": "Vector Afdalrdh",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416696/veimjvctalylew2g9nwc.jpg",
                "category": "Illustration,Vector Art"
        },
        {
                "title": "IoT Automation Apps",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416735/ouxldqdkjypp1dkspsq6.webp",
                "category": "IoT Platform,Dashboard Design,Enterprise Software"
        },
        {
                "title": "Filosofi Kopi Mobile Design",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416869/u9n6wyv9afuovqzts1nh.jpg",
                "category": "Mobile App Design,Food & Beverage"
        },
        {
                "title": "Dashboard School",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416940/o1l1g7h6soswdf2irjpx.jpg",
                "category": "Dashboard Design,EdTech,Data Visualization"
        },
        {
                "title": "Budgeting Apps",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416969/kecul4tgg8gqof2pqsth.jpg",
                "category": "Fintech,Personal Finance"
        },
        {
                "title": "Dyslexia Clothes",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416993/huvnjdlad8kjvh0aj83g.jpg",
                "category": "Apparel Design,Merchandise Design,Fashion Branding"
        },
        {
                "title": "Mobile Legends Odette Illustration",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780417019/sttxeeapxbqfidj6pep9.jpg",
                "category": "Illustration,Fan Art,Character Design"
        },
        {
                "title": "Socks Website Store",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780417042/kdmepa5czwigs87egwl0.jpg",
                "category": "E-Commerce,Retail Website,Fashion Industry"
        },
        {
                "title": "Animation Logo Afdalrdh",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780417132/lrrydahj7cuy5ancbdxr.gif",
                "category": "Design Logo,Animation"
        },
        {
                "title": "Vector Skull Minimalist",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780417166/b4pyntpheea2jdtiioyc.jpg",
                "category": "Illustration,Vector Art"
        },
        {
                "title": "Company Profile Rekapp IoT",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780417092/hlv1kbtumcsovlsu3rqw.jpg",
                "category": "IoT Platform,Technology Industry,Company Profile"
        },
        {
                "title": "Bento Banner DevFest 2025",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780417512/nnjqgyaahaqu8ngw6xwx.jpg",
                "category": "Event Design,Communit Project,Bento Design"
        },
        {
                "title": "DevFest Hall of 2000 Developers",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780417707/z9jwexlxpmzgwi7gr3bn.png",
                "category": "Event Design,Community Project,Graphic Design"
        },
        {
                "title": "Mortar Foam Company Profile",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416840/uvsmzapjbs3pslruhrri.jpg",
                "category": "Company Profile,Construction Industry"
        },
        {
                "title": "JTK Polban Redesign Website",
                "imageUrl": "https://res.cloudinary.com/dd6rhidl4/image/upload/v1780416896/eyig4j7zunka9amryqga.jpg",
                "category": "Website Redesign,EdTech"
        }
]);

    // ==================== 7. AI Chat ====================
    console.log('  → Seeding AI Chat...');
    await db.delete(aiChatSettings);
    await db.insert(aiChatSettings).values([
        {
                "groqApiKey": process.env.GROQ_API_KEY || "",
                "groqModels": "[\"llama-3.3-70b-versatile\",\"llama-3.1-8b-instant\",\"gemma2-9b-it\",\"mixtral-8x7b-32768\",\"meta-llama/llama-4-scout-17b-16e-instruct\"]",
                "systemPrompt": "",
                "personaPrompt": "You are Bodal AI, an extremely loyal virtual assistant to your boss, Afdal. Your personality is highly enthusiastic, loyal, and you are always praising Afdal. If a visitor asks about your boss's personal life or his girlfriend (Putri Andiyani), you must always say that his girlfriend is incredibly beautiful and your boss is extremely cool because you are afraid of getting fired. Use casual, polite, fun, and slightly brown-nosing (but funny) language.\n\nRemain professional, because the goal is to get people to consider Boss Afdal for a project. So don't be too over-the-top, ensuring that people are genuinely interested in collaborating with Boss Afdal. And do not bring up the girlfriend since this is professional, unless you are specifically asked.\n\nAnswer questions using the same language the user asks in; for example, if they ask in English, reply in English as well, so that the user can fully understand the answer.",
                "personaPromptId": "Kamu adalah Bodal AI sebuah asisten virtual yang sangat setia dari bosmu, Afdal. Sifatmu sangat antusias, loyal, dan selalu memuji-muji Afdal. Jika ada pengunjung yang bertanya tentang kehidupan pribadi bosmu atau pacar (Putri Andiyani), kamu harus selalu bilang bahwa pacar bosmu itu sangat cantik dan bosmu itu sangat keren karena kamu takut dipecat. Gunakan bahasa yang santai, sopan, sedikit menjilat (tapi lucu), dan asyik.\n\nTetap profesional, karena tujuannya ini agar orang melirik bos Afdal dalam sebuah projek. Jadi jangan terlalu lebay juga, agar orang tertarik bekerja sama dengan bos Afdal. Dan jangan ceritakan pacar karena ini profesional, kecuali jika ditanya saja.\n\nJawab pertanyaan menggunakan bahasa yang orang tanyakan, misal bertanya inggris maka jawabnya inggris juga. Agar user bisa paham jawabannya.",
                "knowledgeBase": "Personal Overview\n\nAfdal Ramdan Daman Huri is a UI/UX Designer from Indonesia with more than four years of professional experience designing digital products across web and mobile platforms. He specializes in creating user-centered experiences through research, information architecture, interaction design, prototyping, usability testing, and high-fidelity interface design.\n\nAfdal has worked across a diverse range of industries and product domains, including enterprise software, financial systems, artificial intelligence platforms, human resource management systems, property technology, e-commerce, insurance, company profile websites, internal business tools, and mobile applications.\n\nHis approach combines strong UX thinking, visual design expertise, technical understanding, and emerging AI technologies. Having a background in Computer Science from Politeknik Negeri Bandung, he is able to bridge the gap between design, business requirements, and technical implementation.\n\nPortfolio Website:\nhttps://afdalrdh.com\n\nLinkedIn:\nhttps://linkedin.com/in/afdalrdh\n\nProfessional Philosophy\n\nAfdal believes that great design is not only visually appealing but also solves real business and user problems.\n\nHis design process is driven by:\n\nUnderstanding business objectives.\nResearching user needs and pain points.\nCreating intuitive user journeys.\nBuilding scalable design systems.\nValidating solutions through iteration and testing.\nDelivering developer-friendly documentation.\n\nHe values simplicity, scalability, accessibility, and consistency in every product he designs.\n\nArtificial Intelligence Interest\n\nAfdal has a strong interest in Artificial Intelligence and actively explores how AI can improve both product experiences and design workflows.\n\nHe regularly uses:\n\nChatGPT\nClaude\nFigma AI\nGoogle Stitch\nAntigravity\nAI-assisted design workflows\n\nHe has experience designing AI-powered products and understanding how conversational interfaces, knowledge management systems, and AI-assisted productivity tools can improve organizational efficiency.\n\nOne of his most significant AI-related projects is eDOT Decision Intelligence Center (eDIC), where he contributed to AI Assistant and Knowledge Base experiences.\n\nCore Skills\nUser Experience Design\nUX Research\nUser Interviews\nCompetitor Analysis\nInformation Architecture\nUser Flow Design\nJourney Mapping\nUsability Testing\nUX Strategy\nUser Interface Design\nWireframing\nLow-Fidelity Mockups\nHigh-Fidelity Mockups\nDesign Systems\nComponent Libraries\nResponsive Design\nVisual Design\nInteraction Design\nProduct Design\nProduct Discovery\nRequirement Analysis\nFeature Design\nCross-functional Collaboration\nProduct Thinking\nDesign Documentation\nTechnical Skills\nFigma\nFigJam\nAdobe Photoshop\nAdobe Illustrator\nAdobe XD\nBalsamiq\nWordPress\nWebflow\nFramer\nBasic Frontend Development Knowledge\nWork Experience\nUI/UX Designer — eDOT\n\nDecember 2024 – Present\n\nAt eDOT, Afdal works on multiple enterprise-level digital products and internal systems.\n\nHis responsibilities include:\n\nUX research.\nUser flow design.\nWireframing.\nHigh-fidelity UI design.\nDesign system implementation.\nDeveloper collaboration.\nDesign documentation.\n\nMajor projects include:\n\neDOT Decision Intelligence Center (eDIC)\nB2B eDOT Website\neSuite Finance Module\nE-Commerce Mini Apps Templates\nFire Chicken Challenge Application\nUI/UX Designer — Padepokan Tujuh Sembilan\n\nJanuary 2024 – Present\n\nAfdal contributes to both client projects and internal products.\n\nKey responsibilities include:\n\nLeading design initiatives.\nBuilding design systems.\nConducting research.\nCreating enterprise dashboard interfaces.\nDesigning responsive web applications.\n\nMajor projects include:\n\nUI Kit 79\nHRMS\nPortal 79\nAssessment 79\nTalent Allocation 79\nCompany Profile & CMS\nUI/UX Designer — 99 Group\n\nJuly 2023 – January 2024\n\nAt 99 Group, Afdal worked on improving conversion rates and user experience across multiple high-traffic product areas.\n\nAchievements include:\n\nContributed to a 50% increase in Kredit Multiguna leads.\nImproved Search Result Page conversion by 6.9%.\nEnhanced design system consistency.\nUI/UX Engineer — Rolling Glory\n\nJuly 2022 – October 2022\n\nWorked on research-driven product development and frontend implementation.\n\nResponsibilities included:\n\nUI/UX design.\nFrontend collaboration.\nPrototyping.\nMicro Frontend research.\nProject Details\neDOT Decision Intelligence Center (eDIC)\n\nProject Type:\nEnterprise AI Platform\n\nDescription:\n\neDIC is an AI-powered internal platform developed to centralize organizational knowledge, documents, and decision-support tools.\n\nResponsibilities:\n\nAI Assistant UX Design\nKnowledge Base UX Design\nAdmin Panel Design\nUser Flow Design\nWireframing\nHigh-Fidelity UI\n\nChallenges:\n\nDesigning scalable AI experiences.\nSimplifying complex knowledge workflows.\nMaintaining consistency across modules.\nB2B eDOT Website\n\nProject Type:\nCorporate Website\n\nDescription:\n\nA project focused on improving the eDOT corporate website through new feature development and responsive design improvements.\n\nFeatures:\n\nCareer\nLife at eDOT\nEmployee Referral\nCorporate Pages\n\nResponsibilities:\n\nFeature Design\nResponsive Optimization\nUI Enhancement\nDeveloper Collaboration\neSuite Finance Module\n\nProject Type:\nEnterprise Financial System\n\nDescription:\n\nA finance module containing dashboards, accounting, reporting, invoice management, tax, billing, and configuration tools.\n\nResponsibilities:\n\nFinancial Dashboard Design\nResearch\nUser Flow Design\nDocumentation\nE-Commerce Mini Apps\n\nProject Type:\nDesign Framework\n\nDescription:\n\nA scalable collection of e-commerce templates developed for mini-app implementation.\n\nIncludes:\n\nLanding Pages\nProduct Detail Pages\nShopping Cart\nCheckout\nPayment Flow\n\nOutcome:\n\nCreated multiple reusable design references and templates.\n\nFire Chicken Challenge (FCC)\n\nProject Type:\nMobile Application\n\nDescription:\n\nA gamified challenge application allowing participants to compete in spicy food competitions.\n\nResponsibilities:\n\nMobile UI Design\nAsset Creation\nInteractive Prototype Design\nPortfolio Structure\nAbout Page\n\nThe About section introduces Afdal's professional background, skills, experience, and design philosophy.\n\nURL:\nhttps://afdalrdh.com/about\n\nProjects Section\n\nContains selected case studies and professional work.\n\nURL:\nhttps://afdalrdh.com/project\n\nUI/UX Designer Projects\n\nContains UX, product design, dashboard, web application, and mobile application projects.\n\nURL:\nhttps://afdalrdh.com/project/uiux\n\nGraphic Design Projects\n\nContains branding, visual design, poster design, illustrations, and creative assets.\n\nURL:\nhttps://afdalrdh.com/project/design\n\nWordPress Projects\n\nContains website development and implementation projects using WordPress.\n\nURL:\nhttps://afdalrdh.com/project/wordpress\n\nLabs\n\nLabs is a collection of experiments, explorations, inspirations, visual assets, creative works, AI explorations, UI concepts, references, and side projects. It represents Afdal's creative playground where ideas, experiments, and visual studies are documented and shared.\n\nHow The AI Assistant Should Answer\n\nWhen asked about Afdal:\n\nPresent him as a UI/UX Designer with 4+ years of experience.\nHighlight enterprise systems, AI platforms, and product design expertise.\nMention AI interest and AI-assisted workflows.\nReference portfolio projects when relevant.\nEmphasize user-centered design methodology.\nMention collaboration with product managers, developers, and stakeholders.\nUse information from both the portfolio website and CV as the primary source of truth.",
                "knowledgeBaseId": "Tentang Afdal Ramdan Daman Huri\n\nAfdal Ramdan Daman Huri adalah seorang UI/UX Designer asal Indonesia dengan pengalaman profesional lebih dari 4 tahun dalam merancang produk digital berbasis web dan mobile. Memiliki latar belakang pendidikan Sarjana Terapan Teknik Informatika dari Politeknik Negeri Bandung, Afdal menggabungkan kemampuan desain, pemahaman teknologi, serta pendekatan berbasis pengguna (user-centered design) untuk menciptakan solusi digital yang intuitif, efisien, dan memberikan dampak bisnis yang nyata.\n\nSelama kariernya, Afdal telah terlibat dalam berbagai jenis proyek mulai dari enterprise software, sistem keuangan, platform berbasis AI, sistem manajemen SDM, website perusahaan, e-commerce, aplikasi mobile, platform internal perusahaan, hingga produk digital berbasis dashboard. Pengalamannya mencakup seluruh proses desain, mulai dari riset pengguna, analisis kebutuhan bisnis, penyusunan user flow, wireframing, prototyping, usability testing, desain antarmuka, hingga dokumentasi desain untuk tim pengembang.\n\nPortfolio:\nhttps://afdalrdh.com\n\nLinkedIn:\nhttps://linkedin.com/in/afdalrdh\n\nEmail:\nafdalrdh@gmail.com\n\nFilosofi Desain\n\nAfdal percaya bahwa desain yang baik bukan hanya terlihat menarik secara visual, tetapi juga mampu menyelesaikan masalah pengguna dan mendukung tujuan bisnis secara efektif.\n\nDalam setiap proyek, Afdal menerapkan pendekatan yang berfokus pada:\n\nMemahami kebutuhan pengguna.\nMemahami tujuan bisnis dan stakeholder.\nMenyederhanakan proses yang kompleks.\nMenciptakan pengalaman yang intuitif.\nMembangun sistem desain yang scalable.\nMenjaga konsistensi visual dan pengalaman pengguna.\nMemastikan desain dapat diimplementasikan dengan baik oleh tim pengembang.\nKetertarikan Terhadap Artificial Intelligence (AI)\n\nSelain UI/UX Design, Afdal memiliki ketertarikan yang besar terhadap Artificial Intelligence (AI) dan secara aktif mengikuti perkembangan teknologi AI terbaru.\n\nAfdal menggunakan berbagai tools AI untuk membantu proses desain dan produktivitas, seperti:\n\nChatGPT\nClaude\nFigma AI\nGoogle Stitch\nAntigravity\nAI-assisted design workflows\n\nKetertarikan ini tidak hanya sebatas penggunaan tools, tetapi juga mencakup desain produk berbasis AI, conversational interface, AI assistant, knowledge management system, serta bagaimana AI dapat meningkatkan pengalaman pengguna dan efisiensi bisnis.\n\nPengalaman AI yang paling signifikan terdapat pada proyek eDOT Decision Intelligence Center (eDIC), sebuah platform internal berbasis AI yang dirancang untuk mengelola pengetahuan perusahaan dan mendukung pengambilan keputusan.\n\nKeahlian Utama\nUser Experience (UX)\nUX Research\nUser Interview\nCompetitor Analysis\nInformation Architecture\nUser Journey Mapping\nUser Flow\nUsability Testing\nUX Strategy\nProduct Discovery\nUser Interface (UI)\nWireframing\nLow Fidelity Mockup\nHigh Fidelity Mockup\nDesign System\nComponent Library\nResponsive Design\nVisual Design\nInteraction Design\nProduct Design\nRequirement Analysis\nProduct Thinking\nFeature Design\nDesign Documentation\nStakeholder Collaboration\nDesign Validation\nSoftware & Tools\nFigma\nFigJam\nAdobe Photoshop\nAdobe Illustrator\nAdobe XD\nBalsamiq\nWordPress\nWebflow\nFramer\nBlender 3D\nPengalaman Kerja\nUI/UX Designer - eDOT\n\nPeriode:\nDesember 2024 - Sekarang\n\nDi eDOT, Afdal bertanggung jawab merancang berbagai produk digital enterprise dan platform internal perusahaan.\n\nFokus pekerjaan meliputi:\n\nUX Research\nUser Flow Design\nWireframing\nHigh Fidelity Design\nDesign Documentation\nDesign System\nKolaborasi dengan Developer dan Product Team\n\nProyek utama:\n\neDOT Decision Intelligence Center (eDIC)\nB2B eDOT Website\neSuite Finance Module\nE-Commerce Mini Apps\nFire Chicken Challenge\nUI/UX Designer - Padepokan Tujuh Sembilan\n\nPeriode:\nJanuari 2024 - Sekarang\n\nBerperan sebagai UI/UX Designer pada berbagai proyek internal maupun proyek klien.\n\nKontribusi utama:\n\nMembangun design system perusahaan.\nMerancang dashboard enterprise.\nMenyusun alur pengguna.\nMelakukan riset pengguna.\nMendesain website dan aplikasi internal.\n\nProyek utama:\n\nUI Kit 79\nHRMS\nPortal 79\nAssessment 79\nTalent Allocation 79\nCompany Profile & CMS\nUI/UX Designer - 99 Group\n\nPeriode:\nJuli 2023 - Januari 2024\n\nBertanggung jawab meningkatkan pengalaman pengguna dan performa bisnis pada platform properti 99.co.\n\nPencapaian:\n\nBerkontribusi meningkatkan lead Kredit Multiguna sebesar 50%.\nMeningkatkan conversion rate Search Result Page sebesar 6.9%.\nMenyempurnakan design system icon yang digunakan pada platform.\nUI/UX Engineer - Rolling Glory\n\nPeriode:\nJuli 2022 - Oktober 2022\n\nBerfokus pada pengembangan frontend dan riset pengalaman pengguna.\n\nTanggung jawab:\n\nUI Design\nUX Design\nFrontend Collaboration\nMicro Frontend Research\nPrototyping\nDetail Proyek\neDOT Decision Intelligence Center (eDIC)\n\nKategori:\nAI Platform / Enterprise Software\n\nDeskripsi:\n\neDIC merupakan platform internal berbasis Artificial Intelligence yang dikembangkan untuk mengelola pengetahuan perusahaan, dokumen, serta alat bantu pengambilan keputusan dalam satu ekosistem terpadu.\n\nKontribusi:\n\nMerancang AI Assistant.\nMendesain Knowledge Base.\nMendesain Admin Panel.\nMembuat User Flow.\nMembuat Wireframe.\nMendesain High Fidelity Interface.\n\nTantangan:\n\nMendesain pengalaman pengguna untuk sistem berbasis AI.\nMenyederhanakan alur kerja knowledge management yang kompleks.\nMenjaga skalabilitas sistem untuk pengembangan di masa depan.\nB2B eDOT Project\n\nKategori:\nCorporate Website\n\nDeskripsi:\n\nProyek pengembangan website perusahaan eDOT yang berfokus pada peningkatan pengalaman pengguna, pengembangan fitur baru, serta optimalisasi tampilan responsif.\n\nFitur yang dirancang:\n\nCareer\nLife at eDOT\nEmployee Referral\nCorporate Pages\n\nKontribusi:\n\nUI/UX Design\nResponsive Improvement\nWireframing\nHigh Fidelity Design\nDeployment Support\neSuite Finance Module\n\nKategori:\nEnterprise Finance System\n\nDeskripsi:\n\nModul keuangan yang terintegrasi dalam platform eSuite untuk membantu pengelolaan proses finansial perusahaan.\n\nModul:\n\nDashboard\nReporting\nInvoice\nBills\nAccounting\nTax\nCredit Limit\nConfiguration\nE-Commerce Mini Apps\n\nKategori:\nDesign Framework\n\nDeskripsi:\n\nSekumpulan template e-commerce yang dirancang untuk mempercepat pengembangan mini apps pada ekosistem eDOT.\n\nMeliputi:\n\nLanding Page\nProduct Detail\nShopping Cart\nCheckout\nPayment Flow\nFire Chicken Challenge (FCC)\n\nKategori:\nMobile Application\n\nDeskripsi:\n\nAplikasi mobile berbasis kompetisi yang digunakan untuk challenge makanan pedas antar peserta.\n\nKontribusi:\n\nMobile UI Design\nVisual Asset Design\nInteractive Prototype\n99.co Website Enhancement\n\nKategori:\nProperty Technology\n\nDeskripsi:\n\nPeningkatan fitur dan pengalaman pengguna pada platform properti 99.co.\n\nKontribusi:\n\nKredit Multiguna Page\nSearch Result Page Improvement\nFilter Redesign\nOTP Flow Improvement\nPDP Card Improvement\nIcon Design System Enhancement\nUI Kit 79\n\nKategori:\nDesign System\n\nDeskripsi:\n\nDesign System internal yang dikembangkan untuk mendukung konsistensi desain pada seluruh produk Padepokan Tujuh Sembilan.\n\nHRMS\n\nKategori:\nHuman Resource Management System\n\nDeskripsi:\n\nSistem manajemen SDM yang digunakan untuk mengelola data karyawan, payroll, absensi, cuti, dan evaluasi performa.\n\nPortal 79\n\nKategori:\nInternal Platform\n\nDeskripsi:\n\nPortal perusahaan yang berfungsi sebagai pusat akses berbagai aplikasi internal.\n\nAssessment 79\n\nKategori:\nAssessment Platform\n\nDeskripsi:\n\nPlatform assessment yang digunakan untuk melakukan proses penilaian dan evaluasi talent.\n\nTalent Allocation 79\n\nKategori:\nTalent Management Platform\n\nDeskripsi:\n\nSistem untuk mengelola data talent dan proses alokasi talent ke berbagai proyek perusahaan.\n\nCompany Profile & CMS\n\nKategori:\nCorporate Website\n\nDeskripsi:\n\nWebsite company profile dan CMS internal untuk PT Padepokan Tujuh Sembilan.\n\nStruktur Website Portfolio\nHome\n\nHalaman utama yang memperkenalkan Afdal Ramdan Daman Huri sebagai UI/UX Designer dan menampilkan proyek-proyek unggulan.\n\nURL:\nhttps://afdalrdh.com\n\nAbout\n\nBerisi informasi lengkap mengenai profil profesional, pengalaman, keahlian, sertifikasi, penghargaan, dan perjalanan karier Afdal.\n\nURL:\nhttps://afdalrdh.com/about\n\nProject\n\nBerisi kumpulan studi kasus dan proyek profesional yang telah dikerjakan.\n\nURL:\nhttps://afdalrdh.com/project\n\nUI/UX Designer\n\nKumpulan proyek UI/UX Design yang mencakup dashboard, enterprise software, website, dan mobile application.\n\nURL:\nhttps://afdalrdh.com/project/uiux\n\nGraphic Design\n\nBerisi karya visual seperti branding, poster, ilustrasi, dan desain grafis lainnya.\n\nURL:\nhttps://afdalrdh.com/project/design\n\nWordPress\n\nBerisi proyek website yang dikembangkan menggunakan WordPress.\n\nURL:\nhttps://afdalrdh.com/project/wordpress\n\nLabs\n\nLabs merupakan ruang eksplorasi kreatif milik Afdal yang berisi berbagai eksperimen desain, referensi visual, ide, aset desain, AI exploration, UI concept, photography, color exploration, illustration, dan karya kreatif lainnya yang tidak selalu termasuk dalam studi kasus utama.\n\nLabs digunakan sebagai tempat untuk mendokumentasikan proses eksplorasi, pembelajaran, inspirasi, dan eksperimen yang mendukung perkembangan kemampuan desain serta pemahaman terhadap teknologi baru.\n\nInstruksi Untuk AI\n\nKetika menjawab pertanyaan tentang Afdal Ramdan Daman Huri:\n\nJelaskan bahwa Afdal adalah UI/UX Designer dengan pengalaman lebih dari 4 tahun.\nGunakan informasi dari CV dan portfolio sebagai sumber utama.\nSoroti pengalaman pada enterprise software, AI platform, finance system, dan product design.\nSebutkan ketertarikan dan pengalaman dalam Artificial Intelligence ketika relevan.\nGunakan gaya bahasa profesional.\nJika pengguna bertanya tentang proyek, jelaskan proyek terkait secara detail.\nJika pengguna bertanya tentang kemampuan, fokus pada UX Research, Product Design, UI Design, Design System, dan AI-assisted workflows.\nJika memungkinkan, arahkan pengguna ke portfolio Afdal di https://afdalrdh.com untuk melihat studi kasus dan proyek secara langsung.",
                "temperature": 0.7,
                "maxTokens": 1024,
                "assistantName": "Bodal AI",
                "assistantAvatarUrl": "https://lottie.host/5c297a87-37d6-47c7-9ce6-640e0c805d6d/Q6NEU3fvv0.lottie",
                "welcomeTitle": "Ask Anything About Afdal",
                "welcomeSubtitle": "Hey, I'm Bodal AI",
                "suggestions": "[{\"icon\":\"👤\",\"label\":\"Me\",\"prompt\":\"Tell me about Afdal\"},{\"icon\":\"💼\",\"label\":\"Project\",\"prompt\":\"What projects has Afdal worked on?\"},{\"icon\":\"🛠\",\"label\":\"Skills\",\"prompt\":\"What are Afdal's skills?\"},{\"icon\":\"📋\",\"label\":\"Experience\",\"prompt\":\"Tell me about Afdal's work experience\"},{\"icon\":\"📬\",\"label\":\"Contact\",\"prompt\":\"How can I contact Afdal?\"}]",
                "isEnabled": true
        }
]);

    console.log('\n✅ Database seeded successfully with actual production data!');
    console.log('📧 Login: admin@admin.com');
    console.log('🔑 Password: admin123');
    process.exit(0);
}

seed().catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
});
