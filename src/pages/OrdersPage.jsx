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
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (docs.length === 0) {
        throw new Error('Empty database');
      }
      setOrders(docs);
    } catch {
      setOrders([
        { id: '1', orderId: 'SACRED-9912', buyerName: 'Srinivasan Iyer', productName: 'Brahmin Panchakacham Veshti Set', quantity: 1, items: [{name: 'Sacred Brahmin Panchakacham Veshti Set', quantity: 1, price: 1800}], status: 'preparing', totalAmount: 1800, createdAt: new Date().toISOString(), isWhatsApp: false, paymentMethod: 'GPay', screenshotUrl: '/assets/landing/temple_ritual.png' },
        { id: '2', orderId: 'ORD-8821', buyerName: 'Meenakshi Ammal', productName: 'Brahminical 9-Yard Kumbakonam Madisar Saree', quantity: 1, items: [{name: 'Brahminical 9-Yard Kumbakonam Madisar Saree', quantity: 1, price: 18500}], status: 'delivered', totalAmount: 18500, createdAt: new Date(Date.now() - 86400000).toISOString(), isWhatsApp: true, paymentMethod: 'WhatsApp Pay' },
        { id: '3', orderId: 'SACRED-7734', buyerName: 'Ranganathan Swami', productName: 'Brahminical Grahapravesam Silk Madisar Saree', quantity: 1, items: [{name: 'Brahminical Grahapravesam Silk Madisar Saree', quantity: 1, price: 19800}], status: 'accepted', totalAmount: 19800, createdAt: new Date(Date.now() - 172800000).toISOString(), isWhatsApp: false, paymentMethod: 'Bank Transfer' },
        { id: '4', orderId: 'ORD-5542', buyerName: 'Lakshmi Narayanan', productName: 'Vedic Gurukul Cotton Veshti Set', quantity: 2, items: [{name: 'Vedic Gurukul Cotton Veshti Set', quantity: 2, price: 1200}], status: 'shipped', totalAmount: 2400, createdAt: new Date(Date.now() - 259200000).toISOString(), isWhatsApp: true, paymentMethod: 'WhatsApp Pay' },
        { id: '5', orderId: 'SACRED-4421', buyerName: 'Venkat Raman', productName: 'Lord Venkateswara Swamy Peethambaram Vastram', quantity: 5, items: [{name: 'Lord Venkateswara Swamy Peethambaram Vastram', quantity: 5, price: 24500}], status: 'preparing', totalAmount: 122500, createdAt: new Date(Date.now() - 345600000).toISOString(), isWhatsApp: false, paymentMethod: 'GPay', screenshotUrl: '/assets/landing/temple_statue.png' },
        { id: '6', orderId: 'ORD-3310', buyerName: 'Gayatri Devi', productName: 'Goddess Mahalakshmi Idol Traditional Silk Saree', quantity: 1, items: [{name: 'Goddess Mahalakshmi Idol Traditional Silk Saree', quantity: 1, price: 22000}], status: 'delivered', totalAmount: 22000, createdAt: new Date(Date.now() - 604800000).toISOString(), isWhatsApp: true, paymentMethod: 'Cash on Ritual' },
        { id: '7', orderId: 'SACRED-2201', buyerName: 'Anand Kumar (UK)', productName: 'Temple Utsavar Deity Silk Pavadai Vastram Set', quantity: 1, items: [{name: 'Temple Utsavar Deity Silk Pavadai Vastram Set', quantity: 1, price: 15500}], status: 'preparing', totalAmount: 15500, createdAt: new Date().toISOString(), isWhatsApp: false, paymentMethod: 'Swift Transfer', screenshotUrl: '' },
        { id: '8', orderId: 'ORD-1199', buyerName: 'Temple Committee', productName: 'Swamy Deity Brass Alankaram Shringa Vasti', quantity: 10, items: [{name: 'Swamy Deity Brass Alankaram Shringa Vasti', quantity: 10, price: 16500}], status: 'accepted', totalAmount: 165000, createdAt: new Date(Date.now() - 432000000).toISOString(), isWhatsApp: true, paymentMethod: 'Cheque' },
      ]);
    }
  }

  const updateStatus = async (order, newStatus) => {
    try {
      if (!isMock) {
          await updateDoc(doc(db, 'orders', order.id), { 
              status: newStatus,
              paymentStatus: 'verified'
          });
          
          if (newStatus === 'accepted') {
              // Trigger WhatsApp Confirmation via Server
              const axios = (await import('axios')).default;
              await axios.post('/api/whatsapp/confirm-order', {
                  customerPhone: order.phone || '917598137660', // Fallback for demo
                  orderDetails: {
                      productName: order.items?.[0]?.name || order.productName,
                      quantity: order.items?.[0]?.quantity || order.quantity,
                      totalAmount: order.totalAmount
                  }
              });
          }
      }
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus, paymentStatus: 'verified' } : o));
    } catch (err) {
      console.error("Status Update/WhatsApp Error:", err);
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
    }
  };

  const statusMap = {
    preparing: { label: 'In Preparation', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    accepted: { label: 'Auspiciously Accepted', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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
                            <p className="text-[8px] uppercase tracking-widest font-bold text-amber-500/30 mb-1">Payment Method</p>
                            <p className="text-[10px] text-[#FBF6E9]/60 font-serif uppercase tracking-widest">{order.paymentMethod || 'Cash'}</p>
                        </div>
                        {order.screenshotUrl && (
                            <div className="relative group/proof cursor-pointer" onClick={() => window.open(order.screenshotUrl)}>
                                <p className="text-[8px] uppercase tracking-widest font-bold text-amber-500/30 mb-1">Sacred Proof</p>
                                <img src={order.screenshotUrl} alt="GPay Proof" className="w-12 h-12 object-cover rounded-lg border border-amber-500/20 group-hover/proof:scale-150 transition-transform origin-left" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/proof:opacity-100 transition-opacity rounded-lg">
                                    <FiSearch className="text-white text-xs" />
                                </div>
                            </div>
                        )}
                        {!order.isWhatsApp && (
                             <div className="px-4 py-2 bg-emerald-950/20 border border-emerald-950/40 rounded-xl">
                                 <p className="text-[8px] text-emerald-500 uppercase tracking-tighter font-bold">Internal Order Verified</p>
                             </div>
                        )}
                    </div>
                    {order.notes && <p className="text-[10px] text-[#FBF6E9]/30 italic mt-6 italic">"{order.notes}"</p>}

                    {/* Tracking Visualization */}
                    <div className="pt-6 pb-2 border-t border-amber-900/10 mt-8 overflow-x-auto no-scrollbar">
                      <div className="flex justify-between items-start min-w-[500px] px-2">
                        {[
                          { s: 'preparing', l: 'Preparing', i: FiBox },
                          { s: 'accepted', l: 'Sanctified', i: FiCheck },
                          { s: 'shipped', l: 'In-Transit', i: FiTruck },
                          { s: 'delivered', l: 'Delivered', i: FiPackage },
                        ].map((step, idx, arr) => {
                          const stages = ['preparing', 'accepted', 'shipped', 'delivered'];
                          const currentStage = stages.indexOf(order.status);
                          const stepIdx = stages.indexOf(step.s);
                          const isActive = stepIdx <= currentStage;
                          const isLastCompleted = stepIdx === currentStage;

                          return (
                            <div key={step.s} className="flex-1 relative flex flex-col items-center group/step">
                              {/* Dot/Icon Hub */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 z-10 ${
                                isActive ? 'bg-[#800000] border-[#800000] shadow-lg shadow-red-950/40' : 'bg-[#1A0F0A] border-amber-900/20'
                              }`}>
                                <step.i className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FBF6E9]/20'}`} />
                              </div>
                              
                              {/* Progress Line */}
                              {idx < arr.length - 1 && (
                                <div className="absolute top-5 left-1/2 w-full h-[1px] bg-amber-900/10 z-0">
                                   <div className={`h-full bg-[#800000] transition-all duration-1000 ${isActive && stepIdx < currentStage ? 'w-full' : 'w-0'}`}></div>
                                </div>
                              )}

                              <div className="mt-4 text-center">
                                <p className={`text-[8.5px] uppercase tracking-[0.25em] font-bold ${isActive ? 'text-amber-500' : 'text-[#FBF6E9]/20'}`}>{step.l}</p>
                                {isActive && isLastCompleted && (
                                   <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[6px] rounded-full uppercase mt-2 font-black animate-pulse border border-emerald-500/20">Active Stage</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
              <div className="xl:w-64 flex flex-col gap-3 justify-center border-t xl:border-t-0 xl:border-l border-amber-900/10 pt-6 xl:pt-0 xl:pl-8">
                {isAdmin ? (
                    <>
                        {order.status === 'preparing' && (
                             <button onClick={() => updateStatus(order, 'accepted')} className="w-full py-4 bg-emerald-700 text-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 animate-pulse">
                                <FiCheck /> Accept Order
                             </button>
                        )}
                        {order.status === 'accepted' && (
                            <button onClick={() => updateStatus(order, 'shipped')} className="w-full py-4 bg-cyan-900/20 text-cyan-400 border border-cyan-900/30 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-cyan-900 transition-all flex items-center justify-center gap-2">
                                <FiTruck /> Sanctify (Ship)
                            </button>
                        )}
                        {order.status === 'shipped' && (
                            <button onClick={() => updateStatus(order, 'delivered')} className="w-full py-4 bg-emerald-900/20 text-emerald-400 border border-emerald-900/30 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all flex items-center justify-center gap-2">
                                <FiCheck /> Confirm Blessing
                            </button>
                        )}
                        <button onClick={() => updateStatus(order, 'canceled')} className="w-full py-4 text-rose-500/40 hover:text-rose-500 text-[9px] font-bold uppercase tracking-[0.2em] transition-all">
                            Dissolve Order
                        </button>
                    </>
                ) : (
                    <>
                        {order.status === 'delivered' && (
                          (() => {
                            const deliveredAt = order.updatedAt || order.createdAt; // Assuming updatedAt is set when delivered
                            const isWithin7Days = (new Date().getTime() - new Date(deliveredAt).getTime()) < (7 * 24 * 60 * 60 * 1000);
                            
                            return isWithin7Days ? (
                              <button onClick={() => navigate('/returns', { state: { orderId: order.orderId, productName: order.productName } })} 
                                className="w-full py-4 bg-amber-900/20 text-amber-500 border border-amber-900/30 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-amber-900/40 transition-all flex items-center justify-center gap-2">
                                <FiRepeat /> 7-Day Exchange
                              </button>
                            ) : (
                               <div className="text-center py-2 px-3 bg-red-900/5 rounded-xl border border-red-900/10">
                                 <p className="text-[7px] uppercase tracking-widest text-red-500/50 font-bold">Exchange Sanctuary Closed</p>
                                 <p className="text-[6px] text-slate-600 mt-1 italic">Vedic 7-day period exceeded</p>
                               </div>
                            );
                          })()
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
