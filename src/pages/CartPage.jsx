import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Trash2, Minus, Plus, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiMessageSquare, FiExternalLink } from 'react-icons/fi';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function CartPage() {
    const navigate = useNavigate();
    const { currentUser, isMock } = useAuth();
    const { cart, removeFromCart, removeFromCartOne, addToCart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(() => {
        const user = JSON.parse(localStorage.getItem('current_user') || '{}');
        return user.address || '';
    });

    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    const handleWhatsAppOrder = async () => {
        if (!address) return alert("Please provide your delivery address for the sacred inquiry.");
        setLoading(true);

        const orderId = `SACRED-${Date.now().toString().slice(-6)}`;
        
        // 1. Prepare Order Manifest for Firestore
        const orderData = {
            orderId,
            items: cart,
            totalAmount: subtotal,
            deliveryAddress: address,
            status: 'preparing', // Started as an inquiry but we track it as preparing
            userId: currentUser?.uid || 'guest-devotee',
            createdAt: new Date().toISOString(),
            isWhatsApp: true,
            paymentStatus: 'pending_on_whatsapp'
        };

        // 2. Prepare WhatsApp Text
        const config = JSON.parse(localStorage.getItem('whatsapp_config') || '{}');
        const rawNumber = config.proprietorPhone || '7598137660';
        const cleanNumber = rawNumber.replace(/\D/g, '');
        const proprietorNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

        let text = `✨ *M A K & CO - SACRED ORDER REQUEST* ✨\n\n`;
        text += `🆔 *Order ID:* ${orderId}\n`;
        text += `📍 *Delivery Address:* ${address}\n\n`;
        text += `--- *Collection Details* ---\n`;
        
        cart.forEach((item, index) => {
            text += `\n*${index + 1}. ${item.name}*\n`;
            text += `   - Quantity: ${item.quantity}\n`;
            if (item.variant) {
              text += `   - Selection: ${item.variant.size} / ${item.variant.color}\n`;
            }
            text += `   - Price: ₹${item.price}\n`;
        });
        
        text += `\n---------------------------\n`;
        text += `📜 *TOTAL ESTIMATE: ₹${subtotal}*\n\n`;
        text += `_Please share payment details for this inquiry._\n`;

        const whatsappUrl = `https://wa.me/${proprietorNumber}?text=${encodeURIComponent(text)}`;

        try {
            // 3. Save to Firestore for Portal Tracking
            if (!isMock) {
                await addDoc(collection(db, 'orders'), orderData);
            }
            
            // 4. Open WhatsApp in a NEW TAB (Secure)
            window.open(whatsappUrl, '_blank');
            
            // 5. Cleanup and Navigate to Tracking
            clearCart();
            navigate('/orders');
        } catch (err) {
            console.error("Order archival error:", err);
            // Even if portal save fails, let the user proceed to WhatsApp
            window.open(whatsappUrl, '_blank');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBF6E9] text-[#2D1B10] font-sans selection:bg-[#800000] selection:text-white pb-12">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-[#FBF6E9]/90 backdrop-blur-md border-b border-amber-900/10 px-6 py-4 shadow-sm">
                <div className="container mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#800000] font-bold text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
                        <ArrowLeft size={18} /> Back To Atelier
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-serif font-bold text-[#800000]">Sacred Cart</h1>
                        <div className="h-0.5 w-12 bg-amber-500 rounded-full" />
                    </div>
                    <button onClick={clearCart} className="text-[10px] font-bold text-rose-800 hover:text-rose-950 uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-xl transition-all">
                        Clear Path
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-6 pt-16">
                {cart.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-sm rounded-[3rem] p-16 text-center border border-amber-900/10 flex flex-col items-center shadow-2xl">
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-[#800000]/10 mb-8 border border-amber-900/5 shadow-inner">
                            <ShoppingBag size={56} />
                        </div>
                        <h2 className="text-4xl font-serif text-[#2D1B10] mb-4">Your collection is empty</h2>
                        <button onClick={() => navigate('/dashboard')}
                            className="bg-[#800000] text-white px-12 py-5 rounded-[2rem] font-bold shadow-xl shadow-red-950/20 hover:bg-[#A52A2A] transition-all uppercase tracking-[0.3em] text-[10px]">
                            Visit The Atelier
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
                                        className="bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border border-amber-900/5 shadow-xl hover:shadow-amber-900/5 transition-all flex flex-col sm:flex-row items-center gap-8 group">
                                        <div className="w-32 h-40 bg-gray-100 rounded-3xl overflow-hidden flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="text-2xl font-serif text-[#2D1B10] mb-2">{item.name}</h3>
                                            <p className="text-[#800000] font-bold text-lg mb-4">₹{parseFloat(item.price).toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center gap-4 bg-[#FBF6E9] p-2 rounded-2xl border border-amber-900/5 shadow-inner">
                                            <button onClick={() => removeFromCartOne(item.id)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-[#800000] shadow-sm hover:bg-[#800000] hover:text-white transition-all"><Minus size={18} /></button>
                                            <span className="w-8 text-center font-bold text-xl">{item.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-[#800000] shadow-sm hover:bg-[#800000] hover:text-white transition-all"><Plus size={18} /></button>
                                            <button onClick={() => removeFromCart(item.id)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-rose-600 shadow-sm hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 border border-amber-900/10 shadow-2xl sticky top-28">
                                <h2 className="text-3xl font-serif text-[#2D1B10] mb-8">Summary</h2>

                                <div className="space-y-5 mb-10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-600">Total Estimate</span>
                                        <span className="text-3xl font-serif text-[#800000]">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <textarea value={address} onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter Delivery Address..." rows={3}
                                    className="w-full bg-[#FBF6E9] border border-amber-900/10 rounded-2xl px-6 py-4 text-xs text-[#2D1B10] focus:outline-none focus:border-[#800000] resize-none shadow-inner" />

                                <div className="space-y-4 mt-8">
                                    <button onClick={handleWhatsAppOrder} disabled={loading || cart.length === 0}
                                        className="w-full bg-[#800000] text-white py-6 rounded-[2rem] font-bold shadow-2xl shadow-red-950/30 hover:bg-[#A52A2A] transition-all flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.4em] disabled:opacity-50 group">
                                        {loading ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span> : (
                                            <><FiMessageSquare className="group-hover:scale-110 transition-transform" /> Ritual Inquiry via WhatsApp</>
                                        )}
                                    </button>
                                    <div className="flex items-center justify-center gap-2 text-[#5D4037]/40 text-[8px] font-bold uppercase tracking-widest">
                                        <FiExternalLink /> Opens WhatsApp in New Tab
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center gap-3 p-4 bg-amber-900/5 rounded-2xl border border-amber-900/5">
                                  <Info size={16} className="text-[#800000]" />
                                  <p className="text-[9px] text-[#5D4037]/60 leading-relaxed uppercase tracking-wider font-bold">Your inquiry will be logged for portal tracking before jumping to WhatsApp.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
