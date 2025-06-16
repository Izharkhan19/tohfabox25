// src/utils/toastUtils.ts (or .js)
import { toast, type ToastOptions } from 'react-toastify';

/**
 * Displays a success toast notification.
 * @param message The message to display.
 * @param options Optional configuration for the toast.
 */
export const SuccessToast = (message: string, options?: ToastOptions) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000, // Shorter autoClose for success messages
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        ...options, // Allow overriding default options
    });
};

/**
 * Displays an error toast notification.
 * @param message The message to display.
 * @param options Optional configuration for the toast.
 */
export const ErrorToast = (message: string, options?: ToastOptions) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000, // Longer autoClose for error messages
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored", // Using 'colored' theme for errors for more visibility
        ...options, // Allow overriding default options
    });
};

/**
 * Displays an info toast notification.
 * @param message The message to display.
 * @param options Optional configuration for the toast.
 */
export const InfoToast = (message: string, options?: ToastOptions) => {
    toast.info(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        ...options,
    });
};

/**
 * Displays a warning toast notification.
 * @param message The message to display.
 * @param options Optional configuration for the toast.
 */
export const WarningToast = (message: string, options?: ToastOptions) => {
    toast.warn(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        ...options,
    });
};