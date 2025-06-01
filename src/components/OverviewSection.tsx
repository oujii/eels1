'use client';

import React, { useState, useEffect } from 'react';
import FeedingPanel from './FeedingPanel';

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
          stroke="rgba(255, 255, 255, 0.1)"
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
          <div className="text-3xl font-bold text-accent">{percentage}%</div>
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
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Systemöversikt</h3>
          <div className="flex justify-center">
            <CircularProgress percentage={progress} size={160} strokeWidth={8} />
          </div>
        </div>

        {/* Total Output */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Total Produktion</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-accent">2,847</span>
            <span className="text-lg text-secondary">kg</span>
          </div>
          <div className="text-sm text-secondary mt-1">Denna månad</div>
          <div className="flex items-center mt-3">
            <div className="flex-1 bg-secondary/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-accent to-success h-2 rounded-full" style={{width: '73%'}}></div>
            </div>
            <span className="ml-3 text-sm text-secondary">73% av mål</span>
          </div>
        </div>

        {/* Active Basins */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Aktiva Bassänger</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-accent">6</span>
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

      {/* Matningskontroll */}
      <FeedingPanel />

      {/* Nödstoppspanel */}
      <div className="glass rounded-2xl p-6 border-2 border-error/50">
        <h3 className="text-lg font-semibold text-error mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Nödstopp
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-error hover:bg-error/80 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg">
            STOPP ALLA
          </button>
          <button className="bg-warning hover:bg-warning/80 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg">
            PAUSA SYSTEM
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;