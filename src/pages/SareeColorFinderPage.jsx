import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastFillDetails, toastOrderPlaced } from '../utils/toast';
import { ArrowLeft, Search, Check, Zap, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const COLOR_PALETTE = [
    { name: 'Red', hex: '#DC2626' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Pink', hex: '#DB2777' },
    { name: 'Orange', hex: '#EA580C' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Green', hex: '#16A34A' },
    { name: 'Blue', hex: '#2563EB' },
    { name: 'Purple', hex: '#9333EA' },
    { name: 'White', hex: '#F9FAFB' },
    { name: 'Black', hex: '#111827' }
];

const MOCK_SAREES = [
    // Blue
    { id: 'C1', name: 'Kanchipuram Silk Saree', price: 28000, color: 'Blue', fabric: 'Pure Silk', collection: 'Wedding Collection', imageUrl: '/assets/products/kanchipuram.png' },
    { id: 'C2', name: 'Banarasi Silk Saree', price: 15000, color: 'Blue', fabric: 'Art Silk', collection: 'Festival Collection', imageUrl: '/assets/products/banarasi.png' },
    { id: 'C3', name: 'Soft Silk Saree', price: 8500, color: 'Blue', fabric: 'Soft Silk', collection: 'Premium Collection', imageUrl: '/assets/products/temple_silk.png' },
    { id: 'C4', name: 'Bridal Silk Saree', price: 42000, color: 'Blue', fabric: 'Pure Silk', collection: 'Bridal Collection', imageUrl: '/assets/landing/hero_kanchipuram_silk_1774528784605.png' },
    { id: 'C5', name: 'Temple Border Saree', price: 12500, color: 'Blue', fabric: 'Cotton Silk', collection: 'Temple Collection', imageUrl: '/assets/landing/products_page_temple_heritage_1774461497113.png' },
    { id: 'C6', name: 'Designer Silk Saree', price: 19500, color: 'Blue', fabric: 'Pure Silk', collection: 'Premium Collection', imageUrl: '/assets/landing/banarasi_sacred_weave_1774528915946.png' },
    // Red & Maroon
    { id: 'C7', name: 'Traditional Koorai Saree', price: 32500, color: 'Red', fabric: 'Pure Silk', collection: 'Wedding Collection', imageUrl: '/assets/products/banarasi.png' },
    { id: 'C8', name: 'Brahminical Madisar', price: 18500, color: 'Maroon', fabric: 'Pure Silk', collection: 'Temple Collection', imageUrl: '/assets/products/brahmin_saree.png' },
    { id: 'C9', name: 'Crimson Bridal Kanchi', price: 48000, color: 'Red', fabric: 'Pure Silk', collection: 'Bridal Collection', imageUrl: '/assets/landing/hero_kanchipuram_silk_1774528784605.png' },
    // Pink
    { id: 'C10', name: 'Vedic Ceremonial Saree', price: 21000, color: 'Pink', fabric: 'Pure Silk', collection: 'Temple Collection', imageUrl: '/assets/landing/banarasi_sacred_weave_1774528915946.png' },
    { id: 'C11', name: 'Rose Water Soft Silk', price: 9500, color: 'Pink', fabric: 'Soft Silk', collection: 'Festival Collection', imageUrl: '/assets/products/temple_silk.png' },
    // Gold & Yellow
    { id: 'C12', name: 'Golden Zari Bridal Tissue', price: 45000, color: 'Gold', fabric: 'Tissue Silk', collection: 'Bridal Collection', imageUrl: '/assets/landing/hero_kanchipuram_silk_1774528784605.png' },
    { id: 'C13', name: 'Auspicious Turmeric Silk', price: 19000, color: 'Yellow', fabric: 'Pure Silk', collection: 'Wedding Collection', imageUrl: '/assets/products/madisar.png' },
    { id: 'C14', name: 'Haldi Ceremony Cotton', price: 4500, color: 'Yellow', fabric: 'Pure Cotton', collection: 'Handloom Collection', imageUrl: '/assets/landing/products_page_temple_heritage_1774461497113.png' },
    // Green
    { id: 'C15', name: 'Emerald Temple Drape', price: 16500, color: 'Green', fabric: 'Art Silk', collection: 'Temple Collection', imageUrl: '/assets/landing/products_page_temple_heritage_1774461497113.png' },
    { id: 'C16', name: 'Parrot Green Kanchipuram', price: 27500, color: 'Green', fabric: 'Pure Silk', collection: 'Premium Collection', imageUrl: '/assets/products/kanchipuram.png' },
    // White & Black
    { id: 'C17', name: 'Pristine White Kanchipuram', price: 22000, color: 'White', fabric: 'Pure Silk', collection: 'Temple Collection', imageUrl: '/assets/landing/temple_statue.png' },
    { id: 'C18', name: 'Midnight Black Ikkat', price: 12000, color: 'Black', fabric: 'Cotton Silk', collection: 'Handloom Collection', imageUrl: '/assets/landing/banarasi_sacred_weave_1774528915946.png' },
    { id: 'C19', name: 'Kerala Kasavu Handloom', price: 3500, color: 'White', fabric: 'Pure Cotton', collection: 'Budget Collection', imageUrl: '/assets/products/vasti.png' },
    // Purple & Orange
    { id: 'C20', name: 'Royal Purple Banarasi', price: 25000, color: 'Purple', fabric: 'Art Silk', collection: 'Premium Collection', imageUrl: '/assets/products/banarasi.png' },
    { id: 'C21', name: 'Sunset Orange Cotton', price: 5500, color: 'Orange', fabric: 'Pure Cotton', collection: 'Budget Collection', imageUrl: '/assets/landing/products_page_temple_heritage_1774461497113.png' },
    { id: 'C22', name: 'Family Matching Deep Purple', price: 14000, color: 'Purple', fabric: 'Cotton Silk', collection: 'Family Matching Collection', imageUrl: '/assets/products/temple_silk.png' }
];

export default function SareeColorFinderPage() {
    const navigate = useNavigate();
    const [selectedColor, setSelectedColor] = useState('Blue'); // Defaulting to Blue as per example
    const [searchQuery, setSearchQuery] = useState('');
    const [collectionFilter, setCollectionFilter] = useState('All');

    // Checkout Modal State
    const [checkoutModal, setCheckoutModal] = useState({
        isOpen: false,
        saree: null,
        quantity: 1,
        name: '',
        mobile: '',
        address: '',
        pincode: '',
        isSubmitting: false
    });

    const openCheckout = (saree) => {
        setCheckoutModal(prev => ({
            ...prev,
            isOpen: true,
            saree,
            quantity: 1,
            isSubmitting: false
        }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const { saree, quantity, name, mobile, address, pincode } = checkoutModal;
        if (!name || !mobile || !address || !pincode) return toastFillDetails();

        setCheckoutModal(prev => ({ ...prev, isSubmitting: true }));
        const orderId = `ORD${Math.floor(1000 + Math.random() * 9000)}`;

        const orderData = {
            orderId,
            product: saree.name,
            price: saree.price,
            color: saree.color,
            quantity,
            customerName: name,
            mobile,
            address,
            pincode,
            status: 'Order Received',
            createdAt: new Date().toISOString()
        };

        try {
            // Save to Firebase if real DB is available
            if (import.meta.env.VITE_FIREBASE_API_KEY !== 'AIzaSyDemoKeyReplaceMeWithReal') {
                await addDoc(collection(db, 'orders'), orderData);
            }
        } catch (err) {
            console.error("Failed to save order to DB:", err);
        }

        // WhatsApp message format as requested
        let text = `Hello,\n\nI would like to order:\n\n`;
        text += `Order ID: ${orderId}\n\n`;
        text += `Product: ${saree.name}\n`;
        text += `Price: ₹${saree.price.toLocaleString()}\n`;
        text += `Color: ${saree.color}\n`;
        text += `Quantity: ${quantity}\n\n`;
        text += `Customer Details:\n\n`;
        text += `Name: ${name}\n`;
        text += `Mobile: ${mobile}\n`;
        text += `Address: ${address}\n`;
        text += `Pincode: ${pincode}\n\n`;
        text += `Please confirm availability.`;

        const config = JSON.parse(localStorage.getItem('whatsapp_config') || '{}');
        const rawNumber = config.proprietorPhone || '7598137660';
        const cleanNumber = rawNumber.replace(/\D/g, '');
        const proprietorNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

        toastOrderPlaced();
        window.open(`https://wa.me/${proprietorNumber}?text=${encodeURIComponent(text)}`, '_blank');
        
        setCheckoutModal(prev => ({ ...prev, isOpen: false, isSubmitting: false }));
        // Optionally redirect to orders page after a slight delay
        setTimeout(() => navigate('/orders'), 1000);
    };

    const filteredSarees = MOCK_SAREES.filter(saree => {
        const matchesColor = selectedColor === 'All' || saree.color === selectedColor;
        const matchesSearch = saree.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCollection = collectionFilter === 'All' || saree.collection === collectionFilter;
        return matchesColor && matchesSearch && matchesCollection;
    });

    const activeColorHex = selectedColor !== 'All' ? COLOR_PALETTE.find(c => c.name === selectedColor)?.hex : '#800000';

    return (
        <div className="min-h-screen bg-[#FBF6E9] font-sans selection:bg-[#800000] selection:text-white pb-12">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-[#FBF6E9]/90 backdrop-blur-md border-b border-amber-900/10 px-6 py-4 shadow-sm transition-colors duration-700" style={{ borderBottomColor: `${activeColorHex}40` }}>
                <div className="container mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest hover:gap-4 transition-all" style={{ color: activeColorHex }}>
                        <ArrowLeft size={18} /> Back To Atelier
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-serif font-bold" style={{ color: activeColorHex }}>Sacred Hue Finder</h1>
                        <div className="h-0.5 w-12 rounded-full transition-colors duration-700" style={{ backgroundColor: activeColorHex }} />
                    </div>
                    <div className="w-24"></div> {/* Spacer for centering */}
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12">
                {/* Search & Collection Filter */}
                <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-amber-900/10 p-6 shadow-xl mb-12 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-900/40" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by weave name..."
                            className="w-full bg-[#FBF6E9] border border-amber-900/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none transition-colors"
                            style={{ focusBorderColor: activeColorHex }} />
                    </div>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
                        {['All', 'Wedding Collection', 'Festival Collection', 'Temple Collection', 'Premium Collection', 'Handloom Collection', 'Budget Collection', 'Bridal Collection', 'Family Matching Collection'].map(collection => (
                            <button key={collection} onClick={() => setCollectionFilter(collection)}
                                className={`px-5 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all border ${collectionFilter === collection ? 'text-white border-transparent' : 'bg-white border-amber-900/10 hover:bg-amber-50'}`}
                                style={collectionFilter === collection ? { backgroundColor: activeColorHex, boxShadow: `0 10px 15px -3px ${activeColorHex}40` } : { color: '#5D4037' }}>
                                {collection}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Palette Selector */}
                <div className="mb-16 text-center">
                    <h2 className="text-2xl font-serif text-[#2D1B10] mb-8">Select Your Sacred Color</h2>
                    <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                        <button onClick={() => setSelectedColor('All')}
                            className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all ${selectedColor === 'All' ? 'scale-110 shadow-xl ring-4 ring-offset-4 ring-[#800000]' : 'hover:scale-105 shadow-md border-2 border-amber-900/10 bg-gradient-to-br from-gray-100 to-gray-300'}`}>
                            {selectedColor === 'All' && <Check size={20} className="text-[#800000] absolute drop-shadow-md" />}
                            <span className="absolute -bottom-8 text-[9px] font-bold uppercase tracking-widest text-[#5D4037]">All</span>
                        </button>
                        {COLOR_PALETTE.map(color => (
                            <button key={color.name} onClick={() => setSelectedColor(color.name)}
                                className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all ${selectedColor === color.name ? 'scale-110 shadow-xl ring-4 ring-offset-4 z-10' : 'hover:scale-105 shadow-md border-2 border-white'}`}
                                style={{ backgroundColor: color.hex, ringColor: color.hex }}>
                                {selectedColor === color.name && <Check size={20} className={`${['White', 'Yellow', 'Gold'].includes(color.name) ? 'text-[#2D1B10]' : 'text-white'} drop-shadow-md`} />}
                                <span className={`absolute -bottom-8 text-[9px] font-bold uppercase tracking-widest transition-colors ${selectedColor === color.name ? 'text-[#2D1B10]' : 'text-[#5D4037]/60'}`}>
                                    {color.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredSarees.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-full text-center py-20">
                                <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${activeColorHex}20` }}>
                                    <Search size={32} style={{ color: activeColorHex }} />
                                </div>
                                <h3 className="text-2xl font-serif text-[#2D1B10] mb-2">No Sacred Weaves Found</h3>
                                <p className="text-[#5D4037]/60 font-bold uppercase tracking-widest text-[10px]">Try a different color or fabric combination.</p>
                            </motion.div>
                        ) : (
                            filteredSarees.map((saree) => (
                                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} key={saree.id}
                                    className="group bg-white rounded-[2.5rem] overflow-hidden border border-amber-900/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                                    style={{ '--hover-color': activeColorHex }}>
                                    <div className="aspect-[3/4] overflow-hidden relative">
                                        <img src={saree.imageUrl} alt={saree.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-widest shadow-sm" style={{ color: activeColorHex }}>
                                            {saree.fabric}
                                        </div>
                                        <div className="absolute bottom-4 left-4 flex gap-2 flex-col items-start">
                                            <span className="px-3 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[9px] uppercase tracking-widest font-bold">
                                                {saree.collection}
                                            </span>
                                            <span className="px-3 py-1 rounded-md flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-[9px] uppercase tracking-widest font-bold shadow-sm text-[#2D1B10]">
                                                <div className="w-2 h-2 rounded-full shadow-inner" style={{ backgroundColor: COLOR_PALETTE.find(c => c.name === saree.color)?.hex }} />
                                                {saree.color}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col">
                                        <h3 className="text-xl font-serif text-[#2D1B10] mb-2 line-clamp-2">{saree.name}</h3>
                                        <div className="flex justify-between items-center mt-auto pt-6">
                                            <span className="text-xl font-serif font-bold text-[#2D1B10]">₹{saree.price.toLocaleString()}</span>
                                            <button onClick={() => openCheckout(saree)} title="Buy Now"
                                                className="px-5 py-2.5 rounded-2xl flex items-center gap-2 text-white shadow-lg transition-transform hover:scale-105 text-[10px] font-bold uppercase tracking-widest"
                                                style={{ backgroundColor: activeColorHex, boxShadow: `0 10px 15px -3px ${activeColorHex}40` }}>
                                                <ShoppingBag size={14} /> Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Checkout Modal */}
            <AnimatePresence>
                {checkoutModal.isOpen && checkoutModal.saree && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                            onClick={() => setCheckoutModal(prev => ({...prev, isOpen: false}))} 
                            className="absolute inset-0 bg-[#2D1B10]/60 backdrop-blur-md" />
                        
                        <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="bg-[#FBF6E9] w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 p-8 border border-amber-900/10 max-h-[90vh] overflow-y-auto">
                            
                            <button onClick={() => setCheckoutModal(prev => ({...prev, isOpen: false}))} className="absolute top-6 right-6 text-[#800000] p-2 hover:bg-[#800000]/10 rounded-full transition-all">
                                <X size={20} />
                            </button>
                            
                            <h3 className="text-3xl font-serif text-[#2D1B10] mb-2">Sacred Checkout</h3>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037]/50 mb-8">Instant WhatsApp Order</p>
                            
                            <div className="bg-white p-4 rounded-2xl border border-amber-900/5 mb-8 flex gap-4 items-center shadow-sm">
                                <div className="w-16 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                    <img src={checkoutModal.saree.imageUrl} alt="Product" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[#2D1B10] font-serif font-bold text-lg leading-tight line-clamp-1">{checkoutModal.saree.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] uppercase tracking-widest font-bold text-amber-600 border border-amber-200 px-2 py-0.5 rounded-md">{checkoutModal.saree.color}</span>
                                    </div>
                                    <p className="text-[#800000] font-bold text-sm mt-2">₹{checkoutModal.saree.price.toLocaleString()}</p>
                                </div>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Quantity</label>
                                    <input type="number" min="1" max="10" required
                                        value={checkoutModal.quantity} 
                                        onChange={e => setCheckoutModal(prev => ({...prev, quantity: e.target.value}))}
                                        className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Full Name</label>
                                    <input type="text" required placeholder="Enter your full name"
                                        value={checkoutModal.name} 
                                        onChange={e => setCheckoutModal(prev => ({...prev, name: e.target.value}))}
                                        className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Mobile Number</label>
                                    <input type="tel" required placeholder="10-digit mobile number"
                                        value={checkoutModal.mobile} 
                                        onChange={e => setCheckoutModal(prev => ({...prev, mobile: e.target.value}))}
                                        className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Delivery Address</label>
                                    <textarea required placeholder="Full street address..." rows="2"
                                        value={checkoutModal.address} 
                                        onChange={e => setCheckoutModal(prev => ({...prev, address: e.target.value}))}
                                        className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000] resize-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5D4037]/60 mb-2">Pincode</label>
                                    <input type="text" required placeholder="6-digit pincode"
                                        value={checkoutModal.pincode} 
                                        onChange={e => setCheckoutModal(prev => ({...prev, pincode: e.target.value}))}
                                        className="w-full bg-white border border-amber-900/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
                                </div>

                                <button type="submit" disabled={checkoutModal.isSubmitting}
                                    className="w-full mt-4 bg-[#800000] text-white py-4 rounded-xl font-bold shadow-xl shadow-red-950/20 hover:bg-[#A52A2A] transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] disabled:opacity-50">
                                    {checkoutModal.isSubmitting ? 'Processing...' : (
                                        <><MessageCircle size={16} /> Place Order via WhatsApp</>
                                    )}
                                </button>
                                
                                <p className="text-center text-[9px] text-[#5D4037]/60 uppercase tracking-widest font-bold mt-4">
                                    Payment will be collected securely after confirmation.
                                </p>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
