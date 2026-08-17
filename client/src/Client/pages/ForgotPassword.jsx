import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { forgotPassword } from '../../api-services/apiService';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email) {
            return setError('Please enter your email address');
        }

        setLoading(true);
        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message || 'Failed to send reset request');
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gray-50">
                <div className="max-w-md w-full">
                    <Link to="/login" className="inline-flex items-center text-sm uppercase tracking-widest text-gray-500 hover:text-resin-blue transition-colors font-bold mb-6">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-serif font-bold text-resin-dark mb-2">Reset Password</h1>
                        <p className="text-gray-500 text-sm">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="mb-6 p-6 bg-green-50 border border-green-100 rounded-xl text-center">
                            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-green-800 mb-2">Request Received</h3>
                            <p className="text-green-700 text-sm">
                                If an account exists for {email}, you will receive reset instructions shortly.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all text-sm"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-resin-dark hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold h-12 rounded-full tracking-widest uppercase text-sm transition-all shadow-md mt-6"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Right: Image Side */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img referrerPolicy="no-referrer" 
                    src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&fit=crop" 
                    alt="Resin Art Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-resin-dark/30 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-16">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-md mb-4">
                        Secure Your Account
                    </h2>
                    <p className="text-resin-light text-lg font-light max-w-md">
                        Get back to your collection quickly and securely.
                    </p>
                </div>
            </div>
        </div>
    );
}
