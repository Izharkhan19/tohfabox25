import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
// import { useAppDispatch } from '../store/hooks';
// import { setUser } from '../store/authSlice';
import { auth } from '../firebase/config';
import { type User } from 'firebase/auth';
import { useAppDispatch } from '../components/store/hooks';
import { setUser } from '../components/store/authSlice';

export const useAuth = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            dispatch(setUser(user));
        });
        return () => unsubscribe();
    }, [dispatch]);
};