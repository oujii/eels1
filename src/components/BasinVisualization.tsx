'use client';

import { useState } from 'react';
import Image from 'next/image';

const BasinVisualization = () => {
  const [cranePosition, setCranePosition] = useState({ x: 50, y: 50 });
  const [isFeeding, setIsFeeding] = useState(false);

  const moveCrane = (direction: 'up' | 'down' | 'left' | 'right') => {
    setCranePosition(prev => {
      const step = 5;
      switch (direction) {
        case 'up':
          return { ...prev, y: Math.max(0, prev.y - step) };
        case 'down':
          return { ...prev, y: Math.min(100, prev.y + step) };
        case 'left':
          return { ...prev, x: Math.max(0, prev.x - step) };
        case 'right':
          return { ...prev, x: Math.min(100, prev.x + step) };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="glass rounded-2xl overflow-hidden glow-border h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-accent glow">Bassäng Visualisering</h2>
        <p className="text-secondary">Huvudbassäng - Sektor A</p>
      </div>

      {/* Bassäng område */}
      <div className="relative h-196">
        {/* Bakgrundsbild */}
        <div className="absolute inset-0">
          <Image
            src="/basins.png"
            alt="Eel Basin"
            fill
            className="object-cover"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

        {/* Kran position */}
        <div 
          className="absolute w-8 h-8 transition-all duration-500 ease-out"
          style={{ 
            left: `${cranePosition.x}%`, 
            top: `${cranePosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            {/* Kran ikon */}
            <div className={`w-8 h-8 rounded-full bg-accent border-2 border-white shadow-lg ${
              isFeeding ? 'animate-bounce' : 'pulse'
            }`}>
              <svg className="w-full h-full p-1 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            {/* Matning effekt */}
            {isFeeding && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-warning rounded-full animate-ping"
                    style={{ 
                      animationDelay: `${i * 0.2}s`,
                      marginTop: `${i * 4}px`
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sensorer */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-success rounded-full pulse"></div>
            <span className="text-sm text-white">Sensor 1: Aktiv</span>
          </div>
          <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-warning rounded-full pulse"></div>
            <span className="text-sm text-white">Sensor 2: Varning</span>
          </div>
        </div>

        {/* Vattenflöde indikatorer */}
        <div className="absolute bottom-4 right-4 space-y-2">
          <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-white">Flöde: 2.4 L/s</span>
          </div>
        </div>
      </div>

      {/* Kontrollpanel */}
      <div className="p-6 border-t border-border">
        <div className="grid grid-cols-2 gap-6">
          {/* Kran kontroller */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
              </svg>
              Kran Kontroll
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <button 
                onClick={() => moveCrane('up')}
                className="touch-target bg-gradient-to-br from-accent/20 to-secondary/20 hover:from-accent/30 hover:to-secondary/30 border border-accent rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <div></div>
              
              <button 
                onClick={() => moveCrane('left')}
                className="touch-target bg-gradient-to-br from-accent/20 to-secondary/20 hover:from-accent/30 hover:to-secondary/30 border border-accent rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={() => setIsFeeding(!isFeeding)}
                className={`touch-target rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center font-semibold ${
                  isFeeding 
                    ? 'bg-gradient-to-br from-warning to-orange-600 text-white glow-border' 
                    : 'bg-gradient-to-br from-accent/20 to-secondary/20 border border-accent text-accent'
                }`}
              >
                {isFeeding ? 'STOPP' : 'MATA'}
              </button>
              
              <button 
                onClick={() => moveCrane('right')}
                className="touch-target bg-gradient-to-br from-accent/20 to-secondary/20 hover:from-accent/30 hover:to-secondary/30 border border-accent rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div></div>
              <button 
                onClick={() => moveCrane('down')}
                className="touch-target bg-gradient-to-br from-accent/20 to-secondary/20 hover:from-accent/30 hover:to-secondary/30 border border-accent rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div></div>
            </div>
          </div>

          {/* Status information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Position & Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary">X-Position:</span>
                <span className="font-mono text-accent">{cranePosition.x.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Y-Position:</span>
                <span className="font-mono text-accent">{cranePosition.y.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Status:</span>
                <span className={`font-semibold ${
                  isFeeding ? 'text-warning' : 'text-success'
                }`}>
                  {isFeeding ? 'MATAR' : 'STANDBY'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasinVisualization;