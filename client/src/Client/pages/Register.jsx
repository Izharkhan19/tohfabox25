import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { registerUser } from '../../api-services/apiService';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };
            
            const result = await registerUser(userData);

            if (result.success) {
                navigate('/login');
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left: Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 order-2 lg:order-1">
                <div className="max-w-md w-full">
                    <Link to="/" className="inline-flex items-center text-sm uppercase tracking-widest text-gray-500 hover:text-resin-blue transition-colors font-bold mb-12">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Return to Gallery
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-4xl font-serif font-bold text-resin-dark mb-3">Create Account</h1>
                        <p className="text-gray-500">Join our community of art collectors and enthusiasts.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-resin-dark hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold h-14 rounded-full tracking-widest uppercase text-sm transition-all shadow-md mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Register Now'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-resin-blue hover:text-resin-dark transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right: Image Side */}
            <div className="hidden lg:block lg:w-1/2 relative order-1 lg:order-2">
                <img 
                    src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&fit=crop" 
                    alt="Resin Art Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-resin-dark/30 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-16">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-md mb-4">Start Your Tohfabox25 Collection</h2>
                    <p className="text-resin-light text-lg font-light max-w-md">Join exclusive access to one-of-a-kind, handcrafted resin masterpieces before they sell out.</p>
                </div>
            </div>
        </div>
    );
}
