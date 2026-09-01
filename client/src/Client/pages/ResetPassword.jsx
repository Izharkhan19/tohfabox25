import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../api-services/apiService';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters long');
        }

        setLoading(true);
        try {
            const result = await resetPassword(token, formData.password);
            
            if (result.success) {
                setSuccess('Password reset successfully! You will be redirected shortly.');
                // Simulate an automatic login & redirect after a moment
                setTimeout(() => {
                    navigate('/'); // or wherever they should go after login
                    window.location.reload(); // Quick way to sync auth state across app
                }, 2000);
            } else {
                setError(result.message || 'Failed to reset password. The token may have expired.');
            }
        } catch {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-light soft-grid">
            <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_rgba(18,52,59,0.14)] p-8 border border-resin-gold/20">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-resin-dark mb-2">New Password</h1>
                    <p className="text-gray-500 text-sm">
                        Please enter your new password below.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <div className="mb-6 p-6 bg-green-50 border border-green-100 rounded-xl">
                            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-green-800 mb-2">Success!</h3>
                            <p className="text-green-700 text-sm">{success}</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all text-sm"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-resin-dark hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold h-12 rounded-full tracking-widest uppercase text-sm transition-all shadow-md mt-6"
                        >
                            {loading ? 'Updating...' : 'Reset Password'}
                        </button>
                    </form>
                )}
                
                {!success && (
                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm font-bold text-resin-blue hover:text-resin-dark transition-colors">
                            Return to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
