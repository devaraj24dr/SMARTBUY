import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingBag, Search, Plus, Minus, Timer } from 'lucide-react';

export default function Supermarket() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { cart, addToCart, decrementCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(r => r.json())
      .then(data => setProducts(data));
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm)
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getQuantity = (id) => {
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="pb-24 animate-fade-in relative">
      {/* Zepto style header with ETA */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-sora">InstaMart</h1>
          <div className="text-green font-bold flex items-center gap-1 mt-1 text-sm bg-green/10 text-green w-fit px-3 py-1 rounded-full border border-green/20">
            <Timer size={14} /> Delivery in 10 mins
          </div>
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <input 
          type="text" 
          placeholder="Search for groceries, barcodes..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-bg2 border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-all text-white font-medium shadow-lg"
        />
        <Search className="absolute left-4 top-4 text-muted" size={24} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(p => {
          const qty = getQuantity(p.id);
          return (
            <div key={p.id} className="bg-bg2 border border-border rounded-2xl p-4 flex flex-col hover:border-green/50 transition-colors shadow-lg">
              <div className="bg-white/5 rounded-xl h-32 flex items-center justify-center text-6xl mb-4 shadow-inner relative">
                {p.emoji}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] font-mono px-2 py-0.5 rounded text-white/80 border border-white/10">
                  {p.barcode}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted font-bold mb-1">{p.category}</div>
                <h3 className="font-bold leading-tight mb-1 text-white/90">{p.name}</h3>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="font-mono font-bold text-lg">₹{p.price}</div>
                
                {/* Dynamic Add Button (Green Theme) */}
                {qty === 0 ? (
                  <button 
                    onClick={() => addToCart(p)}
                    className="bg-green/10 text-green font-bold px-4 py-2 rounded-lg border border-green/20 hover:bg-green hover:text-black transition-colors active:scale-95"
                  >
                    ADD
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-green text-black px-2 py-1.5 rounded-lg font-bold shadow-[0_0_15px_rgba(46,204,113,0.3)]">
                    <button onClick={() => decrementCart(p.id)} className="p-1 active:scale-90"><Minus size={16}/></button>
                    <span className="w-4 text-center">{qty}</span>
                    <button onClick={() => addToCart(p)} className="p-1 active:scale-90"><Plus size={16}/></button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Sticky Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 animate-fade-in pointer-events-none">
          <div className="max-w-lg mx-auto pointer-events-auto">
            <button 
              onClick={() => navigate('/cart')}
              className="w-full bg-green text-black rounded-2xl p-4 flex justify-between items-center shadow-[0_10px_40px_rgba(46,204,113,0.3)] hover:shadow-[0_10px_50px_rgba(46,204,113,0.5)] transition-all transform hover:-translate-y-1 active:scale-95"
            >
              <div className="flex flex-col text-left">
                <div className="text-sm font-bold opacity-80">{cartCount} items</div>
                <div className="font-mono font-bold text-lg">₹{cartTotal}</div>
              </div>
              <div className="font-bold flex items-center gap-2 text-lg">
                Checkout <ShoppingBag size={20} />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
