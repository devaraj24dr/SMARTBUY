import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Utensils, History, ScanLine, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="pb-24 animate-fade-in relative min-h-screen flex flex-col">
      {/* Search & Header */}
      <div className="mb-6 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-purple/20 blur-3xl -z-10 rounded-full h-32"></div>
        <h1 className="text-4xl font-bold font-sora leading-tight mb-6">
          What are you<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent2">craving today?</span>
        </h1>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for restaurants, items, groceries..." 
            className="w-full bg-bg2 border-2 border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-accent transition-colors text-white font-medium shadow-lg"
          />
          <Search className="absolute left-4 top-4 text-muted" size={24} />
        </div>
      </div>

      {/* Primary QR Action - Amazon / Zepto entry point */}
      <div className="mb-8 relative overflow-hidden rounded-3xl border border-accent/30 bg-accent/10 p-6 flex items-center justify-between shadow-[0_0_40px_rgba(255,107,53,0.15)] group cursor-pointer hover:bg-accent/20 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-accent mb-1">Scan Table QR</h2>
          <p className="text-sm text-white/70">Order food directly to your table</p>
        </div>
        <div className="bg-accent text-white p-4 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
          <ScanLine size={32} />
        </div>
        <Link to="/menu?table=5" className="absolute inset-0"></Link>
      </div>

      <h2 className="text-lg font-bold mb-4 text-white/90">Explore Categories</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Food Delivery */}
        <Link to="/menu" className="card relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Utensils size={100} className="text-accent" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
            <Utensils size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">{t('home.orderFood')}</h3>
          <p className="text-xs text-muted">A2B Restaurant</p>
        </Link>

        {/* Supermarket (Zepto vibe) */}
        <Link to="/supermarket" className="card relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingCart size={100} className="text-green" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-green/20 text-green flex items-center justify-center mb-4">
            <ShoppingCart size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">{t('home.supermarket')}</h3>
          <p className="text-xs text-muted">10-min grocery delivery</p>
        </Link>
      </div>

      <div className="mt-4">
        <Link to="/orders" className="card flex items-center gap-4 hover:border-purple/50">
          <div className="w-12 h-12 rounded-xl bg-purple/20 text-purple flex items-center justify-center">
            <History size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{t('home.myOrders')}</h3>
            <p className="text-xs text-muted">Track live status</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
