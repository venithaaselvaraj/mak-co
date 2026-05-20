import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiRepeat, FiCheck, FiX, FiCamera, FiHash, 
    FiMessageSquare, FiTruck, FiBox, FiClock,
    FiShield, FiActivity, FiArrowRight, FiInfo
} from 'react-icons/fi';

export default function ReturnExchangePage() {
  const { isAdmin, currentUser, isMock } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orderId: '', requestType: 'exchange', reason: '', productName: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const location = useLocation();

  useEffect(() => {
    if (location.state?.orderId) {
      setForm(prev => ({ 
        ...prev, 
        orderId: location.state.orderId,
        productName: location.state.productName || ''
      }));
      setShowForm(true);
    }
  }, [location.state]);

  useEffect(() => { fetchRequests(); }, [currentUser, isAdmin, isMock]);

  async function fetchRequests() {
    try {
      if (isMock) throw new Error('Mock');
      const q = isAdmin 
        ? query(collection(db, 'returns'), orderBy('createdAt', 'desc'))
        : query(collection(db, 'returns'), where('userId', '==', currentUser?.uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (docs.length === 0) {
        throw new Error('Empty database');
      }
      setRequests(docs);
    } catch {
      setRequests([
        { id: '1', orderId: 'ORD-1088', productName: 'Brahminical 9-Yard Kumbakonam Madisar Saree', requestType: 'exchange', reason: 'Zari weaving shade mismatch on borders.', status: 'in-transit', photoUrl: '', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: '2', orderId: 'ORD-2022', productName: 'Sacred White Brahmin Panchakacham Cotton Veshti', requestType: 'return', reason: 'Small weaving thread pull on the gold border.', status: 'approved', photoUrl: '', createdAt: new Date(Date.now() - 172800000).toISOString() },
        { id: '3', orderId: 'ORD-3051', productName: 'Premium Pure Silk Priest Angavastram', requestType: 'exchange', reason: 'Requested custom Sandalwood shade but received Ivory.', status: 'completed', photoUrl: '', createdAt: new Date(Date.now() - 604800000).toISOString() },
        { id: '4', orderId: 'ORD-4012', productName: 'Brahminical Grahapravesam Silk Madisar Saree', requestType: 'return', reason: 'Order delayed by two days, missed the auspicious grihapravesam muhurtham.', status: 'pending', photoUrl: '', createdAt: new Date(Date.now() - 43200000).toISOString() },
        { id: '5', orderId: 'ORD-5521', productName: 'Lord Venkateswara Swamy Peethambaram Vastram', requestType: 'exchange', reason: 'The gold tissue border is narrower than the temple statue standard measurement.', status: 'inspecting', photoUrl: '', createdAt: new Date(Date.now() - 259200000).toISOString() },
        { id: '6', orderId: 'ORD-6678', productName: 'Traditional Vedic Gurukul Cotton Veshti Set', requestType: 'return', reason: 'Accidentally ordered double pack instead of single.', status: 'rejected', photoUrl: '', createdAt: new Date(Date.now() - 864000000).toISOString() },
        { id: '7', orderId: 'ORD-7701', productName: 'Goddess Mahalakshmi Idol Traditional Silk Saree', requestType: 'exchange', reason: 'Requesting a different goddess crown motif style.', status: 'pending', photoUrl: '', createdAt: new Date().toISOString() },
        { id: '8', orderId: 'ORD-8812', productName: 'Temple Utsavar Deity Silk Pavadai Set', requestType: 'return', reason: 'Temple committee decided on a different festival color theme.', status: 'approved', photoUrl: '', createdAt: new Date(Date.now() - 345600000).toISOString() },
      ]);
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      if (!isMock) await updateDoc(doc(db, 'returns', id), { status });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  const statusMap = {
    pending: { label: 'Awaiting Sanction', icon: FiClock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    approved: { label: 'Ritual Approved', icon: FiCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    'in-transit': { label: 'Sacred Transit', icon: FiTruck, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    inspecting: { label: 'Boutique Inspection', icon: FiActivity, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    completed: { label: 'Heritage Restored', icon: FiBox, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    rejected: { label: 'Blessing Denied', icon: FiX, color: 'text-red-500', bg: 'bg-red-500/10' },
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <Layout>
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-[#FBF6E9]">Heritage <span className="italic text-amber-500">Restoration</span></h1>
          <p className="text-[#FBF6E9]/40 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">Sacred Exchange & Return Tracking System</p>
        </div>
        {!isAdmin && (
          <button onClick={() => setShowForm(true)}
            className="px-8 py-4 bg-[#800000] text-white font-serif rounded-2xl shadow-2xl shadow-red-950/30 hover:bg-[#A52A2A] transition-all flex items-center gap-3 text-sm border border-amber-900/10">
            <FiRepeat /> Initiate Exchange
          </button>
        )}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
            { label: 'Active Exchanges', value: requests.filter(r => r.status !== 'completed' && r.status !== 'rejected').length, icon: FiActivity, color: 'text-emerald-500' },
            { label: 'Completed Missions', value: requests.filter(r => r.status === 'completed').length, icon: FiBox, color: 'text-rose-500' },
            { label: 'Awaiting Approval', value: requests.filter(r => r.status === 'pending').length, icon: FiClock, color: 'text-amber-400' },
            { label: 'Total In-Transit', value: requests.filter(r => r.status === 'in-transit').length, icon: FiTruck, color: 'text-cyan-400' },
        ].map((stat, i) => (
            <div key={i} className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/10 p-5 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                    <stat.icon className={`${stat.color} w-5 h-5`} />
                    <span className="text-2xl font-serif text-[#FBF6E9]">{stat.value}</span>
                </div>
                <p className="text-[9px] uppercase tracking-widest text-[#FBF6E9]/30 font-bold">{stat.label}</p>
            </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'pending', 'approved', 'in-transit', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all whitespace-nowrap ${filter === f ? 'bg-[#800000] border-[#800000] text-white shadow-xl' : 'border-amber-900/10 text-[#FBF6E9]/40 hover:bg-white/5'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Requests List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode='popLayout'>
            {filteredRequests.map((req, idx) => (
              <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                key={req.id} className="bg-[#1A0F0A]/40 backdrop-blur-md border border-amber-900/10 rounded-3xl p-8 relative overflow-hidden group">
                
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${statusMap[req.status]?.color?.replace('text', 'bg') || 'bg-amber-900/20'}`} />

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border ${statusMap[req.status]?.bg} ${statusMap[req.status]?.color}`}>
                        {statusMap[req.status]?.label || 'Status Unknown'}
                      </span>
                      <span className="text-amber-500/40 text-[10px] font-bold uppercase tracking-widest">ID: {req.orderId}</span>
                    </div>

                    <h3 className="text-2xl font-serif text-[#FBF6E9] mb-4">{req.productName || 'Heritage Attire'}</h3>
                    <p className="text-[#FBF6E9]/60 text-sm italic font-serif leading-relaxed line-clamp-2">" {req.reason} "</p>
                    
                    {/* Visual Progress Line */}
                    <div className="mt-8 flex items-center gap-2">
                        {['pending', 'approved', 'in-transit', 'completed'].map((step, i) => {
                            const steps = ['pending', 'approved', 'in-transit', 'completed'];
                            const currentIndex = steps.indexOf(req.status);
                            const stepIndex = steps.indexOf(step);
                            const isActive = stepIndex <= currentIndex;
                            
                            return (
                                <React.Fragment key={step}>
                                    <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isActive ? (statusMap[step]?.color?.replace('text', 'bg') || 'bg-amber-500') : 'bg-white/5'}`} />
                                    {i < 3 && <div className={`flex-1 h-0.5 rounded-full ${stepIndex < currentIndex ? (statusMap[steps[stepIndex]]?.color?.replace('text', 'bg') || 'bg-amber-500') : 'bg-white/5'}`} />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                    <div className="mt-4 flex justify-between text-[8px] uppercase tracking-widest font-bold text-[#FBF6E9]/20">
                        <span>Awaiting</span>
                        <span>Approved</span>
                        <span>Transit</span>
                        <span>Restored</span>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex flex-col gap-2 shrink-0 justify-center">
                        {req.status === 'pending' && (
                            <button onClick={() => handleUpdateStatus(req.id, 'approved')} className="flex items-center gap-2 px-5 py-3 bg-emerald-900/20 text-emerald-400 border border-emerald-900/30 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900/40">
                                <FiCheck /> Appraise & Approve
                            </button>
                        )}
                        {req.status === 'approved' && (
                            <button onClick={() => handleUpdateStatus(req.id, 'in-transit')} className="flex items-center gap-2 px-5 py-3 bg-cyan-900/20 text-cyan-400 border border-cyan-900/30 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-900/40">
                                <FiTruck /> Dispatch Retrieval
                            </button>
                        )}
                        {req.status === 'in-transit' && (
                            <button onClick={() => handleUpdateStatus(req.id, 'completed')} className="flex items-center gap-2 px-5 py-3 bg-[#800000] text-white border border-amber-900/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-800">
                                <FiBox /> Restore Heritage
                            </button>
                        )}
                        <button onClick={() => handleUpdateStatus(req.id, 'rejected')} className="text-red-500/40 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest border border-transparent hover:border-red-900/20 py-2 rounded-xl transition-all">
                            Deny Blessing
                        </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredRequests.length === 0 && (
            <div className="text-center py-24 bg-[#1A0F0A]/20 rounded-3xl border border-dashed border-amber-900/20">
              <FiRepeat className="w-16 h-16 text-amber-900/10 mx-auto mb-6" />
              <p className="text-amber-500/40 font-serif italic uppercase tracking-[0.3em]">No Heritage Missions in this state</p>
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-6">
            <div className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-3xl p-8">
                <h4 className="text-sm font-serif text-amber-500 mb-6 flex items-center gap-2">
                    <FiShield className="text-emerald-500" /> Sacred Guarantee
                </h4>
                <div className="space-y-4">
                    {[
                        { title: 'Ritual Purity', desc: 'Every exchanged item undergoes a purification check.' },
                        { title: 'Scale Accuracy', desc: 'Free exchanges for sizing discrepancies.' },
                        { title: 'Fiber Trust', desc: 'Immediate restoration for any weaving defects.' },
                    ].map((item, i) => (
                        <div key={i} className="group">
                            <h5 className="text-[10px] uppercase tracking-widest font-bold text-[#FBF6E9] mb-1 group-hover:text-amber-500 transition-colors">{item.title}</h5>
                            <p className="text-[11px] text-[#FBF6E9]/40 font-light leading-relaxed font-serif italic">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-amber-900/5 border border-amber-900/20 rounded-3xl p-8">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-amber-500 mb-4 flex items-center gap-2">
                    <FiInfo /> Restoration Protocol
                </h4>
                <ol className="space-y-4 text-[11px] text-[#FBF6E9]/40 font-serif leading-loose">
                    <li>1. Initiate request with Order ID and Detail</li>
                    <li>2. Our artisan elders appraise the report</li>
                    <li>3. Sacred retrieval is dispatched to your sanctum</li>
                    <li>4. Heritage piece is returned to the Atelier</li>
                    <li>5. Restoration/Exchange is fulfilled and blessed</li>
                </ol>
            </div>
        </div>
      </div>
    </Layout>
  );
}
