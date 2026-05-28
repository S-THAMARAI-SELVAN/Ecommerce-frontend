import axios from 'axios';

// Base API configuration (Vite proxy redirects /api requests to Express server)
const api = axios.create({
  baseURL: typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1'
      ? 'https://ecommerce-backend-1-hyf8.onrender.com'
      : '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically injects JWT token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Triggers actions on authentication failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If JWT expires or is invalid, clear credentials and redirect to login
    if (error.response && error.response.status === 401) {
      console.warn('[API Client] Unauthorized request. Purging expired session...');
      localStorage.removeItem('userInfo');
      // If we are on the browser, trigger state refresh
      if (typeof window !== 'undefined') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
