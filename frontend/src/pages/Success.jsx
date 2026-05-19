import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, Check } from 'lucide-react';
import { io } from 'socket.io-client';

export default function Success() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const tokenNumber = searchParams.get('token');
  const [status, setStatus] = useState('received');

  useEffect(() => {
    // Connect to WebSocket
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');
    
    socket.on('connect', () => {
      socket.emit('join_order_room', orderId);
    });

    socket.on('order_status_update', (data) => {
      if (data.orderId.toString() === orderId) {
        setStatus(data.status);
      }
    });

    return () => socket.disconnect();
  }, [orderId]);

  const steps = [
    { id: 'received', label: t('status.received') },
    { id: 'preparing', label: t('status.preparing') },
    { id: 'ready', label: t('status.ready') }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in space-y-8">
      <div className="w-24 h-24 bg-green/20 rounded-full flex items-center justify-center animate-bounce-short">
        <CheckCircle2 size={48} className="text-green" />
      </div>
      
      <div>
        <h1 className="text-2xl font-bold mb-2">Order Successful!</h1>
        <p className="text-muted">Your Token Number is</p>
      </div>

      <div className="text-7xl font-mono font-bold text-accent tracking-widest bg-bg2 border-2 border-accent/30 py-6 px-12 rounded-3xl shadow-[0_0_40px_rgba(255,107,53,0.15)]">
        {tokenNumber?.padStart(3, '0')}
      </div>

      <div className="w-full card mt-8 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-border">
          <div 
            className="h-full bg-green transition-all duration-1000" 
            style={{ width: `${(currentStepIndex / 2) * 100}%` }}
          />
        </div>
        
        <div className="space-y-6 mt-2 text-left relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted ? 'bg-green border-green text-black' : 'bg-bg3 border-border text-muted'
                }`}>
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : <Clock size={16} />}
                </div>
                <div className={`font-semibold ${isCurrent ? 'text-white' : isCompleted ? 'text-green' : 'text-muted'}`}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Link to="/" className="text-muted mt-8 block hover:text-white underline decoration-muted underline-offset-4">
        Back to Home
      </Link>
    </div>
  );
}
