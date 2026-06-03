import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FiTrendingDown, FiTrendingUp, FiAward } from 'react-icons/fi';
import { toastComingSoon } from '../utils/toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#10b981', '#f97316', '#ec4899'];

const sampleComparisons = [
  {
    product: 'Pure Silk Saree',
    manufacturers: [
      { name: 'Kanchi Heritage Silks', price: 18500, date: '2025-03-15' },
      { name: 'Banarasi Hub Weavers', price: 17200, date: '2025-03-12' },
      { name: 'Mysore Royal Silks', price: 19500, date: '2025-03-10' },
      { name: 'Tanjore Sacred Weaves', price: 16800, date: '2025-03-08' },
    ]
  },
  {
    product: 'Vedic Cotton Vasti',
    manufacturers: [
      { name: 'Coimbatore Handlooms', price: 1200, date: '2025-03-15' },
      { name: 'Erode Weaver Society', price: 1150, date: '2025-03-14' },
      { name: 'Madurai Heritage', price: 1300, date: '2025-03-11' },
      { name: 'Salem Textile Guild', price: 1050, date: '2025-03-09' },
    ]
  },
  {
    product: 'Traditional Madisar',
    manufacturers: [
      { name: 'Kumbakonam Silks', price: 14200, date: '2025-03-25' },
      { name: 'Temple Weavers Guild', price: 13800, date: '2025-03-22' },
      { name: 'Tanjore Heritage', price: 14500, date: '2025-03-18' },
      { name: 'Mayiladuthurai Silks', price: 14000, date: '2025-03-15' },
    ]
  },
  {
    product: 'Sacred Angavastram',
    manufacturers: [
      { name: 'Heritage Weaves', price: 2500, date: '2025-03-25' },
      { name: 'Vedic Threads', price: 2300, date: '2025-03-20' },
      { name: 'Handloom Society', price: 2700, date: '2025-03-15' },
      { name: 'Pure Cotton Artisans', price: 2400, date: '2025-03-10' },
    ]
  },
  {
    product: 'Premium Linen Fabric',
    manufacturers: [
      { name: 'Linen Masterworks', price: 1100, date: '2025-03-15' },
      { name: 'Pure Linen Co', price: 1050, date: '2025-03-13' },
      { name: 'Fab India Supply', price: 1200, date: '2025-03-09' },
    ]
  },
];

const sampleHistoryData = {
  'Pure Silk Saree': [
    { date: 'Jan', 'Kanchi Heritage Silks': 17500, 'Banarasi Hub Weavers': 16800, 'Mysore Royal Silks': 18000, 'Tanjore Sacred Weaves': 16000 },
    { date: 'Feb', 'Kanchi Heritage Silks': 18000, 'Banarasi Hub Weavers': 17000, 'Mysore Royal Silks': 18500, 'Tanjore Sacred Weaves': 16500 },
    { date: 'Mar', 'Kanchi Heritage Silks': 18500, 'Banarasi Hub Weavers': 17200, 'Mysore Royal Silks': 19500, 'Tanjore Sacred Weaves': 16800 },
    { date: 'Apr', 'Kanchi Heritage Silks': 18200, 'Banarasi Hub Weavers': 16900, 'Mysore Royal Silks': 19000, 'Tanjore Sacred Weaves': 16600 },
  ],
  'Vedic Cotton Vasti': [
    { date: 'Jan', 'Coimbatore Handlooms': 1100, 'Erode Weaver Society': 1050, 'Madurai Heritage': 1200, 'Salem Textile Guild': 980 },
    { date: 'Feb', 'Coimbatore Handlooms': 1150, 'Erode Weaver Society': 1100, 'Madurai Heritage': 1250, 'Salem Textile Guild': 1020 },
    { date: 'Mar', 'Coimbatore Handlooms': 1200, 'Erode Weaver Society': 1150, 'Madurai Heritage': 1300, 'Salem Textile Guild': 1050 },
  ],
  'Traditional Madisar': [
    { date: 'Jan', 'Kumbakonam Silks': 13500, 'Temple Weavers Guild': 13000, 'Tanjore Heritage': 13800, 'Mayiladuthurai Silks': 13200 },
    { date: 'Feb', 'Kumbakonam Silks': 13800, 'Temple Weavers Guild': 13400, 'Tanjore Heritage': 14200, 'Mayiladuthurai Silks': 13600 },
    { date: 'Mar', 'Kumbakonam Silks': 14200, 'Temple Weavers Guild': 13800, 'Tanjore Heritage': 14500, 'Mayiladuthurai Silks': 14000 },
  ],
  'Sacred Angavastram': [
    { date: 'Jan', 'Heritage Weaves': 2300, 'Vedic Threads': 2100, 'Handloom Society': 2500, 'Pure Cotton Artisans': 2200 },
    { date: 'Feb', 'Heritage Weaves': 2400, 'Vedic Threads': 2200, 'Handloom Society': 2600, 'Pure Cotton Artisans': 2300 },
    { date: 'Mar', 'Heritage Weaves': 2500, 'Vedic Threads': 2300, 'Handloom Society': 2700, 'Pure Cotton Artisans': 2400 },
  ],
};

export default function PriceComparisonPage() {
  const [comparisons, setComparisons] = useState(sampleComparisons);
  const [priceHistory, setPriceHistory] = useState({});
  const [selectedProduct, setSelectedProduct] = useState('Pure Silk Saree');
  const [activeTab, setActiveTab] = useState('comparison'); // 'comparison' | 'history'

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Price Comparison (Current Bills)
        const billsSnap = await getDocs(collection(db, 'bills'));
        const bills = billsSnap.docs.map(d => d.data());
        if (bills.length > 0) {
          const grouped = {};
          bills.forEach(b => {
            if (!grouped[b.productName]) grouped[b.productName] = [];
            grouped[b.productName].push({
              name: b.manufacturerName,
              price: b.purchasePrice,
              date: b.purchaseDate,
            });
          });
          const comps = Object.entries(grouped).map(([product, manufacturers]) => ({
            product,
            manufacturers: manufacturers.sort((a, b) => a.price - b.price),
          }));
          setComparisons(comps);
        }

        // 2. Fetch Price History (Historical Logs)
        const historySnap = await getDocs(collection(db, 'price_history'));
        const historyList = historySnap.docs.map(d => d.data());
        
        if (historyList.length > 0) {
          const historyGrouped = {};
          historyList.forEach(h => {
            if (!historyGrouped[h.productName]) historyGrouped[h.productName] = [];
            
            // Format for chart: { date, [mfrName]: price }
            const dateObj = new Date(h.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            
            // Try to find if we already have an entry for this month
            let entry = historyGrouped[h.productName].find(e => e.date === month);
            if (!entry) {
              entry = { date: month };
              historyGrouped[h.productName].push(entry);
            }
            entry[h.manufacturerName] = h.price;
          });
          setPriceHistory(historyGrouped);
        }
      } catch (err) {
          console.error("Fetch Analysis Error:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Price Comparison</h1>
        <p className="text-slate-400 text-sm mt-1">Compare prices across manufacturers and track price history</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('comparison')}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'comparison' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
          Price Comparison
        </button>
        <button onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'history' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
          Price History
        </button>
      </div>

      {activeTab === 'comparison' ? (
        <div className="space-y-6">
       {/* Price Disparity Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-2xl p-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#800000] mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-[#800000]" /> Price Disparity Alerts
            </h3>
            <div className="space-y-4">
                {[
                    { product: 'Pure Silk Saree', suppliers: 'Kanchi vs Banarasi', variance: '15% High', status: 'Reviewing', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { product: 'Cotton Fabric', suppliers: 'Raymond vs Arvind', variance: '5% Low', status: 'Stable', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { product: 'Temple Madisar', suppliers: 'Kumbakonam vs Weavers', variance: '22% Peak', status: 'Critical', color: 'text-rose-500', bg: 'bg-rose-500/10' },
                ].map((alert, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-[#800000]/30 transition-all cursor-pointer">
                        <div>
                            <p className="text-[#FBF6E9] font-serif text-[11px] font-bold tracking-wider">{alert.product}</p>
                            <p className="text-[9px] text-[#FBF6E9]/30 uppercase tracking-tighter mt-1">{alert.suppliers}</p>
                        </div>
                        <div className="text-right">
                             <p className={`${alert.color} text-[10px] font-bold uppercase tracking-widest`}>{alert.variance}</p>
                             <p className="text-[8px] text-[#FBF6E9]/20 font-bold uppercase tracking-widest mt-1">{alert.status}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => toastComingSoon('PDF Report download')} className="w-full mt-6 py-3 border border-amber-900/10 rounded-xl text-[9px] font-bold text-amber-500/40 uppercase tracking-[0.3em] hover:bg-white/5 transition-all">
                Download Analysis Report (PDF)
            </button>
        </div>

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
      </div>
          {comparisons.map((comp, i) => {
            const cheapest = Math.min(...comp.manufacturers.map(m => m.price));
            return (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🧶</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{comp.product}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-sm font-medium text-slate-400">Manufacturer</th>
                        <th className="text-left p-4 text-sm font-medium text-slate-400">Price</th>
                        <th className="text-left p-4 text-sm font-medium text-slate-400">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comp.manufacturers.map((mfr, j) => (
                        <tr key={j} className={`border-b border-white/5 transition-colors ${mfr.price === cheapest ? 'bg-emerald-500/5' : 'hover:bg-white/[0.03]'}`}>
                          <td className="p-4 text-white font-medium">{mfr.name}</td>
                          <td className={`p-4 font-bold text-lg ${mfr.price === cheapest ? 'text-emerald-400' : 'text-slate-300'}`}>
                            ₹{mfr.price.toLocaleString()}
                          </td>
                          <td className="p-4 text-slate-400 text-sm">{mfr.date}</td>
                          <td className="p-4">
                            {mfr.price === cheapest ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-bold uppercase tracking-widest transition-all hover:scale-105">
                                <FiAward className="w-3 h-3" /> Best Supplier
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs text-red-400">
                                <FiTrendingUp className="w-3 h-3" /> +₹{(mfr.price - cheapest).toLocaleString()}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Product Selector */}
          <div className="flex gap-2 flex-wrap">
            {Object.keys(sampleHistoryData).map(product => (
              <button key={product} onClick={() => setSelectedProduct(product)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedProduct === product ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
                {product}
              </button>
            ))}
          </div>

          {/* Price History Chart */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Price History: {selectedProduct}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sampleHistoryData[selectedProduct] || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  formatter={(value) => [`₹${value}`, '']} />
                <Legend />
                {sampleHistoryData[selectedProduct] &&
                  Object.keys(sampleHistoryData[selectedProduct][0])
                    .filter(k => k !== 'date')
                    .map((mfr, i) => (
                      <Line key={mfr} type="monotone" dataKey={mfr} stroke={COLORS[i % COLORS.length]}
                        strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    ))
                }
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Layout>
  );
}
