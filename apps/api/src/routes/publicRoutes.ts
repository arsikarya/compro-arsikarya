import { Router } from 'express';
import { homeService } from '../services/homeService.js';
import { aboutService } from '../services/aboutService.js';
import { contactService } from '../services/contactService.js';
import { projectService } from '../services/projectService.js';
import { aiChatService } from '../services/aiChatService.js';
import { labsService } from '../services/labsService.js';
import { servicesService } from '../services/servicesService.js';
import { articleService } from '../services/articleService.js';
import { testimonialService } from '../services/testimonialService.js';
import { inquiryService } from '../services/inquiryService.js';
import { siteSettingsService } from '../services/siteSettingsService.js';
import { teamService } from '../services/teamService.js';
import { authService } from '../services/authService.js';

const router = Router();

// Home page data
router.get('/home', async (_req, res) => {
    try {
        const data = await homeService.getHomePage();
        res.json(data);
    } catch (error) {
        console.error('Error fetching home page:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// About page data
router.get('/about', async (_req, res) => {
    try {
        const data = await aboutService.getAboutPage();
        res.json(data);
    } catch (error) {
        console.error('Error fetching about page:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Contact page data
router.get('/contact', async (_req, res) => {
    try {
        const data = await contactService.getContactPage();
        res.json(data);
    } catch (error) {
        console.error('Error fetching contact page:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Contact form / Inquiry submission
router.post('/inquiries', async (req, res) => {
    try {
        const { nama, email, whatsapp } = req.body;
        if (!nama || !email || !whatsapp) {
            res.status(400).json({ error: 'Nama, Email, dan WhatsApp wajib diisi' });
            return;
        }
        const record = await inquiryService.createInquiry(req.body);
        res.status(201).json({ success: true, inquiry: record });
    } catch (error: any) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// List published projects
router.get('/projects', async (_req, res) => {
    try {
        const data = await projectService.listProjects(true); // only public
        res.json(data);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Single project by slug
router.get('/projects/:slug', async (req, res) => {
    try {
        const project = await projectService.getProjectBySlug(req.params.slug);
        if (!project || (project.published === false && project.visibility !== 'public')) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List published services
router.get('/services', async (_req, res) => {
    try {
        const data = await servicesService.listServices(true);
        res.json(data);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Single service by slug
router.get('/services/:slug', async (req, res) => {
    try {
        const service = await servicesService.getServiceBySlug(req.params.slug);
        if (!service || !service.published) {
            res.status(404).json({ error: 'Service not found' });
            return;
        }
        res.json(service);
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List published articles
router.get('/articles', async (_req, res) => {
    try {
        const data = await articleService.listArticles(true);
        res.json(data);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Single article by slug
router.get('/articles/:slug', async (req, res) => {
    try {
        const article = await articleService.getArticleBySlug(req.params.slug);
        if (!article || !article.published) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        res.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List approved and published testimonials
router.get('/testimonials', async (_req, res) => {
    try {
        const data = await testimonialService.listTestimonials(true);
        res.json(data);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Site settings
router.get('/settings', async (_req, res) => {
    try {
        const data = await siteSettingsService.getSettings();
        res.json(data);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// AI Chat - public settings
router.get('/ai-chat/settings', async (_req, res) => {
    try {
        const data = await aiChatService.getPublicSettings();
        res.json(data);
    } catch (error) {
        console.error('Error fetching AI chat settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// AI Chat completion
router.post('/ai-chat', async (req, res) => {
    try {
        const { messages, sessionId, language } = req.body;
        if (!messages || !Array.isArray(messages)) {
            res.status(400).json({ error: 'Messages array is required' });
            return;
        }
        let location = 'Unknown';
        const city = req.headers['x-vercel-ip-city'];
        const country = req.headers['x-vercel-ip-country'];
        if (city && country) {
            location = `${city}, ${country}`;
        } else if (country) {
            location = String(country);
        } else if (city) {
            location = String(city);
        }

        await aiChatService.chatCompletion(messages, location, res, sessionId, language || 'en');
    } catch (error) {
        console.error('Error in AI chat completion:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.end();
        }
    }
});

// Labs
router.get('/labs/creations', async (req, res) => {
    try {
        const { search, category } = req.query;
        const data = await labsService.getCreations(search as string, category as string);
        res.json(data);
    } catch (error) {
        console.error('Error fetching creations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Team members (Public)
router.get('/team', async (_req, res) => {
    try {
        const data = await teamService.listTeamMembers(true);
        res.json(data);
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Password Reset Request (Public)
router.post('/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email wajib diisi' });
            return;
        }
        const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
        const result = await authService.requestPasswordReset(email, origin);
        res.json(result);
    } catch (error: any) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

// Password Reset Verification & Submission (Public)
router.post('/auth/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            res.status(400).json({ error: 'Token dan kata sandi baru wajib diisi' });
            return;
        }
        const result = await authService.verifyAndResetPassword(token, password);
        res.json(result);
    } catch (error: any) {
        console.error('Error executing password reset:', error);
        res.status(400).json({ error: error?.message || 'Internal server error' });
    }
});

export default router;
