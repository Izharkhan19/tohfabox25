import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { registerUser } from '../../api-services/apiService';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        if (!formData.phone || formData.phone.length < 7) {
            return setError('Please enter a valid phone number');
        }

        setLoading(true);
        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            };
            
            const result = await registerUser(userData);

            if (result.success) {
                navigate('/login');
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left: Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-brand-light soft-grid order-2 lg:order-1">
                <div className="max-w-md w-full">
                    <Link to="/" className="inline-flex items-center text-sm uppercase tracking-widest text-gray-500 hover:text-resin-blue transition-colors font-bold mb-4">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Return to Gallery
                    </Link>

                    <div className="mb-4 border-l-4 border-resin-gold pl-4">
                        <h1 className="text-2xl font-serif font-bold text-resin-dark mb-1">Create Account</h1>
                        <p className="text-gray-500 text-xs">Join our community of art collectors and enthusiasts.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all text-sm"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all text-sm"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                            <PhoneInput
                                country={'in'}
                                enableSearch={true}
                                value={formData.phone}
                                onChange={(phone) => setFormData({ ...formData, phone: phone })}
                                inputStyle={{ width: '100%', height: '40px', borderRadius: '0.5rem', borderColor: '#e5e7eb', paddingLeft: '45px', fontSize: '0.875rem' }}
                                buttonStyle={{ borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem', borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                                containerStyle={{ width: '100%' }}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full px-3 py-2 pr-11 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-resin-blue focus:outline-none focus:ring-2 focus:ring-inset focus:ring-resin-blue rounded-r-lg"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" aria-hidden="true" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    className="w-full px-3 py-2 pr-11 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all text-sm"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                                    aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                                    title={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-resin-blue focus:outline-none focus:ring-2 focus:ring-inset focus:ring-resin-blue rounded-r-lg"
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" aria-hidden="true" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            aria-busy={loading}
                            className="w-full bg-resin-dark hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold h-10 rounded-full tracking-widest uppercase text-xs transition-all shadow-md mt-4"
                        >
                            {loading ? (
                                <span className="inline-flex items-center justify-center gap-2" aria-live="polite">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                                    Creating account...
                                </span>
                            ) : 'Register Now'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-xs text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-resin-blue hover:text-resin-dark transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right: Image Side */}
            <div className="hidden lg:block lg:w-1/2 relative order-1 lg:order-2">
                <img referrerPolicy="no-referrer" 
                    src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&fit=crop" 
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.png';
                    }}
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
