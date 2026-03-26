import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { FiPackage, FiShoppingCart, FiLayers, FiAlertTriangle, FiTrendingUp, FiBox } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#800000', '#B8860B', '#D2691E', '#CD853F', '#DAA520', '#A0522D'];

const sampleOrderData = [
  { month: 'Jan', orders: 45 }, { month: 'Feb', orders: 52 }, { month: 'Mar', orders: 68 },
  { month: 'Apr', orders: 74 }, { month: 'May', orders: 89 }, { month: 'Jun', orders: 95 },
];

const sampleCategoryData = [
  { name: 'Saree', value: 35 }, { name: 'Vasti', value: 20 },
  { name: 'Madisar', value: 22 }, { name: 'Angavastram', value: 15 }, { name: 'Others', value: 8 },
];

const samplePriceData = [
  { date: 'Week 1', silk: 1500, cotton: 800, linen: 1200 },
  { date: 'Week 2', silk: 1550, cotton: 780, linen: 1250 },
  { date: 'Week 3', silk: 1480, cotton: 820, linen: 1180 },
  { date: 'Week 4', silk: 1520, cotton: 790, linen: 1220 },
];

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-2xl p-5 hover:bg-amber-900/10 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#FBF6E9]/40 text-[10px] uppercase tracking-widest font-bold">{label}</p>
          <p className="text-2xl font-serif text-[#FBF6E9] mt-1">{value}</p>
          {trend && (
            <p className={`text-[10px] mt-2 flex items-center gap-1 font-bold tracking-wider ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <FiTrendingUp className={trend < 0 ? 'rotate-180' : ''} />
              {Math.abs(trend)}% PROGRESS
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-lg shadow-black/20`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isAdmin, userData } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, bulkOrders: 0, lowStock: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const productSnap = await getDocs(collection(db, 'products'));
        const orderSnap = await getDocs(collection(db, 'orders'));
        const bulkSnap = await getDocs(collection(db, 'bulkOrders'));
        let lowStock = 0;
        productSnap.forEach(doc => {
          if (doc.data().stockQuantity < 10) lowStock++;
        });
        setStats({
          products: productSnap.size,
          orders: orderSnap.size,
          bulkOrders: bulkSnap.size,
          lowStock,
        });
      } catch {
        // Demo data if Firestore not configured
        setStats({ products: 156, orders: 89, bulkOrders: 12, lowStock: 8 });
      }
    }
    fetchStats();
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl md:text-5xl font-serif text-[#FBF6E9]">
          Blessings, <span className="italic text-amber-500">{userData?.name || 'Devotee'}</span>
        </h1>
        <p className="text-[#FBF6E9]/40 mt-3 text-[11px] uppercase tracking-[0.4em] font-bold">M A K & CO Heritage Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={FiPackage} label="Sanctity Inventory" value={stats.products} color="bg-[#800000]" trend={12} />
        <StatCard icon={FiShoppingCart} label="Sacred Orders" value={stats.orders} color="bg-amber-700" trend={8} />
        <StatCard icon={FiLayers} label="Temple Bulk" value={stats.bulkOrders} color="bg-amber-900" trend={-3} />
        <StatCard icon={FiAlertTriangle} label="Low Stock Alert" value={stats.lowStock} color="bg-rose-900" trend={null} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Order Trends */}
        <div className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-2xl p-8">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500 mb-6">Order Trajectory</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sampleOrderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(251, 246, 233, 0.05)" />
              <XAxis dataKey="month" stroke="rgba(251, 246, 233, 0.3)" fontSize={10} tick={{ fill: 'rgba(251, 246, 233, 0.3)' }} />
              <YAxis stroke="rgba(251, 246, 233, 0.3)" fontSize={10} tick={{ fill: 'rgba(251, 246, 233, 0.3)' }} />
              <Tooltip contentStyle={{ background: '#1A0F0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#FBF6E9' }} />
              <Bar dataKey="orders" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#800000" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-2xl p-8">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500 mb-6">Attire Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={sampleCategoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                paddingAngle={8} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {sampleCategoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1A0F0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#FBF6E9' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Change Trends */}
      <div className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-2xl p-8 mb-10">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500 mb-6">Textile Purity Index</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={samplePriceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(251, 246, 233, 0.05)" />
            <XAxis dataKey="date" stroke="rgba(251, 246, 233, 0.3)" fontSize={10} />
            <YAxis stroke="rgba(251, 246, 233, 0.3)" fontSize={10} />
            <Tooltip contentStyle={{ background: '#1A0F0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#FBF6E9' }}
              formatter={(value) => [`₹${value}`, '']} />
            <Line type="monotone" dataKey="silk" stroke="#800000" strokeWidth={3} dot={{ r: 5, fill: '#800000' }} name="Silk" />
            <Line type="monotone" dataKey="cotton" stroke="#B8860B" strokeWidth={3} dot={{ r: 5, fill: '#B8860B' }} name="Cotton" />
            <Line type="monotone" dataKey="linen" stroke="#DAA520" strokeWidth={3} dot={{ r: 5, fill: '#DAA520' }} name="Linen" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-2xl p-8">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500 mb-6">Heritage Log</h3>
        <div className="space-y-4">
          {[
            { text: 'Sacred order received from Priya - Silk Saree × 2', time: '2 hours ago', iconColor: 'bg-[#800000]' },
            { text: 'Textile alert: Cotton thread price increased by 5%', time: '4 hours ago', iconColor: 'bg-amber-600' },
            { text: 'Temple bulk order confirmed - 50pc Angavastram', time: '1 day ago', iconColor: 'bg-amber-900' },
            { text: 'Ritual return request approved - Order #1234', time: '2 days ago', iconColor: 'bg-rose-900' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-amber-900/20 transition-all">
              <div className={`w-3 h-3 rounded-full ${item.iconColor} shadow-lg shadow-black/20`}></div>
              <p className="text-[11px] text-[#FBF6E9]/70 flex-1 tracking-wide">{item.text}</p>
              <span className="text-[9px] uppercase tracking-tighter text-[#FBF6E9]/20 font-bold">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
