'use client';

import React, { useState } from 'react';

interface FeedingParameterProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  icon: React.ReactNode;
  onChange: (value: number) => void;
}

const FeedingParameter = ({ label, value, unit, min, max, step, icon, onChange }: FeedingParameterProps) => {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-accent">{icon}</div>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button
          onClick={handleDecrease}
          disabled={value <= min}
          className="w-10 h-10 rounded-full bg-accent/20 hover:bg-accent/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold font-mono text-accent">
            {value.toFixed(step < 1 ? 1 : 0)}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        
        <button
          onClick={handleIncrease}
          disabled={value >= max}
          className="w-10 h-10 rounded-full bg-accent/20 hover:bg-accent/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-accent rounded-full h-2 transition-all duration-300"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

interface FeedTypeProps {
  types: string[];
  selectedType: string;
  onChange: (type: string) => void;
}

const FeedTypeSelector = ({ types, selectedType, onChange }: FeedTypeProps) => {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="text-accent">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <span className="text-sm font-medium text-foreground">Fodertyp</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              selectedType === type
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

const FeedingPanel = () => {
  const [feedingParams, setFeedingParams] = useState({
    amount: 2.5,
    frequency: 3,
    duration: 15,
    feedType: 'Pellets 3mm'
  });

  const feedTypes = ['Pellets 3mm', 'Pellets 5mm', 'Flakes', 'Frozen'];

  const updateParam = (param: string, value: number | string) => {
    setFeedingParams(prev => ({ ...prev, [param]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Matningskontroll</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Aktiv</span>
        </div>
      </div>

      {/* Feeding Parameters */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-accent mb-6">Matningsparametrar</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Amount */}
          <FeedingParameter
            label="Mängd per matning"
            value={feedingParams.amount}
            unit="kg"
            min={0.5}
            max={10}
            step={0.5}
            onChange={(value) => updateParam('amount', value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-3m-3 3l-3-3" />
              </svg>
            }
          />
          
          {/* Frequency */}
          <FeedingParameter
            label="Frekvens per dag"
            value={feedingParams.frequency}
            unit="gånger"
            min={1}
            max={8}
            step={1}
            onChange={(value) => updateParam('frequency', value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            }
          />
          
          {/* Duration */}
          <FeedingParameter
            label="Matningstid"
            value={feedingParams.duration}
            unit="min"
            min={5}
            max={60}
            step={5}
            onChange={(value) => updateParam('duration', value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          {/* Feed Type */}
          <FeedTypeSelector
            types={feedTypes}
            selectedType={feedingParams.feedType}
            onChange={(type) => updateParam('feedType', type)}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-accent mb-6">Snabbåtgärder</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="glass rounded-xl p-4 hover:bg-accent/10 transition-colors group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center group-hover:bg-success/30 transition-colors">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">Starta matning</div>
                <div className="text-xs text-muted-foreground">Manuell aktivering</div>
              </div>
            </div>
          </button>
          
          <button className="glass rounded-xl p-4 hover:bg-accent/10 transition-colors group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center group-hover:bg-warning/30 transition-colors">
                <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">Pausa matning</div>
                <div className="text-xs text-muted-foreground">Tillfälligt stopp</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedingPanel;