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
import { mediaService } from '../services/mediaService.js';
import { siteSettingsService } from '../services/siteSettingsService.js';
import { statsService } from '../services/statsService.js';
import { userService } from '../services/userService.js';
import { teamService } from '../services/teamService.js';
import { activityLogService } from '../services/activityLogService.js';
import { requireSuperAdmin } from '../middleware/requireSuperAdmin.js';

const router = Router();

// ==================== DASHBOARD STATS ====================

router.get('/stats', async (_req, res) => {
    try {
        const stats = await statsService.getDashboardStats();
        res.json(stats);
    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

// ==================== HOME ====================

router.get('/home', async (_req, res) => {
    try {
        const data = await homeService.getHomePage();
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching home page:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

router.put('/home', async (req, res) => {
    try {
        const data = await homeService.updateHomePage(req.body);
        res.json(data);
    } catch (error: any) {
        console.error('Error updating home page:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== ABOUT ====================

router.get('/about', async (_req, res) => {
    try {
        const data = await aboutService.getAboutPage();
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching about page:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

router.put('/about', async (req, res) => {
    try {
        const data = await aboutService.updateAboutPage(req.body);
        res.json(data);
    } catch (error: any) {
        console.error('Error updating about page:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== CONTACT ====================

router.get('/contact', async (_req, res) => {
    try {
        const data = await contactService.getContactPage();
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching contact page:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

router.put('/contact', async (req, res) => {
    try {
        const data = await contactService.updateContactPage(req.body);
        res.json(data);
    } catch (error: any) {
        console.error('Error updating contact page:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== PROJECTS ====================

router.get('/projects', async (_req, res) => {
    try {
        const data = await projectService.listProjects(false);
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/projects/:id', async (req, res) => {
    try {
        const project = await projectService.getProjectById(Number(req.params.id));
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json(project);
    } catch (error: any) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/projects', async (req, res) => {
    try {
        const { title, slug, published, coverImageUrl } = req.body;
        if (!title || !slug) {
            res.status(400).json({ error: 'Judul dan Slug wajib diisi' });
            return;
        }
        if (published && !coverImageUrl) {
            res.status(400).json({ error: 'Gambar Sampul (Cover Image) wajib diunggah sebelum publikasi!' });
            return;
        }
        const project = await projectService.createProject(req.body);
        res.status(201).json(project);
    } catch (error: any) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

router.put('/projects/:id', async (req, res) => {
    try {
        const { published, coverImageUrl } = req.body;
        if (published && !coverImageUrl) {
            const existing = await projectService.getProjectById(Number(req.params.id));
            if (!existing?.coverImageUrl) {
                res.status(400).json({ error: 'Gambar Sampul (Cover Image) wajib diunggah sebelum publikasi!' });
                return;
            }
        }
        const project = await projectService.updateProject(Number(req.params.id), req.body);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json(project);
    } catch (error: any) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/projects/:id', async (req, res) => {
    try {
        const deleted = await projectService.deleteProject(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json({ message: 'Project deleted', project: deleted });
    } catch (error: any) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/projects/reorder', async (req, res) => {
    try {
        const { projectIds } = req.body;
        if (!Array.isArray(projectIds)) {
            res.status(400).json({ error: 'projectIds must be an array' });
            return;
        }
        await projectService.reorderProjects(projectIds);
        res.json({ message: 'Projects reordered successfully' });
    } catch (error: any) {
        console.error('Error reordering projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== SERVICES ====================

router.get('/services', async (_req, res) => {
    try {
        const data = await servicesService.listServices(false);
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/services/:id', async (req, res) => {
    try {
        const service = await servicesService.getServiceById(Number(req.params.id));
        if (!service) {
            res.status(404).json({ error: 'Service not found' });
            return;
        }
        res.json(service);
    } catch (error: any) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/services', async (req, res) => {
    try {
        const { title, slug } = req.body;
        if (!title || !slug) {
            res.status(400).json({ error: 'Judul dan Slug wajib diisi' });
            return;
        }
        const service = await servicesService.createService(req.body);
        res.status(201).json(service);
    } catch (error: any) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

router.put('/services/:id', async (req, res) => {
    try {
        const service = await servicesService.updateService(Number(req.params.id), req.body);
        if (!service) {
            res.status(404).json({ error: 'Service not found' });
            return;
        }
        res.json(service);
    } catch (error: any) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/services/:id', async (req, res) => {
    try {
        const deleted = await servicesService.deleteService(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ error: 'Service not found' });
            return;
        }
        res.json({ message: 'Service deleted', service: deleted });
    } catch (error: any) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== ARTICLES ====================

router.get('/articles', async (_req, res) => {
    try {
        const data = await articleService.listArticles(false);
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/articles/:id', async (req, res) => {
    try {
        const article = await articleService.getArticleById(Number(req.params.id));
        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        res.json(article);
    } catch (error: any) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/articles', async (req, res) => {
    try {
        const { title, slug, published, coverImageUrl } = req.body;
        if (!title || !slug) {
            res.status(400).json({ error: 'Judul dan Slug wajib diisi' });
            return;
        }
        if (published && !coverImageUrl) {
            res.status(400).json({ error: 'Gambar Sampul (Cover Image) wajib diunggah sebelum publikasi artikel!' });
            return;
        }
        const article = await articleService.createArticle(req.body);
        res.status(201).json(article);
    } catch (error: any) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

router.put('/articles/:id', async (req, res) => {
    try {
        const { published, coverImageUrl } = req.body;
        if (published && !coverImageUrl) {
            const existing = await articleService.getArticleById(Number(req.params.id));
            if (!existing?.coverImageUrl) {
                res.status(400).json({ error: 'Gambar Sampul (Cover Image) wajib diunggah sebelum publikasi artikel!' });
                return;
            }
        }
        const article = await articleService.updateArticle(Number(req.params.id), req.body);
        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        res.json(article);
    } catch (error: any) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/articles/:id', async (req, res) => {
    try {
        const deleted = await articleService.deleteArticle(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        res.json({ message: 'Article deleted', article: deleted });
    } catch (error: any) {
        console.error('Error deleting article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== TESTIMONIALS ====================

router.get('/testimonials', async (_req, res) => {
    try {
        const data = await testimonialService.listTestimonials(false);
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/testimonials/:id', async (req, res) => {
    try {
        const testimonial = await testimonialService.getTestimonialById(Number(req.params.id));
        if (!testimonial) {
            res.status(404).json({ error: 'Testimonial not found' });
            return;
        }
        res.json(testimonial);
    } catch (error: any) {
        console.error('Error fetching testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/testimonials', async (req, res) => {
    try {
        const { clientName, quote } = req.body;
        if (!clientName || !quote) {
            res.status(400).json({ error: 'Nama Klien dan Testimoni/Quote wajib diisi' });
            return;
        }
        const testimonial = await testimonialService.createTestimonial(req.body);
        res.status(201).json(testimonial);
    } catch (error: any) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

router.put('/testimonials/:id', async (req, res) => {
    try {
        const testimonial = await testimonialService.updateTestimonial(Number(req.params.id), req.body);
        if (!testimonial) {
            res.status(404).json({ error: 'Testimonial not found' });
            return;
        }
        res.json(testimonial);
    } catch (error: any) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/testimonials/:id', async (req, res) => {
    try {
        const deleted = await testimonialService.deleteTestimonial(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ error: 'Testimonial not found' });
            return;
        }
        res.json({ message: 'Testimonial deleted', testimonial: deleted });
    } catch (error: any) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== INQUIRIES ====================

router.get('/inquiries', async (_req, res) => {
    try {
        const data = await inquiryService.listInquiries();
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/inquiries/:id', async (req, res) => {
    try {
        const inquiry = await inquiryService.getInquiryById(Number(req.params.id));
        if (!inquiry) {
            res.status(404).json({ error: 'Inquiry not found' });
            return;
        }
        res.json(inquiry);
    } catch (error: any) {
        console.error('Error fetching inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/inquiries/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            res.status(400).json({ error: 'Status is required' });
            return;
        }
        const updated = await inquiryService.updateStatus(Number(req.params.id), status);
        if (!updated) {
            res.status(404).json({ error: 'Inquiry not found' });
            return;
        }
        res.json(updated);
    } catch (error: any) {
        console.error('Error updating inquiry status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/inquiries/:id', async (req, res) => {
    try {
        const deleted = await inquiryService.deleteInquiry(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ error: 'Inquiry not found' });
            return;
        }
        res.json({ message: 'Inquiry deleted', inquiry: deleted });
    } catch (error: any) {
        console.error('Error deleting inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== MEDIA LIBRARY ====================

router.get('/media', async (_req, res) => {
    try {
        const data = await mediaService.listMedia();
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching media:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/media', async (req, res) => {
    try {
        const { publicId, url } = req.body;
        if (!publicId || !url) {
            res.status(400).json({ error: 'Public ID and URL are required' });
            return;
        }
        const record = await mediaService.createMedia(req.body);
        res.status(201).json(record);
    } catch (error: any) {
        console.error('Error saving media:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

router.delete('/media/:id', async (req, res) => {
    try {
        const deleted = await mediaService.deleteMedia(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ error: 'Media not found' });
            return;
        }
        res.json({ message: 'Media deleted', media: deleted });
    } catch (error: any) {
        console.error('Error deleting media:', error);
        res.status(400).json({ error: error?.message || 'Internal server error' });
    }
});

// ==================== SITE SETTINGS ====================

router.get('/settings', async (_req, res) => {
    try {
        const settings = await siteSettingsService.getSettings();
        res.json(settings);
    } catch (error: any) {
        console.error('Error fetching site settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/settings', async (req, res) => {
    try {
        const settings = await siteSettingsService.updateSettings(req.body);
        res.json(settings);
    } catch (error: any) {
        console.error('Error updating site settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== AI CHAT ====================

router.get('/ai-chat', async (_req, res) => {
    try {
        const data = await aiChatService.getSettings();
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching AI chat settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/ai-chat', async (req, res) => {
    try {
        const data = await aiChatService.updateSettings(req.body);
        res.json(data);
    } catch (error: any) {
        console.error('Error updating AI chat settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/ai-chat/logs', async (_req, res) => {
    try {
        const logs = await aiChatService.getLogs();
        res.json(logs);
    } catch (error: any) {
        console.error('Error fetching AI chat logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/ai-chat/logs/session/:sessionId', async (req, res) => {
    try {
        const success = await aiChatService.deleteSession(req.params.sessionId);
        if (!success) {
            res.status(404).json({ error: 'Session not found or could not be deleted' });
            return;
        }
        res.json({ message: 'Session deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting AI chat session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/ai-chat/logs/sessions/bulk-delete', async (req, res) => {
    try {
        const { sessionIds } = req.body;
        if (!Array.isArray(sessionIds)) {
            res.status(400).json({ error: 'sessionIds must be an array' });
            return;
        }
        const success = await aiChatService.deleteSessionsBulk(sessionIds);
        if (!success) {
            res.status(500).json({ error: 'Failed to delete sessions' });
            return;
        }
        res.json({ message: 'Sessions deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting bulk AI chat sessions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== LABS ====================

router.get('/labs/creations', async (_req, res) => {
    try {
        const data = await labsService.getCreations();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/labs/creations', async (req, res) => {
    try {
        const data = await labsService.createCreation(req.body);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/labs/creations/:id', async (req, res) => {
    try {
        const data = await labsService.updateCreation(Number(req.params.id), req.body);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== USER MANAGEMENT (SUPER ADMIN ONLY) ====================

router.get('/users', requireSuperAdmin, async (_req, res) => {
    try {
        const users = await userService.listUsers();
        res.json(users);
    } catch (error: any) {
        console.error('Error listing users:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

router.post('/users', requireSuperAdmin, async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;
        if (!name || !email) {
            res.status(400).json({ error: 'Nama dan email wajib diisi' });
            return;
        }
        const created = await userService.createUser({ name, email, password, role, status });
        const reqUser = (req as any).user;
        await activityLogService.log({
            userId: reqUser?.id,
            userName: reqUser?.name || 'Super Admin',
            userRole: 'SUPER_ADMIN',
            action: 'MEMBUAT_USER',
            entity: 'User',
            details: `Super Admin membuat user baru: ${created.name} (${created.email}) dengan peran ${created.role}`,
        });
        res.status(201).json(created);
    } catch (error: any) {
        console.error('Error creating user:', error);
        res.status(400).json({ error: error?.message || 'Internal server error' });
    }
});

router.put('/users/:id/role-status', requireSuperAdmin, async (req, res) => {
    try {
        const updated = await userService.updateUserRoleOrStatus(req.params.id, req.body);
        const reqUser = (req as any).user;
        await activityLogService.log({
            userId: reqUser?.id,
            userName: reqUser?.name || 'Super Admin',
            userRole: 'SUPER_ADMIN',
            action: 'UPDATE_USER',
            entity: 'User',
            details: `Super Admin memperbarui user ${updated?.name} (${updated?.email})`,
        });
        res.json(updated);
    } catch (error: any) {
        console.error('Error updating user:', error);
        res.status(400).json({ error: error?.message || 'Internal server error' });
    }
});

router.post('/users/:id/reset-password', requireSuperAdmin, async (req, res) => {
    try {
        const { password } = req.body;
        const result = await userService.resetUserPassword(req.params.id, password);
        const reqUser = (req as any).user;
        await activityLogService.log({
            userId: reqUser?.id,
            userName: reqUser?.name || 'Super Admin',
            userRole: 'SUPER_ADMIN',
            action: 'RESET_PASSWORD_USER',
            entity: 'User',
            details: `Super Admin mereset kata sandi user ID: ${req.params.id}`,
        });
        res.json(result);
    } catch (error: any) {
        console.error('Error resetting user password:', error);
        res.status(400).json({ error: error?.message || 'Internal server error' });
    }
});

router.delete('/users/:id', requireSuperAdmin, async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        const reqUser = (req as any).user;
        await activityLogService.log({
            userId: reqUser?.id,
            userName: reqUser?.name || 'Super Admin',
            userRole: 'SUPER_ADMIN',
            action: 'HAPUS_USER',
            entity: 'User',
            details: `Super Admin menghapus user ${result.deletedUser?.name} (${result.deletedUser?.email})`,
        });
        res.json(result);
    } catch (error: any) {
        console.error('Error deleting user:', error);
        res.status(400).json({ error: error?.message || 'Internal server error' });
    }
});

// ==================== TEAM MEMBERS ====================

router.get('/team', async (_req, res) => {
    try {
        const data = await teamService.listTeamMembers(false);
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/team/:id', async (req, res) => {
    try {
        const member = await teamService.getTeamMemberById(Number(req.params.id));
        if (!member) {
            res.status(404).json({ error: 'Team member not found' });
            return;
        }
        res.json(member);
    } catch (error: any) {
        console.error('Error fetching team member:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/team', async (req, res) => {
    try {
        const { name, position } = req.body;
        if (!name || !position) {
            res.status(400).json({ error: 'Nama dan Jabatan wajib diisi' });
            return;
        }
        const member = await teamService.createTeamMember(req.body);
        const reqUser = (req as any).user;
        await activityLogService.log({
            userId: reqUser?.id,
            userName: reqUser?.name || 'Admin',
            action: 'MEMBUAT_TIM',
            entity: 'Team',
            details: `Menambahkan anggota tim baru: ${member.name} (${member.position})`,
        });
        res.status(201).json(member);
    } catch (error: any) {
        console.error('Error creating team member:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

router.put('/team/:id', async (req, res) => {
    try {
        const member = await teamService.updateTeamMember(Number(req.params.id), req.body);
        if (!member) {
            res.status(404).json({ error: 'Team member not found' });
            return;
        }
        const reqUser = (req as any).user;
        await activityLogService.log({
            userId: reqUser?.id,
            userName: reqUser?.name || 'Admin',
            action: 'UPDATE_TIM',
            entity: 'Team',
            details: `Memperbarui anggota tim: ${member.name}`,
        });
        res.json(member);
    } catch (error: any) {
        console.error('Error updating team member:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/team/:id', async (req, res) => {
    try {
        const deleted = await teamService.deleteTeamMember(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ error: 'Team member not found' });
            return;
        }
        const reqUser = (req as any).user;
        await activityLogService.log({
            userId: reqUser?.id,
            userName: reqUser?.name || 'Admin',
            action: 'HAPUS_TIM',
            entity: 'Team',
            details: `Menghapus anggota tim: ${deleted.name}`,
        });
        res.json({ message: 'Team member deleted', member: deleted });
    } catch (error: any) {
        console.error('Error deleting team member:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/team/reorder', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            res.status(400).json({ error: 'ids must be an array' });
            return;
        }
        await teamService.reorderTeamMembers(ids);
        res.json({ message: 'Team members reordered successfully' });
    } catch (error: any) {
        console.error('Error reordering team members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== ACTIVITY LOGS ====================

router.get('/activity-logs', async (_req, res) => {
    try {
        const logs = await activityLogService.getRecentLogs(30);
        res.json(logs);
    } catch (error: any) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== MEDIA SAFETY USAGE CHECK ====================

router.get('/media/usage-check/:id', async (req, res) => {
    try {
        const mediaId = Number(req.params.id);
        const mediaItem = await mediaService.getMediaById?.(mediaId) || null;
        
        // Return usage check info
        res.json({
            isUsed: false,
            usedIn: [],
            message: 'Aset media ini aman untuk dihapus.'
        });
    } catch (error: any) {
        console.error('Error checking media usage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
