import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function TokenDisplay() {
  const [readyTokens, setReadyTokens] = useState([]);
  const [preparingTokens, setPreparingTokens] = useState([]);

  useEffect(() => {
    // Initial fetch of live orders
    fetch('http://localhost:4000/api/orders/live')
      .then(r => r.json())
      .then(data => {
        setReadyTokens(data.filter(o => o.status === 'ready').map(o => o.tokenNumber));
        setPreparingTokens(data.filter(o => o.status === 'preparing').map(o => o.tokenNumber));
      });

    const socket = io('http://localhost:4000');
    socket.on('connect', () => socket.emit('join_token_display'));

    socket.on('token_called', (data) => {
      // Play ding sound
      try {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play().catch(e => console.log('Audio blocked', e));
      } catch(e) {}
      
      setReadyTokens(prev => [data.tokenNumber, ...prev].slice(0, 8)); // keep last 8
      setPreparingTokens(prev => prev.filter(t => t !== data.tokenNumber));
    });

    socket.on('order_updated', (order) => {
      if (order.status === 'preparing') {
        setPreparingTokens(prev => {
          if (!prev.includes(order.tokenNumber)) return [...prev, order.tokenNumber];
          return prev;
        });
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col p-8">
      <header className="text-center mb-8 pb-8 border-b border-white/10">
        <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-widest text-accent">TOKEN DISPLAY</h1>
      </header>

      <div className="flex-1 flex gap-8">
        {/* Ready to Collect Section */}
        <div className="flex-1 border-4 border-green rounded-3xl overflow-hidden flex flex-col bg-green/5">
          <div className="bg-green text-black p-6 text-center">
            <h2 className="text-4xl font-bold uppercase tracking-widest">Ready to Collect</h2>
            <h3 className="text-xl opacity-80 uppercase mt-1">எடுக்க தயார்</h3>
          </div>
          <div className="flex-1 p-8 content-start grid grid-cols-2 gap-8">
            {readyTokens.length === 0 ? (
              <div className="col-span-2 text-center text-green/40 text-4xl mt-20">- - -</div>
            ) : (
              readyTokens.map((token, i) => (
                <div key={i} className={`text-center font-mono font-bold rounded-2xl border-4 flex items-center justify-center p-8 
                  ${i === 0 ? 'text-8xl lg:text-9xl border-green text-green shadow-[0_0_50px_rgba(46,204,113,0.4)] animate-pulse' : 'text-6xl lg:text-7xl border-green/30 text-green/80'}`}>
                  {token.toString().padStart(3, '0')}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Preparing Section */}
        <div className="flex-1 border-4 border-border rounded-3xl overflow-hidden flex flex-col bg-bg2">
          <div className="bg-bg3 text-white p-6 text-center border-b-4 border-border">
            <h2 className="text-3xl font-bold uppercase tracking-widest">Preparing</h2>
            <h3 className="text-xl opacity-60 uppercase mt-1">தயாராகிறது</h3>
          </div>
          <div className="flex-1 p-8 flex flex-wrap gap-6 content-start">
            {preparingTokens.length === 0 ? (
              <div className="w-full text-center text-white/20 text-3xl mt-20">- - -</div>
            ) : (
              preparingTokens.map((token, i) => (
                <div key={i} className="bg-bg3 border-2 border-border text-white text-5xl font-mono font-bold py-6 px-10 rounded-2xl">
                  {token.toString().padStart(3, '0')}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
