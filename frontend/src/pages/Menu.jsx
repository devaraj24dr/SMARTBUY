import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingBag, MapPin, Plus, Minus } from 'lucide-react';

export default function Menu() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState('All');
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');
  
  const { cart, addToCart, decrementCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/api/menu?restaurant=a2b')
      .then(res => res.json())
      .then(data => {
        setItems(data.items);
        const cats = ['All', ...new Set(data.items.map(i => i.category))];
        setCategories(cats);
      });
  }, []);

  const filteredItems = activeCat === 'All' 
    ? items 
    : items.filter(i => i.category === activeCat);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getQuantity = (id) => {
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="pb-24 animate-fade-in relative">
      {/* Table / Location Banner */}
      {tableNumber && (
        <div className="bg-accent/10 border border-accent/20 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 mb-6 flex items-center gap-3">
          <div className="bg-accent text-white p-2 rounded-full shadow-[0_0_15px_rgba(255,107,53,0.5)]">
            <MapPin size={16} />
          </div>
          <div>
            <div className="text-xs text-accent font-bold tracking-widest uppercase">Ordering For</div>
            <div className="text-sm font-bold">Table {tableNumber}</div>
          </div>
        </div>
      )}

      {/* Horizontal Categories */}
      <div className="flex overflow-x-auto gap-3 mb-6 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold transition-all ${
              activeCat === cat 
                ? 'bg-white text-black shadow-lg scale-105' 
                : 'bg-bg2 text-muted border border-border hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid (Zepto Style) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => {
          const qty = getQuantity(item.id);
          return (
            <div key={item.id} className="bg-bg2 border border-border rounded-2xl p-4 flex flex-col hover:border-accent/50 transition-colors shadow-lg">
              <div className="bg-bg rounded-xl h-32 flex items-center justify-center text-6xl mb-4 shadow-inner">
                {item.emoji}
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted font-bold mb-1">{item.category}</div>
                <h3 className="font-bold leading-tight mb-1 text-white/90">{item.name}</h3>
                {item.nameTa && <div className="text-xs text-muted/70 font-sora">{item.nameTa}</div>}
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="font-mono font-bold text-lg">₹{item.price}</div>
                
                {/* Dynamic Add Button */}
                {qty === 0 ? (
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-accent/10 text-accent font-bold px-4 py-2 rounded-lg border border-accent/20 hover:bg-accent hover:text-white transition-colors active:scale-95"
                  >
                    ADD
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-accent text-white px-2 py-1.5 rounded-lg font-bold shadow-[0_0_15px_rgba(255,107,53,0.3)]">
                    <button onClick={() => decrementCart(item.id)} className="p-1 active:scale-90"><Minus size={16}/></button>
                    <span className="w-4 text-center">{qty}</span>
                    <button onClick={() => addToCart(item)} className="p-1 active:scale-90"><Plus size={16}/></button>
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
              onClick={() => navigate(tableNumber ? `/cart?table=${tableNumber}` : '/cart')}
              className="w-full bg-accent text-white rounded-2xl p-4 flex justify-between items-center shadow-[0_10px_40px_rgba(255,107,53,0.4)] hover:shadow-[0_10px_50px_rgba(255,107,53,0.6)] transition-all transform hover:-translate-y-1 active:scale-95"
            >
              <div className="flex flex-col text-left">
                <div className="text-sm font-medium opacity-90">{cartCount} items</div>
                <div className="font-mono font-bold text-lg">₹{cartTotal}</div>
              </div>
              <div className="font-bold flex items-center gap-2 text-lg">
                View Cart <ShoppingBag size={20} />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
