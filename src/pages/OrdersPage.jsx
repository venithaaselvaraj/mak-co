import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { 
    FiShoppingCart, FiCheck, FiX, FiPackage, 
    FiMessageCircle, FiArrowRight, FiClock,
    FiFilter, FiSearch, FiTruck, FiBox, FiRepeat
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const { isAdmin, currentUser, isMock } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, [currentUser, isAdmin, isMock]);

  async function fetchOrders() {
    try {
      if (isMock) throw new Error('Mock Mode');
      const q = isAdmin 
        ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
        : query(collection(db, 'orders'), where('userId', '==', currentUser?.uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      setOrders([
        { id: '1', orderId: 'SACRED-9912', buyerName: 'Srinivasan Iyer', productName: 'Pure Silk Vasti', quantity: 1, items: [{name: 'Pure Silk Vasti', quantity: 1, price: 2400}], status: 'preparing', totalAmount: 2400, createdAt: new Date().toISOString(), isWhatsApp: false },
        { id: '2', orderId: 'ORD-8821', buyerName: 'Meenakshi Ammal', productName: 'Kanchipuram Saree', quantity: 1, items: [{name: 'Kanchipuram Saree', quantity: 1, price: 15500}], status: 'delivered', totalAmount: 15500, createdAt: new Date(Date.now() - 86400000).toISOString(), isWhatsApp: true },
      ]);
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      if (!isMock) await updateDoc(doc(db, 'orders', id), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const statusMap = {
    preparing: { label: 'In Preparation', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    shipped: { label: 'Sanctified (Transit)', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    delivered: { label: 'Blessed Delivery', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    canceled: { label: 'Veda Canceled', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-[#FBF6E9]">Sacred <span className="italic text-amber-500">Orders</span></h1>
        <p className="text-[#FBF6E9]/40 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">Inventory Log & Ritual Fulfillment</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'preparing', 'shipped', 'delivered'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all ${filter === f ? 'bg-[#800000] border-[#800000] text-white shadow-xl' : 'border-amber-900/10 text-[#FBF6E9]/40 hover:bg-white/5'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-[#1A0F0A]/40 backdrop-blur-md border border-amber-900/10 rounded-[2.5rem] p-8 group">
            <div className="flex flex-col xl:flex-row gap-8">
              {/* Main Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${statusMap[order.status]?.bg || 'bg-white/5'} ${statusMap[order.status]?.color || 'text-[#FBF6E9]/40'}`}>
                    {statusMap[order.status]?.label || 'Inquiry'}
                  </span>
                  <span className="text-amber-500/40 text-[10px] font-bold uppercase tracking-widest">Order ID: {order.orderId}</span>
                </div>

                <div className="space-y-4 mb-8">
                  {(order.items || [{name: order.productName, quantity: order.quantity}]).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 italic">
                        <span className="text-[#FBF6E9] font-serif">{item.name} <span className="text-amber-500/40 not-italic ml-2">x{item.quantity}</span></span>
                        <span className="text-[#FBF6E9]/40 text-xs">₹{item.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-8 items-center border-t border-amber-900/10 pt-6">
                    <div>
                        <p className="text-[8px] uppercase tracking-widest font-bold text-amber-500/30 mb-1">Total Blessing</p>
                        <p className="text-xl font-serif text-amber-500">₹{parseFloat(order.totalAmount).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-[8px] uppercase tracking-widest font-bold text-amber-500/30 mb-1">Order Date</p>
                        <p className="text-[10px] text-[#FBF6E9]/60 font-serif">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    {!order.isWhatsApp && (
                         <div className="px-4 py-2 bg-emerald-950/20 border border-emerald-950/40 rounded-xl">
                             <p className="text-[8px] text-emerald-500 uppercase tracking-tighter font-bold">Internal Order Verified</p>
                         </div>
                    )}
                </div>
              </div>

              {/* Sidebar Actions */}
              <div className="xl:w-64 flex flex-col gap-3 justify-center border-t xl:border-t-0 xl:border-l border-amber-900/10 pt-6 xl:pt-0 xl:pl-8">
                {isAdmin ? (
                    <>
                        {order.status === 'preparing' && (
                            <button onClick={() => updateStatus(order.id, 'shipped')} className="w-full py-4 bg-cyan-900/20 text-cyan-400 border border-cyan-900/30 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-cyan-900 transition-all flex items-center justify-center gap-2">
                                <FiTruck /> Sanctify (Ship)
                            </button>
                        )}
                        {order.status === 'shipped' && (
                            <button onClick={() => updateStatus(order.id, 'delivered')} className="w-full py-4 bg-emerald-900/20 text-emerald-400 border border-emerald-900/30 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all flex items-center justify-center gap-2">
                                <FiCheck /> Confirm Blessing
                            </button>
                        )}
                        <button onClick={() => updateStatus(order.id, 'canceled')} className="w-full py-4 text-rose-500/40 hover:text-rose-500 text-[9px] font-bold uppercase tracking-[0.2em] transition-all">
                            Dissolve Order
                        </button>
                    </>
                ) : (
                    <>
                        {order.status === 'delivered' && (
                             <button onClick={() => navigate('/returns')} className="w-full py-4 bg-amber-900/20 text-amber-500 border border-amber-900/30 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-amber-900/40 transition-all flex items-center justify-center gap-2">
                                <FiRepeat /> Request Exchange
                             </button>
                        )}
                        <button onClick={() => navigate('/chatbot')} className="w-full py-4 bg-white/5 border border-white/10 text-[#FBF6E9]/40 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <FiMessageCircle /> Heritage Inquiry
                        </button>
                    </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
         <div className="text-center py-32 bg-[#1A0F0A]/20 rounded-[3rem] border border-dashed border-amber-900/10">
            <FiBox className="w-16 h-16 text-amber-900/10 mx-auto mb-6" />
            <p className="text-amber-500/40 font-serif italic uppercase tracking-[0.4em]">The Order Log is Empty</p>
         </div>
      )}
    </Layout>
  );
}
