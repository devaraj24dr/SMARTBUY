import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Kitchen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    // Fetch initial live orders
    fetch(`${API_URL}/api/orders/live`)
      .then(r => r.json())
      .then(data => setOrders(data));

    const socket = io(API_URL);
    socket.on('connect', () => socket.emit('join_kitchen'));
    
    socket.on('new_order', (order) => {
      // Add to list, make sure it has a ping sound or something in a real app
      setOrders(prev => [...prev, order]);
    });

    socket.on('order_updated', (updatedOrder) => {
      setOrders(prev => {
        if (updatedOrder.status === 'ready') {
          return prev.filter(o => o.id !== updatedOrder.id);
        }
        return prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
      });
    });

    return () => socket.disconnect();
  }, []);

  const updateStatus = (id, status) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    fetch(`${API_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-mono">👨‍🍳 KITCHEN DISPLAY</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-accent"></span> New</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue"></span> Preparing</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 content-start">
        {orders.map(order => (
          <div key={order.id} className={`rounded-xl border-2 flex flex-col ${order.status === 'received' ? 'border-accent bg-accent/5' : 'border-blue bg-blue/5'}`}>
            <div className={`p-4 border-b-2 flex justify-between items-center ${order.status === 'received' ? 'border-accent/30' : 'border-blue/30'}`}>
              <div className="text-4xl font-mono font-bold">#{order.tokenNumber}</div>
              <div className="text-right">
                <div className="text-muted text-sm font-mono">
                  Ordered: {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="font-bold text-sm mt-1">
                  Table {order.tableNumber || 'Takeaway'}
                </div>
                {order.status === 'preparing' && (
                  <div className="text-blue font-bold text-sm animate-pulse mt-1">
                    Preparing...
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 flex-1">
              <ul className="space-y-3 font-mono text-lg">
                {order.items.map(item => (
                  <li key={item.id} className="flex gap-3">
                    <span className="font-bold text-white">{item.quantity}x</span>
                    <span className="text-muted">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4">
              {order.status === 'received' ? (
                <button onClick={() => updateStatus(order.id, 'preparing')} className="w-full bg-blue text-white py-4 rounded-lg font-bold text-xl uppercase tracking-wider active:scale-95 transition-transform">
                  Start Preparing
                </button>
              ) : (
                <button onClick={() => updateStatus(order.id, 'ready')} className="w-full bg-green text-black py-4 rounded-lg font-bold text-xl uppercase tracking-wider active:scale-95 transition-transform shadow-[0_0_15px_rgba(46,204,113,0.3)]">
                  Mark Ready ✓
                </button>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="col-span-full flex items-center justify-center h-64 text-muted text-xl border-2 border-dashed border-border rounded-xl">
            No active orders. Waiting...
          </div>
        )}
      </div>
    </div>
  );
}
