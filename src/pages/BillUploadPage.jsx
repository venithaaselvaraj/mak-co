import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FiUpload, FiFile, FiCalendar, FiDollarSign, FiUser, FiPackage } from 'react-icons/fi';

export default function BillUploadPage() {
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({
    manufacturerName: '', productName: '', purchasePrice: '', purchaseDate: '', notes: ''
  });
  const [billFile, setBillFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchBills(); }, []);

  async function fetchBills() {
    try {
      const snap = await getDocs(query(collection(db, 'bills'), orderBy('purchaseDate', 'desc')));
      setBills(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      setBills([
        { id: '1', manufacturerName: 'Kanchi Silks', productName: 'Pure Silk Saree', purchasePrice: 1500, purchaseDate: '2025-03-15', fileUrl: '', fileName: 'invoice_001.pdf' },
        { id: '2', manufacturerName: 'Raymond Textiles', productName: 'Cotton Shirt Fabric', purchasePrice: 800, purchaseDate: '2025-03-10', fileUrl: '', fileName: 'bill_raymond.pdf' },
        { id: '3', manufacturerName: 'Banarasi Hub', productName: 'Banarasi Silk Saree', purchasePrice: 2200, purchaseDate: '2025-03-08', fileUrl: '', fileName: 'banarasi_bill.jpg' },
        { id: '4', manufacturerName: 'Linen Club', productName: 'Premium Linen Fabric', purchasePrice: 1100, purchaseDate: '2025-03-01', fileUrl: '', fileName: 'linen_receipt.pdf' },
      ]);
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let fileUrl = '', fileName = '';
      if (billFile) {
        const storageRef = ref(storage, `bills/${Date.now()}_${billFile.name}`);
        const snap = await uploadBytes(storageRef, billFile);
        fileUrl = await getDownloadURL(snap.ref);
        fileName = billFile.name;
      }
      await addDoc(collection(db, 'bills'), {
        ...form,
        purchasePrice: Number(form.purchasePrice),
        fileUrl,
        fileName,
        createdAt: new Date().toISOString(),
      });
      setForm({ manufacturerName: '', productName: '', purchasePrice: '', purchaseDate: '', notes: '' });
      setBillFile(null);
      setShowForm(false);
      fetchBills();
    } catch {
      setShowForm(false);
    }
    setLoading(false);
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bill Upload</h1>
          <p className="text-slate-400 text-sm mt-1">Upload and manage manufacturer purchase bills</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium rounded-xl shadow-lg shadow-amber-500/25 transition-all">
          <FiUpload /> Upload Bill
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upload New Bill</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Manufacturer Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="manufacturerName" value={form.manufacturerName} onChange={handleChange} required
                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="e.g. Kanchi Silks" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Product Name</label>
                <div className="relative">
                  <FiPackage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="productName" value={form.productName} onChange={handleChange} required
                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="e.g. Silk Saree" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Purchase Price (₹)</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="purchasePrice" type="number" value={form.purchasePrice} onChange={handleChange} required
                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Purchase Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleChange} required
                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Bill File (PDF or Image)</label>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-amber-400/30 transition-colors cursor-pointer"
                onClick={() => document.getElementById('bill-file-input').click()}>
                {billFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiFile className="text-amber-400" />
                    <span className="text-slate-300 text-sm">{billFile.name}</span>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Click to upload bill (PDF, JPG, PNG)</p>
                  </div>
                )}
                <input id="bill-file-input" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setBillFile(e.target.files[0])} className="hidden" />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium rounded-xl transition-all disabled:opacity-50">
                {loading ? 'Uploading...' : 'Upload Bill'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bills List */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-slate-400">Manufacturer</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Product</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Price</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Date</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Bill File</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="p-4 text-white font-medium">{bill.manufacturerName}</td>
                  <td className="p-4 text-slate-300">{bill.productName}</td>
                  <td className="p-4 text-amber-400 font-semibold">₹{Number(bill.purchasePrice).toLocaleString()}</td>
                  <td className="p-4 text-slate-400">{bill.purchaseDate}</td>
                  <td className="p-4">
                    {bill.fileUrl ? (
                      <a href={bill.fileUrl} target="_blank" rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1">
                        <FiFile /> {bill.fileName}
                      </a>
                    ) : (
                      <span className="text-slate-500 text-sm flex items-center gap-1"><FiFile /> {bill.fileName || 'No file'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {bills.length === 0 && (
          <div className="text-center py-12">
            <FiUpload className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No bills uploaded yet</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
