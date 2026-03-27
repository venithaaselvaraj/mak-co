import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
      try {
        await signup(formData.email, formData.password, formData.name, formData.role, formData.phone);
        navigate('/dashboard');
      } catch (err) {
        console.error('Signup Technical Error:', err);
        if (err.message?.includes('already')) {
          setError('An account with this email already exists');
        } else if (err.code) {
          setError(`Ritual Error (${err.code}): ${err.message}`);
        } else {
          setError('Failed to create account. Please contact the admin.');
        }
      }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF6E9] relative overflow-hidden py-12">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#800000]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#800000] text-[#FBF6E9] rounded-2xl shadow-xl shadow-amber-900/20 mb-6 group transition-transform hover:scale-110">
            <span className="text-3xl font-serif">M</span>
          </div>
          <h1 className="text-4xl font-serif text-[#2D1B10]">
            Join the <span className="italic text-[#800000]">Atelier</span>
          </h1>
          <p className="text-[#5D4037]/60 mt-3 text-[10px] font-bold tracking-[0.3em] uppercase opacity-50">Create your User Account</p>
        </div>

        <div className="bg-white/40 backdrop-blur-md border border-amber-900/10 rounded-[2rem] p-10 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs text-center font-bold uppercase tracking-widest animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037] mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30 group-focus-within:text-[#800000] transition-colors" />
                <input id="signup-name" name="name" value={formData.name} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-white/50 border border-amber-900/10 rounded-2xl text-[#2D1B10] placeholder-[#5D4037]/30 focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 transition-all"
                  placeholder="Your full name" required />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037] mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30 group-focus-within:text-[#800000] transition-colors" />
                <input id="signup-email" name="email" type="email" value={formData.email} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-white/50 border border-amber-900/10 rounded-2xl text-[#2D1B10] placeholder-[#5D4037]/30 focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 transition-all"
                  placeholder="name@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037] mb-2 ml-1">Phone Number</label>
              <div className="relative group">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30 group-focus-within:text-[#800000] transition-colors" />
                <input id="signup-phone" name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-white/50 border border-amber-900/10 rounded-2xl text-[#2D1B10] placeholder-[#5D4037]/30 focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 transition-all"
                  placeholder="+91 9876543210" />
              </div>
            </div>

            {/* Role select removed to prevent public admin registration */}

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037] mb-2 ml-1">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30 group-focus-within:text-[#800000] transition-colors" />
                <input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                  className="w-full pl-11 pr-12 py-4 bg-white/50 border border-amber-900/10 rounded-2xl text-[#2D1B10] placeholder-[#5D4037]/30 focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 transition-all"
                  placeholder="Min 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-900/30 hover:text-[#800000] transition-colors">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#5D4037] mb-2 ml-1">Confirm Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/30 group-focus-within:text-[#800000] transition-colors" />
                <input id="signup-confirm" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-white/50 border border-amber-900/10 rounded-2xl text-[#2D1B10] placeholder-[#5D4037]/30 focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 transition-all"
                  placeholder="Confirm your password" required />
              </div>
            </div>

            <button id="signup-submit" type="submit" disabled={loading}
              className="w-full py-5 bg-[#800000] text-white font-bold rounded-2xl shadow-xl shadow-amber-900/20 hover:bg-[#A52A2A] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 mt-4 text-[10px] uppercase tracking-[0.4em]">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                  Signing up...
                </span>
              ) : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-[#5D4037]/60 mt-8 text-[10px] uppercase tracking-widest font-bold">
            Joined already?{' '}
            <Link to="/user/login" className="text-[#800000] hover:text-[#A52A2A] transition-colors border-b border-[#800000]/20 pb-0.5">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
