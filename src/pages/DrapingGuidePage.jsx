import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { drapingData } from '../data/drapingData';
import { ChevronRight, Clock, Award, PlayCircle, FileDown, X, MapPin, BookOpen, ExternalLink } from 'lucide-react';

// ─── YouTube search opener ────────────────────────────────────────────────────
function openYouTubeSearch(style) {
  const query = encodeURIComponent(`${style.name} saree draping tutorial how to`);
  window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
}

// ─── PDF Generator ────────────────────────────────────────────────────────────
function generatePDF(style) {
  const content = `
M A K & CO — Sacred Draping Guide
══════════════════════════════════════════

Style: ${style.name}
${'─'.repeat(40)}

Description:
${style.description}

${style.difficulty ? `Difficulty : ${style.difficulty}` : ''}
${style.time ? `Est. Time  : ${style.time}` : ''}
${style.occasion ? `Occasion   : ${style.occasion}` : ''}

Step-by-Step Instructions:
${'─'.repeat(40)}
${style.steps.map((s, i) => `${i + 1}. ${s}`).join('\n\n')}


${'─'.repeat(40)}
© M A K & CO Heritage Atelier
For personalized assistance, contact us via WhatsApp.
  `.trim();

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MAK_CO_${style.name.replace(/\s+/g, '_')}_Draping_Guide.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────
const difficultyColor = {
  Beginner: 'bg-emerald-100 text-emerald-800',
  Intermediate: 'bg-amber-100 text-amber-800',
  Advanced: 'bg-rose-100 text-rose-800',
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const DrapingGuidePage = () => {
  const [activeTab, setActiveTab] = useState('sarees');
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const styles = drapingData[activeTab];

  return (
    <div className="min-h-screen bg-[#FBF6E9] py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <header className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-600 mb-3"
          >
            M A K &amp; CO Heritage Atelier
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-[#800000] mb-4"
          >
            Sacred Draping Guide
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#5D4037]/70 italic"
          >
            Master the art of traditional elegance with our step-by-step tutorials.
          </motion.p>
        </header>

        {/* ── Tab Switcher ── */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#800000]/10 p-1 rounded-2xl flex gap-2">
            {[
              { key: 'sarees', label: '🧣 Sarees' },
              { key: 'veshtis', label: '👘 Veshtis' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setSelectedStyle(null); }}
                className={`px-8 py-3 rounded-xl uppercase tracking-widest text-sm font-bold transition-all ${
                  activeTab === key
                    ? 'bg-[#800000] text-white shadow-lg'
                    : 'text-[#800000]/60 hover:text-[#800000]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Layout Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-lg font-bold text-[#800000]/60 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen size={16} /> Available Styles
            </h2>
            {styles.map((style) => (
              <motion.button
                key={style.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStyle(style)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                  selectedStyle?.id === style.id
                    ? 'bg-white border-[#800000] shadow-2xl shadow-[#800000]/10'
                    : 'bg-white/60 border-transparent hover:bg-white hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-[#2D1B10]">{style.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {style.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyColor[style.difficulty]}`}>
                          {style.difficulty}
                        </span>
                      )}
                      {style.time && (
                        <span className="flex items-center gap-1 text-[11px] text-[#5D4037]/50">
                          <Clock size={11} /> {style.time}
                        </span>
                      )}
                      {style.occasion && (
                        <span className="text-[11px] text-[#5D4037]/50 truncate max-w-[140px]">{style.occasion}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`transition-transform flex-shrink-0 ${
                      selectedStyle?.id === style.id ? 'rotate-90 text-[#800000]' : 'text-[#800000]/20'
                    }`}
                  />
                </div>
              </motion.button>
            ))}
          </div>

          {/* ── Tutorial Content ── */}
          <div className="lg:col-span-8 min-h-[600px] bg-white rounded-[40px] shadow-2xl p-8 lg:p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {selectedStyle ? (
                <motion.div
                  key={selectedStyle.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div>
                      <h2 className="text-4xl font-bold text-[#800000]">{selectedStyle.name}</h2>
                      <p className="text-[#5D4037]/70 mt-2 italic leading-relaxed max-w-lg">
                        {selectedStyle.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end flex-shrink-0">
                      {selectedStyle.difficulty && (
                        <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${difficultyColor[selectedStyle.difficulty]}`}>
                          <Award size={12} className="inline mr-1" />
                          {selectedStyle.difficulty}
                        </span>
                      )}
                      {selectedStyle.time && (
                        <span className="text-xs text-[#5D4037]/60 font-bold flex items-center gap-1">
                          <Clock size={12} /> {selectedStyle.time}
                        </span>
                      )}
                      {selectedStyle.occasion && (
                        <span className="text-xs text-[#5D4037]/60 font-bold flex items-center gap-1">
                          <MapPin size={12} /> {selectedStyle.occasion}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="bg-[#FBF6E9] p-8 rounded-3xl border border-[#F3E5AB]">
                    <h3 className="text-sm font-bold text-[#800000] mb-6 uppercase tracking-widest">
                      Step-by-Step Instructions
                    </h3>
                    <div className="space-y-5">
                      {selectedStyle.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.07 }}
                          className="flex gap-5 items-start"
                        >
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center font-bold text-[13px] shadow-md">
                            {index + 1}
                          </span>
                          <p className="text-[#5D4037] leading-relaxed pt-1">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      onClick={() => setVideoOpen(true)}
                      className="flex-1 bg-[#800000] text-white py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-[#600000] hover:shadow-2xl transition-all"
                    >
                      <PlayCircle size={22} /> Watch Video Tutorial
                    </button>
                    <button
                      onClick={() => generatePDF(selectedStyle)}
                      className="flex-1 border-2 border-[#800000] text-[#800000] py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#800000]/5 transition-all"
                    >
                      <FileDown size={22} /> Download PDF Guide
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]"
                >
                  <div className="w-24 h-24 bg-[#FBF6E9] rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <BookOpen size={36} className="text-[#800000]/20" />
                  </div>
                  <h3 className="text-2xl text-[#800000]/40 font-bold italic">Choose a style from the left</h3>
                  <p className="text-[#5D4037]/30 max-w-sm text-sm">
                    From the timeless Nivi to the sacred Madisar, discover the perfect drape for every occasion.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decorative blur */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#800000]/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Video Tutorial Modal ── */}
      <AnimatePresence>
        {videoOpen && selectedStyle && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVideoOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-[#1A0F0A] rounded-[32px] overflow-hidden shadow-2xl p-8"
            >
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-5 right-5 text-white/40 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-[#800000] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-red-950/40">
                  <PlayCircle size={32} className="text-white" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold mb-1">Video Tutorial</p>
                  <h3 className="text-white font-bold text-2xl">{selectedStyle.name}</h3>
                  <p className="text-white/40 text-sm mt-2 italic">
                    You'll be taken to YouTube to watch step-by-step draping videos.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2">
                  <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Search query:</p>
                  <p className="text-amber-300 text-sm font-mono">
                    "{selectedStyle.name} saree draping tutorial how to"
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { openYouTubeSearch(selectedStyle); setVideoOpen(false); }}
                    className="w-full bg-[#800000] hover:bg-[#600000] text-white py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <ExternalLink size={18} /> Open on YouTube
                  </button>
                  <button
                    onClick={() => { generatePDF(selectedStyle); setVideoOpen(false); }}
                    className="w-full border border-white/20 text-white/60 hover:text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <FileDown size={16} /> Download PDF Guide Instead
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrapingGuidePage;
