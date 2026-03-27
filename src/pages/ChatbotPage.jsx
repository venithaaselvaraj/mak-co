import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMessageSquare, FiCpu, FiUser, FiTrash2, FiStar } from 'react-icons/fi';

const SUGGESTIONS = [
  'Show me Sacred Offers',
  'Recommend fabrics for summer',
  'What is a Temple Madisar?',
  'Explain Kanchipuram vs Banarasi',
  'Sustainable traditional wear',
  'Boutique Bulk Inquiries',
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 I am **Samyak**, your Heritage Textile Consultant for M A K & CO. I am here to guide you through our sacred weaves and artisanal masterpieces.\n\nHow may I assist your spiritual sartorial journey today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text) {
    const message = text || input.trim();
    if (!message || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { message });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (error) {
      console.error("API ERROR:", error);
      const demoReplies = {
        summer: "☀️ **Blessed Summer:** Pure cotton and lightweight linen are most suitable for Vedic rituals during these months.",
        saree: "🧶 **Our Sarees:** Kanchipuram silks with authentic gold zari — hand-woven for auspicious sanctity.",
        offer: "🎁 **Sacred Offers:** WELCOME10 for 10% OFF. Bulk orders get 15% OFF (50+ items).",
        kanchipuram: "✨ **Kanchipuram Silk** — Temple Heritage weaves with pure gold zari border. Price from ₹15,500.",
        banarasi: "🕉️ **Banarasi Hub** — Intricate silver/gold brocade, perfect for grand rituals. Contact WhatsApp for pricing.",
        ghoti: "👘 **Ghoti/Vasti Set** — Pure white cotton or silk panchakacham with gold border for temple rituals.",
        default: "🙏 **Namaste!** Ask me about sarees, ghoti sets, offers, or WhatsApp inquiry!"
      };
      const key = Object.keys(demoReplies).find(k => message.toLowerCase().includes(k)) || "default";
      setMessages(prev => [...prev, { role: "assistant", content: demoReplies[key] }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function clearChat() {
    setMessages([{
      role: 'assistant',
      content: 'Namaste! The scrolls are reset. How can Samyak assist you now? 🧵'
    }]);
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#800000] rounded-2xl flex items-center justify-center shadow-xl shadow-red-950/20 border border-amber-900/10">
              <FiStar size={24} className="text-[#FBF6E9]" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#FBF6E9] tracking-wider">Samyak</h1>
              <p className="text-[10px] text-amber-500/70 uppercase tracking-[0.2em] font-bold">Heritage Textile Consultant</p>
            </div>
          </div>
          <button onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 bg-[#800000]/20 border border-amber-900/10 text-amber-500/70 rounded-xl hover:bg-[#800000]/40 hover:text-amber-400 transition-all text-[10px] font-bold uppercase tracking-widest">
            <FiTrash2 className="w-4 h-4" /> Reset Scrolls
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-[#1A0F0A]/40 backdrop-blur-xl border border-amber-900/10 rounded-3xl overflow-y-auto p-6 space-y-6 shadow-inner custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${
                  msg.role === 'user' ? 'bg-[#800000] text-[#FBF6E9]' : 'bg-white/5 text-amber-500 border border-amber-900/10'
                }`}>
                  {msg.role === 'user' ? <FiUser size={18} /> : <FiCpu size={18} />}
                </div>
                <div className={`max-w-[80%] px-5 py-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#800000]/80 border border-amber-900/10 text-[#FBF6E9] rounded-tr-none'
                    : 'bg-white/[0.03] border border-amber-900/5 text-[#FBF6E9]/80 rounded-tl-none'
                }`}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={`mb-2 last:mb-0 ${line.startsWith('•') || line.startsWith('-') || /^\d\./.test(line) ? 'ml-2 pl-2 border-l border-amber-900/20' : ''}`}>
                      {line.split('**').map((part, k) =>
                        k % 2 === 1 ? <strong key={k} className="text-amber-500 font-bold">{part}</strong> : part
                      )}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-amber-500 animate-pulse border border-amber-900/10">
                <FiCpu size={18} />
              </div>
              <div className="bg-white/5 border border-amber-900/5 rounded-2xl rounded-tl-none px-5 py-4 flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-amber-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-amber-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-amber-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => handleSend(s)}
                className="px-4 py-2 bg-white/5 border border-amber-900/10 rounded-full text-[10px] text-[#FBF6E9]/40 hover:text-amber-500 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all font-bold uppercase tracking-widest">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Dock */}
        <div className="mt-8 relative">
          <div className="absolute inset-0 bg-amber-900/5 blur-2xl -z-10 rounded-full"></div>
          <div className="flex gap-4">
            <input 
              ref={inputRef} 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-6 py-4 bg-[#1A0F0A]/60 border border-amber-900/10 rounded-2xl text-[#FBF6E9] placeholder-[#5D4037]/60 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#800000]/50 transition-all shadow-inner"
              placeholder="Ask Samyak about the sacred weaves..." 
              disabled={loading} 
            />
            <button 
              onClick={() => handleSend()} 
              disabled={loading || !input.trim()}
              className="px-7 py-4 bg-[#800000] hover:bg-[#A52A2A] text-[#FBF6E9] rounded-2xl shadow-xl shadow-red-900/20 transition-all disabled:opacity-30 disabled:hover:bg-[#800000] active:scale-95"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 0, 0, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </Layout>
  );
}
