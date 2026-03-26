import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiPackage, FiUpload, FiBarChart2, FiShoppingCart,
  FiLayers, FiRepeat, FiMessageSquare, FiSettings, FiLogOut,
  FiMenu, FiX, FiPhone
} from 'react-icons/fi';

const adminLinks = [
  { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/products', icon: FiPackage, label: 'Products' },
  { to: '/bills', icon: FiUpload, label: 'Bill Upload' },
  { to: '/price-comparison', icon: FiBarChart2, label: 'Price Compare' },
  { to: '/orders', icon: FiShoppingCart, label: 'Orders' },
  { to: '/bulk-orders', icon: FiLayers, label: 'Bulk Orders' },
  { to: '/returns', icon: FiRepeat, label: 'Returns' },
  { to: '/chatbot', icon: FiMessageSquare, label: 'AI Chatbot' },
  { to: '/whatsapp-settings', icon: FiPhone, label: 'WhatsApp' },
];

const customerLinks = [
  { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/products', icon: FiPackage, label: 'Browse Products' },
  { to: '/orders', icon: FiShoppingCart, label: 'My Orders' },
  { to: '/bulk-orders', icon: FiLayers, label: 'Bulk Orders' },
  { to: '/returns', icon: FiRepeat, label: 'Returns' },
  { to: '/chatbot', icon: FiMessageSquare, label: 'AI Chatbot' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, isAdmin, userData, isMock } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : customerLinks;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/20 shrink-0 border border-amber-900/10">
            <span className="text-lg font-serif text-[#FBF6E9]">M</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="font-bold text-[#FBF6E9] text-sm truncate font-serif tracking-wider">M A K & CO</h2>
              <p className="text-[10px] text-amber-500/70 truncate uppercase tracking-widest font-bold">
                {isAdmin ? 'Proprietor Suite' : 'Devotee Portal'}
              </p>
              {isMock && (
                <p className="text-[8px] text-amber-400 font-bold uppercase tracking-tighter animate-pulse">Testing Mode Active</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-amber-900/20 text-amber-400 shadow-sm border border-amber-900/10'
                  : 'text-[#FBF6E9]/40 hover:text-[#FBF6E9] hover:bg-white/5'
              }`
            }
          >
            <link.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-white/10">
        {!collapsed && userData && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-white truncate">{userData.name}</p>
            <p className="text-xs text-slate-400 truncate">{userData.email}</p>
          </div>
        )}
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-900/20">
          <FiLogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#800000] border border-amber-900/10 rounded-xl text-[#FBF6E9] shadow-lg shadow-black/20">
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm" />
      )}

      {/* Sidebar - Mobile */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full z-40 bg-[#1A0F0A]/95 backdrop-blur-xl border-r border-amber-900/20 w-64
        transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {navContent}
      </aside>

      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex flex-col h-screen bg-[#1A0F0A]/90 backdrop-blur-xl border-r border-amber-900/20 transition-all duration-300 sticky top-0
        ${collapsed ? 'w-20' : 'w-64'}`}>
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white z-10">
          {collapsed ? '→' : '←'}
        </button>
        {navContent}
      </aside>
    </>
  );
}
