import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastSignupSuccess } from '../../utils/toast';
import { X, User, Lock, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const AuthModal = ({ isOpen, onClose, mode = 'signup' }) => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ password: '', name: '', whatsapp: '', address: '' });
    const [internalMode, setInternalMode] = useState(mode);
    const [isLoading, setIsLoading] = useState(false);

    // Sync internal mode when prop changes
    React.useEffect(() => {
        setInternalMode(mode);
    }, [mode]);

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (internalMode === 'admin') {
            // Admin Login: Name & Password
            if (formData.name.trim().toLowerCase() === 'vedha' && formData.password.trim() === 'vedha123') {
                console.log("Admin Logged In");
                setIsLoading(false);
                navigate('/admin/add-product');
            } else {
                setError('Invalid Admin Credentials');
                setIsLoading(false);
            }
        } else {
            // User Logic - Connect to Backend
            try {
                const endpoint = internalMode === 'signup' ? 'signup' : 'login';
                const response = await fetch(`/api/${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Something went wrong');
                }

                if (internalMode === 'signup') {
                    toastSignupSuccess();
                    setInternalMode('login');
                } else {
                    console.log("User Logged In", data.user);
                    // Store current user session in front-end
                    localStorage.setItem('current_user', JSON.stringify(data.user));
                    navigate('/dashboard');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#3d0000]/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md p-8 overflow-y-auto max-h-[90vh] bg-[#FDFBF7] rounded-xl shadow-2xl border-4 border-[#800000]/10 scrollbar-hide"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-[#800000]/60 hover:text-[#800000] transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-[#800000] mb-2">
                                {internalMode === 'admin' ? t('auth', 'adminPortal') : (internalMode === 'login' ? t('auth', 'welcomeBack') : t('auth', 'namaste'))}
                            </h2>
                            <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full" />
                            <p className="text-[#800000]/70 mt-4">
                                {internalMode === 'admin' ? t('auth', 'adminDesc') : (internalMode === 'login' ? t('auth', 'loginDesc') : t('auth', 'signupDesc'))}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-800 text-sm rounded-lg text-center font-medium border border-red-200">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Field - Admin or Signup */}
                            {(internalMode === 'admin' || internalMode === 'signup') && (
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[#800000] ml-1">{t('auth', 'fullName')}</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]/50" size={16} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder={internalMode === 'admin' ? "Admin Name" : "John Doe"}
                                            className="pl-10 w-full bg-white border border-[#800000]/20 rounded-lg px-4 py-2.5 text-sm text-[#3d0000] placeholder-[#800000]/30 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* WhatsApp - Users Only */}
                            {internalMode !== 'admin' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[#800000] ml-1">{t('auth', 'whatsapp')}</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]/50" size={16} />
                                        <input
                                            type="tel"
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleInputChange}
                                            placeholder="9876543210"
                                            className="pl-10 w-full bg-white border border-[#800000]/20 rounded-lg px-4 py-2.5 text-sm text-[#3d0000] placeholder-[#800000]/30 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Address - Signup Only */}
                            {internalMode === 'signup' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[#800000] ml-1">{t('auth', 'address')}</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-[#800000]/50" size={16} />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="123, Temple St, Kanchipuram"
                                            rows={2}
                                            className="pl-10 w-full bg-white border border-[#800000]/20 rounded-lg px-4 py-2 text-sm text-[#3d0000] placeholder-[#800000]/30 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 resize-none"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password - Always */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-[#800000] ml-1">{t('auth', 'password')}</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]/50" size={16} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        className="pl-10 w-full bg-white border border-[#800000]/20 rounded-lg px-4 py-2.5 text-sm text-[#3d0000] placeholder-[#800000]/30 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-[#800000] text-[#FDFBF7] font-serif font-medium py-3 rounded-lg shadow-lg hover:bg-[#600000] hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? t('auth', 'processing') : (internalMode === 'admin' ? t('auth', 'login') : (internalMode === 'login' ? t('auth', 'login') : t('auth', 'createAccount')))}
                                {!isLoading && <ArrowRight size={18} />}
                            </button>

                            <div className="text-center mt-4">
                                {internalMode !== 'admin' && (
                                    <>
                                        <span className="text-[#800000]/60 text-sm">
                                            {internalMode === 'login' ? t('auth', 'dontHaveAccount') + ' ' : t('auth', 'alreadyHaveAccount') + ' '}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setInternalMode(internalMode === 'login' ? 'signup' : 'login')}
                                            className="text-[#800000] hover:text-[#600000] hover:underline text-sm font-bold font-serif"
                                        >
                                            {internalMode === 'login' ? t('auth', 'signup') : t('auth', 'login')}
                                        </button>
                                        <div className="my-3 flex items-center gap-2">
                                            <div className="h-[1px] flex-1 bg-[#800000]/10"></div>
                                            <span className="text-[10px] text-[#800000]/40 uppercase tracking-wider">or</span>
                                            <div className="h-[1px] flex-1 bg-[#800000]/10"></div>
                                        </div>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setInternalMode(internalMode === 'admin' ? 'login' : 'admin')}
                                    className="text-[#800000]/50 hover:text-[#800000] text-xs font-medium transition-colors"
                                >
                                    {internalMode === 'admin' ? "← Back to Customer Login" : "Admin Portal Access"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
