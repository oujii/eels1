'use client';

import { useState, useEffect } from 'react';

interface MeasurementProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimal: [number, number];
  icon: React.ReactNode;
}

const Measurement = ({ label, value, unit, min, max, optimal, icon }: MeasurementProps) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const isOptimal = value >= optimal[0] && value <= optimal[1];
  const isWarning = value < optimal[0] * 0.9 || value > optimal[1] * 1.1;
  const isCritical = value < optimal[0] * 0.8 || value > optimal[1] * 1.2;

  const getStatusColor = () => {
    if (isCritical) return 'text-error';
    if (isWarning) return 'text-warning';
    return 'text-success';
  };

  const getBarColor = () => {
    if (isCritical) return 'bg-error';
    if (isWarning) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="glass rounded-xl p-4 glow-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-accent">{icon}</div>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${
          isOptimal ? 'bg-success/20 text-success' : 
          isWarning ? 'bg-warning/20 text-warning' : 
          'bg-error/20 text-error'
        }`}>
          {isOptimal ? 'OPTIMAL' : isWarning ? 'VARNING' : 'KRITISK'}
        </div>
      </div>
      
      <div className="flex items-baseline space-x-1 mb-3">
        <span className={`text-2xl font-bold font-mono ${getStatusColor()}`}>
          {value.toFixed(1)}
        </span>
        <span className="text-sm text-secondary">{unit}</span>
      </div>
      
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${getBarColor()}`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        ></div>
        {/* Optimal range indicator */}
        <div 
          className="absolute top-0 h-full bg-white/30 rounded-full"
          style={{ 
            left: `${((optimal[0] - min) / (max - min)) * 100}%`,
            width: `${((optimal[1] - optimal[0]) / (max - min)) * 100}%`
          }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-secondary mt-2">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

const StatusPanel = () => {
  const [measurements, setMeasurements] = useState({
    temperature: 26.2,
    ph: 7.4,
    oxygen: 8.5,
    ammonia: 0.15,
    nitrite: 0.05,
    nitrate: 12.3
  });

  // Simulera realtidsdata
  useEffect(() => {
    const interval = setInterval(() => {
      setMeasurements(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 0.2,
        ph: prev.ph + (Math.random() - 0.5) * 0.1,
        oxygen: prev.oxygen + (Math.random() - 0.5) * 0.3,
        ammonia: Math.max(0, prev.ammonia + (Math.random() - 0.5) * 0.02),
        nitrite: Math.max(0, prev.nitrite + (Math.random() - 0.5) * 0.01),
        nitrate: Math.max(0, prev.nitrate + (Math.random() - 0.5) * 0.5)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Huvudstatus */}
      <div className="glass rounded-2xl p-6 glow-border">
        <h3 className="text-xl font-bold text-accent glow mb-6">Systemstatus</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Temperatur */}
          <Measurement
            label="Temperatur"
            value={measurements.temperature}
            unit="°C"
            min={20}
            max={30}
            optimal={[25, 27]}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          
          {/* pH */}
          <Measurement
            label="pH-värde"
            value={measurements.ph}
            unit=""
            min={6}
            max={9}
            optimal={[7.2, 7.6]}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Vattenkvalitet */}
      <div className="glass rounded-2xl p-6 glow-border">
        <h3 className="text-xl font-bold text-accent glow mb-6">Vattenkvalitet</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Syre */}
          <Measurement
            label="Syre (O₂)"
            value={measurements.oxygen}
            unit="mg/L"
            min={0}
            max={15}
            optimal={[7, 10]}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12h8"></path>
              </svg>
            }
          />
          
          {/* Ammoniak */}
          <Measurement
            label="Ammoniak (NH₃)"
            value={measurements.ammonia}
            unit="mg/L"
            min={0}
            max={1}
            optimal={[0, 0.2]}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
          />
          
          {/* Nitrit */}
          <Measurement
            label="Nitrit (NO₂)"
            value={measurements.nitrite}
            unit="mg/L"
            min={0}
            max={0.5}
            optimal={[0, 0.1]}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          
          {/* Nitrat */}
          <Measurement
            label="Nitrat (NO₃)"
            value={measurements.nitrate}
            unit="mg/L"
            min={0}
            max={50}
            optimal={[0, 20]}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;