import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiHome, FiLock, FiChevronRight, FiShield } from 'react-icons/fi';

export default function EntryChoicePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF6E9] relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#800000]/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-xl mx-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#800000] text-[#FBF6E9] rounded-[2rem] shadow-2xl shadow-red-950/20 mb-8 transform transition-transform hover:scale-105 duration-500">
            <span className="text-5xl font-serif font-bold">M</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-[#2D1B10] mb-6">
            Devotee <span className="italic text-[#800000]">Access</span>
          </h1>
          <p className="text-[#5D4037]/60 text-[10px] uppercase tracking-[0.5em] font-bold">Enter The Sacred Atelier</p>
        </div>

        {/* Exclusive Devotee Link */}
        <Link to="/user/login" className="group block">
          <div className="bg-white/40 backdrop-blur-xl border border-amber-900/10 rounded-[3rem] p-12 text-center shadow-2xl hover:shadow-[#800000]/5 transition-all hover:-translate-y-2 border-t-4 border-t-amber-500/20">
            <div className="inline-flex p-5 bg-amber-500/5 rounded-2xl text-amber-600 mb-8 group-hover:bg-[#800000] group-hover:text-white transition-all duration-500">
              <FiUser size={40} />
            </div>
            <h3 className="text-3xl font-serif text-[#2D1B10] mb-4">The Devotee <span className="italic text-[#800000]">Circle</span></h3>
            <p className="text-[#5D4037]/60 text-sm leading-relaxed mb-10 font-serif italic">
              Access your sacred curations, initiate heritage exchanges, and explore the boutique.
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.4em] font-bold text-[#800000] bg-[#800000]/5 py-5 rounded-2xl group-hover:bg-[#800000] group-hover:text-white transition-all duration-500">
              Sign In to Atelier <FiChevronRight className="group-hover:translate-x-2 transition-transform duration-500" />
            </div>
          </div>
        </Link>
        
        <div className="mt-12 flex flex-col items-center gap-8">
            <Link to="/" className="inline-flex items-center gap-2 text-[#5D4037]/40 hover:text-[#800000] text-[10px] uppercase tracking-[0.3em] font-bold transition-colors">
                <FiHome /> Return to Heritage Home
            </Link>

            {/* Hidden admin path for those who know the ritual */}
            <Link to="/admin/login" className="opacity-[0.05] hover:opacity-100 transition-opacity duration-1000 flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold text-[#2D1B10]">
                <FiShield /> Proprietor Secure Seal
            </Link>
        </div>
      </div>
    </div>
  );
}
