const API_BASE = import.meta.env.VITE_API_URL || '';
const AUTH_BASE = API_BASE + '/api/auth';

const getAuthHeaders = (extra = {}) => {
    const token = localStorage.getItem('auth_token');
    const headers = { 'Content-Type': 'application/json', ...extra };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

export const authClient = {
    // Step 1: Request 2FA Login OTP with Email & Password
    async requestOtp(email, password) {
        const res = await fetch(`${API_BASE}/api/auth-otp/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Email atau kata sandi tidak valid');
        }
        return data;
    },

    // Step 2: Verify 6-digit OTP and Issue Session
    async verifyOtp(email, otp) {
        const res = await fetch(`${API_BASE}/api/auth-otp/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Kode verifikasi tidak valid atau telah kedaluwarsa');
        }

        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            localStorage.setItem('admin_logged_in', 'true');
        }

        return data;
    },

    // Step 3: Resend OTP
    async resendOtp(email) {
        const res = await fetch(`${API_BASE}/api/auth-otp/resend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Gagal mengirim ulang kode verifikasi');
        }
        return data;
    },

    async signOut() {
        try {
            await fetch(`${AUTH_BASE}/sign-out`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            }).catch(() => {});
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('admin_user');
            localStorage.removeItem('admin_logged_in');
        }
    },

    async getSession() {
        const token = localStorage.getItem('auth_token');
        const isLoggedIn = localStorage.getItem('admin_logged_in');

        if (!token || !isLoggedIn) {
            return null;
        }

        try {
            const res = await fetch(`${AUTH_BASE}/get-session`, {
                credentials: 'include',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.session && data.user) return data;
            }
        } catch (err) {
            console.warn('Failed to verify session with backend:', err);
        }

        // Check if stored admin_user is valid
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser && token) {
            try {
                const userObj = JSON.parse(storedUser);
                return {
                    user: userObj,
                    session: { id: 'local-session', token, userId: userObj.id }
                };
            } catch {}
        }

        // Invalid or expired token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_logged_in');
        return null;
    },
};
