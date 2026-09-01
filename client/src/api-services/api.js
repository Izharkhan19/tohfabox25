// // api.js (or apiClient.js)
// import axios from 'axios';

// // Base URL - Change this according to your environment
// const API_BASE_URL = import.meta.env.VITE_API_URL

// // Create axios instance
// const api = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Request interceptor - Add JWT token automatically
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('adminToken'); // or get from context/cookies
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Response interceptor - Handle common errors globally
// api.interceptors.response.use(
//     (response) => {
//         // All success responses follow: { success: true, data, message }
//         return response.data;
//     },
//     (error) => {
//         const fallbackError = {
//             success: false,
//             message: 'Something went wrong. Please try again.',
//             error: error.message,
//         };

//         if (error.response) {
//             // Server responded with error status
//             const { data, status } = error.response;

//             if (status === 401) {
//                 // Token expired or invalid → logout user
//                 localStorage.removeItem('adminToken');
//                 localStorage.removeItem('user');
//                 window.location.href = '/login?session=expired';
//                 return Promise.reject({ ...fallbackError, message: 'Session expired. Please login again.' });
//             }

//             if (status === 403) {
//                 return Promise.reject({ ...fallbackError, message: 'You do not have permission.' });
//             }

//             // Use backend error message if available
//             return Promise.reject({
//                 success: false,
//                 message: data.message || fallbackError.message,
//                 error: data.error || error.message,
//                 status,
//             });
//         }

//         if (error.request) {
//             // Network error
//             return Promise.reject({
//                 ...fallbackError,
//                 message: 'No response from server. Check your internet connection.',
//             });
//         }

//         return Promise.reject(fallbackError);
//     }
// );

// export default api;


// src/api-services/api.js


// src/api-services/api.js
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // Smart token selector
// api.interceptors.request.use(
//     (config) => {
//         let token = localStorage.getItem("adminToken") || localStorage.getItem("token");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Global response handler — PERFECT behavior
// api.interceptors.response.use(
//     (response) => {
//         // All good → return backend data
//         return response.data;
//     },
//     (error) => {
//         // 401 → Unauthorized (token expired, invalid, or missing)
//         if (error.response?.status === 401) {
//             // Clear all auth data
//             localStorage.removeItem("token");
//             localStorage.removeItem("adminToken");
//             localStorage.removeItem("user");

//             // Smart redirect
//             const isAdminRoute = window.location.pathname.startsWith("/admin");
//             const redirectTo = isAdminRoute ? "/admin/login" : "/login";

//             // Avoid infinite redirect loop
//             if (!window.location.pathname.includes("/login")) {
//                 window.location.href = `${redirectTo}?session=expired`;
//             }

//             // Return a clean 401 error (your handleApiCall will catch it)
//             return Promise.reject({
//                 success: false,
//                 message: "Your session has expired. Please login again.",
//                 status: 401,
//             });
//         }

//         // Other errors (400, 403, 500, etc.) → return exact backend message
//         if (error.response) {
//             const { data } = error.response;
//             return Promise.reject({
//                 success: false,
//                 message: data.message || "Request failed",
//                 status: error.response.status,
//                 error: data.error || error.message,
//             });
//         }

//         // Network error
//         if (error.code === "ERR_NETWORK") {
//             return Promise.reject({
//                 success: false,
//                 message: "Cannot connect to server. Please check your internet.",
//             });
//         }

//         // Fallback
//         return Promise.reject({
//             success: false,
//             message: "An unexpected error occurred",
//         });
//     }
// );

// export default api;


// src/api-services/api.js
// src/api-services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || (
    import.meta.env.DEV
        ? "http://localhost:5000/api"
        : "https://tohfabox25.onrender.com/api"
);

const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
const MAX_RETRIES = 2;

const wait = (milliseconds) => new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
});

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token (admin or client)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// Render free services can need a moment to wake up after inactivity.
api.interceptors.response.use(undefined, async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const retryCount = config?._retryCount || 0;
    const method = config?.method?.toUpperCase();
    const isReadRequest = ["GET", "HEAD", "OPTIONS"].includes(method);
    const isRetryable = isReadRequest && (!error.response || RETRYABLE_STATUS_CODES.has(status)) && !import.meta.env.DEV;

    if (config && isRetryable && retryCount < MAX_RETRIES) {
        config._retryCount = retryCount + 1;
        await wait(1000 * 2 ** retryCount);
        return api(config);
    }

    return Promise.reject(error);
});


// Ultimate Response Handler
api.interceptors.response.use(
    (response) => {
        // All 2xx responses → return data directly
        return {
            success: true,
            data: response.data,
            message: response.data?.message || "Success",
        };
    },
    (error) => {
        const isAdminRoute = window.location.pathname.startsWith("/admin");
        const loginPath = isAdminRoute ? "/admin/login" : "/login";

        // 401 - Unauthorized
        if (error.response?.status === 401) {
            // Clear auth
            localStorage.removeItem("token");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("user");

            // Avoid redirect loop
            if (!window.location.pathname.includes("/login")) {
                window.location.href = `${loginPath}?expired=true`;
            }

            // Specific message for login failures
            const msg = error.response.data?.message;
            const isInvalidCredentials = msg?.toLowerCase().includes("invalid") ||
                msg?.toLowerCase().includes("credential") ||
                msg?.toLowerCase().includes("password");

            return Promise.reject({
                success: false,
                message: isInvalidCredentials
                    ? "Invalid email or password"
                    : "Your session has expired. Please login again.",
                status: 401,
            });
        }

        // 403 - Forbidden
        if (error.response?.status === 403) {
            return Promise.reject({
                success: false,
                message: error.response.data?.message || "You don't have permission to do this.",
                status: 403,
            });
        }

        // 404 - Not Found
        if (error.response?.status === 404) {
            return Promise.reject({
                success: false,
                message: error.response.data?.message || "Resource not found",
                status: 404,
            });
        }

        // 400 & 422 - Validation / Bad Request
        if (error.response?.status === 400 || error.response?.status === 422) {
            const msg = error.response.data?.message;
            const errors = error.response.data?.errors;

            if (errors && typeof errors === "object") {
                // Format validation errors nicely
                const firstError = Object.values(errors)[0];
                return Promise.reject({
                    success: false,
                    message: Array.isArray(firstError) ? firstError[0] : firstError,
                    status: error.response.status,
                });
            }

            return Promise.reject({
                success: false,
                message: msg || "Invalid request",
                status: error.response.status,
            });
        }

        // 500+ - Server Errors
        if (error.response?.status >= 500) {
            return Promise.reject({
                success: false,
                message: "Server error. Please try again later.",
                status: error.response.status,
            });
        }

        // Network / No Response
        if (!error.response) {
            if (error.code === "ERR_NETWORK") {
                return Promise.reject({
                    success: false,
                    message: "No internet connection",
                });
            }

            return Promise.reject({
                success: false,
                message: "Failed to connect to server",
            });
        }

        // Fallback
        return Promise.reject({
            success: false,
            message: error.response.data?.message || "Something went wrong",
            status: error.response.status,
        });
    }
);

export default api;


// src/api-services/api.js

// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Smart token selector: Admin uses adminToken, Client uses token
// api.interceptors.request.use(
//     (config) => {
//         // First priority: adminToken (for admin panel)
//         let token = localStorage.getItem('adminToken');

//         // If no admin token, fall back to client token
//         if (!token) {
//             token = localStorage.getItem('token');
//         }

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Global error handler
// api.interceptors.response.use(
//     (response) => response.data,
//     (error) => {
//         const fallback = {
//             success: false,
//             message: 'Something went wrong',
//         };


 
//         if (error.response) {
//             const { status, data } = error.response;
 
//             if (status === 401) {
//                 // Clear everything and redirect
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('adminToken');
//                 localStorage.removeItem('user');

//                 const isAdminRoute = window.location.pathname.startsWith('/admin');
//                 window.location.href = isAdminRoute ? '/admin/login' : '/login?expired=true';
//                 return;
//             }

//             return Promise.reject({
//                 ...fallback,
//                 message: data.message || fallback.message,
//                 status,
//             });
//         }

//         if (error.code === 'ERR_NETWORK') {
//             return Promise.reject({
//                 ...fallback,
//                 message: 'Cannot connect to server. Check your internet.',
//             });
//         }

//         return Promise.reject(fallback);
//     }
// );

// export default api;