import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { FiSend, FiMessageSquare, FiCpu, FiUser, FiTrash2 } from 'react-icons/fi';

const SUGGESTIONS = [
  'Suggest fabrics for summer wear',
  'Recommend wedding saree colors',
  'Explain different silk types',
  'Trending textile designs 2025',
  'Best fabric for office shirts',
  'Difference between cotton and linen',
  'Generate modern silk saree design ideas',
  'What fabrics are best for kids clothing?',
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 🧵 I\'m your Textile AI Assistant powered by Google Gemini. I can help you with:\n\n• **Fabric suggestions** for any occasion\n• **Textile design ideas** and trends\n• **Care instructions** for different fabrics\n• **Color recommendations** for various occasions\n• **Price guidance** and material comparisons\n\nHow can I help you today?'
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
      const res = await axios.post('http://localhost:5000/api/chatbot', { message });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      // Fallback to local demo responses
      const demoReplies = {
        'summer': '☀️ **Best Fabrics for Summer:**\n\n1. **Cotton** - Most breathable, absorbs sweat well\n2. **Linen** - Lightweight, natural cooling properties\n3. **Chambray** - Lighter than denim, perfect for casual wear\n4. **Rayon** - Soft, flowing, and breathable\n5. **Khadi** - Traditional Indian fabric, great for hot weather\n\n💡 *Tip: Choose light colors like white, pastels, or light blue to reflect heat.*',
        'wedding': '💍 **Wedding Saree Color Recommendations:**\n\n1. **Red & Gold** - Classic bridal choice, symbolizes prosperity\n2. **Maroon & Copper** - Rich and elegant\n3. **Royal Blue & Silver** - Modern and regal\n4. **Pink & Rose Gold** - Romantic and trendy\n5. **Green & Gold** - Traditional South Indian choice\n\n✨ *For fabrics, Kanchipuram Silk and Banarasi Silk are timeless wedding choices.*',
        'silk': '🧵 **Types of Silk:**\n\n1. **Mulberry Silk** - Finest quality, smooth texture\n2. **Tussar Silk** - Rich gold texture, from wild silkworms\n3. **Eri Silk** - Peace silk, warm and durable\n4. **Muga Silk** - Golden yellow, exclusive to Assam\n5. **Kanchipuram Silk** - Heavy, durable, temple-border designs\n6. **Banarasi Silk** - Brocade weaving, Mughal-inspired\n\n💫 *Pure silk can last decades with proper care!*',
        'default': '🧶 Great question about textiles! Here are some insights:\n\n• The global textile market is evolving with sustainable fabrics\n• Natural fibers like organic cotton and bamboo are trending\n• Smart textiles with UV protection are gaining popularity\n• Hand-woven fabrics carry unique cultural significance\n\nWould you like me to elaborate on any specific fabric type, design trend, or textile technique?'
      };

      const key = Object.keys(demoReplies).find(k => message.toLowerCase().includes(k)) || 'default';
      setMessages(prev => [...prev, { role: 'assistant', content: demoReplies[key] }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  function clearChat() {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared! How can I help you with textiles today? 🧵'
    }]);
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-6rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <FiCpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Textile Assistant</h1>
              <p className="text-xs text-slate-400">Powered by Google Gemini</p>
            </div>
          </div>
          <button onClick={clearChat}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:bg-white/10 hover:text-white transition-all text-sm">
            <FiTrash2 className="w-4 h-4" /> Clear
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-purple-500/20' : 'bg-amber-500/20'
              }`}>
                {msg.role === 'user' ? <FiUser className="w-4 h-4 text-purple-400" /> : <FiCpu className="w-4 h-4 text-amber-400" />}
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-500/15 border border-purple-500/20 text-white rounded-tr-none'
                  : 'bg-white/[0.06] border border-white/10 text-slate-200 rounded-tl-none'
              }`}>
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} className={line.startsWith('•') || line.startsWith('-') || /^\d\./.test(line) ? 'ml-2' : ''}>
                    {line.split('**').map((part, k) =>
                      k % 2 === 1 ? <strong key={k} className="text-amber-300">{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <FiCpu className="w-4 h-4 text-amber-400" />
              </div>
              <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => handleSend(s)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="mt-3 flex gap-3">
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
            placeholder="Ask about fabrics, designs, textiles..." disabled={loading} />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50">
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
