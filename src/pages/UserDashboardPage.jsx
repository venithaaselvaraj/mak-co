import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Filter, LogOut, Globe, X, Check, Star, ShoppingCart, ChevronRight, Info, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = ['All', 'Men', 'Women', 'Accessories'];
const allFabrics = ['Pure Silk', 'Art Silk', 'Cotton Silk', 'Pure Cotton', 'Linen'];

export default function UserDashboardPage() {
    const navigate = useNavigate();
    const { logout, userData } = useAuth();
    const { addToCart, cart } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [selectedFabrics, setSelectedFabrics] = useState([]);
    
    // Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [variant, setVariant] = useState({ size: 'Standard', fabric: 'Pure Silk', color: 'Natural' });

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                // Limit to 24 for instant ritual reveal
                const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(24));
                const snap = await getDocs(q);
                // Check if collection has data
                if (snap.empty) {
                  throw new Error("No products found in Firestore");
                }
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Using demo collection.");
                // Fallback to demo data for visual completeness
                setProducts([
                    { id: '1', name: 'Premium Kanchipuram Saree', price: 15500, category: 'Women', imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=75&w=600', description: 'Exquisite hand-woven silk.' },
                    { id: '2', name: 'Cotton Silk Vasti', price: 2200, category: 'Men', imageUrl: 'https://images.unsplash.com/photo-1594235412411-208b04a9696c?auto=format&fit=crop&q=75&w=600', description: 'Traditional white dhoti.' },
                    { id: '3', name: 'Pure Linen Angavastram', price: 1500, category: 'Men', imageUrl: 'https://images.unsplash.com/photo-1594235412411-208b04a9696c?auto=format&fit=crop&q=75&w=600', description: 'Soft and sacred wrap.' }
                ]);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const cartCount = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesPrice = product.price >= priceRange.min && (product.price <= priceRange.max || priceRange.max === 100000);
        const matchesFabric = selectedFabrics.length === 0 || selectedFabrics.some(fabric =>
            product.name.toLowerCase().includes(fabric.toLowerCase()) ||
            (product.description || "").toLowerCase().includes(fabric.toLowerCase())
        );
        return matchesCategory && matchesPrice && matchesFabric;
    });

    const handleAddToCart = () => {
        const itemWithVariants = { 
            ...selectedProduct, 
            id: `${selectedProduct.id}-${variant.size}-${variant.color}`,
            name: `${selectedProduct.name} (${variant.size}, ${variant.color})`,
            variant
        };
        addToCart(itemWithVariants);
        setSelectedProduct(null);
    };

    return (
        <div className="min-h-screen bg-[#FBF6E9] text-[#2D1B10] font-sans selection:bg-[#800000] selection:text-white pb-20">
            {/* Background Pattern */}
            <div className="fixed inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10L15 10L12.5 15L10 10Z' fill='%23800000'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-[#FBF6E9]/90 backdrop-blur-xl border-b border-amber-900/10 px-6 py-4 shadow-lg shadow-amber-900/5">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-12 h-12 bg-[#800000] rounded-2xl flex items-center justify-center text-[#FBF6E9] shadow-xl shadow-red-950/20">
                            <span className="text-2xl font-serif">M</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-serif font-bold text-[#2D1B10] leading-none">M A K <span className="text-amber-600">&</span> CO</h1>
                            <span className="text-[9px] tracking-[0.4em] font-bold text-[#800000]/40 uppercase">Heritage Atelier</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/cart')} className="relative p-3 text-[#5D4037] hover:bg-amber-900/5 rounded-2xl transition-all border border-transparent hover:border-amber-900/10 group">
                            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#800000] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FBF6E9] animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button onClick={logout} className="p-3 text-[#800000]/60 hover:text-[#800000] hover:bg-amber-900/5 rounded-2xl transition-all">
                            <LogOut size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sub-Header Categories */}
            <div className="bg-white/30 backdrop-blur-sm border-b border-amber-900/5 py-4 overflow-x-auto">
                <div className="container mx-auto px-6 flex gap-4 scrollbar-hide">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-2.5 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeCategory === cat ? 'bg-[#800000] text-white shadow-xl shadow-red-950/20' : 'text-[#5D4037]/60 hover:text-[#800000] hover:bg-white/50'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <main className="container mx-auto px-6 py-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.4em] text-amber-600 font-bold">Auspicious Selections</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#2D1B10] mt-2">The <span className="italic text-[#800000]">Veda</span> Collection</h2>
                        <div className="h-1 w-20 bg-amber-500 mt-4 rounded-full" />
                    </div>
                    <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#800000] bg-white/50 px-6 py-3 rounded-2xl border border-amber-900/10 hover:bg-white transition-all shadow-sm">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-16 h-16 border-4 border-[#800000]/20 border-t-[#800000] rounded-full animate-spin mb-6"></div>
                        <p className="text-[#800000] font-serif italic text-lg">Curating your selection...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-40">
                        <p className="text-2xl font-serif text-[#5D4037]/40">No sacred weaves found matching your path.</p>
                        <button onClick={() => { setActiveCategory('All'); setPriceRange({ min: 0, max: 100000 }); }} className="mt-6 text-[#800000] font-bold hover:underline">Clear All Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {filteredProducts.map((product) => (
                            <motion.div layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} key={product.id}
                                className="group bg-white/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-amber-900/10 hover:border-amber-900/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-900/10">
                                <div className="aspect-[3/4] overflow-hidden relative">
                                    <img src={product.imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B10]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                        <button onClick={() => setSelectedProduct(product)}
                                            className="w-full bg-[#800000] text-white font-bold py-5 rounded-2xl hover:bg-[#A52A2A] transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                            <ShoppingCart size={16} /> Choose Details
                                        </button>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#800000] px-4 py-2 rounded-xl text-[10px] font-bold shadow-lg">
                                        ₹{parseFloat(product.price).toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-serif text-[#2D1B10] mb-2 group-hover:text-[#800000] transition-colors line-clamp-1">{product.name}</h3>
                                    <p className="text-[10px] text-[#5D4037]/40 tracking-widest uppercase mb-4 font-bold">{product.category}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-0.5 text-amber-500">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-amber-900/10 flex items-center justify-center text-amber-900/20 hover:text-amber-500 transition-colors pointer-events-none">
                                            <Info size={14} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- NEW: MORE TO EXPLORE SECTIONS --- */}
            <section className="container mx-auto px-6 py-24 border-t border-amber-900/10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif text-[#2D1B10]">Sacred <span className="italic text-[#800000]">Curations</span></h2>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-600/50 mt-4 italic">Themes of the Temple Heritage</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'The Brahminical Wedding', desc: 'Madisar sarees and pure silk vastis for the most sacred union.', icon: Shield, img: 'https://images.unsplash.com/photo-1594235412411-208b04a9696c?auto=format&fit=crop&q=70&w=600' },
                        { title: 'Temple Ritual Attire', desc: 'Unbleached hand-spun cotton vastis for daily puja and offerings.', icon: Globe, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=70&w=600' },
                        { title: 'Festival Silk Edit', desc: 'Vibrant Kanchipuram colors prepared for Diwali and Pongal celebrations.', icon: Star, img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=70&w=600' }
                    ].map((coll, i) => (
                        <motion.div key={i} whileHover={{ y: -10 }} className="group relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-xl border border-amber-900/10 cursor-pointer">
                            <img src={coll.img} alt={coll.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B10] via-[#2D1B10]/40 to-transparent p-10 flex flex-col justify-end">
                                <h4 className="text-xl font-serif text-[#FBF6E9] mb-2">{coll.title}</h4>
                                <p className="text-[10px] text-[#FBF6E9]/50 font-serif italic mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{coll.desc}</p>
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-amber-500">
                                    Browse Collection <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- HERITAGE PROMISE SECTION --- */}
            <section className="bg-[#1A0F0A] py-24">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <span className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-bold">The Promise of Purity</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#FBF6E9] mt-6 mb-8 leading-tight">Every Thread is a <span className="italic text-amber-500">Ritual of Quality</span></h2>
                        <ul className="space-y-6">
                            {[
                                { title: 'Authentic GI Tagged Silks', desc: 'Each Kanchipuram silk piece carries its genuine certification for pure gold zari.' },
                                { title: 'Vedic Loom Standards', desc: 'Our vastis are hand-loomed with zero synthetic fibers to maintain spiritual purity.' },
                                { title: 'Sacred Dyeing Process', desc: 'Environmentally blessed dyes derived from organic temple flowers and minerals.' }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-6 group">
                                    <div className="w-12 h-12 bg-[#800000] rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:bg-amber-600 transition-colors">
                                        <Check size={20} />
                                    </div>
                                    <div>
                                        <h5 className="text-[11px] uppercase tracking-widest font-bold text-[#FBF6E9] mb-2">{item.title}</h5>
                                        <p className="text-[#FBF6E9]/40 text-sm italic font-serif leading-relaxed line-clamp-2">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-[4rem] overflow-hidden border border-amber-900/20 shadow-2xl relative z-10">
                             <img src="https://images.unsplash.com/photo-1594235412411-208b04a9696c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="The Loom" />
                             <div className="absolute inset-0 bg-[#800000]/10" />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#800000] rounded-full blur-[100px] opacity-20" />
                        <div className="absolute -top-10 -left-10 w-48 h-48 bg-amber-500 rounded-full blur-[80px] opacity-10" />
                    </div>
                </div>
            </section>

            {/* --- AUSPICIOUS FOOTER --- */}
            <footer className="bg-[#FBF6E9] pt-24 pb-12 border-t border-amber-900/10">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                        <div className="lg:col-span-1">
                            <div className="w-16 h-16 bg-[#800000] text-white rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-amber-900/20">
                                <span className="text-3xl font-serif">M</span>
                            </div>
                            <h3 className="text-2xl font-serif text-[#2D1B10] mb-6 underline decoration-[#800000]/20 underline-offset-8">M A K & CO <br/> Heritage Atelier</h3>
                            <p className="text-[#5D4037]/60 text-xs italic font-serif leading-relaxed mb-8">Curating and restoring sacred textiles for the global devotee since generations.</p>
                            <div className="flex gap-4">
                                {[Globe, Shield, Check].map((Icon, i) => <Icon key={i} size={18} className="text-[#800000]/40 hover:text-[#800000] cursor-pointer transition-colors" />)}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#800000] mb-8">The Collection</h4>
                            <ul className="space-y-4 text-[11px] text-[#5D4037]/70 font-bold tracking-widest uppercase">
                                <li className="hover:text-[#800000] cursor-pointer transition-colors">Vedic Vasti Edit</li>
                                <li className="hover:text-[#800000] cursor-pointer transition-colors">Temple Madisar</li>
                                <li className="hover:text-[#800000] cursor-pointer transition-colors">Wedding Silk</li>
                                <li className="hover:text-[#800000] cursor-pointer transition-colors">Ritual Cotton</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#800000] mb-8">Support Center</h4>
                            <ul className="space-y-4 text-[11px] text-[#5D4037]/70 font-bold tracking-widest uppercase">
                                <li className="hover:text-[#800000] cursor-pointer transition-colors" onClick={() => navigate('/orders')}>Track Sacred Order</li>
                                <li className="hover:text-[#800000] cursor-pointer transition-colors" onClick={() => navigate('/returns')}>Heritage Restoration</li>
                                <li className="hover:text-[#800000] cursor-pointer transition-colors">Care Instructions</li>
                                <li className="hover:text-[#800000] cursor-pointer transition-colors" onClick={() => navigate('/chatbot')}>Consult the Atelier</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#800000] mb-8">Circle of Devotion</h4>
                            <p className="text-[10px] text-[#5D4037]/50 mb-6 font-bold tracking-widest leading-relaxed">Join our mailing circle for first access to the new weave edit.</p>
                            <div className="flex bg-white border border-amber-900/10 rounded-xl overflow-hidden shadow-inner">
                                <input className="flex-1 px-4 py-3 text-xs bg-transparent focus:outline-none" placeholder="devotee@example.com" />
                                <button className="bg-[#800000] text-[#FBF6E9] px-6 py-3 text-[9px] uppercase tracking-widest font-bold hover:bg-[#A52A2A] transition-colors">Join</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-12 border-t border-amber-900/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] uppercase tracking-widest font-bold text-[#5D4037]/30">
                        <p>© 2024 M A K & CO. All Sacred Rights Reserved.</p>
                        <div className="flex gap-8">
                            <span className="cursor-pointer hover:text-[#800000]">Privacy Covenant</span>
                            <span className="cursor-pointer hover:text-[#800000]">Terms of Ritual</span>
                            <span className="cursor-pointer hover:text-[#800000]">Loom Security</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* --- VARIANT SELECTION MODAL --- */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-[#2D1B10]/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-[#FBF6E9] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border border-amber-900/20 max-h-[90vh] overflow-y-auto">
                            <div className="grid md:grid-cols-2">
                                <div className="aspect-[4/5] md:h-full">
                                    <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-10 flex flex-col">
                                    <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/50 rounded-2xl transition-all text-[#800000]"><X size={24} /></button>
                                    <span className="text-[10px] uppercase tracking-[0.4em] text-amber-600 font-bold mb-2">Sacred Details</span>
                                    <h3 className="text-3xl font-serif text-[#2D1B10] mb-6">{selectedProduct.name}</h3>
                                    
                                    <div className="space-y-8 flex-grow">
                                        {/* Size Selection */}
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-4">Select Scale (Size)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['Small', 'Medium', 'Large', 'Extra Large', 'Standard'].map(s => (
                                                    <button key={s} onClick={() => setVariant({...variant, size: s})}
                                                        className={`px-4 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-bold border transition-all ${variant.size === s ? 'bg-[#800000] border-[#800000] text-white' : 'border-amber-900/10 text-[#5D4037] hover:bg-white'}`}>
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Color Selection */}
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-4">Boutique Colorways</label>
                                            <div className="flex gap-4">
                                                {['Natural', 'Saffron', 'Vedic Red', 'Peacock Blue'].map(c => (
                                                    <button key={c} onClick={() => setVariant({...variant, color: c})}
                                                        className={`w-10 h-10 rounded-full border-4 transition-all ${variant.color === c ? 'border-[#800000] scale-110 shadow-lg' : 'border-white'} relative group`}
                                                        style={{ backgroundColor: c === 'Natural' ? '#FBF6E9' : c === 'Saffron' ? '#F59E0B' : c === 'Vedic Red' ? '#B91C1C' : '#1E3A8A' }}>
                                                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap">{c}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 flex flex-col gap-4 mt-auto">
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/40">Estimated Price</span>
                                            <span className="text-2xl font-serif text-[#800000]">₹{parseFloat(selectedProduct.price).toLocaleString()}</span>
                                        </div>
                                        <button onClick={handleAddToCart}
                                            className="w-full bg-[#800000] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-red-950/20 hover:bg-[#A52A2A] transition-all text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                                            Add To Collection <ChevronRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Filter Drawer */}
            <AnimatePresence>
                {isFilterOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterOpen(false)} className="absolute inset-0 bg-[#2D1B10]/20 backdrop-blur-sm" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }}
                            className="relative w-full max-w-sm bg-[#FBF6E9] shadow-2xl p-10 flex flex-col border-l border-amber-900/10">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-3xl font-serif text-[#2D1B10]">Filters</h3>
                                <button onClick={() => setIsFilterOpen(false)} className="text-[#800000]"><X size={28} /></button>
                            </div>
                            
                            <div className="space-y-12 flex-grow overflow-y-auto pr-2 scrollbar-hide">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.4em] font-bold text-amber-600 mb-6">Max Budget (₹)</label>
                                    <input type="range" min="0" max="100000" step="1000" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                                        className="w-full accent-[#800000] cursor-pointer" />
                                    <div className="flex justify-between mt-4 text-[11px] font-bold text-[#5D4037]">
                                        <span>₹0</span>
                                        <span className="text-xl font-serif text-[#800000]">₹{priceRange.max.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => { setPriceRange({min: 0, max: 100000}); setSelectedFabrics([]); setIsFilterOpen(false); }}
                                className="w-full py-5 bg-white border border-[#800000]/20 text-[#800000] rounded-[2rem] text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#800000] hover:text-white transition-all mt-8">
                                Reset Sanctuary
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
