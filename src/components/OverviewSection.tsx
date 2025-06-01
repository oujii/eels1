'use client';

import { useState, useEffect } from 'react';

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
}

const CircularProgress = ({ percentage, size, strokeWidth }: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(74, 144, 226, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7fbfff" />
            <stop offset="100%" stopColor="#00ff88" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-accent glow">{percentage}%</div>
          <div className="text-sm text-secondary">Komplett</div>
        </div>
      </div>
    </div>
  );
};

const OverviewSection = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(90), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Översiktskort */}
      <div className="grid grid-cols-1 gap-4">
        {/* Progress Ring */}
        <div className="glass rounded-2xl p-6 glow-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Systemöversikt</h3>
          <div className="flex justify-center">
            <CircularProgress percentage={progress} size={160} strokeWidth={8} />
          </div>
        </div>

        {/* Total Output */}
        <div className="glass rounded-2xl p-6 glow-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground">Total Produktion</h3>
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-success glow mb-1">4,520</div>
          <div className="text-sm text-secondary">kg denna månad</div>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden shimmer">
            <div className="h-full bg-gradient-to-r from-success to-accent w-3/4 rounded-full"></div>
          </div>
        </div>

        {/* Aktiva Bassänger */}
        <div className="glass rounded-2xl p-6 glow-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground">Aktiva Bassänger</h3>
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-accent glow">6</span>
            <span className="text-xl text-secondary">/</span>
            <span className="text-xl text-secondary">6</span>
          </div>
          <div className="text-sm text-secondary mt-1">Alla system operativa</div>
          <div className="flex space-x-1 mt-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-1 h-2 bg-success rounded-full pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Nödstoppspanel */}
      <div className="glass rounded-2xl p-6 border-2 border-error/50">
        <h3 className="text-lg font-semibold text-error mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Nödstopp
        </h3>
        <div className="space-y-3">
          <button className="w-full touch-target bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-error text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 glow-border">
            STOPP ALLA SYSTEM
          </button>
          <button className="w-full touch-target bg-gradient-to-r from-warning to-orange-600 hover:from-orange-600 hover:to-warning text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95">
            STOPP MATNING
          </button>
          <button className="w-full touch-target bg-gradient-to-r from-blue-600 to-accent hover:from-accent hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95">
            STOPP PUMPAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;