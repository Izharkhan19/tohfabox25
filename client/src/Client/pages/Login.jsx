import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { loginUser } from '../../api-services/apiService';

export default function Login() {
    const navigate = useNavigate();
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
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError(result.message || 'Invalid email or password');
            }
        } catch (err) {
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
                    alt="Tohfabox25"
                    className="absolute inset-0 w-full h-full object-contain bg-white p-8"
                />
            </div>

            {/* Right: Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="max-w-md w-full">
                    <Link to="/" className="inline-flex items-center text-sm uppercase tracking-widest text-gray-500 hover:text-resin-blue transition-colors font-bold mb-12">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Return to Gallery
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-4xl font-serif font-bold text-resin-dark mb-3">Sign In</h1>
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
                            <input
                                type="text"
                                required
                                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                                placeholder="you@example.com or +1 (555) 000-0000"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full px-5 py-4 pr-14 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-0 flex items-center px-5 text-gray-500 hover:text-resin-blue focus:outline-none focus:ring-2 focus:ring-inset focus:ring-resin-blue rounded-r-xl"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" aria-hidden="true" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-resin-blue focus:ring-resin-blue" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-bold text-resin-blue hover:text-resin-dark transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            aria-busy={loading}
                            className="w-full bg-resin-dark hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold h-14 rounded-full tracking-widest uppercase text-sm transition-all shadow-md mt-4"
                        >
                            {loading ? (
                                <span className="inline-flex items-center justify-center gap-2" aria-live="polite">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/login')}
                            className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold h-12 rounded-full tracking-widest uppercase text-xs transition-all mt-3"
                        >
                            Login as Admin
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-resin-blue hover:text-resin-dark transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
