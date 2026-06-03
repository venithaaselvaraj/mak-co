import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastFillDetails, toastOrderPlaced } from '../utils/toast';
import { ShoppingBag, Search, Filter, LogOut, Globe, X, Check, Star, ShoppingCart, ChevronRight, Info, Shield, Zap, Sparkles, Shirt, Package, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit, where, addDoc } from 'firebase/firestore';
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
    
    // Direct Checkout State
    const [directBuyContext, setDirectBuyContext] = useState(null);
    const [directBuyState, setDirectBuyState] = useState({
        quantity: 1,
        name: '',
        mobile: '',
        address: '',
        pincode: '',
        color: 'Maroon'
    });
    const [isDirectLoading, setIsDirectLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const response = await fetch('/api/products');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        // Merge or replace mocks with real data
                        setProducts(data);
                        setError(null);
                        return;
                    }
                }
                
                // Fallback to Mocks if API empty or fails
                const mockProducts = [
                    { id: '1', name: 'Brahminical 9-Yard Kumbakonam Madisar Saree', price: 18500, category: 'Women', imageUrl: '/assets/products/madisar.png', description: 'Traditional silk Madisar with authentic loom border, perfect for sacred rituals.' },
                    { id: '2', name: 'Temple Priest Panchakacham Veshti Set', price: 1800, category: 'Men', imageUrl: '/assets/products/mens_panchakacham.png', description: 'Pure cotton panchakacham with 5-inch gold zari border for Vedic practitioners.' },
                    { id: '3', name: 'Kanchipuram Heritage Silk Deity Saree', price: 24500, category: 'Women', imageUrl: '/assets/products/kanchipuram.png', description: 'Hand-woven pure Kanchipuram silk with temple motifs, designed for idol alankaram.' },
                    { id: '4', name: 'Vedic Pure Cotton Angavastram with Zari', price: 750, category: 'Men', imageUrl: '/assets/products/angavastram.png', description: 'Soft unbleached cotton angavastram for daily archana and temple visits.' },
                    { id: '5', name: 'Brahmin Sreyas Grahapravesam Silk Saree', price: 19800, category: 'Women', imageUrl: '/assets/products/brahmin_saree.png', description: 'Auspicious silk saree curated for grihapravesam and family rituals.' },
                    { id: '6', name: 'Lord Venkateswara Peethambaram Silk', price: 15500, category: 'Accessories', imageUrl: '/assets/products/temple_silk.png', description: 'Vibrant yellow silk vastram specifically for divine deity decoration.' },
                    { id: '7', name: 'Sacred Brass Deity Alankaram Vasti', price: 16500, category: 'Accessories', imageUrl: '/assets/products/brass_vasti.png', description: 'Traditional brass-bordered silk vastram for high-purity temple usage.' },
                    { id: '8', name: 'Banarasi Vedic Sacred Heritage Saree', price: 22000, category: 'Women', imageUrl: '/assets/products/banarasi.png', description: 'Intricate Banarasi weave with sacred geometric patterns and gold silk.' },
                    { id: '9', name: 'Gurukul Cotton Daily Wear Veshti', price: 450, category: 'Men', imageUrl: '/assets/products/vasti.png', description: 'Durable and pure white cotton veshti for daily spiritual conduct.' },
                    { id: '10', name: 'Sacred Temple Dhoti with Thick Zari', price: 1200, category: 'Men', imageUrl: '/assets/products/dhoti_border.png', description: 'Formal temple dhoti with thick gold zari border for special occasions.' },
                    { id: '11', name: 'Kanchi Tissue Silk Saree (Bridal Gold)', price: 45000, category: 'Women', imageUrl: '/assets/landing/hero_kanchipuram_silk_1774528784605.png', description: 'Exquisite bridal tissue silk with heavy gold zari for the grand entry.' },
                    { id: '12', name: 'Vedic Ceremonial Saree (Saffron & Maroon)', price: 21000, category: 'Women', imageUrl: '/assets/landing/banarasi_sacred_weave_1774528915946.png', description: 'Auspicious colors for family rituals and Sumangali Prarthanai.' },
                    { id: '13', name: 'Sacred Temple Shawl / Priest Uttariya', price: 2400, category: 'Men', imageUrl: '/assets/landing/weaver_sanctity_1774528857665.png', description: 'Rich unbleached silk shawl with personalized temple emblem weaving.' },
                    { id: '14', name: 'Pure Gold-Zari Pavadai Sattai (Girls)', price: 9500, category: 'Women', imageUrl: '/assets/products/temple_silk.png', description: 'Traditional silk set for young girls, perfect for grand temple visitations.' },
                    { id: '15', name: 'Brass Kamatchi Amman Vilakku (Traditional)', price: 4200, category: 'Accessories', imageUrl: '/assets/landing/temple_ritual.png', description: 'Heavy brass deity lamp for spiritual home environments and pujas.' },
                    { id: '16', name: 'Traditional Koorai Saree (Bridal Red)', price: 32500, category: 'Women', imageUrl: '/assets/products/banarasi.png', description: 'Sacred red and gold Koorai saree essential for Vedic Muhurtham ceremonies.' },
                    { id: '17', name: 'Silver Coated Pooja Kalasham (Sanctified)', price: 4800, category: 'Accessories', imageUrl: '/assets/landing/temple_ritual.png', description: 'Sacred Kalasham used in homams, crafted with fine silver coating for purity.' },
                    { id: '18', name: 'Traditional Pattu Veshti Groom Set', price: 12500, category: 'Men', imageUrl: '/assets/products/mens_panchakacham.png', description: 'Complete silk groom set including panchakacham dhoti and matching uttariya.' },
                    { id: '19', name: 'Ritual Holy Madisar (Vedic Yellow)', price: 19000, category: 'Women', imageUrl: '/assets/products/madisar.png', description: '9-yard pure mulberry silk Madisar in yellow for specific Vedic protocols.' },
                    { id: '20', name: 'Divine Deity Alankaram Statuette Set', price: 28000, category: 'Accessories', imageUrl: '/assets/landing/temple_statue.png', description: 'Highly detailed deity idol set with traditional brass and silk adornments.' },
                    { id: '21', name: 'Aarathi Thattu with Meenakari Work', price: 2100, category: 'Accessories', imageUrl: '/assets/products/brass_vasti.png', description: 'Beautifully decorated Aarathi plate used during auspicious ceremonies.' },
                    { id: '22', name: 'Traditional Jewel for Brahmin Bride', price: 24000, category: 'Accessories', imageUrl: '/assets/products/brahmin_saree.png', description: 'Exquisite jewelry set tailored for traditional Brahmin weddings.' },
                    { id: '23', name: 'Pure Sandalwood Chandanam Block', price: 1800, category: 'Accessories', imageUrl: '/assets/landing/temple_statue.png', description: 'Authentic sandalwood block for divine deity alankaram.' },
                    { id: '24', name: 'Grand Panchaloha Kuthu Vilakku', price: 11000, category: 'Accessories', imageUrl: '/assets/landing/temple_ritual.png', description: 'Five-metal (Panchaloha) grand lamp for traditional households.' },
                    { id: '25', name: 'Lord Ganesha Ritual Silk Draping', price: 9800, category: 'Silk', imageUrl: '/assets/products/temple_silk.png', description: 'Custom silk draping specifically for Ganesha Chaturthi alankaram.' }
                ];
                setProducts(mockProducts);
                setError(null);
            } catch (err) {
                console.error("Fetch products error:", err);
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

    const handleDirectBuyNow = (product) => {
        setDirectBuyContext(product);
        setDirectBuyState({
            quantity: 1,
            name: userData?.displayName || '',
            mobile: '',
            address: '',
            pincode: '',
            color: product.color || 'Maroon'
        });
    };

    const handleDirectWhatsAppOrder = async (e) => {
        if (e) e.preventDefault();
        
        const { quantity, name, mobile, address, pincode, color } = directBuyState;
        if (!name || !mobile || !address || !pincode) return toastFillDetails();
        
        setIsDirectLoading(true);

        try {
            const orderId = `ORD${Math.floor(1000 + Math.random() * 9000)}`;
            const product = directBuyContext;
            
            const orderData = {
                orderId,
                productName: product.name,
                price: product.price,
                color,
                quantity,
                customerName: name,
                mobile,
                address,
                pincode,
                totalAmount: product.price * quantity,
                status: 'order_received',
                userId: userData?.uid || 'guest',
                createdAt: new Date().toISOString(),
                isWhatsApp: true
            };

            let config = {};
            try {
                config = JSON.parse(localStorage.getItem('whatsapp_config') || '{}');
            } catch (e) { console.error("Config parse error", e); }

            const rawNumber = config.proprietorPhone || '7598137660';
            let cleanNumber = rawNumber.replace(/\D/g, '');
            if (cleanNumber.startsWith('0')) cleanNumber = cleanNumber.substring(1);
            const proprietorNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

            let text = `Hello,\n\nI would like to order:\n\n`;
            text += `Order ID: ${orderId}\n\n`;
            text += `Product: ${product.name}\n`;
            text += `Price: ₹${(product.price || 0).toLocaleString()}\n`;
            text += `Color: ${color}\n`;
            text += `Quantity: ${quantity}\n\n`;
            text += `Customer Details:\n\n`;
            text += `Name: ${name}\n`;
            text += `Mobile: ${mobile}\n`;
            text += `Address: ${address}\n`;
            text += `Pincode: ${pincode}\n\n`;
            text += `Please confirm availability.`;

            const whatsappUrl = `https://wa.me/${proprietorNumber}?text=${encodeURIComponent(text)}`;

            // FIREBASE ARCHIVAL (Non-blocking)
            if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'AIzaSyDemoKeyReplaceMeWithReal') {
                addDoc(collection(db, 'orders'), orderData).catch(e => console.error("Firestore error:", e));
            }
            
            setIsDirectLoading(false);
            toastOrderPlaced();
            setLatestOrder(orderData);
            setDirectBuyContext(null);
            setShowSuccessModal(true);

            setTimeout(() => {
                const newWindow = window.open(whatsappUrl, '_blank');
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    window.location.href = whatsappUrl;
                }
            }, 600);
            
        } catch (err) {
            console.error("Critical order error:", err);
            toastOrderPlaced(); // Fallback to still showing success since WhatsApp is the main goal
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
                        <button onClick={() => navigate('/orders')} title="My Orders" className="p-3 text-[#5D4037] hover:bg-amber-900/5 rounded-2xl transition-all border border-transparent hover:border-amber-900/10 group">
                            <Package size={22} className="group-hover:text-[#800000] group-hover:scale-110 transition-transform" />
                        </button>
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
                {/* --- NEW FEATURE QUICK LINKS --- */}
                <div className="flex gap-4 mb-12 overflow-x-auto scrollbar-hide pb-2">
                    <button onClick={() => navigate('/reviews')} className="flex items-center gap-3 bg-white border border-amber-900/10 text-[#800000] px-6 py-4 rounded-[2rem] font-bold shadow-sm hover:shadow-md hover:border-amber-900/30 hover:scale-105 transition-all flex-shrink-0">
                        <Star size={18} className="text-amber-500" fill="currentColor" />
                        <div className="text-left">
                            <span className="block text-[9px] uppercase tracking-widest text-[#5D4037]/50">Community</span>
                            <span className="block text-sm tracking-wider text-[#2D1B10]">Devotee Diaries</span>
                        </div>
                    </button>

                    <button onClick={() => navigate('/draping-guide')} className="flex items-center gap-3 bg-white border border-amber-900/10 text-[#800000] px-6 py-4 rounded-[2rem] font-bold shadow-sm hover:shadow-md hover:border-amber-900/30 hover:scale-105 transition-all flex-shrink-0">
                        <Shirt size={18} className="text-[#800000]" />
                        <div className="text-left">
                            <span className="block text-[9px] uppercase tracking-widest text-[#5D4037]/50">Tutorials</span>
                            <span className="block text-sm tracking-wider text-[#2D1B10]">Draping Guide</span>
                        </div>
                    </button>

                    <button onClick={() => navigate('/ai-recommendations')} className="flex items-center gap-3 bg-[#800000] border border-[#800000] text-white px-6 py-4 rounded-[2rem] font-bold shadow-lg hover:shadow-red-950/30 hover:scale-105 transition-all flex-shrink-0">
                        <Sparkles size={18} className="text-amber-400" />
                        <div className="text-left">
                            <span className="block text-[9px] uppercase tracking-widest text-white/50">AI Consultant</span>
                            <span className="block text-sm tracking-wider">Outfit Finder</span>
                        </div>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.4em] text-amber-600 font-bold">Auspicious Selections</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#2D1B10] mt-2">The <span className="italic text-[#800000]">Veda</span> Collection</h2>
                        <div className="h-1 w-20 bg-amber-500 mt-4 rounded-full" />
                    </div>

                    {/* Quick Tracking Widget - The requested element */}

                    
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
                                    <img src={product.imageUrl || '/assets/landing/temple_statue.png'} alt={product.name || 'Sacred Item'} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B10]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                        <button onClick={() => {
                                            addToCart({
                                                ...product,
                                                id: `${product.id}-Standard-Natural`,
                                                name: `${product.name} (Standard, Natural)`,
                                                variant: { size: 'Standard', color: 'Natural' },
                                                quantity: 1
                                            });
                                        }}
                                            className="w-full bg-[#800000] text-white font-bold py-5 rounded-2xl hover:bg-[#A52A2A] transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                            <ShoppingCart size={16} /> Add to Cart
                                        </button>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#800000] px-4 py-2 rounded-xl text-[10px] font-bold shadow-lg">
                                        ₹{parseFloat(product.price || 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-serif text-[#2D1B10] mb-2 group-hover:text-[#800000] transition-colors line-clamp-1">{product.name || 'Sacred Heritage Item'}</h3>
                                    <p className="text-[10px] text-[#5D4037]/40 tracking-widest uppercase mb-4 font-bold">{product.category}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-0.5 text-amber-500">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                        </div>
                                        <div className="flex gap-2">
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

            {/* --- DIRECT BUY CHECKOUT MODAL --- */}
            <AnimatePresence>
                {directBuyContext && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDirectBuyContext(null)} className="absolute inset-0 bg-[#2D1B10]/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="bg-[#FBF6E9] w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 p-8 border border-amber-900/10 max-h-[90vh] overflow-y-auto">
                            
                            <button onClick={() => setDirectBuyContext(null)} className="absolute top-6 right-6 text-[#800000] p-2 hover:bg-[#800000]/10 rounded-full transition-all">
                                <X size={20} />
                            </button>
                            
                            <h3 className="text-3xl font-serif text-[#2D1B10] mb-2">Checkout Details</h3>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037]/50 mb-8">Instant WhatsApp Order</p>
                            
                            <div className="bg-white p-4 rounded-2xl border border-amber-900/5 mb-8 flex gap-4 items-center shadow-sm">
                                <div className="w-16 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                    <img src={directBuyContext.imageUrl || '/assets/landing/temple_statue.png'} alt="Product" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[#2D1B10] font-serif font-bold text-lg leading-tight line-clamp-1">{directBuyContext.name}</h4>
                                    <p className="text-[#800000] font-bold text-sm mt-2">₹{parseFloat(directBuyContext.price || 0).toLocaleString()}</p>
                                </div>
                            </div>

                            <form onSubmit={handleDirectWhatsAppOrder} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Quantity</label>
                                        <input type="number" min="1" max="10" required
                                            value={directBuyState.quantity} 
                                            onChange={e => setDirectBuyState(prev => ({...prev, quantity: e.target.value}))}
                                            className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Color</label>
                                        <input type="text" required
                                            value={directBuyState.color} 
                                            onChange={e => setDirectBuyState(prev => ({...prev, color: e.target.value}))}
                                            className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Full Name</label>
                                    <input type="text" required placeholder="Enter your full name"
                                        value={directBuyState.name} 
                                        onChange={e => setDirectBuyState(prev => ({...prev, name: e.target.value}))}
                                        className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Mobile Number</label>
                                    <input type="tel" required placeholder="10-digit mobile number"
                                        value={directBuyState.mobile} 
                                        onChange={e => setDirectBuyState(prev => ({...prev, mobile: e.target.value}))}
                                        className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Delivery Address</label>
                                    <textarea required placeholder="Full street address..." rows="2"
                                        value={directBuyState.address} 
                                        onChange={e => setDirectBuyState(prev => ({...prev, address: e.target.value}))}
                                        className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000] resize-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Pincode</label>
                                    <input type="text" required placeholder="6-digit pincode"
                                        value={directBuyState.pincode} 
                                        onChange={e => setDirectBuyState(prev => ({...prev, pincode: e.target.value}))}
                                        className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
                                </div>

                                <button type="submit" disabled={isDirectLoading}
                                    className="w-full mt-4 bg-[#800000] text-white py-4 rounded-xl font-bold shadow-xl shadow-red-950/20 hover:bg-[#A52A2A] transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] disabled:opacity-50">
                                    {isDirectLoading ? 'Processing...' : (
                                        <><Zap size={16} /> Place Order via WhatsApp</>
                                    )}
                                </button>
                            </form>
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
                                        { s: 'order_received', l: 'Received', i: Package },
                                        { s: 'payment_verified', l: 'Verified', i: Check },
                                        { s: 'shipped', l: 'Shipped', i: Truck },
                                        { s: 'delivered', l: 'Delivered', i: ShoppingBag },
                                    ].map((step, idx) => {
                                        const stages = ['order_received', 'payment_verified', 'shipped', 'delivered'];
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
