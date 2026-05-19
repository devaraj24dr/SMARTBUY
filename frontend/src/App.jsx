import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Utensils, ShoppingCart, MonitorSmartphone, History } from 'lucide-react';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Success from './pages/Success';
import Orders from './pages/Orders';
import Supermarket from './pages/Supermarket';
import Kitchen from './pages/Kitchen';
import TokenDisplay from './pages/TokenDisplay';
import Admin from './pages/Admin';

function Layout({ children }) {
  const { i18n } = useTranslation();

  const toggleLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('smartorder_lang', lang);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-bg2 border-b border-border p-4 sticky top-0 z-50 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-accent">Smart<span className="text-white">Buy</span></Link>
        <div className="flex gap-2">
          <button 
            onClick={() => toggleLang('en')}
            className={`px-3 py-1 rounded text-sm font-mono ${i18n.language === 'en' ? 'bg-accent text-white' : 'bg-bg3 text-muted'}`}
          >
            EN
          </button>
          <button 
            onClick={() => toggleLang('ta')}
            className={`px-3 py-1 rounded text-sm font-mono ${i18n.language === 'ta' ? 'bg-accent text-white' : 'bg-bg3 text-muted'}`}
          >
            தமிழ்
          </button>
        </div>
      </header>
      <main className="p-4 max-w-lg mx-auto">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/token-display" element={<TokenDisplay />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/supermarket" element={<Supermarket />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/success" element={<Success />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
