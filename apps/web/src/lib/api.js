const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';

export async function api(path, options = {}) {
    const token = localStorage.getItem('auth_token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        credentials: 'include',
        headers,
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(error.error || 'API Error');
    }

    return res.json();
}

export const publicApi = {
    getHome: () => api('/home'),
    getAbout: () => api('/about'),
    getContact: () => api('/contact'),
    submitInquiry: (data) => api('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
    getProjects: () => api('/projects'),
    getProject: (slug) => api(`/projects/${slug}`),
    getServices: () => api('/services'),
    getService: (slug) => api(`/services/${slug}`),
    getArticles: () => api('/articles'),
    getArticle: (slug) => api(`/articles/${slug}`),
    getTestimonials: () => api('/testimonials'),
    getSettings: () => api('/settings'),
    getAiChatSettings: () => api('/ai-chat/settings'),
    getCreations: (search = '', category = '') => {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        if (category) query.append('category', category);
        const qs = query.toString();
        return api(`/labs/creations${qs ? `?${qs}` : ''}`);
    },
    getCategories: () => api('/labs/categories'),
    getTeam: () => api('/team'),
    requestPasswordReset: (email) => api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token, password) => api('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};

export const adminApi = {
    getStats: () => api('/admin/stats'),
    getHome: () => api('/admin/home'),
    updateHome: (data) => api('/admin/home', { method: 'PUT', body: JSON.stringify(data) }),
    getAbout: () => api('/admin/about'),
    updateAbout: (data) => api('/admin/about', { method: 'PUT', body: JSON.stringify(data) }),
    getContact: () => api('/admin/contact'),
    updateContact: (data) => api('/admin/contact', { method: 'PUT', body: JSON.stringify(data) }),
    getProjects: () => api('/admin/projects'),
    getProject: (id) => api(`/admin/projects/${id}`),
    createProject: (data) => api('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
    updateProject: (id, data) => api(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProject: (id) => api(`/admin/projects/${id}`, { method: 'DELETE' }),
    reorderProjects: (projectIds) => api('/admin/projects/reorder', { method: 'POST', body: JSON.stringify({ projectIds }) }),
    
    // Services CMS
    getServices: () => api('/admin/services'),
    getService: (id) => api(`/admin/services/${id}`),
    createService: (data) => api('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
    updateService: (id, data) => api(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteService: (id) => api(`/admin/services/${id}`, { method: 'DELETE' }),

    // Articles CMS
    getArticles: () => api('/admin/articles'),
    getArticle: (id) => api(`/admin/articles/${id}`),
    createArticle: (data) => api('/admin/articles', { method: 'POST', body: JSON.stringify(data) }),
    updateArticle: (id, data) => api(`/admin/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteArticle: (id) => api(`/admin/articles/${id}`, { method: 'DELETE' }),

    // Testimonials CMS
    getTestimonials: () => api('/admin/testimonials'),
    getTestimonial: (id) => api(`/admin/testimonials/${id}`),
    createTestimonial: (data) => api('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) }),
    updateTestimonial: (id, data) => api(`/admin/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTestimonial: (id) => api(`/admin/testimonials/${id}`, { method: 'DELETE' }),

    // Inquiries CMS
    getInquiries: () => api('/admin/inquiries'),
    getInquiry: (id) => api(`/admin/inquiries/${id}`),
    updateInquiryStatus: (id, status) => api(`/admin/inquiries/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    deleteInquiry: (id) => api(`/admin/inquiries/${id}`, { method: 'DELETE' }),

    // Media Library
    getMedia: () => api('/admin/media'),
    saveMedia: (data) => api('/admin/media', { method: 'POST', body: JSON.stringify(data) }),
    deleteMedia: (id) => api(`/admin/media/${id}`, { method: 'DELETE' }),
    checkMediaUsage: (id) => api(`/admin/media/usage-check/${id}`),

    // Site Settings
    getSettings: () => api('/admin/settings'),
    updateSettings: (data) => api('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),

    // Team CMS
    getTeam: () => api('/admin/team'),
    getTeamMember: (id) => api(`/admin/team/${id}`),
    createTeamMember: (data) => api('/admin/team', { method: 'POST', body: JSON.stringify(data) }),
    updateTeamMember: (id, data) => api(`/admin/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTeamMember: (id) => api(`/admin/team/${id}`, { method: 'DELETE' }),
    reorderTeamMembers: (ids) => api('/admin/team/reorder', { method: 'POST', body: JSON.stringify({ ids }) }),

    // User Management (Super Admin)
    getUsers: () => api('/admin/users'),
    createUser: (data) => api('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    updateUserRoleOrStatus: (id, data) => api(`/admin/users/${id}/role-status`, { method: 'PUT', body: JSON.stringify(data) }),
    resetUserPassword: (id, password) => api(`/admin/users/${id}/reset-password`, { method: 'POST', body: JSON.stringify({ password }) }),
    deleteUser: (id) => api(`/admin/users/${id}`, { method: 'DELETE' }),

    // Activity Logs
    getActivityLogs: () => api('/admin/activity-logs'),

    // AI Chat & Labs
    getAiChat: () => api('/admin/ai-chat'),
    getAiChatLogs: () => api('/admin/ai-chat/logs'),
    updateAiChat: (data) => api('/admin/ai-chat', { method: 'PUT', body: JSON.stringify(data) }),
    deleteAiChatSession: (sessionId) => api(`/admin/ai-chat/logs/session/${sessionId}`, { method: 'DELETE' }),
    deleteAiChatSessionsBulk: (sessionIds) => api('/admin/ai-chat/logs/sessions/bulk-delete', { method: 'POST', body: JSON.stringify({ sessionIds }) }),
    getCreations: () => api('/admin/labs/creations'),
    createCreation: (data) => api('/admin/labs/creations', { method: 'POST', body: JSON.stringify(data) }),
    updateCreation: (id, data) => api(`/admin/labs/creations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCreation: (id) => api(`/admin/labs/creations/${id}`, { method: 'DELETE' }),
};
