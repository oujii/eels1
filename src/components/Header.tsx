'use client';

import { useState, useEffect } from 'react';

const Header = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo och titel */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
            <span className="text-2xl font-bold text-white">Å</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold glow text-accent">
              ÅlControl Pro 2025
            </h1>
            <p className="text-sm text-secondary">
              Intelligent Aquaculture Management
            </p>
          </div>
        </div>

        {/* Status och information */}
        <div className="flex items-center space-x-8">
          {/* System status */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success pulse"></div>
            <span className="text-sm font-medium text-success">SYSTEM ONLINE</span>
          </div>

          {/* Temperatur */}
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-lg font-mono text-accent">26°C</span>
          </div>

          {/* Tid */}
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            <span className="text-lg font-mono text-foreground">{currentTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;