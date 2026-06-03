import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toastSuccess, toastError } from '../../utils/toast';
import { Upload, ArrowLeft, Plus, Check, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const AddProduct = () => {
    const navigate = useNavigate();
    const { t, language, toggleLanguage } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    // Form and Image states
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Women',
        description: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handlePublish = async (e) => {
        e.preventDefault();

        if (!image) {
            toastError("Please upload an image");
            return;
        }

        setIsLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('image', image);

        try {
            // Added slightly more robust fetch with timeout-like behavior or just clearer logging
            const response = await fetch('/api/products', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                toastSuccess("Heritage piece sanctuary entry successful!");
                navigate('/products'); // Redirect to products management
            } else {
                const errData = await response.json();
                toastError(errData.error || "Failed to add product");
            }
        } catch (error) {
            console.error("Critical Upload Error:", error);
            toastError("Sanctuary connection lost. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#3d0000] font-serif relative overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Language Switcher */}
            <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={toggleLanguage}
                className="fixed top-8 right-8 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-[#D4AF37]/30 text-[#800000] font-sans font-bold hover:bg-[#800000] hover:text-[#FDFBF7] transition-all duration-300"
            >
                <Globe size={18} />
                <span>{language === 'en' ? 'English' : 'தமிழ்'}</span>
            </motion.button>

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-[#800000] hover:text-[#D4AF37] transition-colors mb-8 font-medium"
                >
                    <ArrowLeft size={20} />
                    {t('admin', 'back')}
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-[#800000]/10 shadow-[0_20px_50px_rgba(128,0,0,0.1)]"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#D4AF37]/20">
                        <div>
                            <h1 className="text-3xl font-bold text-[#800000] font-['Cinzel']">{t('admin', 'title')}</h1>
                            <div className="h-1 w-20 bg-[#D4AF37] mt-2 rounded-full" />
                        </div>
                        <button type="button" onClick={() => {
                            const samples = [
                                {
                                    name: 'Brahminical 9-Yard Kumbakonam Madisar Saree',
                                    price: '18500',
                                    category: 'Women',
                                    description: 'A masterpiece 9-yard Madisar drape from Kumbakonam, featuring pure mulberry silk and authentic gold zari border, tailored for traditional Brahmin rituals.'
                                },
                                {
                                    name: 'Sacred White Brahmin Panchakacham Veshti Set',
                                    price: '1800',
                                    category: 'Men',
                                    description: 'Fine white cotton Panchakacham Veshti with an exquisite gold zari border, worn traditionally by priests and archakas for temple daily puja.'
                                },
                                {
                                    name: 'Lord Venkateswara Swamy Peethambaram Vastram',
                                    price: '24500',
                                    category: 'Men',
                                    description: 'Heavy-weight divine Peethambaram gold-threaded silk vastram, designed specifically for draping Swamy statue temple deities.'
                                }
                            ];
                            const nextIdx = (window._addProductIdx || 0) % samples.length;
                            setFormData(samples[nextIdx]);
                            window._addProductIdx = (window._addProductIdx || 0) + 1;
                        }} className="text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 bg-[#800000]/10 text-[#800000] rounded-full hover:bg-[#800000] hover:text-[#FDFBF7] transition-all border border-[#800000]/20 self-start sm:self-center">
                            Fill Sample Data
                        </button>
                    </div>

                    <form onSubmit={handlePublish} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Image Upload Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-[#800000] uppercase tracking-wide">
                                    {t('admin', 'image')}
                                </label>
                                <div className="border-2 border-dashed border-[#800000]/20 rounded-xl aspect-[4/5] flex flex-col items-center justify-center bg-[#FDFBF7] hover:bg-[#FFF5F5] transition-colors cursor-pointer group relative overflow-hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    />
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="p-4 bg-[#800000]/5 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="text-[#800000]" size={32} />
                                            </div>
                                            <span className="text-[#800000]/60 font-medium">{t('admin', 'uploadImage')}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Inputs Section */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#800000] uppercase tracking-wide">
                                        {t('admin', 'productName')}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#fcfcfc] border border-[#800000]/20 rounded-lg px-4 py-3 text-[#3d0000] focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all placeholder-[#800000]/30"
                                        placeholder="E.g. Kanchipuram Silk Saree"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#800000] uppercase tracking-wide">
                                        {t('admin', 'price')}
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#fcfcfc] border border-[#800000]/20 rounded-lg px-4 py-3 text-[#3d0000] focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all placeholder-[#800000]/30"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#800000] uppercase tracking-wide">
                                        {t('admin', 'category')}
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#fcfcfc] border border-[#800000]/20 rounded-lg px-4 py-3 text-[#3d0000] focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all cursor-pointer"
                                    >
                                        <option value="Women">{t('dashboard', 'women')}</option>
                                        <option value="Men">{t('dashboard', 'men')}</option>
                                        <option value="Accessories">{t('dashboard', 'accessories')}</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#800000] uppercase tracking-wide">
                                        {t('admin', 'description')}
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full bg-[#fcfcfc] border border-[#800000]/20 rounded-lg px-4 py-3 text-[#3d0000] focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all placeholder-[#800000]/30 resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#800000] text-white py-4 rounded-xl font-bold tracking-wide shadow-lg shadow-red-900/20 hover:shadow-xl hover:bg-[#600000] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Sanctifying & Uploading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Check size={20} />
                                            {t('admin', 'publish')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AddProduct;
