// hooks/useApi.js
import { useState } from 'react';

export const useApi = (apiFunc) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiFunc(...args);
            if (result.success) {
                setData(result.data);
            } else {
                setError(result.message);
            }
            return result;
        } catch (err) {
            setError(err.message || 'Something went wrong');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, request };
};