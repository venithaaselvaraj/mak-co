import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message?.includes('invalid') ? 'Invalid credentials' : 'Failed to sign in. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF6E9] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#800000]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#800000] text-[#FBF6E9] rounded-2xl shadow-xl shadow-amber-900/20 mb-6 group transition-transform hover:scale-110">
            <span className="text-3xl font-serif">M</span>
          </div>
          <h1 className="text-4xl font-serif text-[#2D1B10]">
            Admin <span className="italic text-[#800000]">Portal</span>
          </h1>
          <p className="text-[#5D4037]/60 mt-3 text-sm font-medium tracking-wide uppercase font-bold">M A K & CO Management</p>
        </div>

        <div className="bg-white/40 backdrop-blur-md border border-amber-900/10 rounded-[2rem] p-10 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs text-center font-bold uppercase tracking-widest animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037] mb-2 ml-1">Admin Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30 group-focus-within:text-[#800000] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white/50 border border-amber-900/10 rounded-2xl text-[#2D1B10] placeholder-[#5D4037]/30 focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 transition-all"
                  placeholder="admin@mak.co"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037] mb-2 ml-1">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30 group-focus-within:text-[#800000] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 bg-white/50 border border-amber-900/10 rounded-2xl text-[#2D1B10] placeholder-[#5D4037]/30 focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-900/30 hover:text-[#800000] transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#800000] text-white font-bold rounded-2xl shadow-xl shadow-amber-900/20 hover:bg-[#A52A2A] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 text-[10px] uppercase tracking-[0.4em]"
            >
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#5D4037]/40">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
