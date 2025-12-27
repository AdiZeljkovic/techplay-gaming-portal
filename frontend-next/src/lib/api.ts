import axios from 'axios';

const api = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Helper to initialize CSRF protection
export const getCsrfToken = async () => {
    const rootUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    await axios.get(`${rootUrl}/sanctum/csrf-cookie`, { withCredentials: true });
};

// Helper to getting cookie value
function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
}

// Request Interceptor
api.interceptors.request.use((config) => {
    // Manually attach X-XSRF-TOKEN from cookie if present
    const token = getCookie('XSRF-TOKEN');
    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
});

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        if (response) {
            if (response.status === 401) {
                // Handle unauthorized
            }
            if (response.status === 403) {
                console.error('Access Denied');
                if (typeof window !== 'undefined') {
                    window.location.href = '/forbidden';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
