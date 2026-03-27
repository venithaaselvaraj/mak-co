import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, ChevronRight } from 'lucide-react';

// Rich knowledge base for Samyak the Heritage Consultant
const KNOWLEDGE_BASE = {
  // Greetings
  hello: "🙏 **Namaste, Devotee!**\nWelcome to M A K & CO Heritage Atelier. I am **Samyak**, your personal textile guide.\n\nI can help you with:\n• 🧶 Saree types & recommendations\n• 👘 Dhoti & vasti selection\n• 💰 Pricing & offers\n• 📦 Orders & tracking\n• 🔄 Returns & exchanges\n• 🧼 Fabric care tips\n\nWhat would you like to explore? 🌸",
  hi: "🙏 **Namaste!** Wonderful to see you here.\nHow may Samyak assist your sacred textile journey today? 🌺",
  namaste: "🙏 **Namaste, Blessed Devotee!**\nI am Samyak, curator of heritage textiles at M A K & CO.\nAsk me anything about our sacred collection! ✨",

  // Saree types
  saree: "🧶 **Our Sacred Saree Collection:**\n\n🔴 **Kanchipuram Silk** — Temple heritage, pure gold zari. ₹15,500–₹25,000\n🟤 **Madisar (9-yard)** — Brahminical drape for ceremonies. ₹12,000–₹20,000\n💙 **Banarasi Brocade** — Royal Varanasi weave. ₹12,000–₹30,000\n🟢 **Gadwal Half-Silk** — Lightweight daily wear. ₹3,500–₹6,000\n🟡 **Chettinad Cotton** — Breathable everyday saree. ₹1,800–₹4,000\n\nWhich style suits your occasion? 🌸",
  kanchipuram: "✨ **Kanchipuram Pattu Saree**\nThe crown jewel of South Indian silk!\n\n• **Material:** 100% Pure Mulberry Silk\n• **Zari:** Real gold & silver thread\n• **Origin:** Kanchipuram, Tamil Nadu\n• **Best for:** Weddings, temple visits, festivals\n• **Price range:** ₹15,500 – ₹32,000\n• **GI Certified:** Yes 🏷️\n\n💛 Each piece takes 3–7 days to hand-weave. A true heirloom!",
  madisar: "🛕 **Madisar Saree (9-Yard Madisar)**\nThe sacred Brahminical drape used in ceremonies.\n\n• **Style:** 9-yard drape, worn tucked at the waist\n• **Fabric:** Pure silk or cotton-silk blend\n• **Occasion:** Griha pravesam, weddings, puja\n• **Colors:** White, cream, maroon, peacock green\n• **Price:** ₹8,000 – ₹20,000\n\n🙏 Perfect for traditional vedic rituals!",
  banarasi: "💙 **Banarasi Silk Saree**\nThe regal weave from the holy city of Varanasi.\n\n• **Specialty:** Heavy brocade with floral/paisley motifs\n• **Fabric:** Pure silk with zari brocade\n• **Colors:** Royal blue, deep red, emerald, ivory\n• **Best for:** Weddings, festivals, grand ceremonies\n• **Price:** ₹12,000 – ₹35,000\n\n👑 A collector's masterpiece!",
  cotton: "☀️ **Cotton Sarees & Dhotis**\nPerfect for daily puja, summer rituals & comfort.\n\n• **Chettinad Cotton Saree:** ₹1,800–₹4,000\n• **Handloom Khadi Saree:** ₹2,000–₹5,000\n• **Pure Cotton Vasti (Dhoti):** ₹950–₹2,200\n\n✅ Breathable, comfortable, Vedic-friendly\n🌿 No synthetic fibers — pure and spiritually pure!\n\nIdeal for everyday wear and temple visits.",

  // Dhoti / Vasti
  dhoti: "👘 **Dhoti & Vasti Collection (Men's)**\n\n⬜ **Pure White Vedic Vasti** — ₹950–₹1,500\nHandloom cotton, temple-grade purity\n\n🟡 **Vasti with Silk Border** — ₹1,500–₹2,800\nCotton body + vibrant zari border\n\n🪡 **Panchakacham Style** — ₹2,000–₹3,500\nTraditional 9-yard ritual drape for men\n\n🧵 **Pure Silk Dhoti** — ₹3,500–₹7,000\nFor grand occasions & ceremonies\n\nWhich style are you looking for?",
  vasti: "🛕 **Sacred Vasti (Dhoti) Guide:**\n\n**White Cotton Vasti** — Most common for daily puja\n**White with Gold Border** — Weddings & festivals\n**Panchakacham** — Traditional Brahminical 5-fold drape\n**Silk Vasti** — Grand ceremonies and special occasions\n\n📏 **Standard sizes available:** 2.5m, 4m, 9-yard\n💰 **Price:** ₹950 – ₹7,000\n\nOur vastis use zero synthetic threads — 100% sacred! 🙏",
  angavastram: "🧣 **Angavastram (Shoulder Shawl)**\nThe sacred wrap worn over the shoulder during rituals.\n\n• **Ivory with Gold Border** — Temple ceremonies\n• **White with Silver Zari** — Daily puja\n• **Silk Angavastram** — Special occasions\n\n💰 **Price:** ₹900 – ₹3,500\n🙏 Always worn over the left shoulder during religious rites.\nAvailable as individual piece or as set with vasti.",

  // Occasions
  wedding: "💒 **Wedding Textile Guide from M A K & CO:**\n\n**For the Bride:**\n• Kanchipuram Silk Saree — ₹18,500+\n• Madisar (9-yard) — ₹12,000+\n• Banarasi Bridal — ₹22,000+\n\n**For the Groom:**\n• Pure Silk Vasti — ₹4,000–₹7,000\n• Panchakacham Set — ₹3,500+\n\n**For Family:**\n• Silk sarees from ₹8,000\n• Vasthiram gift sets available\n\n🎁 **Wedding Bulk Discount:** 15% off on 10+ pieces!\nContact us via WhatsApp for custom orders! 📱",
  festival: "🎉 **Festival Collection — M A K & CO:**\n\n**Diwali & Pongal:**\n• Silk sarees with vibrant colors\n• New silk vasti sets\n\n**Navaratri:**\n• Daily color-coded cotton sarees\n• Lightweight comfort for 9 days\n\n**Temple Festivals:**\n• Pure white & cream collections\n• Madisar sets for women\n\n✨ **Seasonal offers** are sent via WhatsApp — subscribe now!",
  puja: "🛕 **Puja & Ritual Wear Guide:**\n\nFor daily puja at home:\n• Unbleached cotton saree — ₹1,500+\n• White cotton vasti — ₹950+\n• Angavastram — ₹900+\n\nFor temple visits:\n• Light silk or cotton sarees\n• Vasti with gold or red border\n\nFor major rituals (griha pravesam, upanayanam):\n• Kanchipuram silk collection\n• Panchakacham vasti set\n\n🙏 All our ritual wear is crafted with Vedic standards in mind.",

  // Pricing & Offers
  price: "💰 **M A K & CO Price Guide:**\n\n**Sarees:**\n• Cotton — ₹1,800–₹5,000\n• Chettinad — ₹2,500–₹6,000\n• Madisar — ₹8,000–₹20,000\n• Kanchipuram Silk — ₹15,500–₹32,000\n• Banarasi — ₹12,000–₹35,000\n\n**Dhotis & Vastis:**\n• Cotton Vasti — ₹950–₹2,200\n• Silk Border Vasti — ₹1,500–₹3,500\n• Silk Dhoti — ₹3,500–₹7,000\n\n**Angavastram:** ₹900–₹3,500\n\n📱 WhatsApp us for bulk or custom pricing!",
  offer: "🎁 **Current Sacred Offers at M A K & CO:**\n\n🏷️ **WELCOME10** — 10% OFF your first order\n📦 **BULK15** — 15% OFF on 5+ sarees or vastis\n🔄 **HERITAGE20** — 20% exchange credit for old silk sarees\n🎊 **FESTIVAL5** — ₹500 off on orders above ₹15,000\n\n✨ **Loyalty Program:** Every 5th purchase gets a free angavastram!\n\n📱 Share your WhatsApp number for exclusive subscriber deals!",
  discount: "🏷️ **Discount & Savings at M A K & CO:**\n\n• New customers: **10% off** with code WELCOME10\n• Bulk (5+ items): **15% off** automatically\n• Students & teachers: **5% extra** — show ID on WhatsApp\n• Festival season: Watch for flash sales!\n\n💡 **Pro Tip:** Buying a saree + angavastram set saves ₹500 vs separate purchases!\n\n📱 Join our WhatsApp circle for weekly deals!",

  // Care & Maintenance
  care: "🧼 **Silk & Cotton Care Instructions:**\n\n**Kanchipuram Silk:**\n• Dry clean only — never machine wash\n• Store with neem leaves to repel insects\n• Air in shade, away from direct sun\n• Use muslin cloth for wrapping\n\n**Cotton Sarees & Vastis:**\n• Handwash in cold water with mild soap\n• Do not wring — gently squeeze\n• Dry in shade\n• Iron at medium heat, inside-out\n\n**Storage Tips:**\n• Fold with acid-free paper\n• Avoid plastic bags — use cotton covers\n• Rotate the folds every 6 months",
  wash: "🫧 **Washing Your Heritage Textiles:**\n\n**Silk Sarees:** NEVER machine wash!\n• Dry clean recommended\n• If hand washing: lukewarm water + silk-specific soap\n• Do not soak more than 5 minutes\n• Squeeze gently, no wringing\n\n**Cotton Sarees & Vastis:**\n• Cold water hand wash\n• Mild natural soap\n• Rinse twice\n• Dry in shade\n\n⚠️ Avoid bleach, OxiClean, or harsh detergents — they damage zari!",
  store: "📦 **Storing Your Heritage Collection:**\n\n✅ **Do:**\n• Wrap in soft muslin cloth\n• Store with neem leaves or camphor\n• Keep in a cool, dry place\n• Re-fold along different lines every 3 months\n\n❌ **Don't:**\n• Store in plastic bags (causes yellowing)\n• Hang silk sarees (distorts shape)\n• Expose to direct sunlight\n• Leave in damp areas\n\n💡 A cedar wood box is ideal for long-term silk storage!",

  // Orders & Shipping
  order: "📦 **Placing an Order at M A K & CO:**\n\n**How to Order:**\n1. Browse our Veda Collection on the dashboard\n2. Click ⚡ 'Buy Now' on any product\n3. Enter your delivery address\n4. We connect you via WhatsApp for payment confirmation\n\n**Payment Methods:**\n• UPI / GPay / PhonePe\n• Bank Transfer\n• COD (select areas)\n\n**Order Timeline:**\n• Processing: 1 day\n• Delivery: 3–7 business days\n\n📱 Track your order in the 'Orders' section!",
  shipping: "🚚 **Shipping & Delivery:**\n\n• **Standard Delivery:** 3–7 business days\n• **Express Delivery:** 1–3 days (+ ₹150)\n• **Free Shipping:** On orders above ₹5,000\n• **Within Tamil Nadu:** 2–4 days\n• **Pan India:** 5–7 days\n\n**Tracking:** Your order status is updated live in the 'Ritual Tracking' section.\n\n📦 **Packaging:** Each piece is wrapped in traditional cloth with blessing paper — a true gift experience!",
  track: "🗺️ **Order Tracking — Ritual Status:**\n\nYour order goes through 4 sacred stages:\n\n📦 **Preparing** — Artisans have received your order\n✅ **Sanctified** — Quality checked & blessed\n🚚 **In-Transit** — On its way to you\n🏠 **Delivered** — Arrived at your doorstep\n\nView live tracking in:\n**Orders page → Your order card → Ritual Tracking Timeline**\n\n📱 WhatsApp notifications will be sent at each stage!",

  // Returns & Exchange
  return: "🔄 **Return & Exchange Policy:**\n\n✅ **7-Day Sacred Exchange Window:**\nIf you're not satisfied within 7 days of delivery, you can request an exchange.\n\n**Eligible for Exchange:**\n• Wrong size received\n• Quality doesn't match description\n• Weaving defects\n\n**How to Return:**\n1. Go to Orders page\n2. Click '7-Day Exchange' button\n3. Fill the exchange form\n4. We arrange pickup\n\n⚠️ Items must be unused, unwashed, and in original packaging.",
  exchange: "🔁 **Exchange Process at M A K & CO:**\n\n1. Go to your **Orders page**\n2. Find the delivered order\n3. Click **'7-Day Sacred Exchange'** button\n4. Describe the issue and your replacement choice\n5. We confirm and arrange free pickup\n\n**Exchange Timeline:** 5–10 business days\n**Exchange Credit:** 100% of original order value\n\n⏰ **Window:** 7 days from delivery date only\n🙏 We want every devotee to be fully blessed by their purchase!",

  // Bulk Orders
  bulk: "📦 **Bulk Order Program — Heritage Procurement:**\n\nPerfect for:\n• Temple committees\n• Wedding families\n• Corporate gift hampers\n• Schools & institutions\n\n**Bulk Tiers:**\n• 5–10 pieces: **10% discount**\n• 11–25 pieces: **15% discount**\n• 26–50 pieces: **20% discount**\n• 50+ pieces: **Custom pricing** (WhatsApp us!)\n\n📋 **Bulk Order Page:** `/bulk-orders`\n📱 For large temple/wedding orders, direct WhatsApp consultation available!",

  // Contact & WhatsApp
  whatsapp: "📱 **Contact Us via WhatsApp:**\n\nOur proprietor is available on WhatsApp for:\n• Custom order inquiries\n• Bulk pricing\n• Product photos & videos\n• Payment confirmation\n• Delivery updates\n\n**WhatsApp:** +91 75981 37660\n\n⏰ **Available:** Mon–Sat, 9am–8pm IST\n\nYou can also click 'Buy Now' on any product and we'll connect automatically through WhatsApp! 🛕",
  contact: "📞 **M A K & CO Contact Details:**\n\n📱 **WhatsApp:** +91 75981 37660\n🕐 **Hours:** Mon–Sat, 9am–8pm IST\n📍 **Atelier:** Tamil Nadu, India\n\n**Online:**\n• Browse & order on this portal\n• Track orders in real-time\n• Chat with Samyak anytime! 😊\n\n🙏 We typically respond within 2 hours on WhatsApp.",

  // Default
  default: "🙏 **Namaste! I'm Samyak, your Heritage Consultant.**\n\nHere are some topics I can help with — just type or tap one:\n\n🧶 **Products:** saree, dhoti, vasti, angavastram, kanchipuram, banarasi, madisar\n🎉 **Occasions:** wedding, festival, puja\n💰 **Pricing:** price, offer, discount, bulk\n📦 **Orders:** order, shipping, track\n🔄 **After-sale:** return, exchange, care, wash\n📱 **Contact:** whatsapp, contact\n\nType any keyword above and I'll guide you! 🌺"
};

// Quick reply suggestion chips shown at start
const QUICK_REPLIES = [
  { label: '🧶 Saree Types', msg: 'Tell me about sarees' },
  { label: '👘 Dhoti/Vasti', msg: 'Tell me about dhoti' },
  { label: '💒 Wedding Guide', msg: 'wedding textiles' },
  { label: '💰 Pricing', msg: 'price' },
  { label: '🎁 Offers', msg: 'offer' },
  { label: '🧼 Care Tips', msg: 'care' },
  { label: '📦 How to Order', msg: 'order' },
  { label: '🔄 Returns', msg: 'return' },
];

function getReply(userMsg) {
  const msg = userMsg.toLowerCase();
  const key = Object.keys(KNOWLEDGE_BASE).find(k => msg.includes(k));
  return KNOWLEDGE_BASE[key] || KNOWLEDGE_BASE.default;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: "🙏 **Namaste!** I am **Samyak**, your Heritage Textile Consultant at M A K & CO.\n\nI can help you find the perfect saree, dhoti, or ritual wear — and answer questions about orders, care, and more.\n\nWhat brings you here today? ✨", showChips: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (userMsg) => {
    if (!userMsg.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.reply || "No response received. 🙏" }]);
    } catch {
      // Intelligent offline fallback
      await new Promise(r => setTimeout(r, 600)); // realistic typing delay
      const reply = getReply(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input.trim());
  };

  const handleChip = (msg) => {
    sendMessage(msg);
  };

  // Render text with basic **bold** support
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((p, j) =>
            p.startsWith('**') && p.endsWith('**')
              ? <strong key={j}>{p.slice(2, -2)}</strong>
              : <span key={j}>{p}</span>
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-[360px] sm:w-[420px] h-[560px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-amber-900/10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#800000] to-[#A52A2A] p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white relative">
                  <Sparkles size={22} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="text-white font-serif font-bold text-base">Samyak</h3>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Heritage Consultant · Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-4 bg-[#FBF6E9] scroll-smooth">
              {messages.map((m, i) => (
                <div key={i}>
                  <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {m.role === 'model' && (
                      <div className="w-7 h-7 bg-[#800000] rounded-full flex items-center justify-center text-white flex-shrink-0 mb-1">
                        <Sparkles size={12} />
                      </div>
                    )}
                    <div className={`max-w-[82%] rounded-2xl p-3.5 text-[12px] leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-[#800000] text-white rounded-tr-none'
                        : 'bg-white text-[#2D1B10] border border-amber-900/5 rounded-tl-none'
                    }`}>
                      {renderText(m.text)}
                    </div>
                  </div>
                  {/* Quick reply chips after first message */}
                  {m.showChips && (
                    <div className="mt-3 flex flex-wrap gap-2 ml-9">
                      {QUICK_REPLIES.map((chip, ci) => (
                        <button key={ci} onClick={() => handleChip(chip.msg)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-900/10 rounded-full text-[10px] uppercase tracking-wider font-bold text-[#800000] hover:bg-[#800000] hover:text-white transition-all shadow-sm text-left">
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start items-end gap-2">
                  <div className="w-7 h-7 bg-[#800000] rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Sparkles size={12} />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none p-3.5 flex gap-1.5 border border-amber-900/5 shadow-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-amber-900/5 flex-shrink-0">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about sarees, dhotis, offers..."
                  className="w-full bg-[#FBF6E9] border border-amber-900/10 rounded-2xl py-3 pl-4 pr-12 text-[12px] focus:outline-none focus:border-[#800000] shadow-inner transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#800000] text-white rounded-xl flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 hover:bg-[#A52A2A]"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-center text-[9px] text-[#5D4037]/30 uppercase tracking-widest font-bold mt-2">
                Powered by M A K & CO Heritage AI 🛕
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-br from-[#800000] to-[#A52A2A] text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-950/40 relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Online indicator */}
        {!isOpen && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />}

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-20 bg-[#1A0F0A] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center gap-2">
            <Sparkles size={12} className="text-amber-400" />
            Consult Samyak
          </div>
        )}
      </motion.button>
    </div>
  );
}
