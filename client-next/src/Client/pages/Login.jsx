"use client";
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { loginUser } from '../../api-services/apiService';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await loginUser({ email: formData.email, password: formData.password });

            if (result.success && result.data?.data?.token) {
                // Determine role
                const userObj = result.data?.data?.user;
                const token = result.data?.data?.token;
                const userRole = userObj?.role || 'user';
                
                // Set to localStorage
                localStorage.setItem("token", token);
                if (userRole === 'admin') {
                    localStorage.setItem("adminToken", token);
                }
                localStorage.setItem("user", JSON.stringify(userObj));
                
                // Dispatch event so App.jsx updates
                window.dispatchEvent(new Event("userChanged"));

                if (userRole === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                setError(result.message || 'Invalid email or password');
            }
        } catch {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left: Image Side */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    referrerPolicy="no-referrer"
                    src="/logo.png"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                    }}
                    alt="Artistary Crafts"
                    className="absolute inset-0 w-full h-full object-contain bg-white p-8"
                />
            </div>

            {/* Right: Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-brand-light soft-grid">
                <div className="max-w-md w-full">
                    <Link href="/" className="inline-flex items-center text-sm uppercase tracking-widest text-gray-500 hover:text-resin-blue transition-colors font-bold mb-12">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Return to Gallery
                    </Link>

                    <div className="mb-10 border-l-4 border-resin-gold pl-5">
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-resin-dark mb-3">Sign In</h1>
                        <p className="text-gray-500">Please enter your credentials to access your account.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address or Phone Number</label>
                            <InputText
                                required
                                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                                placeholder="you@example.com or +1 (555) 000-0000"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <Password
                                required
                                feedback={false}
                                toggleMask
                                inputClassName="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                                className="w-full"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Checkbox inputId="rememberMe" className="mr-2 text-resin-blue" />
                                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">Remember me</label>
                            </div>
                            <Link href="/forgot-password" className="text-sm font-bold text-resin-blue hover:text-resin-dark transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            label={loading ? "Signing in..." : "Sign In"}
                            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                            disabled={loading}
                            className="w-full bg-resin-dark border-none hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold h-14 rounded-full tracking-widest uppercase text-sm transition-all shadow-md mt-4 justify-center"
                        />

                        <Button
                            type="button"
                            label="Login as Admin"
                            outlined
                            onClick={() => router.push('/admin/login')}
                            className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold h-12 rounded-full tracking-widest uppercase text-xs transition-all mt-3 justify-center"
                        />
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-bold text-resin-blue hover:text-resin-dark transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
