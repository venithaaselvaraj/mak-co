import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastFillDetails, toastReviewSubmitted } from '../utils/toast';
import { Star, Upload, ArrowLeft, Filter, Camera, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_REVIEWS = [
    { id: 1, name: 'Lakshmi V.', rating: 5, date: '15 May 2024', product: 'Brahminical 9-Yard Kumbakonam Madisar Saree', text: 'The pure silk feels divine. Wore it for my daughter\'s Grahapravesam and received countless compliments. The gold zari work is exquisite.', imageUrl: 'https://placehold.co/400x500/800000/FBF6E9?text=Happy+Customer', status: 'approved' },
    { id: 2, name: 'Srinivasan Iyer', rating: 5, date: '02 June 2024', product: 'Sacred White Brahmin Panchakacham Veshti', text: 'Perfect length and very comfortable cotton for daily rituals. Will definitely order the silk version for upcoming festivals.', imageUrl: 'https://placehold.co/400x500/2D1B10/FBF6E9?text=Happy+Devotee', status: 'approved' },
    { id: 3, name: 'Priya R.', rating: 4, date: '28 April 2024', product: 'Pure Gold-Zari Pavadai Sattai (Girls)', text: 'Beautiful craftsmanship. My daughter loved the vibrant colors for her dance performance. Slightly delayed shipping but worth the wait.', imageUrl: 'https://placehold.co/400x500/D4AF37/2D1B10?text=Customer+Photo', status: 'approved' }
];

export default function ReviewsPage() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState(MOCK_REVIEWS);
    const [filterRating, setFilterRating] = useState(0); // 0 means all
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newReview, setNewReview] = useState({
        name: '',
        product: '',
        rating: 5,
        text: '',
        image: null
    });

    const averageRating = reviews.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.rating, 0) / reviews.filter(r => r.status === 'approved').length || 0;
    const totalReviews = reviews.filter(r => r.status === 'approved').length;

    const filteredReviews = filterRating === 0 ? reviews : reviews.filter(r => r.rating === filterRating);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewReview({ ...newReview, image: event.target.result });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newReview.name || !newReview.text || !newReview.product) return toastFillDetails();
        
        setIsSubmitting(true);
        setTimeout(() => {
            const addedReview = {
                id: Date.now(),
                name: newReview.name,
                rating: newReview.rating,
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                product: newReview.product,
                text: newReview.text,
                imageUrl: newReview.image || 'https://placehold.co/400x500/800000/FBF6E9?text=Pending+Approval',
                status: 'pending' // Admin approval required
            };
            setReviews([addedReview, ...reviews]);
            setNewReview({ name: '', product: '', rating: 5, text: '', image: null });
            setShowForm(false);
            setIsSubmitting(false);
            toastReviewSubmitted();
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#FBF6E9] font-sans selection:bg-[#800000] selection:text-white">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-[#FBF6E9]/90 backdrop-blur-md border-b border-amber-900/10 px-6 py-4 shadow-sm">
                <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#800000] font-bold text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
                        <ArrowLeft size={18} /> Back To Atelier
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-serif font-bold text-[#800000]">Devotee Diaries</h1>
                        <div className="h-0.5 w-12 bg-amber-500 rounded-full" />
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className="bg-[#800000] text-white px-5 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-bold hover:bg-[#A52A2A] transition-colors flex items-center gap-2 shadow-sm">
                        <Camera size={14} /> Share Your Look
                    </button>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12">
                {/* Stats & Filters */}
                <div className="bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-amber-900/10 p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#800000] to-amber-600 flex items-center justify-center shadow-lg text-white text-3xl font-serif">
                            {averageRating.toFixed(1)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif text-[#2D1B10] mb-1">Sacred Testimonials</h2>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1 text-amber-500">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill={star <= Math.round(averageRating) ? "currentColor" : "none"} />)}
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 border-l border-amber-900/20 pl-3">
                                    Based on {totalReviews} reviews
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 flex items-center gap-1"><Filter size={14} /> Filter</span>
                        {[0, 5, 4, 3, 2, 1].map(rating => (
                            <button key={rating} onClick={() => setFilterRating(rating)}
                                className={`px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-bold border transition-all ${filterRating === rating ? 'bg-[#800000] text-white border-[#800000]' : 'bg-white border-amber-900/10 text-[#5D4037] hover:border-amber-900/30 hover:bg-amber-50'}`}>
                                {rating === 0 ? 'All' : `${rating} Stars`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Form (Collapsible) */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-12">
                            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-amber-900/10 p-8 shadow-xl max-w-3xl mx-auto">
                                <h3 className="text-xl font-serif text-[#2D1B10] mb-6">Write a Review</h3>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Your Name</label>
                                        <input type="text" value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} className="w-full bg-[#FBF6E9] border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" placeholder="Enter name" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Sacred Weave (Product Name)</label>
                                        <input type="text" value={newReview.product} onChange={e => setNewReview({...newReview, product: e.target.value})} className="w-full bg-[#FBF6E9] border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" placeholder="Which product did you adorn?" required />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button type="button" key={star} onClick={() => setNewReview({...newReview, rating: star})} className={`${newReview.rating >= star ? 'text-amber-500' : 'text-gray-300'} hover:scale-110 transition-transform`}>
                                                <Star size={24} fill="currentColor" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Your Experience</label>
                                    <textarea value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} rows={4} className="w-full bg-[#FBF6E9] border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000] resize-none" placeholder="Share your experience wearing our collection..." required />
                                </div>
                                <div className="mb-8">
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Upload Photo</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-amber-900/10 border-dashed rounded-2xl cursor-pointer bg-[#FBF6E9] hover:bg-white transition-all overflow-hidden relative">
                                            {newReview.image ? (
                                                <img src={newReview.image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-amber-900/40">
                                                    <Upload size={24} className="mb-2" />
                                                    <p className="text-xs font-bold uppercase tracking-widest">Click to upload photo</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-[#800000] text-white py-4 rounded-xl font-bold shadow-xl shadow-red-950/20 hover:bg-[#A52A2A] transition-all text-[10px] uppercase tracking-[0.3em] disabled:opacity-50 flex items-center justify-center">
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredReviews.length === 0 ? (
                        <div className="col-span-full text-center py-20">
                            <p className="text-xl font-serif text-[#5D4037]/40">No reviews found for this filter.</p>
                        </div>
                    ) : (
                        filteredReviews.map(review => (
                            <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={review.id} className="bg-white rounded-[2.5rem] border border-amber-900/10 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
                                <div className="relative h-72 bg-gray-100 overflow-hidden">
                                    <img src={review.imageUrl} alt={review.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    {review.status === 'pending' && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                                            <Clock size={32} className="mb-3 text-amber-400" />
                                            <span className="text-[10px] uppercase tracking-widest font-bold">Awaiting Sanctity Check</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-serif text-[#2D1B10] text-lg font-bold flex items-center gap-2">
                                                {review.name} 
                                                {review.status === 'approved' && <CheckCircle size={14} className="text-emerald-600" title="Verified Purchase" />}
                                            </h4>
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-[#5D4037]/40">{review.date}</span>
                                        </div>
                                        <div className="flex gap-0.5 text-amber-500">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                                        </div>
                                    </div>
                                    <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">{review.product}</p>
                                    <p className="text-sm text-[#5D4037]/80 leading-relaxed italic">"{review.text}"</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
