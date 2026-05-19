import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, ShoppingBag, Utensils, LogOut, Plus, Trash2, Edit, X } from 'lucide-react';
import { api } from '../api';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login(email, password);
      if (res.token) {
        setToken(res.token);
        localStorage.setItem('adminToken', res.token);
      } else {
        alert(res.error || 'Login failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="card w-full max-w-sm space-y-4 animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-accent">Admin Login</h1>
            <p className="text-muted text-sm mt-1">admin@smartbuy.in / admin123</p>
          </div>
          <div>
            <label className="text-sm text-muted mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-bg3 border border-border p-3 rounded-lg focus:outline-none focus:border-accent" required />
          </div>
          <div>
            <label className="text-sm text-muted mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-bg3 border border-border p-3 rounded-lg focus:outline-none focus:border-accent" required />
          </div>
          <button type="submit" className="w-full btn-primary py-3">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg">
      <aside className="w-64 bg-bg2 border-r border-border p-6 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-accent mb-8">Admin</h2>
        
        <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === 'overview' ? 'text-white bg-bg3' : 'text-muted hover:text-white'}`}>
          <LayoutDashboard size={20}/> Overview
        </button>
        
        <button onClick={() => setActiveTab('menu')} className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === 'menu' ? 'text-white bg-bg3' : 'text-muted hover:text-white'}`}>
          <Utensils size={20}/> Menu Mgmt
        </button>
        
        <button onClick={() => setActiveTab('products')} className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === 'products' ? 'text-white bg-bg3' : 'text-muted hover:text-white'}`}>
          <ShoppingBag size={20}/> Product Mgmt
        </button>
        
        <div className="mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-400 p-3 rounded-lg w-full">
            <LogOut size={20}/> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'menu' && <MenuTab />}
        {activeTab === 'products' && <ProductTab />}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function OverviewTab() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getAdminStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  const mockChartData = [
    { name: '10 AM', sales: 400 },
    { name: '11 AM', sales: 3000 },
    { name: '12 PM', sales: 2000 },
    { name: '1 PM', sales: 5000 },
    { name: '2 PM', sales: 4500 },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-muted text-sm mb-1">Today's Revenue</div>
          <div className="text-3xl font-bold font-mono">₹{stats.todayRevenue}</div>
        </div>
        <div className="card">
          <div className="text-muted text-sm mb-1">Today's Orders</div>
          <div className="text-3xl font-bold font-mono">{stats.todayOrders}</div>
        </div>
        <div className="card">
          <div className="text-muted text-sm mb-1">Active Orders</div>
          <div className="text-3xl font-bold font-mono text-accent">{stats.activeOrders}</div>
        </div>
        <div className="card">
          <div className="text-muted text-sm mb-1">Avg Order Value</div>
          <div className="text-3xl font-bold font-mono">₹{stats.avgOrderValue}</div>
        </div>
      </div>
      <div className="card h-96">
        <h3 className="text-xl font-bold mb-6">Today's Sales Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockChartData}>
            <XAxis dataKey="name" stroke="#7070a0" />
            <YAxis stroke="#7070a0" />
            <Tooltip cursor={{fill: '#18182a'}} contentStyle={{backgroundColor: '#11111c', borderColor: '#22223a'}} />
            <Bar dataKey="sales" fill="#ff6b35" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MenuTab() {
  const [items, setItems] = useState([]);
  const [restId, setRestId] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: '', nameTa: '', description: '', price: '', category: '', emoji: '🍽️' });
  
  const fetchMenu = () => {
    api.getMenu('a2b').then(res => {
      setItems(res.items);
      if (res.restaurant) setRestId(res.restaurant.id);
    }).catch(console.error);
  };
  
  useEffect(() => { fetchMenu(); }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Delete this item?')) {
      await api.deleteMenuItem(id);
      fetchMenu();
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setForm({ name: item.name, nameTa: item.nameTa, description: item.description, price: item.price, category: item.category, emoji: item.emoji });
    } else {
      setEditingItem(null);
      setForm({ name: '', nameTa: '', description: '', price: '', category: 'Meals', emoji: '🍽️' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, restaurantId: restId };
    if (editingItem) {
      await api.updateMenuItem(editingItem.id, data);
    } else {
      await api.addMenuItem(data);
    }
    setModalOpen(false);
    fetchMenu();
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2"><Plus size={18}/> Add Item</button>
      </div>
      <div className="card overflow-hidden p-0">
        <table className="w-full text-left">
          <thead className="bg-bg3 border-b border-border text-muted text-sm font-mono">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-bg3/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-muted font-mono">{item.nameTa}</div>
                  </div>
                </td>
                <td className="p-4 text-sm">{item.category}</td>
                <td className="p-4 font-mono text-accent">₹{item.price}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openModal(item)} className="text-blue hover:text-white p-2"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-white p-2"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-bg2 border border-border p-6 rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'New Item'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted">Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" required /></div>
                <div><label className="text-sm text-muted">Tamil Name</label><input type="text" value={form.nameTa} onChange={e => setForm({...form, nameTa: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1"><label className="text-sm text-muted">Price (₹)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" required /></div>
                <div className="col-span-1"><label className="text-sm text-muted">Category</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" required /></div>
                <div className="col-span-1"><label className="text-sm text-muted">Emoji</label><input type="text" value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" /></div>
              </div>
              <div><label className="text-sm text-muted">Description</label><input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" /></div>
              <button type="submit" className="w-full btn-primary py-2 mt-4">{editingItem ? 'Save Changes' : 'Create Item'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductTab() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', category: '', barcode: '', stock: 100, emoji: '📦' });
  
  const fetchProducts = () => api.getProducts().then(setProducts).catch(console.error);
  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Delete this product?')) {
      await api.deleteProduct(id);
      fetchProducts();
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setForm({ name: item.name, price: item.price, category: item.category, barcode: item.barcode, stock: item.stock, emoji: item.emoji });
    } else {
      setEditingItem(null);
      setForm({ name: '', price: '', category: 'Grocery', barcode: '', stock: 100, emoji: '📦' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await api.updateProduct(editingItem.id, form);
    } else {
      await api.addProduct(form);
    }
    setModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2"><Plus size={18}/> Add Product</button>
      </div>
      <div className="card overflow-hidden p-0">
        <table className="w-full text-left">
          <thead className="bg-bg3 border-b border-border text-muted text-sm font-mono">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Barcode</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-bg3/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="font-semibold">{p.name}</div>
                </td>
                <td className="p-4 text-sm">{p.category}</td>
                <td className="p-4 font-mono text-xs text-muted">{p.barcode}</td>
                <td className="p-4 font-mono text-accent">₹{p.price}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openModal(p)} className="text-blue hover:text-white p-2"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-white p-2"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-bg2 border border-border p-6 rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-sm text-muted">Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted">Price (₹)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" required /></div>
                <div><label className="text-sm text-muted">Stock</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" required /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1"><label className="text-sm text-muted">Category</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" required /></div>
                <div className="col-span-1"><label className="text-sm text-muted">Barcode</label><input type="text" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" required /></div>
                <div className="col-span-1"><label className="text-sm text-muted">Emoji</label><input type="text" value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} className="w-full bg-bg3 border border-border p-2 rounded mt-1" /></div>
              </div>
              <button type="submit" className="w-full btn-primary py-2 mt-4">{editingItem ? 'Save Changes' : 'Create Product'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
