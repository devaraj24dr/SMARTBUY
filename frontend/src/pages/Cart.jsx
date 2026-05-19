import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { api } from '../api';
import { ArrowLeft, CreditCard, ChevronRight } from 'lucide-react';

export default function Cart() {
  const { t, i18n } = useTranslation();
  const { cart, getCartTotal, clearCart } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold mb-4">{t('cart.empty')}</h2>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  const handlePay = async () => {
    setLoading(true);
    try {
      // Simulate Razorpay popup delay
      setTimeout(async () => {
        const orderData = {
          type: 'restaurant',
          tableNumber: 1, // hardcoded for demo
          items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, menuItemId: i.id })),
          total: total,
          paymentMethod: 'upi'
        };
        const order = await api.placeOrder(orderData);
        clearCart();
        navigate(`/success?id=${order.id}&token=${order.tokenNumber}`);
      }, 1500);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-bg2 rounded-full border border-border"><ArrowLeft size={20}/></button>
        <h1 className="text-2xl font-bold">{t('cart.title')}</h1>
      </div>

      <div className="card space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
            <div>
              <div className="font-semibold">{i18n.language === 'ta' && item.nameTa ? item.nameTa : item.name}</div>
              <div className="text-muted text-sm font-mono">₹{item.price} x {item.quantity}</div>
            </div>
            <div className="font-mono font-bold text-accent">₹{item.price * item.quantity}</div>
          </div>
        ))}
      </div>

      <div className="card space-y-3 font-mono text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>{t('cart.gst')}</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>
        <div className="h-px bg-border my-2"></div>
        <div className="flex justify-between text-lg font-bold text-white">
          <span>{t('cart.total')}</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-green/10 border border-green/30 rounded-xl p-4 text-sm text-green flex gap-3">
        <CreditCard className="shrink-0" />
        <p>This is a demo. Clicking Pay will simulate a successful UPI payment and generate a real token.</p>
      </div>

      <button 
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-accent text-white rounded-xl p-4 font-bold text-lg flex justify-between items-center"
      >
        <span>{loading ? 'Processing...' : t('cart.payNow')}</span>
        {!loading && <div className="flex items-center gap-2">₹{total.toFixed(2)} <ChevronRight size={20}/></div>}
      </button>
    </div>
  );
}
