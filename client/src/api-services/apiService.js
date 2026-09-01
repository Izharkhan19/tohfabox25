// // apiService.js
// import api from './api';

// // Generic handler for consistent response/error flow
// const handleApiCall = async (apiCall, successMessage = null) => {
//     try {
//         const response = await apiCall();
//         if (response.success) {
//             if (successMessage) {
//                 console.log('Success:', successMessage); // Replace with toast later
//             }
//             return { success: true, data: response.data, message: response.message };
//         }
//     } catch (err) {
//         console.error('API Error:', err.message);
//         // Show toast notification in real app
//         toast.error(err.message || 'An error occurred');
//         return { success: false, error: err, message: err.message };
//     }
// };

// // AUTH
// export const registerUser = (userData) =>
//     handleApiCall(() => api.post('/auth/register', userData), 'Registration successful!');

// export const loginUser = (credentials) =>
//     handleApiCall(() => api.post('/auth/login', credentials));

// export const getCurrentUser = () =>
//     handleApiCall(() => api.get('/auth/me'));

// export const updateProfile = (data) =>
//     handleApiCall(() => api.put('/auth/profile', data), 'Profile updated');

// export const changePassword = (data) =>
//     handleApiCall(() => api.put('/auth/change-password', data), 'Password changed');

// // PRODUCTS
// export const getProducts = (filters = {}) =>
//     handleApiCall(() => api.get('/products', { params: filters }));

// export const getProduct = (id) =>
//     handleApiCall(() => api.get(`/products/${id}`));

// export const getFeaturedProducts = () =>
//     handleApiCall(() => api.get('/products/featured'));

// export const createProduct = (formData) =>
//     handleApiCall(() => api.post('/products', formData), 'Product created');

// export const updateProduct = (id, formData) =>
//     handleApiCall(() => api.put(`/products/${id}`, formData), 'Product updated');

// export const deleteProduct = (id) =>
//     handleApiCall(() => api.delete(`/products/${id}`), 'Product deleted');

// export const deleteProductImage = (productId, imageId) =>
//     handleApiCall(() => api.delete(`/products/${productId}/images/${imageId}`));

// // CATEGORIES
// export const getCategories = () =>
//     handleApiCall(() => api.get("/categories"));

// export const createCategory = (data) =>
//     handleApiCall(() => api.post("/categories", data), "Category created!");

// export const updateCategory = (id, data) =>
//     handleApiCall(() => api.put(`/categories/${id}`, data), "Category updated!");

// export const deleteCategory = (id) =>
//     handleApiCall(() => api.delete(`/categories/${id}`), "Category deleted!");


// // ORDERS
// export const createOrder = (orderData) =>
//     handleApiCall(() => api.post('/orders', orderData), 'Order placed successfully!');

// export const getMyOrders = () =>
//     handleApiCall(() => api.get('/orders'));

// export const getOrder = (id) =>
//     handleApiCall(() => api.get(`/orders/${id}`));

// export const cancelOrder = (id) =>
//     handleApiCall(() => api.put(`/orders/${id}/cancel`), 'Order cancelled');

// export const getOrderStats = () =>
//     handleApiCall(() => api.get('/orders/stats/overview'));

// export const getMonthlySales = () =>
//     handleApi(() => api.get('/orders/stats/monthly'));


// export const getOrders = (filters = {}) =>
//     handleApiCall(() => api.get("/orders", { params: filters }));

// export const getOrderById = (id) =>
//     handleApiCall(() => api.get(`/orders/${id}`));

// export const updateOrderStatus = (id, data) =>
//     handleApiCall(() => api.put(`/orders/${id}/status`, data), "Status updated!");

// src/api-services/apiService.js
import api from './api';

// Generic handler for consistent response/error flow
const handleApiCall = async (apiCall, successMessage = null) => {
    try {
        const response = await apiCall();
        if (response?.success) {
            if (successMessage) {
                console.log("Success:", successMessage);
            }
            return { success: true, data: response.data, message: response.message };
        }
    } catch (err) {
        const message = err?.response?.data?.message || err?.message || "An error occurred";
        console.error("API Error:", message);
        return { success: false, error: err, message };
    }
};

// ==================== AUTH ====================
export const registerUser = (userData) =>
    handleApiCall(() => api.post("/auth/register", userData), "Registration successful!");

export const loginUser = (credentials) =>
    handleApiCall(() => api.post("/auth/login", credentials));

export const forgotPassword = (identifier) =>
    handleApiCall(() => api.post("/auth/forgot-password", { identifier }));

export const resetPassword = (token, password) =>
    handleApiCall(() => api.put(`/auth/reset-password/${token}`, { password }));

export const getAllUser = () =>
    handleApiCall(() => api.get("/auth/users"));

export const getCurrentUser = () =>
    handleApiCall(() => api.get("/auth/me"));

export const updateProfile = (data) =>
    handleApiCall(() => api.put("/auth/profile", data), "Profile updated");

export const changePassword = (data) =>
    handleApiCall(() => api.put("/auth/change-password", data), "Password changed");

// ==================== PRODUCTS ====================
export const getProducts = (filters = {}) =>
    handleApiCall(() => api.get("/products", { params: filters }));

export const getProduct = (id) =>
    handleApiCall(() => api.get(`/products/${id}`));

export const getProductReviews = (productId) =>
    handleApiCall(() => api.get(`/products/${productId}/reviews`));

export const saveProductReview = (productId, reviewData) =>
    handleApiCall(() => api.post(`/products/${productId}/reviews`, reviewData));

export const getFeaturedProducts = () =>
    handleApiCall(() => api.get("/products/featured"));

// Admin
export const createProduct = (formData) =>
    handleApiCall(() => api.post("/products", formData), "Product created!");

export const updateProduct = (id, formData) =>
    handleApiCall(() => api.put(`/products/${id}`, formData), "Product updated!");

export const deleteProduct = (id) =>
    handleApiCall(() => api.delete(`/products/${id}`), "Product deleted!");

export const deleteProductImage = (productId, imageId) =>
    handleApiCall(() => api.delete(`/products/${productId}/images/${imageId}`));

// ==================== CATEGORIES ====================
export const getCategories = () =>
    handleApiCall(() => api.get("/categories"));

export const createCategory = (data) =>
    handleApiCall(() => api.post("/categories", data), "Category created!");

export const updateCategory = (id, data) =>
    handleApiCall(() => api.put(`/categories/${id}`, data), "Category updated!");

export const deleteCategory = (id) =>
    handleApiCall(() => api.delete(`/categories/${id}`), "Category deleted!");

// ==================== CART (NEW!) ====================
export const getCart = () =>
    handleApiCall(() => api.get("/cart"), "Cart loaded");

export const addToCart = async (productId, quantity = 1) => {
    const result = await handleApiCall(
        () => api.post("/cart", { productId, quantity }),
        "Added to cart!"
    );
    if (result?.success) window.dispatchEvent(new Event("cartChanged"));
    return result;
};

export const updateCartItem = async (productId, quantity) => {
    const result = await handleApiCall(
        () => api.put(`/cart/${productId}`, { quantity }),
        "Cart updated"
    );
    if (result?.success) window.dispatchEvent(new Event("cartChanged"));
    return result;
};

export const removeFromCart = async (productId) => {
    const result = await handleApiCall(
        () => api.delete(`/cart/${productId}`),
        "Removed from cart"
    );
    if (result?.success) window.dispatchEvent(new Event("cartChanged"));
    return result;
};

export const clearCart = async () => {
    const result = await handleApiCall(() => api.delete("/cart"), "Cart cleared");
    if (result?.success) window.dispatchEvent(new Event("cartChanged"));
    return result;
};

export const validatePromo = (code, subtotal) =>
    handleApiCall(() => api.post('/promos/validate', { code, subtotal }));

export const getPromos = () => handleApiCall(() => api.get('/promos'));
export const createPromo = (data) => handleApiCall(() => api.post('/promos', data));
export const deletePromo = (id) => handleApiCall(() => api.delete(`/promos/${id}`));

// ==================== WISHLIST (NEW!) ====================
export const getWishlist = () =>
    handleApiCall(() => api.get("/wishlist"), "Wishlist loaded");

export const addToWishlist = async (productId) => {
    const result = await handleApiCall(
        () => api.post("/wishlist", { productId }),
        "Added to wishlist!"
    );
    if (result?.success) window.dispatchEvent(new Event("wishlistChanged"));
    return result;
};

export const updateWishlistItem = (productId, quantity) =>
    handleApiCall(
        () => api.put(`/wishlist/${productId}`, { quantity }),
        "Wishlist updated"
    );

export const removeFromWishlist = async (productId) => {
    const result = await handleApiCall(
        () => api.delete(`/wishlist/${productId}`),
        "Removed from wishlist"
    );
    if (result?.success) window.dispatchEvent(new Event("wishlistChanged"));
    return result;
};

export const clearWishlist = async () => {
    const result = await handleApiCall(() => api.delete("/wishlist"), "Wishlist cleared");
    if (result?.success) window.dispatchEvent(new Event("wishlistChanged"));
    return result;
};

// ==================== ORDERS ====================
export const createOrder = (orderData) =>
    handleApiCall(() => api.post("/orders", orderData), "Order placed successfully!");

export const getMyOrders = () =>
    handleApiCall(() => api.get("/orders"));

export const getOrder = (id) =>
    handleApiCall(() => api.get(`/orders/${id}`));

export const cancelOrder = (id) =>
    handleApiCall(() => api.put(`/orders/${id}/cancel`), "Order cancelled");

// Admin
export const getOrders = (filters = {}) =>
    handleApiCall(() => api.get("/orders", { params: filters }));

export const getOrderById = (id) =>
    handleApiCall(() => api.get(`/orders/${id}`));

export const updateOrderStatus = (id, data) =>
    handleApiCall(() => api.put(`/orders/${id}/status`, data), "Status updated!");

export const getOrderStats = () =>
    handleApiCall(() => api.get('/orders/stats/overview'));

export const getMonthlySales = () =>
    handleApiCall(() => api.get('/orders/stats/monthly'));
