import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Filter, LogOut, Globe, X, Check, Star, ShoppingCart, ChevronRight, Info, Shield, Zap, Sparkles, Shirt, Package, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = ['All', 'Men', 'Women', 'Accessories'];
const allFabrics = ['Pure Silk', 'Art Silk', 'Cotton Silk', 'Pure Cotton', 'Linen'];

const colorToHex = {
    'Natural': '#FBF6E9',
    'Saffron': '#F59E0B',
    'Vedic Red': '#B91C1C',
    'Peacock Blue': '#1E3A8A',
    'Emerald': '#059669'
};

export default function UserDashboardPage() {
    const navigate = useNavigate();
    const { logout, userData } = useAuth();
    const { addToCart, cart } = useCart();

    const [products, setProducts] = useState([]);
    const [latestOrder, setLatestOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [selectedFabrics, setSelectedFabrics] = useState([]);
    
    // Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [variant, setVariant] = useState({ size: 'Standard', fabric: 'Pure Silk', color: 'Natural' });
    const [pairing, setPairing] = useState({ type: null, fabric: 'Pure Cotton', color: 'Natural', price: 0 });
    
    // Direct Checkout State
    const [directBuyContext, setDirectBuyContext] = useState(null);
    const [directAddress, setDirectAddress] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('current_user') || '{}').address || '';
        } catch { return ''; }
    });
    const [isDirectLoading, setIsDirectLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                if (import.meta.env.VITE_FIREBASE_API_KEY === 'AIzaSyDemoKeyReplaceMeWithReal') {
                    const DATA_VERSION = 'v2_saree_dhoti';
                    const savedVersion = localStorage.getItem('mock_products_version');
                    // Clear stale data from old sessions
                    if (savedVersion !== DATA_VERSION) {
                        localStorage.removeItem('mock_products');
                        localStorage.setItem('mock_products_version', DATA_VERSION);
                    }
                    const saved = localStorage.getItem('mock_products');
                    if (saved) {
                        setProducts(JSON.parse(saved));
                        setLoading(false);
                        return;
                    }
                    throw new Error("Mock Mode enabled, skipping Firebase fetch");
                }
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
                const saved = localStorage.getItem('mock_products');
                if (saved) {
                    setProducts(JSON.parse(saved));
                } else {
                    setProducts([
                        { id: '1', name: 'Kanchipuram Pattu Saree', price: 18500, category: 'Women', imageUrl: '/assets/products/kanchipuram.png', description: 'Exquisite hand-woven pure silk with gold zari border.' },
                        { id: '2', name: 'Pure White Vedic Vasti', price: 1200, category: 'Men', imageUrl: '/assets/products/vasti.png', description: 'Traditional handloom cotton dhoti for daily puja.' },
                        { id: '3', name: 'Brahminical Madisar Saree', price: 14200, category: 'Women', imageUrl: '/assets/products/madisar.png', description: '9-yard Madisar drape for sacred ceremonies.' },
                        { id: '4', name: 'Sacred Angavastram Set', price: 2500, category: 'Men', imageUrl: '/assets/products/angavastram.png', description: 'Ivory cotton shawl with gold border for temple.' },
                        { id: '5', name: 'Banarasi Silk Saree', price: 22000, category: 'Women', imageUrl: '/assets/products/banarasi.png', description: 'Opulent Banarasi silk with brocade golden motifs.' },
                        { id: '6', name: 'Dhoti with Silk Border', price: 1850, category: 'Men', imageUrl: '/assets/products/dhoti_border.png', description: 'Cotton dhoti with vibrant silk accent border.' },
                        { id: '7', name: 'Cotton Saree Half Silk', price: 4500, category: 'Women', imageUrl: '/assets/products/kanchipuram.png', description: 'Lightweight saree for everyday wear with temple motifs.' },
                        { id: '8', name: 'Pure Cotton Vasti', price: 950, category: 'Men', imageUrl: '/assets/products/vasti.png', description: 'Everyday unbleached cotton dhoti for puja rituals.' },
                    ]);
                }
            } finally {
                setLoading(false);
            }
        }
        async function fetchLatestOrder() {
            try {
                if (import.meta.env.VITE_FIREBASE_API_KEY === 'AIzaSyDemoKeyReplaceMeWithReal') {
                    // Check local tracking for mock
                    const mock_orders = [
                        { id: '1', orderId: 'SACRED-9912', status: 'preparing', productName: 'Pure Silk Vasti', createdAt: new Date().toISOString() }
                    ];
                    setLatestOrder(mock_orders[0]);
                    return;
                }
                const q = query(
                    collection(db, 'orders'), 
                    where('userId', '==', userData?.uid), 
                    orderBy('createdAt', 'desc'), 
                    limit(1)
                );
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setLatestOrder({ id: snap.docs[0].id, ...snap.docs[0].data() });
                }
            } catch (err) {
                console.error("Order fetch error:", err);
            }
        }

        fetchProducts();
        fetchLatestOrder();
    }, [userData]);

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
            variant,
            quantity: 1
        };
        addToCart(itemWithVariants);
        
        // Add paired item if selected
        if (pairing.type) {
            addToCart({
                id: `paired-${pairing.type}-${pairing.fabric}-${pairing.color}-${Date.now()}`,
                name: `Matching ${pairing.fabric} ${pairing.type} (${pairing.color})`,
                price: pairing.price,
                imageUrl: `https://placehold.co/300x400/${colorToHex[pairing.color].replace('#', '')}/ffffff?text=${encodeURIComponent(pairing.color + '\\n' + pairing.type)}`,
                quantity: 1
            });
        }
        
        setSelectedProduct(null);
        setPairing({ type: null, fabric: 'Pure Cotton', color: 'Natural', price: 0 });
    };

    const handleBuyNow = () => {
        const itemWithVariants = { 
            ...selectedProduct, 
            id: `${selectedProduct.id}-${variant.size}-${variant.color}`,
            name: `${selectedProduct.name} (${variant.size}, ${variant.color})`,
            variant,
            quantity: 1
        };
        
        const itemsToBuy = [itemWithVariants];
        if (pairing.type) {
            itemsToBuy.push({
                id: `paired-${pairing.type}-${pairing.fabric}-${pairing.color}-${Date.now()}`,
                name: `Matching ${pairing.fabric} ${pairing.type} (${pairing.color})`,
                price: pairing.price,
                imageUrl: `https://placehold.co/300x400/${colorToHex[pairing.color].replace('#', '')}/ffffff?text=${encodeURIComponent(pairing.color + '\\n' + pairing.type)}`,
                quantity: 1
            });
        }
        
        setSelectedProduct(null);
        setPairing({ type: null, fabric: 'Pure Cotton', color: 'Natural', price: 0 });
        
        // Pass array of items to Direct Checkoug mapping
        setDirectBuyContext(itemsToBuy);
    };

    const handleDirectBuyNow = (product) => {
        const itemWithVariants = { 
            ...product, 
            id: `${product.id}-Standard-Natural`, // Default variant if bought directly
            name: `${product.name} (Standard, Natural)`,
            variant: { size: 'Standard', color: 'Natural' },
            quantity: 1
        };
        setDirectBuyContext(itemWithVariants);
    };

    const handleDirectWhatsAppOrder = async () => {
        if (!directAddress) return alert("Please provide your delivery address for the sacred inquiry.");
        setIsDirectLoading(true);

        const orderId = `SACRED-${Date.now().toString().slice(-6)}`;
        const itemsArray = Array.isArray(directBuyContext) ? directBuyContext : [directBuyContext];
        const totalAmount = itemsArray.reduce((sum, item) => sum + parseFloat(item.price), 0);
        
        const orderData = {
            orderId,
            items: itemsArray,
            totalAmount,
            deliveryAddress: directAddress,
            status: 'preparing',
            userId: userData?.uid || 'guest-devotee',
            createdAt: new Date().toISOString(),
            isWhatsApp: true,
            paymentStatus: 'pending_on_whatsapp'
        };

        const config = JSON.parse(localStorage.getItem('whatsapp_config') || '{}');
        const rawNumber = config.proprietorPhone || '7598137660';
        const cleanNumber = rawNumber.replace(/\D/g, '');
        const proprietorNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

        let text = `✨ *M A K & CO - INSTANT SACRED ORDER* ✨\n\n`;
        text += `🆔 *Order ID:* ${orderId}\n`;
        text += `📍 *Delivery Address:* ${directAddress}\n\n`;
        text += `--- *Collection Details* ---\n`;
        
        itemsArray.forEach((item, index) => {
            text += `\n*${index + 1}. ${item.name}*\n`;
            text += `   - Quantity: ${item.quantity}\n`;
            if (item.variant) {
                text += `   - Selection: ${item.variant.size} / ${item.variant.color}\n`;
            }
            text += `   - Price: ₹${item.price}\n`;
        });
        
        text += `\n---------------------------\n`;
        text += `📜 *TOTAL ESTIMATE: ₹${totalAmount}*\n\n`;
        text += `_Please share payment details for this inquiry._\n`;

        const whatsappUrl = `https://wa.me/${proprietorNumber}?text=${encodeURIComponent(text)}`;

        try {
            if (import.meta.env.VITE_FIREBASE_API_KEY !== 'AIzaSyDemoKeyReplaceMeWithReal') {
                const { addDoc } = await import('firebase/firestore');
                await addDoc(collection(db, 'orders'), orderData);
            }
            window.open(whatsappUrl, '_blank');
            setLatestOrder(orderData); // Set for immediate UI reveal
            setDirectBuyContext(null);
            setShowSuccessModal(true); // Reveal the tracking success state
        } catch (err) {
            console.error("Order archival error:", err);
            window.open(whatsappUrl, '_blank');
            setLatestOrder(orderData);
            setDirectBuyContext(null);
            setShowSuccessModal(true);
        } finally {
            setIsDirectLoading(false);
        }
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

                    {/* Quick Tracking Widget - The requested element */}
                    {latestOrder && (
                        <div className="flex-1 max-w-2xl bg-[#1A0F0A]/95 p-6 rounded-3xl border border-amber-900/20 shadow-2xl shadow-red-950/40 animate-slideUp">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
                                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FBF6E9]/60">Ritual Tracking: {latestOrder.orderId}</span>
                                </div>
                                <button onClick={() => navigate('/orders')} className="text-[10px] uppercase font-bold text-amber-500 hover:text-amber-400 transition-colors">See History 🐚</button>
                            </div>

                            <div className="flex justify-between items-center relative gap-2">
                                {[
                                    { s: 'preparing', l: 'Preparing', i: Package },
                                    { s: 'accepted', l: 'Sanctified', i: Check },
                                    { s: 'shipped', l: 'In-Transit', i: Truck },
                                    { s: 'delivered', l: 'Delivered', i: ShoppingBag },
                                ].map((step, idx, arr) => {
                                    const stages = ['preparing', 'accepted', 'shipped', 'delivered', 'completed'];
                                    const currentStage = stages.indexOf(latestOrder.status);
                                    const stepIdx = stages.indexOf(step.s);
                                    const isActive = stepIdx <= currentStage;

                                    return (
                                        <div key={step.s} className="flex-1 flex flex-col items-center relative z-10">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-700 ${
                                                isActive ? 'bg-[#800000] border-amber-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/20'
                                            }`}>
                                                <step.i size={16} />
                                            </div>
                                            <p className={`text-[8px] uppercase font-black tracking-widest mt-3 whitespace-nowrap ${isActive ? 'text-amber-500' : 'text-[#FBF6E9]/20'}`}>
                                                {step.l}
                                            </p>
                                        </div>
                                    );
                                })}
                                {/* Progress Bar Background */}
                                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[85%] h-[1px] bg-white/5 z-0" />
                            </div>
                        </div>
                    )}
                    
                    <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#800000] bg-white/50 px-6 py-3 rounded-2xl border border-amber-900/10 hover:bg-white transition-all shadow-sm shrink-0">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[40vh]">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="animate-pulse flex flex-col gap-4">
                                <div className="bg-amber-900/10 w-full aspect-[4/5] rounded-3xl" />
                                <div className="h-4 bg-amber-900/10 rounded w-3/4" />
                                <div className="h-4 bg-amber-900/10 rounded w-1/4" />
                            </div>
                        ))}
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
                                        <div className="flex gap-2">
                                            <button onClick={() => setSelectedProduct(product)} title="Matching Pairings"
                                                className="w-10 h-10 rounded-full border border-amber-900/10 bg-white flex items-center justify-center text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm hover:shadow-amber-900/20 group-hover:scale-110">
                                                <Sparkles size={16} />
                                            </button>
                                            <button onClick={() => handleDirectBuyNow(product)} title="Instant Buy"
                                                className="w-10 h-10 rounded-full border border-amber-900/10 bg-white flex items-center justify-center text-[#800000] hover:bg-[#800000] hover:text-white transition-all shadow-sm hover:shadow-red-950/20 group-hover:scale-110">
                                                <Zap size={16} className="relative -left-0.5" />
                                            </button>
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
                                <div className="aspect-[4/5] md:h-full relative overflow-hidden">
                                    <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                    {pairing.type && (
                                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                            className={`absolute ${pairing.type === 'Blouse' ? 'top-8 left-8 w-32 h-44 -rotate-3' : 'bottom-12 right-8 w-32 h-40 rotate-3'} drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] saturate-150`}>
                                            <div className="w-full h-full relative" style={{ backgroundColor: colorToHex[pairing.color], clipPath: pairing.type === 'Blouse' ? 'polygon(35% 0%, 65% 0%, 80% 35%, 100% 100%, 0% 100%, 20% 35%)' : 'polygon(30% 0%, 70% 0%, 100% 30%, 80% 45%, 80% 100%, 20% 100%, 20% 45%, 0% 30%)' }}>
                                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-black" />
                                                <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20" />
                                                <svg className="absolute inset-0 w-full h-full opacity-15 mix-blend-overlay">
                                                    <filter id="noise-overlay">
                                                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                                                    </filter>
                                                    <rect width="100%" height="100%" filter="url(#noise-overlay)" />
                                                </svg>
                                            </div>
                                            {/* Beautiful metallic hanger effect hook */}
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-t-full border-t-2 border-r-2 border-[#D4AF37] opacity-80" />
                                        </motion.div>
                                    )}
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
                                        <div className="flex gap-4">
                                            <button onClick={handleAddToCart}
                                                className="flex-1 bg-white border border-[#800000]/20 text-[#800000] py-5 rounded-[2rem] font-bold shadow-sm shadow-red-950/5 hover:bg-amber-50 transition-all text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                                Add To Collection
                                            </button>
                                            <button onClick={handleBuyNow}
                                                className="flex-1 bg-[#800000] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-red-950/20 hover:bg-[#A52A2A] transition-all text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                                Buy Now <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sacred Pairings (Interactive Add-ons) */}
                                    <div className="mt-12 pt-8 border-t border-amber-900/10">
                                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-600 mb-6 flex items-center gap-2 pr-2">
                                            <span>Sacred Pairings</span> <span className="flex-1 h-px bg-amber-900/10"></span>
                                        </h4>
                                        
                                        {selectedProduct.category === 'Women' ? (
                                            <motion.div whileHover={{ y: -2 }} className={`relative overflow-hidden transition-all duration-500 rounded-3xl p-6 border ${pairing.type === 'Blouse' ? 'bg-gradient-to-br from-white to-amber-50/50 border-[#800000]/20 shadow-xl' : 'bg-white/50 backdrop-blur-sm border-amber-900/10 hover:border-amber-900/30'}`}>
                                                {/* Dynamic Glow */}
                                                <AnimatePresence>
                                                    {pairing.type === 'Blouse' && (
                                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
                                                            className="absolute -top-10 -right-10 w-40 h-40 blur-[40px] rounded-full transition-colors duration-700 pointer-events-none"
                                                            style={{ backgroundColor: pairing.color === 'Natural' ? '#eab308' : pairing.color === 'Saffron' ? '#F59E0B' : pairing.color === 'Vedic Red' ? '#B91C1C' : pairing.color === 'Peacock Blue' ? '#1E3A8A' : '#059669' }}
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                <div className="flex justify-between items-center mb-6 relative z-10">
                                                    <div>
                                                        <h5 className={`font-serif font-bold text-xl transition-colors duration-300 ${pairing.type === 'Blouse' ? 'text-[#800000]' : 'text-[#2D1B10]'}`}>Matching Blouse</h5>
                                                        <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#5D4037]/60">Complete the Temple Look</p>
                                                    </div>
                                                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPairing(p => p.type ? { type: null, fabric: 'Pure Cotton', color: 'Natural', price: 0 } : { type: 'Blouse', fabric: 'Pure Cotton', color: 'Natural', price: 1200 })}
                                                        className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all shadow-sm ${pairing.type === 'Blouse' ? 'bg-[#800000] text-white border-[#800000] shadow-[#800000]/20' : 'bg-white border-amber-900/20 text-[#800000] hover:bg-[#800000] hover:text-white'}`}>
                                                        {pairing.type === 'Blouse' ? 'Selected (+₹1,200)' : 'Add Blouse'}
                                                    </motion.button>
                                                </div>
                                                
                                                <AnimatePresence>
                                                {pairing.type === 'Blouse' && (
                                                    <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className="pt-5 border-t border-amber-900/5 relative z-10 overflow-hidden">
                                                        <div className="space-y-6">
                                                            <div>
                                                                <span className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-3">Select Fabric</span>
                                                                <div className="flex gap-2 flex-wrap">
                                                                    {['Pure Cotton', 'Raw Silk', 'Art Silk'].map(f => (
                                                                        <button key={f} onClick={() => setPairing({...pairing, fabric: f, price: f === 'Pure Cotton' ? 850 : 1500})}
                                                                            className={`px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-bold border transition-all ${pairing.fabric === f ? 'bg-gradient-to-r from-[#800000] to-[#A52A2A] text-white border-transparent shadow-md' : 'bg-white border-amber-900/10 text-[#5D4037] hover:border-amber-900/30 hover:bg-amber-50'}`}>
                                                                            {f}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="flex justify-between items-end mb-4">
                                                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60">Blouse Colorway</span>
                                                                    <motion.span key={pairing.color} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 bg-white border border-amber-900/10 rounded-md text-[#800000] shadow-sm">
                                                                        {pairing.color}
                                                                    </motion.span>
                                                                </div>
                                                                <div className="flex gap-4 flex-wrap">
                                                                    {[
                                                                        { name: 'Natural', hex: '#FBF6E9' }, 
                                                                        { name: 'Saffron', hex: '#F59E0B' }, 
                                                                        { name: 'Vedic Red', hex: '#B91C1C' }, 
                                                                        { name: 'Peacock Blue', hex: '#1E3A8A' }, 
                                                                        { name: 'Emerald', hex: '#059669' }
                                                                    ].map(c => (
                                                                        <motion.button key={c.name} whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={() => setPairing({...pairing, color: c.name})}
                                                                            className={`relative w-10 h-10 rounded-full transition-all flex items-center justify-center ${pairing.color === c.name ? 'ring-2 ring-offset-2 ring-[#800000] shadow-lg shadow-amber-900/20 z-10' : 'border border-gray-200 shadow-md hover:border-amber-300'}`}
                                                                            style={{ backgroundColor: c.hex }} title={c.name}>
                                                                            {pairing.color === c.name && (
                                                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-3 h-3 rounded-full shadow-inner ${c.name === 'Natural' ? 'bg-[#800000]' : 'bg-white'}`} />
                                                                            )}
                                                                        </motion.button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ) : (
                                            <motion.div whileHover={{ y: -2 }} className={`relative overflow-hidden transition-all duration-500 rounded-3xl p-6 border ${pairing.type === 'Shirt' ? 'bg-gradient-to-br from-white to-blue-50/50 border-[#800000]/20 shadow-xl' : 'bg-white/50 backdrop-blur-sm border-amber-900/10 hover:border-amber-900/30'}`}>
                                                {/* Dynamic Glow */}
                                                <AnimatePresence>
                                                    {pairing.type === 'Shirt' && (
                                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
                                                            className="absolute -top-10 -right-10 w-40 h-40 blur-[40px] rounded-full transition-colors duration-700 pointer-events-none"
                                                            style={{ backgroundColor: pairing.color === 'Natural' ? '#eab308' : pairing.color === 'Saffron' ? '#F59E0B' : pairing.color === 'Vedic Red' ? '#B91C1C' : '#1E3A8A' }}
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                <div className="flex justify-between items-center mb-6 relative z-10">
                                                    <div>
                                                        <h5 className={`font-serif font-bold text-xl transition-colors duration-300 ${pairing.type === 'Shirt' ? 'text-[#800000]' : 'text-[#2D1B10]'}`}>Pure Silk Shirt</h5>
                                                        <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#5D4037]/60">Vasti Ceremonial Pairing</p>
                                                    </div>
                                                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPairing(p => p.type ? { type: null, fabric: 'Pure Silk', color: 'Natural', price: 0 } : { type: 'Shirt', fabric: 'Pure Silk', color: 'Natural', price: 2100 })}
                                                        className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all shadow-sm ${pairing.type === 'Shirt' ? 'bg-[#800000] text-white border-[#800000] shadow-[#800000]/20' : 'bg-white border-amber-900/20 text-[#800000] hover:bg-[#800000] hover:text-white'}`}>
                                                        {pairing.type === 'Shirt' ? 'Selected (+₹2,100)' : 'Add to Vasti'}
                                                    </motion.button>
                                                </div>
                                                
                                                <AnimatePresence>
                                                {pairing.type === 'Shirt' && (
                                                    <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className="pt-5 border-t border-amber-900/5 relative z-10 overflow-hidden">
                                                        <div className="space-y-6">
                                                            <div>
                                                                <div className="flex justify-between items-end mb-4">
                                                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60">Shirt Colorway</span>
                                                                    <motion.span key={pairing.color} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 bg-white border border-amber-900/10 rounded-md text-[#800000] shadow-sm">
                                                                        {pairing.color}
                                                                    </motion.span>
                                                                </div>
                                                                <div className="flex gap-4 flex-wrap">
                                                                    {[
                                                                        { name: 'Natural', hex: '#FBF6E9' }, 
                                                                        { name: 'Saffron', hex: '#F59E0B' }, 
                                                                        { name: 'Vedic Red', hex: '#B91C1C' }, 
                                                                        { name: 'Peacock Blue', hex: '#1E3A8A' }
                                                                    ].map(c => (
                                                                        <motion.button key={c.name} whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={() => setPairing({...pairing, color: c.name})}
                                                                            className={`relative w-10 h-10 rounded-full transition-all flex items-center justify-center ${pairing.color === c.name ? 'ring-2 ring-offset-2 ring-[#800000] shadow-lg shadow-amber-900/20 z-10' : 'border border-gray-200 shadow-md hover:border-amber-300'}`}
                                                                            style={{ backgroundColor: c.hex }} title={c.name}>
                                                                            {pairing.color === c.name && (
                                                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-3 h-3 rounded-full shadow-inner ${c.name === 'Natural' ? 'bg-[#800000]' : 'bg-white'}`} />
                                                                            )}
                                                                        </motion.button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                                </AnimatePresence>
                                            </motion.div>
                                        )}

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

            {/* --- DIRECT BUY CHECKOUT MODAL --- */}
            <AnimatePresence>
                {directBuyContext && (
                    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDirectBuyContext(null)} className="absolute inset-0 bg-[#2D1B10]/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#FBF6E9] w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 p-10 border border-amber-900/10">
                            <button onClick={() => setDirectBuyContext(null)} className="absolute top-6 right-6 text-[#800000] p-2 hover:bg-[#800000]/10 rounded-full transition-all"><X size={20} /></button>
                            
                            <h3 className="text-3xl font-serif text-[#2D1B10] mb-2">Instant Ritual</h3>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037]/50 mb-8">Direct WhatsApp Purchase</p>
                            
                            <div className="bg-white/50 p-4 rounded-2xl border border-amber-900/5 mb-8 flex flex-col gap-4">
                                {Array.isArray(directBuyContext) ? directBuyContext.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="w-16 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                            <img src={item.imageUrl} alt="Product" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[#2D1B10] font-serif font-bold text-lg leading-tight line-clamp-1">{item.name}</h4>
                                            <span className="text-amber-600 font-bold tracking-widest text-xs">₹{parseFloat(item.price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-20 rounded-xl overflow-hidden shadow-sm">
                                            <img src={directBuyContext.imageUrl} alt="Product" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[#2D1B10] font-serif font-bold text-lg leading-tight line-clamp-1">{directBuyContext.name}</h4>
                                            <span className="text-amber-600 font-bold tracking-widest text-xs">₹{parseFloat(directBuyContext.price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Sacred Delivery Address</label>
                                    <textarea rows={3} value={directAddress} onChange={e => setDirectAddress(e.target.value)} placeholder="Full spiritual address & landmark"
                                        className="w-full bg-white/60 border border-amber-900/10 rounded-2xl p-4 text-[#2D1B10] text-sm focus:outline-none focus:border-[#800000] transition-colors resize-none placeholder-amber-900/20" />
                                </div>

                                <button onClick={handleDirectWhatsAppOrder} disabled={isDirectLoading}
                                    className="w-full bg-[#800000] hover:bg-[#A52A2A] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-red-950/20 transition-all text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 mt-4 disabled:opacity-50">
                                    {isDirectLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Complete via WhatsApp <ChevronRight size={16} /></>
                                    )}
                                </button>
                                <p className="text-center text-[9px] text-[#5D4037]/40 uppercase tracking-widest font-bold mt-4">Opens a secure chat with the Proprietor</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- RITUAL SUCCESS & TRACKING MODAL --- */}
            <AnimatePresence>
                {showSuccessModal && latestOrder && (
                    <div className="fixed inset-0 z-[150] flex justify-center items-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSuccessModal(false)} className="absolute inset-0 bg-[#2D1B10]/95 backdrop-blur-2xl" />
                        <motion.div initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            className="bg-[#FBF6E9] w-full max-w-2xl rounded-[3.5rem] shadow-[0_40px_100px_rgba(128,0,0,0.4)] relative z-10 p-12 border border-amber-900/10 text-center overflow-hidden">
                            
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                                className="w-24 h-24 bg-emerald-500 rounded-full mx-auto flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-500/20">
                                <Check size={48} strokeWidth={4} />
                            </motion.div>

                            <h3 className="text-4xl font-serif text-[#2D1B10] mb-4">Blessings <span className="italic text-[#800000]">Initiated</span></h3>
                            <p className="text-[11px] uppercase tracking-[0.5em] font-black text-amber-600 mb-12">Order {latestOrder.orderId} Has Entered the Atelier</p>
                            
                            <div className="bg-[#1A0F0A] p-10 rounded-[2.5rem] border border-amber-900/10 mb-12 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                                <div className="flex justify-between items-center relative gap-4">
                                    {[
                                        { s: 'preparing', l: 'Preparing', i: Package },
                                        { s: 'accepted', l: 'Sanctified', i: Check },
                                        { s: 'shipped', l: 'In-Transit', i: Truck },
                                        { s: 'delivered', l: 'Delivered', i: ShoppingBag },
                                    ].map((step, idx) => {
                                        const stages = ['preparing', 'accepted', 'shipped', 'delivered', 'completed'];
                                        const currentStage = stages.indexOf(latestOrder.status);
                                        const stepIdx = stages.indexOf(step.s);
                                        const isActive = stepIdx <= currentStage;

                                        return (
                                            <div key={step.s} className="flex-1 flex flex-col items-center relative z-10">
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-1000 ${
                                                    isActive ? 'bg-[#800000] border-amber-500 text-white shadow-[0_0_20px_rgba(255,191,0,0.3)]' : 'bg-white/5 border-white/10 text-white/20'
                                                }`}>
                                                    <step.i size={24} />
                                                </div>
                                                <p className={`text-[9px] uppercase font-black tracking-widest mt-5 ${isActive ? 'text-amber-500' : 'text-white/20'}`}>{step.l}</p>
                                                {isActive && stepIdx === currentStage && (
                                                    <span className="text-[7px] text-emerald-400 mt-2 font-bold animate-pulse">Sacred Processing</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <div className="absolute top-7 left-0 w-full h-[2px] bg-white/5 z-0" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => setShowSuccessModal(false)}
                                    className="px-10 py-5 bg-[#800000] text-white rounded-[2rem] text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#A52A2A] transition-all shadow-xl shadow-red-950/20">
                                    Return to Sanctuary
                                </button>
                                <button onClick={() => { setShowSuccessModal(false); navigate('/orders'); }}
                                    className="px-10 py-5 bg-white border border-[#800000]/20 text-[#800000] rounded-[2rem] text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-50 transition-all">
                                    View Ritual Log
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
