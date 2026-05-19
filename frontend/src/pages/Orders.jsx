import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../api';

export default function Orders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // In a real app we'd filter by user/device ID
    fetch('http://localhost:4000/api/orders?limit=10')
      .then(r => r.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('home.myOrders')}</h1>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-muted py-10">No past orders</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold text-accent">#{order.tokenNumber?.toString().padStart(3, '0')}</span>
                </div>
                <div className="text-sm font-mono text-muted">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-1 mb-4">
                {order.items.map(item => (
                  <div key={item.id} className="text-sm flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-mono text-muted">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-border pt-3">
                <div className={`text-sm flex items-center gap-1 font-semibold ${order.status === 'ready' ? 'text-green' : 'text-blue'}`}>
                  {order.status === 'ready' ? <CheckCircle2 size={16}/> : <Clock size={16}/>}
                  {order.status === 'ready' ? t('status.ready') : t('status.preparing')}
                </div>
                <div className="font-bold font-mono">Total: ₹{order.total}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
