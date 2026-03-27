import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiImage, FiPackage } from 'react-icons/fi';

const fabricTypes = ['Pure Silk', 'Handloom Cotton', 'Traditional Linen', 'Vedic Wool', 'Premium Chiffon', 'Temple Crepe'];
const categories = ['Saree', 'Vasti (Dhoti)', 'Madisar', 'Angavastram', 'Pavadai Sattai', 'Pancha Katcham', 'Temple Accessories'];

const emptyProduct = {
  productName: '', fabricType: 'Pure Silk', category: 'Saree', color: '',
  manufacturerName: '', price: '', stockQuantity: '', imageUrl: ''
};

export default function ProductManagement() {
  const { isAdmin, isMock } = useAuth();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    try {
      if (isMock) {
        const saved = localStorage.getItem('mock_products');
        if (saved) {
          setProducts(JSON.parse(saved));
          return;
        }
        throw new Error('No saved mock products');
      }
      const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      // Heritage Demo Data
      const demoData = [
        { id: '1', productName: 'Kanchipuram Pattu Saree', fabricType: 'Pure Silk', category: 'Saree', color: 'Kumkum Red & Gold', manufacturerName: 'Kanchi Heritage', price: 18500, stockQuantity: 12, imageUrl: '/assets/products/kanchipuram.png', name: 'Kanchipuram Pattu Saree', description: 'Exquisite hand-woven pure silk saree with gold zari border.' },
        { id: '2', productName: 'Pure White Vedic Vasti', fabricType: 'Handloom Cotton', category: 'Vasti (Dhoti)', color: 'Bleached White', manufacturerName: 'Coimbatore Handlooms', price: 1200, stockQuantity: 45, imageUrl: '/assets/products/vasti.png', name: 'Pure White Vedic Vasti', description: 'Traditional handloom cotton dhoti for daily puja and rituals.' },
        { id: '3', productName: 'Brahminical Madisar Saree', fabricType: 'Pure Silk', category: 'Madisar', color: 'Deep Maroon', manufacturerName: 'Kumbakonam Silks', price: 14200, stockQuantity: 8, imageUrl: '/assets/products/madisar.png', name: 'Brahminical Madisar Saree', description: 'Traditional 9-yard madisar drape for sacred ceremonies.' },
        { id: '4', productName: 'Sacred Angavastram Set', fabricType: 'Handloom Cotton', category: 'Angavastram', color: 'Ivory & Gold', manufacturerName: 'Heritage Weaves', price: 2500, stockQuantity: 30, imageUrl: '/assets/products/angavastram.png', name: 'Sacred Angavastram Set', description: 'Ivory cotton shawl with gold border for temple visits.' },
        { id: '5', productName: 'Banarasi Silk Saree', fabricType: 'Banarasi Silk', category: 'Saree', color: 'Royal Blue & Gold', manufacturerName: 'Varanasi Looms', price: 22000, stockQuantity: 6, imageUrl: '/assets/products/banarasi.png', name: 'Banarasi Silk Saree', description: 'Opulent Banarasi silk with brocade golden motifs.' },
        { id: '6', productName: 'Dhoti with Silk Border', fabricType: 'Cotton-Silk', category: 'Vasti (Dhoti)', color: 'White & Gold', manufacturerName: 'Salem Handlooms', price: 1850, stockQuantity: 25, imageUrl: '/assets/products/dhoti_border.png', name: 'Dhoti with Silk Border', description: 'Fine cotton dhoti with a vibrant silk accent border.' },
        { id: '7', productName: 'Cotton Saree Half Silk', fabricType: 'Cotton-Silk', category: 'Saree', color: 'Peacock Green', manufacturerName: 'Gadwal Weavers', price: 4500, stockQuantity: 18, imageUrl: '/assets/products/kanchipuram.png', name: 'Cotton Saree Half Silk', description: 'Lightweight saree for everyday wear with temple motifs.' },
        { id: '8', productName: 'Pure Cotton Vasti', fabricType: 'Handloom Cotton', category: 'Vasti (Dhoti)', color: 'Natural White', manufacturerName: 'Erode Handlooms', price: 950, stockQuantity: 60, imageUrl: '/assets/products/vasti.png', name: 'Pure Cotton Vasti', description: 'Everyday unbleached cotton dhoti for puja rituals.' },
      ];
      setProducts(demoData);
      if (isMock) localStorage.setItem('mock_products', JSON.stringify(demoData));
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function openAdd() {
    setForm(emptyProduct);
    setEditingId(null);
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  }

  function fillSample() {
    setForm({
      productName: 'Premium Banarasi Silk Saree',
      fabricType: 'Pure Silk',
      category: 'Saree',
      color: 'Sacred Gold & Crimson',
      manufacturerName: 'Varanasi Heritage Weavers',
      price: '24500',
      stockQuantity: '15',
      imageUrl: ''
    });
  }

  function openEdit(product) {
    setForm(product);
    setEditingId(product.id);
    setImagePreview(product.imageUrl || '');
    setImageFile(null);
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isMock) {
        // Mock save logic
        const newProduct = {
          ...form,
          name: form.productName, // For User View compatibility
          description: `${form.fabricType} - ${form.color}`, // For User View
          id: editingId || Date.now().toString(),
          price: Number(form.price),
          stockQuantity: Number(form.stockQuantity),
          imageUrl: imagePreview || form.imageUrl,
          updatedAt: new Date().toISOString(),
        };
        if (editingId) {
          const updatedList = products.map(p => p.id === editingId ? newProduct : p);
          setProducts(updatedList);
          localStorage.setItem('mock_products', JSON.stringify(updatedList));
          localStorage.setItem('mock_products_version', 'v2_saree_dhoti');
        } else {
          newProduct.createdAt = new Date().toISOString();
          const updatedList = [newProduct, ...products];
          setProducts(updatedList);
          localStorage.setItem('mock_products', JSON.stringify(updatedList));
          localStorage.setItem('mock_products_version', 'v2_saree_dhoti');
        }
        setShowModal(false);
      } else {
        let imageUrl = form.imageUrl;
        if (imageFile) {
          const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
          const snap = await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(snap.ref);
        }

        const data = {
          ...form,
          price: Number(form.price),
          stockQuantity: Number(form.stockQuantity),
          imageUrl,
          updatedAt: new Date().toISOString(),
        };

        if (editingId) {
          await updateDoc(doc(db, 'products', editingId), data);
        } else {
          data.createdAt = new Date().toISOString();
          const docRef = await addDoc(collection(db, 'products'), data);
          // NEW: Log Initial Price
          await addDoc(collection(db, 'price_history'), {
            productId: docRef.id,
            productName: data.productName,
            manufacturerName: data.manufacturerName,
            price: data.price,
            date: new Date().toISOString()
          });
        }
        
        // NEW: Always log price change on edit
        if (editingId) {
          await addDoc(collection(db, 'price_history'), {
            productId: editingId,
            productName: data.productName,
            manufacturerName: data.manufacturerName,
            price: data.price,
            date: new Date().toISOString()
          });
        }
        setShowModal(false);
        fetchProducts();
      }
    } catch {
      setShowModal(false);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      if (!isMock) await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  }

  const filtered = products.filter(p => {
    const matchSearch = p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manufacturerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif text-[#FBF6E9]">Heritage Collection</h1>
          <p className="text-[#FBF6E9]/40 text-[10px] items-center gap-2 uppercase tracking-widest font-bold mt-1">Manage sacred attire inventory</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} id="add-product-btn"
            className="flex items-center gap-2 px-6 py-3 bg-[#800000] hover:bg-[#A00000] text-[#FBF6E9] font-medium rounded-xl shadow-lg shadow-black/20 transition-all border border-amber-900/10">
            <FiPlus /> Add New Attire
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#1A0F0A]/40 border border-amber-900/20 rounded-xl text-[#FBF6E9] placeholder-amber-500/30 font-serif focus:outline-none focus:ring-2 focus:ring-[#800000]/50 transition-all"
            placeholder="Search our heritage..." />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-[#1A0F0A]/40 border border-amber-900/20 rounded-xl text-[#FBF6E9] focus:outline-none focus:ring-2 focus:ring-[#800000]/50 font-serif">
          <option value="All" className="bg-[#1A0F0A]">All Sacred Attire</option>
          {categories.map(c => <option key={c} value={c} className="bg-[#1A0F0A]">{c}</option>)}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(product => (
          <div key={product.id} className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-2xl overflow-hidden hover:bg-amber-900/10 transition-all duration-300 group">
            <div className="aspect-[4/5] bg-[#1A0F0A] flex items-center justify-center relative overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="text-center">
                  <FiImage className="w-16 h-16 text-amber-900/20 mx-auto" />
                  <p className="text-[10px] text-amber-900/40 mt-3 uppercase tracking-widest font-bold font-serif italic">Sanctity Placeholder</p>
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {isAdmin && (
                  <>
                    <button onClick={() => openEdit(product)}
                      className="p-2.5 bg-[#FBF6E9] rounded-xl text-[#800000] hover:bg-[#800000] hover:text-[#FBF6E9] transition-all shadow-xl">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)}
                      className="p-2.5 bg-rose-900/80 rounded-xl text-[#FBF6E9] hover:bg-rose-700 transition-all shadow-xl">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <span className="absolute bottom-4 left-4 px-3 py-1 bg-[#800000]/80 backdrop-blur-md border border-amber-500/30 rounded-lg text-[9px] text-[#FBF6E9] font-bold uppercase tracking-widest">
                {product.fabricType}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl text-[#FBF6E9] truncate tracking-wide">{product.productName}</h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[#FBF6E9]/40 text-xs uppercase tracking-tighter">{product.category} • {product.color}</p>
              </div>
              <p className="text-[10px] text-amber-500/50 mt-1 uppercase tracking-widest font-bold">BY {product.manufacturerName}</p>
              
              <div className="flex items-center justify-between mt-6 border-t border-amber-900/10 pt-4">
                <span className="text-2xl font-serif text-amber-400">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                <span className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-bold uppercase tracking-tighter ${product.stockQuantity < 10 ? 'bg-rose-900/10 border-rose-900/30 text-rose-400' : 'bg-emerald-900/10 border-emerald-900/30 text-emerald-400'}`}>
                  Stock: {product.stockQuantity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 bg-[#1A0F0A]/20 rounded-3xl border border-dashed border-amber-900/20 mt-10">
          <FiPackage className="w-16 h-16 text-amber-900/20 mx-auto mb-4" />
          <p className="text-amber-500/40 font-serif italic uppercase tracking-widest">No heritage pieces found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0A0503]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-[#1A0F0A] border border-amber-900/20 rounded-3xl w-full max-w-lg my-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-amber-900/10">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-serif text-[#FBF6E9]">{editingId ? 'Edit Heritage Piece' : 'Add New Attire'}</h2>
                {!editingId && (
                  <button type="button" onClick={fillSample}
                    className="text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 bg-amber-900/20 text-amber-500 rounded-lg hover:bg-amber-900/40 transition-all border border-amber-900/20">
                    Fill Sample
                  </button>
                )}
              </div>
              <button onClick={() => setShowModal(false)} className="text-amber-500/40 hover:text-[#FBF6E9] transition-colors"><FiX className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-1.5">Product Name</label>
                <input name="productName" value={form.productName} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif placeholder-amber-500/20 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                  placeholder="Enter piece name..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-1.5">Fabric</label>
                  <select name="fabricType" value={form.fabricType} onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif focus:outline-none focus:ring-1 focus:ring-[#800000]">
                    {fabricTypes.map(f => <option key={f} value={f} className="bg-[#1A0F0A]">{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-1.5">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif focus:outline-none focus:ring-1 focus:ring-[#800000]">
                    {categories.map(c => <option key={c} value={c} className="bg-[#1A0F0A]">{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-1.5">Color</label>
                  <input name="color" value={form.color} onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif placeholder-amber-500/20 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    placeholder="e.g. Saffron" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-1.5">Manufacturer</label>
                  <input name="manufacturerName" value={form.manufacturerName} onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif placeholder-amber-500/20 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    placeholder="Atelier name..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-1.5">Price (₹)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif placeholder-amber-500/20 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    placeholder="0" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-1.5">Sanctity Stock</label>
                  <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif placeholder-amber-500/20 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-1.5">Attire Showcase</label>
                <div className="border border-dashed border-amber-900/20 rounded-2xl p-6 text-center hover:bg-white/5 transition-all cursor-pointer group"
                  onClick={() => document.getElementById('product-image-input').click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-40 mx-auto rounded-xl object-cover shadow-2xl" />
                  ) : (
                    <div>
                      <FiImage className="w-10 h-10 text-amber-900/20 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-xs text-amber-500/40 uppercase tracking-widest font-bold">Upload Showcase Image</p>
                    </div>
                  )}
                  <input id="product-image-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-[#800000] hover:bg-[#A00000] text-[#FBF6E9] font-serif text-lg rounded-2xl shadow-xl transition-all disabled:opacity-50 mt-4 border border-amber-900/10">
                {loading ? 'Sanctifying...' : editingId ? 'Update Heritage Piece' : 'Add to Collection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
