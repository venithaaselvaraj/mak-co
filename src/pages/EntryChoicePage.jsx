import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiHome, FiLock, FiChevronRight, FiShield } from 'react-icons/fi';

export default function EntryChoicePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF6E9] relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#800000]/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-4xl mx-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#800000] text-[#FBF6E9] rounded-[1.5rem] shadow-2xl shadow-red-950/20 mb-8 transform transition-transform hover:rotate-6 duration-500">
            <span className="text-4xl font-serif font-bold">M</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2D1B10] mb-4">
            Authorized <span className="italic text-[#800000]">Entry</span>
          </h1>
          <p className="text-[#5D4037]/60 text-[10px] uppercase tracking-[0.4em] font-bold italic">Choose the path to your destination</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Devotee Atelier (User with signup) */}
            <div className="group relative">
                <div className="absolute inset-0 bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-all rounded-[3rem]" />
                <div className="relative h-full bg-white/50 backdrop-blur-xl border border-amber-900/10 rounded-[3rem] p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col items-center text-center">
                    <div className="p-5 bg-amber-500/10 rounded-2xl text-amber-600 mb-8 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                      <FiUser size={36} />
                    </div>
                    <h3 className="text-3xl font-serif text-[#2D1B10] mb-4">User <span className="italic text-amber-600">Portal</span></h3>
                    <p className="text-[#5D4037]/60 text-sm italic font-serif leading-relaxed mb-10 min-h-[4rem]">
                        Explore the Veda collection, track your sacred orders, and initiate heritage exchanges.
                    </p>
                    
                    <div className="w-full space-y-4 pt-4 border-t border-amber-900/5">
                        <Link to="/user/login" className="block w-full py-4 bg-amber-600/10 text-amber-600 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-600 hover:text-white transition-all">
                            Sign In
                        </Link>
                        <Link to="/signup" className="block w-full py-4 border-2 border-amber-900/10 text-[#5D4037] rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all">
                            New User Signup
                        </Link>
                    </div>
                </div>
            </div>

            {/* Proprietor Portal (Admin - login only) */}
            <div className="group relative">
                <div className="absolute inset-0 bg-[#800000]/5 blur-xl group-hover:bg-[#800000]/10 transition-all rounded-[3rem]" />
                <div className="relative h-full bg-white/50 backdrop-blur-xl border border-amber-900/10 rounded-[3rem] p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col items-center text-center">
                    <div className="p-5 bg-[#800000]/5 rounded-2xl text-[#800000] mb-8 group-hover:bg-[#800000] group-hover:text-white transition-all duration-500">
                      <FiShield size={36} />
                    </div>
                    <h3 className="text-3xl font-serif text-[#2D1B10] mb-4">Admin <span className="italic text-[#800000]">Portal</span></h3>
                    <p className="text-[#5D4037]/60 text-sm italic font-serif leading-relaxed mb-10 min-h-[4rem]">
                        Authorized access for inventory management, ritual fulfillment, and boutique analytics.
                    </p>
                    
                    <div className="w-full pt-4 border-t border-amber-900/5">
                        <Link to="/admin/login" className="block w-full py-6 bg-[#800000] text-white rounded-2xl text-[10px] uppercase tracking-[0.4em] font-bold shadow-xl shadow-red-950/20 hover:bg-[#A52A2A] transition-all flex items-center justify-center gap-3">
                            Admin Login <FiChevronRight />
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-[#5D4037]/40 hover:text-[#800000] text-[10px] uppercase tracking-[0.3em] font-bold transition-colors">
            <FiHome /> Return to Heritage Home
          </Link>
        </div>
      </div>
    </div>
  );
}
