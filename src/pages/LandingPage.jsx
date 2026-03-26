import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMenu, FiX, FiInstagram, FiTwitter, FiFacebook, FiShoppingBag, FiUser, FiSearch, FiChevronRight } from 'react-icons/fi';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Collections', href: '#collections' },
  { name: 'About Us', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const categories = [
  { name: 'Bridal Couture', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800', desc: 'Handcrafted lehengas for your special day.' },
  { name: 'Regal Silk', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', desc: 'Pure Kanchipuram and Banaras weaves.' },
  { name: 'Modern Ethnic', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=800', desc: 'Chic kurtis and sets for daily elegance.' },
];

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF6E9] text-[#2D1B10] font-light selection:bg-amber-200 selection:text-[#800000]">
      
      {/* --- TRADITIONAL NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-[#FBF6E9]/95 backdrop-blur-md py-4 border-b border-amber-900/10 shadow-lg' : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="text-2xl font-serif tracking-[0.2em] font-medium transition-transform group-hover:scale-105 text-[#800000]">
              M A K <span className="text-amber-600">&</span> CO
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-[10px] uppercase tracking-[0.3em] text-[#5D4037] hover:text-[#800000] transition-colors font-semibold">
                {link.name}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button className="hover:text-[#800000] text-[#5D4037] transition-colors hidden sm:block"><FiSearch size={18} /></button>
            <Link to="/login" className="hover:text-[#800000] text-[#5D4037] transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
              <FiUser size={18} /> <span className="hidden lg:inline">Sign In</span>
            </Link>
            <Link to="/signup" className="bg-[#800000] text-white px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:bg-[#A52A2A] transition-all shadow-md">
              Join Us
            </Link>
            <button className="md:hidden text-[#800000]" onClick={() => setMobileMenuOpen(true)}>
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU --- */}
      <div className={`fixed inset-0 z-[100] bg-[#FBF6E9] transition-transform duration-500 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-16">
            <div className="text-xl font-serif tracking-widest text-[#800000]">M A K & CO</div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-[#800000]"><FiX size={28} /></button>
          </div>
          <div className="flex flex-col gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-2xl font-serif text-[#5D4037] hover:text-[#800000] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {link.name}
              </a>
            ))}
            <hr className="border-amber-900/10" />
            <Link to="/login" className="text-lg font-serif text-[#5D4037]">Sign In</Link>
            <Link to="/signup" className="text-lg font-serif text-[#800000]">Membership</Link>
          </div>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <header className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax effect simulation */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1594235412411-208b04a9696c?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Fabric"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full pt-20">
          <div className="max-w-2xl space-y-8">
            <div className="inline-block overflow-hidden">
              <span className="block text-[10px] uppercase tracking-[0.4em] text-amber-600 animate-slideUp font-bold">
                Purity • Tradition • Excellence
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] animate-fadeIn text-[#2D1B10]">
              Divine
              <br />
              <span className="italic text-[#800000]">Heritage</span>
              <br />
              Attire.
            </h1>
            
            <p className="text-lg text-[#5D4037] max-w-lg leading-relaxed font-light animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              Handcrafted masterpieces specifically curated for Temple use and traditional Vedic lifestyles. Rediscover the sanctity of Indian weaves.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <Link to="/signup" className="group flex items-center justify-center gap-4 bg-[#800000] text-white py-5 px-10 text-[10px] uppercase tracking-[0.3em] hover:bg-[#A52A2A] transition-all shadow-xl">
                Explore The Veda Edit
                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037] border-b border-amber-900/20 pb-1 hover:text-[#800000] hover:border-[#800000] transition-all">
                The Heritage Story
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <span className="text-[10px] uppercase tracking-[0.3em] rotate-90 origin-left translate-x-1.5 translate-y-8 text-[#800000] font-bold">Scroll</span>
          <div className="w-px h-16 bg-[#800000]"></div>
        </div>
      </header>

      {/* --- TRADITIONAL COLLECTIONS --- */}
      <section id="collections" className="py-32 px-6 lg:px-12 bg-[#FBF6E9]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-amber-600 font-bold">The Holy Edit</span>
              <h2 className="text-4xl md:text-5xl font-serif text-[#2D1B10]">Temple Heritage</h2>
            </div>
            <p className="text-[#5D4037]/60 max-w-sm text-sm leading-relaxed">
              Discover weaves blessed with tradition, specifically designed for those who uphold the Vedic values of purity and grace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
            {[
              { name: "Traditional Sarees", desc: "Pure Silk & Hand-woven Zari", image: "https://images.unsplash.com/photo-1583391733956-6c7827447d92?auto=format&fit=crop&q=80&w=1000" },
              { name: "Heritage Vasti", desc: "Pure Cotton & Silk Panchakacham", image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=1000" },
              { name: "Temple Silks", desc: "Auspicious Kanchipuram for Rituals", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000" }
            ].map((cat, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-8 relative border border-amber-900/10 shadow-sm transition-shadow hover:shadow-xl">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-amber-900/10 group-hover:bg-amber-900/0 transition-colors duration-500"></div>
                </div>
                <h3 className="text-xl font-serif mb-2 text-[#2D1B10] group-hover:text-[#800000] transition-colors">{cat.name}</h3>
                <p className="text-[10px] text-[#5D4037]/50 tracking-widest uppercase mb-6 font-semibold">{cat.desc}</p>
                <button className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#5D4037]/60 border-b border-transparent group-hover:border-[#800000] group-hover:text-[#800000] transition-all pb-0.5">
                  View Pieces <FiChevronRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CRAFTSMANSHIP SECTION --- */}
      <section id="about" className="py-32 bg-[#F5F1E6] relative overflow-hidden border-y border-amber-900/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full"></div>
              <div className="aspect-[4/5] overflow-hidden rounded-sm relative z-10 border border-amber-900/20 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000" 
                  alt="Craftsmanship"
                  className="w-full h-full object-cover sepia-[0.3] hover:sepia-0 transition-all duration-700 opacity-90 hover:opacity-100"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-10 -right-10 bg-[#800000] p-8 rounded-full aspect-square flex flex-col items-center justify-center text-center z-20 shadow-2xl animate-pulse">
                <span className="text-white text-xs font-serif italic">Pure</span>
                <span className="text-white text-[10px] font-bold tracking-tighter uppercase">Desi</span>
              </div>
            </div>
            <div className="space-y-12 order-1 lg:order-2">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.5em] text-amber-600 font-bold">Our Vedic Ethos</span>
                <h2 className="text-4xl md:text-6xl font-serif leading-tight text-[#2D1B10]">Preserving the Thread of <span className="italic text-[#800000]">Sanctity</span></h2>
              </div>
              <p className="text-[#5D4037]/70 text-lg font-light leading-relaxed">
                At M A K & CO, we understand that traditional attire is not just clothing; it is a spiritual conduct. We source our threads directly from temple-weaver communities who have served common deities for generations.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-12 pt-4">
                <div className="space-y-3 p-6 bg-white/40 border border-amber-900/10 rounded-2xl hover:bg-white/60 transition-colors">
                  <div className="w-8 h-px bg-[#800000] mb-4"></div>
                  <h4 className="font-serif text-xl text-[#2D1B10]">Ritual Ready</h4>
                  <p className="text-[11px] text-[#5D4037]/60 leading-relaxed tracking-wider uppercase font-semibold">Specifically designed for temple rituals, ensuring mobility and traditional aesthetics.</p>
                </div>
                <div className="space-y-3 p-6 bg-white/40 border border-amber-900/10 rounded-2xl hover:bg-white/60 transition-colors">
                  <div className="w-8 h-px bg-[#800000] mb-4"></div>
                  <h4 className="font-serif text-xl text-[#2D1B10]">Ethical Purity</h4>
                  <p className="text-[11px] text-[#5D4037]/60 leading-relaxed tracking-wider uppercase font-semibold">No harmful dyes or machines; pure hand-loomed sanctity guaranteed for Brahminical protocols.</p>
                </div>
              </div>

              <div className="pt-6">
                <button className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold text-[#800000]">
                  Read Our Brahminical Heritage
                  <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOR OWNERS & CONCIERGE --- */}
      <section className="py-32 px-6 lg:px-12 bg-[#1a1a1a] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl md:text-6xl font-serif">A Digital Concierge for <span className="text-amber-500 italic">Fashion</span></h2>
            <p className="text-slate-400 text-lg font-light">Whether you are curating for a shop or curating for your dream closet, our AI-powered ecosystem simplifies every step.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {/* For Owners */}
            <div className="p-16 hover:bg-white/[0.03] transition-colors group">
              <div className="mb-10 w-16 h-px bg-amber-500"></div>
              <h3 className="text-3xl font-serif mb-6">M A K & CO <span className="text-amber-500 italic">Bespoke</span></h3>
              <p className="text-slate-400 mb-10 leading-relaxed font-light">Dedicated suite for shop owners. Manage multi-city inventory, track global textile trends, and automate procurement through AI-suggested supplier comparison.</p>
              <Link to="/admin/login" className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500 group-hover:gap-6 transition-all underline underline-offset-8 decoration-white/20">
                Enter Proprietor Suite <FiArrowRight />
              </Link>
            </div>
            
            {/* For Customers */}
            <div className="p-16 hover:bg-white/[0.03] transition-colors group">
              <div className="mb-10 w-16 h-px bg-amber-500"></div>
              <h3 className="text-3xl font-serif mb-6">Personal <span className="text-amber-500 italic">Atelier</span></h3>
              <p className="text-slate-400 mb-10 leading-relaxed font-light">Discover your style through our AI Fashion Assistant. Virtual trials, personalized trend alerts, and direct-to-weaver custom orders at your fingertips.</p>
              <Link to="/login" className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500 group-hover:gap-6 transition-all underline underline-offset-8 decoration-white/20">
                Explore Your Atelier <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="contact" className="bg-[#1A0F0A] py-24 px-6 lg:px-12 border-t border-amber-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2 space-y-8">
              <div className="text-3xl font-serif tracking-[0.2em] text-[#FBF6E9]">M A K <span className="text-amber-500">&</span> CO</div>
              <p className="text-[#FBF6E9]/40 max-w-sm text-sm leading-relaxed">
                Upholding the Vedic sartorial conduct through authentic hand-woven sanctity and traditional precision.
              </p>
              


              <div className="flex gap-6 mt-10">
                <a href="#" className="hover:text-amber-500 transition-colors text-white/20"><FiInstagram size={20} /></a>
                <a href="#" className="hover:text-amber-500 transition-colors text-white/20"><FiTwitter size={20} /></a>
                <a href="#" className="hover:text-amber-500 transition-colors text-white/20"><FiFacebook size={20} /></a>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">The Veda Palette</h4>
              <ul className="space-y-4 text-[10px] tracking-[0.2em] text-white/20 uppercase font-bold">
                <li><a href="#" className="hover:text-amber-500 transition-colors">Temple Silks</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Vedic Pancha</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Holy Madisar</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Angavastram</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">Sanctity Support</h4>
              <ul className="space-y-4 text-[10px] tracking-[0.2em] text-white/20 uppercase font-bold">
                <li><a href="#" className="hover:text-amber-500 transition-colors">Ritual Guide</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Purity Guide</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Bulk Temple Orders</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Heritage Inquiry</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/10">© 2025 M A K & CO. Blessed By Tradition.</p>
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/10 flex items-center gap-2">
              Digital Heritage by <span className="font-bold text-white/30 tracking-normal italic uppercase">Antigravity AI</span>
            </p>
          </div>
        </div>
      </footer>

      {/* --- ADD CUSTOM STYLES FOR ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}} />

    </div>
  );
}
