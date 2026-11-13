import { create } from 'zustand';
import {
    getCart,
    getFeaturedProducts,
    getWishlist,
    getCategories,
} from '../api-services/apiService';

const requestCache = new Map();

const getCached = (key, request, setData) => {
    const existingRequest = requestCache.get(key);
    if (existingRequest) return existingRequest;

    const pendingRequest = request()
        .then((result) => {
            if (result?.success) setData(result.data?.data || []);
            return result;
        })
        .finally(() => requestCache.delete(key));

    requestCache.set(key, pendingRequest);
    return pendingRequest;
};

export const useAppStore = create((set) => ({
    featuredProducts: null,
    cartItems: null,
    wishlistItems: null,
    categories: null,
    fetchCategories: () => getCached(
        'categories',
        () => getCategories(),
        (data) => set({ categories: data })
    ),
    fetchFeaturedProducts: () => getCached(
        'featured-products',
        () => getFeaturedProducts(),
        (data) => set({ featuredProducts: data })
    ),
    fetchCart: () => getCached(
        'cart',
        () => getCart(),
        (data) => set({ cartItems: data })
    ),
    fetchWishlist: () => getCached(
        'wishlist',
        () => getWishlist(),
        (data) => set({ wishlistItems: data })
    ),
    invalidate: (...keys) => {
        const nextState = {};
        if (keys.includes('featured-products')) nextState.featuredProducts = null;
        if (keys.includes('cart')) nextState.cartItems = null;
        if (keys.includes('wishlist')) nextState.wishlistItems = null;
        if (keys.includes('categories')) nextState.categories = null;
        set(nextState);
    },
    clear: () => set({ featuredProducts: null, cartItems: null, wishlistItems: null, categories: null }),
}));
