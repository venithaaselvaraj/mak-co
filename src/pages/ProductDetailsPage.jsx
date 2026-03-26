import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, MessageCircle, Star, Shield, Truck, RefreshCw, X, Check, ChevronRight } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!product);
    const [variant, setVariant] = useState({ size: 'Standard', color: 'Natural' });
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        if (!product) {
            async function fetchProduct() {
                try {
                    const docRef = doc(db, 'products', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setProduct({ id: docSnap.id, ...docSnap.data() });
                    }
                } catch (err) {
                    console.error("Error fetching product:", err);
                } finally {
                    setLoading(false);
                }
            }
            fetchProduct();
        }
    }, [id, product]);

    const handleAddToCart = () => {
        const itemWithVariants = { 
            ...product, 
            id: `${product.id}-${variant.size}-${variant.color}`,
            name: `${product.name} (${variant.size}, ${variant.color})`,
            variant
        };
        addToCart(itemWithVariants);
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FBF6E9] flex flex-col items-center justify-center p-12">
                <div className="w-16 h-16 border-4 border-[#800000]/20 border-t-[#800000] rounded-full animate-spin mb-6"></div>
                <p className="text-[#800000] font-serif italic text-lg tracking-widest uppercase">Revealing The Weave...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#FBF6E9] flex flex-col items-center justify-center p-12 text-center">
                <h2 className="text-4xl font-serif text-[#2D1B10] mb-6">Product Not Found</h2>
                <button onClick={() => navigate('/dashboard')} className="bg-[#800000] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Back To Atelier</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF6E9] text-[#2D1B10] font-sans selection:bg-[#800000] selection:text-white pb-20">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-[#FBF6E9]/90 backdrop-blur-md border-b border-amber-900/10 px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#800000] font-bold text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-serif font-bold text-[#800000]">The Detail</h1>
                        <div className="h-0.5 w-12 bg-amber-500 rounded-full" />
                    </div>
                    <div className="w-10"></div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Visuals */}
                    <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border border-amber-900/10 bg-white group">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        </motion.div>
                        <div className="grid grid-cols-4 gap-4">
                            {[product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl].map((img, i) => (
                                <button key={i} onClick={() => setActiveImg(i)} className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#800000] scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col h-full">
                        <div className="mb-8">
                            <span className="text-[11px] uppercase tracking-[0.4em] text-amber-600 font-bold">{product.category}</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2D1B10] mt-4 mb-6 leading-tight">{product.name}</h2>
                            <div className="flex items-center gap-6 mb-8 bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-amber-900/10 w-fit">
                                <span className="text-4xl font-serif text-[#800000]">₹{parseFloat(product.price).toLocaleString()}</span>
                                <div className="h-8 w-[1px] bg-amber-900/10"></div>
                                <div className="flex gap-1 text-amber-500">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                            </div>
                        </div>

                        <p className="text-[#5D4037]/70 text-lg font-serif mb-12 leading-relaxed italic">{product.description || "A sacred weave of unmatched purity, crafted for the true devotee of heritage aesthetics. Every thread tells a story of tradition."}</p>

                        <div className="space-y-12 mb-12 flex-grow">
                            {/* Variants Selection */}
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#800000] mb-4">Select Scale (Size)</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Small', 'Medium', 'Large', 'Extra Large', 'Standard'].map(s => (
                                        <button key={s} onClick={() => setVariant({...variant, size: s})}
                                            className={`px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all ${variant.size === s ? 'bg-[#800000] border-[#800000] text-white shadow-xl shadow-red-950/20' : 'border-amber-900/10 text-[#5D4037] hover:bg-white'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#800000] mb-4">Boutique Colorways</label>
                                <div className="flex gap-4">
                                    {['Natural', 'Saffron', 'Vedic Red', 'Peacock Blue'].map(c => (
                                        <button key={c} onClick={() => setVariant({...variant, color: c})}
                                            className={`w-12 h-12 rounded-full border-4 transition-all ${variant.color === c ? 'border-[#800000] scale-110 shadow-xl shadow-amber-900/10' : 'border-white'} relative group`}
                                            style={{ backgroundColor: c === 'Natural' ? '#FBF6E9' : c === 'Saffron' ? '#F59E0B' : c === 'Vedic Red' ? '#B91C1C' : '#1E3A8A' }}>
                                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap bg-white px-3 py-1 rounded-full shadow-lg border border-amber-900/10">{c}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-10 border-t border-amber-900/10 bg-white/30 backdrop-blur-sm p-10 rounded-[3rem]">
                            <button onClick={handleAddToCart}
                                className="w-full bg-[#800000] text-white py-6 rounded-[2rem] font-bold shadow-2xl shadow-red-950/30 hover:bg-[#A52A2A] transition-all flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.4em] group">
                                <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" /> Add To Selection
                            </button>
                            <button onClick={() => { handleAddToCart(); navigate('/cart'); }}
                                className="w-full border-2 border-amber-900/20 text-[#2D1B10] py-6 rounded-[2rem] font-bold hover:bg-white transition-all flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.4em]">
                                <MessageCircle size={20} /> Checkout Inquiry
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-24">
                    {[
                        { icon: Shield, title: 'Heritage Certified', desc: '100% Genuine silk certification from silk board.' },
                        { icon: Truck, title: 'Global Delivery', desc: 'Ships to devotees across the divine world.' },
                        { icon: RefreshCw, title: 'Ritual Exchange', desc: 'Easy returns if the weave doesn\'t bless your soul.' }
                    ].map((feat, i) => (
                        <div key={i} className="bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border border-amber-900/5 text-center flex flex-col items-center group hover:bg-white transition-all shadow-xl shadow-amber-900/5 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#800000] mb-6 shadow-lg group-hover:bg-[#800000] group-hover:text-white transition-all duration-500">
                                <feat.icon size={24} />
                            </div>
                            <h4 className="text-xl font-serif text-[#2D1B10] mb-4">{feat.title}</h4>
                            <p className="text-[#5D4037]/60 text-[11px] leading-relaxed uppercase tracking-widest font-bold">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
