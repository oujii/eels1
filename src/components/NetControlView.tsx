// src/components/NetControlView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Zap } from 'lucide-react';
import type { NetInfo } from './NetSelectionView';

interface NetControlViewProps {
  selectedNet: NetInfo;
  onBack: () => void;
}

const NetControlView: React.FC<NetControlViewProps> = ({ selectedNet, onBack }) => {
  // State för effektreglage
  const [powerWinchA, setPowerWinchA] = useState(0);
  const [powerWinchB, setPowerWinchB] = useState(0);
  
  // State för nätposition och djup
  const [currentDepth, setCurrentDepth] = useState(5); // Börja med nätet 5 meter ner från toppen
  const [netPosition, setNetPosition] = useState(10); // Position i procent (0 = ovanför bassängen, 100 = i bassängen)
  const [netHorizontalOffset, setNetHorizontalOffset] = useState(30); // Horisontell offset i procent från centrum (positiv = höger)
  
  // State för vinschbelastning och system
  const [winchLoad, setWinchLoad] = useState(0);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isEmergencyPressed, setIsEmergencyPressed] = useState(false);
  const [emergencyProgress, setEmergencyProgress] = useState(0);
  
  // State för knappaktivering
  const [isUpButtonActive, setIsUpButtonActive] = useState(false);
  const [isDownButtonActive, setIsDownButtonActive] = useState(false);
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(false);
  const [isRightButtonActive, setIsRightButtonActive] = useState(false);
  
  // Refs för timers
  const emergencyPressTimer = useRef<NodeJS.Timeout | null>(null);
  const emergencyProgressTimer = useRef<NodeJS.Timeout | null>(null);
  const emergencyOperationTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Konstanter
  const MAX_DEPTH = selectedNet.maxDepth || 50; // meter
  const STEP_SIZE_BASE = 0.0625; // Halverad hastighet - ännu långsammare nedsänkning
  const HORIZONTAL_STEP_SIZE = 0.5; // Horisontell stegstorlek i procent
  const MAX_HORIZONTAL_OFFSET = 30; // Max horisontell offset i procent
  const EMERGENCY_HOLD_TIME = 1500; // ms
  const EMERGENCY_SPEED = 10; // meter per sekund
  
  // Beräkna effektiv stegstorlek baserat på effektreglage
  const getEffectiveStepSize = () => {
    const avgPower = (powerWinchA + powerWinchB) / 2;
    const multiplier = 1 + (avgPower / 100) * 4; // 1x till 5x hastighet
    return STEP_SIZE_BASE * multiplier;
  };
  
  // Beräkna vinschbelastning baserat på effekt och rörelse
  const calculateWinchLoad = () => {
    const avgPower = (powerWinchA + powerWinchB) / 2;
    const baseLoad = avgPower * 0.8; // Grundbelastning från effekt
    return Math.min(100, baseLoad);
  };
  
  // Uppdatera vinschbelastning när effekt ändras
  useEffect(() => {
    if (!isEmergencyMode) {
      setWinchLoad(calculateWinchLoad());
    }
  }, [powerWinchA, powerWinchB, isEmergencyMode]);
  
  // Initialisera nätposition baserat på startdjup
  useEffect(() => {
    setNetPosition((currentDepth / MAX_DEPTH) * 100);
  }, []);
  
  // Hantera manuell stegvis rörelse
  const handleManualStep = (direction: 'down' | 'up' | 'left' | 'right') => {
    if (isEmergencyMode) return;
    
    if (direction === 'down' || direction === 'up') {
      const stepSize = getEffectiveStepSize();
      const newDepth = direction === 'down' 
        ? Math.min(currentDepth + stepSize, MAX_DEPTH)
        : Math.max(currentDepth - stepSize, 0);
      
      setCurrentDepth(newDepth);
      setNetPosition((newDepth / MAX_DEPTH) * 100);
    } else if (direction === 'left' || direction === 'right') {
      const newOffset = direction === 'right'
        ? Math.min(netHorizontalOffset + HORIZONTAL_STEP_SIZE, MAX_HORIZONTAL_OFFSET)
        : Math.max(netHorizontalOffset - HORIZONTAL_STEP_SIZE, -MAX_HORIZONTAL_OFFSET);
      
      setNetHorizontalOffset(newOffset);
    }
    
    // Tillfällig belastningsökning vid rörelse
    const tempLoad = Math.min(100, calculateWinchLoad() + 20);
    setWinchLoad(tempLoad);
    
    // Återgå till normal belastning efter kort tid
    setTimeout(() => {
      if (!isEmergencyMode) {
        setWinchLoad(calculateWinchLoad());
      }
    }, 300);
  };
  
  // Hantera nödknapp - start
  const handleEmergencyStart = () => {
    if (isEmergencyMode || currentDepth >= MAX_DEPTH) return;
    
    setIsEmergencyPressed(true);
    setEmergencyProgress(0);
    
    // Starta progress timer
    emergencyProgressTimer.current = setInterval(() => {
      setEmergencyProgress(prev => {
        const newProgress = prev + (100 / (EMERGENCY_HOLD_TIME / 50));
        if (newProgress >= 100) {
          startEmergencyOperation();
          return 100;
        }
        return newProgress;
      });
    }, 50);
    
    // Sätt huvudtimer för aktivering
    emergencyPressTimer.current = setTimeout(() => {
      startEmergencyOperation();
    }, EMERGENCY_HOLD_TIME);
  };
  
  // Hantera nödknapp - stopp
  const handleEmergencyStop = () => {
    setIsEmergencyPressed(false);
    setEmergencyProgress(0);
    
    if (emergencyPressTimer.current) {
      clearTimeout(emergencyPressTimer.current);
      emergencyPressTimer.current = null;
    }
    
    if (emergencyProgressTimer.current) {
      clearInterval(emergencyProgressTimer.current);
      emergencyProgressTimer.current = null;
    }
  };
  
  // Starta nödsänkning
  const startEmergencyOperation = () => {
    setIsEmergencyMode(true);
    setIsEmergencyPressed(false);
    setEmergencyProgress(0);
    setWinchLoad(100);
    
    // Rensa timers
    if (emergencyPressTimer.current) clearTimeout(emergencyPressTimer.current);
    if (emergencyProgressTimer.current) clearInterval(emergencyProgressTimer.current);
    
    // Starta kontinuerlig snabb sänkning
    emergencyOperationTimer.current = setInterval(() => {
      setCurrentDepth(prevDepth => {
        const newDepth = Math.min(prevDepth + (EMERGENCY_SPEED / 10), MAX_DEPTH);
        setNetPosition((newDepth / MAX_DEPTH) * 100);
        
        if (newDepth >= MAX_DEPTH) {
          // Nödsänkning klar
          setIsEmergencyMode(false);
          setWinchLoad(calculateWinchLoad());
          if (emergencyOperationTimer.current) {
            clearInterval(emergencyOperationTimer.current);
            emergencyOperationTimer.current = null;
          }
        }
        
        return newDepth;
      });
    }, 100);
  };
  
  // Cleanup vid unmount
  useEffect(() => {
    return () => {
      if (emergencyPressTimer.current) clearTimeout(emergencyPressTimer.current);
      if (emergencyProgressTimer.current) clearInterval(emergencyProgressTimer.current);
      if (emergencyOperationTimer.current) clearInterval(emergencyOperationTimer.current);
    };
  }, []);
  
  // Färgfunktioner för sliders
  const getSliderColor = (value: number) => {
    if (value === 100) return 'bg-red-500';
    if (value > 75) return 'bg-orange-500';
    if (value > 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };
  
  const getSliderTrackColor = (value: number) => {
    if (value === 100) return 'bg-gradient-to-t from-red-500 to-red-400';
    if (value > 75) return 'bg-gradient-to-t from-orange-500 to-orange-400';
    if (value > 50) return 'bg-gradient-to-t from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-t from-blue-500 to-blue-400';
  };
  
  // Vinschbelastning färg
  const getWinchLoadColor = () => {
    if (isEmergencyMode) return 'bg-red-600 animate-pulse';
    if (winchLoad > 80) return 'bg-red-500';
    if (winchLoad > 60) return 'bg-orange-500';
    if (winchLoad > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-4 md:p-6 bg-gray-800/60 backdrop-blur-lg rounded-lg shadow-2xl h-full flex flex-col text-slate-100 select-none" style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-sky-300">Matning: {selectedNet.name}</h2>
        <button 
          onClick={onBack} 
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors duration-200 text-sm"
        >
          ← Tillbaka till val
        </button>
      </div>

      {/* Huvudlayout - Tre kolumner */}
      <div className="flex-grow grid grid-cols-3 gap-6 h-full">
        
        {/* VÄNSTERPANEL - TOM (eller framtida innehåll) */}
        <div className="bg-slate-900/70 p-4 rounded-lg shadow-inner flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-sky-200 text-center">Övrig Info</h3>
          {/* Placeholder för framtida innehåll i vänsterpanelen */}
          <div className="flex-grow text-slate-300 text-sm space-y-3">
            <p><span className="font-semibold text-sky-100">Senaste inspektion:</span> 2024-07-15</p>
               <p><span className="font-semibold text-sky-100">Nästa service:</span> 2024-10-01</p>
               <p><span className="font-semibold text-sky-100">Vattenkvalitet:</span> Godkänd (pH 7.2, Temp 18°C)</p>
               <p><span className="font-semibold text-sky-100">Syrenivå:</span> 95%</p>
              <p><span className="font-semibold text-sky-100">Noteringar:</span> Allt ser bra ut. Lätt algbildning på norra sidan.</p>
            </div>
          {/* Matningsdata Sektion Flyttad Hit */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-sky-200">Matningsdata</h3>
            <div className="space-y-4">
              {/* Biomassa */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Biomassa</span>
                  <span className="text-white">4.2 ton</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '70%' }} />
                </div>
              </div>
              {/* Tillväxt */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Tillväxt</span>
                  <span className="text-white">2.1%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '85%' }} />
                </div>
              </div>
              {/* Foderintag */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Foderintag</span>
                  <span className="text-white">92 kg</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MITTENPANEL - Nätvisualisering och Manövrering */}
        <div className="bg-slate-900/70 p-4 rounded-lg shadow-inner flex flex-col">
          {/* Upp-pil */}
           <div className="flex justify-center mb-4">
             <button
               onClick={() => handleManualStep('up')}
               onMouseDown={() => setIsUpButtonActive(true)}
               onMouseUp={() => setIsUpButtonActive(false)}
               onMouseLeave={() => setIsUpButtonActive(false)}
               disabled={isEmergencyMode || currentDepth <= 0}
               className={`w-188 h-16 ${isUpButtonActive ? 'bg-blue-600' : 'bg-slate-700'} hover:bg-slate-600 disabled:bg-slate-500 text-white rounded-lg flex items-center justify-center shadow-md transition-all duration-200 disabled:opacity-50`}
             >
               <ChevronUp size={32} />
             </button>
           </div>
          
          {/* Bassäng och nät visualisering med horisontella pilar */}
          <div className="flex-grow relative flex items-center justify-center overflow-hidden">
            {/* Vänster pil */}
             <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30">
               <button
                 onClick={() => handleManualStep('left')}
                 onMouseDown={() => setIsLeftButtonActive(true)}
                 onMouseUp={() => setIsLeftButtonActive(false)}
                 onMouseLeave={() => setIsLeftButtonActive(false)}
                 disabled={isEmergencyMode || netHorizontalOffset <= -MAX_HORIZONTAL_OFFSET}
                 className={`w-16 h-128 ${isLeftButtonActive ? 'bg-blue-600' : 'bg-slate-700'} hover:bg-slate-600 disabled:bg-slate-500 text-white rounded-lg flex items-center justify-center shadow-md transition-all duration-200 disabled:opacity-50`}
               >
                 <ChevronUp size={32} className="transform -rotate-90" />
               </button>
             </div>
            
            {/* Höger pil */}
             <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30">
               <button
                 onClick={() => handleManualStep('right')}
                 onMouseDown={() => setIsRightButtonActive(true)}
                 onMouseUp={() => setIsRightButtonActive(false)}
                 onMouseLeave={() => setIsRightButtonActive(false)}
                 disabled={isEmergencyMode || netHorizontalOffset >= MAX_HORIZONTAL_OFFSET}
                 className={`w-16 h-128 ${isRightButtonActive ? 'bg-blue-600' : 'bg-slate-700'} hover:bg-slate-600 disabled:bg-slate-500 text-white rounded-lg flex items-center justify-center shadow-md transition-all duration-200 disabled:opacity-50`}
               >
                 <ChevronUp size={32} className="transform rotate-90" />
               </button>
             </div>
            
            <div className="relative w-full h-full max-w-md flex flex-col">
              {/* Rep/Kabel från toppen */}
              <div className="absolute w-1 bg-slate-400 z-10 transition-all duration-200 ease-linear"
                   style={{ 
                     left: `calc(50% + ${netHorizontalOffset}%)`,
                     transform: 'translateX(-50%)',
                     top: '5%',
                     height: `${10 + (netPosition * 0.65)}%`
                   }}>
              </div>
              
              {/* Nät som rör sig vertikalt och horisontellt */}
              <div 
                className="absolute transition-all duration-200 ease-linear z-20"
                style={{ 
                  left: `calc(50% + ${netHorizontalOffset}%)`,
                  transform: 'translateX(-50%)',
                  top: `${10 + (netPosition * 0.65)}%`,
                  width: '40%',
                  clipPath: (() => {
                    // Bassängen börjar vid 70% av höjden (100% - 30% höjd)
                    const basinTopPercent = 70;
                    // Beräkna nätets nuvarande position i procent
                    const netTopPercent = 10 + (netPosition * 0.65);
                    // Om nätet når bassängkanten, klipp av den del som går in i bassängen
                    if (netTopPercent + 15 > basinTopPercent) { // 15% är ungefär nätets höjd
                      const overlapPercent = ((netTopPercent + 15 - basinTopPercent) / 15) * 100;
                      return `inset(0 0 ${Math.min(100, Math.max(0, overlapPercent))}% 0)`;
                    }
                    return 'none';
                  })()
                }}
              >
                <img 
                  src="/netisolated.png" 
                  alt="Nät" 
                  className={`w-full h-auto object-contain ${isEmergencyMode ? 'filter brightness-75 contrast-125' : ''}`}
                />
              </div>
              
              {/* Bassäng placerad längst ner - cirkulär/elliptisk form */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2" style={{ width: '70%', height: '30%' }}>
                <img 
                  src="/basinisolated.png" 
                  alt="Bassäng" 
                  className="w-full h-full object-contain rounded-full"
                  style={{ aspectRatio: '1.2/1' }}
                />
              </div>
            </div>
            
            {/* Djupindikator */}
            <div className="absolute top-4 left-4 bg-slate-800/80 p-2 rounded-lg">
              <div className="text-xs text-slate-300">Aktuellt Djup</div>
              <div className="text-lg font-bold text-sky-300">{currentDepth.toFixed(1)}m</div>
              <div className="text-xs text-slate-400">av {MAX_DEPTH}m</div>
            </div>
            
            {/* Horisontell positionsindikator */}
            <div className="absolute top-4 right-4 bg-slate-800/80 p-2 rounded-lg">
              <div className="text-xs text-slate-300">Horisontell Pos</div>
              <div className="text-lg font-bold text-sky-300">{netHorizontalOffset > 0 ? '+' : ''}{netHorizontalOffset.toFixed(0)}%</div>
              <div className="text-xs text-slate-400">från centrum</div>
            </div>
          </div>
          
          {/* Ner-pil */}
           <div className="flex justify-center mt-4">
             <button
               onClick={() => handleManualStep('down')}
               onMouseDown={() => setIsDownButtonActive(true)}
               onMouseUp={() => setIsDownButtonActive(false)}
               onMouseLeave={() => setIsDownButtonActive(false)}
               disabled={isEmergencyMode || currentDepth >= MAX_DEPTH}
               className={`w-188 h-16 ${isDownButtonActive ? 'bg-blue-600' : 'bg-slate-700'} hover:bg-slate-600 disabled:bg-slate-500 text-white rounded-lg flex items-center justify-center shadow-md transition-all duration-200 disabled:opacity-50`}
             >
               <ChevronDown size={32} />
             </button>
           </div>
        </div>

        {/* HÖGERPANEL - Status och Nödsystem */}
        <div className="bg-slate-900/70 p-4 rounded-lg shadow-inner flex flex-col">
          {/* Status sektion */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-sky-200">Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Valt Nät:</span>
                <span className="text-white font-medium">{selectedNet.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Aktuellt Djup:</span>
                <span className="text-white font-medium">{currentDepth.toFixed(1)}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Max Djup:</span>
                <span className="text-white font-medium">{MAX_DEPTH}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Systemstatus:</span>
                <span className={`font-medium ${isEmergencyMode ? 'text-red-400' : 'text-green-400'}`}>
                  {isEmergencyMode ? 'NÖDLÄGE' : 'NORMAL'}
                </span>
              </div>
            </div>
          </div>

          {/* Vinschbelastning */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-sky-200">Vinschbelastning</h3>
            <div className="relative">
              <div className="w-full h-32 bg-slate-600 rounded-lg overflow-hidden relative">
                <div 
                  className={`absolute bottom-0 w-full transition-all duration-300 ${getWinchLoadColor()}`}
                  style={{ height: `${winchLoad}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-white font-bold text-lg drop-shadow-lg" style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)'
                  }}>{winchLoad.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Effektreglage */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-sky-200 text-center">Effektreglage</h3>
            <div className="flex-grow flex justify-around items-stretch gap-4">
              {/* Vinsch A Slider */}
              <div className="flex flex-col items-center flex-1">
                <label className="text-sm font-medium mb-2 text-slate-300">Effekt Vinsch A</label>
                <div className="flex-grow flex flex-col items-center justify-center relative w-20">
                  {/* Minimalistisk fylld stapel - dubbelt så bred design */}
                  <div 
                    className="w-20 h-80 bg-slate-700 rounded-sm relative overflow-hidden cursor-pointer border border-slate-500"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const y = e.clientY - rect.top;
                      const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
                      setPowerWinchA(Math.round(percentage));
                    }}
                    onMouseMove={(e) => {
                      if (e.buttons === 1) { // Om vänster musknapp är nedtryckt
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = e.clientY - rect.top;
                        const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
                        setPowerWinchA(Math.round(percentage));
                      }
                    }}
                  >
                    {/* Fylld del - från botten och uppåt med gradvis färgövergång */}
                    <div 
                      className={`absolute bottom-0 w-full transition-all duration-150 ease-out shadow-lg`}
                      style={{ 
                        height: `${powerWinchA}%`,
                        background: powerWinchA >= 50 
                          ? `linear-gradient(to top, 
                              ${powerWinchA >= 75 ? '#ef4444' : '#f97316'} 0%, 
                              ${powerWinchA >= 90 ? '#dc2626' : powerWinchA >= 75 ? '#ea580c' : '#0ea5e9'} 100%)`
                          : '#0ea5e9',
                        boxShadow: powerWinchA >= 75 
                          ? '0 0 20px rgba(239, 68, 68, 0.5)' 
                          : '0 0 15px rgba(14, 165, 233, 0.3)'
                      }}
                    />
                    {/* Invisible input för tangentbord/tillgänglighet */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={powerWinchA}
                      onChange={(e) => setPowerWinchA(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ transform: 'rotate(-90deg)', WebkitAppearance: 'slider-vertical' }}
                    />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className={`text-lg font-bold ${powerWinchA >= 75 ? 'text-red-400' : powerWinchA >= 50 ? 'text-orange-400' : 'text-white'}`}>
                    {powerWinchA}%
                  </span>
                </div>
              </div>
              
              {/* Vinsch B Slider */}
              <div className="flex flex-col items-center flex-1">
                <label className="text-sm font-medium mb-2 text-slate-300">Effekt Vinsch B</label>
                <div className="flex-grow flex flex-col items-center justify-center relative w-20">
                  {/* Minimalistisk fylld stapel - dubbelt så bred design */}
                  <div 
                    className="w-20 h-80 bg-slate-700 rounded-sm relative overflow-hidden cursor-pointer border border-slate-500"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const y = e.clientY - rect.top;
                      const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
                      setPowerWinchB(Math.round(percentage));
                    }}
                    onMouseMove={(e) => {
                      if (e.buttons === 1) { // Om vänster musknapp är nedtryckt
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = e.clientY - rect.top;
                        const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
                        setPowerWinchB(Math.round(percentage));
                      }
                    }}
                  >
                    {/* Fylld del - från botten och uppåt med gradvis färgövergång */}
                    <div 
                      className={`absolute bottom-0 w-full transition-all duration-150 ease-out shadow-lg`}
                      style={{ 
                        height: `${powerWinchB}%`,
                        background: powerWinchB >= 50 
                          ? `linear-gradient(to top, 
                              ${powerWinchB >= 75 ? '#ef4444' : '#f97316'} 0%, 
                              ${powerWinchB >= 90 ? '#dc2626' : powerWinchB >= 75 ? '#ea580c' : '#0ea5e9'} 100%)`
                          : '#0ea5e9',
                        boxShadow: powerWinchB >= 75 
                          ? '0 0 20px rgba(239, 68, 68, 0.5)' 
                          : '0 0 15px rgba(14, 165, 233, 0.3)'
                      }}
                    />
                    {/* Invisible input för tangentbord/tillgänglighet */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={powerWinchB}
                      onChange={(e) => setPowerWinchB(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ transform: 'rotate(-90deg)', WebkitAppearance: 'slider-vertical' }}
                    />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className={`text-lg font-bold ${powerWinchB >= 75 ? 'text-red-400' : powerWinchB >= 50 ? 'text-orange-400' : 'text-white'}`}>
                    {powerWinchB}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nödsystem */}
          <div className="mt-auto">
            <h3 className="text-lg font-semibold mb-2 text-red-400 flex items-center">
              <AlertTriangle size={20} className="mr-2 text-red-500"/>
              Nödsystem
            </h3>
            
            <button 
              onMouseDown={handleEmergencyStart}
              onMouseUp={handleEmergencyStop}
              onMouseLeave={handleEmergencyStop}
              onTouchStart={handleEmergencyStart}
              onTouchEnd={handleEmergencyStop}
              disabled={isEmergencyMode || currentDepth >= MAX_DEPTH}
              className={`w-full h-16 font-bold rounded-lg transition-all duration-200 shadow-xl focus:outline-none relative overflow-hidden ${
                isEmergencyPressed 
                  ? 'bg-yellow-500 text-slate-900' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              } disabled:bg-slate-500 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isEmergencyPressed && (
                <div className="absolute inset-0 bg-yellow-300/50 animate-pulse"></div>
              )}
              
              <div className="relative z-10 flex items-center justify-center">
                <Zap size={22} className="mr-2" />
                <span className="text-sm">
                  {isEmergencyPressed ? 'AKTIVERAR...' : 'NÖDSÄNKNING'}
                </span>
              </div>
              
              <div className="relative z-10 text-xs mt-1">
                (HÅLL IN)
              </div>
            </button>
            
            {/* Progress bar för nödknapp */}
            {isEmergencyPressed && (
              <div className="w-full bg-slate-600 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className="bg-yellow-400 h-full rounded-full transition-all duration-75 ease-linear"
                  style={{ width: `${emergencyProgress}%` }}
                />
              </div>
            )}
            
            {/* Nödläge indikator */}
            {isEmergencyMode && (
              <div className="mt-2 p-2 bg-red-600/20 border border-red-500 rounded-lg">
                <div className="text-red-400 text-sm font-bold text-center animate-pulse">
                  NÖDSÄNKNING AKTIV
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetControlView;